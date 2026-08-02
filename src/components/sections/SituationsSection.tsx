import Link from "next/link";

import { Abstract } from "@/components/ui/Abstract";
import { products } from "@/content/products";
import { situations } from "@/content/situations";

import styles from "./SituationsSection.module.css";

export function SituationsSection() {
  return (
    <section id="situations" className={styles.situations} aria-labelledby="situations-title">
      {/* Full-bleed wash behind the container — masked to fade into the plain
          page colour above and below, so it reads as one continuous surface
          with the sections on either side rather than a coloured band. */}
      <div className={styles.wash} aria-hidden="true">
        <Abstract seed={0} className={styles.mesh} />
        <span className={styles.washFadeTop} />
        <span className={styles.washFadeBottom} />
      </div>

      <div className={styles.inner}>
        <h2 className={styles.title} id="situations-title">
          С чего начать
        </h2>

        <ul className={styles.list}>
          {situations.map((situation) => {
            const product = products.find((item) => item.id === situation.productId);
            if (!product) return null;

            return (
              <li key={situation.productId}>
                <Link className={styles.card} href={`/${product.slug}`}>
                  <p className={styles.prompt}>{situation.prompt}</p>
                  <p className={styles.suggestion}>{situation.suggestion}</p>
                </Link>
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}
