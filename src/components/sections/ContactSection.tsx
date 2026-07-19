import { ContactLink } from "@/components/ui/ContactLink";
import { SectionShell } from "@/components/ui/SectionShell";

export function ContactSection() {
  return (
    <SectionShell id="contact" eyebrow="Контакты" title="Расскажите, что нужно усилить">
      <p>Изучу задачу и отвечу в течение рабочего дня.</p>
      <ContactLink>Написать в Telegram</ContactLink>
    </SectionShell>
  );
}

