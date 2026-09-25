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

export function absoluteUrl(path: string) {
  if (path.startsWith("http")) return path;
  return `${SITE_URL}${path.startsWith("/") ? path : `/${path}`}`;
}

type RouteMeta = { title: string; description: string };

/** Static routes. Detail pages build their own meta from post/case-study data. */
export const ROUTE_META: Record<string, RouteMeta> = {
  "/": {
    title: "Muhammad Anees — Full Stack Engineer, .NET & Angular",
    description:
      "Full stack engineer in Islamabad building payment platforms and backend systems on .NET 9, ABP.io, and Angular. Request to Pay for 4,000+ merchants, telco agent apps for 60,000+ agents.",
  },
  "/about": {
    title: `About${TITLE_SUFFIX}`,
    description:
      "Three years across fintech and telecom: payment rails, schedulers, and the services behind them. Experience at Systems Limited, DPL, and Axontick, plus the stack and credentials behind it.",
  },
  "/portfolio": {
    title: `Work${TITLE_SUFFIX}`,
    description:
      "Case studies in payments and distributed systems: Request to Pay over app and USSD, a scheduler pushing 700-800k notifications per run, and Redis multiplexing and build-once releases for telco agent apps.",
  },
  "/blog": {
    title: `Notes${TITLE_SUFFIX}`,
    description:
      "Write-ups from production work on .NET, Redis, and payment systems, drawn from platforms running at real scale.",
  },
  "/contact": {
    title: `Contact${TITLE_SUFFIX}`,
    description:
      "Get in touch with Muhammad Anees, full stack engineer in Islamabad, Pakistan. Email, LinkedIn, GitHub, and Upwork.",
  },
};
