import { Link } from "react-router-dom";
import tw from "twin.macro";
import Container, { Width } from "./Container";

export default function Links() {
  return (
    <Container width={Width.WIDE}>
      <div
        css={[
          tw` bg-gradient-to-bl bg-black m-2 md:m-4 p-4 md:p-8 font-mono md:mb-10`,
        ]}
      >
        <div css={[tw`text-white text-2xl flex flex-row`]}>
          <div css={[tw`grow text-center`]}>
            <Link
              to={"/blog"}
              css={[
                tw`underline hover:no-underline hover:bg-white hover:text-black p-4`,
              ]}
            >
              Blog
            </Link>
          </div>
          <div css={[tw`grow text-center`]}>
            <a
              css={[
                tw`underline hover:no-underline hover:bg-white hover:text-black p-4`,
              ]}
              href="https://resume.sjer.red"
            >
              Résumé
            </a>
          </div>
          <div css={[tw`grow text-center`]}>
            <a
              css={[
                tw`underline hover:no-underline hover:bg-white hover:text-black p-4`,
              ]}
              href="https://github.com/shepherdjerred"
            >
              GitHub
            </a>
          </div>
        </div>
      </div>
    </Container>
  );
}
