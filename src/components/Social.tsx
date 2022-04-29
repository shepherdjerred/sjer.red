import tw from "twin.macro";

export default function Social() {
  return (
    <div
      css={[
        tw`max-w-full bg-gradient-to-bl bg-yellow-300 rounded-3xl m-3 p-10 font-mono`,
      ]}
    >
      <div css={[tw`grid grid-cols-1 md:grid-cols-2`]}>
        <h1 css={[tw`text-pink-500 font-bold text-3xl flex`]}>
          <span css={[tw`ml-5 mt-1`]}>L</span>
          <span css={[tw`ml-1 mt-5`]}>I</span>
          <span css={[tw`ml-6 mt-2`]}>N</span>
          <span css={[tw`ml-0 mt-6`]}>K</span>
          <span css={[tw`ml-2 mt-4`]}>S</span>
        </h1>
        <div css={[tw`text-pink-500 text-2xl`]}>
          <ul css={[tw`list-disc`]}>
            <li>
              <a
                css={[tw`hover:underline`]}
                href="https://resume.shepherdjerred.com"
              >
                RESUME
              </a>
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
