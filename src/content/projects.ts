import type { Project } from "@/lib/types";

/**
 * Восемь слотов под кейсы. Названия технические — так решено в decision-log,
 * пока нет разрешений на публикацию клиентов.
 *
 * TODO: заменить на реальные кейсы.
 *
 * `idea` и `result` — намеренно «рыба» в пределах лимита 120 знаков. Правдоподобный
 * текст здесь писать нельзя: выдуманный результат кейса читается как заявление
 * о реальной работе, даже под флагом `isPlaceholder`.
 */
export const projectsArePlaceholders = true;

const covers = [
  { gradient: "linear-gradient(135deg, #315dff, #66e8ff)", category: "Сайт" },
  { gradient: "linear-gradient(135deg, #ff3f9b, #ff8a6c)", category: "Цифровой продукт" },
  { gradient: "linear-gradient(135deg, #b8ff28, #ffe54d)", category: "Бренд" },
  { gradient: "linear-gradient(135deg, #7a4dff, #c9e5ff)", category: "Сайт" },
  { gradient: "linear-gradient(135deg, #ff7a1a, #ffd0bd)", category: "Арт-дирекшн" },
  { gradient: "linear-gradient(135deg, #1ed6b3, #3287ff)", category: "Цифровой продукт" },
  { gradient: "linear-gradient(135deg, #ff304f, #ff8bd6)", category: "Бренд" },
  { gradient: "linear-gradient(135deg, #87ff36, #61d8ff)", category: "Сайт" },
];

const idea = "Рыбный текст на месте идеи кейса. Здесь появится короткое описание задачи и решения — до 120 знаков.";
const result = "Рыбный текст на месте результата. Здесь появится конкретный итог работы — тоже до 120 знаков.";

export const projects: Project[] = covers.map((cover, index) => {
  const number = String(index + 1).padStart(2, "0");

  return {
    id: `case-${number}`,
    title: `Кейс ${number}`,
    category: cover.category,
    idea,
    result,
    alt: "",
    gradient: cover.gradient,
    isPublished: true,
    isPlaceholder: true,
  };
});
