# DESIGN.md: Deep Interstellar (draft 3 (passed by the coordinator))

Single source of truth for the look of the site. Every page, component and 3D scene follows this file. A change to the look starts here, never in a component. Two checks guard it: `scripts/theme-tokens-check.mjs` fails the build if `app/globals.css` drifts from the token block, and the theme guard (section 13) compares every page with the last approved look.

Owner: Sai Santhosh Bellam. Approved look (2026-10-12): Particle Universe, deep interstellar, dark only. Validated against Plan v3, the system design and the performance chart by the project coordinator.

## 1. Principles
1. One hand: every surface uses the tokens below; no ad-hoc colours, sizes or easings.
2. Text first: all content is real HTML that appears before any 3D code loads. Every word the 3D shows (the name, skills, project names) also exists as HTML text; the canvas carries none.
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
| panel | cards, orb panel, contact form, header once scrolled | |
| starlight | primary text | 18.1:1 on void, 17.0:1 on panel |
| stardust | secondary text, labels, control boundaries (`--control`), only on solid void or panel | 6.4:1 on void, 6.0:1 on panel |
| gold | links, buttons, focus ring, black-hole disk, active states | 11.6:1 on void, 10.9:1 on panel |
| scrim | void overlay behind any text that sits over the 3D or poster | worst case over a white star: starlight 7.8:1, gold 5.0:1, stardust 2.8:1 |
| line, line-strong | decorative dividers and card edges only (about 1.3:1 and 1.9:1, never a control boundary) | |
| nebula-* | 3D scene and poster stills only; never text, controls or CSS gradients | |

Rules for text and controls over the 3D or poster (on the scrim): text is starlight only; gold appears there only as a button fill, focus ring or boundary; control boundaries there are starlight or gold; stardust and `--control` are used only on solid void or panel. This keeps the lowest planned pair at 6.0:1 (stardust on panel).

"Starlight blue" in the data galaxy is drawn with `--starlight`; no extra blue token exists.

## 3. Typography
- Headlines: Geist, weight 300, letter-spacing 0.08em, uppercase for the hero only.
- Body: Geist 400, 16px minimum, line-height 1.6, measure 68ch.
- Labels and mission data: Geist Mono 400/500, 13px minimum on desktop and 14px on phones, letter-spacing 0.04em, stardust or starlight only.
- Fluid scale, each with a rem part so browser text zoom still enlarges headings (WCAG 1.4.4): hero `clamp(2.5rem, 0.5rem + 7vw, 6rem)`; h1 `clamp(2rem, 1rem + 3.5vw, 3.5rem)`; h2 `clamp(1.5rem, 1rem + 1.8vw, 2.25rem)`; body 1rem.
- Fonts load through `next/font` (the `geist` package), self-hosted and subset, with fallback metrics so the swap adds no layout shift (CLS 0.05 or less). Budget 70 KB.

## 4. Layout and spacing
- Mobile first. Single column below 768px; side gutter 16px; content max width 1120px.
- Spacing only from `--space-*`. Sections separated by `--space-8` on phones and `--space-9` on desktop.
- Touch targets at least 44x44px. `scroll-padding` is set so the sticky header and the floating orb never fully hide a focused element (WCAG 2.4.11).

## 5. Motion
- `--ease-out` for entrances, `--ease-in-out` for camera and track changes. Durations: fast 150ms (hover), base 300ms (UI), slow 700ms (section reveals).
- Launch intro: first visit only, under 2s, skippable. Hyperspace jump 900ms to 1.4s, skippable, first moving frame within 100ms of input.
- Animate transform and opacity only; never layout properties. 3D initialises in slices of at most 50ms.
- Reduced motion (the OS setting) and the pause-motion switch behave the same: the intro is skipped; hyperspace jumps and the galaxy switch become a crossfade; text reveals become fades with no movement; pointer effects (magnetic buttons, spotlight, cursor gravity well) are off; no parallax, no particle drift, no continuous animation after settling (the orb stops pulsing, the grain is static, Lenis smooth scroll and scroll-scrubbed GSAP are off); the Static poster replaces the live canvas.
- Any switch to a still (pause, reduced motion, WebGL lost, tier drop) crossfades with no layout shift.
- The pause-motion switch sits in the header beside the sound toggle, on every page, reachable by keyboard, and remembers the choice (WCAG 2.2.2).
- Hover previews meet WCAG 1.4.13 and every hover has a focus and tap equivalent plus a visible control to enter.
- Repeated controls carry their target in the accessible name, starting with the visible words: "Enter the Data galaxy", "Open case study: <project>" (WCAG 2.4.4, 2.5.3).

