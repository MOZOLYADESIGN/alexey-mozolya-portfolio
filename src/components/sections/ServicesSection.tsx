import { ContactLink } from "@/components/ui/ContactLink";
import { SectionShell } from "@/components/ui/SectionShell";
import { services } from "@/content/services";

export function ServicesSection() {
  return (
    <SectionShell id="services" eyebrow="Услуги" title="Форматы работы">
      <div className="service-list">
        {services.map((service) => (
          <details key={service.id} className="service-card">
            <summary>
              <span>{service.title}</span>
              <strong>{service.price}</strong>
            </summary>
            <p>{service.summary}</p>
            <p>{service.result}</p>
            {service.details.length > 0 ? (
              <ul>
                {service.details.map((detail) => (
                  <li key={detail}>{detail}</li>
                ))}
              </ul>
            ) : null}
            <ContactLink>Обсудить задачу</ContactLink>
          </details>
        ))}
      </div>
    </SectionShell>
  );
}

