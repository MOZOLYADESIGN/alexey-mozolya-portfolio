"use client";

import { useEffect, useRef } from "react";

import { Sticker, type StickerGlyph } from "@/components/ui/Sticker";
import { processSteps } from "@/content/process";

import styles from "./ProcessSection.module.css";

/**
 * Stickers float over the block rather than sitting on the cards. `depth` is the
 * parallax travel in pixels across the whole scroll of the section: negative
 * drifts up, positive drifts down, so the group separates in space.
 *
 * Placement lives in CSS, keyed by `data-glyph`: the card grid reflows from one
 * to two to four columns, and the gaps the stickers have to sit in move with it.
 */
const STICKERS: Array<{
  glyph: StickerGlyph;
  shape?: "round" | "square";
  size: number;
  tilt: number;
  depth: number;
}> = [
  { glyph: "search", size: 76, tilt: -9, depth: -120 },
  { glyph: "people", shape: "square", size: 52, tilt: -6, depth: 110 },
  { glyph: "layers", shape: "square", size: 64, tilt: 12, depth: 90 },
  { glyph: "spark", size: 56, tilt: 18, depth: 140 },
  { glyph: "canvas", shape: "square", size: 72, tilt: -14, depth: -90 },
  { glyph: "send", size: 60, tilt: 8, depth: -60 },
];

export function ProcessSection() {
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    let frame = 0;
    const update = () => {
      frame = 0;
      const rect = el.getBoundingClientRect();
      // 0 as the block enters from below, 1 as it leaves past the top.
      const progress =
        (window.innerHeight - rect.top) / (window.innerHeight + rect.height);
      el.style.setProperty("--scroll", String(Math.min(1, Math.max(0, progress))));
    };
    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };

    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll, { passive: true });
    return () => {
      if (frame) cancelAnimationFrame(frame);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, []);

  return (
    <section
      ref={ref}
      id="process"
      className={styles.process}
      aria-labelledby="process-title"
    >
      <div className={styles.stickers} aria-hidden="true">
        {STICKERS.map((sticker) => (
          <Sticker
            key={sticker.glyph}
            glyph={sticker.glyph}
            shape={sticker.shape}
            className={styles.floating}
            data-glyph={sticker.glyph}
            style={
              {
                "--size": `${sticker.size}px`,
                "--tilt": `${sticker.tilt}deg`,
                "--depth": sticker.depth,
              } as React.CSSProperties
            }
          />
        ))}
      </div>

      <div className={styles.inner}>
        <div className={styles.header}>
          <h2 className={styles.title} id="process-title">
            Как проходит работа
          </h2>
          <p className={styles.lead}>
            Понятный путь от первого разговора до готового продукта. Никакой магии — только
            последовательные шаги, на каждом из которых видно, что происходит и зачем.
          </p>
        </div>

        <ol className={styles.list}>
          {processSteps.map((step) => (
            <li className={styles.step} key={step.id}>
              <span className={styles.index}>{step.index}</span>
              <h3 className={styles.stepTitle}>{step.title}</h3>
              <p className={styles.stepBody}>{step.body}</p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
