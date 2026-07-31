import styles from "./Abstract.module.css";

const VARIANTS = 6;

interface AbstractProps {
  /** Any integer; the variant repeats every six so lists stay varied. */
  seed: number;
  className?: string;
}

/** Decorative gradient mesh. Always `aria-hidden` — it carries no meaning. */
export function Abstract({ seed, className }: AbstractProps) {
  const variant = ((seed % VARIANTS) + VARIANTS) % VARIANTS;

  return (
    <span
      className={className ? `${styles.abstract} ${className}` : styles.abstract}
      data-variant={variant}
      aria-hidden="true"
    />
  );
}
