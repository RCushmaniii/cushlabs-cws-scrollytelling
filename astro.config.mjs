import { defineConfig } from "astro/config";
import svelte from "@astrojs/svelte";
import mdx from "@astrojs/mdx";
import vercel from "@astrojs/vercel";

// Tailwind 3 is wired via native PostCSS (postcss.config.mjs) rather than the
// deprecated @astrojs/tailwind integration, which does not support Astro 7.
export default defineConfig({
  output: "static",
  adapter: vercel(),
  integrations: [svelte(), mdx()],
});
