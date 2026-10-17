import { createHash } from "node:crypto";
import { defineConfig } from "vite";
import rawSiteContent from "./src/content/site.json" with { type: "json" };
import { renderSiteTemplate } from "./src/content/render.ts";
import { assertSiteContent } from "./src/content/schema.ts";

assertSiteContent(rawSiteContent);

export default defineConfig(({ command }) => ({
  base: process.env.SITE_BASE || `/${process.env.GITHUB_REPOSITORY?.split("/")[1] || "alexey-mozolya-portfolio"}/`,
  plugins: [
    {
      name: "validated-site-content",
      transformIndexHtml(template) {
        const rendered = renderSiteTemplate(template, rawSiteContent);
        const structuredData = rendered.match(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/)?.[1];
        if (!structuredData) throw new Error("Structured data block is missing.");

        const structuredDataHash = createHash("sha256").update(structuredData).digest("base64");
        const isPlayground = template.includes('id="workspace-scene"');
        const connectSources = command === "serve" ? "'self' ws:" : "'self'";
        const policy = [
          "default-src 'self'",
          "base-uri 'self'",
          `connect-src ${connectSources}${isPlayground ? " https://prod.spline.design https://*.spline.design https://*.splinetool.com" : ""}`,
          "font-src 'self'",
          "form-action 'none'",
          "frame-src 'none'",
          isPlayground ? "img-src 'self' data: blob:" : "img-src 'self' data:",
          "manifest-src 'self'",
          "media-src 'none'",
          "object-src 'none'",
          `script-src 'self' 'sha256-${structuredDataHash}'`,
          "script-src-attr 'none'",
          "style-src 'self'",
          "style-src-attr 'none'",
          isPlayground ? "worker-src 'self' blob:" : "worker-src 'none'",
          "upgrade-insecure-requests",
        ].join("; ");

        return rendered.replace(
          "<!-- security-policy -->",
          `<meta http-equiv="Content-Security-Policy" content="${policy}" />`,
        );
      },
    },
  ],
  build: {
    rollupOptions: { input: { main: "index.html", playground: "playground.html" } },
    assetsInlineLimit: 2_048,
    cssCodeSplit: false,
    target: "es2022",
  },
}));
