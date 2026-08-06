// Tailwind 3 + Autoprefixer via native PostCSS. Astro 7 (Vite 8) auto-detects
// this config at the project root. Replaces the deprecated @astrojs/tailwind
// integration, which caps at Astro 5. tailwind.config.mjs is picked up
// automatically by the Tailwind 3 PostCSS plugin.
import tailwindcss from "tailwindcss";
import autoprefixer from "autoprefixer";

export default {
  plugins: [tailwindcss(), autoprefixer()],
};
