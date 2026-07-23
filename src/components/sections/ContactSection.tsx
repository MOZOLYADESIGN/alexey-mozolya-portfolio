import { ContactLink } from "@/components/ui/ContactLink";
import { siteConfig } from "@/content/site";

import styles from "./ContactSection.module.css";

export function ContactSection() {
  const secondary = siteConfig.contacts.filter((contact) => contact.kind !== "telegram");

  return (
    <section id="contact" className={styles.contact} aria-labelledby="contact-title">
      <div className={styles.panel}>
        <p className={styles.eyebrow}>Контакты</p>
        <h2 className={styles.title} id="contact-title">
          Расскажите, что нужно усилить
        </h2>
        <p className={styles.subtitle}>
          Напишите в Telegram — отвечаю лично, в течение рабочего дня. Посмотрим на задачу
          вместе и решим, чем я могу помочь.
        </p>

        <ContactLink className={styles.cta}>Написать в Telegram</ContactLink>

        <p className={styles.secondary}>
          Не любите Telegram?{" "}
          {secondary.map((contact, index) => (
            <span key={contact.kind}>
              {index > 0 ? " · " : null}
              <a className={styles.secondaryLink} href={contact.href}>
                {contact.label}
              </a>
            </span>
          ))}
        </p>
      </div>
    </section>
  );
}
