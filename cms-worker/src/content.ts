import { assertSiteContent, assetSets, type ExperienceItem, type SiteContent } from "../../src/content/schema.ts";

export type FieldType = "text" | "email" | "telegram-url" | "id" | "asset-set";

export interface EditableField {
  id: string;
  section: "hero" | "experience" | "about" | "contacts";
  label: string;
  path: string;
  commandPath: string;
  maxLength: number;
  type: FieldType;
  paragraph?: boolean;
}

const staticFields: EditableField[] = [
  { id: "h-greet", section: "hero", label: "Приветствие", path: "hero.greeting", commandPath: "hero.greeting", maxLength: 80, type: "text" },
  { id: "h-name", section: "hero", label: "Имя в баннере", path: "hero.name", commandPath: "hero.name", maxLength: 80, type: "text" },
  { id: "h-desc-0", section: "hero", label: "Описание 1", path: "hero.descriptions.0", commandPath: "hero.descriptions.0", maxLength: 500, type: "text" },
  { id: "h-desc-1", section: "hero", label: "Описание 2", path: "hero.descriptions.1", commandPath: "hero.descriptions.1", maxLength: 500, type: "text" },
  { id: "h-meta-0", section: "hero", label: "Город", path: "hero.meta.0", commandPath: "hero.meta.0", maxLength: 80, type: "text" },
  { id: "h-meta-1", section: "hero", label: "Знак", path: "hero.meta.1", commandPath: "hero.meta.1", maxLength: 40, type: "text" },
  { id: "h-meta-2", section: "hero", label: "Год", path: "hero.meta.2", commandPath: "hero.meta.2", maxLength: 20, type: "text" },
  { id: "x-label", section: "experience", label: "Заголовок опыта", path: "experience.label", commandPath: "experience.label", maxLength: 80, type: "text" },
  { id: "x-years", section: "experience", label: "Стаж", path: "experience.summaryYears", commandPath: "experience.summaryYears", maxLength: 80, type: "text" },
  { id: "x-summary", section: "experience", label: "Описание опыта", path: "experience.summaryText", commandPath: "experience.summaryText", maxLength: 800, type: "text" },
  { id: "a-label", section: "about", label: "Заголовок обо мне", path: "about.label", commandPath: "about.label", maxLength: 100, type: "text" },
  { id: "c-label", section: "contacts", label: "Заголовок контактов", path: "contacts.label", commandPath: "contacts.label", maxLength: 80, type: "text" },
  { id: "c-cta-0", section: "contacts", label: "CTA строка 1", path: "contacts.ctaLines.0", commandPath: "contacts.ctaLines.0", maxLength: 100, type: "text" },
  { id: "c-cta-1", section: "contacts", label: "CTA строка 2", path: "contacts.ctaLines.1", commandPath: "contacts.ctaLines.1", maxLength: 100, type: "text" },
  { id: "c-tg-label", section: "contacts", label: "Подпись Telegram", path: "contacts.telegram.label", commandPath: "contacts.telegram.label", maxLength: 100, type: "text" },
  { id: "c-tg-url", section: "contacts", label: "Telegram URL", path: "contacts.telegram.url", commandPath: "contacts.telegram.url", maxLength: 100, type: "telegram-url" },
  { id: "c-email-label", section: "contacts", label: "Подпись email", path: "contacts.email.label", commandPath: "contacts.email.label", maxLength: 100, type: "text" },
  { id: "c-email", section: "contacts", label: "Email", path: "contacts.email.address", commandPath: "contacts.email.address", maxLength: 254, type: "email" },
  { id: "c-copy", section: "contacts", label: "Copyright", path: "contacts.copyright", commandPath: "contacts.copyright", maxLength: 160, type: "text" },
];

