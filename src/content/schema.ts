export const assetSets = ["starta", "jobs", "apex", "trenera"] as const;
export type AssetSet = (typeof assetSets)[number];

export interface TextSegment {
  text: string;
  tone?: "muted";
}

export interface ExperienceItem {
  id: string;
  assetSet: AssetSet;
  title: string;
  timeline: {
    start: string;
    end: string;
    mode: string;
    ariaLabel: string;
  };
  paragraphs: TextSegment[][];
  imageAlts: string[];
}

export interface SiteContent {
  identity: { name: string; jobTitle: string; location: string };
  seo: {
    title: string;
    description: string;
    canonical: string;
    shareTitle: string;
    shareDescription: string;
    ogImage: string;
    ogImageAlt: string;
  };
  navigation: Record<"essence" | "experience" | "about" | "contacts", string>;
  hero: { greeting: string; name: string; descriptions: [string, string]; meta: [string, string, string] };
  experience: { label: string; summaryYears: string; summaryText: string; items: ExperienceItem[] };
  about: { label: string; paragraphs: string[]; noteLines: [string, string] };
  contacts: {
    label: string;
    ctaLines: [string, string];
    telegram: { label: string; url: string };
    email: { label: string; address: string };
    copyright: string;
  };
}

const expectedImageCounts: Record<AssetSet, number> = { starta: 4, jobs: 4, apex: 3, trenera: 4 };

function record(value: unknown, path: string): Record<string, unknown> {
  if (!value || typeof value !== "object" || Array.isArray(value)) throw new Error(`${path} must be an object.`);
  return value as Record<string, unknown>;
}

function exactKeys(value: Record<string, unknown>, keys: readonly string[], path: string) {
  const unexpected = Object.keys(value).filter((key) => !keys.includes(key));
  const missing = keys.filter((key) => !(key in value));
  if (unexpected.length || missing.length) {
    throw new Error(`${path} schema mismatch. Missing: ${missing.join(", ") || "none"}; unexpected: ${unexpected.join(", ") || "none"}.`);
  }
}

function text(value: unknown, path: string): asserts value is string {
  if (typeof value !== "string" || !value.trim()) throw new Error(`${path} must be a non-empty string.`);
  if (/[<>]/.test(value)) throw new Error(`${path} must contain plain text, not HTML.`);
}

function textArray(value: unknown, path: string, length?: number): asserts value is string[] {
  if (!Array.isArray(value) || (length !== undefined && value.length !== length)) throw new Error(`${path} must be an array${length ? ` of ${length} items` : ""}.`);
  value.forEach((item, index) => text(item, `${path}[${index}]`));
}

