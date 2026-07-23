import { ContactLink } from "@/components/ui/ContactLink";
import { products } from "@/content/products";
import type { Product } from "@/lib/types";

import styles from "./ProductCallout.module.css";

interface ProductCalloutProps {
  productId: Product["id"];
  sectionId?: string;
  /** Funnel label above the title (e.g. "Первый шаг"). */
  eyebrow?: string;
}

export function ProductCallout({ productId, sectionId, eyebrow = "Продукт" }: ProductCalloutProps) {
  const product = products.find((item) => item.id === productId);

  if (!product) return null;

  const anchor = sectionId ?? `product-${product.id}`;
  const titleId = `${anchor}-title`;

  const facts: Array<{ term: string; value: string }> = [
    { term: "Кому", value: product.audience },
    { term: "Результат", value: product.outcome },
    { term: "Формат", value: product.format },
  ];

  return (
    <section className={styles.callout} id={anchor} aria-labelledby={titleId}>
      <div className={styles.panel}>
        <div className={styles.lead}>
          <p className={styles.eyebrow}>{eyebrow}</p>
          <p className={styles.context}>{product.contextLine}</p>
          <h2 className={styles.title} id={titleId}>
            {product.title}
          </h2>
        </div>

        <div className={styles.body}>
          <dl className={styles.facts}>
            {facts.map((fact) => (
              <div className={styles.fact} key={fact.term}>
                <dt className={styles.factTerm}>{fact.term}</dt>
                <dd className={styles.factValue}>{fact.value}</dd>
              </div>
            ))}
          </dl>

          <ul className={styles.included}>
            {product.included.map((item) => (
              <li className={styles.includedItem} key={item}>
                {item}
              </li>
            ))}
          </ul>

          <div className={styles.action}>
            <span className={styles.price}>{product.price}</span>
            <ContactLink className={styles.cta}>{product.ctaLabel}</ContactLink>
          </div>
        </div>
      </div>
    </section>
  );
}
