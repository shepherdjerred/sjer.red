import type React from "react";
import tw from "twin.macro";
import Footer from "./Footer";

export default function FooterWrapper({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div css={tw`min-h-screen flex flex-col`}>
      <div css={tw`flex-1`}>{children}</div>
      <Footer />
    </div>
  );
}
