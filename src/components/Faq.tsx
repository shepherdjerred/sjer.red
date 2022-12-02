import tw from "twin.macro";
import Container, { Width } from "./Container";

export default function Faq() {
  return (
    <Container width={Width.NARROW}>
      <div css={tw`p-3 mt-8 mb-8 bg-pink-800 text-white`}>
        <h1 css={[tw`text-6xl font-bold pt-0 text-right mr-0 mb-10`]}>FAQ</h1>
        <div css={[tw`pb-6`]}>
          <p>
            <span css={tw`font-bold mr-2`}>Q:</span> Why does this site look so
            terrible?
          </p>
          <p>
            <span css={tw`font-bold mr-2`}>A:</span> It looks exactly the way I
            want it to.
          </p>
        </div>
      </div>
    </Container>
  );
}
