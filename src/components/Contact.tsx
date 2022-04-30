import tw from "twin.macro";

export default function Contact() {
  return (
    <div css={[tw`w-full bg-purple-900 text-yellow-300 p-10 text-center`]}>
      <h1>Contact</h1>
      <div>
        Email me at{" "}
        <a css={tw`underline`} href="mailto:contact@jerred.shepherdjerred.com">
          contact@jerred.shepherdjerred.com
        </a>
        .
      </div>
    </div>
  );
}
