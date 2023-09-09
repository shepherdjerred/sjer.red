import { defineConfig } from "astro/config";
import mdx from "@astrojs/mdx";
import sitemap from "@astrojs/sitemap";
import tailwind from "@astrojs/tailwind";

// https://astro.build/config
export default defineConfig({
  markdown: {
    drafts: true,
    shikiConfig: {
      theme: "github-light",
      wrap: true,
    },
  },
  site: "https://sjer.red",
  integrations: [mdx(), sitemap(), tailwind()],
});
