import { Link } from "react-router-dom";
import tw from "twin.macro";

export default function Header() {
  return (
    <div css={tw`bg-yellow-400 p-5`}>
      <Link to={"/"} css={tw`m-5`}>
        Home
      </Link>
      <Link to={"/blog"} css={tw`m-5`}>
        Blog
      </Link>
    </div>
  );
}
