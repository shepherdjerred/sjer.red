import { func, argument, Directory, object, Secret, Container, dag } from "@dagger.io/dagger";

// Helper function to log with timestamp
function logWithTimestamp(message: string): void {
  console.log(`[${new Date().toISOString()}] ${message}`);
}

// Helper function to measure execution time
async function withTiming<T>(operation: string, fn: () => Promise<T>): Promise<T> {
  const start = Date.now();
  logWithTimestamp(`Starting ${operation}...`);
  try {
    const result = await fn();
    const duration = Date.now() - start;
    logWithTimestamp(`✅ ${operation} completed in ${duration.toString()}ms`);
    return result;
  } catch (error) {
    const duration = Date.now() - start;
    logWithTimestamp(
      `❌ ${operation} failed after ${duration.toString()}ms: ${error instanceof Error ? error.message : String(error)}`,
    );
    throw error;
  }
}

// Get a Bun container with the specified version
function getBunContainer(version = "latest"): Container {
  return dag
    .container()
    .from(`oven/bun:${version}`)
    .withWorkdir("/workspace")
    .withEnvVariable("PUPPETEER_SKIP_DOWNLOAD", "1");
}

// Get a base container with Playwright system dependencies pre-installed
// This is cached independently of source code changes
// Using Chromium since that's more commonly used and better tested in containers
function getBaseContainer(): Container {
  return getBunContainer()
    .withMountedCache("/root/.cache/ms-playwright", dag.cacheVolume("playwright-cache"))
    .withExec(["bunx", "--yes", "playwright@1.52.0", "install", "chromium"])
    .withExec(["bunx", "--yes", "playwright@1.52.0", "install-deps"]);
}

@object()
export class SjerRed {
  /**
   * Install dependencies
   * @param source The source directory
   * @returns A container with dependencies installed
   */
  @func()
  async deps(
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
  ): Promise<Container> {
    return withTiming("install dependencies", () => {
      const container = getBaseContainer()
        .withMountedCache("/root/.bun/install/cache", dag.cacheVolume("bun-cache"))
        .withDirectory("/workspace", source)
        .withExec(["bun", "install", "--frozen-lockfile"]);

      logWithTimestamp("Dependencies installed successfully");
      return Promise.resolve(container);
    });
  }

  /**
   * Build the website
   * @param source The source directory
   * @returns The built website directory
   */
  @func()
  async build(
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
  ): Promise<Directory> {
    return withTiming("build website", async () => {
      const container = await this.deps(source);

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
   * Run tests with official Playwright Docker image (sanity check)
   * Uses Node.js (already in the image) instead of Bun
   * @param source The source directory
   * @returns A success message
   */
  @func()
  async testOfficial(
    @argument({
      ignore: ["node_modules", "dist", "build", ".cache", "*.log", ".env*", "!.env.example", ".dagger"],
      defaultPath: ".",
    })
    source: Directory,
  ): Promise<string> {
    return withTiming("run tests (official image)", async () => {
      // Use official Playwright Docker image with Bun installed
      // This gives us proven browser support + Bun's speed
      // Version must match package.json @playwright/test version
      const container = dag
        .container()
        .from("mcr.microsoft.com/playwright:v1.52.0-noble")
        .withWorkdir("/workspace")
        // Install unzip (required for Bun installer)
        .withExec(["apt-get", "update"])
        .withExec(["apt-get", "install", "-y", "unzip"])
        // Install Bun
        .withExec(["sh", "-c", "curl -fsSL https://bun.sh/install | bash"])
        .withEnvVariable("PATH", "/root/.bun/bin:$PATH", { expand: true })
        // Mount source and install dependencies with Bun
        .withMountedCache("/root/.bun/install/cache", dag.cacheVolume("bun-cache"))
        .withDirectory("/workspace", source)
        .withExec(["bun", "install", "--frozen-lockfile"]);

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
  ): Promise<string> {
    return withTiming("run tests", async () => {
      const container = await this.deps(source);
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
   * Deploy to Cloudflare Pages
   * @param source The source directory
   * @param branch The git branch name
   * @param gitSha The git commit SHA
   * @param accountId Cloudflare account ID
   * @param apiToken Cloudflare API token
   * @returns A success message
   */
  @func()
  async deploy(
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
    @argument() branch: string,
    @argument() gitSha: string,
    @argument() accountId: Secret,
    @argument() apiToken: Secret,
  ): Promise<string> {
    return withTiming("deploy to Cloudflare Pages", async () => {
      const container = await this.deps(source);
      const distDir = await this.build(source);

      const deployContainer = container
        .withDirectory("/workspace/dist", distDir)
        .withExec(["bun", "install", "-g", "wrangler"])
        .withSecretVariable("CLOUDFLARE_ACCOUNT_ID", accountId)
        .withSecretVariable("CLOUDFLARE_API_TOKEN", apiToken)
        .withExec([
          "wrangler",
          "pages",
          "deploy",
          "dist",
          "--project-name=shepherdjerred-com",
          `--branch=${branch}`,
          `--commit-hash=${gitSha}`,
        ]);

      await deployContainer.sync();

      logWithTimestamp("Deployment completed successfully");
      return `✅ Deployed to Cloudflare Pages (branch: ${branch}, commit: ${gitSha})`;
    });
  }

  /**
   * Run the complete CI pipeline
   * @param source The source directory
   * @param branch The git branch name
   * @param gitSha The git commit SHA
   * @param accountId Cloudflare account ID (optional, for deployment)
   * @param apiToken Cloudflare API token (optional, for deployment)
   * @returns A success message
   */
  @func()
  async ci(
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
        // Include snapshots for visual regression testing
      ],
      defaultPath: ".",
    })
    source: Directory,
    @argument() branch: string,
    @argument() gitSha: string,
    accountId?: Secret,
    apiToken?: Secret,
  ): Promise<string> {
    return withTiming("CI pipeline", async () => {
      logWithTimestamp("🚀 Starting CI pipeline");

      // Run checks in parallel
      const [_, __, ___] = await Promise.all([
        withTiming("lint", () => this.lint(source)),
        withTiming("test", () => this.testOfficial(source)),
        withTiming("build", () => this.build(source)),
      ]);

      logWithTimestamp("✅ All checks passed");

      // Deploy if on main branch and secrets are provided
      if (branch === "main" && accountId && apiToken) {
        await this.deploy(source, branch, gitSha, accountId, apiToken);
      }

      return `✅ CI pipeline completed successfully (branch: ${branch}, commit: ${gitSha})`;
    });
  }
}
