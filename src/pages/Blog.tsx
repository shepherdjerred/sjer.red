import tw from "twin.macro";
import { Width } from "../components/Container";
import Layout from "../components/Layout";

export interface BlogProps {
  page: JSX.Element;
}

export default function Blog(props: BlogProps) {
  return (
    <Layout width={Width.NARROW} backgroundCss={tw`bg-gray-200`}>
      <div css={tw`mt-4 mb-4`}>{props.page}</div>
    </Layout>
  );
}
