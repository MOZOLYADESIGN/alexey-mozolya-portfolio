import type { Thought } from "@/lib/types";

// Author-written notes. Routing between `thoughts-ai` and `teaching-context`
// is decided when those blocks are built (steps 9 and 11).
export const thoughts: Thought[] = [
  {
    id: "beauty-is-not-enough",
    title: "Красиво — ещё не значит хорошо",
    body: "Я не делаю дизайн ради красивой картинки. Если человек не понимает, куда смотреть, что ему предлагают и зачем это нужно, одной красоты мало. Визуал должен помогать продукту работать.",
    futureSlug: "krasivo-ne-znachit-horosho",
    linkEnabled: false,
  },
  {
    id: "brand-is-not-a-logo",
    title: "Бренд — это не логотип",
    body: "Для меня бренд — это не логотип и не большой PDF, который никто не открывает. Он должен чувствоваться в сайте, текстах, продукте, рекламе и в решениях команды.",
    futureSlug: "brend-eto-ne-logotip",
    linkEnabled: false,
  },
  {
    id: "ai-does-not-think-for-you",
    title: "Нейросети не думают за человека",
    body: "Если нет идеи, вкуса и понимания задачи, нейросеть просто поможет быстрее сделать много одинакового. Я использую её, чтобы меньше времени тратить на рутину и больше — на поиск хороших решений.",
    futureSlug: "neyroseti-ne-dumayut-za-cheloveka",
    linkEnabled: false,
  },
  {
    id: "figma-is-just-a-tool",
    title: "Знать Figma — не значит быть дизайнером",
    body: "Можно отлично знать компоненты, плагины и Auto Layout, но всё равно делать слабый дизайн. Figma — это просто инструмент. Важнее понимать, что ты делаешь, для кого и зачем.",
    futureSlug: "znat-figma-ne-znachit-byt-dizaynerom",
    linkEnabled: false,
  },
  {
    id: "products-for-real-people",
    title: "Мне нравятся продукты, которыми пользуются живые люди",
    body: "В образовательных и B2C-продуктах всё видно сразу. Если человеку непонятно, неудобно или скучно, он просто уходит. Поэтому дизайн должен нормально объяснять, помогать и вести дальше.",
    futureSlug: "produkty-dlya-zhivyh-lyudey",
    linkEnabled: false,
  },
];
