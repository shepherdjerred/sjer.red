import tw from "twin.macro";
import Container, { Width } from "./Container";

export default function Faq() {
  return (
    <Container width={Width.NARROW}>
      <div css={tw`p-3 mt-8 mb-8 bg-black text-white`}>
        <h1 css={[tw`text-6xl font-bold pt-0 text-right mr-0 mb-10`]}>FAQ</h1>
        <div css={[tw`pb-6`]}>
          <p>
            <span css={tw`font-bold mr-2`}>Q:</span> What&apos;s your favorite
            xkcd?
          </p>
          <p>
            <span css={tw`font-bold mr-2`}>A:</span>{" "}
            <a
              href="https://xkcd.com/1293/"
              css={tw`underline hover:no-underline text-purple-500`}
            >
              #1293: Job Interview
            </a>
          </p>
        </div>
      </div>
    </Container>
  );
}
