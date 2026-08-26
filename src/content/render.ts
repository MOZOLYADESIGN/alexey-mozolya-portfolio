import type { AssetSet, ExperienceItem, SiteContent, TextSegment } from "./schema.ts";

function escapeHtml(value: string) {
  return value.replaceAll("&", "&amp;").replaceAll("<", "&lt;").replaceAll(">", "&gt;").replaceAll('"', "&quot;").replaceAll("'", "&#39;");
}

function getPath(content: SiteContent, path: string): unknown {
  return path.split(".").reduce<unknown>((value, key) => {
    if (Array.isArray(value)) return value[Number(key)];
    if (value && typeof value === "object") return (value as Record<string, unknown>)[key];
    return undefined;
  }, content);
}

function renderSegments(segments: TextSegment[]) {
  return segments
    .map((segment) => (segment.tone === "muted" ? `<span class="muted">${escapeHtml(segment.text)}</span>` : escapeHtml(segment.text)))
    .join("");
}

const projectAssets: Record<AssetSet, { trailWidth: number; images: Array<{ width: number; height: number }> }> = {
  starta: { trailWidth: 386, images: [{ width: 1100, height: 923 }, { width: 1100, height: 961 }, { width: 1100, height: 797 }, { width: 414, height: 1306 }] },
  jobs: { trailWidth: 386, images: [{ width: 630, height: 800 }, { width: 640, height: 2478 }, { width: 786, height: 1484 }, { width: 722, height: 2368 }] },
  apex: { trailWidth: 486, images: [{ width: 550, height: 414 }, { width: 900, height: 706 }, { width: 224, height: 348 }] },
  trenera: { trailWidth: 486, images: [{ width: 576, height: 1280 }, { width: 576, height: 1280 }, { width: 576, height: 1280 }, { width: 576, height: 1280 }] },
};

function renderExperienceItem(item: ExperienceItem) {
  const assets = projectAssets[item.assetSet];
  const paragraphs = item.paragraphs.map((paragraph) => `<p>${renderSegments(paragraph)}</p>`).join("\n                  ");
  const copy = item.paragraphs.length > 1 ? `<div class="experience-item__copy">\n                  ${paragraphs}\n                </div>` : paragraphs;
  const images = assets.images
    .map(
      (image, index) =>
        `<img class="collage-item collage-item--${index + 1}" src="./assets/${item.assetSet}-project-0${index + 1}.webp" width="${image.width}" height="${image.height}" loading="lazy" decoding="async" alt="${escapeHtml(item.imageAlts[index] ?? "")}" />`,
    )
    .join("\n                  ");

  return `<article class="experience-item" data-project="${escapeHtml(item.id)}">
                <h3 class="visually-hidden">${escapeHtml(item.title)}</h3>
                <div class="timeline timeline--project" aria-label="${escapeHtml(item.timeline.ariaLabel)}">
                  <span>${escapeHtml(item.timeline.start)}</span>
                  <img class="timeline__year-line" src="./assets/timeline-year-line.svg" width="36" height="2" alt="" aria-hidden="true" />
                  <span>${escapeHtml(item.timeline.end)}</span>
                  <img class="timeline__trail" src="./assets/timeline-${item.assetSet}-line.svg" width="${assets.trailWidth}" height="2" alt="" aria-hidden="true" />
                  <span class="timeline__mode">${escapeHtml(item.timeline.mode)}</span>
                </div>
                ${copy}
                <div class="project-collage project-collage--${item.assetSet}" aria-label="${escapeHtml(`Иллюстрации проекта ${item.title}`)}">
                  ${images}
                </div>
              </article>`;
}

function renderExperienceItems(items: ExperienceItem[]) {
  return items.map(renderExperienceItem).join("\n\n              ");
}

export function renderSiteTemplate(template: string, content: SiteContent) {
  const structuredData = JSON.stringify(
    {
      "@context": "https://schema.org",
      "@type": "Person",
      name: content.identity.name,
      jobTitle: content.identity.jobTitle,
      email: `mailto:${content.contacts.email.address}`,
      url: content.seo.canonical,
      sameAs: [content.contacts.telegram.url],
      homeLocation: { "@type": "Place", name: content.identity.location },
    },
    null,
    2,
  )
    .split("\n")
    .map((line) => `      ${line}`)
    .join("\n");

  const rendered = template
    .replace("{{structuredData}}", structuredData)
    .replace("{{experienceItems}}", renderExperienceItems(content.experience.items))
    .replace("{{contacts.emailHref}}", `mailto:${escapeHtml(content.contacts.email.address)}`)
    .replace(/\{\{(rich:)?([a-zA-Z0-9.]+)\}\}/g, (_, rich: string | undefined, path: string) => {
      const value = getPath(content, path);
      if (rich) {
        if (!Array.isArray(value)) throw new Error(`Rich content path is not an array: ${path}`);
        return renderSegments(value as TextSegment[]);
      }
      if (typeof value !== "string") throw new Error(`Content path is not a string: ${path}`);
      return escapeHtml(value);
    });

  if (/\{\{[^}]+\}\}/.test(rendered)) throw new Error("Unresolved content token in index.html.");
  return rendered;
}
