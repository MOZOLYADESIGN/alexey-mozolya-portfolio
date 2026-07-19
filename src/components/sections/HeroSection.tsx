import { HeroMedia } from "@/components/sections/HeroMedia";
import { ContactLink } from "@/components/ui/ContactLink";
import { siteConfig } from "@/content/site";
import { HERO_CTA_ID } from "@/lib/anchors";

import styles from "./HeroSection.module.css";

export function HeroSection() {
  const { eyebrow, titleLead, titleAccent, subtitle } = siteConfig.hero;

  return (
    <section id="top" className={styles.hero} aria-labelledby="hero-title">
      <div className={styles.copy}>
        <p className={styles.eyebrow}>{eyebrow}</p>
        <h1 className={styles.title} id="hero-title">
          {titleLead} <span className={styles.titleAccent}>{titleAccent}</span>
        </h1>
        <p className={styles.subtitle}>{subtitle}</p>
        <div className={styles.actions}>
          <ContactLink id={HERO_CTA_ID} className={styles.primary}>
            Написать в Telegram
          </ContactLink>
          <a className={styles.secondary} href="#projects">
            Смотреть работы
          </a>
        </div>
      </div>

      <HeroMedia />
    </section>
  );
}
