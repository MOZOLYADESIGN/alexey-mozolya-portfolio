import Link from "next/link";

import { HERO_CTA_ID } from "@/lib/anchors";
import { withBasePath } from "@/lib/basePath";
import { siteConfig } from "@/content/site";

import styles from "./HeroSection.module.css";

export function HeroSection() {
  const { title, subtitle } = siteConfig.hero;

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
          src={withBasePath("/media/hero/hero-invite.webp")}
          width={900}
          height={977}
          alt="Алексей Мозоля приглашает к сотрудничеству"
          fetchPriority="high"
        />
        <h1 className={styles.title} id="hero-title">
          {title}
        </h1>
        <p className={styles.subtitle}>{subtitle}</p>
        <div className={styles.actions}>
          <Link id={HERO_CTA_ID} className={styles.primary} href="/request">
            Разобрать задачу
          </Link>
          <a className={styles.secondary} href="#products">
            Посмотреть услуги
          </a>
        </div>
      </div>
    </section>
  );
}
