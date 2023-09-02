import Testing from "./software-testing.mdx";
import Introduction from "./introduction.mdx";
import Rust from "./rust-is-exciting.mdx";
import Perfection from "./on-perfection.mdx";
import Language from "./language-doesnt-matter.mdx";
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
    title: "Software Testing",
    slug: "software-testing",
    component: <Testing components={mdx} />,
    created: new Date("2023-08-18"),
    draft: false,
  },
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
  {
    title: "Language Doesn't Matter",
    slug: "language-doesnt-matter",
    component: <Language components={mdx} />,
    created: new Date("2022-05-01"),
    draft: false,
  },
  {
    title: "Rust is Exciting",
    slug: "rust-is-exciting",
    component: <Rust components={mdx} />,
    created: new Date("2021-06-19"),
    draft: false,
  },
  {
    title: "On Perfection",
    slug: "on-perfection",
    component: <Perfection components={mdx} />,
    created: new Date("2021-02-27"),
    draft: false,
  },
  {
    title: "Introduction",
    slug: "introduction",
    component: <Introduction components={mdx} />,
    created: new Date("2021-01-12"),
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
