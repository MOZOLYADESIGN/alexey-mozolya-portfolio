import { ContactLink } from "@/components/ui/ContactLink";
import { products } from "@/content/products";
import type { Product } from "@/lib/types";

interface ProductCalloutProps {
  productId: Product["id"];
  sectionId?: string;
}

export function ProductCallout({ productId, sectionId }: ProductCalloutProps) {
  const product = products.find((item) => item.id === productId);

  if (!product) return null;

  return (
    <section className="product-callout" id={sectionId ?? `product-${product.id}`}>
      <p className="eyebrow">Продукт</p>
      <p>{product.contextLine}</p>
      <h2>{product.title}</h2>
      <p>{product.audience}</p>
      <p>{product.outcome}</p>
      <p>{product.format}</p>
      <ul>
        {product.included.map((item) => (
          <li key={item}>{item}</li>
        ))}
      </ul>
      <strong>{product.price}</strong>
      <ContactLink>{product.ctaLabel}</ContactLink>
    </section>
  );
}

