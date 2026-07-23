import type { Service } from "@/lib/types";

/**
 * Цены и составы — из decision-log, менять нельзя. Сроки, число правок и схему
 * оплаты на сайте не публикуем.
 *
 * `summary` и `result` у трёх услуг — TODO, стоят явной «рыбой» до авторского
 * текста. У консультации текст авторский (совпадает с блоком «Продукты»).
 */
export const servicesHavePlaceholders = true;

const draftSummary = "Рыбный текст на месте описания услуги: здесь появится, что входит и какую задачу решает.";
const draftResult = "Рыбный текст на месте результата услуги.";

export const services: Service[] = [
  {
    id: "digital-products",
    title: "Сайты и цифровые продукты",
    summary: draftSummary,
    price: "от 50 000 ₽",
    result: draftResult,
    details: [],
  },
  {
    id: "brand-art-direction",
    title: "Бренд и арт-дирекшн",
    summary: draftSummary,
    price: "от 50 000 ₽",
    result: draftResult,
    details: [],
  },
  {
    id: "consultation",
    title: "Консультация и аудит",
    summary: "Предварительный просмотр материалов, часовой созвон и короткий план действий.",
    price: "5 000 ₽",
    result: "Понятное направление дальнейшей работы с продуктом или визуальной системой.",
    details: [],
  },
  {
    id: "embedded-art-direction",
    title: "Встраивание в команду",
    summary: draftSummary,
    price: "от 80 000 ₽ / месяц",
    result: draftResult,
    details: [],
  },
];
