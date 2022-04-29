import { Canvas } from "@react-three/fiber";
import tw from "twin.macro";
import pattern from "../pattern.svg";
import Polygon from "./Polygon";

export default function Hero() {
  return (
    <div
      css={[
        tw`bg-purple-900 grid grid-cols-1 md:grid-cols-2 max-h-full p-10 md:p-0 md:h-2/3`,
        { backgroundImage: `url(${pattern})` },
      ]}
    >
      <div css={[tw`md:place-self-center m-2 md:m-0 md:ml-10`]}>
        <h1
          css={[
            tw`text-white bg-black p-2 font-bold text-4xl font-display inline-block`,
          ]}
        >
          Hi. I&apos;m Jerred Shepherd 😄
        </h1>
        <br />
        <h2
          css={[
            tw`text-white bg-black p-2 font-bold text-4xl font-display inline-block`,
          ]}
        >
          I work as a <span>software engineer</span> at{" "}
          <a
            href="https://rstudio.com"
            css={[tw`text-rstudio hover:underline`]}
          >
            RStudio
          </a>
          .
        </h2>
      </div>
      <div css={[tw`inline md:block`]}>
        <Canvas>
          <ambientLight />
          <pointLight position={[10, 10, 10]} />
          <Polygon />
        </Canvas>
      </div>
    </div>
  );
}
