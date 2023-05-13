import tw, { type TwStyle } from "twin.macro";

export interface ContainerProps {
  children: React.ReactNode;
  width: Width;
}

export enum Width {
  NARROW,
  NORMAL,
  WIDE,
}

function widthToClass(width: Width): TwStyle {
  switch (width) {
    case Width.NARROW:
      return tw`md:w-2/5`;
    case Width.NORMAL:
      return tw`md:w-3/5`;
    case Width.WIDE:
      return tw`md:w-4/5`;
  }
}

export default function Container(props: ContainerProps) {
  return (
    <div css={tw`grid grid-cols-1`}>
      <div
        css={[tw`p-2 md:p-0 md:place-self-center`, widthToClass(props.width)]}
      >
        {props.children}
      </div>
    </div>
  );
}