export function assertSiteContent(value: unknown): asserts value is SiteContent {
  const site = record(value, "site");
  exactKeys(site, ["identity", "seo", "navigation", "hero", "experience", "about", "contacts"], "site");

  const identity = record(site.identity, "identity");
  exactKeys(identity, ["name", "jobTitle", "location"], "identity");
  Object.entries(identity).forEach(([key, item]) => text(item, `identity.${key}`));

  const seo = record(site.seo, "seo");
  exactKeys(seo, ["title", "description", "canonical", "shareTitle", "shareDescription", "ogImage", "ogImageAlt"], "seo");
  Object.entries(seo).forEach(([key, item]) => text(item, `seo.${key}`));
  for (const key of ["canonical", "ogImage"] as const) {
    const url = new URL(seo[key] as string);
    if (url.protocol !== "https:") throw new Error(`seo.${key} must use HTTPS.`);
  }

  const navigation = record(site.navigation, "navigation");
  exactKeys(navigation, ["essence", "experience", "about", "contacts"], "navigation");
  Object.entries(navigation).forEach(([key, item]) => text(item, `navigation.${key}`));

  const hero = record(site.hero, "hero");
  exactKeys(hero, ["greeting", "name", "descriptions", "meta"], "hero");
  text(hero.greeting, "hero.greeting");
  text(hero.name, "hero.name");
  textArray(hero.descriptions, "hero.descriptions", 2);
  textArray(hero.meta, "hero.meta", 3);

  const experience = record(site.experience, "experience");
  exactKeys(experience, ["label", "summaryYears", "summaryText", "items"], "experience");
  text(experience.label, "experience.label");
  text(experience.summaryYears, "experience.summaryYears");
  text(experience.summaryText, "experience.summaryText");
  if (!Array.isArray(experience.items) || experience.items.length < 1 || experience.items.length > 12) throw new Error("experience.items must contain between 1 and 12 projects.");
  const ids = new Set<string>();
  experience.items.forEach((rawItem, itemIndex) => {
    const path = `experience.items[${itemIndex}]`;
    const item = record(rawItem, path);
    exactKeys(item, ["id", "assetSet", "title", "timeline", "paragraphs", "imageAlts"], path);
    text(item.id, `${path}.id`);
    if (!/^[a-z0-9][a-z0-9-]{1,39}$/.test(item.id as string) || ids.has(item.id)) throw new Error(`${path}.id is invalid or duplicated.`);
    ids.add(item.id);
    text(item.assetSet, `${path}.assetSet`);
    if (!assetSets.includes(item.assetSet as AssetSet)) throw new Error(`${path}.assetSet is unsupported.`);
    text(item.title, `${path}.title`);
    const timeline = record(item.timeline, `${path}.timeline`);
    exactKeys(timeline, ["start", "end", "mode", "ariaLabel"], `${path}.timeline`);
    Object.entries(timeline).forEach(([key, timelineValue]) => text(timelineValue, `${path}.timeline.${key}`));
    if (!Array.isArray(item.paragraphs) || !item.paragraphs.length) throw new Error(`${path}.paragraphs must not be empty.`);
    item.paragraphs.forEach((rawParagraph, paragraphIndex) => {
      if (!Array.isArray(rawParagraph) || !rawParagraph.length) throw new Error(`${path}.paragraphs[${paragraphIndex}] must not be empty.`);
      rawParagraph.forEach((rawSegment, segmentIndex) => {
        const segmentPath = `${path}.paragraphs[${paragraphIndex}][${segmentIndex}]`;
        const segment = record(rawSegment, segmentPath);
        const keys = segment.tone === undefined ? ["text"] : ["text", "tone"];
        exactKeys(segment, keys, segmentPath);
        text(segment.text, `${segmentPath}.text`);
        if (segment.tone !== undefined && segment.tone !== "muted") throw new Error(`${segmentPath}.tone is unsupported.`);
      });
    });
    textArray(item.imageAlts, `${path}.imageAlts`, expectedImageCounts[item.assetSet as AssetSet]);
  });

  const about = record(site.about, "about");
  exactKeys(about, ["label", "paragraphs", "noteLines"], "about");
  text(about.label, "about.label");
  textArray(about.paragraphs, "about.paragraphs");
  textArray(about.noteLines, "about.noteLines", 2);

  const contacts = record(site.contacts, "contacts");
  exactKeys(contacts, ["label", "ctaLines", "telegram", "email", "copyright"], "contacts");
  text(contacts.label, "contacts.label");
  textArray(contacts.ctaLines, "contacts.ctaLines", 2);
  text(contacts.copyright, "contacts.copyright");
  const telegram = record(contacts.telegram, "contacts.telegram");
  exactKeys(telegram, ["label", "url"], "contacts.telegram");
  text(telegram.label, "contacts.telegram.label");
  text(telegram.url, "contacts.telegram.url");
  if (!/^https:\/\/t\.me\/[A-Za-z0-9_]+$/.test(telegram.url as string)) throw new Error("contacts.telegram.url must be a t.me HTTPS URL.");
  const email = record(contacts.email, "contacts.email");
  exactKeys(email, ["label", "address"], "contacts.email");
  text(email.label, "contacts.email.label");
  text(email.address, "contacts.email.address");
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.address as string)) throw new Error("contacts.email.address is invalid.");
}
