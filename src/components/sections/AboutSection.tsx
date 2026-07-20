import { aboutBody, aboutPortrait, aboutTitle, principles } from "@/content/about";

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
          <p className={styles.eyebrow}>Обо мне</p>
          <h2 className={styles.title} id="about-title">
            {aboutTitle}
          </h2>
          {aboutBody.map((paragraph) => (
            <p className={styles.paragraph} key={paragraph.slice(0, 24)}>
              {paragraph}
            </p>
          ))}
        </div>
      </div>

      <ul className={styles.principles}>
        {principles.map((principle) => (
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
                <span className={styles.principleIndex} aria-hidden="true">
                  {principle.index}
                </span>
              )}
            </div>
            <h3 className={styles.principleTitle}>{principle.title}</h3>
            <p className={styles.principleBody}>{principle.body}</p>
          </li>
        ))}
      </ul>
    </section>
  );
}
