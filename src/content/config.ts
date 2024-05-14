import { defineCollection } from "astro:content";
import { BlogSchema } from "src/schemas/blogSchema";
import { EventSchema } from "src/schemas/eventSchema";

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
