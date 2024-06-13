import { z } from "astro/zod";

export const LeetcodeSchema = z
  .object({
    title: z.string(),
    date: z.coerce.date(),
    leetcode: z.literal(true),
  })
  .transform((val) => ({ ...val, description: val.title, isDraft: false, hackerNews: undefined }));
