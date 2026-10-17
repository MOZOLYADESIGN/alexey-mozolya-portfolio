import { access, readFile, readdir, stat } from "node:fs/promises";
import { createHash } from "node:crypto";
import { join } from "node:path";
import { fileURLToPath } from "node:url";

const distUrl = new URL("../dist/", import.meta.url);
const distPath = fileURLToPath(distUrl);
const required = ["index.html", "playground.html", "robots.txt", "sitemap.xml"];

await Promise.all(required.map((file) => access(new URL(file, distUrl))));

const html = await readFile(new URL("index.html", distUrl), "utf8");
const forbidden = ["figma.com/api/mcp/asset", "localhost", 'src="/assets/', 'href="/assets/'];

for (const token of forbidden) {
  if (html.includes(token)) throw new Error(`Forbidden production token: ${token}`);
}

const base = process.env.SITE_BASE || `/${process.env.GITHUB_REPOSITORY?.split("/")[1] || "alexey-mozolya-portfolio"}/`;
if (!html.includes(base)) {
  throw new Error("Repository base path is missing from the production HTML.");
}

for (const requiredToken of [
  'http-equiv="Content-Security-Policy"',
  'name="referrer" content="strict-origin-when-cross-origin"',
  'rel="noopener noreferrer"',
]) {
  if (!html.includes(requiredToken)) throw new Error(`Required production token is missing: ${requiredToken}`);
}

if (html.includes("{{")) throw new Error("Unresolved content template token in production HTML.");
if (/Content-Security-Policy[^>]*(?:unsafe-inline|unsafe-eval)/i.test(html)) throw new Error("Unsafe CSP directive in production HTML.");
if ((html.match(/<h1\b/g) ?? []).length !== 1) throw new Error("Production HTML must contain exactly one H1.");
if ((html.match(/rel="canonical"/g) ?? []).length !== 1) throw new Error("Production HTML must contain exactly one canonical URL.");

const blankLinks = html.match(/<a\b(?=[^>]*target="_blank")[^>]*>/gi) ?? [];
for (const link of blankLinks) {
  if (!/rel="[^"]*noopener[^"]*noreferrer[^"]*"/i.test(link)) throw new Error(`Unsafe target=_blank link: ${link}`);
}

const ids = new Set([...html.matchAll(/\bid="([^"]+)"/g)].map((match) => match[1]));
for (const match of html.matchAll(/href="#([^"]+)"/g)) {
  if (!ids.has(match[1])) throw new Error(`Broken internal anchor: #${match[1]}`);
}

const imageTags = html.match(/<img\b[^>]*>/gi) ?? [];
for (const image of imageTags) {
  for (const attribute of ["src", "width", "height", "alt"]) {
    if (!new RegExp(`\\b${attribute}="[^"]*"`, "i").test(image)) throw new Error(`Image is missing ${attribute}: ${image}`);
  }
}

const structuredDataSource = html.match(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/)?.[1];
if (!structuredDataSource) throw new Error("Structured data is missing.");
JSON.parse(structuredDataSource);
const structuredDataHash = createHash("sha256").update(structuredDataSource).digest("base64");
if (!html.includes(`'sha256-${structuredDataHash}'`)) throw new Error("CSP does not authorize the exact structured-data hash.");

async function listFiles(directory) {
  const names = await readdir(directory);
  const files = [];
  for (const name of names) {
    const path = join(directory, name);
    const info = await stat(path);
    if (info.isDirectory()) files.push(...(await listFiles(path)));
    else files.push({ path, bytes: info.size });
  }
  return files;
}

const files = await listFiles(distPath);
const relativeFiles = new Set(files.map(({ path }) => path.slice(distPath.length).replaceAll("\\", "/").replace(/^\//, "")));
for (const match of html.matchAll(/\b(?:href|src)="([^"]+)"/g)) {
  const reference = match[1];
  if (/^(?:#|mailto:|https?:|data:)/.test(reference)) continue;
  const relative = reference.replace(/^\.\//, "").replace(new RegExp(`^${base}`), "");
  if (!relativeFiles.has(relative)) throw new Error(`Broken local production reference: ${reference}`);
}

const oversized = files.filter(({ bytes }) => bytes > 2_000_000);
if (oversized.length) {
  throw new Error(`Oversized production files: ${oversized.map(({ path }) => path).join(", ")}`);
}

console.log(`Validated ${files.length} production files.`);
