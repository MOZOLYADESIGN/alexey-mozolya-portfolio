# Анимационная система

## Общий принцип

Движение создаёт характер в двух точках: hero и портфолио. Остальные секции используют только короткие, функциональные transitions.

## Hero

Финальная сцена:

- `head.webm` — прозрачный бесшовный цикл;
- `object.webm` — отдельный прозрачный цикл;
- `hero-poster.avif` — desktop fallback;
- `hero-mobile.avif` — mobile asset.

Video attributes:

```html
autoplay muted loop playsinline preload="metadata"
```

Голова периодически смотрит в разные стороны и подмигивает. Курсор не управляет глазами. Объект не должен закрывать текст или лицо в ключевых кадрах.

Fallback:

- до загрузки — poster;
- mobile — poster;
- reduced motion — poster;
- при ошибке видео — poster.

## Карточка проекта

Desktop/fine pointer:

1. информация лежит под cover внутри одного контейнера;
2. при hover/focus cover смещается вверх;
3. проявляется максимум две короткие строки/группы;
4. высота сетки не меняется;
5. duration 280–420 ms, без сильного spring.

Mobile/coarse pointer:

- cover не двигается;
- текст находится в normal flow;
- карточка целиком кликабельна.

## Навигация

- `isCompact = scrollY > threshold`;
- возврат полной высоты только при `scrollY` около 0;
- hover/focus не разворачивает капсулу;
- transition только по внутренним padding, background, border, color;
- hit area сохраняет минимум 44 px даже в компактном виде через внешний интерактивный контейнер.

## Появление секций

- opacity + translateY 12–24 px;
- один запуск;
- без stagger длиннее 500 ms;
- не скрывать основной текст до выполнения JavaScript;
- при reduced motion сразу показывать финальное состояние.

## GSAP

Подключать GSAP только в client-компоненте и только после подтверждения сцены. Использовать `gsap.context()` и корректный cleanup. Не pin-ить длинные разделы и не перехватывать нативный scroll.

## Производительность

- На смартфоне отключить WebM, blur, parallax и сложные ScrollTrigger-сцены.
- Не анимировать большие blur-radius и box-shadow.
- Предпочитать transform и opacity.
- Проверять memory и main-thread time.

