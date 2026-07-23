import AxeBuilder from "@axe-core/playwright";
import { expect, test } from "@playwright/test";

test.describe("testimonials (block 12)", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/");
    await page.locator("#testimonials").scrollIntoViewIfNeeded();
  });

  test("shows placeholder testimonials, each with a quote and an attribution", async ({ page }) => {
    const cards = page.locator("#testimonials figure");
    expect(await cards.count()).toBeGreaterThanOrEqual(3);
    for (const card of await cards.all()) {
      await expect(card.locator("blockquote")).toHaveText(/\S/);
      await expect(card.locator("figcaption")).toHaveText(/\S/);
    }
  });

  test("is flagged as placeholder copy for final QA", async ({ page }) => {
    await expect(page.locator("#testimonials [data-placeholder-copy='true']")).toHaveCount(1);
  });

  test("has no accessibility violations", async ({ page }) => {
    const results = await new AxeBuilder({ page }).include("#testimonials").analyze();
    const serious = results.violations.filter((v) =>
      ["critical", "serious"].includes(v.impact ?? ""),
    );
    expect(serious).toEqual([]);
  });
});

for (const width of [320, 390, 768, 1024, 1440]) {
  test(`testimonials do not overflow at ${width}px`, async ({ page }) => {
    await page.setViewportSize({ width, height: 900 });
    await page.goto("/");
    const overflow = await page.evaluate(
      () => document.documentElement.scrollWidth - document.documentElement.clientWidth,
    );
    expect(overflow).toBeLessThanOrEqual(0);
  });
}
