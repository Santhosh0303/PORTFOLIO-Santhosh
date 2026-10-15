// Theme guard, layer 1: app/globals.css :root must match the token block in DESIGN.md exactly.
import { readFileSync } from "node:fs";

const design = readFileSync("DESIGN.md", "utf8");
const css = readFileSync("app/globals.css", "utf8");

const block = /```tokens\n([\s\S]*?)```/.exec(design)?.[1];
if (!block) {
  console.error("theme-guard: no tokens block in DESIGN.md");
  process.exit(1);
}
const wanted = new Map(
  block.trim().split("\n").map((l) => {
    const [k, ...v] = l.split(":");
    return [k.trim(), v.join(":").trim()];
  }),
);
const root = /:root\s*{([\s\S]*?)}/.exec(css)?.[1] ?? "";
const have = new Map();
for (const m of root.matchAll(/(--[\w-]+)\s*:\s*([^;]+);/g)) have.set(m[1], m[2].trim());

let bad = 0;
for (const [k, v] of wanted) {
  if (have.get(k) !== v) {
    console.error(`theme-guard: ${k} is "${have.get(k) ?? "missing"}" in globals.css, DESIGN.md says "${v}"`);
    bad++;
  }
}

// No raw hex outside the :root block in app and components: use tokens.
import { readdirSync, statSync } from "node:fs";
const walk = (d) => readdirSync(d).flatMap((f) => {
  const p = `${d}/${f}`;
  return statSync(p).isDirectory() ? walk(p) : [p];
});
for (const f of [...walk("app"), ...walk("components")]) {
  if (!/\.(tsx?|css)$/.test(f)) continue;
  let src = readFileSync(f, "utf8");
  if (f === "app/globals.css") src = src.replace(/:root\s*{[\s\S]*?}/, "");
  // A line may opt out with "theme-allow" (e.g. browser metadata that cannot use CSS variables).
  src = src.split("\n").filter((l) => !l.includes("theme-allow")).join("\n");
  const hit = src.match(/#[0-9a-fA-F]{3,8}\b/);
  if (hit) {
    console.error(`theme-guard: raw colour ${hit[0]} in ${f}; use a DESIGN.md token`);
    bad++;
  }
}

if (bad) process.exit(1);
console.log(`theme-guard: ${wanted.size} tokens match, no raw colours`);
