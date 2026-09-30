// Every published page: it loads cleanly, and carries what search engines and
// answer engines read (title, description, canonical, structured data, one h1).

import { readFileSync } from "node:fs";
import { SITE_URL, expect, expectHealthy, settle, sitemapPaths, test } from "./helpers";

const paths = sitemapPaths();

test("the sitemap lists the site's pages", () => {
  expect(paths.length).toBeGreaterThanOrEqual(15);
  expect(paths).toEqual(expect.arrayContaining(["/", "/about", "/portfolio", "/blog", "/contact"]));
});

for (const path of paths) {
  test(`${path} loads cleanly, with complete metadata`, async ({ page, health }) => {
    const res = await page.goto(path);
    expect(res?.status()).toBe(200);
    await settle(page);
    // Let scroll-driven effects run once, top to bottom, as a visitor would.
    await page.evaluate(async () => {
      for (let y = 0; y < document.documentElement.scrollHeight; y += 700) {
        window.scrollTo({ top: y, behavior: "instant" });
        await new Promise((r) => setTimeout(r, 80));
      }
    });
    await page.waitForTimeout(500);
    expectHealthy(health);

    await expect(page.locator("html")).toHaveAttribute("lang", /^en/);
    await expect(page.locator("h1")).toHaveCount(1);
    expect((await page.title()).length).toBeGreaterThan(10);

    const description = await page.locator('meta[name="description"]').getAttribute("content");
    expect(description?.length ?? 0, "meta description length").toBeGreaterThan(50);
    expect(description?.length ?? 0, "meta description length").toBeLessThanOrEqual(170);

    const canonical = await page.locator('link[rel="canonical"]').getAttribute("href");
    expect(canonical).toBe(path === "/" ? `${SITE_URL}/` : `${SITE_URL}${path}`);

    await expect(page.locator('meta[property="og:title"]')).toHaveCount(1);
    await expect(page.locator('meta[property="og:image"]')).toHaveCount(1);

    const ld = await page.locator('script[type="application/ld+json"]').allTextContents();
    expect(ld.length, "JSON-LD blocks").toBeGreaterThan(0);
    for (const block of ld) expect(() => JSON.parse(block)).not.toThrow();
  });
}

test("titles and descriptions are unique across pages", async ({ request }) => {
  const seen = { title: new Map<string, string>(), description: new Map<string, string>() };
  for (const path of paths) {
    const html = await (await request.get(path)).text();
    const title = html.match(/<title>([^<]*)<\/title>/)?.[1] ?? "";
    const description = html.match(/<meta name="description" content="([^"]*)"/)?.[1] ?? "";
    expect(seen.title.get(title), `title of ${path} repeats`).toBeUndefined();
    expect(seen.description.get(description), `description of ${path} repeats`).toBeUndefined();
    seen.title.set(title, path);
    seen.description.set(description, path);
  }
});

test("an unknown path gets a real 404 page", async ({ page }) => {
  const res = await page.goto("/this-page-does-not-exist");
  expect(res?.status()).toBe(404);
  await expect(page.locator("h1")).toHaveCount(1);
});

test("crawler and answer-engine files are served", async ({ request }) => {
  for (const file of ["/robots.txt", "/sitemap.xml", "/rss.xml", "/llms.txt", "/llms-full.txt", "/site.webmanifest"]) {
    const res = await request.get(file);
    expect(res.status(), file).toBe(200);
    expect((await res.text()).length, file).toBeGreaterThan(50);
  }
  const robots = readFileSync("dist/robots.txt", "utf8");
  expect(robots).toContain(`Sitemap: ${SITE_URL}/sitemap.xml`);
});
