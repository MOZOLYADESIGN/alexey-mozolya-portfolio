import { expect, test } from "@playwright/test";

test("hero: makes no media request (rings are CSS, portrait moved to About)", async ({ page }) => {
  const media: string[] = [];
  page.on("request", (r) => {
    if (r.resourceType() === "media") media.push(r.url());
  });
  await page.goto("/");
  await page.waitForLoadState("networkidle");
  expect(media).toEqual([]);
  // No image or video on the first screen any more.
  await expect(page.locator("#top img, #top video")).toHaveCount(0);
});

test("hero: single h1 containing the exact phrase, no italic serif", async ({ page }) => {
  await page.goto("/");
  const h1 = page.locator("h1");
  await expect(h1).toHaveCount(1);
  const text = (await h1.innerText()).replace(/\s+/g, " ").trim();
  expect(text).toBe("Прокачиваю смыслы, визуал, стратегию и коммуникацию цифровых продуктов");

  // The title uses the main sans face — no serif italic accent remains.
  const style = await h1.evaluate((el) => {
    const cs = getComputedStyle(el);
    // Check every text node's inline styling too by sampling the element.
    return { fontStyle: cs.fontStyle, fontFamily: cs.fontFamily.toLowerCase() };
  });
  expect(style.fontStyle).toBe("normal");
  expect(style.fontFamily).not.toContain("lora");
  const italics = await page.locator("#top *").evaluateAll((els) =>
    els.filter((el) => getComputedStyle(el).fontStyle === "italic").length,
  );
  expect(italics).toBe(0);
});

test("hero: decorative rings and centre fade are present and aria-hidden", async ({ page }) => {
  await page.goto("/");
  const decorative = page.locator("#top [aria-hidden='true']");
  expect(await decorative.count()).toBeGreaterThan(0);
  // The composition is centred.
  const align = await page.locator("#top").evaluate((el) => getComputedStyle(el).textAlign);
  expect(align).toBe("center");
});

test("hero: CTAs point at telegram and projects", async ({ page }) => {
  await page.goto("/");
  await expect(page.locator("#top a[href='https://t.me/poofex']")).toHaveCount(1);
  await expect(page.locator("#top a[href='#projects']")).toHaveCount(1);
});

test("hero: CTAs span the full width below 768px", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/");
  const primary = (await page.locator("#top a", { hasText: "Написать в Telegram" }).boundingBox())!;
  const secondary = (await page.locator("#top a", { hasText: "Смотреть работы" }).boundingBox())!;
  // Both buttons share one full-width column.
  expect(Math.round(primary.width)).toBe(Math.round(secondary.width));
  expect(primary.width).toBeGreaterThan(300);
});

test("hero: CTAs stop stretching from 768px up", async ({ page }) => {
  await page.setViewportSize({ width: 768, height: 1024 });
  await page.goto("/");
  const cta = (await page.locator("#top a", { hasText: "Написать в Telegram" }).boundingBox())!;
  expect(cta.width).toBeLessThan(320);
});

for (const [w, h] of [
  [360, 800],
  [390, 844],
  [768, 1024],
  [1024, 768],
  [1440, 900],
  [1920, 1080],
]) {
  test(`hero: no horizontal scroll at ${w}x${h}`, async ({ page }) => {
    await page.setViewportSize({ width: w, height: h });
    await page.goto("/");
    const over = await page.evaluate(
      () => document.documentElement.scrollWidth - document.documentElement.clientWidth,
    );
    expect(over).toBeLessThanOrEqual(0);
  });
}
