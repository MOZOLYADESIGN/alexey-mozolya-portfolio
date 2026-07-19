import { ContactLink } from "@/components/ui/ContactLink";
import { siteConfig } from "@/content/site";

export function HeroSection() {
  return (
    <section id="top" className="hero" aria-labelledby="hero-title">
      <div className="hero__copy">
        <p className="eyebrow">{siteConfig.hero.eyebrow}</p>
        <h1 id="hero-title">{siteConfig.hero.title}</h1>
        <p>{siteConfig.hero.subtitle}</p>
        <div className="hero__actions">
          <ContactLink>Написать в Telegram</ContactLink>
          <a href="#projects">Смотреть работы</a>
        </div>
      </div>
      <div className="hero__media" aria-label="TODO: портрет Алексея и абстрактный объект">
        <div className="hero__object" aria-hidden="true" />
        <p>TODO: poster / head.webm / object.webm</p>
      </div>
    </section>
  );
}

