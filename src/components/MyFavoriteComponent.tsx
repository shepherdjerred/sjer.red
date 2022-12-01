import tw from "twin.macro";
import res from "../img/800x600.gif";
import lynx from "../img/internet_now02.gif";
import mac from "../img/macmade-wht.gif";

export default function MyFavoriteComponent() {
  return (
    <div css={tw`flex justify-center`}>
      <img src={res} css={tw`m-2`} />
      <img src={lynx} css={tw`m-2`} />
      <img src={mac} css={tw`m-2`} />
    </div>
  );
}
