import { defineCollection } from "astro:content";
import { BlogSchema } from "src/schemas/blogSchema";

const blogCollection = defineCollection({
  type: "content",
  schema: BlogSchema,
});

export const collections = {
  blog: blogCollection,
};
