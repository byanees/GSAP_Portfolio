// One source of truth for anything that needs an absolute URL or page-level
// copy: canonicals, Open Graph, the sitemap, robots.txt, and llms.txt all read
// from here so they can never drift apart.

/** The canonical origin. Everything absolute is built from it. No trailing slash. */
export const SITE_URL = "https://byanees.com";

export const SITE_NAME = "Muhammad Anees";

/** Fallback card for routes with no image of their own. */
export const OG_IMAGE = "/assets/imgs/og/og-default.png";

/** Titles read "<page> — Muhammad Anees" everywhere. The home page is the one
 *  exception: it leads with the role, because that is the query it answers. */
export const TITLE_SUFFIX = " — Muhammad Anees";

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
    title: "Muhammad Anees — Full Stack Engineer, .NET & Angular",
    description:
      "Full stack engineer in Islamabad building payment platforms on .NET 9, ABP.io, and Angular: Request to Pay for 4,000+ merchants, apps for 60,000+ agents.",
  },
  "/about": {
    title: "About Muhammad Anees — Full Stack Engineer",
    description:
      "Muhammad Anees is a full stack engineer with 3+ years in fintech and telecom, at Systems Limited, DPL, and Axontick. Experience, stack, and credentials.",
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
    title: "Contact Muhammad Anees — Hire a Full Stack Engineer",
    description:
      "Hire or contact Muhammad Anees, full stack .NET and Angular engineer in Islamabad, Pakistan. Open to full-time, remote, and freelance work.",
  },
};
