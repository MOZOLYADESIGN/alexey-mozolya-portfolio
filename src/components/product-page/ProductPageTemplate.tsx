import Link from "next/link";

import type { ProductPageContent } from "@/lib/types";

import styles from "./ProductPageTemplate.module.css";

export function ProductPageTemplate({ content }: { content: ProductPageContent }) {
  const requestHref = `/request?product=${content.id}`;

  return (
    <article className={styles.page}>
      <header className={styles.hero}>
        <Link className={styles.back} href="/">
          ← На главную
        </Link>
        <h1 className={styles.title}>{content.heroTitle}</h1>
        <p className={styles.intro}>{content.heroIntro}</p>
        <div className={styles.actionRow}>
          <span className={styles.price}>{content.price}</span>
          <Link className={styles.cta} href={requestHref}>
            {content.ctaLabel}
          </Link>
        </div>
      </header>

      <section className={styles.section} aria-labelledby="problem-title">
        <h2 className={styles.sectionTitle} id="problem-title">
          Знакомая проблема
        </h2>
        <p className={styles.paragraph}>{content.problem}</p>
        <ul className={styles.list}>
          {content.situations.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
      </section>

      <section className={styles.section} aria-labelledby="approach-title">
        <h2 className={styles.sectionTitle} id="approach-title">
          Подход
        </h2>
        {content.approach.map((paragraph) => (
          <p className={styles.paragraph} key={paragraph.slice(0, 24)}>
            {paragraph}
          </p>
        ))}
      </section>

      <section className={styles.section} aria-labelledby="process-title">
        <h2 className={styles.sectionTitle} id="process-title">
          {content.processTitle}
        </h2>
        <ol className={styles.steps}>
          {content.processSteps.map((step) => (
            <li className={styles.step} key={step.title}>
              <h3 className={styles.stepTitle}>{step.title}</h3>
              {step.body.length > 1 ? (
                <ul className={styles.list}>
                  {step.body.map((line) => (
                    <li key={line}>{line}</li>
                  ))}
                </ul>
              ) : (
                <p className={styles.paragraph}>{step.body[0]}</p>
              )}
            </li>
          ))}
        </ol>
        {content.processNote ? <p className={styles.note}>{content.processNote}</p> : null}
      </section>

      <section className={styles.section} aria-labelledby="remains-title">
        <h2 className={styles.sectionTitle} id="remains-title">
          {content.whatRemainsTitle}
        </h2>
        <ul className={styles.list}>
          {content.whatRemains.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
      </section>

      <section className={styles.section} aria-labelledby="not-for-title">
        <h2 className={styles.sectionTitle} id="not-for-title">
          {content.notForTitle}
        </h2>
        {content.notFor.length > 1 ? (
          <ul className={styles.list}>
            {content.notFor.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        ) : (
          <p className={styles.paragraph}>{content.notFor[0]}</p>
        )}
      </section>

      {content.objections ? (
        <section className={styles.section} aria-labelledby="objections-title">
          <h2 className={styles.sectionTitle} id="objections-title">
            Частые сомнения
          </h2>
          <dl className={styles.objections}>
            {content.objections.map((objection) => (
              <div className={styles.objection} key={objection.question}>
                <dt className={styles.objectionQuestion}>«{objection.question}»</dt>
                <dd className={styles.objectionAnswer}>{objection.answer}</dd>
              </div>
            ))}
          </dl>
        </section>
      ) : null}

      <footer className={styles.actionFooter}>
        <span className={styles.price}>{content.price}</span>
        <Link className={styles.cta} href={requestHref}>
          {content.ctaLabel}
        </Link>
      </footer>
    </article>
  );
}
