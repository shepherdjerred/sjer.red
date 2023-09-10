import { defineConfig } from "astro/config";
import mdx from "@astrojs/mdx";
import sitemap from "@astrojs/sitemap";
import tailwind from "@astrojs/tailwind";
import type { AstroIntegration } from "astro";
import fs from "node:fs";
import { Resvg } from "@resvg/resvg-js";
import parseFrontmatter from "gray-matter";
import satori from "satori";

// https://dietcode.io/p/astro-og/
const render = (title: string) => ({
  type: "div",
  props: {
    style: {
      height: "100%",
      width: "100%",
      display: "flex",
      flexDirection: "column",
      backgroundColor: "#000",
      padding: "55px 70px",
      color: "#fff",
      fontFamily: "CommitMono",
      fontSize: 72,
    },
    children: [
      {
        type: "div",
        props: {
          style: { marginTop: 96 },
          children: title,
        },
      },
      {
        type: "div",
        props: {
          style: {
            fontSize: 40,
          },
          children: "by Jerred Shepherd",
        },
      },
    ],
  },
});

// https://github.com/sdnts/dietcode/blob/914e3970f6a0f555113768b12db3229dd822e6f1/astro.config.ts#L55
const og = (): AstroIntegration => ({
  name: "satori-og",
  hooks: {
    "astro:build:done": async ({ dir, pages }) => {
      try {
        const jetBrainsMono = fs.readFileSync("public/fonts/CommitMono/CommitMono-450-Regular.otf");

        for (const { pathname } of pages) {
          if (!pathname.startsWith("blog/") || pathname === "blog/") {
            continue;
          }
          const original = `src/content/${pathname.slice(0, -1)}.mdx`;
          const file = fs.readFileSync(original);

          const data = parseFrontmatter(file).data as unknown;

          if (typeof data !== "object" || data === null || !("title" in data) || typeof data.title !== "string") {
            throw new Error("unable to parse data");
          }

          const svg = await satori(render(data.title), {
            width: 1200,
            height: 630,
            fonts: [
              {
                name: "JetBrains Mono",
                data: jetBrainsMono,
                weight: 400,
                style: "normal",
              },
            ],
          });

          const resvg = new Resvg(svg, {
            fitTo: {
              mode: "width",
              value: 1200,
            },
          });

          fs.writeFileSync(`${dir.pathname}${pathname}openGraph.png`, resvg.render().asPng());
        }

        console.log(`\x1b[32mog:\x1b[0m Generated OpenGraph images\n`);
      } catch (e) {
        console.error(e);
        console.log(`\x1b[31mog:\x1b[0m OpenGraph image generation failed\n`);
      }
    },
  },
});

// https://astro.build/config
export default defineConfig({
  markdown: {
    drafts: true,
    shikiConfig: {
      theme: "github-dark",
      wrap: true,
    },
  },
  site: "https://sjer.red",
  integrations: [mdx(), sitemap(), tailwind(), og()],
});
