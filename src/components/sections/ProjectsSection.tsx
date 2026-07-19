import { ContactLink } from "@/components/ui/ContactLink";
import { SectionShell } from "@/components/ui/SectionShell";
import { projects } from "@/content/projects";

export function ProjectsSection() {
  const visibleProjects = projects.filter((project) => project.isPublished);

  return (
    <SectionShell id="projects" eyebrow="Работы" title="Отобранные проекты">
      <div className="project-grid">
        {visibleProjects.map((project) => (
          <ContactLink className="project-card" key={project.id}>
            <span
              className="project-card__cover"
              style={project.gradient ? { background: project.gradient } : undefined}
              aria-hidden={project.isPlaceholder}
            />
            <span className="project-card__meta">
              <strong>{project.title}</strong>
              <span>{project.category}</span>
            </span>
            <span className="project-card__reveal">
              <span>{project.idea}</span>
              <span>{project.result}</span>
            </span>
          </ContactLink>
        ))}
      </div>
    </SectionShell>
  );
}

