import assert from "node:assert/strict";
import test from "node:test";
import rawContent from "../../src/content/site.json" with { type: "json" };
import { createCmsApp } from "../src/cms.ts";
import type { AuditEvent, CmsEnvironment, CmsSession, GitHubChange, GitHubPort, InlineButton, StatePort, TelegramPort } from "../src/types.ts";

class MemoryState implements StatePort {
  sessions = new Map<number, CmsSession>();
  callbacks = new Set<string>();
  rates = new Map<number, { window: number; count: number }>();
  events: AuditEvent[] = [];

  async getSession(userId: number) { return this.sessions.get(userId) ?? null; }
  async setSession(userId: number, session: CmsSession) { this.sessions.set(userId, structuredClone(session)); }
  async clearSession(userId: number) { this.sessions.delete(userId); }
  async claimCallback(callbackId: string) {
    if (this.callbacks.has(callbackId)) return false;
    this.callbacks.add(callbackId);
    return true;
  }
  async consumeRate(userId: number, now: number, limit: number) {
    const window = Math.floor(now / 60_000);
    const current = this.rates.get(userId);
    const next = current?.window === window ? { window, count: current.count + 1 } : { window, count: 1 };
    this.rates.set(userId, next);
    return next.count <= limit;
  }
  async audit(event: AuditEvent) { this.events.push(event); }
  async getAudit(limit: number) { return this.events.slice(-limit).reverse(); }
}

class FakeTelegram implements TelegramPort {
  messages: Array<{ chatId: number; text: string; keyboard?: InlineButton[][] }> = [];
  answers: Array<{ callbackId: string; text?: string }> = [];
  async sendMessage(chatId: number, text: string, keyboard?: InlineButton[][]) { this.messages.push({ chatId, text, keyboard }); }
  async answerCallback(callbackId: string, text?: string) { this.answers.push({ callbackId, text }); }
}

class FakeGitHub implements GitHubPort {
  content = structuredClone(rawContent);
  previous = structuredClone(rawContent);
  createCount = 0;
  mergeCount = 0;
  refs: string[] = [];
  failCreate = false;
  ci: "pending" | "success" | "failure" = "success";

  constructor() {
    this.previous.hero.name = "Предыдущее имя";
  }

  async getContent(ref?: string) {
    if (ref) this.refs.push(ref);
    return { content: structuredClone(ref && ref !== "master" ? this.previous : this.content), sha: "blob-sha" };
  }
  async createChange(_content: typeof rawContent, _baseSha: string, _title: string): Promise<GitHubChange> {
    this.createCount += 1;
    if (this.failCreate) throw new Error("GitHub API request failed (500).");
    return { branch: "bot/update-20260826-120000", commitSha: "commit-sha", prNumber: 7, prUrl: "https://github.test/pull/7" };
  }
  async getCiStatus() { return this.ci; }
  async mergeApprovedChange() { this.mergeCount += 1; return { mergeSha: "merge-sha" }; }
  async getHistory() { return [{ sha: "a".repeat(40), message: "CMS change", date: "2026-08-26T00:00:00Z" }]; }
  async getStatus() { return { branch: "master", headSha: "head", workflow: "completed/success" }; }
}

function fixture() {
  const state = new MemoryState();
  const telegram = new FakeTelegram();
  const github = new FakeGitHub();
  const env = {
    TELEGRAM_BOT_TOKEN: "telegram-test-token",
    TELEGRAM_WEBHOOK_SECRET: "webhook-test-secret",
    GITHUB_TOKEN: "github-test-token",
    GITHUB_OWNER: "owner",
    GITHUB_REPO: "repo",
    TELEGRAM_ALLOWED_USER_IDS: "1001",
    CMS_STATE: {},
  } as CmsEnvironment;
  const app = createCmsApp({ env, state, telegram, github, now: () => new Date("2026-08-26T12:00:00Z") });
  return { app, state, telegram, github, env };
}

