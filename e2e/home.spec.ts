// The home page's hero actions and proof band.

import { expect, expectHealthy, settle, test } from "./helpers";

test.beforeEach(async ({ page }) => {
  await page.goto("/");
  await settle(page);
});

test("the three hero actions share one height and point where they say", async ({ page, health }) => {
  const buttons = page.locator(".hero-actions .hero-btn");
  await expect(buttons).toHaveCount(3);
  const heights = await buttons.evaluateAll((els) => els.map((el) => Math.round(el.getBoundingClientRect().height)));
  expect(new Set(heights).size, `heights ${heights}`).toBe(1);

  await expect(page.locator(".hero-btn--primary")).toHaveAttribute("href", "/portfolio");
  await expect(page.locator(".hero-btn--secondary")).toHaveAttribute("download", "");
  await expect(page.locator(".hero-btn--secondary")).toHaveAttribute("href", /\.pdf$/);
  expectHealthy(health);
});

test("each proof figure links to its case study, and ranges stay on one line", async ({ page }) => {
  const links = page.locator(".hero-proof__link");
  await expect(links).toHaveCount(3);
  for (const href of await links.evaluateAll((els) => els.map((el) => el.getAttribute("href")))) {
    expect(href).toMatch(/^\/portfolio\/[a-z0-9-]+$/);
  }
  // A range must not wrap after its dash.
  await expect(page.locator(".hero-proof__value").first()).toHaveCSS("white-space", "nowrap");
  await expect(page.locator(".hero-proof__label .text-nowrap").first()).toHaveText(/^\d+–\d+$/);
});
