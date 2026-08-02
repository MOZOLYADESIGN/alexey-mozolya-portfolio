"use client";

import { useState, type FormEvent } from "react";
import { useSearchParams } from "next/navigation";

import { telegramUrl } from "@/content/site";
import type { ProductId } from "@/lib/types";

import styles from "./RequestForm.module.css";

const PRODUCT_OPTIONS: Array<{ value: ProductId | "undecided"; label: string }> = [
  { value: "consultation", label: "Консультация — разбор продукта и визуальной системы" },
  { value: "ai-course", label: "AI-спринт — рабочий сценарий с нейросетями" },
  { value: "figma-mentoring", label: "Наставничество по Figma" },
  { value: "undecided", label: "Не уверен, что выбрать" },
];

function isProductId(value: string): value is ProductId | "undecided" {
  return PRODUCT_OPTIONS.some((option) => option.value === value);
}

export function RequestForm() {
  const searchParams = useSearchParams();

  // The Suspense boundary around this component already defers its first
  // paint until the query string is known, so reading it into the initial
  // state here never produces a server/client mismatch.
  const [product, setProduct] = useState<ProductId | "undecided" | "">(() => {
    const fromQuery = searchParams.get("product");
    return fromQuery && isProductId(fromQuery) ? fromQuery : "";
  });
  const [name, setName] = useState("");
  const [contact, setContact] = useState("");
  const [situation, setSituation] = useState("");
  const [result, setResult] = useState("");
  const [materials, setMaterials] = useState("");
  const [deadline, setDeadline] = useState("");
  const [sent, setSent] = useState(false);

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const productLabel = PRODUCT_OPTIONS.find((option) => option.value === product)?.label ?? "—";
    const message = [
      "Заявка с сайта",
      "",
      `Имя: ${name}`,
      `Связь: ${contact}`,
      `Продукт: ${productLabel}`,
      `Сейчас: ${situation}`,
      `Нужен результат: ${result}`,
      `Материалы: ${materials || "—"}`,
      `Срок: ${deadline || "—"}`,
    ].join("\n");

    window.open(`${telegramUrl}?text=${encodeURIComponent(message)}`, "_blank", "noopener,noreferrer");
    setSent(true);
  };

  return (
    <>
      <form className={styles.form} onSubmit={handleSubmit}>
        <div className={styles.field}>
          <label className={styles.label} htmlFor="name">
            Имя
          </label>
          <input
            className={styles.input}
            id="name"
            name="name"
            type="text"
            required
            value={name}
            onChange={(event) => setName(event.target.value)}
          />
        </div>

        <div className={styles.field}>
          <label className={styles.label} htmlFor="contact">
            Telegram или другой способ связи
          </label>
          <input
            className={styles.input}
            id="contact"
            name="contact"
            type="text"
            required
            value={contact}
            onChange={(event) => setContact(event.target.value)}
          />
        </div>

        <div className={styles.field}>
          <label className={styles.label} htmlFor="product">
            Какой продукт интересует
          </label>
          <select
            className={styles.select}
            id="product"
            name="product"
            required
            value={product}
            onChange={(event) => setProduct(event.target.value as ProductId | "undecided")}
          >
            <option value="" disabled>
              Выберите вариант
            </option>
            {PRODUCT_OPTIONS.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>

        <div className={styles.field}>
          <label className={styles.label} htmlFor="situation">
            Что происходит сейчас
          </label>
          <textarea
            className={styles.textarea}
            id="situation"
            name="situation"
            required
            value={situation}
            onChange={(event) => setSituation(event.target.value)}
          />
        </div>

        <div className={styles.field}>
          <label className={styles.label} htmlFor="result">
            Какой результат нужен
          </label>
          <textarea
            className={styles.textarea}
            id="result"
            name="result"
            required
            value={result}
            onChange={(event) => setResult(event.target.value)}
          />
        </div>

        <div className={styles.field}>
          <label className={styles.label} htmlFor="materials">
            Ссылка на материалы <span className={styles.optional}>(необязательно)</span>
          </label>
          <input
            className={styles.input}
            id="materials"
            name="materials"
            type="text"
            value={materials}
            onChange={(event) => setMaterials(event.target.value)}
          />
        </div>

        <div className={styles.field}>
          <label className={styles.label} htmlFor="deadline">
            Есть ли конкретный срок <span className={styles.optional}>(необязательно)</span>
          </label>
          <input
            className={styles.input}
            id="deadline"
            name="deadline"
            type="text"
            value={deadline}
            onChange={(event) => setDeadline(event.target.value)}
          />
        </div>

        <button className={styles.submit} type="submit">
          Отправить в Telegram
        </button>
        <p className={styles.mechanism}>
          Форма ничего не хранит и не отправляет сама. По кнопке откроется Telegram с уже
          собранным текстом заявки — останется проверить его и нажать «Отправить».
        </p>
      </form>

      {sent ? (
        <p className={styles.confirmation} role="status">
          Я посмотрю описание и материалы, после чего предложу подходящий формат работы и
          следующий шаг — как только вы отправите сообщение в Telegram.
        </p>
      ) : null}
    </>
  );
}
