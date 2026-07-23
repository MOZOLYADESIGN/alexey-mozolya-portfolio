import AxeBuilder from "@axe-core/playwright";
import { expect, test } from "@playwright/test";

test.describe("final CTA + footer (block 14)", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/");
    await page.locator("#contact").scrollIntoViewIfNeeded();
  });

  test("is the anchor the nav points at, with the Telegram CTA and the promise", async ({
    page,
  }) => {
    await expect(page.locator("section#contact")).toHaveCount(1);
    await expect(page.locator("#contact h2")).toHaveCount(1);
    await expect(page.locator("#contact")).toContainText("в течение рабочего дня");

    const cta = page.locator("#contact a").first();
    await expect(cta).toHaveAttribute("href", "https://t.me/poofex");
  });

  test("offers VK and Gmail as secondary contacts, no form", async ({ page }) => {
    const links = await page.locator("#contact a").evaluateAll((nodes) =>
      nodes.map((n) => n.getAttribute("href")),
    );
    expect(links).toContain("https://vk.ru/cactusinapeachcolorforhumans");
    expect(links).toContain("mailto:mozolyadesign@gmail.com");
    expect(await page.locator("#contact form, #contact input").count()).toBe(0);
  });

  test("footer lists sections and contacts and a copyright", async ({ page }) => {
    const footer = page.locator("footer");
    await footer.scrollIntoViewIfNeeded();
    // Telegram, VK, Gmail all present in the footer.
    for (const href of [
      "https://t.me/poofex",
      "https://vk.ru/cactusinapeachcolorforhumans",
      "mailto:mozolyadesign@gmail.com",
    ]) {
      await expect(footer.locator(`a[href='${href}']`)).toHaveCount(1);
    }
    await expect(footer).toContainText("© 2026");
    // No links to pages that do not exist (no separate routes in the MVP).
    const internal = await footer.locator("a").evaluateAll((nodes) =>
      nodes.map((n) => n.getAttribute("href")).filter((h) => h && !h.startsWith("#")),
    );
    expect(internal.every((h) => h!.startsWith("https://") || h!.startsWith("mailto:"))).toBe(true);
  });

  test("has no accessibility violations in the closing area", async ({ page }) => {
    const results = await new AxeBuilder({ page }).include("#contact").analyze();
    const footerResults = await new AxeBuilder({ page }).include("footer").analyze();
    const serious = [...results.violations, ...footerResults.violations].filter((v) =>
      ["critical", "serious"].includes(v.impact ?? ""),
    );
    expect(serious).toEqual([]);
  });
});

for (const width of [320, 390, 768, 1024, 1440]) {
  test(`closing area does not overflow at ${width}px`, async ({ page }) => {
    await page.setViewportSize({ width, height: 900 });
    await page.goto("/");
    const overflow = await page.evaluate(
      () => document.documentElement.scrollWidth - document.documentElement.clientWidth,
    );
    expect(overflow).toBeLessThanOrEqual(0);
  });
}
