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
  gradient?: string;
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

export interface Product {
  id: "consultation" | "ai-course" | "figma-mentoring";
  title: string;
  contextLine: string;
  audience: string;
  outcome: string;
  format: string;
  included: string[];
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

