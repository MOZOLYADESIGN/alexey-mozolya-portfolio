import type { ReactNode } from "react";

interface SectionShellProps {
  id: string;
  title: string;
  children: ReactNode;
}

export function SectionShell({ id, title, children }: SectionShellProps) {
  return (
    <section id={id} className="section-shell" aria-labelledby={`${id}-title`}>
      <div className="section-shell__inner">
        <h2 id={`${id}-title`}>{title}</h2>
        {children}
      </div>
    </section>
  );
}

