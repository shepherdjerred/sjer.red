import tw from "twin.macro";

export default function About() {
  return (
    <div css={[tw`grid grid-cols-1`]}>
      <div css={tw`place-self-center md:w-3/5 p-6`}>
        <h1 css={tw`text-2xl`}>about</h1>
        <p css={tw`mb-4`}>
          I&apos;m a software engineer. I have a particular passion for
          programming languages, infrastructure, and developer tools. Some of my
          favorite languages are Rust, Haskell, TypeScript, and Java (strictly
          for sentimental reasons)
        </p>
        <p css={tw`mb-4`}>
          I&apos;ll soon (fall 2022) be studying at Georgia Tech to pursue a
          Masters in Computer Science.
        </p>
        <p css={tw`mb-4`}>
          I&apos;m a fan of free software and a huge supporter of open source.
        </p>
        <p css={tw`mb-4`}>
          I&apos;m very active on Github so you can check that out if
          you&apos;re curious about what I&apos;ve worked on. My resume has a
          bit more of a complete view of my background.
        </p>
        <p>
          My non-software-related interests include rock climbing, cooking,
          cats, and reading.
        </p>
      </div>
    </div>
  );
}
