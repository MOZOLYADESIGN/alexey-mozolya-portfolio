import type { CmsEnvironment, InlineButton, TelegramPort } from "./types.ts";

export class TelegramClient implements TelegramPort {
  private readonly apiRoot: string;
  private readonly fetcher: typeof fetch;

  constructor(env: CmsEnvironment, fetcher: typeof fetch = fetch) {
    this.apiRoot = `https://api.telegram.org/bot${env.TELEGRAM_BOT_TOKEN}`;
    this.fetcher = fetcher;
  }

  private async call(method: string, payload: Record<string, unknown>) {
    const response = await this.fetcher(`${this.apiRoot}/${method}`, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify(payload),
    });
    if (!response.ok) throw new Error(`Telegram API request failed (${response.status}).`);
  }

  async sendMessage(chatId: number, text: string, keyboard?: InlineButton[][]) {
    const safeText = text.length > 4_000 ? `${text.slice(0, 3_990)}…` : text;
    await this.call("sendMessage", {
      chat_id: chatId,
      text: safeText,
      ...(keyboard ? { reply_markup: { inline_keyboard: keyboard } } : {}),
      link_preview_options: { is_disabled: true },
    });
  }

  async answerCallback(callbackId: string, text?: string) {
    await this.call("answerCallbackQuery", { callback_query_id: callbackId, ...(text ? { text: text.slice(0, 180) } : {}) });
  }
}
