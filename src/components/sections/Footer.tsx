import { Abstract } from "@/components/ui/Abstract";
import { siteConfig } from "@/content/site";

import styles from "./Footer.module.css";

const year = 2026;

export function Footer() {
  return (
    <footer className={styles.footer}>
      <div className={styles.panel}>
        <div className={styles.top}>
          <div className={styles.brand}>
            <p className={styles.name}>{siteConfig.name}</p>
            <p className={styles.desc}>
              Проектирую сайты и цифровые продукты, развиваю бренды и визуальные системы.
              Работаю удалённо по всей России.
            </p>
          </div>

          <nav className={styles.cols} aria-label="Подвал">
            <div className={styles.col}>
              <p className={styles.colTitle}>Разделы</p>
              <ul className={styles.colList}>
                {siteConfig.navigation.map((item) => (
                  <li key={item.href}>
                    <a className={styles.link} href={item.href}>
                      {item.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            <div className={styles.col}>
              <p className={styles.colTitle}>Контакты</p>
              <ul className={styles.colList}>
                {siteConfig.contacts.map((contact) => (
                  <li key={contact.kind}>
                    <a className={styles.link} href={contact.href}>
                      {contact.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </nav>
        </div>

        <div className={styles.bottom}>
          <p className={styles.copy}>
            © {year} {siteConfig.name}
          </p>
        </div>

        {/* The panel dissolves downward into a generated mesh. It lives in the
            empty band below the copyright line, so no text sits on it. */}
        <div className={styles.wash} aria-hidden="true">
          <Abstract seed={4} className={styles.mesh} />
          <span className={styles.washFade} />
        </div>
      </div>
    </footer>
  );
}
