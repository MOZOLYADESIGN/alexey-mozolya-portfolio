import "@fontsource-variable/onest";
import "@fontsource-variable/lora/wght-italic.css";
import type { Metadata } from "next";
import type { ReactNode } from "react";

import { DesktopNav } from "@/components/navigation/DesktopNav";
import { MobileNav } from "@/components/navigation/MobileNav";
import { siteConfig } from "@/content/site";

import "./globals.css";

export const metadata: Metadata = {
  title: siteConfig.seoTitle,
  description: siteConfig.description,
  authors: [{ name: siteConfig.name }],
  openGraph: {
    title: siteConfig.seoTitle,
    description: siteConfig.description,
    type: "website",
    locale: "ru_RU",
  },
};

export default function RootLayout({ children }: Readonly<{ children: ReactNode }>) {
  return (
    <html lang="ru">
      <body>
        <a className="skip-link" href="#main-content">
          Перейти к содержанию
        </a>
        <header>
          <DesktopNav />
          <MobileNav />
        </header>
        {children}
      </body>
    </html>
  );
}

