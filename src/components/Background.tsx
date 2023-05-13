import tw, { type TwStyle } from "twin.macro";
import pattern from "./pattern.svg";

export interface BackgroundProps {
  extraCss: TwStyle;
  children: React.ReactNode;
}

export default function Background(props: BackgroundProps) {
  return (
    <div
      css={[
        tw`min-h-[100vh]`,
        { backgroundImage: `url(${pattern})` },
        props.extraCss,
      ]}
    >
      {props.children}
    </div>
  );
}
