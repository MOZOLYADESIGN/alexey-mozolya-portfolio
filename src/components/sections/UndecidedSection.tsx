import Link from "next/link";

import styles from "./UndecidedSection.module.css";

export function UndecidedSection() {
  return (
    <section id="undecided" className={styles.undecided} aria-labelledby="undecided-title">
      <div className={styles.panel}>
        <h2 className={styles.title} id="undecided-title">
          Не уверены, что выбрать
        </h2>
        <p className={styles.body}>
          Опишите задачу без выбора услуги. Я посмотрю контекст и предложу подходящий формат или
          прямо скажу, если текущие продукты не решают проблему.
        </p>
        <Link className={styles.cta} href="/request">
          Описать задачу
        </Link>
      </div>
    </section>
  );
}
