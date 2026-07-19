import { SectionShell } from "@/components/ui/SectionShell";
import { faqItems } from "@/content/faq";

export function FaqSection() {
  return (
    <SectionShell id="faq" eyebrow="FAQ" title="Перед началом работы">
      {faqItems.map((item) => (
        <details key={item.id}>
          <summary>{item.question}</summary>
          <p>{item.answer}</p>
        </details>
      ))}
    </SectionShell>
  );
}

