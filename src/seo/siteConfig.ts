// One source of truth for anything that needs an absolute URL or page-level
// copy: canonicals, Open Graph, the sitemap, robots.txt, and llms.txt all read
// from here so they can never drift apart. Names, numbers, and availability in
// the copy below come from src/data, so they change when the data does.
//
// Relative imports on purpose: vite.config.ts loads this file to fill in
// index.html and the web manifest, and it runs without the "@" alias.

import { AVAILABILITY } from "../data/availability";
import { METRICS } from "../data/metrics";
import { PROFILE } from "../data/profile";

/** The canonical origin. Everything absolute is built from it. No trailing slash. */
export const SITE_URL = "https://byanees.com";

export const SITE_NAME = PROFILE.name;

/** The installed-app card: the web manifest's name and description. */
export const APP_NAME = `${PROFILE.name} — ${PROFILE.role}`;
export const APP_DESCRIPTION = `Full stack engineer in ${PROFILE.city} building payment platforms and backend systems on .NET, ABP.io, and Angular.`;

/** IndexNow key. Public by design: the protocol proves ownership by serving
 *  it at /<key>.txt, which the build writes. Rotating it means changing only
 *  this value. */
export const INDEXNOW_KEY = "e83d30d0e95ddf98f44152b439cd9f65";

/** Fallback card for routes with no image of their own. Rename the file when
 *  the design changes: LinkedIn, WhatsApp, and X cache cards by URL, so an
 *  overwrite in place keeps showing the old one. */
export const OG_IMAGE = "/assets/imgs/og/og-card.png";

/** Titles read "<page> — Muhammad Anees" everywhere. The home page is the one
 *  exception: it leads with the role, because that is the query it answers. */
export const TITLE_SUFFIX = ` — ${PROFILE.name}`;

/** Google cuts a title off at roughly 60 characters. A long post title is worth
 *  more whole than with the name tacked on and then truncated, so the suffix
 *  only goes on when there is room for it. */
const TITLE_BUDGET = 60;

export function pageTitle(title: string) {
  return title.length + TITLE_SUFFIX.length <= TITLE_BUDGET ? `${title}${TITLE_SUFFIX}` : title;
}

export function absoluteUrl(path: string) {
  if (path.startsWith("http")) return path;
  return `${SITE_URL}${path.startsWith("/") ? path : `/${path}`}`;
}

type RouteMeta = { title: string; description: string };

/** Static routes. Detail pages build their own meta from post/case-study data. */
// Descriptions stay under ~155 characters, which is where Google truncates the
// snippet on desktop. Each one names the person, the role, and something only
// this page can answer, so it reads as a direct answer when quoted.
export const ROUTE_META: Record<string, RouteMeta> = {
  "/": {
    title: `${PROFILE.name} — ${PROFILE.role}, .NET & Angular`,
    description: `Full stack engineer in ${PROFILE.city} building payment platforms on .NET 9, ABP.io, and Angular: Request to Pay for ${METRICS.merchants} merchants, apps for ${METRICS.agents} agents.`,
  },
  "/about": {
    title: `About ${PROFILE.name} — ${PROFILE.role}`,
    description: `${PROFILE.name} is a full stack engineer with ${METRICS.years} years in fintech and telecom, at Systems Limited, DPL, and Axontick. Experience, stack, and credentials.`,
  },
  "/portfolio": {
    title: pageTitle("Case Studies in Payments & Backend"),
    description:
      "Case studies from payments and distributed systems: Request to Pay over app and USSD, 800k-notification runs, Redis multiplexing, and build-once releases.",
  },
  "/blog": {
    title: pageTitle("Notes on .NET, Redis & Payments"),
    description:
      "Engineering write-ups from production: idempotent payments, EMV QR encoding, Redis connection limits, bulk push scheduling, and CI/CD on .NET.",
  },
  "/contact": {
    title: `Contact ${PROFILE.name} — Hire a ${PROFILE.role}`,
    description: `Hire or contact ${PROFILE.name}, full stack .NET and Angular engineer in ${PROFILE.location}. ${AVAILABILITY.metaLine}`,
  },
};
