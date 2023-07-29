import tw from "twin.macro";
import Background from "./Background";
import Container, { Width } from "./Container";

export default function Hero() {
  return (
    <Background extraCss={tw`bg-black min-h-[0vh] md:min-h-[20vh]`}>
      <Container width={Width.WIDE}>
        <div css={[tw`grid grid-cols-1 md:grid-flow-row`]}>
          <div
            css={[
              tw`md:place-self-center m-5 md:m-0 md:ml-10 md:pt-10 md:pb-10`,
            ]}
          >
            <h1
              css={[
                tw`text-black bg-white p-2 font-bold text-4xl inline-block mb-2 md:mb-0`,
              ]}
            >
              I&apos;m Jerred Shepherd
            </h1>
            <br />
            <h2
              css={[
                tw`text-black bg-white p-2 font-bold text-4xl inline-block`,
              ]}
            >
              I&apos;m a <span>software engineer</span> at{" "}
              <a
                href="https://posit.co/"
                css={[tw`underline hover:no-underline`]}
              >
                Posit, PBC
              </a>
            </h2>
          </div>
        </div>
      </Container>
    </Background>
  );
}
