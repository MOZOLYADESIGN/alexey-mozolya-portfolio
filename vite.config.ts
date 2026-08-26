import { defineConfig } from "vite";

export default defineConfig({
  base: "/alexey-mozolya-portfolio/",
  build: {
    assetsInlineLimit: 2_048,
    cssCodeSplit: false,
    target: "es2022",
  },
});
