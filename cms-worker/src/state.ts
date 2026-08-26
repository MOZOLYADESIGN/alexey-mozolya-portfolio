import type { AuditEvent, CmsSession, DurableObjectNamespaceLike, DurableObjectStateLike, StatePort } from "./types.ts";

type StateOperation =
  | { operation: "get-session"; userId: number }
  | { operation: "set-session"; userId: number; session: CmsSession }
  | { operation: "clear-session"; userId: number }
  | { operation: "claim-callback"; callbackId: string }
  | { operation: "consume-rate"; userId: number; now: number; limit: number }
  | { operation: "audit"; event: AuditEvent }
  | { operation: "get-audit"; limit: number };

export class DurableStateStore implements StatePort {
  private readonly stub: { fetch(request: Request): Promise<Response> };

  constructor(namespace: DurableObjectNamespaceLike) {
    this.stub = namespace.get(namespace.idFromName("telegram-cms-state"));
  }

  private async call<T>(body: StateOperation): Promise<T> {
    const response = await this.stub.fetch(new Request("https://cms-state.internal/operation", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify(body),
    }));
    if (!response.ok) throw new Error(`CMS state operation failed (${response.status}).`);
    return response.json() as Promise<T>;
  }

  getSession(userId: number) { return this.call<CmsSession | null>({ operation: "get-session", userId }); }
  async setSession(userId: number, session: CmsSession) { await this.call({ operation: "set-session", userId, session }); }
  async clearSession(userId: number) { await this.call({ operation: "clear-session", userId }); }
  claimCallback(callbackId: string) { return this.call<boolean>({ operation: "claim-callback", callbackId }); }
  consumeRate(userId: number, now: number, limit: number) { return this.call<boolean>({ operation: "consume-rate", userId, now, limit }); }
  async audit(event: AuditEvent) { await this.call({ operation: "audit", event }); }
  getAudit(limit: number) { return this.call<AuditEvent[]>({ operation: "get-audit", limit }); }
}

export class CmsStateDurableObject {
  private readonly state: DurableObjectStateLike;

  constructor(state: DurableObjectStateLike) {
    this.state = state;
  }

  async fetch(request: Request) {
    if (request.method !== "POST") return new Response("Method Not Allowed", { status: 405 });
    let body: StateOperation;
    try {
      body = await request.json() as StateOperation;
    } catch {
      return new Response("Bad Request", { status: 400 });
    }

    switch (body.operation) {
      case "get-session": {
        const value = await this.state.storage.get<CmsSession>(`session:${body.userId}`);
        return Response.json(value ?? null);
      }
      case "set-session":
        await this.state.storage.put(`session:${body.userId}`, body.session);
        return Response.json(true);
      case "clear-session":
        await this.state.storage.delete(`session:${body.userId}`);
        return Response.json(true);
      case "claim-callback": {
        const key = `callback:${body.callbackId}`;
        if (await this.state.storage.get(key)) return Response.json(false);
        await this.state.storage.put(key, Date.now());
        return Response.json(true);
      }
      case "consume-rate": {
        const key = `rate:${body.userId}`;
        const window = Math.floor(body.now / 60_000);
        const current = await this.state.storage.get<{ window: number; count: number }>(key);
        const next = current?.window === window ? { window, count: current.count + 1 } : { window, count: 1 };
        await this.state.storage.put(key, next);
        return Response.json(next.count <= body.limit);
      }
      case "audit":
        await this.state.storage.put(`audit:${body.event.at}:${crypto.randomUUID()}`, body.event);
        return Response.json(true);
      case "get-audit": {
        const entries = await this.state.storage.list<AuditEvent>({ prefix: "audit:", limit: Math.min(Math.max(body.limit, 1), 50), reverse: true });
        return Response.json([...entries.values()]);
      }
    }
  }
}
