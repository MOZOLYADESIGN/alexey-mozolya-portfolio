"use client";

import { useEffect, useState } from "react";

const COMPACT_THRESHOLD = 24;

/**
 * True once the page has left the very top. The nav only returns to its full
 * height when the user is back at the start, so the capsule never oscillates
 * while reading.
 */
export function useIsCompact() {
  const [isCompact, setIsCompact] = useState(false);

  useEffect(() => {
    let frame = 0;

    const read = () => {
      frame = 0;
      setIsCompact(window.scrollY > COMPACT_THRESHOLD);
    };

    const onScroll = () => {
      if (frame === 0) frame = window.requestAnimationFrame(read);
    };

    read();
    window.addEventListener("scroll", onScroll, { passive: true });

    return () => {
      window.removeEventListener("scroll", onScroll);
      if (frame !== 0) window.cancelAnimationFrame(frame);
    };
  }, []);

  return isCompact;
}

/**
 * Whether the element with this id is currently on screen.
 *
 * Defaults to `false` so a caller that shows its own fallback CTA does the
 * right thing when the watched element does not exist on the page at all.
 */
export function useIsElementVisible(id: string) {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const element = document.getElementById(id);
    if (!element) return;

    const observer = new IntersectionObserver(
      ([entry]) => setIsVisible(entry.isIntersecting),
      { threshold: 0 },
    );

    observer.observe(element);
    return () => observer.disconnect();
  }, [id]);

  return isVisible;
}

/**
 * Id of the section currently occupying the middle of the viewport, or null
 * near the very top of the page.
 */
export function useActiveSection(hrefs: readonly `#${string}`[]) {
  const [activeHref, setActiveHref] = useState<string | null>(null);

  useEffect(() => {
    const visible = new Set<string>();

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          const href = `#${entry.target.id}`;
          if (entry.isIntersecting) visible.add(href);
          else visible.delete(href);
        }

        // Keep document order so overlapping sections resolve predictably.
        const current = hrefs.find((href) => visible.has(href));
        setActiveHref(current ?? null);
      },
      { rootMargin: "-45% 0px -45% 0px" },
    );

    for (const href of hrefs) {
      const element = document.getElementById(href.slice(1));
      if (element) observer.observe(element);
    }

    return () => observer.disconnect();
  }, [hrefs]);

  return activeHref;
}
