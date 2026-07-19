"use client";

import { useCallback, useEffect, useRef } from "react";

import { ContactLink } from "@/components/ui/ContactLink";
import { siteConfig } from "@/content/site";
import { HERO_CTA_ID } from "@/lib/anchors";
import { useIsCompact, useIsElementVisible } from "@/lib/useNavState";

import styles from "./MobileNav.module.css";

export function MobileNav() {
  const isCompact = useIsCompact();
  const drawerRef = useRef<HTMLDialogElement>(null);

  // While the hero CTA is on screen the key action is already available, so
  // the bar carries only the menu. Once the CTA scrolls away, Telegram
  // reappears down here and the menu slides aside to make room.
  const heroCtaVisible = useIsElementVisible(HERO_CTA_ID);
  const showTelegram = !heroCtaVisible;

  // A modal dialog gives focus trapping, Escape and focus restore natively;
  // only background scroll still needs locking.
  const open = useCallback(() => {
    drawerRef.current?.showModal();
    document.body.style.overflow = "hidden";
  }, []);

  const close = useCallback(() => {
    drawerRef.current?.close();
  }, []);

  useEffect(() => {
    const drawer = drawerRef.current;
    if (!drawer) return;

    const onClose = () => {
      document.body.style.overflow = "";
    };

    drawer.addEventListener("close", onClose);
    return () => {
      drawer.removeEventListener("close", onClose);
      document.body.style.overflow = "";
    };
  }, []);

  return (
    <>
      <nav
        className={styles.nav}
        aria-label="Мобильная навигация"
        data-compact={isCompact}
      >
        <ContactLink
          className={`${styles.capsule} ${styles.telegram}`}
          data-visible={showTelegram}
          tabIndex={showTelegram ? undefined : -1}
          aria-hidden={showTelegram ? undefined : true}
        >
          Telegram
        </ContactLink>
        <button
          type="button"
          className={`${styles.capsule} ${styles.menu}`}
          onClick={open}
          aria-haspopup="dialog"
        >
          Меню
        </button>
      </nav>

      <dialog ref={drawerRef} className={styles.drawer} aria-label="Меню разделов">
        <div className={styles.drawerInner}>
          <div className={styles.drawerHead}>
            <p className={styles.drawerTitle}>{siteConfig.name}</p>
            <button
              type="button"
              className={styles.close}
              onClick={close}
              aria-label="Закрыть меню"
            >
              ✕
            </button>
          </div>
          <ul className={styles.drawerList}>
            {siteConfig.navigation.map((item) => (
              <li key={item.href}>
                <a className={styles.drawerLink} href={item.href} onClick={close}>
                  {item.label}
                </a>
              </li>
            ))}
          </ul>
        </div>
      </dialog>
    </>
  );
}
