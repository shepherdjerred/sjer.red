import tw from "twin.macro";
import { Width } from "../components/Container";
import Layout from "../components/Layout";
import type { Post } from "../posts/posts";

export interface BlogProps {
  post: Post;
}

export default function Blog(props: BlogProps) {
  document.title = `${props.post.title} | Jerred Shepherd`;
  const draftText = props.post.draft
    ? "This post is a draft and is not complete"
    : "";
  return (
    <Layout width={Width.NARROW} backgroundCss={tw`bg-black`}>
      <hgroup css={tw`bg-white mt-4 p-4`}>
        <h1 css={tw`text-4xl mb-2`}>{props.post.title}</h1>
        {draftText}
        <p>Jerred Shepherd</p>
        <p>{props.post.created.toDateString()}</p>
      </hgroup>
      <div css={tw`mt-4 mb-4 bg-white p-4`}>{props.post.component}</div>
    </Layout>
  );
}
