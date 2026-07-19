# Hero assets

Планируемые файлы:

- `head.webm` — прозрачная зацикленная анимация головы;
- `hero-poster.avif` — desktop fallback;
- `hero-mobile.avif` — постоянное мобильное изображение.

Не добавляйте тяжёлые исходники в production-папку.

## Текущее состояние

`hero-portrait-placeholder.webp` — временный кадр, вырезанный из слайда
позиционирования автора. Точки замены описаны в `src/content/hero-media.ts`:
достаточно заполнить `webm` и заменить `poster`, вёрстку менять не нужно.

