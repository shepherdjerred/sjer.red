import tw from "twin.macro";

export default function About() {
  return (
    <div css={[tw`grid grid-cols-1`]}>
      <div css={tw`place-self-center md:w-3/5 p-6`}>
        <h1 css={tw`text-2xl`}>about</h1>
        <p>
          this is a little site that acts as a homepage about me. it&apos;s not
          aesthetically pleasing and it&apos;s definitely overengineered in the
          sense that it bundles a bunch of dependencies for something that would
          be better off as a static site, or something else.
        </p>
        <h1 css={[tw`text-2xl pt-6`]}>faq</h1>
        <div css={[tw`pb-6`]}>
          <p>q: why does this site look so terrible?</p>
          <p>a: it looks exactly the way i want it to</p>
        </div>
        <div css={[tw`pb-6`]}>
          <p>
            q: why did you use react + react router + three.js + tailwind + vite
            for a site with a single page and not much content?
          </p>
          <p>
            a: web development is a hellscape and this project helped me get
            familiar with tools i want to use for larger projects
          </p>
        </div>
        <div css={[tw`pb-6`]}>
          <p>q: okay but did you really need react router for this?</p>
          <p>a: no</p>
        </div>
      </div>
    </div>
  );
}
