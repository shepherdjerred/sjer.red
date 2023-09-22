import { connect } from "@dagger.io/dagger";

// TODO: prebuild devcontainer
// TODO: linting
// TODO: testing

connect(
  async (client) => {
    const nodeCache = client.cacheVolume("node");

    const source = client
      .container()
      .from("node:lts")
      .withWorkdir("/workspace")
      .withDirectory(".", client.host().directory("."), {
        include: [
          "assets",
          "public",
          "src",
          "package*.json",
          "astro.config.ts",
          "tailwind.config.cjs",
          "tsconfig.json",
        ],
      })
      .withMountedCache("node_modules", nodeCache);

    const runner = source.withExec(["npm", "install"]);

    const buildDir = runner.withExec(["npm", "run", "build"]).directory("./dist");

    await buildDir.export("./dist");
  },
  { LogOutput: process.stdout },
);
