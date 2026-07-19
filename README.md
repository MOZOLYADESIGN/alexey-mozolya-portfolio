# Портфолио Алексея Мозоли — starter kit

Комплект содержит:

- мастер-промпт для Claude Code;
- подробное техническое задание в `/docs`;
- статический Next.js scaffold;
- типизированные контентные коллекции;
- базовые проверки TypeScript, ESLint, Playwright и axe.

## Локальный запуск

```bash
npm install
npm run dev
```

Открой `http://localhost:3000`.

## Проверки

Один раз установи браузер для Playwright:

```bash
npx playwright install chromium
```

Затем:

```bash
npm run typecheck
npm run lint
npm run build
npm run test:a11y
```

Статический результат появляется в `/out` после `npm run build`.

## Перед визуальной разработкой

1. Прочитать `MASTER_PROMPT.md`.
2. Утвердить архитектуру и дизайн-токены.
3. Работать по одному блоку.
4. Не заменять заглушки выдуманным контентом.
