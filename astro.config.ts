import { defineConfig } from "astro/config";
import mdx from "@astrojs/mdx";
import sitemap from "@astrojs/sitemap";
import tailwind from "@astrojs/tailwind";
import remarkToc from "remark-toc";
import rehypeAutolinkHeadings from "rehype-autolink-headings";
import { rehypeHeadingIds } from "@astrojs/markdown-remark";
import icon from "astro-icon";
import satoriOpenGraph from "astro-opengraph-images";
import { renderMainMain } from "./src/og.tsx";
import * as fs from "fs";

const path = new URL("./public/fonts/CommitMono/CommitMono-700-Regular.otf", import.meta.url);
const font = fs.readFileSync(path);

// https://astro.build/config
export default defineConfig({
  markdown: {
    shikiConfig: {
      theme: "github-dark",
      themes: {
        light: "github-light",
        dark: "github-dark",
      },
      wrap: true,
    },
    rehypePlugins: [
      rehypeHeadingIds,
      [
        rehypeAutolinkHeadings,
        {
          behavior: "append",
        },
      ],
    ],
    remarkPlugins: [remarkToc],
  },
  site: "https://sjer.red",
  integrations: [
    mdx(),
    sitemap(),
    tailwind(),
    icon(),
    satoriOpenGraph({
      options: {
        width: 1200,
        height: 630,
        fonts: [
          {
            data: font,
            name: "Commit Mono",
            weight: 400,
            style: "normal",
          },
        ],
      },
      render: renderMainMain,
    }),
  ],
  security: {
    checkOrigin: true,
  },
  prefetch: true,
});
