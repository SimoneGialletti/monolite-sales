# Monolite Design System

> **Monolite** is an open-source agentic platform — a marketplace where
> law firms, accountants, auditors, and (above all) **developers and
> designers** publish AI agents that automate end-to-end business
> processes for freelancers and companies. From accounting and payments to
> HR, production, warehouse, and marketing, Monolite lays the rails on
> which third-party agents operate. The platform takes a **6% commission**
> on each agent's compensation.
>
> The brand is **clean and monolithic** — Stonehenge, the Pyramids of
> Giza, the stepped temples of Mesoamerica. Structures that endure and
> command quiet awe. The product surface borrows clarity from **Notion**,
> precision from **Linear**, and palette-mood from **Dune** (warm sand,
> cool obsidian, wide silence).

---

## Index — what's in this folder

| Path | What it is |
|---|---|
| `README.md` | This file. Brand context, content + visual + iconography fundamentals. |
| `colors_and_type.css` | All design tokens as CSS custom properties (light + dark). |
| `SKILL.md` | Agent-Skills entrypoint — load this when invoking the skill. |
| `assets/` | Logos and brand marks (PNG + SVG, light + dark). |
| `preview/` | Small HTML preview cards used by the Design System tab. |
| `ui_kits/platform/` | Pixel-faithful recreation of the Monolite product (board / agents / inbox). |
| `fonts/` | Reckless Standard (TRIAL) — the brand display serif. Used for H1/H2, marquee numbers, deck titles. |

---

## Sources

The design system was derived from:

- **Codebase** — `github.com/SimoneGialletti/monolite-ai` (private), specifically
  `ui/` (Vite + React 19 + Tailwind v4 + shadcn `new-york` style, base color
  `neutral`, `--radius: 0`).
- **Uploaded assets** — `logo_monolite.png` and two SVG icon-only marks
  (`IconOnly 2.svg` white-on-dark, `IconOnly 3.svg` dark-on-light).
- **Verbal brief** — Italian, summarised: *"agentic marketplace … brand
  clean, monolithic like Stonehenge, the Pyramids, Mesoamerican structures —
  inspired by Notion + Linear, color/film grade like Dune."*

The reader is **not** assumed to have access to the private repo; everything
needed is captured here.

---

## Brand essentials

- **Name** — Monolite (Italian for *monolith*)
- **Domain** — monoliteai.com (also `docs.monolite.ing`)
- **Wordmark** — `monolite` set lower-case, in the display face. `ai` is
  often dropped from the wordmark in product chrome.
- **Mark** — A double-stroke, ligatured **M** (the two peaks share their
  inner outline — like two standing stones connected by a lintel). Renders
  white on black for primary use; the inverse SVG is provided for white
  surfaces.
- **Tagline** *(working)* — "The rails for agentic work."
- **Commission line** *(working)* — "We take 6%. The agent keeps the rest."

---

## CONTENT FUNDAMENTALS

How Monolite writes copy.

### Voice
- **Direct, technical, and quietly confident.** No hype, no exclamation
  marks, no marketing fluff. The product is for builders and operators.
- **You-not-we for actions.** "Run onboarding again to add an agent." "Get
  started by creating a company."
- **Imperatives in headers and CTAs.** "Start Onboarding", "Add Agent",
  "Sign out", "New Issue", "Switch to dark mode".
- **Italian or English, never both in the same surface.** Italian is
  reserved for marketing site / pitch; product UI is English-only.

### Casing & punctuation
- **Title Case** for nav labels, page titles, dialog titles ("New Issue",
  "Cross-Client Search", "Knowledge Graph").
- **Sentence case** for body copy and inline help.
- **UPPERCASE + 0.06em tracking** *only* for the page H1 inside
  `BreadcrumbBar` ("DASHBOARD", "AGENTS"). This is the one and only place
  uppercase is allowed.
- **No period** at the end of one-line UI strings, button labels, or nav
  items. Period only in real prose paragraphs.
- **No emoji** in product UI. The brand reads as restrained and stoic.
  Emoji are explicitly avoided.

### Specific examples (verbatim from the codebase)
- > *"Instance setup required."* / *"No instance admin exists yet. Run this
  > command in your Monolite environment to generate the first admin invite
  > URL:"*
- > *"Run onboarding again to add an agent and a starter task for this
  > company."*
- > *"Get started by creating a company and your first agent."*
- > *"Skip to Main Content"* (a11y skip link)
- Beta features are tagged with a small **amber** pill reading `Beta`.

### Tone vibe
**Stone, not silk.** Monolite's copy reads like product documentation
written by an engineer who respects the reader's time. It does not sell, it
*explains and asks*. When ambition shows up, it shows up in the visuals
(Dune-cool dark theme, the monolithic mark) — never the words.

