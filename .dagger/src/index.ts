import { func, argument, Directory, object, Secret, Container, dag } from "@dagger.io/dagger";
import { logWithTimestamp, withTiming } from "@shepherdjerred/dagger-utils/utils";
import { updateHomelabVersion } from "@shepherdjerred/dagger-utils/containers";

// Get a Bun container with the specified version (for simple operations like lint)
function getBunContainer(version = "latest"): Container {
  return dag
    .container()
    .from(`oven/bun:${version}`)
    .withWorkdir("/workspace")
    .withEnvVariable("PUPPETEER_SKIP_DOWNLOAD", "1");
}

// Get a container with Playwright + Bun for operations that need browser (build, test)
// Uses official Playwright image with Bun installed on top
function getPlaywrightContainer(): Container {
  return (
    dag
      .container()
      .from("mcr.microsoft.com/playwright:v1.57.0-noble")
      .withWorkdir("/workspace")
      // Install unzip (required for Bun installer)
      .withExec(["apt-get", "update"])
      .withExec(["apt-get", "install", "-y", "unzip"])
      // Install Bun
      .withExec(["sh", "-c", "curl -fsSL https://bun.sh/install | bash"])
      .withEnvVariable("PATH", "/root/.bun/bin:$PATH", { expand: true })
  );
}

// Install deps on a given base container
function installDeps(baseContainer: Container, source: Directory): Container {
  return baseContainer
    .withMountedCache("/root/.bun/install/cache", dag.cacheVolume("bun-cache"))
    .withDirectory("/workspace", source)
    .withExec(["bun", "install", "--frozen-lockfile"]);
}

@object()
export class SjerRed {
  /**
   * Install dependencies (simple container, no Playwright)
   * @param source The source directory
   * @returns A container with dependencies installed
   */
  @func()
  async deps(
    @argument({
      ignore: [
        "**/node_modules",
        "dist",
        "build",
        ".cache",
        "*.log",
        ".env*",
        "!.env.example",
        ".dagger",
        "test/index.spec.ts-snapshots",
      ],
      defaultPath: ".",
    })
    source: Directory,
  ): Promise<Container> {
    return withTiming("install dependencies", () => {
      const container = installDeps(getBunContainer(), source);
      logWithTimestamp("Dependencies installed successfully");
      return Promise.resolve(container);
    });
  }

  /**
   * Install dependencies with Playwright support (for build/test)
   * @param source The source directory
   * @returns A container with dependencies and Playwright installed
   */
  @func()
  async depsWithPlaywright(
    @argument({
      ignore: [
        "**/node_modules",
        "dist",
        "build",
        ".cache",
        "*.log",
        ".env*",
        "!.env.example",
        ".dagger",
        "test/index.spec.ts-snapshots",
      ],
      defaultPath: ".",
    })
    source: Directory,
  ): Promise<Container> {
    return withTiming("install dependencies with Playwright", () => {
      const container = installDeps(getPlaywrightContainer(), source);
      logWithTimestamp("Dependencies with Playwright installed successfully");
      return Promise.resolve(container);
    });
  }

  /**
   * Build the website (requires Playwright for OG image generation)
   * @param source The source directory
   * @returns The built website directory
   */
  @func()
  async build(
    @argument({
      ignore: [
        "**/node_modules",
        "dist",
        "build",
        ".cache",
        "*.log",
        ".env*",
        "!.env.example",
        ".dagger",
        "test/index.spec.ts-snapshots",
      ],
      defaultPath: ".",
    })
    source: Directory,
  ): Promise<Directory> {
    return withTiming("build website", async () => {
      // Build requires Playwright for MDX/OG image processing
      const container = await this.depsWithPlaywright(source);

      const builtContainer = container
        .withMountedCache("/webring-cache", dag.cacheVolume("webring-cache"))
        .withEnvVariable("WEBRING_CACHE_DIR", "/webring-cache")
        .withExec(["bun", "run", "build"]);

      const distDir = builtContainer.directory("/workspace/dist");
      logWithTimestamp("Website built successfully");
      return distDir;
    });
  }

  /**
   * Run linting
   * @param source The source directory
   * @returns A success message
   */
  @func()
  async lint(
    @argument({
      ignore: [
        "**/node_modules",
        "dist",
        "build",
        ".cache",
        "*.log",
        ".env*",
        "!.env.example",
        ".dagger",
        "test/index.spec.ts-snapshots",
      ],
      defaultPath: ".",
    })
    source: Directory,
  ): Promise<string> {
    return withTiming("lint code", async () => {
      const container = await this.deps(source);

      // Generate Astro types before linting
      await container.withExec(["bunx", "astro", "sync"]).withExec(["bun", "run", "lint"]).sync();

      logWithTimestamp("Linting completed successfully");
      return "✅ Linting passed";
    });
  }

  /**
   * Run tests with official Playwright Docker image
   * @param source The source directory
   * @returns A success message
   */
  @func()
  async testOfficial(
    @argument({
      ignore: ["**/node_modules", "dist", "build", ".cache", "*.log", ".env*", "!.env.example", ".dagger"],
      defaultPath: ".",
    })
    source: Directory,
  ): Promise<string> {
    return withTiming("run tests (official image)", async () => {
      const container = await this.depsWithPlaywright(source);
      const distDir = await this.build(source);

      // Run tests with Bun
      const result = await container
        .withDirectory("/workspace/dist", distDir)
        .withEnvVariable("CI", "true")
        .withExec(["bun", "run", "test", "--project=chromium", "--max-failures=1"])
        .stdout();

      logWithTimestamp("Tests completed successfully");
      return result || "✅ Tests passed";
    });
  }

