"use client";

import { useEffect, useRef, useState } from "react";

import { ContactLink } from "@/components/ui/ContactLink";
import { IconArrowUp } from "@/components/ui/icons";
import { products } from "@/content/products";
import type { Product } from "@/lib/types";

import styles from "./ProductCallout.module.css";

interface ProductCalloutProps {
  productId: Product["id"];
  sectionId?: string;
  eyebrow?: string;
}

// Pyramid of up-arrows converging toward the top — the graphic focuses the eye
// upward, on the offer.
const ARROW_ROWS = [1, 2, 3, 4, 5];

export function ProductCallout({ productId, sectionId, eyebrow = "Продукт" }: ProductCalloutProps) {
  const product = products.find((item) => item.id === productId);
  const ref = useRef<HTMLElement>(null);
  const [active, setActive] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    // Invert the theme while the callout sits around the middle of the viewport.
    const observer = new IntersectionObserver(
      ([entry]) => setActive(entry.isIntersecting),
      { rootMargin: "-32% 0px -32% 0px" },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  if (!product) return null;

  const anchor = sectionId ?? `product-${product.id}`;
  const titleId = `${anchor}-title`;

  const facts: Array<{ term: string; value: string }> = [
    { term: "Кому", value: product.audience },
    { term: "Результат", value: product.outcome },
    { term: "Формат", value: product.format },
  ];

  return (
    <section
      ref={ref}
      className={styles.callout}
      id={anchor}
      data-active={active}
      aria-labelledby={titleId}
    >
      <div className={styles.panel}>
        <div className={styles.content}>
          <p className={styles.eyebrow}>{eyebrow}</p>
          <h2 className={styles.title} id={titleId}>
            {product.title}
          </h2>
          <p className={styles.context}>{product.contextLine}</p>

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

        <div className={styles.aside} aria-hidden="true">
          <div className={styles.arrows} data-active={active}>
            {ARROW_ROWS.map((count, rowIndex) => (
              <div className={styles.arrowRow} key={rowIndex}>
                {Array.from({ length: count }).map((_, colIndex) => (
                  <IconArrowUp
                    key={colIndex}
                    className={styles.arrow}
                    style={{
                      animationDelay: `${(ARROW_ROWS.length - 1 - rowIndex) * 0.12 + colIndex * 0.05}s`,
                    }}
                  />
                ))}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
