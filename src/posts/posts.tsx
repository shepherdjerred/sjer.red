import Libvirt from "./libvirt.mdx";
import Cpointer from "./c-pointer-math.mdx";
import Cdebug from "./c-debugging.mdx";
import DiscordPlaysPokemon from "./discord-plays-pokemon.mdx";
import mdx from "./mdx";
import { Route, Routes } from "react-router-dom";
import Blog from "../pages/Blog";

export interface Post {
  title: string;
  slug: string;
  component: React.ReactNode;
  created: Date;
  draft: boolean;
}

const posts: Post[] = [
  {
    title: "Discord Plays Pokemon",
    slug: "discord-plays-pokemon",
    component: <DiscordPlaysPokemon components={mdx} />,
    created: new Date("2023-07-30"),
    draft: true,
  },
  {
    title: "Debugging C in VS Code",
    slug: "debug-c-vscode",
    component: <Cdebug components={mdx} />,
    created: new Date("2022-10-23"),
    draft: false,
  },
  {
    title: "Pointer Math in C",
    slug: "c-pointer-math-why-does-anyone-use-c",
    component: <Cpointer components={mdx} />,
    created: new Date("2022-10-15"),
    draft: false,
  },
  {
    title: "My struggles with C and libvirt",
    slug: "struggle-c-libvirt",
    component: <Libvirt components={mdx} />,
    created: new Date("2022-10-06"),
    draft: false,
  },
];

export default posts;

export function PostRouter() {
  const postRoutes = posts.map((post) => {
    return (
      <Route key={post.slug} path={post.slug} element={<Blog post={post} />} />
    );
  });

  return <Routes>{postRoutes}</Routes>;
}
