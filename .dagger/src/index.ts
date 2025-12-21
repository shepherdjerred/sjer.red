import { func, argument, Directory, object, Secret, Container, dag } from "@dagger.io/dagger";
import { logWithTimestamp, withTiming } from "@shepherdjerred/dagger-utils/utils";

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
   * Run tests with official Playwright Docker image
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
   * Deploy to Cloudflare Pages
   * @param source The source directory
   * @param branch The git branch name
   * @param gitSha The git commit SHA
   * @param accountId Cloudflare account ID
   * @param apiToken Cloudflare API token
   * @returns The deployment URL
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
      const distDir = await this.build(source);

      // Use a Node.js container for wrangler (more standard/tested)
      const deployContainer = dag
        .container()
        .from("node:lts-slim")
        .withDirectory("/workspace/dist", distDir)
        .withSecretVariable("CLOUDFLARE_ACCOUNT_ID", accountId)
        .withSecretVariable("CLOUDFLARE_API_TOKEN", apiToken)
        .withExec([
          "npx",
          "wrangler@latest",
          "pages",
          "deploy",
          "/workspace/dist",
          "--project-name=shepherdjerred-com",
          `--branch=${branch}`,
          `--commit-hash=${gitSha}`,
        ]);

      const output = await deployContainer.stdout();

      logWithTimestamp("Deployment output:");
      console.log(output);

      // Extract the deployment URL from wrangler output
      // Wrangler outputs something like: "✨ Deployment complete! Take a peek over at https://abc123.shepherdjerred-com.pages.dev"
      const urlMatch = output.match(/https:\/\/[^\s]+\.pages\.dev/);
      const deployUrl = urlMatch ? urlMatch[0] : `https://${gitSha.substring(0, 8)}.shepherdjerred-com.pages.dev`;

      logWithTimestamp(`Deployment completed successfully: ${deployUrl}`);
      return deployUrl;
    });
  }

  /**
   * Post or update a deploy preview comment on a GitHub PR
   * @param repo The GitHub repository (owner/repo format)
   * @param prNumber The pull request number
   * @param deployUrl The deployment preview URL
   * @param gitSha The git commit SHA
   * @param githubToken GitHub token for API access
   */
  @func()
  async commentOnPr(
    @argument() repo: string,
    @argument() prNumber: number,
    @argument() deployUrl: string,
    @argument() gitSha: string,
    @argument() githubToken: Secret,
  ): Promise<string> {
    return withTiming("comment on PR", async () => {
      const commentMarker = "<!-- deploy-preview-comment -->";
      const body = `${commentMarker}
## Deploy Preview

Your deploy preview is ready!

| Name | Link |
|------|------|
| Preview | ${deployUrl} |
| Commit | \`${gitSha}\` |`;

      // Use a container with curl to interact with GitHub API
      const container = dag.container().from("curlimages/curl:latest").withSecretVariable("GITHUB_TOKEN", githubToken);

      // First, find existing comment
      const listCommentsResult = await container
        .withExec([
          "sh",
          "-c",
          `curl -s -H "Authorization: token $GITHUB_TOKEN" \
            -H "Accept: application/vnd.github.v3+json" \
            "https://api.github.com/repos/${repo}/issues/${prNumber.toString()}/comments"`,
        ])
        .stdout();

      // Parse comments to find existing deploy preview comment
      let existingCommentId: number | null = null;
      try {
        const comments = JSON.parse(listCommentsResult) as Array<{ id: number; body: string }>;
        const existing = comments.find((c) => c.body.includes(commentMarker));
        if (existing) {
          existingCommentId = existing.id;
        }
      } catch {
        logWithTimestamp("Could not parse existing comments, will create new comment");
      }

      // Escape the body for JSON
      const escapedBody = body.replace(/\\/g, "\\\\").replace(/"/g, '\\"').replace(/\n/g, "\\n");

      if (existingCommentId) {
        // Update existing comment
        await container
          .withExec([
            "sh",
            "-c",
            `curl -s -X PATCH \
              -H "Authorization: token $GITHUB_TOKEN" \
              -H "Accept: application/vnd.github.v3+json" \
              -d '{"body": "${escapedBody}"}' \
              "https://api.github.com/repos/${repo}/issues/comments/${existingCommentId.toString()}"`,
          ])
          .sync();
        logWithTimestamp(`Updated existing comment ${existingCommentId.toString()}`);
      } else {
        // Create new comment
        await container
          .withExec([
            "sh",
            "-c",
            `curl -s -X POST \
              -H "Authorization: token $GITHUB_TOKEN" \
              -H "Accept: application/vnd.github.v3+json" \
              -d '{"body": "${escapedBody}"}' \
              "https://api.github.com/repos/${repo}/issues/${prNumber.toString()}/comments"`,
          ])
          .sync();
        logWithTimestamp("Created new comment");
      }

      return `✅ Posted deploy preview comment on PR #${prNumber.toString()}`;
    });
  }

  /**
   * Run the complete CI pipeline
   * @param source The source directory
   * @param branch The git branch name
   * @param gitSha The git commit SHA
   * @param accountId Cloudflare account ID (optional, for deployment)
   * @param apiToken Cloudflare API token (optional, for deployment)
   * @param githubRepo GitHub repository (owner/repo) for PR comments
   * @param prNumber Pull request number for posting comments
   * @param githubToken GitHub token for PR comments
   * @returns A success message with deploy URL if deployed
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
    githubRepo?: string,
    prNumber?: number,
    githubToken?: Secret,
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

      // Deploy if Cloudflare secrets are provided
      if (accountId && apiToken) {
        const deployUrl = await this.deploy(source, branch, gitSha, accountId, apiToken);

        // Post comment on PR if GitHub info is provided
        if (githubRepo && prNumber && githubToken) {
          await this.commentOnPr(githubRepo, prNumber, deployUrl, gitSha, githubToken);
        }

        return `✅ Deployed to ${deployUrl}`;
      }

      return `✅ CI pipeline completed successfully (branch: ${branch}, commit: ${gitSha})`;
    });
  }
}
