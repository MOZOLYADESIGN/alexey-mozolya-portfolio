# Портфолио Алексея Мозоли

Актуальная карта проекта, доступов и продолжения работы: [`PROJECT_HANDOFF.md`](./PROJECT_HANDOFF.md).

Новая одностраничная версия портфолио по Figma node `771:9904`.

## Стек

- Vite 8;
- TypeScript;
- семантический HTML5;
- обычный CSS с дизайн-токенами;
- нативный `IntersectionObserver` для active navigation;
- валидируемый JSON content layer;
- изолированная Telegram CMS на Cloudflare Worker;
- ноль runtime dependencies у сайта и Worker.

Изображения и Onest хранятся локально. В production-коде нет временных Figma URL.

## Локальный запуск

```bash
npm ci
npm run dev
```

Dev URL: `http://localhost:5173/alexey-mozolya-portfolio/`.

## Production preview

```bash
npm run check
npm run preview
```

Preview URL: `http://127.0.0.1:4173/alexey-mozolya-portfolio/`.

`npm run check` выполняет TypeScript-проверку, production build, статический link/SEO/security smoke test и валидацию production assets.

## Структура

```text
src/
  main.ts            # active-section navigation
  content/           # разрешённые тексты, схема и безопасный build-time renderer
  styles/            # tokens, base, layout, components, responsive
  assets/fonts/      # self-hosted Onest WOFF2
public/
  assets/             # Figma images and SVG
  robots.txt
  sitemap.xml
cms-worker/           # webhook, Telegram/GitHub API, state, security tests
```

## GitHub Pages

Vite base: `/alexey-mozolya-portfolio/`.

Workflow `.github/workflows/deploy.yml` проверяет pull request, но публикует `dist` только после успешного build из `master`. Feature-ветка сама по себе production deployment не запускает.

GitHub Actions закреплены на commit SHA. Dependabot еженедельно создаёт отдельные pull request для npm и GitHub Actions; автоматического merge и production deployment для них нет.

## Контент

Редактируемые тексты, SEO и контакты находятся в `src/content/site.json`. `src/content/schema.ts` запрещает неизвестные поля, HTML и неподходящие URL. Vite подставляет данные в статический HTML во время сборки, поэтому визуальный layout не зависит от CMS и остаётся индексируемым без клиентского рендеринга.

Telegram CMS находится в `cms-worker/`. Она создаёт отдельную `bot/update-*` ветку и PR только с `site.json`; merge возможен лишь после CI PASS и отдельного подтверждения. Настройка secrets и test mode описаны в `cms-worker/README.md`.

## Security

Production HTML содержит строгую CSP без `unsafe-inline`/`unsafe-eval`, referrer policy и хеш только для JSON-LD. Все runtime-ресурсы self-hosted; trackers отсутствуют.

Публикация редизайна запрещена до прямого подтверждения владельца: `Публикуй`.
