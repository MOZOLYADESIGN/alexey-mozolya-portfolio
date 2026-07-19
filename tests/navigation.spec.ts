import { expect, test } from "@playwright/test";

test.describe("desktop nav", () => {
  test.skip(({ isMobile }) => Boolean(isMobile));

  test("shrinks on scroll and restores only at top", async ({ page }) => {
    await page.goto("/");
    const nav = page.locator("nav[aria-label='Основная навигация'] > div");

    const full = (await nav.boundingBox())!.height;

    await page.evaluate(() => window.scrollTo(0, 1200));
    await page.waitForTimeout(500);
    const compact = (await nav.boundingBox())!.height;

    await page.evaluate(() => window.scrollTo(0, 400));
    await page.waitForTimeout(500);
    const stillCompact = (await nav.boundingBox())!.height;

    await page.evaluate(() => window.scrollTo(0, 0));
    await page.waitForTimeout(500);
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
    await page.locator("#services").scrollIntoViewIfNeeded();
    await page.waitForTimeout(600);
    const current = await page
      .locator("nav[aria-label='Основная навигация'] a[aria-current='true']")
      .innerText();
    console.log({ current });
    expect(current).toBe("Услуги");
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
    expect(await page.evaluate(() => document.body.style.overflow)).toBe("");
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
