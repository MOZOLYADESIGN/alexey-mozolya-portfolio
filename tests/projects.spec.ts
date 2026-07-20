import AxeBuilder from "@axe-core/playwright";
import { expect, test, type Locator } from "@playwright/test";

const CARD = "#projects li a";

test.describe("projects", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/");
    await page.locator("#projects").scrollIntoViewIfNeeded();
  });

  test("renders 6-8 cards, all pointing at telegram", async ({ page }) => {
    const cards = page.locator(CARD);
    const count = await cards.count();
    expect(count).toBeGreaterThanOrEqual(6);
    expect(count).toBeLessThanOrEqual(8);

    for (const card of await cards.all()) {
      await expect(card).toHaveAttribute("href", "https://t.me/poofex");
      // Every card must name itself: eight identical links would be useless
      // in a screen reader's link list.
      const label = await card.getAttribute("aria-label");
      expect(label).toMatch(/Кейс \d\d/);
    }
  });

  test("has no case-study routes", async ({ page }) => {
    const hrefs = await page.locator("#projects a").evaluateAll((nodes) =>
      nodes.map((node) => node.getAttribute("href")),
    );
    expect(hrefs.every((href) => href === "https://t.me/poofex")).toBe(true);
  });

  test("idea and result stay within 120 characters", async ({ page }) => {
    const lines = await page.locator(`${CARD} [data-reveal="line"]`).allInnerTexts();
    expect(lines.length).toBeGreaterThan(0);
    for (const line of lines) {
      expect(line.trim().length).toBeLessThanOrEqual(120);
    }
  });

  test("has no accessibility violations", async ({ page }) => {
    const results = await new AxeBuilder({ page }).include("#projects").analyze();
    const serious = results.violations.filter((v) =>
      ["critical", "serious"].includes(v.impact ?? ""),
    );
    expect(serious).toEqual([]);
  });
});

test.describe("projects on a fine pointer", () => {
  test.skip(({ isMobile }) => Boolean(isMobile));

  const panelState = (card: Locator) =>
    card.locator('[data-panel="true"]').evaluate((node) => {
      const style = getComputedStyle(node);
      const box = node.getBoundingClientRect();
      const image = node.parentElement!.getBoundingClientRect();
      return {
        opacity: Number(style.opacity),
        blurred: style.filter !== "none" && style.filter !== "blur(0px)",
        // Positive while the patch still covers the lower edge of the image.
        overlap: image.bottom - box.top,
        hangsBelow: box.bottom - image.bottom,
      };
    });

  test("caption emerges from a blur over the lower edge, grid height unchanged", async ({
    page,
  }) => {
    await page.goto("/");
    const card = page.locator(CARD).first();
    await card.scrollIntoViewIfNeeded();

    const gridBefore = (await page.locator("#projects ul").boundingBox())!.height;
    const before = await panelState(card);
    expect(before.opacity).toBeLessThan(0.1);
    expect(before.blurred).toBe(true);

    await card.hover();
    await page.waitForTimeout(600);

    const after = await panelState(card);
    const gridAfter = (await page.locator("#projects ul").boundingBox())!.height;

    expect(after.opacity).toBeGreaterThan(0.9);
    expect(after.blurred).toBe(false);
    // It sits across the bottom edge: part on the image, part below it.
    expect(after.overlap).toBeGreaterThan(0);
    expect(after.hangsBelow).toBeGreaterThan(0);
    // And nothing in the gallery moved.
    expect(gridAfter).toBeCloseTo(gridBefore, 0);
  });

  test("the caption never covers the title underneath", async ({ page }) => {
    await page.goto("/");
    const card = page.locator(CARD).first();
    await card.scrollIntoViewIfNeeded();
    await card.hover();
    await page.waitForTimeout(600);

    const panel = (await card.locator('[data-panel="true"]').boundingBox())!;
    // Against the title itself, not its box: the box starts at the padding
    // edge, which the overhang is allowed to sit in.
    const title = (await card.locator('[data-meta="true"] > span').first().boundingBox())!;
    expect(panel.y + panel.height).toBeLessThanOrEqual(title.y);
  });

  test("keyboard focus reveals the same information as hover", async ({ page }) => {
    await page.goto("/");
    const card = page.locator(CARD).first();
    await card.scrollIntoViewIfNeeded();
    await card.focus();
    await page.waitForTimeout(600);

    const state = await panelState(card);
    expect(state.opacity).toBeGreaterThan(0.9);
    expect(state.blurred).toBe(false);
  });
});

test.describe("projects on a coarse pointer", () => {
  test.skip(({ isMobile }) => !isMobile);

  test("idea and result are visible without interaction", async ({ page }) => {
    await page.goto("/");
    const card = page.locator(CARD).first();
    await card.scrollIntoViewIfNeeded();
    const lines = card.locator('[data-reveal="line"]');
    await expect(lines.first()).toBeVisible();
    expect(await lines.first().evaluate((n) => getComputedStyle(n).opacity)).toBe("1");
  });
});

for (const width of [320, 390, 768, 1024, 1440]) {
  test(`projects do not overflow at ${width}px`, async ({ page }) => {
    await page.setViewportSize({ width, height: 900 });
    await page.goto("/");
    const overflow = await page.evaluate(
      () => document.documentElement.scrollWidth - document.documentElement.clientWidth,
    );
    expect(overflow).toBeLessThanOrEqual(0);
  });
}