export const addSteps: Array<{ key: string; label: string; type: FieldType; maxLength: number }> = [
  { key: "id", label: "ID латиницей (например, new-project)", type: "id", maxLength: 40 },
  { key: "assetSet", label: `Набор изображений: ${assetSets.join(", ")}`, type: "asset-set", maxLength: 20 },
  { key: "title", label: "Название проекта", type: "text", maxLength: 160 },
  { key: "start", label: "Начало периода", type: "text", maxLength: 40 },
  { key: "end", label: "Конец периода", type: "text", maxLength: 40 },
  { key: "mode", label: "Формат работы", type: "text", maxLength: 60 },
  { key: "paragraph", label: "Описание проекта", type: "text", maxLength: 1_500 },
];

export function editableFields(content: SiteContent): EditableField[] {
  const fields = [...staticFields];
  content.about.paragraphs.forEach((_, index) => fields.push({ id: `a-p-${index}`, section: "about", label: `Абзац ${index + 1}`, path: `about.paragraphs.${index}`, commandPath: `about.paragraphs.${index}`, maxLength: 1_500, type: "text" }));
  content.about.noteLines.forEach((_, index) => fields.push({ id: `a-note-${index}`, section: "about", label: `Заметка ${index + 1}`, path: `about.noteLines.${index}`, commandPath: `about.noteLines.${index}`, maxLength: 500, type: "text" }));
  content.experience.items.forEach((item, itemIndex) => {
    const prefix = `experience.items.${item.id}`;
    fields.push(
      { id: `e-${itemIndex}-title`, section: "experience", label: `${item.title}: название`, path: `experience.items.${itemIndex}.title`, commandPath: `${prefix}.title`, maxLength: 160, type: "text" },
      { id: `e-${itemIndex}-start`, section: "experience", label: `${item.title}: начало`, path: `experience.items.${itemIndex}.timeline.start`, commandPath: `${prefix}.timeline.start`, maxLength: 40, type: "text" },
      { id: `e-${itemIndex}-end`, section: "experience", label: `${item.title}: конец`, path: `experience.items.${itemIndex}.timeline.end`, commandPath: `${prefix}.timeline.end`, maxLength: 40, type: "text" },
      { id: `e-${itemIndex}-mode`, section: "experience", label: `${item.title}: формат`, path: `experience.items.${itemIndex}.timeline.mode`, commandPath: `${prefix}.timeline.mode`, maxLength: 60, type: "text" },
    );
    item.paragraphs.forEach((_, paragraphIndex) => fields.push({
      id: `e-${itemIndex}-p-${paragraphIndex}`,
      section: "experience",
      label: `${item.title}: абзац ${paragraphIndex + 1}`,
      path: `experience.items.${itemIndex}.paragraphs.${paragraphIndex}`,
      commandPath: `${prefix}.paragraphs.${paragraphIndex}`,
      maxLength: 1_500,
      type: "text",
      paragraph: true,
    }));
  });
  return fields;
}

export function findEditableField(content: SiteContent, idOrPath: string) {
  return editableFields(content).find((field) => field.id === idOrPath || field.commandPath === idOrPath);
}

export function validatePlainValue(raw: string, type: FieldType, maxLength: number) {
  const value = raw.trim();
  if (!value) throw new Error("Значение не может быть пустым.");
  if (value.length > maxLength) throw new Error(`Слишком длинное значение: максимум ${maxLength} символов.`);
  if (/[<>]/.test(value) || /[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F\u202A-\u202E\u2066-\u2069]/u.test(value)) throw new Error("Разрешён только обычный текст без HTML и управляющих символов.");
  if (type === "email" && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) throw new Error("Некорректный email.");
  if (type === "telegram-url" && !/^https:\/\/t\.me\/[A-Za-z0-9_]{5,32}$/.test(value)) throw new Error("Нужна ссылка вида https://t.me/username.");
  if (type === "id" && !/^[a-z0-9][a-z0-9-]{1,39}$/.test(value)) throw new Error("ID: 2–40 символов, только a-z, 0-9 и дефис.");
  if (type === "asset-set" && !assetSets.includes(value as (typeof assetSets)[number])) throw new Error(`Разрешены только наборы: ${assetSets.join(", ")}.`);
  return value;
}

