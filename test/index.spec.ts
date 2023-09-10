import { test, expect } from "@playwright/test";

test("home page screenshot matches", async ({ page }) => {
  await page.goto("/");
  await expect(page).toHaveScreenshot();
});

test("blog list screenshot matches", async ({ page }) => {
  await page.goto("/blog");
  await expect(page).toHaveScreenshot();
});

test("blog post screenshot matches", async ({ page }) => {
  await page.goto("/blog/software-testing");
  await expect(page).toHaveScreenshot();
});
