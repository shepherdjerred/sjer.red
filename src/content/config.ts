import { defineCollection } from "astro:content";
import { BlogSchema } from "src/content/schemas/blog";
import { EventSchema } from "src/content/schemas/event";
import { LeetcodeSchema } from "./schemas/leetcode";

const blogCollection = defineCollection({
  type: "content",
  schema: BlogSchema,
});

const eventCollection = defineCollection({
  type: "content",
  schema: EventSchema,
});

const leetcodeCollection = defineCollection({
  type: "content",
  schema: LeetcodeSchema,
});

export const collections = {
  blog: blogCollection,
  event: eventCollection,
  leetcode: leetcodeCollection,
};
