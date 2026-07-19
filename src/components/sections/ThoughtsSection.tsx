import { SectionShell } from "@/components/ui/SectionShell";
import { thoughts } from "@/content/thoughts";

export function ThoughtsSection() {
  if (thoughts.length === 0) return null;

  return (
    <SectionShell id="thoughts" eyebrow="Мысли" title="Наблюдения о дизайне и продуктах">
      {thoughts.map((thought) => (
        <article key={thought.id}>
          <h3>{thought.title}</h3>
          <p>{thought.body}</p>
        </article>
      ))}
    </SectionShell>
  );
}

