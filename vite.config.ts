import { createHash } from "node:crypto";
import { defineConfig } from "vite";
import rawSiteContent from "./src/content/site.json" with { type: "json" };
import { renderSiteTemplate } from "./src/content/render.ts";
import { assertSiteContent } from "./src/content/schema.ts";

assertSiteContent(rawSiteContent);

export default defineConfig(({ command }) => ({
  base: "/alexey-mozolya-portfolio/",
  plugins: [
    {
      name: "validated-site-content",
      transformIndexHtml(template) {
        const rendered = renderSiteTemplate(template, rawSiteContent);
        const structuredData = rendered.match(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/)?.[1];
        if (!structuredData) throw new Error("Structured data block is missing.");

        const structuredDataHash = createHash("sha256").update(structuredData).digest("base64");
        const connectSources = command === "serve" ? "'self' ws:" : "'self'";
        const policy = [
          "default-src 'self'",
          "base-uri 'self'",
          `connect-src ${connectSources}`,
          "font-src 'self'",
          "form-action 'none'",
          "frame-src 'none'",
          "img-src 'self' data:",
          "manifest-src 'self'",
          "media-src 'none'",
          "object-src 'none'",
          `script-src 'self' 'sha256-${structuredDataHash}'`,
          "script-src-attr 'none'",
          "style-src 'self'",
          "style-src-attr 'none'",
          "worker-src 'none'",
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
    assetsInlineLimit: 2_048,
    cssCodeSplit: false,
    target: "es2022",
  },
}));
