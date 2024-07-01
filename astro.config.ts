import { defineConfig } from "astro/config";
import mdx from "@astrojs/mdx";
import sitemap from "@astrojs/sitemap";
import tailwind from "@astrojs/tailwind";
import remarkToc from "remark-toc";
import rehypeAutolinkHeadings from "rehype-autolink-headings";
import { rehypeHeadingIds } from "@astrojs/markdown-remark";
import icon from "astro-icon";
import astroOpenGraphImages, { presets } from "astro-opengraph-images";
import * as fs from "fs";
import { rendererRich, transformerTwoslash } from "@shikijs/twoslash";

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
      transformers: [
        transformerTwoslash({
          renderer: rendererRich(),
        }),
      ],
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
    astroOpenGraphImages({
      options: {
        fonts: [
          {
            data: fs.readFileSync(new URL("./public/fonts/CommitMono/CommitMono-700-Regular.otf", import.meta.url)),
            name: "Commit Mono",
            weight: 400,
            style: "normal",
          },
        ],
      },
      render: presets.blackAndWhite,
    }),
  ],
  security: {
    checkOrigin: true,
  },
  prefetch: true,
});
