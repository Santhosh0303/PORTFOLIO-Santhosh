import { expect, test } from "@playwright/test";
import { PNG } from "pngjs";

// Theme guard, contrast sampling: axe cannot see what is behind text when a canvas sits there,
// so hide all text, screenshot the backdrop, and test each text block's colour against the
// BRIGHTEST pixel behind it (worst case for light text). Text needs 4.5:1.
const routes = ["/", "/data/", "/ai/", "/privacy/", "/does-not-exist/"];

const lin = (c: number) => { const s = c / 255; return s <= 0.03928 ? s / 12.92 : ((s + 0.055) / 1.055) ** 2.4; };
const lum = (r: number, g: number, b: number) => 0.2126 * lin(r) + 0.7152 * lin(g) + 0.0722 * lin(b);
const ratio = (a: number, b: number) => (Math.max(a, b) + 0.05) / (Math.min(a, b) + 0.05);

for (const route of routes) {
  test(`text contrast over backdrop: ${route}`, async ({ page }) => {
    await page.goto(route);
    await page.evaluate(() => document.fonts.ready);
    const blocks = await page.evaluate(() => {
      const out: { sel: string; color: string; x: number; y: number; w: number; h: number }[] = [];
      for (const el of document.querySelectorAll<HTMLElement>("h1, h2, p, li, a, button, label, span, strong")) {
        if (!el.offsetParent && getComputedStyle(el).position !== "fixed") continue;
        const own = [...el.childNodes].some((n) => n.nodeType === 3 && (n.textContent ?? "").trim());
        if (!own) continue;
        // Measure the text itself (not the element box) so borders and rounded corners are not mistaken for backdrop.
        const range = document.createRange();
        const first = [...el.childNodes].find((n) => n.nodeType === 3 && (n.textContent ?? "").trim())!;
        range.selectNodeContents(first);
        const r = range.getBoundingClientRect();
        if (r.width < 1 || r.height < 1) continue;
        const cs = getComputedStyle(el);
        // A full-page capture resizes the viewport, so bottom-anchored fixed elements move to the page bottom.
        const fixedShift = cs.position === "fixed" && cs.bottom !== "auto" ? document.documentElement.scrollHeight - innerHeight : 0;
        const inset = 0;
        out.push({ sel: el.tagName.toLowerCase() + ":" + (el.textContent ?? "").trim().slice(0, 24), color: cs.color, x: r.x + scrollX + inset, y: r.y + scrollY + fixedShift + inset, w: Math.max(1, r.width - 2 * inset), h: Math.max(1, r.height - 2 * inset) });
      }
      return out;
    });
    await page.addStyleTag({ content: "*{color:transparent!important;-webkit-text-fill-color:transparent!important;text-shadow:none!important}" });
    const png = PNG.sync.read(await page.screenshot({ fullPage: true }));
    const dpr = png.width / (await page.evaluate(() => document.documentElement.scrollWidth));
    const bad: string[] = [];
    for (const b of blocks) {
      const m = /rgba?\((\d+), (\d+), (\d+)/.exec(b.color);
      if (!m) continue;
      const fg = lum(Number(m[1]), Number(m[2]), Number(m[3]));
      let worst = Infinity;
      const x0 = Math.max(0, Math.floor(b.x * dpr)), x1 = Math.min(png.width, Math.ceil((b.x + b.w) * dpr));
      const y0 = Math.max(0, Math.floor(b.y * dpr)), y1 = Math.min(png.height, Math.ceil((b.y + b.h) * dpr));
      for (let y = y0; y < y1; y += 2) for (let x = x0; x < x1; x += 2) {
        const i = (y * png.width + x) * 4;
        worst = Math.min(worst, ratio(fg, lum(png.data[i]!, png.data[i + 1]!, png.data[i + 2]!)));
      }
      if (worst < 4.5) bad.push(`${b.sel} ${worst.toFixed(2)}:1`);
    }
    expect(bad, "text blocks below 4.5:1 against the pixels behind them").toEqual([]);
  });
}
