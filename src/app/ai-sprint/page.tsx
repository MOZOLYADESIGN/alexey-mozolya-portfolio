import type { Metadata } from "next";

import { ProductPageTemplate } from "@/components/product-page/ProductPageTemplate";
import { productPages } from "@/content/productPages";

const content = productPages.find((page) => page.id === "ai-course")!;

export const metadata: Metadata = {
  title: `${content.heroTitle} — Алексей Мозоля`,
  description: content.heroIntro,
};

export default function AiSprintPage() {
  return <ProductPageTemplate content={content} />;
}
