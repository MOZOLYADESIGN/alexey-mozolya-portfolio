import { expect, test } from "@playwright/test";

test("hero: no video request on any viewport while assets are placeholders", async ({ page }) => {
  const media: string[] = [];
  page.on("request", (r) => { if (r.resourceType() === "media") media.push(r.url()); });
  await page.goto("/");
  await page.waitForLoadState("networkidle");
  expect(media).toEqual([]);
});

test("hero: portrait has explicit dimensions and no layout shift", async ({ page }) => {
  await page.goto("/");
  const img = page.locator("#top img").first();
  await expect(img).toHaveAttribute("width", "850");
  await expect(img).toHaveAttribute("height", "840");
  await expect(img).toHaveAttribute("alt", /Алексей/);

  const cls = await page.evaluate(() => new Promise<number>((resolve) => {
    let total = 0;
    new PerformanceObserver((list) => {
      for (const e of list.getEntries() as unknown as { value: number; hadRecentInput: boolean }[]) {
        if (!e.hadRecentInput) total += e.value;
      }
    }).observe({ type: "layout-shift", buffered: true });
    setTimeout(() => resolve(total), 1500);
  }));
  console.log({ cls });
  expect(cls).toBeLessThan(0.1);
});

test("hero: single h1 containing the exact phrase", async ({ page }) => {
  await page.goto("/");
  const h1 = page.locator("h1");
  await expect(h1).toHaveCount(1);
  const text = (await h1.innerText()).replace(/\s+/g, " ").trim();
  expect(text).toBe("Прокачиваю смыслы, визуал, стратегию и коммуникацию цифровых продуктов");
});

test("hero: CTAs point at telegram and projects", async ({ page }) => {
  await page.goto("/");
  await expect(page.locator("#top a[href='https://t.me/poofex']")).toHaveCount(1);
  await expect(page.locator("#top a[href='#projects']")).toHaveCount(1);
});

test("hero: no floating gradient object remains", async ({ page }) => {
  await page.goto("/");
  await expect(page.locator("#top [aria-hidden='true']")).toHaveCount(0);
});

test("hero: CTAs span the full width below 768px", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/");
  const hero = (await page.locator("#top h1").boundingBox())!;
  for (const name of ["Написать в Telegram", "Смотреть работы"]) {
    const box = (await page.locator("#top a", { hasText: name }).boundingBox())!;
    expect(Math.round(box.width)).toBe(Math.round(hero.width));
  }
});

test("hero: CTAs stop stretching from 768px up", async ({ page }) => {
  await page.setViewportSize({ width: 768, height: 1024 });
  await page.goto("/");
  const hero = (await page.locator("#top h1").boundingBox())!;
  const cta = (await page.locator("#top a", { hasText: "Написать в Telegram" }).boundingBox())!;
  expect(cta.width).toBeLessThan(hero.width);
});

for (const [w, h] of [[360, 800], [390, 844], [768, 1024], [1024, 768], [1440, 900], [1920, 1080]]) {
  test(`hero: no horizontal scroll at ${w}x${h}`, async ({ page }) => {
    await page.setViewportSize({ width: w, height: h });
    await page.goto("/");
    const over = await page.evaluate(() =>
      document.documentElement.scrollWidth - document.documentElement.clientWidth);
    expect(over).toBeLessThanOrEqual(0);
  });
}
