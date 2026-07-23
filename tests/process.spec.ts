import AxeBuilder from "@axe-core/playwright";
import { expect, test } from "@playwright/test";

test.describe("process (block 10)", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/");
    await page.locator("#process").scrollIntoViewIfNeeded();
  });

  test("shows four ordered steps, each with an icon and a title", async ({ page }) => {
    const steps = page.locator("#process ol > li");
    await expect(steps).toHaveCount(4);
    for (const step of await steps.all()) {
      await expect(step.locator("svg")).toHaveCount(1);
      await expect(step.locator("h3")).toHaveText(/\S/);
    }
  });

  test("decorative icons are hidden from assistive tech", async ({ page }) => {
    const svgs = page.locator("#process svg[aria-hidden='true']");
    expect(await svgs.count()).toBeGreaterThanOrEqual(4);
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
