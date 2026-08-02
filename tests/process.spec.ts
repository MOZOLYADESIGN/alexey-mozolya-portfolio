import AxeBuilder from "@axe-core/playwright";
import { expect, test } from "@playwright/test";

test.describe("process (block 10)", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/");
    await page.locator("#process").scrollIntoViewIfNeeded();
  });

  test("shows five ordered steps with titles and no icons on the cards", async ({ page }) => {
    const steps = page.locator("#process ol > li");
    await expect(steps).toHaveCount(5);
    for (const step of await steps.all()) {
      await expect(step.locator("svg")).toHaveCount(0);
      await expect(step.locator("h3")).toHaveText(/\S/);
    }
  });

  test("floats decorative stickers above the block, hidden from assistive tech", async ({
    page,
  }) => {
    const stickers = page.locator("#process [data-shape]");
    expect(await stickers.count()).toBeGreaterThanOrEqual(2);
    for (const sticker of await stickers.all()) {
      await expect(sticker).toHaveAttribute("aria-hidden", "true");
    }
  });

  test("stickers travel at different rates as the block scrolls", async ({ page }) => {
    // Phones keep only the two edge stickers; the hidden ones have no box.
    const visible = page.locator("#process [data-shape]:visible");
    const first = visible.first();
    const last = visible.last();

    await page.evaluate(() => window.scrollTo({ top: 0, behavior: "instant" }));
    await page.waitForTimeout(200);
    const before = [(await first.boundingBox())!.y, (await last.boundingBox())!.y];

    const box = (await page.locator("#process").boundingBox())!;
    await page.evaluate((y) => window.scrollTo({ top: y, behavior: "instant" }), box.y);
    await page.waitForTimeout(200);
    const after = [(await first.boundingBox())!.y, (await last.boundingBox())!.y];

    // Both moved with the page; the parallax means they did not move equally.
    const travelled = [after[0] - before[0], after[1] - before[1]];
    expect(Math.abs(travelled[0] - travelled[1])).toBeGreaterThan(20);
  });

  test("has no accessibility violations", async ({ page }) => {
    const results = await new AxeBuilder({ page }).include("#process").analyze();
    const serious = results.violations.filter((v) =>
      ["critical", "serious"].includes(v.impact ?? ""),
    );
    expect(serious).toEqual([]);
  });
});

for (const width of [320, 390, 768, 1024, 1440]) {
  test(`process does not overflow at ${width}px`, async ({ page }) => {
    await page.setViewportSize({ width, height: 900 });
    await page.goto("/");
    const overflow = await page.evaluate(
      () => document.documentElement.scrollWidth - document.documentElement.clientWidth,
    );
    expect(overflow).toBeLessThanOrEqual(0);
  });
}
