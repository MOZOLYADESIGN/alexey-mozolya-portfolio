import { SectionShell } from "@/components/ui/SectionShell";

const steps = ["Знакомство", "Анализ", "Концепция", "Реализация"];

export function ProcessSection() {
  return (
    <SectionShell id="process" eyebrow="Процесс" title="Четыре понятных этапа">
      <ol>
        {steps.map((step) => (
          <li key={step}>{step}</li>
        ))}
      </ol>
    </SectionShell>
  );
}

