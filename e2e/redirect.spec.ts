import { test, expect } from "@playwright/test";

test("test home page e2e", async ({ page }) => {
  await page.goto("/");
  await expect(page).toHaveTitle("Create Next App");
});
