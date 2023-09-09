import { z, defineCollection } from "astro:content";

const blogCollection = defineCollection({
  type: "content",
  schema: z.object({
    title: z.string(),
    description: z.string(),
    date: z.date(),
    image: z.string().optional(),
    isDraft: z.boolean().default(false),
  }),
});

export const collections = {
  blog: blogCollection,
};
