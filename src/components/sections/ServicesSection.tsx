"use client";

import { useRef, type SyntheticEvent } from "react";

import { ContactLink } from "@/components/ui/ContactLink";
import { services, servicesHavePlaceholders } from "@/content/services";

import styles from "./ServicesSection.module.css";

export function ServicesSection() {
  const listRef = useRef<HTMLDivElement>(null);

  // Desktop keeps every card independent; on phones the list behaves like an
  // accordion — opening one closes the rest. Enforced in JS rather than the
  // native `name` attribute because that would be exclusive on every width.
  const handleToggle = (event: SyntheticEvent<HTMLDetailsElement>) => {
    const opened = event.currentTarget;
    if (!opened.open) return;
    if (!window.matchMedia("(max-width: 767px)").matches) return;

    for (const card of listRef.current?.querySelectorAll("details") ?? []) {
      if (card !== opened) card.open = false;
    }
  };

  return (
    <section id="services" className={styles.services} aria-labelledby="services-title">
      <div className={styles.header}>
        <p className={styles.eyebrow}>Услуги</p>
        <h2 className={styles.title} id="services-title">
          Форматы работы
        </h2>
      </div>

      <div
        className={styles.list}
        ref={listRef}
        data-placeholder-copy={servicesHavePlaceholders ? "true" : undefined}
      >
        {services.map((service) => (
          <details key={service.id} className={styles.card} onToggle={handleToggle}>
            <summary className={styles.summary}>
              <span className={styles.name}>{service.title}</span>
              <span className={styles.aside}>
                <span className={styles.price}>{service.price}</span>
                <span className={styles.marker} aria-hidden="true" />
              </span>
            </summary>

            <div className={styles.body}>
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
          </details>
        ))}
      </div>
    </section>
  );
}
