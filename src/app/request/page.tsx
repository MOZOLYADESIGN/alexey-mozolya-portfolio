import type { Metadata } from "next";
import { Suspense } from "react";
import Link from "next/link";

import { RequestForm } from "@/components/request/RequestForm";

import styles from "./page.module.css";

export const metadata: Metadata = {
  title: "Описать задачу — Алексей Мозоля",
  description:
    "Расскажите, что происходит сейчас и какой результат нужен — предложу подходящий формат работы.",
};

export default function RequestPage() {
  return (
    <main id="main-content" className={styles.page}>
      <Link className={styles.back} href="/">
        ← На главную
      </Link>
      <h1 className={styles.title}>Опишите задачу</h1>
      <p className={styles.intro}>
        Заполните форму — я посмотрю контекст и предложу подходящий формат или прямо скажу, если
        текущие продукты не решают проблему.
      </p>
      <Suspense>
        <RequestForm />
      </Suspense>
    </main>
  );
}
