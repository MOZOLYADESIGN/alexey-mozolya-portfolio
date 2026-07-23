import AxeBuilder from "@axe-core/playwright";
import { expect, test } from "@playwright/test";

const CARD = "#services details";

test.describe("services", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/");
    await page.locator("#services").scrollIntoViewIfNeeded();
  });

  test("lists the four formats, each with a title and a price", async ({ page }) => {
    const cards = page.locator(CARD);
    await expect(cards).toHaveCount(4);
    for (const card of await cards.all()) {
      await expect(card.locator("summary")).toContainText("₽");
    }
  });

  test("expands in place to a single Telegram CTA, no popup", async ({ page }) => {
    const first = page.locator(CARD).first();
    const cta = first.locator("a");

    await expect(cta).toBeHidden();
    await first.locator("summary").click();
    await expect(cta).toBeVisible();
    await expect(cta).toHaveAttribute("href", "https://t.me/poofex");

    expect(await page.locator("#services form, #services dialog").count()).toBe(0);
  });

  test("has no accessibility violations", async ({ page }) => {
    // Open one so the expanded content is in scope too.
    await page.locator(CARD).first().locator("summary").click();
    const results = await new AxeBuilder({ page }).include("#services").analyze();
    const serious = results.violations.filter((v) =>
      ["critical", "serious"].includes(v.impact ?? ""),
    );
    expect(serious).toEqual([]);
  });
});

test.describe("services on desktop", () => {
  test.skip(({ isMobile }) => Boolean(isMobile));

  test("keeps several cards open at once", async ({ page }) => {
    await page.goto("/");
    await page.locator("#services").scrollIntoViewIfNeeded();
    const cards = page.locator(CARD);

    await cards.nth(0).locator("summary").click();
    await cards.nth(1).locator("summary").click();

    await expect(cards.nth(0)).toHaveJSProperty("open", true);
    await expect(cards.nth(1)).toHaveJSProperty("open", true);
  });
});

test.describe("services on mobile", () => {
  test.skip(({ isMobile }) => !isMobile);

  test("opens as an accordion — one card at a time", async ({ page }) => {
    await page.goto("/");
    await page.locator("#services").scrollIntoViewIfNeeded();
    const cards = page.locator(CARD);

    await cards.nth(0).locator("summary").click();
    await expect(cards.nth(0)).toHaveJSProperty("open", true);

    await cards.nth(1).locator("summary").click();
    // The first one closed when the second opened.
    await expect(cards.nth(1)).toHaveJSProperty("open", true);
    await expect(cards.nth(0)).toHaveJSProperty("open", false);
  });
});

for (const width of [320, 390, 768, 1024, 1440]) {
  test(`services do not overflow at ${width}px`, async ({ page }) => {
    await page.setViewportSize({ width, height: 900 });
    await page.goto("/");
    const overflow = await page.evaluate(
      () => document.documentElement.scrollWidth - document.documentElement.clientWidth,
    );
    expect(overflow).toBeLessThanOrEqual(0);
  });
}
