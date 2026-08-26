import assert from "node:assert/strict";
import test from "node:test";
import { CmsStateDurableObject, DurableStateStore } from "../src/state.ts";
import type { DurableObjectNamespaceLike, DurableObjectStateLike } from "../src/types.ts";

function stateFixture() {
  const values = new Map<string, unknown>();
  const state = {
    storage: {
      async get<T>(key: string) { return values.get(key) as T | undefined; },
      async put<T>(key: string, value: T) { values.set(key, structuredClone(value)); },
      async delete(key: string) { return values.delete(key); },
      async list<T>({ prefix, limit = 1_000, reverse = false }: { prefix: string; limit?: number; reverse?: boolean }) {
        const entries = [...values.entries()].filter(([key]) => key.startsWith(prefix)).sort(([left], [right]) => left.localeCompare(right));
        if (reverse) entries.reverse();
        return new Map(entries.slice(0, limit)) as Map<string, T>;
      },
    },
  } as DurableObjectStateLike;
  const durableObject = new CmsStateDurableObject(state);
  const namespace = {
    idFromName: () => "state-id",
    get: () => ({ fetch: (request: Request) => durableObject.fetch(request) }),
  } as DurableObjectNamespaceLike;
  return new DurableStateStore(namespace);
}

test("Durable Object deduplicates callback IDs", async () => {
  const store = stateFixture();
  assert.equal(await store.claimCallback("callback-1"), true);
  assert.equal(await store.claimCallback("callback-1"), false);
});

test("Durable Object enforces 30 requests per user/minute", async () => {
  const store = stateFixture();
  for (let count = 1; count <= 30; count += 1) assert.equal(await store.consumeRate(1001, 1_000, 30), true);
  assert.equal(await store.consumeRate(1001, 1_000, 30), false);
  assert.equal(await store.consumeRate(1001, 61_000, 30), true);
});

test("Durable Object stores sessions and sanitized audit records", async () => {
  const store = stateFixture();
  const session = { mode: "add", step: 0, values: {} } as const;
  await store.setSession(1001, session);
  assert.deepEqual(await store.getSession(1001), session);
  await store.audit({ at: "2026-08-26T12:00:00.000Z", userId: 1001, action: "/start", outcome: "allowed", detail: "update:1" });
  assert.equal((await store.getAudit(10))[0]?.action, "/start");
  await store.clearSession(1001);
  assert.equal(await store.getSession(1001), null);
});
