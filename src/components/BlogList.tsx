import { Link } from "react-router-dom";
import tw from "twin.macro";
import posts from "../posts/posts";
import Footer from "./Footer";
import Header from "./Header";
import pattern from "./pattern.svg";

export default function BlogList() {
  const postLinks = posts.map((post) => {
    return (
      <div key={post.title} css={tw`bg-yellow-50 p-4 rounded-md`}>
        <Link to={post.slug} css={tw`underline`}>
          {post.title}
        </Link>
        <p css={tw`text-xs`}>{post.created.toDateString()}</p>
        <p css={tw`text-sm mt-2`}>{post.short}</p>
      </div>
    );
  });

  return (
    <div>
      <Header />
      <div
        css={[
          tw`bg-purple-200 md:min-h-[100vh] pt-4 pb-4`,
          { backgroundImage: `url(${pattern})` },
        ]}
      >
        <div css={[tw`md:place-self-center p-56 pb-0 pt-0`]}>{postLinks}</div>
      </div>
      <Footer />
    </div>
  );
}
