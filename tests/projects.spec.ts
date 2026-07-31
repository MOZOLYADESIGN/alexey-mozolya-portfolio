import AxeBuilder from "@axe-core/playwright";
import { expect, test } from "@playwright/test";

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

  test("each card carries one summary within 200 characters", async ({ page }) => {
    const cards = page.locator(CARD);
    for (const card of await cards.all()) {
      const lines = card.locator('[data-reveal="line"]');
      // One block of copy per card — the Идея/Результат labels are gone.
      await expect(lines).toHaveCount(1);
      expect((await lines.innerText()).trim().length).toBeLessThanOrEqual(200);
    }
    await expect(page.locator("#projects")).not.toContainText(/Идея|Результат/);
  });

  test("the summary is set semibold", async ({ page }) => {
    const weight = await page
      .locator(`${CARD} [data-reveal="line"]`)
      .first()
      .evaluate((node) => getComputedStyle(node).fontWeight);
    expect(Number(weight)).toBeGreaterThanOrEqual(600);
  });

  test("has no accessibility violations", async ({ page }) => {
    const results = await new AxeBuilder({ page }).include("#projects").analyze();
    const serious = results.violations.filter((v) =>
      ["critical", "serious"].includes(v.impact ?? ""),
    );
    expect(serious).toEqual([]);
  });
});

test.describe("projects from 768px up", () => {
  test.skip(({ isMobile }) => Boolean(isMobile));

  test("caption rides the same fade to the page background as on phones", async ({ page }) => {
    await page.goto("/");
    const card = page.locator(CARD).first();
    await card.scrollIntoViewIfNeeded();

    const cover = (await card.locator('[data-cover="true"]').boundingBox())!;
    const panel = (await card.locator('[data-panel="true"]').boundingBox())!;

    const style = await card.locator('[data-panel="true"]').evaluate((node) => {
      const cs = getComputedStyle(node);
      return { opacity: cs.opacity, backdrop: cs.backdropFilter, background: cs.backgroundImage };
    });

    // Overlaid on the cover, bottom-aligned with it.
    expect(panel.y).toBeGreaterThan(cover.y);
    expect(Math.round(panel.y + panel.height)).toBeCloseTo(Math.round(cover.y + cover.height), 0);
    // Always visible, a gradient into the page colour, never a frosted plate.
    expect(style.opacity).toBe("1");
    expect(["none", ""]).toContain(style.backdrop);
    expect(style.background).toContain("gradient");
  });

  test("hovering a card leaves the cover fully visible", async ({ page }) => {
    await page.goto("/");
    const card = page.locator(CARD).first();
    await card.scrollIntoViewIfNeeded();

    const before = (await card.locator('[data-cover="true"]').boundingBox())!;
    await card.hover();
    await page.waitForTimeout(300);
    const after = (await card.locator('[data-cover="true"]').boundingBox())!;

    // The cover does not move or get covered on hover.
    expect(after).toEqual(before);
  });
});

test.describe("projects on a coarse pointer", () => {
  test.skip(({ isMobile }) => !isMobile);

  test("the summary is visible without interaction", async ({ page }) => {
    await page.goto("/");
    const card = page.locator(CARD).first();
    await card.scrollIntoViewIfNeeded();
    const lines = card.locator('[data-reveal="line"]');
    await expect(lines.first()).toBeVisible();
    expect(await lines.first().evaluate((n) => getComputedStyle(n).opacity)).toBe("1");
  });

  test("the caption sits on a fade to the page background, not a frosted plate", async ({
    page,
  }) => {
    await page.goto("/");
    const panel = page.locator(`${CARD} [data-panel="true"]`).first();
    await panel.scrollIntoViewIfNeeded();
    const style = await panel.evaluate((node) => {
      const cs = getComputedStyle(node);
      return { backgroundImage: cs.backgroundImage, backdrop: cs.backdropFilter };
    });
    // A gradient into the background — the desktop frosted look must not leak
    // onto touch, where a decorative blur is banned.
    expect(style.backgroundImage).toContain("gradient");
    expect(["none", ""]).toContain(style.backdrop);
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
