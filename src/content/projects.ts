import type { Project } from "@/lib/types";

/**
 * Восемь слотов под кейсы. Названия технические — так решено в decision-log,
 * пока нет разрешений на публикацию клиентов.
 *
 * TODO: заменить на реальные кейсы.
 *
 * `summary` — намеренно «рыба» в пределах лимита 200 знаков. Правдоподобный
 * текст здесь писать нельзя: выдуманный результат кейса читается как заявление
 * о реальной работе, даже под флагом `isPlaceholder`.
 */
export const projectsArePlaceholders = true;

// Covers are generated meshes until real case art exists; the category is the
// only authored bit here.
const categories = [
  "Сайт",
  "Цифровой продукт",
  "Бренд",
  "Сайт",
  "Арт-дирекшн",
  "Цифровой продукт",
  "Бренд",
  "Сайт",
];

const summary =
  "Рыбный текст на месте пояснения к кейсу. Здесь появится короткое описание задачи, решения и итога работы — до 200 знаков.";

export const projects: Project[] = categories.map((category, index) => {
  const number = String(index + 1).padStart(2, "0");

  return {
    id: `case-${number}`,
    title: `Кейс ${number}`,
    category,
    summary,
    alt: "",
    isPublished: true,
    isPlaceholder: true,
  };
});
