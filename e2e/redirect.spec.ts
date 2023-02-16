import { test, expect } from "@playwright/test";

test("test redirect on visiting shorten url", async ({ page }) => {
  // simulating accessing the shorten url
  const res = await page.goto("/some-hashed-url");

  // get the origin url before get redirected
  const origin = await res?.request().redirectedFrom()?.response();

  // assert status code 307 which indicate a temporary redirect
  await expect(origin?.status()).toBe(307);
});
