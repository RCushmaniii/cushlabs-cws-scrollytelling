# CLAUDE.md — CushLabs CWS Scrollytelling

## Project Overview

Scrollytelling conversion narrative for the CushLabs Context Writing System (CWS). Not a product explainer — a cinematic story that takes readers through recognition, frustration, insight, belief, desire, and action. Built on the cushlabs-scrollytelling template architecture.

## Tech Stack

- Astro 5 (static site generator, islands architecture)
- Svelte 5 (interactive components with runes syntax)
- Tailwind CSS 3 (utility-first styling)
- MDX (content sections)
- TypeScript (strict mode)
- Vercel (static adapter, auto-deploy)

## Project Structure

- `scrollytelling.config.ts` — Master config: colors, fonts, site metadata
- `src/components/sections/` — Svelte sequence components (one per narrative section)
- `src/components/ui/` — Reusable UI components (navbar, footer, progress bar, etc.)
- `src/components/effects/` — Visual effects (grain overlay)
- `src/content/sections/` — MDX files defining section order and importing sequence components
- `src/layouts/` — Root layout with CSS variable injection
- `src/lib/` — Shared modules: scroll, presentation state, i18n, audio
- `src/styles/` — CSS: base reset, reveal animations, reduced-motion overrides

## Sections (Narrative Arc)

| Section | ID | Component | Purpose |
|---------|-----|-----------|---------|
| 0 | hook | HookSequence | Wall of generic AI content — recognition |
| 1 | problem | ProblemSequence | Empty AI box — diagnosis |
| 2 | insight | InsightSequence | voice-dna.json text morphing — turning point |
| 3 | system | SystemRevealSequence | 5-layer progressive build — belief |
| 4 | proof | TransformationSequence | Before/after comparisons — desire |
| 5 | qa | QASequence | Multi-layer QA verification — trust |
| 6 | audience | AudienceSequence | 3 ICP panels — personal recognition |
| 7 | offer | OfferSequence | Voice Discovery 4-step process — clarity |
| 8 | close | CloseSequence | CTA — conversion |

## Development Commands

```powershell
pnpm install   # Install dependencies
pnpm dev       # Start dev server (localhost:4321)
pnpm build     # Build for production
pnpm preview   # Preview production build
```

## Key Patterns

- **Svelte runes:** Components use `$state()`, `$props()`, `$effect()` — Svelte 5 syntax.
- **Sequence components:** Each section has a Svelte component that manages its own animation timeline via `schedule()` helper and IntersectionObserver.
- **English only:** No bilingual support in this project.
- **CSS variables:** All colors/fonts flow from `scrollytelling.config.ts` → layout → components via CSS custom properties.
- **Reveal animations:** `.reveal`, `.reveal-left`, `.reveal-right`, `.reveal-scale` classes with IntersectionObserver.

## Design Direction

- Dark mode dominant (near-black background, warm white text)
- Accent color: Signal red (#E94560) for energy and urgency
- Typography-driven — Inter for everything, JetBrains Mono for code/file references
- Grain overlay for texture
- No fireflies, no parallax, no video backgrounds — let the text and animations carry it

## Conversion Goal

Drive qualified leads into the Voice Discovery survey (CTA: "Start Your Voice Discovery").

## Deploy Target

- Domain: cws.cushlabs.ai
- Platform: Vercel (static)

## Environment Setup

No environment variables required. All configuration lives in `scrollytelling.config.ts`.
