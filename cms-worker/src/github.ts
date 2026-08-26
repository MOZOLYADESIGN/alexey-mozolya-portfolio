import { assertSafeContent } from "./content.ts";
import type { CiStatus, CmsEnvironment, GitHubChange, GitHubPort } from "./types.ts";

const CONTENT_PATH = "src/content/site.json";
const API_VERSION = "2026-03-10";

function encodeBase64(value: string) {
  const bytes = new TextEncoder().encode(value);
  let binary = "";
  for (const byte of bytes) binary += String.fromCharCode(byte);
  return btoa(binary);
}

function decodeBase64(value: string) {
  const binary = atob(value.replace(/\s/g, ""));
  return new TextDecoder().decode(Uint8Array.from(binary, (character) => character.charCodeAt(0)));
}

function branchTimestamp(now: Date) {
  return now.toISOString().replace(/[-:]/g, "").replace("T", "-").slice(0, 15);
}

export class GitHubClient implements GitHubPort {
  private readonly apiRoot: string;
  private readonly token: string;
  private readonly baseBranch: string;
  private readonly fetcher: typeof fetch;
  private readonly now: () => Date;

  constructor(env: CmsEnvironment, fetcher: typeof fetch = fetch, now: () => Date = () => new Date()) {
    if (!/^[A-Za-z0-9_.-]+$/.test(env.GITHUB_OWNER) || !/^[A-Za-z0-9_.-]+$/.test(env.GITHUB_REPO)) throw new Error("Invalid GitHub repository configuration.");
    this.apiRoot = `https://api.github.com/repos/${env.GITHUB_OWNER}/${env.GITHUB_REPO}`;
    this.token = env.GITHUB_TOKEN;
    this.baseBranch = env.GITHUB_DEFAULT_BRANCH?.trim() || "master";
    if (!/^[A-Za-z0-9._/-]+$/.test(this.baseBranch) || this.baseBranch.startsWith("bot/")) throw new Error("Invalid GitHub base branch.");
    this.fetcher = fetcher;
    this.now = now;
  }

  private async request<T>(path: string, init: RequestInit = {}) {
    const response = await this.fetcher(`${this.apiRoot}${path}`, {
      ...init,
      headers: {
        accept: "application/vnd.github+json",
        authorization: `Bearer ${this.token}`,
        "x-github-api-version": API_VERSION,
        ...(init.body ? { "content-type": "application/json" } : {}),
        ...init.headers,
      },
    });
    if (!response.ok) throw new Error(`GitHub API request failed (${response.status}) at ${path.split("?")[0]}.`);
    if (response.status === 204) return undefined as T;
    return response.json() as Promise<T>;
  }

  async getContent(ref = this.baseBranch) {
    const result = await this.request<{ content: string; encoding: string; sha: string }>(`/contents/${CONTENT_PATH}?ref=${encodeURIComponent(ref)}`);
    if (result.encoding !== "base64") throw new Error("GitHub returned unsupported content encoding.");
    const content: unknown = JSON.parse(decodeBase64(result.content));
    assertSafeContent(content);
    return { content, sha: result.sha };
  }

  async createChange(content: Parameters<GitHubPort["createChange"]>[0], baseSha: string, title: string) {
    assertSafeContent(content);
    const branch = `bot/update-${branchTimestamp(this.now())}`;
    if (!branch.startsWith("bot/update-") || branch === this.baseBranch) throw new Error("Unsafe CMS branch.");
    const baseRef = await this.request<{ object: { sha: string } }>(`/git/ref/heads/${encodeURIComponent(this.baseBranch)}`);
    await this.request("/git/refs", { method: "POST", body: JSON.stringify({ ref: `refs/heads/${branch}`, sha: baseRef.object.sha }) });
    const updated = await this.request<{ commit: { sha: string } }>(`/contents/${CONTENT_PATH}`, {
      method: "PUT",
      body: JSON.stringify({ message: title, content: encodeBase64(`${JSON.stringify(content, null, 2)}\n`), sha: baseSha, branch }),
    });
    const pullRequest = await this.request<{ number: number; html_url: string }>("/pulls", {
      method: "POST",
      body: JSON.stringify({ title, head: branch, base: this.baseBranch, body: "Изменение создано Telegram CMS. Публикация возможна только после успешного CI и отдельного подтверждения." }),
    });
    return { branch, commitSha: updated.commit.sha, prNumber: pullRequest.number, prUrl: pullRequest.html_url };
  }

  async getCiStatus(commitSha: string): Promise<CiStatus> {
    const result = await this.request<{ check_runs: Array<{ status: string; conclusion: string | null }> }>(`/commits/${encodeURIComponent(commitSha)}/check-runs`);
    if (!result.check_runs.length || result.check_runs.some((run) => run.status !== "completed")) return "pending";
    return result.check_runs.every((run) => run.conclusion === "success") ? "success" : "failure";
  }

  async mergeApprovedChange(change: GitHubChange) {
    if (!change.branch.startsWith("bot/update-")) throw new Error("Only CMS update branches can be published.");
    const files = await this.request<Array<{ filename: string; status: string }>>(`/pulls/${change.prNumber}/files?per_page=100`);
    if (files.length !== 1 || files[0]?.filename !== CONTENT_PATH || files[0].status !== "modified") throw new Error("Publish blocked: pull request contains files outside the content allowlist.");
    const result = await this.request<{ merged: boolean; sha: string }>(`/pulls/${change.prNumber}/merge`, {
      method: "PUT",
      body: JSON.stringify({ sha: change.commitSha, merge_method: "squash", commit_title: `CMS: publish PR #${change.prNumber}` }),
    });
    if (!result.merged) throw new Error("GitHub did not merge the approved pull request.");
    return { mergeSha: result.sha };
  }

  async getHistory() {
    const commits = await this.request<Array<{ sha: string; commit: { message: string; author: { date: string } } }>>(`/commits?path=${encodeURIComponent(CONTENT_PATH)}&per_page=10`);
    return commits.map((entry) => ({ sha: entry.sha, message: entry.commit.message.split("\n")[0] ?? "", date: entry.commit.author.date }));
  }

  async getStatus() {
    const [reference, runs] = await Promise.all([
      this.request<{ object: { sha: string } }>(`/git/ref/heads/${encodeURIComponent(this.baseBranch)}`),
      this.request<{ workflow_runs: Array<{ status: string; conclusion: string | null }> }>(`/actions/runs?branch=${encodeURIComponent(this.baseBranch)}&per_page=1`),
    ]);
    const run = runs.workflow_runs[0];
    return { branch: this.baseBranch, headSha: reference.object.sha, workflow: run ? `${run.status}/${run.conclusion ?? "—"}` : "нет запусков" };
  }
}
