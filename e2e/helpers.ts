import { readFileSync } from "node:fs";
import { test as base, expect, type Page } from "@playwright/test";

export const SITE_URL = "https://byanees.com";

/** Every route in the built sitemap, as a path. New posts and case studies are
 *  covered as soon as they are published, with no list to keep up to date. */
export function sitemapPaths(): string[] {
  const xml = readFileSync("dist/sitemap.xml", "utf8");
  return [...xml.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => new URL(m[1]).pathname);
}

type Health = { problems: string[] };

/**
 * `health` records console errors and warnings, uncaught exceptions, and
 * failed same-origin requests while a test runs. Call `expectHealthy()` to
 * assert there were none.
 */
export const test = base.extend<{ health: Health }>({
  // Playwright calls the second argument `use`; it is renamed so the React
  // hooks lint rule doesn't mistake it for a hook.
  health: async ({ page, baseURL }, provide) => {
    const problems: string[] = [];
    page.on("console", (msg) => {
      if (msg.type() === "error" || msg.type() === "warning") problems.push(`console.${msg.type()}: ${msg.text()}`);
    });
    page.on("pageerror", (err) => problems.push(`uncaught: ${err.message}`));
    page.on("requestfailed", (req) => {
      if (req.url().startsWith(baseURL!)) problems.push(`request failed: ${req.url()} (${req.failure()?.errorText})`);
    });
    page.on("response", (res) => {
      if (res.url().startsWith(baseURL!) && res.status() >= 400 && res.request().resourceType() !== "document")
        problems.push(`HTTP ${res.status()}: ${res.url()}`);
    });
    await provide({ problems });
  },
});

export { expect };

export function expectHealthy(health: Health) {
  expect(health.problems, "console errors, exceptions, or failed requests").toEqual([]);
}

/** Resolves once hydration has run and GSAP-driven effects have had a moment. */
export async function settle(page: Page) {
  await page.waitForLoadState("load");
  await page.waitForFunction(() => !document.getElementById("site-loader") || document.getElementById("site-loader")!.classList.contains("is-leaving"), null, { timeout: 10_000 }).catch(() => {});
  await page.waitForTimeout(600);
}

/** Computed width of an element, in whole pixels. */
export function widthOf(page: Page, selector: string) {
  return page.locator(selector).evaluate((el) => Math.round(parseFloat(getComputedStyle(el).width)));
}

/** Waits until the page has stopped scrolling (smooth wheel scrolling runs on
 *  after the wheel event, and would otherwise overlap the next step). */
export async function scrollSettled(page: Page) {
  let last = -1;
  await expect
    .poll(async () => {
      const y = await page.evaluate(() => Math.round(window.scrollY));
      const still = y === last;
      last = y;
      return still;
    }, { intervals: [100] })
    .toBe(true);
}

/** Scrolls with the mouse wheel, as a visitor would, and waits for it to stop. */
export async function wheel(page: Page, dy: number) {
  await page.mouse.wheel(0, dy);
  await scrollSettled(page);
}

/** Jumps to a scroll position and waits until the page is there. */
export async function scrollToY(page: Page, y: number) {
  await page.evaluate((top) => window.scrollTo({ top, behavior: "instant" }), y);
  await expect.poll(() => page.evaluate(() => Math.round(window.scrollY))).toBe(y);
}
