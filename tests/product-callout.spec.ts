import { expect, test } from "@playwright/test";

const bg = (el: Element) => getComputedStyle(el).backgroundColor;

test.describe("product callout inversion", () => {
  test("inverts to a dark theme when scrolled to, reverts near the top", async ({ page }) => {
    await page.goto("/");
    const section = page.locator("#products");

    // At the very top the callout is out of the middle band — light theme.
    await page.evaluate(() => window.scrollTo({ top: 0, behavior: "instant" }));
    await page.waitForTimeout(300);
    await expect(section).toHaveAttribute("data-active", "false");
    const panelLight = await section.locator("> div").evaluate(bg);

    // Bring it to the middle of the viewport — theme flips to dark.
    await section.scrollIntoViewIfNeeded();
    await page.evaluate(() => window.scrollBy({ top: -120, behavior: "instant" }));
    await expect(section).toHaveAttribute("data-active", "true");
    await page.waitForTimeout(700); // let the colour transition settle

    const panelDark = await section.locator("> div").evaluate(bg);
    expect(panelDark).not.toBe(panelLight);

    // The dark panel is genuinely darker than the light one.
    const luminance = (rgb: string) => {
      const [r, g, b] = rgb.match(/\d+/g)!.map(Number);
      return 0.2126 * r + 0.7152 * g + 0.0722 * b;
    };
    expect(luminance(panelDark)).toBeLessThan(luminance(panelLight));
  });

  test("shows the converging arrows graphic", async ({ page }) => {
    await page.goto("/");
    await page.locator("#products").scrollIntoViewIfNeeded();
    // 1+2+3+4+5 = 15 arrows, decorative.
    const arrows = page.locator("#products [aria-hidden='true'] svg");
    expect(await arrows.count()).toBe(15);
  });
});
