import type { ContactLink, NavItem } from "@/lib/types";

export const siteConfig = {
  name: "Алексей Мозоля",
  seoTitle: "Дизайн сайтов и цифровых продуктов — Алексей Мозоля",
  description:
    "Алексей Мозоля — дизайнер интерфейсов и бренд-стратег. Проектирую сайты и цифровые продукты, развиваю визуальные системы и коммуникацию брендов.",
  hero: {
    // The phrase is fixed. It is split only so the tail can be set in the
    // serif italic accent; `heroTitle` below keeps the full string intact.
    titleLead: "Прокачиваю смыслы, визуал, стратегию и коммуникацию",
    titleAccent: "цифровых продуктов",
    subtitle:
      "Помогаю цифровым продуктам становиться сильнее по смыслу и визуально: анализирую продукт, нахожу точки роста и собираю стратегию развития.",
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
    { label: "Услуги", href: "#services" },
    { label: "Продукты", href: "#products" },
    { label: "Мысли", href: "#thoughts" },
    { label: "Контакты", href: "#contact" },
  ] satisfies NavItem[],
} as const;

export const telegramUrl = siteConfig.contacts[0].href;

export const heroTitle = `${siteConfig.hero.titleLead} ${siteConfig.hero.titleAccent}`;

