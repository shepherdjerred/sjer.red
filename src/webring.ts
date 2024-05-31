import { run } from "webring";

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
