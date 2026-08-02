import type { ContactLink, NavItem } from "@/lib/types";

export const siteConfig = {
  name: "Алексей Мозоля",
  seoTitle: "Разбор продукта, AI-процессы и наставничество по Figma — Алексей Мозоля",
  description:
    "Алексей Мозоля — дизайнер продуктов и наставник. Разбираю продукты и визуальные системы, собираю персональные AI-процессы и обучаю системной работе в Figma.",
  hero: {
    title: "Помогаю понять задачу, собрать рабочую систему и научиться действовать самостоятельно",
    subtitle:
      "Разбираю продукты и визуальные решения, выстраиваю персональные AI-процессы и обучаю системной работе в Figma.",
  },
  contacts: [
    {
      kind: "telegram",
      label: "Telegram",
      href: "https://t.me/poofex",
    },
    {
      kind: "vk",
      label: "VK",
      href: "https://vk.ru/cactusinapeachcolorforhumans",
    },
    {
      kind: "email",
      label: "Gmail",
      href: "mailto:mozolyadesign@gmail.com",
    },
  ] satisfies ContactLink[],
  navigation: [
    { label: "Обо мне", href: "#about" },
    { label: "Работы", href: "#projects" },
    { label: "С чего начать", href: "#situations" },
    { label: "Продукты", href: "#products" },
    { label: "Мысли", href: "#thoughts" },
    { label: "Контакты", href: "#contact" },
  ] satisfies NavItem[],
} as const;

export const telegramUrl = siteConfig.contacts[0].href;

