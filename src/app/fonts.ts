import localFont from "next/font/local";

/**
 * Fonts are self-hosted from the Fontsource packages — no Google Fonts request.
 *
 * `next/font/local` is used instead of the packages' plain CSS imports so Next
 * preloads the files and derives a metric-matched fallback. Without that, the
 * swap from the system fallback reflowed the display-size headline and pushed
 * CLS over 0.1.
 *
 * Cyrillic and latin subsets are both declared; each keeps its own
 * unicode-range so only the needed file is fetched.
 */
export const onest = localFont({
  src: [
    {
      path: "../../node_modules/@fontsource-variable/onest/files/onest-cyrillic-wght-normal.woff2",
      weight: "100 900",
      style: "normal",
    },
    {
      path: "../../node_modules/@fontsource-variable/onest/files/onest-latin-wght-normal.woff2",
      weight: "100 900",
      style: "normal",
    },
  ],
  display: "swap",
  variable: "--font-sans-loaded",
  fallback: ["system-ui", "sans-serif"],
});

export const lora = localFont({
  src: [
    {
      path: "../../node_modules/@fontsource-variable/lora/files/lora-cyrillic-wght-italic.woff2",
      weight: "400 700",
      style: "italic",
    },
    {
      path: "../../node_modules/@fontsource-variable/lora/files/lora-latin-wght-italic.woff2",
      weight: "400 700",
      style: "italic",
    },
  ],
  display: "swap",
  variable: "--font-serif-loaded",
  fallback: ["Georgia", "serif"],
});
