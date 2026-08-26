# Портфолио Алексея Мозоли

Новая одностраничная версия портфолио по Figma node `771:9904`.

## Стек

- Vite 8;
- TypeScript;
- семантический HTML5;
- обычный CSS с дизайн-токенами;
- нативный `IntersectionObserver` для active navigation;
- ноль runtime dependencies.

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

`npm run check` выполняет TypeScript-проверку, production build и валидацию base path, системных файлов, временных URL и размера production assets.

## Структура

```text
src/
  main.ts            # active-section navigation
  styles/            # tokens, base, layout, components, responsive
  assets/fonts/      # self-hosted Onest WOFF2
public/
  assets/             # Figma images and SVG
  robots.txt
  sitemap.xml
```

## GitHub Pages

Vite base: `/alexey-mozolya-portfolio/`.

Workflow `.github/workflows/deploy.yml` публикует `dist` только после push в `master`. Feature-ветка сама по себе production deployment не запускает.

Публикация редизайна запрещена до прямого подтверждения владельца: `Публикуй`.
