import AxeBuilder from "@axe-core/playwright";
import { expect, test } from "@playwright/test";

const ITEM = "#faq details";

test.describe("faq (block 13)", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/");
    await page.locator("#faq").scrollIntoViewIfNeeded();
  });

  test("lists the six questions under one heading", async ({ page }) => {
    await expect(page.locator("#faq h2")).toHaveCount(1);
    await expect(page.locator(ITEM)).toHaveCount(6);
  });

  test("opens an answer in place and closes it again", async ({ page }) => {
    const first = page.locator(ITEM).first();
    const answer = first.locator("p");

    await expect(answer).toBeHidden();
    await first.locator("summary").click();
    await expect(answer).toBeVisible();
    await first.locator("summary").click();
    await expect(first).toHaveJSProperty("open", false);
  });

  test("behaves as an accordion — one open at a time", async ({ page }) => {
    const items = page.locator(ITEM);
    await items.nth(0).locator("summary").click();
    await expect(items.nth(0)).toHaveJSProperty("open", true);

    await items.nth(1).locator("summary").click();
    await expect(items.nth(1)).toHaveJSProperty("open", true);
    await expect(items.nth(0)).toHaveJSProperty("open", false);
  });

  test("the footer offers Telegram, no form or popup", async ({ page }) => {
    const link = page.locator("#faq p a");
    await expect(link).toHaveAttribute("href", "https://t.me/poofex");
    expect(await page.locator("#faq form, #faq dialog, #faq input").count()).toBe(0);
  });

  test("has no accessibility violations", async ({ page }) => {
    await page.locator(ITEM).first().locator("summary").click();
    const results = await new AxeBuilder({ page }).include("#faq").analyze();
    const serious = results.violations.filter((v) =>
      ["critical", "serious"].includes(v.impact ?? ""),
    );
    expect(serious).toEqual([]);
  });
});

for (const width of [320, 390, 768, 1024, 1440]) {
  test(`faq does not overflow at ${width}px`, async ({ page }) => {
    await page.setViewportSize({ width, height: 900 });
    await page.goto("/");
    const overflow = await page.evaluate(
      () => document.documentElement.scrollWidth - document.documentElement.clientWidth,
    );
    expect(overflow).toBeLessThanOrEqual(0);
  });
}