## 6. Effects (3D scene and poster stills only)
Plan v3 section 4 lists six effects, all kept on every tier: layered star field with depth, drifting nebulae, bloom, film grain (4% opacity, static under reduced motion), gravitational lensing at the black hole, hyperspace streaks.
- Data galaxy: a barred spiral whose arms are flowing data streams; ordered and crystalline, in ion teal and starlight blue.
- AI galaxy: a neural nebula of glowing filaments that fire like synapses; organic, in indigo and magenta.
- Colour warms along each journey, from cold starlight at the top to gold at the black hole.
- Sound: deep-space ambient and soft UI blips, off by default, toggled from the header. Audio loads only when turned on.

## 7. Theme guarantee
One persistent canvas lives in the shared layout, so there are no reloads or flashes between sections, pages or tracks. A poster frame (a still of the real universe) paints first; the live 3D fades in over it without moving anything. The canvas is `aria-hidden`.

## 8. Scenes
Wording follows Plan v3 section 5. "In stardust" in Hero and About means formed from particles, not the `--stardust` colour. The visible name is always real HTML text: the Launch and Hero particles resolve into it and never replace it (WCAG 1.4.5). The phone line under each scene is a first composition that Phases 1 and 2 refine.
| Scene | What it is | Phone composition |
|---|---|---|
| Launch `/` | Stars streak in from hyperspace and form "Sai Santhosh Bellam" (first visit only, under 2 s, skippable). Then "Choose your mission" shows the two galaxies side by side: hover or tap to preview, click to fly in. The orb offers: "Hiring? Paste a job ad and I'll take you to the right galaxy." | The galaxies stack, Data above AI; tap previews, a visible "Enter" button flies in. |
| Hero `/data` `/ai` | Your name in stardust with the track's role title from discovery; the cursor is a gentle gravity well. | Name and role title centred over the scrim; no cursor effect. |
| About | A particle planet (or your portrait in stardust, if you share a photo), a bio written for that role, and key numbers as mission data. | Planet first, bio, then numbers in a single column. |
| Work | The camera flies past one star system per project; hovering shows a preview through a lensing ripple; clicking makes a hyperspace jump into the case study. | One system at a time; tap shows the preview, a visible "Open case study" button jumps. |
| Orb moment | "Hiring for a specific role? Paste the job ad", with strengths-only results inline. | Full-width field with counter, results as a stacked list. |
| Skills | Constellations, one per skill group for that role. | One constellation per screen, with its skills also listed as text. |
| Journey | An orbit path with a comet, with studies, projects, internships and milestones as waypoints. | A vertical path; waypoints as a text list beside the orbit. |
| Contact | The black hole with its golden accretion disk, with the form and links at the event horizon. | Form on a panel above the disk; links beneath. |
| Footer | Mission log (local time and availability), "Switch galaxy" and "Return to launch". | Three stacked lines. |
| `/work` | A star map of every project across both galaxies, filterable by track, with a plain list view. | The star map first, as on desktop, with a visible toggle to the list; the list comes first only when the 3D isn't running (Static tier). Every project star has a 44 px hit area. |
| Case study | A destination with its own nebula colour: role, stack, year, links, problem, approach, outcome, gallery, then "Next destination" within the current track. The nebula colour is one of the three nebula tokens or a blend of two, set in content. | Single column; gallery as a swipeable row with arrow buttons. |
| 404 | Particles drift apart into the void, with a way home. | "Signal lost" and a Return to launch button. |

