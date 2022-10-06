import { MDXProvider } from "@mdx-js/react";
import Post from "../posts/libvirt.mdx";

export default function Blog() {
  const components = {
    em: (props: any) => <i {...props} />,
  };

  return (
    <MDXProvider components={components}>
      <Post />
    </MDXProvider>
  );
}
