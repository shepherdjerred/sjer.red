import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig(async () => {
  const mdx = await import("@mdx-js/rollup");

  return {
    optimizeDeps: {
      esbuildOptions: {
        target: "es2020",
      },
    },
    esbuild: {
      // https://github.com/vitejs/vite/issues/8644#issuecomment-1159308803
      logOverride: { "this-is-undefined-in-esm": "silent" },
    },
    plugins: [
      mdx.default({
        jsxImportSource: "@emotion/react",
      }),
      react({
        babel: {
          plugins: [
            "babel-plugin-macros",
            [
              "@emotion/babel-plugin-jsx-pragmatic",
              {
                export: "jsx",
                import: "__cssprop",
                module: "@emotion/react",
              },
            ],
            [
              "@babel/plugin-transform-react-jsx",
              { pragma: "__cssprop" },
              "twin.macro",
            ],
          ],
        },
      }),
    ],
  };
});
