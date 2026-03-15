# CushLabs CWS Scrollytelling

![Astro](https://img.shields.io/badge/Astro-5-BC52EE?logo=astro&logoColor=white)
![Svelte](https://img.shields.io/badge/Svelte-5-FF3E00?logo=svelte&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3-06B6D4?logo=tailwindcss&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-blue?logo=typescript&logoColor=white)
![Vercel](https://img.shields.io/badge/Vercel-black?logo=vercel&logoColor=white)

> Cinematic scrollytelling conversion narrative for the CushLabs Context Writing System (CWS).

## Overview

This is not a product explainer or feature list. It's a cinematic story that takes readers through a nine-section emotional arc — from recognizing the problem with generic AI content, through insight and belief, to conversion.

The narrative is built on the [cushlabs-scrollytelling](https://github.com/RCushmaniii/cushlabs-scrollytelling) template architecture, customized for the CWS product story. Each section is a self-contained Svelte 5 component with its own scroll-triggered animation timeline, composed into a single continuous page.

The site deploys to [cws.cushlabs.ai](https://cws.cushlabs.ai) as a static Vercel build. No environment variables, no database, no runtime dependencies.

## The Challenge

AI content tools produce text that sounds like everyone and no one. Businesses adopt them expecting efficiency but get output that erodes their brand voice. The real problem isn't AI — it's that AI has no memory of who you are.

CWS solves this, but explaining a system that captures voice DNA and enforces it across all content requires more than a features page. The pitch needs to *feel* like the problem before it reveals the solution.

## The Solution

**Nine-section narrative arc** — Each section serves a specific emotional function: recognition, frustration, insight, belief, desire, trust, personal recognition, clarity, and conversion. The scroll drives the reader through this sequence deliberately.

**Scroll-triggered animations** — Svelte 5 components use IntersectionObserver and a `schedule()` helper to manage animation timelines per section. Text morphing, progressive reveals, before/after comparisons, and layered system diagrams all trigger on scroll position.

**Typography-driven design** — Dark mode dominant with signal red (#E94560) accents. Inter for body/headings, JetBrains Mono for code references. Grain overlay for texture. No fireflies, no parallax, no video backgrounds — the text and animations carry everything.

## Technical Highlights

- **Astro 5 islands architecture** — Static HTML/CSS for 95% of the page, JavaScript only where interactivity is needed
- **Svelte 5 runes syntax** — Components use `$state()`, `$props()`, `$effect()` for reactive state management
- **Config-driven theming** — All colors, fonts, and site metadata flow from a single `scrollytelling.config.ts` through CSS custom properties
- **CSS reveal system** — `.reveal`, `.reveal-left`, `.reveal-right`, `.reveal-scale` classes with IntersectionObserver, staggered delays, and `prefers-reduced-motion` overrides
- **MDX content sections** — Each narrative section is an MDX file that imports its corresponding Svelte sequence component

## Getting Started

### Prerequisites

- Node.js >= 18
- pnpm >= 8

### Installation

```powershell
git clone https://github.com/RCushmaniii/cushlabs-cws-scrollytelling.git
cd cushlabs-cws-scrollytelling
pnpm install
pnpm dev
```

The dev server starts at `localhost:4321`.

### Environment Variables

No environment variables required. All configuration lives in `scrollytelling.config.ts`.

## Project Structure

```
src/
├── components/
│   ├── sections/              # Svelte sequence components (one per narrative act)
│   │   ├── HookSequence.svelte
│   │   ├── ProblemSequence.svelte
│   │   ├── InsightSequence.svelte
│   │   ├── SystemRevealSequence.svelte
│   │   ├── TransformationSequence.svelte
│   │   ├── QASequence.svelte
│   │   ├── AudienceSequence.svelte
│   │   ├── OfferSequence.svelte
│   │   └── CloseSequence.svelte
│   ├── ui/                    # Reusable UI components
│   └── effects/               # Visual effects (grain overlay)
├── content/
│   └── sections/              # MDX files defining section order
├── layouts/                   # Root layout with CSS variable injection
├── lib/                       # Shared modules: scroll, presentation, audio, i18n
└── styles/                    # Base reset, reveal animations, reduced-motion
```

## Deployment

Push to GitHub with Vercel integration enabled. The site builds as static output with the `@astrojs/vercel` adapter.

```powershell
pnpm build     # Build static output
pnpm preview   # Preview production build locally
```

**Deploy target:** [cws.cushlabs.ai](https://cws.cushlabs.ai)

## Results

| Metric | Value |
|--------|-------|
| Lighthouse Performance | 98+ |
| First Contentful Paint | < 1s |
| Total JS (islands only) | ~25 KB gzipped |
| Narrative sections | 9 |
| Conversion target | Voice Discovery survey |

## Contact

**Robert Cushman**
Business Solution Architect & Full-Stack Developer
Guadalajara, Mexico

info@cushlabs.ai
[GitHub](https://github.com/RCushmaniii) | [LinkedIn](https://linkedin.com/in/robertcushman) | [Portfolio](https://cushlabs.ai)

## License

Proprietary — © 2026 Robert Cushman. All rights reserved. See [LICENSE](LICENSE) for details.

---

*Last Updated: 2026-03-14*
