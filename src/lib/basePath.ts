/**
 * `next/image`, `next/link` and CSS asset imports pick up `basePath`
 * automatically; a plain string in `src`/`href` does not. GitHub Pages serves
 * this site under `/alexey-mozolya-portfolio/`, so every hand-written path into
 * `public/` needs this prefix or it 404s in production while working fine
 * locally at the root.
 */
export function withBasePath(path: `/${string}`): string {
  const base = process.env.GITHUB_PAGES === "true" ? "/alexey-mozolya-portfolio" : "";
  return `${base}${path}`;
}
