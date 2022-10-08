import type React from "react";
import type { TwStyle } from "twin.macro";
import tw from "twin.macro";
import Background from "./Background";
import Container, { Width } from "./Container";
import FooterWrapper from "./FooterWrapper";
import Header from "./Header";

export interface LayoutProps {
  backgroundCss: TwStyle;
  width: Width;
  children: React.ReactNode;
}

export default function Layout(props: LayoutProps) {
  return (
    <Background extraCss={props.backgroundCss}>
      <FooterWrapper>
        <div css={tw`fixed`}>
          <Header />
        </div>
        <Container width={props.width}>{props.children}</Container>
      </FooterWrapper>
    </Background>
  );
}
