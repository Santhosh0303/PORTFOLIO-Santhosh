import { expect, test } from "@playwright/test";

// Theme guard, layer 2: screenshots of every page against the look Sandy approved,
// plus computed-style checks that the DESIGN.md tokens actually reach the browser.
const routes = ["/", "/data/", "/ai/", "/privacy/", "/does-not-exist/"];

for (const route of routes) {
  test(`look: ${route}`, async ({ page }) => {
    await page.goto(route);
    await page.evaluate(() => document.fonts.ready);
    const name = route === "/" ? "launch" : route.replaceAll("/", "") || "page";
    await expect(page).toHaveScreenshot(`${name}.png`, { fullPage: true });
  });
}

test("tokens reach the page", async ({ page }) => {
  await page.goto("/");
  const s = await page.evaluate(() => {
    const cs = getComputedStyle(document.body);
    const root = getComputedStyle(document.documentElement);
    return { bg: cs.backgroundColor, fg: cs.color, gold: root.getPropertyValue("--gold").trim(), scheme: root.colorScheme };
  });
  expect(s.bg).toBe("rgb(3, 4, 10)");
  expect(s.gold).toBe("#ffb45a");
  expect(s.scheme).toContain("dark");
});

test("no horizontal scroll at phone width", async ({ page }) => {
  await page.setViewportSize({ width: 375, height: 800 });
  await page.goto("/");
  const over = await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth);
  expect(over).toBeLessThanOrEqual(0);
});

test("no text below 14px", async ({ page }) => {
  await page.goto("/");
  const small = await page.evaluate(() =>
    [...document.querySelectorAll("p, li, a, button, label, h1, h2")]
      .filter((e) => (e as HTMLElement).offsetParent !== null)
      .map((e) => parseFloat(getComputedStyle(e).fontSize))
      .filter((px) => px < 14),
  );
  expect(small).toEqual([]);
});
