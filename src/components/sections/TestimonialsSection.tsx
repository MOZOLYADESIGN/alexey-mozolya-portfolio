import { SectionShell } from "@/components/ui/SectionShell";
import { testimonials } from "@/content/testimonials";

export function TestimonialsSection() {
  if (testimonials.length === 0) return null;

  return (
    <SectionShell id="testimonials" eyebrow="Отзывы" title="Что говорят после совместной работы">
      {testimonials.map((testimonial) => (
        <figure key={testimonial.id}>
          <blockquote>{testimonial.quote}</blockquote>
          <figcaption>
            {testimonial.author}, {testimonial.role}
          </figcaption>
        </figure>
      ))}
    </SectionShell>
  );
}

