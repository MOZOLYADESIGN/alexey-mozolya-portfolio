import {
  addExperience,
  addSteps,
  applyFieldEdit,
  assertSafeContent,
  editableFields,
  findEditableField,
  formatDiff,
  getFieldValue,
  removeExperience,
  validatePlainValue,
} from "./content.ts";
import { MAX_UPDATE_BYTES, RATE_LIMIT_PER_MINUTE, constantTimeEqual, getUpdateIdentity, parseAllowedUserIds, safeAuditDetail } from "./security.ts";
import type { AuditEvent, CmsEnvironment, CmsSession, GitHubPort, InlineButton, StatePort, TelegramPort, TelegramUpdate } from "./types.ts";

type Section = "hero" | "experience" | "about" | "contacts";

interface CmsDependencies {
  env: CmsEnvironment;
  github: GitHubPort;
  telegram: TelegramPort;
  state: StatePort;
  now?: () => Date;
  fetcher?: typeof fetch;
}

const helpText = `Telegram CMS — доступные команды:
/status — production, ветка и CI
/show [hero|experience|about|contacts] — показать контент
/edit [разрешённое.поле] — изменить текст через черновик
/add — добавить проект по шагам
/remove <id> — удалить проект с подтверждением
/preview — PR, diff и CI
/publish — запросить финальное подтверждение публикации
/history — история контентных коммитов
/rollback <полный SHA> — подготовить откат как новый PR
/cancel — удалить текущий черновик
/help — эта справка`;

function sectionKeyboard(prefix: "show" | "section"): InlineButton[][] {
  return [
    [{ text: "Баннер", callback_data: `${prefix}:hero` }, { text: "Опыт", callback_data: `${prefix}:experience` }],
    [{ text: "Обо мне", callback_data: `${prefix}:about` }, { text: "Контакты", callback_data: `${prefix}:contacts` }],
  ];
}

function rows(buttons: InlineButton[], size = 2) {
  const result: InlineButton[][] = [];
  for (let index = 0; index < buttons.length; index += size) result.push(buttons.slice(index, index + size));
  return result;
}

function parseCommand(text: string) {
  const [rawName, ...rest] = text.trim().split(/\s+/);
  return { name: rawName?.toLowerCase().replace(/@[^\s]+$/, "") ?? "", argument: rest.join(" ").trim() };
}

function isSection(value: string): value is Section {
  return ["hero", "experience", "about", "contacts"].includes(value);
}

function summarizeSection(section: Section, content: Awaited<ReturnType<GitHubPort["getContent"]>>["content"]) {
  if (section === "experience") {
    const items = content.experience.items.map((item) => `• ${item.id}: ${item.title} (${item.timeline.start} — ${item.timeline.end})`).join("\n");
    return `${content.experience.label}\n${content.experience.summaryYears}\n${content.experience.summaryText}\n\n${items}`;
  }
  if (section === "hero") return `${content.hero.greeting} ${content.hero.name}\n\n${content.hero.descriptions.join("\n\n")}\n\n${content.hero.meta.join(" · ")}`;
  if (section === "about") return `${content.about.label}\n\n${content.about.paragraphs.join("\n\n")}\n\n${content.about.noteLines.join("\n")}`;
  return `${content.contacts.label}\n${content.contacts.ctaLines.join(" ")}\n${content.contacts.telegram.label}: ${content.contacts.telegram.url}\n${content.contacts.email.label}: ${content.contacts.email.address}\n${content.contacts.copyright}`;
}

function changeSummary(kind: "add" | "remove" | "rollback", value: string) {
  const labels = { add: "Добавление проекта", remove: "Удаление проекта", rollback: "Откат контента" };
  return `${labels[kind]}\n\n− текущее состояние\n+ ${value}`;
}

