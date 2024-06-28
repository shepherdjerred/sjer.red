import type { APIContext } from "astro";
import { handleRoute } from "astro-opengraph-images";
import { getCollection } from "astro:content";
import * as fs from "fs";
import { renderMain } from "src/og";

export async function getStaticPaths() {
  const blogEntries = await getCollection("blog");
  return blogEntries.map((entry) => ({
    params: { slug: entry.slug },
    props: { entry },
  }));
}

export async function GET(context: APIContext) {
  const path = new URL("../../public/fonts/CommitMono/CommitMono-450-Regular.otf", import.meta.url);
  const commitMono = fs.readFileSync(path);

  return new Response(
    await handleRoute({
      context,
      options: {
        width: 1200,
        height: 630,
        fonts: [
          {
            data: commitMono,
            name: "Commit Mono",
            weight: 400,
            style: "normal",
          },
        ],
      },
      render: renderMain,
    }),
  );
}
