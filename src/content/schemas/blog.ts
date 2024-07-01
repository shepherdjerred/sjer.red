import { z } from "zod";
import { LeetcodeSchema } from "./leetcode";

export const PostSchema = z.object({
  title: z.string(),
  description: z.string(),
  date: z.coerce.date(),
  image: z.string().optional(),
  isDraft: z.boolean().default(false),
  hackerNews: z.string().optional(),
  starred: z.boolean().default(false),
});

export const TilSchema = z
  .object({
    title: z.string().transform((val) => `TIL: ${val}`),
    description: z.string().optional(),
    date: z.coerce.date(),
    starred: z.boolean().default(false),
    hackerNews: z.string().optional(),
  })
  .transform((val) => ({ ...val, description: val.description || val.title, isDraft: false }));

export const BlogSchema = z.union([PostSchema, LeetcodeSchema, TilSchema]);
