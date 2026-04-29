---
name: monolite-design
description: Use this skill to generate well-branded interfaces and assets for Monolite, either for production or throwaway prototypes/mocks/etc. Contains essential design guidelines, colors, type, fonts, assets, and UI kit components for prototyping.
user-invocable: true
---

Read the README.md file within this skill, and explore the other available files.
If creating visual artifacts (slides, mocks, throwaway prototypes, etc), copy assets out and create static HTML files for the user to view. If working on production code, you can copy assets and read the rules here to become an expert in designing with this brand.
If the user invokes this skill without any other guidance, ask them what they want to build or design, ask some questions, and act as an expert designer who outputs HTML artifacts _or_ production code, depending on the need.

Key non-negotiables:
- The product is **dark by default**, **square-cornered** (`--radius: 0`), **borders not shadows**, **system fonts** (Inter Tight as substitute), **Lucide icons only**, **no emoji**, **no gradients in product UI**.
- Marketing / decks may use the "Dune" palette (sand, spice, stone, obsidian, paper) — never the product itself.
- One accent at a time: blue = live, red = attention, amber = beta. Everything else is greyscale.
- The "monolite curve" easing is `cubic-bezier(0.16, 1, 0.3, 1)`.

Files of interest:
- `colors_and_type.css` — design tokens (drop into any HTML)
- `assets/` — logos and brand marks (white M for dark surfaces, dark M for light)
- `ui_kits/platform/` — pixel-faithful product recreation with reusable JSX components
- `preview/` — small HTML cards demonstrating each token cluster
