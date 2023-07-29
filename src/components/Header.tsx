import { useState } from "react";
import { NavLink } from "react-router-dom";
import tw from "twin.macro";
import React from "react";
import { Bars3Icon } from "@heroicons/react/20/solid";

export default function Header() {
  const [toggle, setToggle] = useState(false);

  const links = (
    <div css={tw`flex-col flex bg-white`}>
      <NavLink to={"/"} css={tw`m-5 p-1 hover:text-white hover:bg-black`}>
        Home
      </NavLink>
      <NavLink to={"/blog"} css={tw`m-5 p-1 hover:text-white hover:bg-black`}>
        Blog
      </NavLink>
      <button
        css={tw`text-2xl hover:text-white font-bold m-5 p-1 md:hidden`}
        onClick={() => setToggle(!toggle)}
      >
        Close
      </button>
    </div>
  );
  let content = links;

  if (!toggle) {
    content = (
      <React.Fragment>
        <div css={tw`w-6 p-0.5 md:hidden`}>
          <Bars3Icon onClick={() => setToggle(!toggle)} />
        </div>
        <div css={tw`hidden md:block`}>{links}</div>
      </React.Fragment>
    );
  } else {
    content = links;
  }

  return (
    <div
      css={tw`bg-black md:bg-transparent text-white rounded-lg m-1 font-bold underline p-1 md:p-5 text-2xl   md:text-black `}
    >
      {content}
    </div>
  );
}
