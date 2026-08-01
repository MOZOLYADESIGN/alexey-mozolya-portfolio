import type { SVGProps } from "react";

import {
  IconCanvas,
  IconLayers,
  IconPeople,
  IconSearch,
  IconSend,
  IconSpark,
} from "@/components/ui/icons";

import styles from "./Sticker.module.css";

const GLYPHS = {
  search: IconSearch,
  layers: IconLayers,
  spark: IconSpark,
  send: IconSend,
  canvas: IconCanvas,
  people: IconPeople,
} satisfies Record<string, (props: SVGProps<SVGSVGElement>) => React.ReactElement>;

export type StickerGlyph = keyof typeof GLYPHS;

interface StickerProps extends React.HTMLAttributes<HTMLSpanElement> {
  glyph: StickerGlyph;
  /** Round or squared plate — a little variety in a scattered group. */
  shape?: "round" | "square";
}

/**
 * A vector sticker: outlined plate, glyph, drop shadow. Decorative only, so it
 * is hidden from assistive tech and never carries meaning the copy lacks.
 */
export function Sticker({ glyph, shape = "round", className, ...rest }: StickerProps) {
  const Glyph = GLYPHS[glyph];

  return (
    <span
      {...rest}
      className={className ? `${styles.sticker} ${className}` : styles.sticker}
      data-shape={shape}
      aria-hidden="true"
    >
      <Glyph className={styles.glyph} />
    </span>
  );
}
