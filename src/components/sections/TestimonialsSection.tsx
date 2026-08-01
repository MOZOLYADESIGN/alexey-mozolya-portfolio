import { testimonials, testimonialsArePlaceholders } from "@/content/testimonials";

import styles from "./TestimonialsSection.module.css";

export function TestimonialsSection() {
  if (testimonials.length === 0) return null;

  return (
    <section id="testimonials" className={styles.testimonials} aria-labelledby="testimonials-title">
      <div className={styles.header}>
        <h2 className={styles.title} id="testimonials-title">
          Что говорят после совместной работы
        </h2>
      </div>

      {/* The rail scrolls below 1024px, so it must be reachable and labelled
          for anyone driving the page from the keyboard. */}
      <ul
        className={styles.list}
        data-placeholder-copy={testimonialsArePlaceholders ? "true" : undefined}
        tabIndex={0}
        aria-label="Отзывы"
      >
        {testimonials.map((testimonial) => (
          <li className={styles.item} key={testimonial.id}>
            <figure className={styles.card}>
              <span className={styles.quoteMark} aria-hidden="true">
                &ldquo;
              </span>
              <blockquote className={styles.quote}>{testimonial.quote}</blockquote>
              <figcaption className={styles.author}>
                <span className={styles.name}>{testimonial.author}</span>
                <span className={styles.role}>{testimonial.role}</span>
              </figcaption>
            </figure>
          </li>
        ))}
      </ul>
    </section>
  );
}
