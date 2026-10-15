# DESIGN.md: Deep Interstellar

Single source of truth for the look of the site. Every page, component and 3D scene follows this file. A change to the look starts here, never in a component. `scripts/theme-tokens-check.mjs` fails the build if `app/globals.css` drifts from the token block below.

Owner: Sai Santhosh Bellam. Approved look (2026-10-12): Particle Universe, deep interstellar, dark only.

## 1. Principles
1. One hand: every surface uses the tokens below; no ad-hoc colours, sizes or easings.
2. Text first: all content is real HTML that appears before any 3D code loads.
3. One accent: accretion gold is the only UI accent. Nebula colours exist only inside 3D and decorative gradients.
4. Dark only. No light mode in v1.
5. Quiet by default: motion serves orientation; `prefers-reduced-motion` and a pause switch turn it off.
6. Honest copy: no claim without evidence; no internal labels; no false experience.

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
--focus: #ffb45a
--radius-s: 6px
--radius-m: 12px
--radius-l: 20px
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

Colour use:
| Token | Use |
|---|---|
| void | page background |
| panel | cards, orb panel, header when scrolled |
| starlight | primary text (contrast on void 17.8:1) |
| stardust | secondary text, labels (contrast on void 6.4:1; never below 16px on phones) |
| gold | links, buttons, focus ring, the black-hole disk, active states |
| nebula-* | 3D scenes and decorative gradients only; never text or controls |

## 3. Typography
- Headlines: Geist, weight 300, letter-spacing 0.08em, uppercase for hero only.
- Body: Geist 400, 16px minimum, line-height 1.6, max line length 68ch.
- Labels and mission data: Geist Mono 400/500, 13px minimum on desktop, 14px on phones, letter-spacing 0.04em.
- Scale (fluid): hero clamp(2.5rem, 8vw, 6rem); h1 clamp(2rem, 5vw, 3.5rem); h2 clamp(1.5rem, 3.5vw, 2.25rem); body 1rem.
- Fonts are self-hosted via the `geist` package, subset, `font-display: swap`, 70 KB budget.

## 4. Layout and spacing
- Mobile first. Single column below 768px; side gutter 16px; content max width 1120px.
- Spacing only from `--space-*`. Sections separated by `--space-8` on phones and `--space-9` on desktop.
- Touch targets at least 44x44px.

## 5. Motion
- Easing: `--ease-out` for entrances, `--ease-in-out` for camera and track changes.
- Durations: fast 150ms (hover), base 300ms (UI), slow 700ms (section reveals). Hyperspace jump 900ms to 1.4s, skippable.
- Never animate layout properties; use transform and opacity.
- Reduced motion: no parallax, no hyperspace streaks, no particle drift; poster images replace the canvas.
- 3D initialises in slices of at most 50ms.

## 6. Effects (3D and decorative)
Layered stars with depth, drifting nebulae, bloom, film grain (kept at 4% opacity), gravitational lensing at the black hole, hyperspace streaks. Data galaxy: barred spiral of data streams, teal and starlight blue. AI galaxy: neural nebula, indigo and magenta. Colour warms from cold starlight at the top of each journey to gold at the black hole.

## 7. Components (rebuilt from the library, in these tokens)
- Buttons: gold text on panel with gold 1px border; primary is solid gold with void text. Radius `--radius-m`.
- Cards and panels: `--panel` fill, `--line` border, `--radius-l`.
- Orb: a small living star bottom-right, opens a mission-control panel; strengths only, no score, no gaps.
- Focus: 2px `--focus` ring, 2px offset, always visible.
- Header: Data | AI switch, menu, sound toggle (off by default), CV for the current track.

## 8. Quality tiers
High (250k particles), Medium (120k), Low (40k), Static poster. Chosen from the GPU and adjusted from the live frame rate. Without WebGL the designed poster images take over.

## 9. Accessibility
WCAG 2.2 AA. Keyboard and screen-reader support including the orb panel. Visible focus. Text never relies on colour alone. Motion respects the user setting.

## 10. Do and do not
Do: dark void, generous space, one gold accent, real text, honest labels.
Do not: light mode, extra accent colours, stock imagery, copied component code or text from any library, brand tokens from any other site, unverified claims.

## 11. Library rules
The ten reference links are one collective library of ideas. Pieces are rebuilt in these tokens. Licences were checked in discovery (see `docs/library-notes.md`); where a licence is unclear or paid, nothing is copied.
