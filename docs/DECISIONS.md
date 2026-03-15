# Design Decisions Log

## 2026-03-15 — Template Relationship

**Decision:** This repo is standalone, not a fork of cushlabs-scrollytelling.
**Why:** CWS has its own narrative, design direction, and content. A fork would create merge noise as the template evolves. Instead, we use the template as a *reference* and bring over components deliberately.
**Tradeoff:** No automatic upstream updates. Improvements to the template must be manually ported if applicable.

## 2026-03-15 — Excluded Template Features

The following template features are intentionally excluded from CWS per design direction:
- **Fireflies** — "No fireflies, no parallax, no video backgrounds"
- **Parallax backgrounds** — Same as above
- **Video backgrounds** — Same as above
- **Bilingual content** — English only in this project
- **MatrixBackground** — Atlas-specific effect, not relevant to CWS

## 2026-03-15 — Audio Strategy

Audio system code is in place (`src/lib/audio.ts`) but disabled in config. 11 Labs narration will be produced from a script the user is writing. Audio will be enabled once assets are ready.

## 2026-03-15 — CTA Target

Conversion goal: "Start Your Voice Discovery" → Voice Discovery survey intake. Not a consultation form — the CWS CTA is different from the template's "Book a Call."
