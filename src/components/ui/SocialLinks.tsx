import type { SVGProps } from "react";

import { siteConfig } from "@/content/site";
import type { ContactKind } from "@/lib/types";

import styles from "./SocialLinks.module.css";

const filled: SVGProps<SVGSVGElement> = {
  viewBox: "0 0 24 24",
  fill: "currentColor",
  "aria-hidden": true,
  focusable: false,
};

function IconTelegram(props: SVGProps<SVGSVGElement>) {
  return (
    <svg {...filled} {...props}>
      <path d="M9.78 18.65l.28-4.23 7.68-6.92c.34-.31-.07-.46-.52-.19L7.74 13.3 3.64 12c-.88-.25-.89-.86.2-1.3l15.97-6.16c.73-.33 1.43.18 1.15 1.3l-2.72 12.81c-.19.91-.74 1.13-1.5.71L12.6 16.3l-1.99 1.93c-.23.23-.42.42-.83.42z" />
    </svg>
  );
}

function IconVk(props: SVGProps<SVGSVGElement>) {
  return (
    <svg {...filled} {...props}>
      <path d="M13.16 18.2c-6.1 0-9.58-4.18-9.72-11.14h3.06c.1 5.11 2.35 7.27 4.13 7.72V7.06h2.88v4.41c1.76-.19 3.6-2.19 4.22-4.41h2.88c-.48 2.73-2.48 4.73-3.9 5.56 1.42.67 3.7 2.42 4.57 5.58h-3.17c-.68-2.12-2.36-3.76-4.6-3.99v3.99z" />
    </svg>
  );
}

function IconMail(props: SVGProps<SVGSVGElement>) {
  return (
    <svg {...filled} {...props}>
      {/* Envelope: the flap is a subtracted subpath, so it needs even-odd. */}
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M4 5h16a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V7a2 2 0 0 1 2-2Zm.9 2 7.1 5.2L19.1 7H4.9Z"
      />
    </svg>
  );
}

const ICONS: Record<ContactKind, (props: SVGProps<SVGSVGElement>) => React.ReactElement> = {
  telegram: IconTelegram,
  vk: IconVk,
  email: IconMail,
};

interface SocialLinksProps {
  /** Leave out the kinds already covered by a primary button nearby. */
  exclude?: ContactKind[];
  className?: string;
}

/**
 * Round monochrome buttons, one per contact. The label lives in `aria-label`,
 * since the glyph alone names nothing to a screen reader.
 */
export function SocialLinks({ exclude = [], className }: SocialLinksProps) {
  const contacts = siteConfig.contacts.filter((contact) => !exclude.includes(contact.kind));

  return (
    <ul className={className ? `${styles.list} ${className}` : styles.list}>
      {contacts.map((contact) => {
        const Icon = ICONS[contact.kind];
        return (
          <li key={contact.kind}>
            <a className={styles.button} href={contact.href} aria-label={contact.label}>
              <Icon className={styles.icon} />
            </a>
          </li>
        );
      })}
    </ul>
  );
}