function message(updateId: number, text: string, userId = 1001) {
  return { update_id: updateId, message: { message_id: updateId, chat: { id: userId }, from: { id: userId }, text } };
}

function callback(updateId: number, callbackId: string, data: string, userId = 1001) {
  return { update_id: updateId, callback_query: { id: callbackId, from: { id: userId }, data, message: { message_id: updateId, chat: { id: userId } } } };
}

function post(app: ReturnType<typeof createCmsApp>, update: unknown, secret = "webhook-test-secret") {
  return app.fetch(new Request("https://worker.test/telegram/webhook", {
    method: "POST",
    headers: { "content-type": "application/json", "x-telegram-bot-api-secret-token": secret },
    body: JSON.stringify(update),
  }));
}

test("authorized user can open the CMS", async () => {
  const { app, telegram } = fixture();
  const response = await post(app, message(1, "/start"));
  assert.equal(response.status, 200);
  assert.match(telegram.messages[0]?.text ?? "", /Telegram CMS/);
});

test("unauthorized Telegram user receives 403 and no command runs", async () => {
  const { app, telegram, github } = fixture();
  const response = await post(app, message(1, "/show hero", 9999));
  assert.equal(response.status, 403);
  assert.equal(telegram.messages.length, 0);
  assert.equal(github.refs.length, 0);
});

test("wrong webhook secret receives 403 before parsing the update", async () => {
  const { app, telegram } = fixture();
  const response = await post(app, { not: "telegram" }, "wrong-secret");
  assert.equal(response.status, 403);
  assert.equal(telegram.messages.length, 0);
});

test("invalid command is rejected without side effects", async () => {
  const { app, telegram, github } = fixture();
  const response = await post(app, message(1, "/exec whoami"));
  assert.equal(response.status, 200);
  assert.match(telegram.messages.at(-1)?.text ?? "", /Неизвестная команда/);
  assert.equal(github.createCount, 0);
});

test("oversized update is rejected with 413", async () => {
  const { app } = fixture();
  const response = await app.fetch(new Request("https://worker.test/telegram/webhook", {
    method: "POST",
    headers: { "x-telegram-bot-api-secret-token": "webhook-test-secret" },
    body: "x".repeat(128_001),
  }));
  assert.equal(response.status, 413);
});

test("invalid Telegram URL remains uncommitted", async () => {
  const { app, telegram, github, state } = fixture();
  await post(app, message(1, "/edit contacts.telegram.url"));
  await post(app, message(2, "javascript:alert(1)"));
  assert.match(telegram.messages.at(-1)?.text ?? "", /ссылка вида/);
  assert.equal(github.createCount, 0);
  assert.equal((await state.getSession(1001))?.mode, "await-edit");
});

test("invalid email remains uncommitted", async () => {
  const { app, telegram, github } = fixture();
  await post(app, message(1, "/edit contacts.email.address"));
  await post(app, message(2, "not-an-email"));
  assert.match(telegram.messages.at(-1)?.text ?? "", /Некорректный email/);
  assert.equal(github.createCount, 0);
});

test("HTML and XSS payloads are rejected as plain text violations", async () => {
  const { app, telegram, github } = fixture();
  await post(app, message(1, "/edit hero.greeting"));
  await post(app, message(2, "<img src=x onerror=alert(1)>"));
  assert.match(telegram.messages.at(-1)?.text ?? "", /без HTML/);
  assert.equal(github.createCount, 0);
});

test("GitHub failure is contained and the draft is not published", async () => {
  const { app, telegram, github } = fixture();
  github.failCreate = true;
  await post(app, message(1, "/edit hero.greeting"));
  await post(app, message(2, "Здравствуйте"));
  await post(app, callback(3, "cb-create", "draft:commit"));
  assert.match(telegram.messages.at(-1)?.text ?? "", /GitHub API request failed/);
  assert.equal(github.mergeCount, 0);
});

