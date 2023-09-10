import rss from "@astrojs/rss";
import { getCollection } from "astro:content";
import sanitizeHtml from "sanitize-html";
import MarkdownIt from "markdown-it";
const parser = new MarkdownIt();

export async function GET(context) {
  const blog = await getCollection("blog");

  return rss({
    title: "Jerred's Blog",
    description: "My personal blog",
    site: context.site,
    items: blog
      .sort((left, right) => right.data.date.getTime() - left.data.date.getTime())
      .map((post) => ({
        title: post.data.title,
        pubDate: post.data.date,
        description: post.data.description,
        link: `/blog/${post.slug}/`,
        content: sanitizeHtml(parser.render(post.body)),
      })),
    stylesheet: "/rss/styles.xsl",
  });
}
