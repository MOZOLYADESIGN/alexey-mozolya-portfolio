import { withBasePath } from "@/lib/basePath";
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
  src: withBasePath("/media/hero/hero-portrait-placeholder.webp"),
  width: 850,
  height: 840,
  alt: "Алексей Мозоля — портрет",
};

export const aboutTitle = "Смотрю на продукт шире отдельного экрана";

// Продающий, человеческий текст с естественными ключами (дизайн сайтов, цифровые
// продукты, интерфейсы, бренд, арт-дирекшн, удалённо). 350–650 знаков, два абзаца.
export const aboutBodyIsPlaceholder = false;

export const aboutBody = [
  "Я начинаю не с готового ответа, а с контекста. Мне важно понять, для кого создаётся решение, какую задачу оно выполняет и что должно измениться в результате. После этого мы выстраиваем короткий путь: действие, проверка, корректировка.",
  "Я объясняю логику решений, а не выдаю набор указаний. Цель работы — чтобы после неё человек мог продолжать самостоятельно.",
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
