import type { ReactNode } from "react";

interface SectionShellProps {
  id: string;
  eyebrow?: string;
  title: string;
  children: ReactNode;
}

export function SectionShell({ id, eyebrow, title, children }: SectionShellProps) {
  return (
    <section id={id} className="section-shell" aria-labelledby={`${id}-title`}>
      <div className="section-shell__inner">
        {eyebrow ? <p className="eyebrow">{eyebrow}</p> : null}
        <h2 id={`${id}-title`}>{title}</h2>
        {children}
      </div>
    </section>
  );
}

