import type { Project } from "@/lib/types";

const gradients = [
  "linear-gradient(135deg, #315dff, #66e8ff)",
  "linear-gradient(135deg, #ff3f9b, #ff8a6c)",
  "linear-gradient(135deg, #b8ff28, #ffe54d)",
  "linear-gradient(135deg, #7a4dff, #c9e5ff)",
  "linear-gradient(135deg, #ff7a1a, #ffd0bd)",
  "linear-gradient(135deg, #1ed6b3, #3287ff)",
  "linear-gradient(135deg, #ff304f, #ff8bd6)",
  "linear-gradient(135deg, #87ff36, #61d8ff)",
];

export const projects: Project[] = gradients.map((gradient, index) => ({
  id: `project-${String(index + 1).padStart(2, "0")}`,
  title: `Проект ${String(index + 1).padStart(2, "0")}`,
  category: "TODO: категория",
  idea: "TODO: короткая идея проекта",
  result: "TODO: конкретный результат",
  alt: "",
  gradient,
  isPublished: true,
  isPlaceholder: true,
}));

