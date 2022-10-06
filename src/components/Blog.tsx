import tw from "twin.macro";
import Footer from "./Footer";
import Header from "./Header";
import pattern from "./pattern.svg";

export interface BlogProps {
  page: JSX.Element;
}

export default function Blog(props: BlogProps) {
  return (
    <div>
      <Header />
      <div
        css={[
          tw`bg-gray-200 md:min-h-[100vh] pt-4 pb-4`,
          { backgroundImage: `url(${pattern})` },
        ]}
      >
        <div css={[tw`md:place-self-center p-56 pb-0 pt-0`]}>{props.page}</div>
      </div>
      <Footer />
    </div>
  );
}