## 9. Components (rebuilt from the library in these tokens)
- Buttons: gold text on panel with a gold 1px border; primary is solid gold with void text. Radius `--radius-md`.
- Cards and panels: panel fill, `--line` border, `--radius-lg`.
- Form fields, the Data | AI switch and toggles: boundary `--control` on solid void or panel (at least 3:1, WCAG 1.4.11).
- Inline links are underlined (gold alone is not enough, WCAG 1.4.1). Any text over the 3D or poster sits on a `--scrim`.
- Focus: 2px `--focus` ring, 2px offset, on 100% of interactive elements.
- Header: Data | AI switch, menu, sound toggle, pause-motion switch, CV for the current track. Panel fill once scrolled; scrim before. The current track is the one in the URL on `/data` and `/ai`. On Launch, `/work`, `/privacy` and the 404 it is the last track chosen this visit, held in memory only. A case study opened directly takes its project's primary track, set in content. With no track chosen the switch shows neither and the CV control offers both CVs.
- Orb: a small living star in the corner of every page that pulses gently and opens a mission-control panel. You paste a job ad or ask a question; questions get exact pre-approved facts. Featured moments on Launch and in each track show results inline; the corner star opens the panel. Results are projects and skills, each with one pre-approved line: strengths only, no score, no gaps. It detects a Data or AI ad and offers the jump. Input has an 8,000-character cap with a visible counter and a calm rate-limit message. One line under the input says text is kept 30 days, never used for training, and personal details are removed, with a link to `/privacy`; it claims only what redaction is proven to remove (Phase 3 settles whether names can be removed, with a card for Sandy if not). AI and fallback results share one card. The panel is a dialog: focus moves in, Esc closes, focus returns to the star. On phones it is a full-height sheet with the 3D paused behind it. Its code loads only when opened. "Sandy" appears only here, as a friendly nickname.
- Footer: its mission log is a status line and never links to `/mission-log`. The local time is set at render and does not tick, or it stops with the pause switch (WCAG 2.2.2).
- Contact form: sits on a panel, because the black hole behind it is the brightest part of the scene. Visible labels; caps of name 100, email 254 and message 4,000 characters with a counter; errors shown in text and announced. States: sending, sent, rate limited (3 per 10 minutes), error, and switched off; error and switched off both point to the email and LinkedIn links. A honeypot field; Turnstile in the dark theme with interaction-only appearance, loaded only when typing starts. One line says messages are kept 30 days, with a link to `/privacy`.
- `/work`: a star map with a one-tap plain list view (the non-drag alternative, WCAG 2.5.7).
- 404 "Signal lost". A share image per track and per case study, made at build time.

## 10. Quality tiers and budgets
- Tiers: High 250k particles, Medium 120k, Low 40k, Static poster; chosen from the GPU and adjusted from the live frame rate. Tiers change the particle count only and every effect stays on all three; cutting an effect on Low needs a card for Sandy. A device that cannot hold Low drops to Static.
- Stills: Static and WebGL-lost use designed stills, one per route plus one per scene where the 3D changes (each galaxy, Work, Skills, Journey, the black hole, 404). Each page's first still is its LCP image within 100 KB on mobile; the rest load lazily.
- Frame time p95: 16.7ms or less on High (laptop) and Medium (iPhone); 33.3ms or less on Low (low-end Android). Long frames over 50ms at most 1%, none over 100ms. Dropped frames while scrolling on High 5% or less.
- 3D chunk 350 KB gzipped or less, loaded after first paint; ready within 1.5s on desktop and 3.5s on mobile after first paint; first-load JavaScript 150 KB gzipped or less.
- HTML 30 KB or less per page; CSS 25 KB or less; first visit on mobile, 3D included, 1 MB or less; heap growth 5% or less with GPU objects constant after 20 route trips; scripted interactions within 100ms on desktop and 200ms on mobile.
- 3D pauses when the tab is hidden or the scene is off screen (0 frames drawn). If WebGL is lost the poster is back within 100ms and 3D is restored within 2s.
- The performance chart's 56 metrics stay the full list; this section is the summary.

## 11. Accessibility and privacy
WCAG 2.2 AA. Text contrast at least 4.5:1 (lowest planned pair 6.0:1). 0 axe violations. 100% of features usable by keyboard, including the orb panel and the star map via its list view. Text never relies on colour alone. Motion respects the OS setting and the pause switch. A 200% text-zoom check is part of the end-to-end suite. Pause, sound and intro-seen live in local storage only, are never sent, are listed on `/privacy`, and no cookies are used.

## 12. Library rules
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

## 13. Theme guard
Every preview gets screenshots of every page on desktop and iPhone, compared with the last approved look, plus a review against this file and Vercel's design guidelines. Anything off-theme blocks the merge. Axe cannot measure contrast over the canvas, so the guard also samples the pixels behind each text block and control on its screenshots (text 4.5:1 or more, boundaries 3:1 or more). The token-drift script and the no-raw-colour rule are extra checks.

## 14. Do and do not
Do: dark void, generous space, one gold accent, real text, honest labels, UK spelling.
Do not: light mode, extra accent colours, nebula colours in the UI, stock imagery, brand tokens from any other site, unverified claims, any statement about AI-assisted building (Sandy's choice), and outside embeds or assets of any kind: everything is self-hosted and only the three named outside scripts load.

## 15. Open items
The look of the CVs (dark on-theme or plain printable) is asked on a card before Phase 1 builds them.
