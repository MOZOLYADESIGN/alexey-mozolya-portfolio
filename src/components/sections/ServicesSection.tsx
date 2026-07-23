"use client";

import { useRef, type MouseEvent } from "react";

import { ContactLink } from "@/components/ui/ContactLink";
import { services } from "@/content/services";

import styles from "./ServicesSection.module.css";

// Snappy but smooth: a quick expressive ease-out for the reveal, a touch
// shorter and calmer on the way back.
const OPEN_MS = 420;
const CLOSE_MS = 260;
const EASE_OPEN = "cubic-bezier(0.16, 1, 0.3, 1)";
const EASE_CLOSE = "cubic-bezier(0.4, 0, 0.6, 1)";

export function ServicesSection() {
  const listRef = useRef<HTMLDivElement>(null);

  const prefersReduced = () =>
    typeof window !== "undefined" &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  const bodyOf = (details: HTMLDetailsElement) =>
    details.querySelector<HTMLElement>(`.${styles.body}`);

  // A fast re-click cancels whatever is mid-flight on this card's parts.
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
    // Content rides in a little behind the box for a livelier reveal.
    body.firstElementChild?.animate(
      { opacity: [0, 1], transform: ["translateY(14px)", "translateY(0)"] },
      { duration: OPEN_MS, easing: EASE_OPEN, delay: 40, fill: "backwards" },
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
    body.firstElementChild?.animate(
      { opacity: [1, 0], transform: ["translateY(0)", "translateY(8px)"] },
      { duration: CLOSE_MS, easing: EASE_CLOSE },
    );
    height.onfinish = () => {
      details.open = false;
      body.style.height = "";
    };
  };

  const handleSummaryClick = (event: MouseEvent<HTMLElement>) => {
    // Take over the toggle so open and close can both animate.
    event.preventDefault();
    const details = event.currentTarget.parentElement as HTMLDetailsElement;

    if (details.open) {
      close(details);
      return;
    }

    // Phones behave like an accordion: opening one closes the rest.
    if (window.matchMedia("(max-width: 767px)").matches) {
      for (const other of listRef.current?.querySelectorAll("details") ?? []) {
        if (other !== details && other.open) close(other as HTMLDetailsElement);
      }
    }

    open(details);
  };

  return (
    <section id="services" className={styles.services} aria-labelledby="services-title">
      <div className={styles.header}>
        <p className={styles.eyebrow}>Услуги</p>
        <h2 className={styles.title} id="services-title">
          Форматы работы
        </h2>
      </div>

      <div className={styles.list} ref={listRef}>
        {services.map((service) => (
          <details key={service.id} className={styles.card}>
            <summary className={styles.summary} onClick={handleSummaryClick}>
              <span className={styles.name}>{service.title}</span>
              <span className={styles.aside}>
                <span className={styles.price}>{service.price}</span>
                <span className={styles.marker} aria-hidden="true" />
              </span>
            </summary>

            <div className={styles.body}>
              <div className={styles.bodyInner}>
                <p className={styles.text}>{service.summary}</p>
                <p className={styles.result}>{service.result}</p>
                {service.details.length > 0 ? (
                  <ul className={styles.details}>
                    {service.details.map((detail) => (
                      <li key={detail}>{detail}</li>
                    ))}
                  </ul>
                ) : null}
                <ContactLink className={styles.cta}>Обсудить задачу</ContactLink>
              </div>
            </div>
          </details>
        ))}
      </div>
    </section>
  );
}