export function createCmsApp(dependencies: CmsDependencies) {
  const { env, github, telegram, state } = dependencies;
  const now = dependencies.now ?? (() => new Date());
  const fetcher = dependencies.fetcher ?? fetch;
  const allowedUserIds = parseAllowedUserIds(env.TELEGRAM_ALLOWED_USER_IDS);

  async function audit(userId: number, action: string, outcome: AuditEvent["outcome"], detail: unknown) {
    await state.audit({ at: now().toISOString(), userId, action, outcome, detail: safeAuditDetail(detail) });
  }

  async function auditSafely(userId: number, action: string, outcome: AuditEvent["outcome"], detail: unknown) {
    try {
      await audit(userId, action, outcome, detail);
    } catch {
      // Audit storage errors must not leak secrets or turn a completed update into a Telegram retry.
    }
  }

  async function beginEdit(userId: number, chatId: number, idOrPath: string) {
    const current = await github.getContent();
    const field = findEditableField(current.content, idOrPath);
    if (!field) throw new Error("Поле не входит в белый список CMS.");
    await state.setSession(userId, { mode: "await-edit", fieldId: field.id, content: current.content, baseSha: current.sha });
    await telegram.sendMessage(chatId, `Поле: ${field.label}\nСейчас: ${getFieldValue(current.content, field)}\n\nОтправьте новое значение обычным текстом или /cancel.`);
  }

  async function processSessionText(userId: number, chatId: number, text: string, session: CmsSession) {
    if (session.mode === "await-edit") {
      const field = findEditableField(session.content, session.fieldId);
      if (!field) throw new Error("Разрешённое поле больше не найдено.");
      const before = getFieldValue(session.content, field);
      const edited = applyFieldEdit(session.content, field, text);
      const diff = formatDiff(field.label, before, edited.value);
      await state.setSession(userId, { mode: "draft", pending: { kind: "edit", before: session.content, after: edited.content, baseSha: session.baseSha, diff, title: `CMS: изменить ${field.commandPath}` } });
      await telegram.sendMessage(chatId, `${diff}\n\nСоздать отдельную ветку и pull request?`, [[{ text: "Создать PR", callback_data: "draft:commit" }, { text: "Отмена", callback_data: "draft:cancel" }]]);
      return;
    }
    if (session.mode === "add") {
      const step = addSteps[session.step];
      if (!step) throw new Error("Некорректное состояние мастера добавления.");
      const value = validatePlainValue(text, step.type, step.maxLength);
      const values = { ...session.values, [step.key]: value };
      if (session.step < addSteps.length - 1) {
        const nextStep = session.step + 1;
        await state.setSession(userId, { mode: "add", step: nextStep, values });
        await telegram.sendMessage(chatId, `Шаг ${nextStep + 1}/${addSteps.length}: ${addSteps[nextStep]?.label}`);
        return;
      }
      const current = await github.getContent();
      const after = addExperience(current.content, values);
      const diff = changeSummary("add", `${values.id}: ${values.title}`);
      await state.setSession(userId, { mode: "draft", pending: { kind: "add", before: current.content, after, baseSha: current.sha, diff, title: `CMS: добавить проект ${values.id}` } });
      await telegram.sendMessage(chatId, `${diff}\n\nПроверьте данные. Создать PR?`, [[{ text: "Да, создать PR", callback_data: "draft:commit" }, { text: "Отмена", callback_data: "draft:cancel" }]]);
      return;
    }
    await telegram.sendMessage(chatId, "Сначала выберите действие: /edit, /add или /help.");
  }

  async function handleCommand(userId: number, chatId: number, text: string) {
    const { name, argument } = parseCommand(text);
    if (name === "/start" || name === "/help") {
      await telegram.sendMessage(chatId, helpText, sectionKeyboard("show"));
      return name;
    }
    if (name === "/cancel") {
      await state.clearSession(userId);
      await telegram.sendMessage(chatId, "Текущее действие и черновик отменены.");
      return name;
    }
    if (name === "/show") {
      if (!argument) await telegram.sendMessage(chatId, "Выберите раздел:", sectionKeyboard("show"));
      else {
        if (!isSection(argument)) throw new Error("Неизвестный раздел. Допустимы: hero, experience, about, contacts.");
        const current = await github.getContent();
        await telegram.sendMessage(chatId, summarizeSection(argument, current.content));
      }
      return name;
    }
    if (name === "/edit") {
      if (argument) await beginEdit(userId, chatId, argument);
      else await telegram.sendMessage(chatId, "Выберите раздел для редактирования:", sectionKeyboard("section"));
      return name;
    }
    if (name === "/add") {
      await state.setSession(userId, { mode: "add", step: 0, values: {} });
      await telegram.sendMessage(chatId, `Шаг 1/${addSteps.length}: ${addSteps[0]?.label}`);
      return name;
    }
    if (name === "/remove") {
      if (!argument) throw new Error("Укажите ID: /remove project-id");
      const current = await github.getContent();
      const after = removeExperience(current.content, argument);
      const diff = changeSummary("remove", argument);
      await state.setSession(userId, { mode: "draft", pending: { kind: "remove", before: current.content, after, baseSha: current.sha, diff, title: `CMS: удалить проект ${argument}` } });
      await telegram.sendMessage(chatId, `${diff}\n\nЭто удаление. Подтвердите создание PR:`, [[{ text: "Да, удалить через PR", callback_data: "draft:commit" }, { text: "Не удалять", callback_data: "draft:cancel" }]]);
      return name;
    }
    if (name === "/preview") {
      const session = await state.getSession(userId);
      if (session?.mode !== "draft") throw new Error("Нет подготовленного изменения.");
      const githubChange = session.pending.github;
      if (!githubChange) {
        await telegram.sendMessage(chatId, `${session.pending.diff}\n\nPR ещё не создан.`);
      } else {
        const ci = await github.getCiStatus(githubChange.commitSha);
        await telegram.sendMessage(chatId, `${session.pending.diff}\n\nPR: ${githubChange.prUrl}\nCI: ${ci}`);
      }
      return name;
    }
    if (name === "/publish") {
      const session = await state.getSession(userId);
      if (session?.mode !== "draft" || !session.pending.github) throw new Error("Нет pull request, готового к публикации.");
      const ci = await github.getCiStatus(session.pending.github.commitSha);
      if (ci !== "success") throw new Error(`Публикация заблокирована: CI ${ci}.`);
      await telegram.sendMessage(chatId, `CI PASS. Опубликовать PR #${session.pending.github.prNumber}?`, [[{ text: "Опубликовать", callback_data: "publish:confirm" }, { text: "Отмена", callback_data: "draft:cancel" }]]);
      return name;
    }
    if (name === "/history") {
      const [history, auditEvents] = await Promise.all([github.getHistory(), state.getAudit(10)]);
      const commits = history.length ? history.map((entry) => `${entry.sha} · ${entry.date}\n${entry.message}`).join("\n\n") : "История контента пуста.";
      const actions = auditEvents.length ? auditEvents.map((entry) => `${entry.at} · user:${entry.userId} · ${entry.action}/${entry.outcome}\n${entry.detail}`).join("\n\n") : "Журнал действий пуст.";
      await telegram.sendMessage(chatId, `КОММИТЫ\n${commits}\n\nДЕЙСТВИЯ\n${actions}`);
      return name;
    }
    if (name === "/rollback") {
      if (!/^[a-f0-9]{40}$/i.test(argument)) throw new Error("Укажите полный 40-символьный SHA из /history.");
      const [current, target] = await Promise.all([github.getContent(), github.getContent(argument)]);
      assertSafeContent(target.content);
      const diff = changeSummary("rollback", `состояние из ${argument}`);
      await state.setSession(userId, { mode: "draft", pending: { kind: "rollback", before: current.content, after: target.content, baseSha: current.sha, diff, title: `CMS: откатить контент к ${argument.slice(0, 12)}` } });
      await telegram.sendMessage(chatId, `${diff}\n\nОткат создаст новый коммит и PR, без force push. Продолжить?`, [[{ text: "Создать rollback PR", callback_data: "draft:commit" }, { text: "Отмена", callback_data: "draft:cancel" }]]);
      return name;
    }
    if (name === "/status") {
      const status = await github.getStatus();
      let production = "не настроен";
      if (env.PRODUCTION_URL) {
        if (!/^https:\/\//.test(env.PRODUCTION_URL)) throw new Error("PRODUCTION_URL must use HTTPS.");
        try {
          const response = await fetcher(env.PRODUCTION_URL, { method: "HEAD", redirect: "error", signal: AbortSignal.timeout(5_000) });
          production = response.ok ? `онлайн (${response.status})` : `ошибка (${response.status})`;
        } catch {
          production = "недоступен";
        }
      }
      await telegram.sendMessage(chatId, `Production: ${production}\nВетка: ${status.branch}\nHEAD: ${status.headSha}\nCI: ${status.workflow}`);
      return name;
    }
    throw new Error("Неизвестная команда. Используйте /help.");
  }

  async function handleCallback(userId: number, chatId: number, callbackId: string, data: string) {
    if (data.startsWith("show:")) {
      const section = data.slice(5);
      if (!isSection(section)) throw new Error("Некорректный раздел.");
      const current = await github.getContent();
      await telegram.sendMessage(chatId, summarizeSection(section, current.content));
    } else if (data.startsWith("section:")) {
      const section = data.slice(8);
      if (!isSection(section)) throw new Error("Некорректный раздел.");
      const current = await github.getContent();
      const buttons = editableFields(current.content).filter((field) => field.section === section).slice(0, 60).map((field) => ({ text: field.label.slice(0, 45), callback_data: `field:${field.id}` }));
      await telegram.sendMessage(chatId, buttons.length ? "Выберите поле:" : "В разделе нет редактируемых полей.", rows(buttons, 1));
    } else if (data.startsWith("field:")) {
      await beginEdit(userId, chatId, data.slice(6));
    } else if (data === "draft:cancel") {
      await state.clearSession(userId);
      await telegram.sendMessage(chatId, "Черновик отменён.");
    } else if (data === "draft:commit") {
      const session = await state.getSession(userId);
      if (session?.mode !== "draft") throw new Error("Черновик не найден.");
      if (session.pending.github) throw new Error("PR для этого черновика уже создан.");
      const change = await github.createChange(session.pending.after, session.pending.baseSha, session.pending.title);
      await state.setSession(userId, { mode: "draft", pending: { ...session.pending, github: change } });
      await telegram.sendMessage(chatId, `PR создан: ${change.prUrl}\nCI запущен. Проверка: /preview`);
    } else if (data === "publish:confirm") {
      const session = await state.getSession(userId);
      if (session?.mode !== "draft" || !session.pending.github) throw new Error("Подтверждённый PR не найден.");
      const ci = await github.getCiStatus(session.pending.github.commitSha);
      if (ci !== "success") throw new Error(`Merge заблокирован: CI ${ci}.`);
      const result = await github.mergeApprovedChange(session.pending.github);
      await state.clearSession(userId);
      await telegram.sendMessage(chatId, `Опубликовано через merge PR. Commit: ${result.mergeSha}`);
    } else {
      throw new Error("Неизвестное действие кнопки.");
    }
    await telegram.answerCallback(callbackId);
    return data;
  }

  async function handleAuthorizedUpdate(update: TelegramUpdate, userId: number, chatId: number) {
    const callback = update.callback_query;
    if (callback) return handleCallback(userId, chatId, callback.id, callback.data ?? "");
    const text = update.message?.text?.trim();
    if (!text) throw new Error("Поддерживаются только текстовые сообщения.");
    if (text.startsWith("/")) return handleCommand(userId, chatId, text);
    const session = await state.getSession(userId);
    if (!session) throw new Error("Нет активного шага. Используйте /help.");
    await processSessionText(userId, chatId, text, session);
    return session.mode;
  }

  return {
    async fetch(request: Request) {
      const url = new URL(request.url);
      if (request.method === "GET" && url.pathname === "/health") return Response.json({ ok: true, service: "telegram-cms" });
      if (url.pathname !== "/telegram/webhook") return new Response("Not Found", { status: 404 });
      if (request.method !== "POST") return new Response("Method Not Allowed", { status: 405 });
      const webhookSecret = request.headers.get("x-telegram-bot-api-secret-token") ?? "";
      if (!constantTimeEqual(webhookSecret, env.TELEGRAM_WEBHOOK_SECRET)) return new Response("Forbidden", { status: 403 });
      const declaredLength = Number(request.headers.get("content-length") ?? 0);
      if (declaredLength > MAX_UPDATE_BYTES) return new Response("Payload Too Large", { status: 413 });
      const raw = await request.text();
      if (new TextEncoder().encode(raw).byteLength > MAX_UPDATE_BYTES) return new Response("Payload Too Large", { status: 413 });
      let update: TelegramUpdate;
      try {
        update = JSON.parse(raw) as TelegramUpdate;
      } catch {
        return new Response("Bad Request", { status: 400 });
      }
      const identity = getUpdateIdentity(update);
      if (!identity || !allowedUserIds.has(identity.userId)) {
        if (identity) await auditSafely(identity.userId, "authorization", "denied", "Telegram user ID is not allowlisted");
        return new Response("Forbidden", { status: 403 });
      }
      if (!Number.isSafeInteger(update.update_id)) return new Response("Bad Request", { status: 400 });
      if (!(await state.claimCallback(`update:${update.update_id}`))) {
        await auditSafely(identity.userId, "duplicate-update", "denied", `update:${update.update_id}`);
        if (identity.callbackId) await telegram.answerCallback(identity.callbackId, "Это обновление уже обработано.");
        return new Response("OK");
      }
      if (!(await state.consumeRate(identity.userId, now().getTime(), RATE_LIMIT_PER_MINUTE))) {
        await auditSafely(identity.userId, "rate-limit", "denied", "30 requests per minute exceeded");
        await telegram.sendMessage(identity.chatId, "Слишком много запросов. Повторите через минуту.");
        return new Response("Too Many Requests", { status: 429 });
      }
      if (identity.callbackId && !(await state.claimCallback(identity.callbackId))) {
        await auditSafely(identity.userId, "duplicate-callback", "denied", identity.callbackId);
        await telegram.answerCallback(identity.callbackId, "Это действие уже обработано.");
        return new Response("OK");
      }
      try {
        const action = await handleAuthorizedUpdate(update, identity.userId, identity.chatId);
        await auditSafely(identity.userId, String(action), "allowed", `update:${update.update_id}`);
        return new Response("OK");
      } catch (error) {
        const message = error instanceof Error ? error.message : "Неизвестная ошибка.";
        await auditSafely(identity.userId, "update", "failed", message);
        try {
          if (identity.callbackId) await telegram.answerCallback(identity.callbackId, "Действие не выполнено.");
          await telegram.sendMessage(identity.chatId, `Ошибка: ${safeAuditDetail(message)}`);
        } catch {
          // Telegram delivery failure must not expose secrets in the HTTP response.
        }
        return new Response("OK");
      }
    },
  };
}