---

## VISUAL FOUNDATIONS

### Colors
Pure neutrals built on `oklch`. **No chroma in the product UI** — the only
colored pixels are the live-run heartbeat (blue), unread / destructive
(red), and the Beta tag (amber). All other surfaces are greyscale.

- Light theme runs from `oklch(1 0 0)` (background) to `oklch(0.145 0 0)`
  (text). The card layer is the same as the background; depth comes from
  borders, not fills.
- Dark theme — and **dark is the product's default** — runs from
  `oklch(0.145 0 0)` (~`#18181b`) background to `oklch(0.985 0 0)` text.
  Cards step *up* to `oklch(0.205 0 0)`; the sidebar stays at the
  background level.
- Brand / marketing palette ("Dune") — sand `oklch(0.86 0.07 80)`, spice
  `oklch(0.66 0.13 55)`, weathered stone `oklch(0.55 0.02 60)`, obsidian
  `oklch(0.16 0.01 260)`, warm paper `oklch(0.965 0.01 80)`. Used
  **only** in marketing surfaces and decks — never in the product UI.

### Type
A two-axis pairing:

- **Display — Reckless Standard** (the brand serif). Editorial,
  high-contrast, with a long quiet vertical and slightly flared
  terminals. It carries the *monolithic / awe / Dune* register and
  is reserved for **H1, H2, marquee numbers, deck titles, hero copy**.
  Set it at **400 Regular** by default — let the serif do the work;
  pulling up to 600/700 only when the moment really demands weight.
  Italics are exquisite — use them for editorial flourishes
  (“*Strutture che suscitano ammirazione*”) and pull-quotes.
  Files live in `fonts/RecklessStandardM-TRIAL-*.woff2` (full ladder
  Thin → Heavy + matching italics).
  **TRIAL note:** these are TRIAL files from displaay.com. Production
  use requires a license from Displaay; swap in licensed files when
  ready (the @font-face filenames are the only thing to update).

- **Body / UI — system stack** (`ui-sans-serif`, `system-ui`,
  `-apple-system`, …). The product UI deliberately inherits the OS
  sans — fast, neutral, no shipped weight cost. **Never set long-form
  body in Reckless** — it's a display face, not a reading face.

- **Mono — JetBrains Mono.** Code, kbd, tabular numerics, timestamps.

**Casting rule:** Reckless display + system-sans body. The contrast
between editorial serif and neutral sans is the brand voice in print.

Canonical sizes: 11 (meta) / 12 (badges) / **13 (sidebar nav — most
common UI text)** / 14 (body) / 15 (prose) / 18 / 20 / 24 / 30 / 40 / 56.

### Spacing
Strict 4px base. The shell uses `h-12` (48px) for breadcrumb + sidebar
header, `w-60` (240px) for the sidebar, `w-[72px]` for the company rail.

### Backgrounds
- **No gradients in the product.** Surfaces are flat solid fills.
- **No background images, illustrations, patterns, or textures** in the
  product UI.
- Decks and marketing may use *one* full-bleed image at a time, color-graded
  toward the Dune palette (warm sand or cool obsidian) — never busy.
- The only "decoration" the product allows is the auto-generated
  `CompanyPatternIcon` (a deterministic per-company avatar built from the
  brand color) on the company rail.

### Animation
- Primary easing — `cubic-bezier(0.16, 1, 0.3, 1)` (the "monolite curve",
  used everywhere from sidebar collapse to dialog resize and the
  `dashboard-activity-enter` animation).
- Secondary — `cubic-bezier(0.2, 0, 0.2, 1)`.
- Durations — 100ms for sidebar width, 150ms for hover, 200ms for dialog
  resize, 520ms for activity-row entry (the only "stagey" motion).
- **No bounces, no springs.** Motion is deliberate and short.
- Live agents emit a slow `animate-pulse` blue dot. That's the loudest
  motion in the product.
- `@media (prefers-reduced-motion)` disables the activity-row animation —
  honor it elsewhere too.

### Hover & press states
- **Hover** — `bg-accent/50` (subtle grey wash) + `text-foreground`
  (text from muted to full). Buttons darken `primary/90`. Never a color
  shift.
- **Press / active** — handled by the underlying interaction (no
  scale-down). The company rail tile changes its corner radius from 22px
  to 14px on hover/select — a quiet, monolithic reveal.
- **Focus-visible** — `ring-ring/50` 3px ring + border-ring. Always present
  for keyboard.

### Borders
- 1px solid `--mono-border` everywhere. Borders carry the entire UI;
  there is no shadow chrome to lean on.
- Section dividers and top/right rails of the sidebar are `border-border`.

