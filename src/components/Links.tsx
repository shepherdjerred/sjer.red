import { Link } from "react-router-dom";
import tw from "twin.macro";
import ChaosText from "./ChaosText";
import Container, { Width } from "./Container";

export default function Links() {
  return (
    <Container width={Width.WIDE}>
      <div
        css={[
          tw` bg-gradient-to-bl bg-yellow-300 rounded-2xl m-2 md:m-4 p-8 font-mono md:mb-10`,
        ]}
      >
        <div css={[tw`grid grid-cols-1 md:grid-cols-2`]}>
          <h1
            css={[tw`text-pink-500 font-bold text-3xl flex`]}
            aria-label="Stylized text that reads links"
          >
            <ChaosText text="LINKS" />
          </h1>
          <div css={[tw`text-pink-500 text-2xl`]}>
            <ul css={[tw`list-disc`]}>
              <li>
                <Link to={"/blog"} css={[tw`hover:underline`]}>
                  Blog
                </Link>
              </li>
              <li>
                <a css={[tw`hover:underline`]} href="https://resume.sjer.red">
                  Resume
                </a>
              </li>
              <li>
                <a
                  css={[tw`hover:underline`]}
                  href="https://github.com/shepherdjerred"
                >
                  GitHub
                </a>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </Container>
  );
}
