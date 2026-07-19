"use client";

import { ContactLink } from "@/components/ui/ContactLink";
import { siteConfig } from "@/content/site";
import { useActiveSection, useIsCompact } from "@/lib/useNavState";

import styles from "./DesktopNav.module.css";

const navHrefs = siteConfig.navigation.map((item) => item.href);

export function DesktopNav() {
  const isCompact = useIsCompact();
  const activeHref = useActiveSection(navHrefs);

  return (
    <nav
      className={styles.nav}
      aria-label="Основная навигация"
      data-compact={isCompact}
    >
      <div className={styles.inner}>
        <a className={styles.brand} href="#top">
          {siteConfig.name}
        </a>
        <ul className={styles.list}>
          {siteConfig.navigation.map((item) => (
            <li key={item.href}>
              <a
                className={styles.link}
                href={item.href}
                aria-current={activeHref === item.href ? "true" : undefined}
              >
                {item.label}
              </a>
            </li>
          ))}
        </ul>
        <ContactLink className={styles.cta}>Telegram</ContactLink>
      </div>
    </nav>
  );
}
