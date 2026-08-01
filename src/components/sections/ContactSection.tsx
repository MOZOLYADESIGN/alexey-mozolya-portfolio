import { ContactLink } from "@/components/ui/ContactLink";
import { SocialLinks } from "@/components/ui/SocialLinks";

import styles from "./ContactSection.module.css";

export function ContactSection() {
  return (
    <section id="contact" className={styles.contact} aria-labelledby="contact-title">
      <div className={styles.panel}>
        <h2 className={styles.title} id="contact-title">
          Расскажите, что нужно усилить
        </h2>
        <p className={styles.subtitle}>
          Напишите в Telegram — отвечаю лично, в течение рабочего дня. Посмотрим на задачу
          вместе и решим, чем я могу помочь.
        </p>

        <ContactLink className={styles.cta}>Написать в Telegram</ContactLink>

        <p className={styles.secondary}>Не любите Telegram?</p>
        <SocialLinks className={styles.socials} exclude={["telegram"]} />
      </div>
    </section>
  );
}
