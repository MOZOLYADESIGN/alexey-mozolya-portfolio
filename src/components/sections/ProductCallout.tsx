"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";

import { Abstract } from "@/components/ui/Abstract";
import { products } from "@/content/products";
import type { Product } from "@/lib/types";

import styles from "./ProductCallout.module.css";

interface ProductCalloutProps {
  productId: Product["id"];
  sectionId?: string;
}

// Each callout gets its own mesh, so three products in one page never repeat.
const SEED_BY_ID: Record<Product["id"], number> = {
  consultation: 0,
  "ai-course": 1,
  "figma-mentoring": 3,
};

export function ProductCallout({ productId, sectionId }: ProductCalloutProps) {
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
      {/* Up to 1024px the mesh is the section background: heavily blurred and
          held back in opacity so the copy keeps its contrast. Wider than that
          it becomes the right-hand column. */}
      <div className={styles.media}>
        <Abstract seed={SEED_BY_ID[product.id]} className={styles.mesh} />
      </div>

      <div className={styles.inner}>
        <div className={styles.content}>
          <h2 className={styles.title} id={titleId}>
            {product.title}
          </h2>
          <p className={styles.context}>{product.contextLine}</p>
        </div>

        <dl className={styles.facts}>
          {facts.map((fact) => (
            <div className={styles.fact} key={fact.term}>
              <dt className={styles.factTerm}>{fact.term}</dt>
              <dd className={styles.factValue}>{fact.value}</dd>
            </div>
          ))}
        </dl>

        <div className={styles.content}>
          <p className={styles.includedTerm}>Что входит</p>
          <ul className={styles.included}>
            {product.included.map((item) => (
              <li className={styles.includedItem} key={item}>
                {item}
              </li>
            ))}
          </ul>

          <div className={styles.action}>
            <span className={styles.price}>{product.price}</span>
            <Link className={styles.cta} href={`/${product.slug}`}>
              {product.ctaLabel}
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
