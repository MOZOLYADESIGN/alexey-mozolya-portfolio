import type { CmsEnvironment, TelegramUpdate } from "./types.ts";

export const MAX_UPDATE_BYTES = 128_000;
export const RATE_LIMIT_PER_MINUTE = 30;

export function constantTimeEqual(left: string, right: string) {
  const length = Math.max(left.length, right.length);
  let mismatch = left.length ^ right.length;
  for (let index = 0; index < length; index += 1) mismatch |= (left.charCodeAt(index) || 0) ^ (right.charCodeAt(index) || 0);
  return mismatch === 0;
}

export function assertEnvironment(env: CmsEnvironment) {
  for (const key of ["TELEGRAM_BOT_TOKEN", "TELEGRAM_WEBHOOK_SECRET", "GITHUB_TOKEN", "GITHUB_OWNER", "GITHUB_REPO", "TELEGRAM_ALLOWED_USER_IDS"] as const) {
    if (!env[key]?.trim()) throw new Error(`Missing required secret: ${key}`);
  }
  if (!/^[A-Za-z0-9_-]{1,256}$/.test(env.TELEGRAM_WEBHOOK_SECRET)) throw new Error("TELEGRAM_WEBHOOK_SECRET contains unsupported characters.");
  if (!env.CMS_STATE) throw new Error("Missing required Durable Object binding: CMS_STATE");
}

export function parseAllowedUserIds(raw: string) {
  const ids = raw.split(",").map((value) => value.trim()).filter(Boolean);
  const numericIds = ids.map(Number);
  if (!ids.length || ids.some((value) => !/^\d+$/.test(value)) || numericIds.some((value) => !Number.isSafeInteger(value) || value <= 0)) throw new Error("TELEGRAM_ALLOWED_USER_IDS must contain comma-separated positive numeric IDs.");
  return new Set(numericIds);
}

export function getUpdateIdentity(update: TelegramUpdate) {
  const from = update.callback_query?.from ?? update.message?.from;
  const chatId = update.callback_query?.message?.chat.id ?? update.message?.chat.id;
  if (!from || !Number.isSafeInteger(from.id) || !Number.isSafeInteger(chatId)) return null;
  return { userId: from.id, chatId: chatId as number, callbackId: update.callback_query?.id };
}

export function safeAuditDetail(value: unknown) {
  return String(value).replace(/[\r\n\t]+/g, " ").replace(/(token|secret|authorization)\s*[:=]\s*\S+/gi, "$1=[REDACTED]").slice(0, 300);
}