### Shadows
Minimal. The dialog overlay floats with a faint shadow, and the focus ring
is the only "glow." Cards do **not** drop-shadow.
Use `--mono-shadow-sm` for popovers, `--mono-shadow-md` for dialogs,
`--mono-shadow-lg` only for command palette / modal stack.

### Capsules vs gradients
- **Capsules win.** Status pills, mention chips, and badges use
  `border-radius: 999px` with a 1px border — never a gradient or fill-only
  pill.
- **No protection gradients** under text. If text needs separation from
  imagery, use a solid backplate (a card), not a fade.

### Layout rules
- One **fixed** company rail (`72px` wide), one **collapsible** sidebar
  (`240px` ↔ `0`), one **breadcrumb bar** (`h-12`), one **scrollable
  main**, optional **PropertiesPanel** docked right.
- Mobile collapses the rail+sidebar into a slide-in drawer; a bottom nav
  appears.
- The shell `body` is `overflow: hidden` on desktop — the *main* region
  scrolls, never the page.

### Transparency & blur
- Only on the mobile sticky breadcrumb header:
  `bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/85`.
- Modal overlays use plain `bg-black/50` — no blur. Restraint.

### Imagery vibe
- Product imagery is **rare** and **monochrome**.
- Marketing imagery, when used, leans Dune: warm sand or cool obsidian
  grading, slight grain, never saturated. Black-and-white photography of
  *built* things (concrete, stone, structures) reads on-brand. Avoid
  people-glamour shots, avoid neon, avoid 3D-renders-of-AI tropes.

### Corner radii (the most important rule)
**`--radius: 0`.** The product UI is **square-cornered**. This is the
single strongest visual signal that we are looking at Monolite and not
yet-another-shadcn-app.

Exceptions, all explicit:
- `--radius-sm: 6px` for inline code, `<kbd>`, mention chips
  (because chips are pills, see below).
- `--radius-md: 8px` for popovers, the company-tile resting state,
  CompanyPatternIcon.
- `999px` (pill) for status dots, mention chips, Beta tag.
- The company-rail tile is `rounded-[22px]` at rest and `rounded-[14px]`
  when selected/hovered — a Discord-style squircle reveal.

### Cards
A "card" in Monolite is **a 1px border, no shadow, no rounded corner,
flat surface fill** (`var(--mono-surface)`). Padding `p-4` to `p-6`.
That's it. The discipline is the design.

---

## ICONOGRAPHY

- **System** — [Lucide](https://lucide.dev) (locked in
  `ui/components.json` → `"iconLibrary": "lucide"` and
  `lucide-react@^0.574.0` in `package.json`).
- **Stroke** — Lucide default 2px stroke, `currentColor`.
- **Sizes** — 14px (`h-3.5`) for inline meta, **16px (`h-4`) is canonical**
  for nav and buttons, 20px (`h-5`) for empty-state and the rail
  Paperclip.
- **Format** — SVG-as-component (`lucide-react`). No icon font.
- **No emoji.** No unicode glyphs as icons (no ✓ ★ →). Text-only labels
  or a Lucide icon — pick one.
- **No PNG icons.** Brand-mark PNG is only kept as a fallback favicon /
  social-share asset.
- **Brand mark** — `assets/icon-monolite-white.svg` (white M, intended
  for dark/black surfaces) and `assets/icon-monolite-dark.svg` (black M,
  intended for light surfaces). Use the white one in-app — the product is
  dark by default.

For agents inside the platform, the brand uses *generated* icons via
`AgentIconPicker` + `CompanyPatternIcon` (deterministic patterns from a
brand color) instead of curated illustration. We honor that — when in
doubt, generate, don't decorate.

### Substitution flags
- **Reckless Standard ships as TRIAL files.** Production use requires
  a Displaay license. Swap the @font-face URLs when licensed files
  arrive — nothing else needs to change.
- **`docs.monolite.ing/favicon.svg`** is referenced but not in the
  uploads — the in-app rail uses Lucide `Paperclip` as a placeholder.
  We've kept that placeholder; please share the final favicon if it
  exists.

---

## How to use this design system

1. **Tokens first** — `@import "colors_and_type.css"`. All colors and
   type sizes flow from CSS variables; never hard-code a hex.
2. **Default to dark.** The product is dark-first; design new surfaces
   in dark, then validate light.
3. **Squared corners by default.** Reach for a radius only when the
   exceptions list says you may.
4. **Borders, not shadows.** Depth is communicated by 1px borders and
   surface-step (`--mono-surface-2`).
5. **One accent at a time.** Blue means *live*, red means *attention
   needed*, amber means *beta*. If something doesn't fit one of those
   meanings, it stays neutral.
6. **Lucide or nothing.** No new icon families.

---

## SKILL.md

See [`SKILL.md`](./SKILL.md) — that file makes this design system
loadable as an Agent Skill in Claude Code.
