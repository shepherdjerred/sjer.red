import * as jsdom from "jsdom";
import { readFile, writeFile } from "fs/promises";
import { z } from "zod";

export const links = [
  "https://vitalik.eth.limo/general/2024/01/31/end.html",
  "https://qsantos.fr/2024/01/04/dynamic-programming-is-not-black-magic/",
  "https://www.experimental-history.com/p/so-you-wanna-de-bog-yourself",
  "https://sashachapin.substack.com/p/some-painful-questions-we-ask-ourselves",
  "https://www.gregegan.net/FOUNDATIONS/",
  "https://danluu.com/culture/",
  "https://protohackers.com/",
  "https://danluu.com/startup-tradeoffs/",
  "https://research.swtch.com/testing",
  "https://bbycroft.net/llm",
  "https://course.fast.ai/",
  "https://skip.house/blog/nix-in-practice/",
  "https://www.feynmanlectures.caltech.edu/",
  "https://ocw.mit.edu/courses/18-s097-applied-category-theory-january-iap-2019/",
  "https://d3s.mff.cuni.cz/teaching/nprg077/",
  "https://martin.kleppmann.com/2011/03/07/accounting-for-computer-scientists.html",
  "https://www.encona.com/posts/debits-and-credits",
  "https://www.recurse.com/",
  "https://www.inkandswitch.com/local-first/",
  "https://math.ucr.edu/home/baez/act_course/",
  "http://indiehackers.com",
  "https://practicaltypography.com/",
  "https://www.joshwcomeau.com/react/server-components/",
  "https://exist.io/",
  "https://www.susanrigetti.com/physics",
  "https://www.testingjavascript.com/",
  "https://xata.io/blog/postgres-full-text-search-engine",
  "https://weaknuclearforce.wordpress.com/",
  "https://notes.eatonphil.com/2023-05-25-raft.html",
  "https://drewdevault.com/2023/05/01/2023-05-01-Burnout.html",
  "https://www.3blue1brown.com/",
  "https://ciechanow.ski/bicycle/",
  "https://www.cs.cornell.edu/courses/cs6120/2020fa/self-guided/",
  "https://fly.io/dist-sys/",
  "https://explained-from-first-principles.com/email/",
  "https://tynan.com/letstalk/",
  "https://stevens.netmeister.org/631/",
  "https://www.experimental-history.com/p/the-five-tools-of-hedonic-design",
  "https://diataxis.fr/",
  "https://sashachapin.substack.com/p/making-normal-conversations-better",
  "https://www.experimental-history.com/p/good-conversations-have-lots-of-doorknobs",
  "https://danluu.com/wat/",
  "https://gmays.com/how-im-relearning-math-as-an-adult/",
  "https://www.homeautomationguy.io/",
  "https://awesomekling.github.io/Excellence-is-a-habit-but-so-is-failure/",
  "https://diary.geekodour.org/",
  "https://www.morling.dev/blog/the-code-review-pyramid/",
  "https://hyperboleandahalf.blogspot.com/2013/05/depression-part-two.html",
  "https://ludic.mataroa.blog/blog/your-organization-probably-doesnt-want-to-improve-things/",
  "https://milan.cvitkovic.net/writing/things_youre_allowed_to_do/",
  "https://parhelia.conorbarnes.com/p/the-placeholder-girlfriend",
  "https://usefulfictions.substack.com/p/how-to-be-more-agentic",
  "https://sashachapin.substack.com/p/things-you-learn-dating-cate-hall",
  "https://www.epicweb.dev/fully-typed-web-apps",
  "https://vinnie.dev/using-zod-at-the-edge-of-our-typescript-type-system/",
  "https://furia.com",
  "https://fly.io/blog/",
  "https://tonsky.me",
  "https://explained-from-first-principles.com",
  "http://wiki.c2.com",
  "https://samwho.dev",
  "https://paulgraham.com/articles.html",
  "https://www.ben-evans.com",
  "https://awesomekling.github.io",
  "https://drewdevault.com",
  "https://xeiaso.net/blog/",
  "https://www.joshwcomeau.com",
  "https://sive.rs",
  "https://jakelazaroff.com",
  "https://danluu.com/p95-skill/",
  "https://theluddite.org/",
  "https://aphyr.com/",
];

const file = "src/links/cache.json";

// create cache.json if it doesn't exist
try {
  await readFile(file, "utf-8");
} catch (e) {
  await writeFile(file, "{}");
}

export const ItemSchema = z.object({
  title: z.string(),
  description: z.string().optional(),
});

export const CacheSchema = z.record(z.string().url(), ItemSchema);

// check if "cache.json" has a title for the link
const cache = CacheSchema.parse(JSON.parse(await readFile(file, "utf-8")));

const results = await Promise.all(
  links.map(async (link) => {
    if (cache[link]) {
      return cache[link];
    } else {
      console.log(`Fetching ${link}`);
      try {
        const response = await fetch(link, { redirect: "follow" });
        const text = await response.text();
        jsdom.JSDOM.fragment(text);
        const htmlDoc = new jsdom.JSDOM(text).window.document;
        const base: z.infer<typeof ItemSchema> = {
          title: htmlDoc.title,
        };
        const description = htmlDoc.querySelector("meta[name=description]")?.getAttribute("content");
        if (description) {
          base.description = description;
        }
        return base;
      } catch (e) {
        console.error(`Failed to fetch ${link}`);
        return {
          title: "Failed to fetch",
        };
      }
    }
  }),
);

export const newCache = CacheSchema.parse(
  Object.assign(cache, Object.fromEntries(links.map((link, i) => [link, results[i]]))),
);

// write the new cache to "cache.json"
await writeFile(file, JSON.stringify(newCache, null, 2));
