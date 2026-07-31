import {
  aboutBody,
  aboutBodyIsPlaceholder,
  aboutPortrait,
  aboutTitle,
  principles,
} from "@/content/about";
import { Abstract } from "@/components/ui/Abstract";

import styles from "./AboutSection.module.css";

export function AboutSection() {
  return (
    <section id="about" className={styles.about} aria-labelledby="about-title">
      <div className={styles.intro}>
        <div className={styles.portraitFrame} data-testid="about-portrait">
          {aboutPortrait.src ? (
            /* eslint-disable-next-line @next/next/no-img-element -- static export, explicit dimensions, no optimizer */
            <img
              className={styles.portrait}
              src={aboutPortrait.src}
              width={aboutPortrait.width}
              height={aboutPortrait.height}
              alt={aboutPortrait.alt}
              loading="lazy"
              decoding="async"
            />
          ) : (
            // No invented image: an honest empty frame that holds the exact
            // ratio the real portrait will take.
            <div className={styles.portraitPlaceholder} aria-hidden="true">
              <span>Портрет</span>
            </div>
          )}
        </div>

        <div className={styles.copy}>
          <h2 className={styles.title} id="about-title">
            {aboutTitle}
          </h2>
          {/* Invisible to readers, but greppable — final QA fails while any
              placeholder copy is still in the build. */}
          <div data-placeholder-copy={aboutBodyIsPlaceholder ? "true" : undefined}>
            {aboutBody.map((paragraph) => (
              <p className={styles.paragraph} key={paragraph.slice(0, 24)}>
                {paragraph}
              </p>
            ))}
          </div>
        </div>
      </div>

      <ul className={styles.principles}>
        {principles.map((principle, index) => (
          <li className={styles.principle} key={principle.id}>
            <div className={styles.principleMedia}>
              {principle.illustration ? (
                /* eslint-disable-next-line @next/next/no-img-element -- static export, explicit dimensions, no optimizer */
                <img
                  className={styles.principleImage}
                  src={principle.illustration.src}
                  alt={principle.illustration.alt}
                  loading="lazy"
                  decoding="async"
                />
              ) : (
                <Abstract seed={index} className={styles.principleAbstract} />
              )}
              {/* The visual dissolves into the card so the copy reads as part
                  of the same object, not as a caption under a picture. */}
              <span className={styles.principleFade} aria-hidden="true" />
            </div>
            <div className={styles.principleText}>
              <h3 className={styles.principleTitle}>{principle.title}</h3>
              <p className={styles.principleBody}>{principle.body}</p>
            </div>
          </li>
        ))}
      </ul>
    </section>
  );
}
