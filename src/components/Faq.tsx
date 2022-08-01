import tw from "twin.macro";

export default function Faq() {
  return (
    <div css={[tw`grid grid-cols-1 p-6`]}>
      <div css={tw`place-self-center md:w-3/5 p-3 bg-pink-800 text-white`}>
        <h1 css={[tw`text-6xl font-bold pt-6 text-right mr-10`]}>FAQ</h1>
        <div css={[tw`pb-6`]}>
          <p>
            <span css={tw`font-bold mr-2`}>q:</span> why does this site look so
            terrible?
          </p>
          <p>
            <span css={tw`font-bold mr-2`}>a:</span> it looks exactly the way i
            want it to
          </p>
        </div>
      </div>
    </div>
  );
}
