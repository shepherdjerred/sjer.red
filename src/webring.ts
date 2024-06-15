import { run } from "webring";
import { type Configuration } from "webring";

export const config: Configuration = {
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
    {
      url: "https://brr.fyi/feed.xml",
      title: "brr.fyi",
    },
    {
      url: "https://devblogs.microsoft.com/oldnewthing/feed",
      title: "The Old New Thing",
    },
  ],
  number: 3,
  cache_duration_minutes: 60,
  truncate: 300,
  cache_file: "webring.json",
};

export const result = await run(config);
