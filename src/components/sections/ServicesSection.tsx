"use client";

import { useRef, type MouseEvent } from "react";

import { ContactLink } from "@/components/ui/ContactLink";
import { services } from "@/content/services";

import styles from "./ServicesSection.module.css";

const DURATION = 300;

export function ServicesSection() {
  const listRef = useRef<HTMLDivElement>(null);
  // One running animation per card, so a fast re-click cancels the previous.
  const anims = useRef(new WeakMap<HTMLElement, Animation>()).current;

  const prefersReduced = () =>
    typeof window !== "undefined" &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  const bodyOf = (details: HTMLDetailsElement) =>
    details.querySelector<HTMLElement>(`.${styles.body}`);

  const open = (details: HTMLDetailsElement) => {
    const body = bodyOf(details);
    details.open = true;
    if (!body || prefersReduced()) return;

    anims.get(body)?.cancel();
    const target = body.scrollHeight;
    const anim = body.animate(
      { height: ["0px", `${target}px`], opacity: [0, 1] },
      { duration: DURATION, easing: "cubic-bezier(0.22, 0.61, 0.36, 1)" },
    );
    anims.set(body, anim);
    anim.onfinish = () => {
      body.style.height = "";
      anims.delete(body);
    };
  };

  const close = (details: HTMLDetailsElement) => {
    const body = bodyOf(details);
    if (!body || prefersReduced()) {
      details.open = false;
      return;
    }

    anims.get(body)?.cancel();
    const start = body.scrollHeight;
    const anim = body.animate(
      { height: [`${start}px`, "0px"], opacity: [1, 0] },
      { duration: DURATION, easing: "cubic-bezier(0.22, 0.61, 0.36, 1)" },
    );
    anims.set(body, anim);
    anim.onfinish = () => {
      details.open = false;
      body.style.height = "";
      anims.delete(body);
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
