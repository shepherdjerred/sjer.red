import Page from "./libvirt.mdx";
import mdx from "./mdx";
import { Route, Routes } from "react-router-dom";
import Blog from "../components/Blog";

const posts = [
  {
    title: "My struggles with C and libvirt",
    short: "libvirt is hell",
    slug: "struggle-c-libvirt",
    component: <Page components={mdx} />,
    created: new Date("2022-10-06"),
  },
];

export default posts;

export function PostRouter() {
  const postRoutes = posts.map((post) => {
    return (
      <Route
        key={post.slug}
        path={post.slug}
        element={<Blog page={post.component} />}
      />
    );
  });

  return <Routes>{postRoutes}</Routes>;
}
