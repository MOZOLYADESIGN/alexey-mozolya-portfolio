"use client";

import { useEffect, useState } from "react";

import { heroHead } from "@/content/hero-media";

import styles from "./HeroSection.module.css";

/**
 * Video is opt-in, never opt-out: it plays only once we have positively
 * confirmed a wide viewport, no reduced-motion preference and a real asset.
 * Anything else — including server render and the first client paint — shows
 * the still, so mobile never downloads the WebM.
 */
function useAllowsVideo() {
  const [allows, setAllows] = useState(false);

  useEffect(() => {
    const queries = [
      window.matchMedia("(min-width: 768px)"),
      window.matchMedia("(prefers-reduced-motion: no-preference)"),
    ];

    const read = () => setAllows(queries.every((query) => query.matches));

    read();
    for (const query of queries) query.addEventListener("change", read);
    return () => {
      for (const query of queries) query.removeEventListener("change", read);
    };
  }, []);

  return allows;
}

export function HeroMedia() {
  const allowsVideo = useAllowsVideo();

  return (
    <div className={styles.stage}>
      <div className={styles.headFrame}>
        {allowsVideo && heroHead.webm !== null ? (
          <video
            className={styles.head}
            src={heroHead.webm}
            poster={heroHead.poster}
            width={heroHead.width}
            height={heroHead.height}
            aria-label={heroHead.alt}
            autoPlay
            muted
            loop
            playsInline
            preload="metadata"
          />
        ) : (
          /* eslint-disable-next-line @next/next/no-img-element -- static export, explicit dimensions, no optimizer */
          <img
            className={styles.head}
            src={heroHead.poster}
            width={heroHead.width}
            height={heroHead.height}
            alt={heroHead.alt}
            fetchPriority="high"
            decoding="async"
          />
        )}
      </div>
    </div>
  );
}
