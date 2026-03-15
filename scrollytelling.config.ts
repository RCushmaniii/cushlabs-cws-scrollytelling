/**
 * Master configuration for the CWS (Context Writing System) scrollytelling.
 * Edit this file to customize colors, fonts, languages, and site metadata.
 * Tailwind, Astro layout, and Svelte components all read from here.
 */

export const config = {
  site: {
    title: "CushLabs — Context Writing System",
    description:
      "AI without memory produces content without soul. The Context Writing System is the missing layer — custom voice infrastructure that makes AI sound like you, not like AI.",
    url: "https://cws.cushlabs.ai",
  },

  colors: {
    primary: "#1A1A2E",       // Deep midnight blue
    secondary: "#16213E",     // Dark navy
    accent: "#E94560",        // Signal red — energy, urgency
    background: "#0A0A0A",    // Near-black
    surface: "#111122",       // Slightly lifted dark
    text: "#F0EDE6",          // Warm white
    textMuted: "#8888A0",     // Muted cool gray
  },

  fonts: {
    heading: "'Inter', system-ui, sans-serif",
    body: "'Inter', system-ui, sans-serif",
    mono: "'JetBrains Mono', monospace",
    googleFontsUrl:
      "https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&family=JetBrains+Mono:wght@400;500;700&display=swap",
  },

  languages: [
    { code: "en", label: "English", default: true },
  ],

  audio: {
    enabled: false,
    ambientVolume: 0.3,
    narrationVolume: 0.8,
    crossfadeDuration: 1000,
  },

  effects: {
    fireflies: false,
    grain: true,
    parallax: false,
  },

  scrollReveal: {
    threshold: 0.15,
    rootMargin: "0px 0px -50px 0px",
  },
} as const;

export type ScrollytellingConfig = typeof config;
