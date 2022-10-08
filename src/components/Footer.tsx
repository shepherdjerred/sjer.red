import tw from "twin.macro";

export default function Footer() {
  return (
    <div css={[tw`w-full bg-black text-pink-200 p-6 text-center`]}>
      made by me. source on{" "}
      <a
        href="https://github.com/shepherdjerred/shepherdjerred.com"
        css={[tw`underline`]}
      >
        github
      </a>
      . like most everything i write, this is licensed under the{" "}
      <a
        href="https://www.gnu.org/licenses/gpl-3.0.en.html"
        css={[tw`underline`]}
      >
        gnu gpl v3
      </a>
    </div>
  );
}