test("CI failure blocks publish", async () => {
  const { app, state, github, telegram } = fixture();
  github.ci = "failure";
  await state.setSession(1001, { mode: "draft", pending: { kind: "edit", before: github.content, after: github.content, baseSha: "blob", diff: "diff", title: "title", github: { branch: "bot/update-20260826-120000", commitSha: "commit", prNumber: 7, prUrl: "https://github.test/pull/7" } } });
  await post(app, message(1, "/publish"));
  assert.match(telegram.messages.at(-1)?.text ?? "", /CI failure/);
  assert.equal(github.mergeCount, 0);
});

test("publish command alone never merges without callback approval", async () => {
  const { app, state, github, telegram } = fixture();
  await state.setSession(1001, { mode: "draft", pending: { kind: "edit", before: github.content, after: github.content, baseSha: "blob", diff: "diff", title: "title", github: { branch: "bot/update-20260826-120000", commitSha: "commit", prNumber: 7, prUrl: "https://github.test/pull/7" } } });
  await post(app, message(1, "/publish"));
  assert.equal(github.mergeCount, 0);
  assert.equal(telegram.messages.at(-1)?.keyboard?.[0]?.[0]?.callback_data, "publish:confirm");
  await post(app, callback(2, "cb-publish", "publish:confirm"));
  assert.equal(github.mergeCount, 1);
});

test("rollback stages old content as a new PR and never force-pushes", async () => {
  const { app, state, github } = fixture();
  const sha = "a".repeat(40);
  await post(app, message(1, `/rollback ${sha}`));
  const session = await state.getSession(1001);
  assert.equal(session?.mode, "draft");
  assert.equal(session?.mode === "draft" ? session.pending.kind : "", "rollback");
  assert.equal(session?.mode === "draft" ? session.pending.after.hero.name : "", "Предыдущее имя");
  assert.deepEqual(github.refs, [sha]);
  assert.equal(github.createCount, 0);
  assert.equal(github.mergeCount, 0);
});

test("duplicate callback cannot create a second PR", async () => {
  const { app, github, telegram } = fixture();
  await post(app, message(1, "/edit hero.greeting"));
  await post(app, message(2, "Здравствуйте"));
  await post(app, callback(3, "same-callback", "draft:commit"));
  await post(app, callback(4, "same-callback", "draft:commit"));
  assert.equal(github.createCount, 1);
  assert.match(telegram.answers.at(-1)?.text ?? "", /уже обработано/);
});

test("rate limit blocks request 31 in the same minute", async () => {
  const { app } = fixture();
  let response = new Response();
  for (let index = 1; index <= 31; index += 1) response = await post(app, message(index, "/help"));
  assert.equal(response.status, 429);
});

test("duplicate experience ID is rejected before PR creation", async () => {
  const { app, github, telegram } = fixture();
  await post(app, message(1, "/add"));
  const values = ["starta", "jobs", "Повтор", "2026", "Сейчас", "инхаус", "Описание"];
  for (let index = 0; index < values.length; index += 1) await post(app, message(index + 2, values[index] ?? ""));
  assert.match(telegram.messages.at(-1)?.text ?? "", /уже существует/);
  assert.equal(github.createCount, 0);
});

test("valid add flow produces a staged content-only draft", async () => {
  const { app, state, github } = fixture();
  await post(app, message(1, "/add"));
  const values = ["new-project", "apex", "Новый проект", "2026", "Сейчас", "аутстафф", "Описание нового проекта"];
  for (let index = 0; index < values.length; index += 1) await post(app, message(index + 2, values[index] ?? ""));
  const session = await state.getSession(1001);
  assert.equal(session?.mode, "draft");
  assert.equal(session?.mode === "draft" ? session.pending.after.experience.items.at(-1)?.id : "", "new-project");
  assert.equal(github.createCount, 0);
});
