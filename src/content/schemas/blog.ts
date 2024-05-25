import { z } from "zod";

export const PostSchema = z.strictObject({
  title: z.string(),
  description: z.string(),
  date: z.date(),
  image: z.string().optional(),
  isDraft: z.boolean().default(false),
  hackerNews: z.string().optional(),
});

export const TilSchema = z
  .strictObject({
    title: z.string().transform((val) => `TIL: ${val}`),
    date: z.date(),
  })
  .transform((val) => ({ ...val, description: val.title, isDraft: false, hackerNews: undefined }));

export const BlogSchema = z.union([TilSchema, PostSchema]);
