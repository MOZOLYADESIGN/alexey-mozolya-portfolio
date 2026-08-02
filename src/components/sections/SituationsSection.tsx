import Link from "next/link";

import { products } from "@/content/products";
import { situations } from "@/content/situations";

import styles from "./SituationsSection.module.css";

export function SituationsSection() {
  return (
    <section id="situations" className={styles.situations} aria-labelledby="situations-title">
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
    </section>
  );
}
