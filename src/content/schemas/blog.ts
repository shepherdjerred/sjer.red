import { z } from "zod";

export const PostSchema = z.object({
  title: z.string(),
  description: z.string(),
  date: z.coerce.date(),
  image: z.string().optional(),
  isDraft: z.boolean().default(false),
  hackerNews: z.string().optional(),
});

export const TilSchema = z
  .object({
    title: z.string().transform((val) => `TIL: ${val}`),
    date: z.coerce.date(),
  })
  .transform((val) => ({ ...val, description: val.title, isDraft: false, hackerNews: undefined }));

export const BlogSchema = z.union([PostSchema, TilSchema]);
