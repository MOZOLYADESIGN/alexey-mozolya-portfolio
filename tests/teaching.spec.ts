import AxeBuilder from "@axe-core/playwright";
import { expect, test } from "@playwright/test";

test.describe("teaching context (block 11)", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/");
    await page.locator("#teaching").scrollIntoViewIfNeeded();
  });

  test("shows the two teaching notes with icons, one heading", async ({ page }) => {
    await expect(page.locator("#teaching h2")).toHaveCount(1);
    const cards = page.locator("#teaching ul > li");
    await expect(cards).toHaveCount(2);
    await expect(page.locator("#teaching")).toContainText("Знать Figma");
    await expect(page.locator("#teaching")).toContainText("живые люди");
    for (const card of await cards.all()) {
      await expect(card.locator("svg[aria-hidden='true']")).toHaveCount(1);
    }
  });

  test("leads into the Figma mentoring callout", async ({ page }) => {
    const figma = page.locator("#product-figma-mentoring");
    await expect(figma).toBeVisible();
    await expect(figma).toContainText("9 900 ₽");
    await expect(figma.locator("a")).toHaveAttribute("href", "https://t.me/poofex");
  });

  test("has no accessibility violations", async ({ page }) => {
    const results = await new AxeBuilder({ page }).include("#teaching").analyze();
    const serious = results.violations.filter((v) =>
      ["critical", "serious"].includes(v.impact ?? ""),
    );
    expect(serious).toEqual([]);
  });
});

for (const width of [320, 390, 768, 1024, 1440]) {
  test(`teaching does not overflow at ${width}px`, async ({ page }) => {
    await page.setViewportSize({ width, height: 900 });
    await page.goto("/");
    const overflow = await page.evaluate(
      () => document.documentElement.scrollWidth - document.documentElement.clientWidth,
    );
    expect(overflow).toBeLessThanOrEqual(0);
  });
}
