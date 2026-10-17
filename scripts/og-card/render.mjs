// Renders scripts/og-card/og-card.html to public/assets/imgs/og/og-card-v2.png.
//
//   node scripts/og-card/render.mjs
//
// Uses Playwright's Chromium (`npx playwright install chromium`). Set
// CHROME_PATH to use another Chromium binary instead.
import { chromium } from "@playwright/test";
import { fileURLToPath, pathToFileURL } from "node:url";
import path from "node:path";

const here = path.dirname(fileURLToPath(import.meta.url));
const src = pathToFileURL(path.join(here, "og-card.html")).href;
const out = path.resolve(here, "../../public/assets/imgs/og/og-card-v2.png");

const browser = await chromium.launch({
  executablePath: process.env.CHROME_PATH || undefined,
  args: ["--allow-file-access-from-files"],
});
const page = await browser.newPage({ viewport: { width: 1200, height: 630 }, deviceScaleFactor: 1 });
await page.goto(src, { waitUntil: "networkidle" });
await page.evaluate(() => document.fonts.ready);
await page.screenshot({ path: out, type: "png" });
await browser.close();
console.log(`wrote ${path.relative(process.cwd(), out)}`);
