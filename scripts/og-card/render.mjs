// Renders scripts/og-card/og-card.html to the site's share cards:
//
//   public/assets/imgs/og/og-card-v2.png          the fallback, for every other page
//   public/assets/imgs/og/blog/<slug>.png         one per post
//   public/assets/imgs/og/portfolio/<slug>.png    one per case study
//
//   node scripts/og-card/render.mjs
//
// Run it after adding or retitling a post or case study; the prerender fails
// the build when a page points at a card that does not exist.
//
// Uses Playwright's Chromium (`npx playwright install chromium`). Set
// CHROME_PATH to use another Chromium binary instead.
import { chromium } from "@playwright/test";
import { mkdir } from "node:fs/promises";
import { fileURLToPath, pathToFileURL } from "node:url";
import path from "node:path";
import { createServer } from "vite";

const here = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(here, "../..");
const src = pathToFileURL(path.join(here, "og-card.html")).href;
const outDir = path.join(root, "public/assets/imgs/og");

// The data files are TypeScript with "@/" imports, so load them through Vite
// rather than duplicating titles here.
const vite = await createServer({
  root,
  logLevel: "error",
  appType: "custom",
  server: { middlewareMode: true },
  optimizeDeps: { noDiscovery: true, include: [] },
});
const { POSTS } = await vite.ssrLoadModule("/src/data/posts.ts");
const { CASE_STUDIES } = await vite.ssrLoadModule("/src/data/caseStudies.ts");
await vite.close();

const cards = [
  ...POSTS.map((p) => ({
    out: `blog/${p.slug}.png`,
    kicker: `Notes · ${p.category}`,
    title: p.title,
    tags: p.tags,
  })),
  ...CASE_STUDIES.map((c) => ({
    out: `portfolio/${c.slug}.png`,
    kicker: `Case study · ${c.company}`,
    title: c.title,
    tags: c.stack,
  })),
];

const browser = await chromium.launch({
  executablePath: process.env.CHROME_PATH || undefined,
  args: ["--allow-file-access-from-files"],
});
const page = await browser.newPage({ viewport: { width: 1200, height: 630 }, deviceScaleFactor: 1 });
await page.goto(src, { waitUntil: "networkidle" });
await page.evaluate(() => document.fonts.ready);

async function shoot(file) {
  const out = path.join(outDir, file);
  await mkdir(path.dirname(out), { recursive: true });
  await page.screenshot({ path: out, type: "png" });
  console.log(`wrote ${path.relative(root, out)}`);
}

await shoot("og-card-v2.png");

for (const card of cards) {
  await page.evaluate(({ kicker, title, tags }) => {
    document.querySelector(".role").textContent = kicker;
    const h1 = document.querySelector("h1");
    h1.textContent = title;
    // Longer titles step down so they stay inside the copy column.
    h1.style.fontSize = title.length > 52 ? "40px" : title.length > 36 ? "44px" : "";
    const row = document.querySelector(".tags");
    row.replaceChildren(
      ...tags.map((t) => {
        const el = document.createElement("span");
        el.className = "tag";
        el.textContent = t;
        return el;
      }),
    );
    // Drop tags from the end until the row fits beside the URL.
    while (row.children.length > 1 && row.scrollWidth > row.clientWidth) row.lastElementChild.remove();
  }, card);
  await shoot(card.out);
}

await browser.close();
