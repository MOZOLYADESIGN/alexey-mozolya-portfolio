import assert from "node:assert/strict";
import test from "node:test";
import rawContent from "../../src/content/site.json" with { type: "json" };
import { GitHubClient } from "../src/github.ts";
import type { CmsEnvironment, GitHubChange } from "../src/types.ts";

const env = {
  GITHUB_TOKEN: "sensitive-github-token",
  GITHUB_OWNER: "owner",
  GITHUB_REPO: "repo",
  GITHUB_DEFAULT_BRANCH: "master",
} as CmsEnvironment;

function json(value: unknown, status = 200) {
  return Response.json(value, { status });
}

test("GitHub change writes only site.json on a bot branch and opens a PR", async () => {
  const requests: Array<{ url: string; method: string; body?: Record<string, unknown> }> = [];
  const responses = [
    json({ object: { sha: "base-commit" } }),
    json({ ref: "refs/heads/bot/update" }, 201),
    json({ commit: { sha: "content-commit" } }),
    json({ number: 17, html_url: "https://github.test/pull/17" }, 201),
  ];
  const fetcher: typeof fetch = async (input, init) => {
    requests.push({ url: String(input), method: init?.method ?? "GET", ...(init?.body ? { body: JSON.parse(String(init.body)) as Record<string, unknown> } : {}) });
    return responses.shift() ?? json({});
  };
  const client = new GitHubClient(env, fetcher, () => new Date("2026-08-26T12:00:00Z"));
  const change = await client.createChange(structuredClone(rawContent), "blob-sha", "CMS: test");

  assert.equal(change.branch, "bot/update-20260826-120000");
  const contentRequest = requests.find((entry) => entry.method === "PUT");
  assert.match(contentRequest?.url ?? "", /\/contents\/src\/content\/site\.json$/);
  assert.equal(contentRequest?.body?.branch, "bot/update-20260826-120000");
  assert.equal(contentRequest?.body?.sha, "blob-sha");
  assert.equal(requests.some((entry) => /\/contents\/(?!src\/content\/site\.json)/.test(entry.url)), false);
  const prRequest = requests.at(-1);
  assert.equal(prRequest?.body?.base, "master");
  assert.equal(prRequest?.body?.head, "bot/update-20260826-120000");
});

test("merge is blocked when PR contains any non-allowlisted file", async () => {
  let requestCount = 0;
  const fetcher: typeof fetch = async () => {
    requestCount += 1;
    return json([{ filename: "index.html", status: "modified" }]);
  };
  const client = new GitHubClient(env, fetcher);
  const change: GitHubChange = { branch: "bot/update-20260826-120000", commitSha: "sha", prNumber: 1, prUrl: "https://github.test/pull/1" };
  await assert.rejects(() => client.mergeApprovedChange(change), /outside the content allowlist/);
  assert.equal(requestCount, 1);
});

test("approved content-only PR can use the GitHub merge endpoint", async () => {
  const requests: string[] = [];
  const fetcher: typeof fetch = async (input) => {
    requests.push(String(input));
    if (requests.length === 1) return json([{ filename: "src/content/site.json", status: "modified" }]);
    return json({ merged: true, sha: "merge-sha" });
  };
  const client = new GitHubClient(env, fetcher);
  const result = await client.mergeApprovedChange({ branch: "bot/update-20260826-120000", commitSha: "sha", prNumber: 1, prUrl: "https://github.test/pull/1" });
  assert.equal(result.mergeSha, "merge-sha");
  assert.match(requests[1] ?? "", /\/pulls\/1\/merge$/);
});

test("GitHub errors never include token values", async () => {
  const fetcher: typeof fetch = async () => new Response("authorization: sensitive-github-token", { status: 500 });
  const client = new GitHubClient(env, fetcher);
  await assert.rejects(() => client.getContent(), (error: unknown) => {
    assert.equal(String(error).includes("sensitive-github-token"), false);
    return true;
  });
});

test("check-runs map to pending, success and failure", async () => {
  const payloads = [
    { check_runs: [] },
    { check_runs: [{ status: "completed", conclusion: "success" }] },
    { check_runs: [{ status: "completed", conclusion: "failure" }] },
  ];
  const fetcher: typeof fetch = async () => json(payloads.shift());
  const client = new GitHubClient(env, fetcher);
  assert.equal(await client.getCiStatus("one"), "pending");
  assert.equal(await client.getCiStatus("two"), "success");
  assert.equal(await client.getCiStatus("three"), "failure");
});
