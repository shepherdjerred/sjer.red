import { defineCollection } from "astro:content";
import { BlogSchema } from "src/content/schemas/blog";
import { EventSchema } from "src/content/schemas/event";
import { LeetCodeSchema } from "src/content/schemas/leetcode";
import { glob } from "astro/loaders";

const blogCollection = defineCollection({
  loader: glob({ pattern: "**/[^_]*.{md,mdx}", base: "./src/content/blog" }),
  schema: BlogSchema,
});

const eventCollection = defineCollection({
  loader: glob({ pattern: "**/[^_]*.{md,mdx}", base: "./src/content/events" }),
  schema: EventSchema,
});

const leetcodeCollection = defineCollection({
  loader: glob({ pattern: "**/[^_]*.{md,mdx}", base: "./src/content/leetcode" }),
  schema: LeetCodeSchema,
});

export const collections = {
  blog: blogCollection,
  event: eventCollection,
  leetcode: leetcodeCollection,
};
