import type { SiteContent } from "../../src/content/schema.ts";

export interface TelegramUser {
  id: number;
  username?: string;
}

export interface TelegramMessage {
  message_id: number;
  chat: { id: number };
  from?: TelegramUser;
  text?: string;
}

export interface TelegramCallbackQuery {
  id: string;
  from: TelegramUser;
  data?: string;
  message?: TelegramMessage;
}

export interface TelegramUpdate {
  update_id: number;
  message?: TelegramMessage;
  callback_query?: TelegramCallbackQuery;
}

export interface InlineButton {
  text: string;
  callback_data: string;
}

export interface TelegramPort {
  sendMessage(chatId: number, text: string, keyboard?: InlineButton[][]): Promise<void>;
  answerCallback(callbackId: string, text?: string): Promise<void>;
}

export type CiStatus = "pending" | "success" | "failure";

export interface GitHubChange {
  branch: string;
  commitSha: string;
  prNumber: number;
  prUrl: string;
}

export interface GitHubPort {
  getContent(ref?: string): Promise<{ content: SiteContent; sha: string }>;
  createChange(content: SiteContent, baseSha: string, title: string): Promise<GitHubChange>;
  getCiStatus(commitSha: string): Promise<CiStatus>;
  mergeApprovedChange(change: GitHubChange): Promise<{ mergeSha: string }>;
  getHistory(): Promise<Array<{ sha: string; message: string; date: string }>>;
  getStatus(): Promise<{ branch: string; headSha: string; workflow: string }>;
}

export interface PendingChange {
  kind: "edit" | "add" | "remove" | "rollback";
  before: SiteContent;
  after: SiteContent;
  baseSha: string;
  diff: string;
  title: string;
  github?: GitHubChange;
}

export type CmsSession =
  | { mode: "await-edit"; fieldId: string; content: SiteContent; baseSha: string }
  | { mode: "add"; step: number; values: Record<string, string> }
  | { mode: "draft"; pending: PendingChange };

export interface AuditEvent {
  at: string;
  userId: number;
  action: string;
  outcome: "allowed" | "denied" | "failed";
  detail: string;
}

export interface StatePort {
  getSession(userId: number): Promise<CmsSession | null>;
  setSession(userId: number, session: CmsSession): Promise<void>;
  clearSession(userId: number): Promise<void>;
  claimCallback(callbackId: string): Promise<boolean>;
  consumeRate(userId: number, now: number, limit: number): Promise<boolean>;
  audit(event: AuditEvent): Promise<void>;
  getAudit(limit: number): Promise<AuditEvent[]>;
}

export interface CmsEnvironment {
  TELEGRAM_BOT_TOKEN: string;
  TELEGRAM_WEBHOOK_SECRET: string;
  GITHUB_TOKEN: string;
  GITHUB_OWNER: string;
  GITHUB_REPO: string;
  TELEGRAM_ALLOWED_USER_IDS: string;
  GITHUB_DEFAULT_BRANCH?: string;
  PRODUCTION_URL?: string;
  CMS_STATE: DurableObjectNamespaceLike;
}

export interface DurableObjectNamespaceLike {
  idFromName(name: string): unknown;
  get(id: unknown): { fetch(request: Request): Promise<Response> };
}

export interface DurableObjectStateLike {
  storage: {
    get<T>(key: string): Promise<T | undefined>;
    put<T>(key: string, value: T): Promise<void>;
    delete(key: string): Promise<boolean>;
    list<T>(options: { prefix: string; limit?: number; reverse?: boolean }): Promise<Map<string, T>>;
  };
}

export interface ExecutionContextLike {
  waitUntil(promise: Promise<unknown>): void;
}
