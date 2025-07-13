import {
  func,
  argument,
  Directory,
  object,
  Secret,
  Container,
  dag,
} from "@dagger.io/dagger";

// Helper function to log with timestamp
function logWithTimestamp(message: string): void {
  console.log(`[${new Date().toISOString()}] ${message}`);
}

// Helper function to measure execution time
async function withTiming<T>(
  operation: string,
  fn: () => Promise<T>
): Promise<T> {
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
      `❌ ${operation} failed after ${duration.toString()}ms: ${error instanceof Error ? error.message : String(error)}`
    );
    throw error;
  }
}

// Get a Node.js container with the specified version
function getNodeContainer(version: string = "lts"): Container {
  return dag
    .container()
    .from(`node:${version}`)
    .withWorkdir("/workspace")
    .withEnvVariable("NPM_CONFIG_CACHE", "/npm-cache")
    .withEnvVariable("PUPPETEER_SKIP_DOWNLOAD", "1");
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
    source: Directory
  ): Promise<Container> {
    return await withTiming("install dependencies", async () => {
      const container = getNodeContainer()
        .withMountedCache("/npm-cache", dag.cacheVolume("npm-cache"))
        .withMountedCache("/root/.cache/ms-playwright", dag.cacheVolume("playwright-cache"))
        .withDirectory("/workspace", source)
        .withExec(["npm", "ci"])
        .withExec(["npx", "playwright", "install"])
        .withExec(["npx", "playwright", "install-deps"]);

      logWithTimestamp("Dependencies installed successfully");
      return container;
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
    source: Directory
  ): Promise<Directory> {
    return await withTiming("build website", async () => {
      const container = await this.deps(source);

      const builtContainer = container
        .withMountedCache("/webring-cache", dag.cacheVolume("webring-cache"))
        .withEnvVariable("WEBRING_CACHE_DIR", "/webring-cache")
        .withExec(["npm", "run", "build"]);

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
    source: Directory
  ): Promise<string> {
    return await withTiming("lint code", async () => {
      const container = await this.deps(source);

      await container.withExec(["npm", "run", "lint"]).sync();

      logWithTimestamp("Linting completed successfully");
      return "✅ Linting passed";
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
    source: Directory
  ): Promise<string> {
    return await withTiming("run tests", async () => {
      const container = await this.deps(source);
      const distDir = await this.build(source);

      const testContainer = container
        .withDirectory("/workspace/dist", distDir)
        .withExec(["npm", "run", "test"]);

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
    @argument() apiToken: Secret
  ): Promise<string> {
    return await withTiming("deploy to Cloudflare Pages", async () => {
      const container = await this.deps(source);
      const distDir = await this.build(source);

      const deployContainer = container
        .withDirectory("/workspace/dist", distDir)
        .withExec(["npm", "install", "-g", "wrangler"])
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
        "test/index.spec.ts-snapshots",
      ],
      defaultPath: ".",
    })
    source: Directory,
    @argument() branch: string,
    @argument() gitSha: string,
    accountId?: Secret,
    apiToken?: Secret
  ): Promise<string> {
    return await withTiming("CI pipeline", async () => {
      logWithTimestamp("🚀 Starting CI pipeline");

      // Run checks in parallel
      const [lintResult, testResult, buildResult] = await Promise.all([
        withTiming("lint", () => this.lint(source)),
        withTiming("test", () => this.test(source)),
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
