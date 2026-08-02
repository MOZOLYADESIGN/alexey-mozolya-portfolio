import type { ProductId } from "@/lib/types";

/**
 * The triage block from the marketing brief (§2, этап 2): three recognisable
 * situations instead of three service names, each pointing at the product
 * that answers it.
 */
export interface Situation {
  productId: ProductId;
  prompt: string;
  suggestion: string;
}

export const situations: Situation[] = [
  {
    productId: "consultation",
    prompt: "Нужно понять, что исправлять и куда двигаться",
    suggestion: "Подойдёт консультация с разбором продукта или визуальной системы.",
  },
  {
    productId: "ai-course",
    prompt: "Нужно встроить нейросети в конкретную рабочую задачу",
    suggestion: "Подойдёт персональный AI-спринт.",
  },
  {
    productId: "figma-mentoring",
    prompt: "Нужно перестать собирать макеты случайным набором действий",
    suggestion: "Подойдёт наставничество по Figma.",
  },
];
