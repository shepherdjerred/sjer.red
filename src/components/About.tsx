import tw from "twin.macro";
import Container, { Width } from "./Container";

export default function About() {
  return (
    <Container width={Width.NARROW}>
      <h1 css={tw`text-2xl`}>about</h1>
      <p css={tw`mb-4`}>
        I&apos;m a software engineer. I have a particular passion for
        programming languages, infrastructure, and developer tools. Some of my
        favorite languages are Rust, Haskell, TypeScript, and Java (strictly for
        sentimental reasons).
      </p>
      <p css={tw`mb-4`}>
        I&apos;m studying at{" "}
        <a css={tw`underline text-blue-400`} href="https://omscs.gatech.edu/">
          Georgia Tech
        </a>{" "}
        to pursue a Masters in Computer Science. Current I&apos;m taking{" "}
        <a
          css={tw`underline text-blue-400`}
          href="https://omscs.gatech.edu/cs-7210-distributed-computing"
        >
          Distributed Computing
        </a>
        . I&apos;m hoping to get into research after my Masters.
      </p>
      <p css={tw`mb-4`}>
        I&apos;m a fan of free software and a supporter of open source.
      </p>
      <p css={tw`mb-4`}>
        I&apos;m very active on{" "}
        <a
          href="https://github.com/shepherdjerred"
          css={tw`underline text-blue-400`}
        >
          Github
        </a>
        , so you can check that out if you&apos;re curious about what I&apos;ve
        been working on. My resume has a bit more of a complete view of my
        background.
      </p>
      <p>
        My non-computer-related interests include rock climbing, cooking, cats,
        and reading.
      </p>
    </Container>
  );
}
