export type ContactKind = "telegram" | "vk" | "email";

export interface ContactLink {
  kind: ContactKind;
  label: string;
  href: string;
}

export interface NavItem {
  label: string;
  href: `#${string}`;
}

export interface Project {
  id: string;
  title: string;
  category: string;
  /** One paragraph explaining the case. Replaces the old idea/result pair. */
  summary: string;
  cover?: string;
  alt: string;
  isPublished: boolean;
  isPlaceholder: boolean;
}

export interface Service {
  id: string;
  title: string;
  summary: string;
  price: string;
  result: string;
  details: string[];
}

export type ProductId = "consultation" | "ai-course" | "figma-mentoring";

export interface Product {
  id: ProductId;
  /** Route segment of the dedicated product page, e.g. "consultation". */
  slug: string;
  title: string;
  contextLine: string;
  audience: string;
  outcome: string;
  format: string;
  included: string[];
  price: string;
  ctaLabel: string;
}

/** A named phase of the working process, rendered as a paragraph when it has
 * one line or a bullet list when it has several. */
export interface ProductPageStep {
  title: string;
  body: string[];
}

/**
 * Full long-form page for one product — the 10-part structure: familiar
 * problem, approach, process, what remains, who it's not for, objections,
 * price, one action. "Примеры" (proof) is deliberately absent from the shape:
 * it only exists once real material comes in, same rule as `proofs.ts`.
 */
export interface ProductPageContent {
  id: ProductId;
  slug: string;
  heroTitle: string;
  heroIntro: string;
  problem: string;
  situations: string[];
  approach: string[];
  processTitle: string;
  processSteps: ProductPageStep[];
  processNote?: string;
  whatRemainsTitle: string;
  whatRemains: string[];
  notForTitle: string;
  notFor: string[];
  objections?: { question: string; answer: string }[];
  price: string;
  ctaLabel: string;
}

export interface Principle {
  id: string;
  /** Two-digit marker shown while there is no illustration. */
  index: string;
  title: string;
  body: string;
  illustration: { src: string; alt: string } | null;
}

export interface Thought {
  id: string;
  title: string;
  body: string;
  /** Where the thought is shown: the "Мысли" block (9) or teaching context (11). */
  placement: "thoughts" | "teaching";
  futureSlug?: string;
  linkEnabled: boolean;
}

export interface Proof {
  id: string;
  value: string;
  label: string;
  sourceNote?: string;
}

export interface Testimonial {
  id: string;
  quote: string;
  author: string;
  role: string;
  project?: string;
}

export interface FaqItem {
  id: string;
  question: string;
  answer: string;
}

