/**
 * Hero media replacement points.
 *
 * Today the head is a still placeholder cropped from the author's current
 * positioning slide. When the final asset lands, drop it into
 * /public/media/hero and fill in `webm` — nothing else in the hero changes.
 *
 * Final desktop asset: a transparent looping WebM of the head.
 * Mobile and reduced motion always stay on the still image.
 */
export interface HeroHeadMedia {
  /** Transparent looping WebM. `null` until the final asset exists. */
  webm: string | null;
  /** Still shown on mobile, under reduced motion, and before/instead of video. */
  poster: string;
  width: number;
  height: number;
  alt: string;
  isPlaceholder: boolean;
}

export const heroHead: HeroHeadMedia = {
  webm: null,
  poster: "/media/hero/hero-portrait-placeholder.webp",
  width: 850,
  height: 840,
  alt: "Алексей Мозоля — портрет в три четверти",
  isPlaceholder: true,
};
