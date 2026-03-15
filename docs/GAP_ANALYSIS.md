# Gap Analysis: CWS vs Template

Audit date: 2026-03-15
Template repo: `cushlabs-scrollytelling`

## UI Shell Components

| Component | Template | CWS | Status |
|-----------|----------|-----|--------|
| PresentationOverlay | Yes — Play/Browse entry screen | **Missing** | MUST ADD |
| Navbar | Yes — play/pause, browse CTAs, scroll blur | **Missing** | MUST ADD |
| ScrollNav | Yes — scroll down/back to top, section jumps | **Missing** | MUST ADD |
| ProgressBar | Yes | Yes | OK |
| CWSFooter | N/A (CWS-specific) | Yes | OK |
| Footer (template) | Yes — 4-column bilingual | No (using CWSFooter instead) | OK — CWSFooter is the CWS variant |
| TypeWriter | Yes | Yes | OK |
| Lightbox | Yes — image zoom viewer | **Missing** | ADD LATER (when images exist) |
| ShareButtons | Yes — WhatsApp, LinkedIn, etc. | **Missing** | ADD LATER |
| Carousel | Yes — responsive grid/scroll | **Missing** | ADD LATER (when content needs it) |
| AnimatedCounter | Yes — scroll-triggered | **Missing** | ADD LATER |
| ConsultationForm | Yes — modal form | **Missing** | ADD LATER (CWS may use different CTA) |
| VideoBackground | Yes — section video bgs | **Missing** | NOT NEEDED (CWS design excludes video bgs) |
| ImageBackground | Yes — section image bgs | **Missing** | ADD IF NEEDED |
| ObfuscatedEmail | Yes — email protection | **Missing** | ADD LATER |

## Effects

| Component | Template | CWS | Status |
|-----------|----------|-----|--------|
| GrainOverlay | Yes | Yes | OK |
| Fireflies | Yes | N/A | NOT NEEDED (CWS design explicitly excludes) |
| MatrixBackground | Yes | N/A | NOT NEEDED (CWS-specific, no matrix effect) |
| ParallaxBackground | Yes | N/A | NOT NEEDED (CWS design explicitly excludes) |

## Layout & Page Assembly

| Item | Template | CWS | Status |
|------|----------|-----|--------|
| ScrollytellingLayout slots for overlay, navbar, scroll-nav | Yes | **Missing slots** | MUST FIX |
| index.astro wiring overlay, navbar, scroll-nav | Yes | **Missing wiring** | MUST FIX |
| PageLayout (for non-scrolly pages) | Yes | **Missing** | ADD LATER |

## Shared Libraries

| Module | Template | CWS | Status |
|--------|----------|-----|--------|
| scroll.ts | Yes | Yes | OK |
| presentation.ts | Yes | Yes | OK |
| audio.ts | Yes | Yes (disabled) | OK |
| i18n.ts | Yes | Yes | OK (English-only in CWS) |
| email.ts | Yes | **Missing** | ADD LATER |

## Styles

| File | Template | CWS | Status |
|------|----------|-----|--------|
| base.css | Yes | Yes | REVIEW (may need overlay/presentation classes) |
| reveals.css | Yes | Yes | OK |
| reduced-motion.css | Yes | Yes | OK |

## Priority Order

### Phase 1 — Core Shell (NOW)
1. PresentationOverlay — entry experience
2. Navbar — top navigation with play/pause
3. ScrollNav — scroll indicator/navigator
4. Layout slots — wire everything into layout + index.astro
5. base.css — ensure overlay-active/presentation-active classes work

### Phase 2 — Polish (NEXT)
6. Lightbox
7. ShareButtons
8. AnimatedCounter

### Phase 3 — As Needed
9. ConsultationForm (or CWS-specific CTA modal)
10. Carousel
11. ObfuscatedEmail
12. PageLayout
