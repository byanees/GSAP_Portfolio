// The header on a phone: the ring opens a sheet instead of unfolding sideways.

import { expect, expectHealthy, settle, test } from "./helpers";

test.beforeEach(async ({ page }) => {
  await page.goto("/about");
  await settle(page);
});

test("the ring opens the sheet, locks scroll, and a link navigates and closes it", async ({ page, health }) => {
  const ring = page.locator(".site-nav__ring");
  await ring.click();
  await expect(ring).toHaveAttribute("aria-expanded", "true");
  await expect(page.locator(".site-nav[data-sheet]")).toHaveCount(1);
  expect(await page.evaluate(() => document.documentElement.style.overflow)).toBe("hidden");

  await page.locator(".site-nav__sheet").getByRole("link", { name: /Portfolio/ }).click();
  await expect(page).toHaveURL(/\/portfolio$/);
  await expect(page.locator(".site-nav[data-sheet]")).toHaveCount(0);
  expect(await page.evaluate(() => document.documentElement.style.overflow)).toBe("");
  expectHealthy(health);
});

test("the pill shows the current page, and the desktop links stay hidden", async ({ page }) => {
  await expect(page.locator(".site-nav__now-label")).toHaveText("About Me");
  await expect(page.locator(".site-nav__links")).toBeHidden();
});

test("the sheet's search row opens the palette full screen", async ({ page }) => {
  await page.locator(".site-nav__ring").click();
  await page.locator(".site-nav__sheet-search").click();
  const panel = page.locator(".cmdk__panel");
  await expect(panel).toBeVisible();
  const box = await panel.boundingBox();
  expect(box?.width).toBeGreaterThanOrEqual(page.viewportSize()!.width - 1);
  await page.getByRole("button", { name: "Close search" }).click();
  await expect(page.locator(".cmdk[data-open]")).toHaveCount(0);
});

test("the home hero's main actions go full width", async ({ page }) => {
  await page.goto("/");
  await settle(page);
  const width = page.viewportSize()!.width;
  for (const sel of [".hero-btn--primary", ".hero-btn--secondary"]) {
    const box = await page.locator(sel).boundingBox();
    expect(box!.width, sel).toBeGreaterThan(width * 0.8);
  }
});
