"use client";

import { useRef, type MouseEvent } from "react";

import { ContactLink } from "@/components/ui/ContactLink";
import { faqItems } from "@/content/faq";

import styles from "./FaqSection.module.css";

const OPEN_MS = 380;
const CLOSE_MS = 240;
const EASE_OPEN = "cubic-bezier(0.16, 1, 0.3, 1)";
const EASE_CLOSE = "cubic-bezier(0.4, 0, 0.6, 1)";

export function FaqSection() {
  const listRef = useRef<HTMLDivElement>(null);

  const prefersReduced = () =>
    typeof window !== "undefined" &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  const bodyOf = (details: HTMLDetailsElement) =>
    details.querySelector<HTMLElement>(`.${styles.body}`);

  const cancelRunning = (body: HTMLElement) => {
    for (const anim of body.getAnimations()) anim.cancel();
    const inner = body.firstElementChild;
    if (inner) for (const anim of inner.getAnimations()) anim.cancel();
  };

  const open = (details: HTMLDetailsElement) => {
    const body = bodyOf(details);
    details.open = true;
    if (!body || prefersReduced()) return;

    cancelRunning(body);
    const target = body.scrollHeight;
    const height = body.animate(
      { height: ["0px", `${target}px`] },
      { duration: OPEN_MS, easing: EASE_OPEN },
    );
    body.firstElementChild?.animate(
      { opacity: [0, 1], transform: ["translateY(8px)", "translateY(0)"] },
      { duration: OPEN_MS, easing: EASE_OPEN, delay: 30, fill: "backwards" },
    );
    height.onfinish = () => {
      body.style.height = "";
    };
  };

  const close = (details: HTMLDetailsElement) => {
    const body = bodyOf(details);
    if (!body || prefersReduced()) {
      details.open = false;
      return;
    }

    cancelRunning(body);
    const start = body.scrollHeight;
    const height = body.animate(
      { height: [`${start}px`, "0px"] },
      { duration: CLOSE_MS, easing: EASE_CLOSE },
    );
    height.onfinish = () => {
      details.open = false;
      body.style.height = "";
    };
  };

  const handleSummaryClick = (event: MouseEvent<HTMLElement>) => {
    event.preventDefault();
    const details = event.currentTarget.parentElement as HTMLDetailsElement;

    if (details.open) {
      close(details);
      return;
    }

    // One question open at a time, like the reference.
    for (const other of listRef.current?.querySelectorAll("details") ?? []) {
      if (other !== details && other.open) close(other as HTMLDetailsElement);
    }
    open(details);
  };

  return (
    <section id="faq" className={styles.faq} aria-labelledby="faq-title">
      <div className={styles.header}>
        <h2 className={styles.title} id="faq-title">
          Частые вопросы
        </h2>
      </div>

      <div className={styles.list} ref={listRef}>
        {faqItems.map((item, index) => (
          <details className={styles.item} key={item.id}>
            <summary className={styles.summary} onClick={handleSummaryClick}>
              <span className={styles.num}>{String(index + 1).padStart(2, "0")}</span>
              <span className={styles.question}>{item.question}</span>
              <span className={styles.toggle} aria-hidden="true">
                <span className={styles.marker} />
              </span>
            </summary>

            <div className={styles.body}>
              <div className={styles.bodyInner}>
                <p className={styles.answer}>{item.answer}</p>
              </div>
            </div>
          </details>
        ))}
      </div>

      <p className={styles.footer}>
        Остались вопросы?{" "}
        <ContactLink className={styles.footerLink}>Напишите в Telegram</ContactLink>
      </p>
    </section>
  );
}
