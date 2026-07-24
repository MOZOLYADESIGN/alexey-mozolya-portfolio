import AxeBuilder from "@axe-core/playwright";
import { expect, test } from "@playwright/test";

test.describe("about", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/");
    await page.locator("#about").scrollIntoViewIfNeeded();
  });

  test("shows exactly three principles, each with a title and a body", async ({ page }) => {
    const principles = page.locator("#about ul > li");
    await expect(principles).toHaveCount(3);

    for (const item of await principles.all()) {
      await expect(item.locator("h3")).toHaveText(/\S/);
      const body = await item.locator("p").innerText();
      // The spec caps a principle at 160 characters.
      expect(body.length).toBeGreaterThan(0);
      expect(body.length).toBeLessThanOrEqual(160);
    }
  });

  test("author text stays inside the 350-650 character range", async ({ page }) => {
    const paragraphs = await page.locator("#about h2 ~ * p").allInnerTexts();
    const length = paragraphs.join(" ").length;
    console.log({ length });
    expect(length).toBeGreaterThanOrEqual(350);
    expect(length).toBeLessThanOrEqual(650);
  });

  test("shows the portrait but no invented illustration captions", async ({ page }) => {
    await expect(page.locator("#about h2")).toHaveCount(1);
    // The real portrait now lives here (moved off the hero).
    const portrait = page.locator("[data-testid='about-portrait'] img");
    await expect(portrait).toHaveCount(1);
    await expect(portrait).toHaveAttribute("alt", /Алексей/);
    // Principle illustrations are still placeholders — no image, no caption.
    await expect(page.locator("#about ul img")).toHaveCount(0);
    await expect(page.locator("#about figcaption")).toHaveCount(0);
  });

  test("reserves the portrait box before paint", async ({ page }) => {
    const ratio = await page.evaluate(() => {
      const frame = document.querySelector("[data-testid='about-portrait']")!;
      const box = frame.getBoundingClientRect();
      return box.width / box.height;
    });
    expect(ratio).toBeGreaterThan(0);
    expect(ratio).toBeCloseTo(720 / 900, 1);
  });

  test("has no accessibility violations", async ({ page }) => {
    const results = await new AxeBuilder({ page }).include("#about").analyze();
    const serious = results.violations.filter((v) =>
      ["critical", "serious"].includes(v.impact ?? ""),
    );
    expect(serious).toEqual([]);
  });
});

for (const width of [320, 360, 390, 768, 1024, 1440]) {
  test(`about does not overflow at ${width}px`, async ({ page }) => {
    await page.setViewportSize({ width, height: 900 });
    await page.goto("/");
    const overflow = await page.evaluate(
      () => document.documentElement.scrollWidth - document.documentElement.clientWidth,
    );
    expect(overflow).toBeLessThanOrEqual(0);
  });
}
