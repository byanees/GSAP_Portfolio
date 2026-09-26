// Writes a real HTML file for every route, so crawlers that run no JavaScript
// (GPTBot, ClaudeBot, PerplexityBot, and every social unfurler) get the page
// instead of an empty <div id="root">. React hydrates over it in the browser,
// so nothing about the running site changes.

import { execFileSync } from "node:child_process";
import { createHash } from "node:crypto";
import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const dist = path.join(root, "dist");

const { render, ROUTES, SITE_URL, INDEXNOW_KEY } = await import(
  pathToFileURL(path.join(root, "dist-ssr", "entry-prerender.js")).href
);

const template = await readFile(path.join(dist, "index.html"), "utf8");

/** React 19 emits every hoistable tag in one run at the head of the output.
 *  Peel that run off so it can go in <head> where it belongs, rather than
 *  sitting inside the body where a <title> would be ignored. */
const HOISTABLE = /^(<title>[\s\S]*?<\/title>|<meta\b[^>]*\/?>|<link\b[^>]*\/?>|<script type="application\/ld\+json"[\s\S]*?<\/script>)/;

function splitHead(html) {
  let rest = html;
  let head = "";
  for (;;) {
    const m = rest.match(HOISTABLE);
    if (!m) break;
    head += m[0];
    rest = rest.slice(m[0].length);
  }
  return { head, body: rest };
}

/** The template ships a default title and icon; the per-route title replaces
 *  the first and must not collide with it. */
function buildPage(headTags, bodyHtml) {
  return template
    .replace(/<title>[\s\S]*?<\/title>/, "")
    .replace("</head>", `${headTags}</head>`)
    .replace('<div id="root"></div>', `<div id="root">${bodyHtml}</div>`);
}

/** A fingerprint per page, from the rendered head and body only. The template
 *  around them carries hashed bundle names that change on every build, which
 *  would make every page look edited. */
const fingerprints = {};

let count = 0;
for (const { path: route } of ROUTES) {
  const { head, body } = splitHead(render(route));
  if (!body.trim()) throw new Error(`Prerender produced no markup for ${route}`);
  fingerprints[`${SITE_URL}${route}`] = createHash("sha256").update(head + body).digest("hex").slice(0, 16);

  const outDir = route === "/" ? dist : path.join(dist, route);
  await mkdir(outDir, { recursive: true });
  await writeFile(path.join(outDir, "index.html"), buildPage(head, body), "utf8");
  count += 1;
}

// A standalone 404 document. Vercel serves this for anything unmatched, with a
// real 404 status, now that the catch-all rewrite is gone.
{
  const { head, body } = splitHead(render("/__not-found__"));
  await writeFile(path.join(dist, "404.html"), buildPage(head, body), "utf8");
}

// Read by scripts/indexnow.mjs after a production deploy, to tell Bing which
// pages changed. The commit lets that script wait until this build is live.
function commitSha() {
  if (process.env.VERCEL_GIT_COMMIT_SHA) return process.env.VERCEL_GIT_COMMIT_SHA;
  try {
    return execFileSync("git", ["rev-parse", "HEAD"], { cwd: root, encoding: "utf8" }).trim();
  } catch {
    return null;
  }
}

await writeFile(
  path.join(dist, "indexnow.json"),
  JSON.stringify(
    {
      sha: commitSha(),
      host: new URL(SITE_URL).host,
      key: INDEXNOW_KEY,
      keyLocation: `${SITE_URL}/${INDEXNOW_KEY}.txt`,
      pages: fingerprints,
    },
    null,
    2,
  ),
  "utf8",
);

console.log(`prerendered ${count} routes + 404.html`);
