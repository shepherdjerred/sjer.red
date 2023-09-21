import { connect } from "@dagger.io/dagger";

connect(
  async (client) => {
    // use a node:16-slim container
    // mount the source code directory on the host
    // at /src in the container
    const source = client
      .container()
      .from("node:lts")
      .withDirectory("/src", client.host().directory("."), { exclude: ["node_modules/", "ci/"] });

    // set the working directory in the container
    // install application dependencies
    const runner = source.withWorkdir("/src").withExec(["npm", "install"]);

    // run application tests
    const test = runner.withExec(["npm", "run", "test"]);

    // build application
    // write the build output to the host
    const buildDir = runner.withExec(["npm", "run", "build"]).directory("./dist");

    await buildDir.export("./dist");

    const e = await buildDir.entries();

    console.log("build dir contents:\n", e);
  },
  { LogOutput: process.stdout },
);
