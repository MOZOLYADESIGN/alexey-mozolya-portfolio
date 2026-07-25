import { ContactLink } from "@/components/ui/ContactLink";
import { heroTitle, siteConfig } from "@/content/site";
import { HERO_CTA_ID } from "@/lib/anchors";

import styles from "./HeroSection.module.css";

export function HeroSection() {
  const { eyebrow, subtitle } = siteConfig.hero;

  return (
    <section id="top" className={styles.hero} aria-labelledby="hero-title">
      {/* Concentric rings pulse toward the middle, drawing the eye to center. */}
      <div className={styles.rings} aria-hidden="true">
        <span className={styles.ring} />
        <span className={styles.ring} />
        <span className={styles.ring} />
        <span className={styles.ring} />
        <span className={styles.ring} />
      </div>
      {/* A background-colour wash melts the rings away behind the text. */}
      <div className={styles.fade} aria-hidden="true" />

      <div className={styles.copy}>
        {/* eslint-disable-next-line @next/next/no-img-element -- static export, explicit dimensions, no optimizer */}
        <img
          className={styles.invite}
          src="/media/hero/hero-invite.webp"
          width={900}
          height={977}
          alt="Алексей Мозоля приглашает к сотрудничеству"
          fetchPriority="high"
        />
        <p className={styles.eyebrow}>{eyebrow}</p>
        <h1 className={styles.title} id="hero-title">
          {heroTitle}
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
    </section>
  );
}
