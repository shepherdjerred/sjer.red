import { z } from "zod";

export const BlogSchema = z.object({
  title: z.string(),
  description: z.string(),
  date: z.date(),
  image: z.string().optional(),
  isDraft: z.boolean().default(false),
});
