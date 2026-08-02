import { expect, test } from "@playwright/test";

test.describe("desktop nav", () => {
  test.skip(({ isMobile }) => Boolean(isMobile));

  test("shrinks on scroll and restores only at top", async ({ page }) => {
    await page.goto("/");
    const nav = page.locator("nav[aria-label='Основная навигация'] > div");

    // The capsule and its controls both animate; wait for every transition in
    // the subtree instead of guessing a duration.
    const settle = async () => {
      await page.waitForTimeout(100);
      await nav.evaluate((el) =>
        Promise.all(el.getAnimations({ subtree: true }).map((a) => a.finished)),
      );
    };

    const full = (await nav.boundingBox())!.height;

    // Scroll instantly — the page sets scroll-behavior: smooth, and we are
    // asserting the compact state at a depth, not the smooth-scroll timing.
    await page.evaluate(() => window.scrollTo({ top: 1200, behavior: "instant" }));
    await settle();
    const compact = (await nav.boundingBox())!.height;

    await page.evaluate(() => window.scrollTo({ top: 400, behavior: "instant" }));
    await settle();
    const stillCompact = (await nav.boundingBox())!.height;

    await page.evaluate(() => window.scrollTo({ top: 0, behavior: "instant" }));
    await settle();
    const restored = (await nav.boundingBox())!.height;

    console.log({ full, compact, stillCompact, restored });
    expect(compact).toBeLessThan(full);
    expect(stillCompact).toBeCloseTo(compact, 0);
    expect(restored).toBeCloseTo(full, 0);
  });

  test("hover does not change control size", async ({ page }) => {
    await page.goto("/");
    const link = page.locator("nav[aria-label='Основная навигация'] a", { hasText: "Работы" });
    const before = (await link.boundingBox())!;
    await link.hover();
    await page.waitForTimeout(300);
    const after = (await link.boundingBox())!;
    expect(after.width).toBe(before.width);
    expect(after.height).toBe(before.height);
    expect(before.height).toBeGreaterThanOrEqual(44);
  });

  test("marks the active section", async ({ page }) => {
    await page.goto("/");
    await page.locator("#situations").scrollIntoViewIfNeeded();
    await page.waitForTimeout(600);
    const current = await page
      .locator("nav[aria-label='Основная навигация'] a[aria-current='true']")
      .innerText();
    console.log({ current });
    expect(current).toBe("С чего начать");
  });
});

test.describe("mobile drawer", () => {
  test.skip(({ isMobile }) => !isMobile);

  test("traps focus, closes on Escape and restores focus", async ({ page }) => {
    await page.goto("/");
    const trigger = page.getByRole("button", { name: "Меню" });
    expect((await trigger.boundingBox())!.height).toBeGreaterThanOrEqual(44);

    await trigger.click();
    const dialog = page.getByRole("dialog");
    await expect(dialog).toBeVisible();

    // Background must not scroll while the drawer is open.
    const overflow = await page.evaluate(() => document.body.style.overflow);
    expect(overflow).toBe("hidden");

    // Focus stays inside the dialog after cycling past the last control.
    for (let i = 0; i < 10; i += 1) await page.keyboard.press("Tab");
    const inside = await page.evaluate(() =>
      document.querySelector("dialog")!.contains(document.activeElement),
    );
    expect(inside).toBe(true);

    await page.keyboard.press("Escape");
    await expect(dialog).toBeHidden();

    const focused = await page.evaluate(() => document.activeElement?.textContent);
    expect(focused).toBe("Меню");
    // The `close` event is queued as a task, so the unlock lands a tick after
    // the dialog is already hidden.
    await expect
      .poll(() => page.evaluate(() => document.body.style.overflow))
      .toBe("");
  });

  test("telegram capsule appears only once the hero CTA leaves the screen", async ({ page }) => {
    await page.goto("/");
    const telegram = page.locator("nav[aria-label='Мобильная навигация'] a");
    const menu = page.getByRole("button", { name: "Меню" });

    // Hero CTA on screen: only the menu is offered.
    await expect(telegram).toBeHidden();
    const menuAlone = (await menu.boundingBox())!;

    await page.locator("#situations").scrollIntoViewIfNeeded();
    await page.waitForTimeout(600);

    await expect(telegram).toBeVisible();
    expect((await telegram.boundingBox())!.width).toBeGreaterThan(100);
    // The menu slides aside — from centred to the right edge.
    expect((await menu.boundingBox())!.x).toBeGreaterThan(menuAlone.x);

    // Back at the hero it collapses again and leaves the tab order.
    await page.locator("#top").scrollIntoViewIfNeeded();
    await page.waitForTimeout(600);
    await expect(telegram).toBeHidden();
  });

  test("desktop capsule is hidden", async ({ page }) => {
    await page.goto("/");
    await expect(page.locator("nav[aria-label='Основная навигация']")).toBeHidden();
  });
});

test("no horizontal scroll at 320px", async ({ page }) => {
  await page.setViewportSize({ width: 320, height: 800 });
  await page.goto("/");
  const overflow = await page.evaluate(
    () => document.documentElement.scrollWidth - document.documentElement.clientWidth,
  );
  expect(overflow).toBeLessThanOrEqual(0);
});
