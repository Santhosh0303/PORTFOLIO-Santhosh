# First-load JavaScript budget

Gate: at most 150 KB gzip of JavaScript per page on first load (performance chart). `node scripts/size-budget.mjs` enforces it on the static export; scripts marked `nomodule` (legacy polyfills the supported browsers never download) are not counted.

## Measured on 2026-10-15 (Next 16.4.1, React 19.3.1)
| Build | Bare page, no orb | With the orb button |
|---|---|---|
| Turbopack (default) | 135.8 KB | 137.4 KB |
| Webpack (`next build --webpack`) | 135.2 KB | not measured |

The framework (React DOM about 62-70 KB, Next client and router about 45-66 KB) is the floor under either bundler, so it is not a configuration problem. It is larger than older Next.js 14 numbers (about 100 KB) because React 19 and the current App Router ship more runtime.

## What this leaves for Phase 1 and later
About 12.6 KB gzip for everything else that loads before first paint. Therefore:
- GSAP, Lenis, the 3D scene, the poster logic and the orb panel load after first paint (dynamic import), never in the first-load set.
- The orb star itself is a client component of about 1.6 KB; its panel is a separate lazy chunk.
- Any new dependency in the root layout needs its gzip cost added to this table in the same pull request.
