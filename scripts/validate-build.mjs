import { access, readFile, readdir, stat } from "node:fs/promises";
import { join } from "node:path";
import { fileURLToPath } from "node:url";

const distUrl = new URL("../dist/", import.meta.url);
const distPath = fileURLToPath(distUrl);
const required = ["index.html", "robots.txt", "sitemap.xml"];

await Promise.all(required.map((file) => access(new URL(file, distUrl))));

const html = await readFile(new URL("index.html", distUrl), "utf8");
const forbidden = ["figma.com/api/mcp/asset", "localhost", 'src="/assets/', 'href="/assets/'];

for (const token of forbidden) {
  if (html.includes(token)) throw new Error(`Forbidden production token: ${token}`);
}

if (!html.includes("/alexey-mozolya-portfolio/")) {
  throw new Error("Repository base path is missing from the production HTML.");
}

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
const oversized = files.filter(({ bytes }) => bytes > 2_000_000);
if (oversized.length) {
  throw new Error(`Oversized production files: ${oversized.map(({ path }) => path).join(", ")}`);
}

console.log(`Validated ${files.length} production files.`);
