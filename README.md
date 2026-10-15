# portfolio-santhosh

Portfolio of Sai Santhosh Bellam: a deep-space, particle-universe site with two tracks (Data and AI) and a job-ad matcher (the "orb").

Status: Foundation (Phase 0B). Nothing here is public-facing content yet; every page is `noindex`.

## How it is built
- Next.js (App Router, static export) + React, TypeScript strict, Tailwind v4, tokens from [DESIGN.md](DESIGN.md).
- One Cloudflare Worker serves the exported pages and a same-origin API (`worker/`): `/api/orb`, with `/api/contact`, `/api/mission-log` and `/api/rum` stubbed. D1 holds logs for 30 days; a daily cron purges them.
- The orb is match-and-search only (no text generation). Foundation answers with the keyword matcher; Workers AI embeddings come in Phase 3.

## Commands
| Command | What it does |
|---|---|
| `pnpm dev` | Next dev server |
| `pnpm build` | Static export to `out/` |
| `pnpm gates:static` | Types, lint (zero warnings), token drift check |
| `node scripts/size-budget.mjs` | First-load JS <= 150 KB gzip per page |
| `npx playwright test` | Theme guard (set `CHROMIUM_PATH` to use an installed Chromium) |
| `pnpm worker:dev` | Worker + assets locally (run `pnpm build` first) |

## Checks (CI)
Static gates, build once with a content hash, theme guard on desktop and iPhone viewports, then (when enabled) a deploy to a separate preview Worker. The preview job stays off until the Cloudflare account exists and `CLOUDFLARE_PREVIEW_ENABLED` is set.

## Licence
Code: MIT (`LICENSE`). Site content (bio, case studies, CVs, images, matcher reason lines): all rights reserved, see `CONTENT-LICENSE.md`.

Project content, case studies and CVs arrive in Phase 1.