  /**
   * Run tests
   * @param source The source directory
   * @returns A success message
   */
  @func()
  async test(
    @argument({
      ignore: [
        "**/node_modules",
        "dist",
        "build",
        ".cache",
        "*.log",
        ".env*",
        "!.env.example",
        ".dagger",
        "test/index.spec.ts-snapshots",
      ],
      defaultPath: ".",
    })
    source: Directory,
  ): Promise<string> {
    return withTiming("run tests", async () => {
      const container = await this.depsWithPlaywright(source);
      const distDir = await this.build(source);

      const testContainer = container
        .withDirectory("/workspace/dist", distDir)
        .withEnvVariable("CI", "true")
        .withExec(["bun", "run", "test"]);

      await testContainer.sync();

      logWithTimestamp("Tests completed successfully");
      return "✅ Tests passed";
    });
  }

  /**
   * Build a production container with nginx serving the static files
   * @param source The source directory
   * @returns A container ready to be published
   */
  @func()
  async buildContainer(
    @argument({
      ignore: [
        "**/node_modules",
        "dist",
        "build",
        ".cache",
        "*.log",
        ".env*",
        "!.env.example",
        ".dagger",
        "test/index.spec.ts-snapshots",
      ],
      defaultPath: ".",
    })
    source: Directory,
  ): Promise<Container> {
    return withTiming("build container", async () => {
      const distDir = await this.build(source);

      // Build nginx container with static files
      const container = dag
        .container()
        .from("nginx:alpine")
        .withDirectory("/usr/share/nginx/html", distDir)
        .withExposedPort(80);

      logWithTimestamp("Container built successfully");
      return container;
    });
  }

  /**
   * Publish the container to GHCR
   * @param source The source directory
   * @param imageName The full image name (e.g., ghcr.io/shepherdjerred/sjer.red:latest)
   * @param ghcrUsername GHCR username
   * @param ghcrPassword GHCR password/token
   * @returns The published image reference
   */
  @func()
  async publish(
    @argument({
      ignore: [
        "node_modules",
        "dist",
        "build",
        ".cache",
        "*.log",
        ".env*",
        "!.env.example",
        ".dagger",
        "test/index.spec.ts-snapshots",
      ],
      defaultPath: ".",
    })
    source: Directory,
    @argument() imageName: string,
    @argument() ghcrUsername: string,
    @argument() ghcrPassword: Secret,
  ): Promise<string> {
    return withTiming("publish to GHCR", async () => {
      const container = await this.buildContainer(source);

      const publishedRef = await container
        .withRegistryAuth("ghcr.io", ghcrUsername, ghcrPassword)
        .publish(imageName);

      logWithTimestamp(`Published image: ${publishedRef}`);
      return publishedRef;
    });
  }

  /**
   * Deploy to homelab by creating a PR to update the image version
   * @param version The version/tag to deploy
   * @param ghToken GitHub token for creating the PR
   * @returns The result of the deployment
   */
  @func()
  async deploy(@argument() version: string, @argument() ghToken: Secret): Promise<string> {
    return withTiming("deploy to homelab", async () => {
      logWithTimestamp(`Creating PR to update sjer.red to version ${version}`);

      const result = await updateHomelabVersion({
        ghToken,
        appName: "sjer.red",
        version,
      });

      logWithTimestamp(`Deployment PR created: ${result}`);
      return result;
    });
  }

  /**
   * Run the complete CI pipeline
   * @param source The source directory
   * @param branch The git branch name
   * @param version The version tag (e.g., 1.0.123)
   * @param date The current date (YYYY-MM-DD) for cache busting on scheduled builds
   * @param ghcrUsername GHCR username (optional, for publishing)
   * @param ghcrPassword GHCR password/token (optional, for publishing)
   * @param ghToken GitHub token (optional, for creating deployment PR)
   * @returns A success message with image reference if published
   */
  @func()
  async ci(
    @argument({
      ignore: [
        "**/node_modules",
        "dist",
        "build",
        ".cache",
        "*.log",
        ".env*",
        "!.env.example",
        ".dagger",
        // Include snapshots for visual regression testing
      ],
      defaultPath: ".",
    })
    source: Directory,
    @argument() branch: string,
    @argument() version: string,
    @argument() date: string,
    ghcrUsername?: string,
    ghcrPassword?: Secret,
    ghToken?: Secret,
  ): Promise<string> {
    return withTiming("CI pipeline", async () => {
      logWithTimestamp(`🚀 Starting CI pipeline (date: ${date})`);

      // Run checks in parallel
      const [_, __, ___] = await Promise.all([
        withTiming("lint", () => this.lint(source)),
        withTiming("test", () => this.testOfficial(source)),
        withTiming("build", () => this.build(source)),
      ]);

      logWithTimestamp("✅ All checks passed");

      // Publish to GHCR if credentials are provided and on main branch
      if (ghcrUsername && ghcrPassword && branch === "main") {
        // Publish both :latest and :version tags
        const baseImage = "ghcr.io/shepherdjerred/sjer.red";
        const [latestRef, versionRef] = await Promise.all([
          this.publish(source, `${baseImage}:latest`, ghcrUsername, ghcrPassword),
          this.publish(source, `${baseImage}:${version}`, ghcrUsername, ghcrPassword),
        ]);

        // Deploy to homelab if GitHub token is provided
        if (ghToken) {
          await this.deploy(version, ghToken);
          return `✅ Published and deployed:\n  - ${latestRef}\n  - ${versionRef}\n  - Deployed version: ${version}`;
        }

        return `✅ Published images:\n  - ${latestRef}\n  - ${versionRef}`;
      }

      return `✅ CI pipeline completed successfully (branch: ${branch}, version: ${version})`;
    });
  }
}
