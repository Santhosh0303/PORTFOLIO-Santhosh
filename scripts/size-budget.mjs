// Size budget gate: first-load JavaScript of every page <= 150 KB gzip (performance chart).
import { readFileSync, readdirSync, statSync } from "node:fs";
import { gzipSync } from "node:zlib";
import { join } from "node:path";

const BUDGET = 150 * 1024;
const out = "out";
const pages = (d) => readdirSync(d).flatMap((f) => {
  const p = join(d, f);
  if (f === "_next") return [];
  return statSync(p).isDirectory() ? pages(p) : p.endsWith(".html") ? [p] : [];
});

let bad = 0;
for (const page of pages(out)) {
  const html = readFileSync(page, "utf8");
  // nomodule polyfills are never downloaded by the browsers we support, so they do not count.
  const tags = [...html.matchAll(/<script[^>]+src="[^"]+\.js"[^>]*>/g)].map((m) => m[0]).filter((t) => !/no-?module/i.test(t));
  const srcs = [...new Set(tags.map((t) => /src="([^"]+)"/.exec(t)?.[1]).filter(Boolean))];
  const total = srcs.reduce((n, s) => n + gzipSync(readFileSync(join(out, s))).length, 0);
  const kb = (total / 1024).toFixed(1);
  console.log(`size-budget: ${page.replace(out, "") || "/"} ${kb} KB gz`);
  if (total > BUDGET) { console.error(`  over the 150 KB budget`); bad++; }
}
process.exit(bad ? 1 : 0);
