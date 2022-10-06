import { Link } from "react-router-dom";
import tw from "twin.macro";
import ChaosLetter from "./ChaosLetter";

export default function Links() {
  return (
    <div
      css={[
        tw`max-w-full bg-gradient-to-bl bg-yellow-300 rounded-3xl m-3 p-10 font-mono`,
      ]}
    >
      <div css={[tw`grid grid-cols-1 md:grid-cols-2`]}>
        <h1
          css={[tw`text-pink-500 font-bold text-3xl flex`]}
          aria-label="Stylized text that reads links"
        >
          <ChaosLetter>L</ChaosLetter>
          <ChaosLetter>I</ChaosLetter>
          <ChaosLetter>N</ChaosLetter>
          <ChaosLetter>K</ChaosLetter>
          <ChaosLetter>S</ChaosLetter>
        </h1>
        <div css={[tw`text-pink-500 text-2xl`]}>
          <ul css={[tw`list-disc`]}>
            <li>
              <a css={[tw`hover:underline`]} href="https://resume.sjer.red">
                RESUME
              </a>
            </li>
            <li>
              <Link to={"/blog"} css={[tw`hover:underline`]}>
                BLOG
              </Link>
            </li>
            <li>
              <a
                css={[tw`hover:underline`]}
                href="https://github.com/shepherdjerred"
              >
                GITHUB
              </a>
            </li>
            <li>
              <a
                css={[tw`hover:underline`]}
                href="https://www.linkedin.com/in/jerred-shepherd-1999a5153/"
              >
                LINKEDIN :(
              </a>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}
