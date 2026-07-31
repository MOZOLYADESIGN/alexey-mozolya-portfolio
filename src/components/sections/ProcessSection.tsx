import { processSteps } from "@/content/process";
import { IconLayers, IconSearch, IconSend, IconSpark } from "@/components/ui/icons";

import styles from "./ProcessSection.module.css";

const icons: Record<string, typeof IconSearch> = {
  discovery: IconSearch,
  analysis: IconLayers,
  concept: IconSpark,
  delivery: IconSend,
};

export function ProcessSection() {
  return (
    <section id="process" className={styles.process} aria-labelledby="process-title">
      <div className={styles.header}>
        <h2 className={styles.title} id="process-title">
          Как проходит работа
        </h2>
        <p className={styles.lead}>
          Понятный путь от первого разговора до готового продукта. Никакой магии — только
          последовательные шаги, на каждом из которых видно, что происходит и зачем.
        </p>
      </div>

      <ol className={styles.list}>
        {processSteps.map((step) => {
          const Icon = icons[step.id];
          return (
            <li className={styles.step} key={step.id}>
              <div className={styles.chipRow}>
                <span className={styles.chip}>
                  <Icon className={styles.icon} />
                </span>
                <span className={styles.index}>{step.index}</span>
              </div>
              <h3 className={styles.stepTitle}>{step.title}</h3>
              <p className={styles.stepBody}>{step.body}</p>
            </li>
          );
        })}
      </ol>
    </section>
  );
}
