import { expect, test } from "@playwright/test";

const bg = (el: Element) => getComputedStyle(el).backgroundColor;
const luminance = (rgb: string) => {
  const [r, g, b] = rgb.match(/\d+/g)!.map(Number);
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
};

test.describe("product callout inversion", () => {
  test("inverts the whole section, not a panel inside it", async ({ page }) => {
    await page.goto("/");
    const section = page.locator("#products");

    // At the very top the callout is out of the middle band — light theme.
    await page.evaluate(() => window.scrollTo({ top: 0, behavior: "instant" }));
    await page.waitForTimeout(300);
    await expect(section).toHaveAttribute("data-active", "false");
    const light = await section.evaluate(bg);

    // Bring it to the middle of the viewport — theme flips to dark.
    await section.scrollIntoViewIfNeeded();
    await page.evaluate(() => window.scrollBy({ top: -120, behavior: "instant" }));
    await expect(section).toHaveAttribute("data-active", "true");
    await page.waitForTimeout(700); // let the colour transition settle

    const dark = await section.evaluate(bg);
    expect(dark).not.toBe(light);
    expect(luminance(dark)).toBeLessThan(luminance(light));

    // Nothing inside carries its own competing panel colour.
    const inner = await section.locator("> div").last().evaluate(bg);
    expect(inner).toBe("rgba(0, 0, 0, 0)");
  });

  test("carries a generated mesh instead of icons", async ({ page }) => {
    await page.goto("/");
    const section = page.locator("#products");
    await section.scrollIntoViewIfNeeded();

    await expect(section.locator("[data-variant]")).toHaveCount(1);
    await expect(section.locator("svg")).toHaveCount(0);
  });

  test("stands two viewports tall", async ({ page }) => {
    await page.goto("/");
    const height = (await page.locator("#products").boundingBox())!.height;
    const viewport = page.viewportSize()!.height;
    expect(height).toBeGreaterThanOrEqual(viewport * 2);
  });
});

test.describe("product callout below 1025px", () => {
  test("the mesh fills the section background, blurred and held back", async ({ page }) => {
    await page.setViewportSize({ width: 1024, height: 900 });
    await page.goto("/");
    const section = page.locator("#products");
    await section.scrollIntoViewIfNeeded();

    const mesh = section.locator("[data-variant]");
    const box = (await mesh.boundingBox())!;
    const sectionBox = (await section.boundingBox())!;
    // Full bleed, not a column.
    expect(box.width).toBeCloseTo(sectionBox.width, 0);

    const style = await mesh.evaluate((node) => ({
      opacity: getComputedStyle(node).opacity,
      blur: getComputedStyle(node, "::before").filter,
    }));
    expect(Number(style.opacity)).toBeLessThan(0.4);
    expect(style.blur).toContain("blur(56px)");
  });
});
