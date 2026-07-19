import { siteConfig } from "@/content/site";
import { ContactLink } from "@/components/ui/ContactLink";

export function DesktopNav() {
  return (
    <nav className="desktop-nav" aria-label="Основная навигация">
      <a className="brand-link" href="#top">
        {siteConfig.name}
      </a>
      <ul>
        {siteConfig.navigation.map((item) => (
          <li key={item.href}>
            <a href={item.href}>{item.label}</a>
          </li>
        ))}
      </ul>
      <ContactLink>Telegram</ContactLink>
    </nav>
  );
}

