import { defineCollection, z } from "astro:content";
import { glob } from "astro/loaders";

const sections = defineCollection({
  loader: glob({ pattern: "**/*.mdx", base: "./src/content/sections" }),
  schema: z.object({
    order: z.number(),
    id: z.string(),
    type: z.enum(["hero", "content"]).default("content"),
    number: z.string().optional(),
    backgroundImage: z.string().optional(),
    background: z.string().optional(),
    title: z.record(z.string(), z.string()).optional(),
    subtitle: z.record(z.string(), z.string()).optional(),
  }),
});

export const collections = { sections };
