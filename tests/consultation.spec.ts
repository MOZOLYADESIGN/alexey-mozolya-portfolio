import AxeBuilder from "@axe-core/playwright";
import { expect, test } from "@playwright/test";

test.describe("consultation callout", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/");
    await page.locator("#products").scrollIntoViewIfNeeded();
  });

  test("is the anchor the nav points at and has one heading", async ({ page }) => {
    const nav = page.locator("nav a[href='#products']").first();
    // The section carries the id the "Продукты" nav item links to.
    await expect(page.locator("section#products")).toHaveCount(1);
    await expect(page.locator("#products h2")).toHaveCount(1);
    // (link exists in the DOM even if its capsule is only shown on one layout)
    await expect(nav).toHaveCount(1);
  });

  test("shows the price and a single CTA to the dedicated page, no form or popup", async ({ page }) => {
    await expect(page.locator("#products")).toContainText("5 000 ₽");

    const ctas = page.locator("#products a");
    await expect(ctas).toHaveCount(1);
    await expect(ctas).toHaveAttribute("href", "/consultation/");

    // MVP rule: no forms, no dialogs anywhere in the block.
    expect(await page.locator("#products form, #products dialog, #products input").count()).toBe(0);
  });

  test("lists what is included", async ({ page }) => {
    const items = page.locator("#products ul li");
    expect(await items.count()).toBeGreaterThanOrEqual(3);
  });

  test("has no accessibility violations", async ({ page }) => {
    // The block inverts its theme on scroll; scanning mid-transition reads
    // interpolated colours and reports contrast that never renders.
    // Transitions only — the decorative arrows loop forever, so awaiting every
    // animation would hang.
    await page.locator("#products").evaluate((el) =>
      Promise.all(
        el
          .getAnimations({ subtree: true })
          .filter((a) => a instanceof CSSTransition)
          .map((a) => a.finished),
      ),
    );
    const results = await new AxeBuilder({ page }).include("#products").analyze();
    const serious = results.violations.filter((v) =>
      ["critical", "serious"].includes(v.impact ?? ""),
    );
    expect(serious).toEqual([]);
  });
});

for (const width of [320, 390, 768, 1024, 1440]) {
  test(`consultation callout does not overflow at ${width}px`, async ({ page }) => {
    await page.setViewportSize({ width, height: 900 });
    await page.goto("/");
    const overflow = await page.evaluate(
      () => document.documentElement.scrollWidth - document.documentElement.clientWidth,
    );
    expect(overflow).toBeLessThanOrEqual(0);
  });
}
