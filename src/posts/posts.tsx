import Libvirt from "./libvirt.mdx";
import Cpointer from "./c-pointer-math.mdx";
import mdx from "./mdx";
import { Route, Routes } from "react-router-dom";
import Blog from "../pages/Blog";

export interface Post {
  title: string;
  slug: string;
  component: React.ReactNode;
  created: Date;
}

const posts = [
  {
    title: "Pointer Math in C",
    slug: "c-pointer-math-why-does-anyone-use-c",
    component: <Cpointer components={mdx} />,
    created: new Date("2022-10-15"),
  },
  {
    title: "My struggles with C and libvirt",
    slug: "struggle-c-libvirt",
    component: <Libvirt components={mdx} />,
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
