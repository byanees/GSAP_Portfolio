// Tells IndexNow (Bing, Yandex, Seznam, Naver) which pages changed in the
// production deploy that just went live. Run by .github/workflows/indexnow.yml.
//
// The build publishes /indexnow.json: the commit it was built from and a
// fingerprint of every page. This script waits until the live site serves the
// expected commit, compares its fingerprints with the ones saved after the
// previous run, and submits only pages that were added, changed, or removed.
// With no saved state (the first run), or with --all, it submits every page.
//
//   EXPECTED_SHA=<commit> node scripts/indexnow.mjs [--all] [--dry-run]
//
// --dry-run prints what would be submitted and changes nothing.
//
// State lives in .indexnow/manifest.json, which the workflow carries between
// runs in the Actions cache. It is only written after a successful
// submission, so a failed run is retried in full by the next one.

import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";

const SITE = process.env.SITE_URL ?? "https://byanees.com";
const EXPECTED_SHA = process.env.EXPECTED_SHA;
const STATE = path.resolve(".indexnow", "manifest.json");
const SUBMIT_ALL = process.argv.includes("--all");
const DRY_RUN = process.argv.includes("--dry-run");

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

/** The domain can lag the deployment by a few seconds, so poll until it
 *  serves the build this run was triggered for. */
async function liveManifest() {
  for (let attempt = 1; attempt <= 20; attempt++) {
    try {
      const res = await fetch(`${SITE}/indexnow.json`, { headers: { "cache-control": "no-cache" } });
      if (res.ok) {
        const manifest = await res.json();
        if (!EXPECTED_SHA || manifest.sha === EXPECTED_SHA) return manifest;
        console.log(`live site is on ${manifest.sha?.slice(0, 7)}, waiting for ${EXPECTED_SHA.slice(0, 7)} (${attempt}/20)`);
      } else {
        console.log(`indexnow.json returned ${res.status} (${attempt}/20)`);
      }
    } catch (err) {
      console.log(`fetch failed: ${err.message} (${attempt}/20)`);
    }
    await sleep(15_000);
  }
  throw new Error("The live site never served the expected build.");
}

async function previousPages() {
  try {
    return JSON.parse(await readFile(STATE, "utf8")).pages;
  } catch {
    return null;
  }
}

const manifest = await liveManifest();
const previous = SUBMIT_ALL ? null : await previousPages();

let urls;
if (!previous) {
  urls = Object.keys(manifest.pages);
  console.log(SUBMIT_ALL ? "--all: submitting every page" : "no saved state: submitting every page");
} else {
  const changed = Object.entries(manifest.pages)
    .filter(([url, hash]) => previous[url] !== hash)
    .map(([url]) => url);
  // Pages that no longer exist are submitted too, so the engines recrawl
  // them, see the 404, and drop them.
  const removed = Object.keys(previous).filter((url) => !(url in manifest.pages));
  urls = [...changed, ...removed];
  for (const url of changed) console.log(`changed  ${url}`);
  for (const url of removed) console.log(`removed  ${url}`);
}

if (urls.length === 0) {
  console.log("No page changed in this deploy; nothing to submit.");
} else if (DRY_RUN) {
  console.log(`--dry-run: would submit ${urls.length} URL(s)`);
} else {
  const res = await fetch("https://api.indexnow.org/indexnow", {
    method: "POST",
    headers: { "content-type": "application/json; charset=utf-8" },
    body: JSON.stringify({
      host: manifest.host,
      key: manifest.key,
      keyLocation: manifest.keyLocation,
      urlList: urls,
    }),
  });
  // 200 means accepted; 202 means accepted while the key is still being
  // verified, which is normal on the first submission.
  if (res.status !== 200 && res.status !== 202) {
    throw new Error(`IndexNow rejected the submission: ${res.status} ${await res.text()}`);
  }
  console.log(`IndexNow accepted ${urls.length} URL(s) with ${res.status}.`);
}

if (DRY_RUN) process.exit(0);

await mkdir(path.dirname(STATE), { recursive: true });
await writeFile(STATE, JSON.stringify(manifest, null, 2), "utf8");
