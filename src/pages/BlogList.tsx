import { Link } from "react-router-dom";
import tw from "twin.macro";
import posts, { type Post } from "../posts/posts";
import { Width } from "../components/Container";
import Layout from "../components/Layout";
import React from "react";


function BlogListEntry({ post }: { post: Post }) {
  const draftText = post.draft ? " (public draft)" : <React.Fragment></React.Fragment>;
  return (
    <div
      key={post.title}
      css={tw`bg-white text-black p-4 rounded-md mt-6 text-xl`}
    >
      <div>
        <Link
          to={post.slug}
          css={tw`underline hover:no-underline font-semibold hover:bg-black hover:text-white p-1 inline`}
        >
          {post.title}
        </Link>
        {draftText}
      </div>
      <p css={tw`text-lg p-1`}>{post.created.toDateString()}</p>
    </div>
  );
}

export default function BlogList() {
  const renderedPosts = posts
    .sort((left, right) => {
      return right.created.getTime() - left.created.getTime();
    })
    .map((post) => <BlogListEntry key={post.slug} post={post} />);

  return (
    <Layout backgroundCss={tw`bg-black`} width={Width.NARROW}>
      {renderedPosts}
    </Layout>
  );
}