function readPath(root: unknown, path: string): unknown {
  return path.split(".").reduce<unknown>((current, key) => Array.isArray(current) ? current[Number(key)] : current && typeof current === "object" ? (current as Record<string, unknown>)[key] : undefined, root);
}

function writePath(root: unknown, path: string, value: unknown) {
  const parts = path.split(".");
  const last = parts.pop();
  if (!last) throw new Error("Invalid content path.");
  const parent = parts.reduce<unknown>((current, key) => Array.isArray(current) ? current[Number(key)] : (current as Record<string, unknown>)[key], root);
  if (Array.isArray(parent)) parent[Number(last)] = value;
  else (parent as Record<string, unknown>)[last] = value;
}

export function getFieldValue(content: SiteContent, field: EditableField) {
  const value = readPath(content, field.path);
  if (field.paragraph && Array.isArray(value)) return value.map((segment) => (segment as { text: string }).text).join("");
  if (typeof value !== "string") throw new Error("Editable field is not a string.");
  return value;
}

export function applyFieldEdit(content: SiteContent, field: EditableField, raw: string) {
  const value = validatePlainValue(raw, field.type, field.maxLength);
  const next = structuredClone(content);
  writePath(next, field.path, field.paragraph ? [{ text: value }] : value);
  const timelineMatch = field.path.match(/^experience\.items\.(\d+)\.timeline\.(?:start|end|mode)$/);
  if (timelineMatch) {
    const item = next.experience.items[Number(timelineMatch[1])];
    if (!item) throw new Error("Project timeline is missing.");
    item.timeline.ariaLabel = `${item.timeline.start} — ${item.timeline.end}, ${item.timeline.mode}`;
  }
  assertSiteContent(next);
  return { content: next, value };
}

export function addExperience(content: SiteContent, values: Record<string, string>) {
  const next = structuredClone(content);
  if (next.experience.items.some((item) => item.id === values.id)) throw new Error("Проект с таким ID уже существует.");
  if (next.experience.items.length >= 12) throw new Error("Достигнут лимит: 12 проектов.");
  const assetSet = validatePlainValue(values.assetSet ?? "", "asset-set", 20) as ExperienceItem["assetSet"];
  const imageCount = assetSet === "apex" ? 3 : 4;
  const item: ExperienceItem = {
    id: validatePlainValue(values.id ?? "", "id", 40),
    assetSet,
    title: validatePlainValue(values.title ?? "", "text", 160),
    timeline: {
      start: validatePlainValue(values.start ?? "", "text", 40),
      end: validatePlainValue(values.end ?? "", "text", 40),
      mode: validatePlainValue(values.mode ?? "", "text", 60),
      ariaLabel: `${values.start} — ${values.end}, ${values.mode}`,
    },
    paragraphs: [[{ text: validatePlainValue(values.paragraph ?? "", "text", 1_500) }]],
    imageAlts: Array.from({ length: imageCount }, (_, index) => `Иллюстрация проекта ${values.title}, ${index + 1}`),
  };
  next.experience.items.push(item);
  assertSiteContent(next);
  return next;
}

export function removeExperience(content: SiteContent, id: string) {
  if (content.experience.items.length <= 1) throw new Error("Нельзя удалить последний проект.");
  const next = structuredClone(content);
  const index = next.experience.items.findIndex((item) => item.id === id);
  if (index < 0) throw new Error("Проект с таким ID не найден.");
  next.experience.items.splice(index, 1);
  assertSiteContent(next);
  return next;
}

export function assertSafeContent(value: unknown): asserts value is SiteContent {
  assertSiteContent(value);
}

export function formatDiff(label: string, before: string, after: string) {
  const trim = (value: string) => value.length > 1_400 ? `${value.slice(0, 1_400)}…` : value;
  return `${label}\n\n− ${trim(before)}\n+ ${trim(after)}`;
}
