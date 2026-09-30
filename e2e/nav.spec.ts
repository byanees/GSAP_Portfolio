// The header pill and the ⌘K palette, on desktop. Phones: nav.mobile.spec.ts.

import { expect, expectHealthy, scrollToY, settle, test, wheel, widthOf } from "./helpers";

const LINKS = ".site-nav__links";
const NOW = ".site-nav__now";

async function expectFolded(page: import("@playwright/test").Page) {
  await expect.poll(() => widthOf(page, LINKS), { message: "links fold away" }).toBe(0);
  await expect.poll(() => widthOf(page, NOW), { message: "current page shows" }).toBeGreaterThan(40);
}

async function expectUnfolded(page: import("@playwright/test").Page) {
  await expect.poll(() => widthOf(page, LINKS), { message: "links unfold" }).toBeGreaterThan(300);
}

test.beforeEach(async ({ page }) => {
  await page.goto("/about");
  await settle(page);
  await page.mouse.move(1300, 600);
});

test("the pill is the full menu at the top of a page", async ({ page, health }) => {
  await expectUnfolded(page);
  await expect(page.locator(".site-nav__link.active")).toHaveText("About Me");
  expectHealthy(health);
});

test("scrolling folds the pill to the current page; hover unfolds it", async ({ page }) => {
  await wheel(page, 1500);
  await expectFolded(page);
  await expect(page.locator(".site-nav__now-label")).toHaveText("About Me");

  await page.locator(".site-nav__pill").hover();
  await expectUnfolded(page);

  await page.mouse.move(1300, 600);
  await expectFolded(page);
});

test("scrolling back to the top unfolds the pill", async ({ page }) => {
  await wheel(page, 1500);
  await expectFolded(page);
  await scrollToY(page, 0);
  await expectUnfolded(page);
});

// Regression: a clicked link keeps focus, and :focus-within held the pill open.
test("after clicking the mark, the pill still folds on scroll", async ({ page }) => {
  await page.locator(".site-nav__mark").click();
  await expect(page).toHaveURL(/\/$/);
  await page.mouse.move(1300, 600);
  await wheel(page, 1500);
  await expectFolded(page);
});

// Regression: the theme's `a:focus { color: inherit }` turned the focused mark
// white on its own white circle.
test("the mark stays legible while focused", async ({ page }) => {
  await page.locator(".site-nav__mark").click();
  await page.mouse.move(1300, 600);
  const { color, background } = await page
    .locator(".site-nav__mark")
    .evaluate((el) => ({ color: getComputedStyle(el).color, background: getComputedStyle(el).backgroundColor }));
  expect(color).not.toBe(background);
});

test("a clicked link doesn't stay highlighted after navigating away from it", async ({ page }) => {
  await page.locator('.site-nav__link[href="/blog"]').click();
  await expect(page).toHaveURL(/\/blog$/);
  await page.mouse.move(1300, 600);
  const about = await page.locator('.site-nav__link[href="/about"]').evaluate((el) => getComputedStyle(el).color);
  const blog = await page.locator('.site-nav__link[href="/blog"]').evaluate((el) => getComputedStyle(el).color);
  expect(blog).not.toBe(about);
});

test("keyboard focus unfolds a folded pill", async ({ page }) => {
  await wheel(page, 1500);
  await expectFolded(page);
  await page.locator(".site-nav__mark").focus();
  await page.keyboard.press("Tab");
  await expect(page.locator(".site-nav__pill :focus-visible")).toHaveCount(1);
  await expectUnfolded(page);
});

test("the ring pins the pill open until the page returns to the top", async ({ page }) => {
  await wheel(page, 1500);
  await expectFolded(page);
  await page.locator(".site-nav__ring").click();
  await page.mouse.move(1300, 600);
  await expectUnfolded(page);
  // Back at the top the pin is released: wait there, as a visitor would pass.
  await scrollToY(page, 0);
  await expect(page.locator(".site-nav[data-pinned]")).toHaveCount(0);
  await scrollToY(page, 1500);
  await expectFolded(page);
});

test.describe("command palette", () => {
  test("Ctrl+K finds a post and Enter opens it", async ({ page, health }) => {
    await page.keyboard.press("Control+k");
    const input = page.getByRole("combobox", { name: "Search the site" });
    await expect(input).toBeFocused();
    await input.fill("idem");
    await expect(page.getByRole("option").first()).toContainText("idempotency");
    await page.keyboard.press("Enter");
    await expect(page).toHaveURL(/\/blog\/request-to-pay-idempotency$/);
    await expect(page.locator(".cmdk[data-open]")).toHaveCount(0);
    expectHealthy(health);
  });

  test('"/" opens it; Escape closes it and releases the scroll lock', async ({ page }) => {
    await page.keyboard.press("/");
    await expect(page.locator(".cmdk[data-open]")).toHaveCount(1);
    expect(await page.evaluate(() => document.documentElement.style.overflow)).toBe("hidden");
    await page.keyboard.press("Escape");
    await expect(page.locator(".cmdk[data-open]")).toHaveCount(0);
    expect(await page.evaluate(() => document.documentElement.style.overflow)).toBe("");
  });

  test("the search chip opens it, and closed it renders no results", async ({ page }) => {
    await expect(page.locator(".cmdk__item")).toHaveCount(0);
    await page.locator(".site-nav__search").click();
    await expect(page.getByRole("option").first()).toBeVisible();
    await page.getByRole("combobox", { name: "Search the site" }).fill("zzzzqqq");
    await expect(page.locator(".cmdk__empty")).toBeVisible();
  });
});
