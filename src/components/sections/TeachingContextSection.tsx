import { IconCanvas, IconPeople } from "@/components/ui/icons";
import { teaching, teachingThoughtIcon } from "@/content/teaching";
import { thoughtsFor } from "@/content/thoughts";

import styles from "./TeachingContextSection.module.css";

const icons = {
  canvas: IconCanvas,
  people: IconPeople,
};

export function TeachingContextSection() {
  const notes = thoughtsFor("teaching");

  return (
    <section id="teaching" className={styles.teaching} aria-labelledby="teaching-title">
      <div className={styles.header}>
        <h2 className={styles.title} id="teaching-title">
          {teaching.title}
        </h2>
        <p className={styles.intro}>{teaching.intro}</p>
      </div>

      {notes.length > 0 ? (
        <ul className={styles.cards}>
          {notes.map((note) => {
            const Icon = icons[teachingThoughtIcon[note.id] ?? "canvas"];
            return (
              <li className={styles.card} key={note.id}>
                <span className={styles.chip}>
                  <Icon className={styles.icon} />
                </span>
                <h3 className={styles.cardTitle}>{note.title}</h3>
                <p className={styles.cardBody}>{note.body}</p>
              </li>
            );
          })}
        </ul>
      ) : null}
    </section>
  );
}
