import { NavLink } from "react-router-dom";
import tw from "twin.macro";

export default function Header() {
  return (
    <div css={tw`font-bold underline p-5 flex-col flex text-2xl`}>
      <NavLink to={"/"} css={tw`m-5`}>
        Home
      </NavLink>
      <NavLink to={"/blog"} css={tw`m-5`}>
        Blog
      </NavLink>
    </div>
  );
}
