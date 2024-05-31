import { z } from "zod";
import R from "remeda";
import Parser from "rss-parser";
import fs from "fs/promises";
import truncate from "truncate-html";

export type Source = z.infer<typeof SourceSchema>;
const SourceSchema = z.object({
  url: z.string(),
  title: z.string(),
});

export type Configuration = z.infer<typeof ConfigurationSchema>;
const ConfigurationSchema = z.object({
  sources: SourceSchema.array(),
  number: z.number(),
  cache_duration_minutes: z.number(),
  truncate: z.number(),
});

export type ResultEntry = z.infer<typeof ResultEntrySchema>;
const ResultEntrySchema = z.object({
  title: z.string(),
  url: z.string(),
  date: z.coerce.date(),
  source: SourceSchema,
  preview: z.string().optional(),
});

export type Result = z.infer<typeof ResultSchema>;
const ResultSchema = z.array(ResultEntrySchema);

export type CacheEntry = z.infer<typeof CacheEntrySchema>;
export const CacheEntrySchema = z.object({
  timestamp: z.coerce.date(),
  data: ResultEntrySchema,
});

export type Cache = z.infer<typeof CacheSchema>;
export const CacheSchema = z.record(CacheEntrySchema);

const FeedEntrySchema = z
  .object({
    title: z.string(),
    link: z.string(),
    isoDate: z.coerce.date().optional(),
    pubDate: z.coerce.date().optional(),
    content: z.string().optional(),
    contentSnippet: z.string().optional(),
    "content:encoded": z.string().optional(),
    description: z.string().optional(),
  })
  .transform((entry) => {
    const date = entry.isoDate ?? entry.pubDate;
    if (!date) {
      throw new Error("no date found in feed entry");
    }
    return {
      title: entry.title,
      link: entry.link,
      date,
      content: entry.content,
      contentSnippet: entry.contentSnippet,
      description: entry.description,
      "content:encoded": entry["content:encoded"],
    };
  });

export const config = {
  sources: [
    {
      url: "https://drewdevault.com/blog/index.xml",
      title: "Drew DeVault",
    },
    {
      url: "https://danluu.com/atom.xml",
      title: "Dan Luu",
    },
    {
      url: "https://jakelazaroff.com/rss.xml",
      title: "Jake Lazaroff",
    },
    {
      url: "https://awesomekling.github.io/feed.xml",
      title: "Andreas Kling",
    },
    {
      url: "https://xeiaso.net/blog.rss",
      title: "Xe Iaso",
    },
    {
      url: "https://ciechanow.ski/atom.xml",
      title: "Bartosz Ciechanowski",
    },
    {
      url: "https://explained-from-first-principles.com/feed.xml",
      title: "Explained From First Principles",
    },
    // {
    //   url: "http://www.aaronsw.com/2002/feeds/pgessays.rss",
    //   title: "Paul Graham",
    // },
    {
      url: "https://samwho.dev/rss.xml",
      title: "Sam Rose",
    },
    // {
    //   url: "https://rachelbythebay.com/w/atom.xml",
    //   title: "Rachel Kroll",
    // },
  ],
  number: 3,
  cache_duration_minutes: 60,
  truncate: 300,
};

export const result = await run(config);

export async function run(config: Configuration): Promise<Result> {
  const cacheFilename = "cache.json";
  const currentDir = process.cwd();
  const fullFilename = `${currentDir}/${cacheFilename}`;

  let cacheObject: Cache = {};

  try {
    const cacheFile = await fs.readFile(fullFilename);
    cacheObject = CacheSchema.parse(JSON.parse(cacheFile.toString()));
  } catch (e) {
    console.error("Error reading cache file:", e);
    throw e;
  }

  const [result, updatedCache] = await runWithCache(config, cacheObject);

  // write the updated cache to cache.json
  await fs.writeFile(fullFilename, JSON.stringify(updatedCache));

  return result;
}

export async function runWithCache(config: Configuration, cache: Cache): Promise<[Result, Cache]> {
  const promises = R.pipe(
    config.sources,
    R.map((source) => fetchWithCache(source, cache, config)),
    R.filter((result) => result !== undefined),
  );
  const results = await Promise.all(promises);

  const definedResults = results.filter((result) => result !== undefined) as ResultEntry[];

  const updatedCache: Cache = R.pipe(
    definedResults,
    R.map((result): [string, CacheEntry] => [result.source.url, { timestamp: new Date(), data: result }]),
    R.fromEntries(),
  );

  const topResults = R.pipe(
    definedResults,
    R.sortBy((result) => result.date.getTime()),
    R.reverse(),
    R.take(config.number),
  );

  return [topResults, updatedCache];
}

export async function fetchWithCache(
  source: Source,
  cache: Cache,
  config: Configuration,
): Promise<ResultEntry | undefined> {
  const cacheEntry = cache[source.url];
  if (cacheEntry) {
    const now = new Date();
    if (now.getTime() - cacheEntry.timestamp.getTime() < config.cache_duration_minutes * 60 * 1000) {
      console.log(`Cache entry found for ${source.url}`);
      return Promise.resolve(cacheEntry.data);
    } else {
      console.log(`Cache entry for ${source.url} is too old`);
    }
  }

  console.log(`No cache entry for ${source.url}`);
  return fetch(source, config.truncate);
}

export async function fetch(source: Source, length: number): Promise<ResultEntry | undefined> {
  const parser = new Parser();
  try {
    const feed = await parser.parseURL(source.url);

    const firstItem = R.pipe(
      feed.items,
      R.map((item) => FeedEntrySchema.parse(item)),
      R.sortBy((item) => new Date(item.date).getTime()),
      R.reverse(),
      R.first(),
    );

    if (!firstItem) {
      throw new Error("no items found in feed");
    }

    return {
      title: firstItem.title,
      url: firstItem.link,
      date: new Date(firstItem.date),
      source,
      preview: truncate(
        firstItem.contentSnippet ?? firstItem.content ?? firstItem.description ?? firstItem["content:encoded"],
        length,
      ),
    };
  } catch (e) {
    console.error(`Error fetching ${source.url}: ${e as string}`);
    return undefined;
  }
}
