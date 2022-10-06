import tw from "twin.macro";
import pattern from "./pattern.svg";

export default function BlogList() {
  return (
    <div
      css={[
        tw`bg-purple-200 md:min-h-[100vh] pt-4 pb-4`,
        { backgroundImage: `url(${pattern})` },
      ]}
    >
      <div css={[tw`md:place-self-center p-56 pb-0 pt-0`]}>
        <div>
          <a href="#/blog/libvirt-and-c" css={tw`underline`}>
            1. My struggles with C and libvirt
          </a>
        </div>
      </div>
    </div>
  );
}
