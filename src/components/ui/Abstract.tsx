import styles from "./Abstract.module.css";

const VARIANTS = 6;

interface AbstractProps extends React.HTMLAttributes<HTMLSpanElement> {
  /** Any integer; the variant repeats every six so lists stay varied. */
  seed: number;
}

/** Decorative gradient mesh. Always `aria-hidden` — it carries no meaning. */
export function Abstract({ seed, className, ...rest }: AbstractProps) {
  const variant = ((seed % VARIANTS) + VARIANTS) % VARIANTS;

  return (
    <span
      {...rest}
      className={className ? `${styles.abstract} ${className}` : styles.abstract}
      data-variant={variant}
      aria-hidden="true"
    />
  );
}
