import { Link } from "react-router-dom";
import tw from "twin.macro";
import posts, { Post } from "../posts/posts";
import { Width } from "../components/Container";
import Layout from "../components/Layout";

function BlogListEntry({ post }: { post: Post }) {
  return (
    <div key={post.title} css={tw`bg-yellow-200 p-4 rounded-md mt-6 text-xl`}>
      <Link to={post.slug} css={tw`underline hover:no-underline font-semibold`}>
        {post.title}
      </Link>
      <p css={tw`text-lg`}>{post.created.toDateString()}</p>
    </div>
  );
}

export default function BlogList() {
  const renderedPosts = posts.map((post) => (
    <BlogListEntry key={post.slug} post={post} />
  ));

  return (
    <Layout backgroundCss={tw`bg-purple-400`} width={Width.NARROW}>
      {renderedPosts}
    </Layout>
  );
}
