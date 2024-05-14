import { defineCollection } from "astro:content";
import { BlogSchema } from "src/content/schemas/blog";
import { EventSchema } from "src/content/schemas/event";

const blogCollection = defineCollection({
  type: "content",
  schema: BlogSchema,
});

const eventCollection = defineCollection({
  type: "content",
  schema: EventSchema,
});

export const collections = {
  blog: blogCollection,
  event: eventCollection,
};
