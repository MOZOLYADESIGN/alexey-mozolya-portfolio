import type { Principle } from "@/lib/types";

/**
 * Portrait slot. `src: null` renders the designed placeholder frame instead of
 * an image; the ratio below is reserved either way, so dropping in a real file
 * changes no layout.
 */
export interface AboutPortrait {
  src: string | null;
  width: number;
  height: number;
  alt: string;
}

export const aboutPortrait: AboutPortrait = {
  // Портрет автора, перенесённый с первого экрана.
  src: "/media/hero/hero-portrait-placeholder.webp",
  width: 850,
  height: 840,
  alt: "Алексей Мозоля — портрет",
};

export const aboutTitle = "Смотрю на продукт шире отдельного экрана";

// Продающий, человеческий текст с естественными ключами (дизайн сайтов, цифровые
// продукты, интерфейсы, бренд, арт-дирекшн, удалённо). 350–650 знаков, два абзаца.
export const aboutBodyIsPlaceholder = false;

export const aboutBody = [
  "Я дизайнер сайтов и цифровых продуктов. Собираю структуру, интерфейс и визуальный язык так, чтобы продукт был понятен с первого экрана и мягко вёл человека к нужному действию. Чаще всего работаю с образовательными и B2C-проектами — там сразу видно, работает дизайн или нет: человек либо остаётся, либо уходит.",
  "Подключаюсь на любом объёме — разобрать продукт на консультации, собрать бренд и арт-дирекшн или встроиться в команду и вести дизайн вместе с ней. Работаю удалённо по всей России: от первого созвона до макетов, готовых к разработке.",
];

/**
 * Сформулировано автором из его же заметок: три положительных утверждения о
 * подходе. Полемические тексты (нейросети, Figma) остались в `thoughts.ts` —
 * их место в блоках 9 и 11.
 *
 * `illustration: null` — иллюстраций пока нет, подпись не выдумываем.
 */
export const principles: Principle[] = [
  {
    id: "meaning-first",
    index: "01",
    title: "Сначала смысл, потом картинка",
    body: "Начинаю с того, что продукт должен объяснить: кому, что и зачем. Визуал строю поверх этого ответа, а не вместо него.",
    illustration: null,
  },
  {
    id: "brand-lives-in-product",
    index: "02",
    title: "Бренд живёт в продукте",
    body: "Собираю бренд так, чтобы он читался в интерфейсе, текстах и рекламе, а не только в презентации.",
    illustration: null,
  },
  {
    id: "real-people",
    index: "03",
    title: "Проверяю на живых людях",
    body: "В образовательных и B2C-продуктах реакция видна сразу: если непонятно, неудобно или скучно, человек просто уходит.",
    illustration: null,
  },
];
