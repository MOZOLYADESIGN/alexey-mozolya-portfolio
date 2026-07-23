import { thoughtsFor } from "@/content/thoughts";

import styles from "./ThoughtsSection.module.css";

export function ThoughtsSection() {
  const items = thoughtsFor("thoughts");

  if (items.length === 0) return null;

  return (
    <section id="thoughts" className={styles.thoughts} aria-labelledby="thoughts-title">
      <div className={styles.header}>
        <p className={styles.eyebrow}>Мысли</p>
        <h2 className={styles.title} id="thoughts-title">
          Как я смотрю на дизайн и продукты
        </h2>
      </div>

      <div className={styles.list}>
        {items.map((thought, index) => (
          <article className={styles.item} key={thought.id}>
            <span className={styles.index} aria-hidden="true">
              {String(index + 1).padStart(2, "0")}
            </span>
            <div className={styles.itemBody}>
              <h3 className={styles.itemTitle}>{thought.title}</h3>
              <p className={styles.itemText}>{thought.body}</p>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
