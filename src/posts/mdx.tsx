import tw from "twin.macro";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { vscDarkPlus } from "react-syntax-highlighter/dist/esm/styles/prism";
import type { MDXComponents } from "mdx/types";

const components: MDXComponents = {
  ul: (props) => <ul css={tw`list-disc list-inside`}>{props.children}</ul>,
  li: (props) => <li>{props.children}</li>,
  a: (props) => (
    <a css={tw`text-purple-600 underline`} href={props.href}>
      {props.children}
    </a>
  ),
  h1: (props) => (
    <h1
      css={tw`text-2xl bg-purple-400 pt-6 mb-6 p-2 font-bold`}
      {...props}
      id={encodeURI(props.children?.toString() || "")}
    >
      <a
        href={"#" + encodeURI(props.children?.toString() || "")}
        css={tw`text-purple-600 underline`}
      >
        #
      </a>{" "}
      {props.children}
    </h1>
  ),
  h2: (props) => (
    <h2
      css={tw`text-xl mt-5 font-bold`}
      {...props}
      id={encodeURI(props.children?.toString() || "")}
    >
      <a
        href={"#" + encodeURI(props.children?.toString() || "")}
        css={tw`text-purple-600 underline`}
      >
        ##
      </a>{" "}
      {props.children}
    </h2>
  ),
  h3: (props) => (
    <h3
      css={tw`text-lg mt-4 font-bold`}
      {...props}
      id={encodeURI(props.children?.toString() || "")}
    >
      <a
        href={"#" + encodeURI(props.children?.toString() || "")}
        css={tw`text-purple-600 underline`}
      >
        ###
      </a>{" "}
      {props.children}
    </h3>
  ),
  h4: (props) => (
    <h4
      css={tw`text-lg mt-3 font-bold`}
      {...props}
      id={encodeURI(props.children?.toString() || "")}
    >
      <a
        href={"#" + encodeURI(props.children?.toString() || "")}
        css={tw`text-purple-600 underline`}
      >
        ####
      </a>{" "}
      {props.children}
    </h4>
  ),
  h5: (props) => (
    <h5
      css={tw`text-lg mt-2  font-bold`}
      {...props}
      id={encodeURI(props.children?.toString() || "")}
    >
      <a
        href={"#" + encodeURI(props.children?.toString() || "")}
        css={tw`text-purple-600 underline`}
      >
        #####
      </a>{" "}
      {props.children}
    </h5>
  ),
  h6: (props) => (
    <h6
      css={tw`text-lg mt-1 font-bold`}
      {...props}
      id={encodeURI(props.children?.toString() || "")}
    >
      <a
        href={"#" + encodeURI(props.children?.toString() || "")}
        css={tw`text-purple-600 underline`}
      >
        ######
      </a>{" "}
      {props.children}
    </h6>
  ),
  code: (props) => {
    if ((props.children?.toString() || "").includes("\n")) {
      return (
        <SyntaxHighlighter
          language={props.className?.slice(9)}
          style={vscDarkPlus}
          customStyle={tw`rounded-xl`}
        >
          {props.children as string | string[]}
        </SyntaxHighlighter>
      );
    } else {
      return (
        <span
          css={tw`bg-black font-mono text-orange-100 p-1.5 pb-0 pt-0 rounded-md`}
          {...props}
        />
      );
    }
  },
};

export default components;
