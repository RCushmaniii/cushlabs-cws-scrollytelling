---
# =============================================================================
# PORTFOLIO.MD — CushLabs CWS Scrollytelling
# =============================================================================
portfolio_enabled: false
portfolio_priority: 8
portfolio_featured: true
portfolio_last_reviewed: "2026-03-14"

title: "CWS Scrollytelling — Conversion Narrative"
tagline: "Cinematic scroll-driven story that sells the Context Writing System through emotion, not features"
slug: "cws-scrollytelling"

category: "AI Automation"
target_audience: "Business owners and marketing leaders frustrated with generic AI content"
tags:
  - "scrollytelling"
  - "conversion"
  - "astro"
  - "svelte"
  - "content-strategy"
  - "ai-writing"
  - "narrative-design"

thumbnail: ""
hero_images: []
demo_video_url: ""

live_url: "https://cws.cushlabs.ai"
demo_url: "https://cws.cushlabs.ai"
case_study_url: ""

problem_solved: |
  AI content tools produce generic output that erodes brand voice. Explaining why CWS
  is different requires more than a features page — prospects need to feel the problem
  before they believe in the solution. This scrollytelling narrative takes readers through
  a nine-section emotional arc that builds recognition, trust, and desire before the CTA.

key_outcomes:
  - "Nine-section cinematic narrative arc from recognition to conversion"
  - "98+ Lighthouse performance with ~25 KB total JS via Astro islands"
  - "Scroll-triggered animations in Svelte 5 with full reduced-motion support"
  - "Single config file controls all theming, fonts, and site metadata"
  - "Static deploy to Vercel — no runtime, no database, no env vars"

tech_stack:
  - "Astro 5"
  - "Svelte 5"
  - "Tailwind CSS 3"
  - "TypeScript"
  - "MDX"
  - "Vercel"
  - "IntersectionObserver"

complexity: "Production"
---

## Overview

CWS Scrollytelling is a conversion-focused narrative experience for the CushLabs Context Writing System. Rather than listing features or showing pricing tables, it takes readers through a deliberate emotional journey: recognition of the generic AI content problem, frustration with the status quo, insight into why AI lacks voice, belief in a systematic solution, and finally desire and action.

Built on the cushlabs-scrollytelling template architecture, the site uses Astro 5 islands to keep JavaScript minimal while Svelte 5 components handle scroll-triggered animations within each narrative section. The entire design is typography-driven — dark mode, signal red accents, grain texture — with no decorative effects competing for attention.

The conversion goal is a single CTA: "Start Your Voice Discovery," driving qualified leads into the CWS intake survey.

## The Challenge

- **Generic AI content is the norm:** Businesses adopt AI writing tools and get output that sounds like every other business. The problem isn't obvious until you see your own content next to a competitor's and can't tell them apart.
- **Feature pages don't sell transformations:** CWS is a system, not a tool. Listing its five layers on a bullet-point page doesn't communicate why it matters. Prospects need to understand the problem viscerally before the solution lands.
- **Conversion requires emotional progression:** Jumping from "here's our product" to "buy now" skips the trust-building that complex B2B services require. The pitch needs to earn the right to ask for action.

## The Solution

**Narrative arc design:** Nine sections map to specific emotional functions — hook (wall of generic content), problem (empty AI box), insight (voice DNA morphing), system reveal (5-layer progressive build), proof (before/after comparisons), QA (verification layers), audience (ICP recognition panels), offer (Voice Discovery process), and close (CTA).

**Scroll-driven animation:** Each section is a self-contained Svelte 5 component that manages its own animation timeline via IntersectionObserver and a `schedule()` helper. Animations trigger precisely as the reader scrolls into each act, creating a cinematic pacing without autoplay or video.

**Performance-first architecture:** Astro 5 renders 95% of the page as static HTML/CSS. Only interactive elements ship JavaScript, keeping total JS under 25 KB gzipped. The site loads in under a second and scores 98+ on Lighthouse.

## Technical Highlights

- **Astro islands architecture** for near-zero JS overhead on a content-heavy page
- **Svelte 5 runes** (`$state`, `$props`, `$effect`) for clean reactive component logic
- **Config-driven theming** via `scrollytelling.config.ts` — one file controls all colors, fonts, and metadata through CSS custom properties
- **CSS reveal system** with four animation variants, staggered delays, and `prefers-reduced-motion` overrides
- **MDX content pipeline** — each narrative section is an MDX file importing its Svelte sequence component

## Results

**For the Business:**

- Complete conversion narrative deployed at cws.cushlabs.ai
- Nine-section emotional arc designed to qualify leads before the CTA
- Single conversion target: Voice Discovery survey intake

**Technical Demonstration:**

- Production Astro 5 + Svelte 5 implementation with scroll-driven animation
- Config-driven architecture that separates content from presentation
- Accessibility-first approach with reduced-motion support throughout
