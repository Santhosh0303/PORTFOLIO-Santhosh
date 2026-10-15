# DESIGN.md: Deep Interstellar (draft 2)

Single source of truth for the look of the site. Every page, component and 3D scene follows this file. A change to the look starts here, never in a component. Two checks guard it: `scripts/theme-tokens-check.mjs` fails the build if `app/globals.css` drifts from the token block, and the theme guard (section 12) compares every page with the last approved look.

Owner: Sai Santhosh Bellam. Approved look (2026-10-12): Particle Universe, deep interstellar, dark only. Validated against Plan v3, the system design and the performance chart by the project coordinator.

## 1. Principles
1. One hand: every surface uses the tokens below; no ad-hoc colours, sizes or easings.
2. Text first: all content is real HTML that appears before any 3D code loads.
3. One accent: accretion gold is the only UI accent. Nebula colours exist only inside the 3D scene and the poster stills rendered from it.
4. Dark only. No light mode in v1.
5. Cinematic by default, calm on request: full 3D and motion run by default; reduced motion or the pause switch turns continuous motion off.
6. Honest copy in UK spelling and UK job titles: no claim without evidence, no internal labels, no false experience.

## 2. Tokens (machine-checked)
```tokens
--void: #03040a
--panel: #0b0e1a
--starlight: #eef1f8
--stardust: #8990a5
--gold: #ffb45a
--nebula-indigo: #5a4bff
--nebula-teal: #2fd3c6
--nebula-magenta: #d9468f
--line: rgb(238 241 248 / 0.12)
--line-strong: rgb(238 241 248 / 0.24)
--control: var(--stardust)
--scrim: rgb(3 4 10 / 0.72)
--focus: #ffb45a
--radius-sm: 6px
--radius-md: 12px
--radius-lg: 20px
--ease-out: cubic-bezier(0.16, 1, 0.3, 1)
--ease-in-out: cubic-bezier(0.65, 0, 0.35, 1)
--dur-fast: 150ms
--dur-base: 300ms
--dur-slow: 700ms
--space-1: 4px
--space-2: 8px
--space-3: 12px
--space-4: 16px
--space-5: 24px
--space-6: 32px
--space-7: 48px
--space-8: 72px
--space-9: 112px
```

| Token | Use | Contrast |
|---|---|---|
| void | page background | |
| panel | cards, orb panel, header once scrolled | |
| starlight | primary text | 18.1:1 on void, 17.0:1 on panel |
| stardust | secondary text, labels, control boundaries (`--control`) | 6.4:1 on void, 6.0:1 on panel |
| gold | links, buttons, focus ring, black-hole disk, active states | 11.6:1 on void, 10.9:1 on panel |
| scrim | void overlay behind any text that sits over the 3D or poster | holds 4.5:1 against bloom and nebula cores |
| line, line-strong | decorative dividers and card edges only (about 1.3:1 and 1.9:1, so never a control boundary) | |
| nebula-* | 3D scene and poster stills only; never text, controls or CSS gradients | |

"Starlight blue" in the data galaxy maps to `--starlight`. No extra blue token exists.

## 3. Typography
- Headlines: Geist, weight 300, letter-spacing 0.08em, uppercase for the hero only.
- Body: Geist 400, 16px minimum, line-height 1.6, measure 68ch.
- Labels and mission data: Geist Mono 400/500, 13px minimum on desktop and 14px on phones, letter-spacing 0.04em, stardust or starlight only.
- Fluid scale, each with a rem part so browser text zoom still enlarges headings (WCAG 1.4.4): hero `clamp(2.5rem, 0.5rem + 7vw, 6rem)`; h1 `clamp(2rem, 1rem + 3.5vw, 3.5rem)`; h2 `clamp(1.5rem, 1rem + 1.8vw, 2.25rem)`; body 1rem.
- Fonts load through `next/font` (the `geist` package), self-hosted and subset, with fallback metrics so the swap adds no layout shift (CLS 0.05 or less). Budget 70 KB.

## 4. Layout and spacing
- Mobile first. Single column below 768px; side gutter 16px; content max width 1120px.
- Spacing only from `--space-*`. Sections separated by `--space-8` on phones and `--space-9` on desktop.
- Touch targets at least 44x44px. `scroll-padding-top` is set so the sticky header and the floating orb never fully hide a focused element (WCAG 2.4.11).

## 5. Motion
- `--ease-out` for entrances, `--ease-in-out` for camera and track changes. Durations: fast 150ms (hover), base 300ms (UI), slow 700ms (section reveals).
- Launch intro: first visit only, under 2s, skippable. Hyperspace jump 900ms to 1.4s, skippable, first moving frame within 100ms of input.
- Animate transform and opacity only; never layout properties.
- 3D initialises in slices of at most 50ms.
- Reduced motion (the OS setting) and the pause-motion switch behave the same: no parallax, no hyperspace streaks, no particle drift, no continuous animation after settling (the orb stops pulsing, the grain is static, Lenis smooth scroll and scroll-scrubbed GSAP are off) and the Static poster replaces the live canvas.
- The pause-motion switch sits in the header beside the sound toggle, on every page, reachable by keyboard, remembers the choice (WCAG 2.2.2).

