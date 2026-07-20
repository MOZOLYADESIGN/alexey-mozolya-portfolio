import { ContactLink } from "@/components/ui/ContactLink";
import { projects, projectsArePlaceholders } from "@/content/projects";

import styles from "./ProjectsSection.module.css";

export function ProjectsSection() {
  const visibleProjects = projects.filter((project) => project.isPublished);

  if (visibleProjects.length === 0) return null;

  return (
    <section id="projects" className={styles.projects} aria-labelledby="projects-title">
      <div className={styles.header}>
        <p className={styles.eyebrow}>Работы</p>
        <h2 className={styles.title} id="projects-title">
          Отобранные проекты
        </h2>
      </div>

      <ul
        className={styles.grid}
        data-placeholder-copy={projectsArePlaceholders ? "true" : undefined}
      >
        {visibleProjects.map((project) => (
          <li className={styles.item} key={project.id}>
            <ContactLink
              className={styles.card}
              aria-label={`Обсудить в Telegram: ${project.title}, ${project.category}`}
            >
              <span className={styles.frame}>
                {/* Decorative until a real cover exists — the card is named by
                    its aria-label, so nothing is lost to a screen reader. */}
                <span
                  className={styles.cover}
                  style={project.gradient ? { background: project.gradient } : undefined}
                  aria-hidden="true"
                />
                <span className={styles.panel} data-panel="true">
                  <span className={styles.revealGroup} data-reveal="group">
                    <span className={styles.revealLabel}>Идея</span>
                    <span className={styles.revealLine} data-reveal="line">{project.idea}</span>
                  </span>
                  <span className={styles.revealGroup} data-reveal="group">
                    <span className={styles.revealLabel}>Результат</span>
                    <span className={styles.revealLine} data-reveal="line">{project.result}</span>
                  </span>
                </span>
              </span>

              <span className={styles.meta} data-meta="true">
                <span className={styles.name}>{project.title}</span>
                <span className={styles.category}>{project.category}</span>
              </span>
            </ContactLink>
          </li>
        ))}
      </ul>
    </section>
  );
}
