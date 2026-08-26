const sectionIds = ["essence", "experience", "about", "contacts"] as const;
type SectionId = (typeof sectionIds)[number];

const navigationLinks = Array.from<HTMLAnchorElement>(document.querySelectorAll("[data-nav] a[href^='#']"));
const mobileNavShell = document.querySelector<HTMLElement>(".mobile-nav-scroll");
const mobileNavToggle = document.querySelector<HTMLButtonElement>(".mobile-nav-toggle");

function setMobileMenu(open: boolean) {
  if (!mobileNavShell || !mobileNavToggle) return;

  mobileNavShell.classList.toggle("is-open", open);
  mobileNavToggle.setAttribute("aria-expanded", String(open));
  mobileNavToggle.setAttribute("aria-label", open ? "Закрыть меню" : "Открыть меню");
}

mobileNavToggle?.addEventListener("click", () => {
  setMobileMenu(mobileNavToggle.getAttribute("aria-expanded") !== "true");
});

document.addEventListener("keydown", (event) => {
  if (event.key !== "Escape" || mobileNavToggle?.getAttribute("aria-expanded") !== "true") return;
  setMobileMenu(false);
  mobileNavToggle.focus();
});

window.matchMedia("(max-width: 405px)").addEventListener("change", (event) => {
  if (!event.matches) setMobileMenu(false);
});

function setActiveSection(id: SectionId) {
  for (const link of navigationLinks) {
    const isActive = link.hash === `#${id}`;
    link.classList.toggle("is-active", isActive);
    if (isActive) link.setAttribute("aria-current", "location");
    else link.removeAttribute("aria-current");
  }
}

const sections = sectionIds
  .map((id) => document.getElementById(id))
  .filter((section): section is HTMLElement => section instanceof HTMLElement);

if ("IntersectionObserver" in window) {
  const visible = new Map<string, IntersectionObserverEntry>();
  const observer = new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        if (entry.isIntersecting) visible.set(entry.target.id, entry);
        else visible.delete(entry.target.id);
      }

      const current = Array.from(visible.values()).sort((a, b) => {
        const readingLine = window.innerHeight * 0.45;
        return Math.abs(a.boundingClientRect.top - readingLine) - Math.abs(b.boundingClientRect.top - readingLine);
      })[0];

      if (current && sectionIds.includes(current.target.id as SectionId)) {
        setActiveSection(current.target.id as SectionId);
      }
    },
    {
      rootMargin: "-32% 0px -34% 0px",
      threshold: [0, 0.25, 0.5, 0.75, 1],
    },
  );

  sections.forEach((section) => observer.observe(section));
}

for (const link of navigationLinks) {
  link.addEventListener("click", () => {
    const id = link.hash.slice(1) as SectionId;
    if (sectionIds.includes(id)) setActiveSection(id);
    setMobileMenu(false);
  });
}
