import type { NextConfig } from "next";

// GitHub Pages serves a project site under /<repo>/, not the domain root —
// every asset and internal link needs that prefix or it 404s in production.
// Local dev and the Playwright preview stay at the root.
const repoBase = process.env.GITHUB_PAGES === "true" ? "/alexey-mozolya-portfolio" : "";

const nextConfig: NextConfig = {
  output: "export",
  trailingSlash: true,
  reactStrictMode: true,
  basePath: repoBase,
  assetPrefix: repoBase,
  images: {
    unoptimized: true,
  },
};

export default nextConfig;

