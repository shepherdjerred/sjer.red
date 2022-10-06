import tw from "twin.macro";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { vscDarkPlus } from "react-syntax-highlighter/dist/esm/styles/prism";

const components = {
  ul: (props: any) => <ul css={tw`list-disc list-inside`}>{props.children}</ul>,
  li: (props: any) => <li>{props.children}</li>,
  a: (props: any) => (
    <a css={tw`text-purple-600 underline`} href={props.href}>
      {props.children}
    </a>
  ),
  h1: (props: any) => (
    <h1
      css={tw`text-2xl bg-purple-400 pt-6 mb-6 p-2 font-bold`}
      {...props}
      id={encodeURI(props.children)}
    >
      <a
        href={"#" + encodeURI(props.children)}
        css={tw`text-purple-600 underline`}
      >
        #
      </a>{" "}
      {props.children}
    </h1>
  ),
  h2: (props: any) => (
    <h2
      css={tw`text-xl mt-5  font-bold`}
      {...props}
      id={encodeURI(props.children)}
    >
      <a
        href={"#" + encodeURI(props.children)}
        css={tw`text-purple-600 underline`}
      >
        ##
      </a>{" "}
      {props.children}
    </h2>
  ),
  h3: (props: any) => (
    <h3
      css={tw`text-lg mt-4  font-bold`}
      {...props}
      id={encodeURI(props.children)}
    >
      <a
        href={"#" + encodeURI(props.children)}
        css={tw`text-purple-600 underline`}
      >
        ###
      </a>{" "}
      {props.children}
    </h3>
  ),
  h4: (props: any) => (
    <h4
      css={tw`text-lg mt-3  font-bold`}
      {...props}
      id={encodeURI(props.children)}
    >
      <a
        href={"#" + encodeURI(props.children)}
        css={tw`text-purple-600 underline`}
      >
        ####
      </a>{" "}
      {props.children}
    </h4>
  ),
  h5: (props: any) => (
    <h5
      css={tw`text-lg mt-2  font-bold`}
      {...props}
      id={encodeURI(props.children)}
    >
      <a
        href={"#" + encodeURI(props.children)}
        css={tw`text-purple-600 underline`}
      >
        #####
      </a>{" "}
      {props.children}
    </h5>
  ),
  h6: (props: any) => (
    <h6
      css={tw`text-lg mt-1 font-bold`}
      {...props}
      id={encodeURI(props.children)}
    >
      <a
        href={"#" + encodeURI(props.children)}
        css={tw`text-purple-600 underline`}
      >
        ######
      </a>{" "}
      {props.children}
    </h6>
  ),
  code: (props: any) => {
    if (props.children.includes("\n")) {
      return (
        <SyntaxHighlighter
          language={props.className.slice(9)}
          {...props}
          style={vscDarkPlus}
        />
      );
    } else {
      return (
        <span
          css={tw`bg-black font-mono text-orange-100 p-1 rounded-md`}
          {...props}
        />
      );
    }
  },
};

export default components;
