import tw from "twin.macro";

export default function Footer() {
  return (
    <div css={[tw`w-full bg-black text-white p-10 text-center`]}>
      <div css={[tw`mb-1`]}>
        Email me at{" "}
        <a
          css={tw`underline hover:no-underline`}
          href="mailto:contact@sjer.red"
        >
          contact@sjer.red
        </a>
        .
      </div>
      <div>
        Source on{" "}
        <a
          href="https://github.com/shepherdjerred/shepherdjerred.com"
          css={[tw`underline hover:no-underline`]}
        >
          GitHub
        </a>
        . Licensed under the{" "}
        <a
          href="https://www.gnu.org/licenses/gpl-3.0.en.html"
          css={[tw`underline hover:no-underline`]}
        >
          GNU GPL v3.0
        </a>
      </div>
    </div>
  );
}