## 6. Effects (3D scene and poster stills only)
Layered stars with depth, drifting nebulae, bloom, film grain at 4% opacity (static under reduced motion), gravitational lensing at the black hole, hyperspace streaks.
- Data galaxy: a barred spiral whose arms are flowing data streams; ordered and crystalline, in ion teal and starlight.
- AI galaxy: a neural nebula of glowing filaments that fire like synapses; organic, in indigo and magenta.
- Colour warms from cold starlight at the top of each journey to gold at the black hole.
- Sound: deep-space ambient and soft UI blips, off by default, toggled from the header.

## 7. Theme guarantee
One persistent canvas lives in the shared layout, so there are no reloads or flashes between sections, pages or tracks. A poster frame (a still of the real universe) paints first; the live 3D fades in over it without moving anything. The canvas is `aria-hidden`.

## 8. Components (rebuilt from the library in these tokens)
- Buttons: gold text on panel with a gold 1px border; primary is solid gold with void text. Radius `--radius-md`.
- Cards and panels: panel fill, `--line` border, `--radius-lg`.
- Form fields, the Data | AI switch and toggles: boundary `--control` (at least 3:1, WCAG 1.4.11).
- Inline links are underlined (gold alone is not enough, WCAG 1.4.1). Any text over the 3D or poster sits on a `--scrim`.
- Focus: 2px `--focus` ring, 2px offset, on 100% of interactive elements.
- Header: Data | AI switch, menu, sound toggle (off by default), pause-motion switch, CV for the current track. Panel fill once scrolled; scrim before.
- Orb: a small living star in the corner of every page that pulses gently and opens a mission-control panel. Featured moments on Launch ("Hiring? Paste a job ad and I'll take you to the right galaxy.") and in each track ("Hiring for a specific role? Paste the job ad."). Results are projects and skills, each with one pre-approved line: strengths only, no score, no gaps. It detects a Data or AI ad and offers the jump. "Sandy" appears only here, as a friendly nickname.
- Footer: mission log with local time and availability, Switch galaxy, Return to launch.
- Contact form at the event horizon: honeypot field; Turnstile loads only when typing starts.
- /work: a star map with a one-tap plain list view (the non-drag alternative, WCAG 2.5.7).
- Case study: role, stack, year, links, problem, approach, outcome, gallery, Next destination within the current track, and its own nebula colour in 3D.
- 404 "Signal lost". A share image per track and per case study, made at build time.

## 9. Quality tiers and budgets
- Tiers: High 250k particles, Medium 120k, Low 40k, Static poster; chosen from the GPU and adjusted from the live frame rate. A device that cannot hold Low drops to Static.
- Frame time p95: 16.7ms or less on High (laptop) and Medium (iPhone); 33.3ms or less on Low (low-end Android). Long frames over 50ms at most 1%, none over 100ms.
- 3D chunk 350 KB gzipped or less, loaded after first paint; ready within 1.5s on desktop and 3.5s on mobile after first paint; first-load JavaScript 150 KB gzipped or less.
- 3D pauses when the tab is hidden or the scene is off screen (0 frames drawn). If WebGL is lost the poster is back within 100ms and 3D is restored within 2s.
- The poster is the mobile LCP image: 100 KB or less.

## 10. Accessibility
WCAG 2.2 AA. Text contrast at least 4.5:1 (lowest planned pair 6.0:1, stardust on panel). 0 axe violations. 100% of features usable by keyboard, including the orb panel and the star map via its list view. Text never relies on colour alone. Motion respects the OS setting and the pause switch. A 200% text-zoom check is part of the end-to-end suite.

## 11. Library rules
The ten reference links form one collective library. Nothing is used as-is: every piece is rebuilt in these tokens, licences are checked, and credits are kept where required. Full licence notes: `docs/library-notes.md`.
| Link | Planned use | Licence verdict |
|---|---|---|
| GSAP | scroll storytelling, timelines, text reveals | usable (standard free licence) |
| shadcn/ui | accessible building blocks, restyled | usable (MIT) |
| Motion Primitives | micro-interactions and UI patterns | usable (MIT) |
| Taste Skill | agent guidance and input for this file | usable (MIT) |
| libraries.dev/orbs | inspiration for the orb's living-star visual | usable (MIT React package; ports unclear) |
| awesome-design-md | format reference for this file only | usable (MIT); no brand tokens used |
| ThreeUI | 3D interface ideas | ideas only (paid) |
| 21st.dev | UI patterns | ideas only (author licences) |
| Vercel design guidelines | the quality checklist every page must pass | ideas only (no licence stated) |
| Vercel AI templates | patterns for the orb's API and panel | ideas only (no licence stated) |

## 12. Theme guard
Every preview gets screenshots of every page on desktop and iPhone, compared with the last approved look, plus a review against this file and Vercel's design guidelines. Anything off-theme blocks the merge. The token-drift script and the no-raw-colour rule are extra checks.

## 13. Do and do not
Do: dark void, generous space, one gold accent, real text, honest labels, UK spelling.
Do not: light mode, extra accent colours, nebula colours in the UI, stock imagery, brand tokens from any other site, unverified claims.
