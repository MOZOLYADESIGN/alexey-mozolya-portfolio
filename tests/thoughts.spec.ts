import AxeBuilder from "@axe-core/playwright";
import { expect, test } from "@playwright/test";

test.describe("thoughts (block 9)", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/");
    await page.locator("#thoughts").scrollIntoViewIfNeeded();
  });

  test("is the anchor the nav points at, with one heading", async ({ page }) => {
    await expect(page.locator("section#thoughts")).toHaveCount(1);
    await expect(page.locator("#thoughts h2")).toHaveCount(1);
  });

  test("shows the three editorial notes, not the teaching ones", async ({ page }) => {
    const notes = page.locator("#thoughts article");
    await expect(notes).toHaveCount(3);
    await expect(page.locator("#thoughts")).toContainText("Нейросети не думают за человека");
    // Figma / living-people notes belong to the teaching block, not here.
    await expect(page.locator("#thoughts")).not.toContainText("Знать Figma");
    await expect(page.locator("#thoughts")).not.toContainText("живые люди");
  });

  test("carries no links to non-existent note pages", async ({ page }) => {
    // linkEnabled is false for every note — the /notes route does not exist yet.
    await expect(page.locator("#thoughts a")).toHaveCount(0);
  });

  test("the AI note leads into the AI mini-course callout", async ({ page }) => {
    const course = page.locator("#product-ai-course");
    await expect(course).toBeVisible();
    await expect(course).toContainText("7 700 ₽");
    await expect(course.locator("a")).toHaveAttribute("href", "https://t.me/poofex");
  });

  test("has no accessibility violations", async ({ page }) => {
    const results = await new AxeBuilder({ page }).include("#thoughts").analyze();
    const serious = results.violations.filter((v) =>
      ["critical", "serious"].includes(v.impact ?? ""),
    );
    expect(serious).toEqual([]);
  });
});

for (const width of [320, 390, 768, 1024, 1440]) {
  test(`thoughts do not overflow at ${width}px`, async ({ page }) => {
    await page.setViewportSize({ width, height: 900 });
    await page.goto("/");
    const overflow = await page.evaluate(
      () => document.documentElement.scrollWidth - document.documentElement.clientWidth,
    );
    expect(overflow).toBeLessThanOrEqual(0);
  });
}
