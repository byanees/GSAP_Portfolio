// Writes a real HTML file for every route, so crawlers that run no JavaScript
// (GPTBot, ClaudeBot, PerplexityBot, and every social unfurler) get the page
// instead of an empty <div id="root">. React hydrates over it in the browser,
// so nothing about the running site changes.

import { execFileSync } from "node:child_process";
import { createHash } from "node:crypto";
import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";
import Beasties from "beasties";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const dist = path.join(root, "dist");

const { render, ROUTES, SITE_URL, INDEXNOW_KEY } = await import(
  pathToFileURL(path.join(root, "dist-ssr", "entry-prerender.js")).href
);

// LF throughout: a Windows checkout has CRLF in index.html, and the hashes of
// its inline scripts in the Content-Security-Policy must match a Linux build.
const template = (await readFile(path.join(dist, "index.html"), "utf8")).replace(/\r\n/g, "\n");

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

/** Inlines the rules each page's own markup uses, so the prerendered HTML can
 *  paint without waiting on the 190 kB stylesheet. Everything else (hover and
 *  focus states, classes added by script, other routes' rules) arrives with the
 *  full sheet, which `deferAssets` below loads after the first frame. Theme
 *  rules are kept whatever the template's default, since the inline theme
 *  script may switch to dark before anything paints. */
const beasties = new Beasties({
  path: dist,
  publicPath: "/",
  preload: "body",
  pruneSource: false,
  reduceInlineStyles: false,
  inlineFonts: true,
  preloadFonts: false,
  keyframes: "critical",
  allowRules: [/data-bs-theme/],
  logLevel: "warn",
});

/** Beasties keeps a @font-face only when it can see the family used, and
 *  this theme names its families through custom properties, so it drops all
 *  of them. Without the faces inline, the fonts would not start loading until
 *  the full sheet arrived, and the text would swap fonts late. */
const sheet = template.match(/<link rel="stylesheet"[^>]*href="\/([^"]+\.css)"/)?.[1];
if (!sheet) throw new Error("prerender: no stylesheet link in dist/index.html");
const fontFaces = ((await readFile(path.join(dist, sheet), "utf8")).match(/@font-face\s*\{[^}]*\}/g) ?? []).join("");
if (!fontFaces) throw new Error(`prerender: no @font-face rules in ${sheet}`);

/** The app bundle and the full stylesheet, requested after the first frame
 *  rather than by the preload scanner. The page is complete without them (it
 *  is prerendered and its critical rules are inline), so starting them early
 *  only had them compete with the HTML and fonts for the first paint on a slow
 *  connection. A background tab never gets a frame, hence the timeout.
 *
 *  The script's text never changes, so its hash in the Content-Security-Policy
 *  (vercel.json) stays valid; the per-build file names travel as attributes. */
const BOOT_SCRIPT =
  "(function(){var d=document,s=d.currentScript,done=0;" +
  "function go(){if(done)return;done=1;" +
  'var l=d.createElement("link");l.rel="stylesheet";l.href=s.dataset.css;d.head.appendChild(l);' +
  'var m=d.createElement("script");m.type="module";m.crossOrigin="";m.src=s.dataset.js;d.head.appendChild(m)}' +
  "requestAnimationFrame(function(){setTimeout(go,0)});setTimeout(go,1000)})();";

const ENTRY_SCRIPT = /<script type="module" crossorigin src="(\/assets\/[^"]+\.js)"><\/script>\s*/;
const BODY_SHEET = /<link rel="stylesheet" crossorigin href="(\/assets\/[^"]+\.css)">/;

function deferAssets(html) {
  const js = html.match(ENTRY_SCRIPT)?.[1];
  const css = html.match(BODY_SHEET)?.[1];
  if (!js || !css) throw new Error("prerender: entry script or stylesheet link not where expected");
  if (/<link rel="modulepreload"/.test(html)) {
    throw new Error("prerender: modulepreload links would fetch chunks before first paint; defer them too");
  }
  return html
    .replace(ENTRY_SCRIPT, "")
    .replace(
      BODY_SHEET,
      `<noscript><link rel="stylesheet" href="${css}"></noscript>` +
        `<script data-js="${js}" data-css="${css}">${BOOT_SCRIPT}</script>`,
    );
}

const finishPage = async (html) =>
  deferAssets((await beasties.process(html)).replace("</head>", `<style>${fontFaces}</style></head>`));

/** A fingerprint per page, from the rendered head and body only. The template
 *  around them carries hashed bundle names that change on every build, which
 *  would make every page look edited. */
const fingerprints = {};

/** Hashes of every inline script the pages run, to check against the CSP. */
const inlineHashes = new Set();
const INLINE_SCRIPT = /<script(?![^>]*\bsrc=)(?![^>]*application\/ld\+json)[^>]*>([\s\S]*?)<\/script>/g;

async function writePage(file, html) {
  for (const m of html.matchAll(INLINE_SCRIPT)) {
    inlineHashes.add(`'sha256-${createHash("sha256").update(m[1]).digest("base64")}'`);
  }
  await writeFile(file, html, "utf8");
}

let count = 0;
for (const { path: route } of ROUTES) {
  const { head, body } = splitHead(render(route));
  if (!body.trim()) throw new Error(`Prerender produced no markup for ${route}`);
  fingerprints[`${SITE_URL}${route}`] = createHash("sha256").update(head + body).digest("hex").slice(0, 16);

  const outDir = route === "/" ? dist : path.join(dist, route);
  await mkdir(outDir, { recursive: true });
  await writePage(path.join(outDir, "index.html"), await finishPage(buildPage(head, body)));
  count += 1;
}

// A standalone 404 document. Vercel serves this for anything unmatched, with a
// real 404 status, now that the catch-all rewrite is gone.
{
  const { head, body } = splitHead(render("/__not-found__"));
  await writePage(path.join(dist, "404.html"), await finishPage(buildPage(head, body)));
}

// The CSP in vercel.json allows inline scripts by hash only. Editing one of
// them in index.html, or the boot script above, changes its hash, and the
// browser would refuse to run it; fail the build instead, naming the new hash.
{
  const vercel = JSON.parse(await readFile(path.join(root, "vercel.json"), "utf8"));
  const csp = vercel.headers
    .flatMap((h) => h.headers)
    .find((h) => h.key.toLowerCase() === "content-security-policy")?.value;
  if (!csp) throw new Error("vercel.json: no Content-Security-Policy header");
  const missing = [...inlineHashes].filter((h) => !csp.includes(h));
  if (missing.length) {
    throw new Error(`vercel.json CSP is missing inline script hashes (update script-src): ${missing.join(" ")}`);
  }
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
