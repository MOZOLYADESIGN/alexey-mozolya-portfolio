import { siteConfig } from "@/content/site";
import { ContactLink } from "@/components/ui/ContactLink";

export function MobileNav() {
  return (
    <nav className="mobile-nav" aria-label="Мобильная навигация">
      <ContactLink>Telegram</ContactLink>
      <details>
        <summary>Меню</summary>
        <div className="mobile-nav__drawer">
          <p>{siteConfig.name}</p>
          <ul>
            {siteConfig.navigation.map((item) => (
              <li key={item.href}>
                <a href={item.href}>{item.label}</a>
              </li>
            ))}
          </ul>
        </div>
      </details>
    </nav>
  );
}

