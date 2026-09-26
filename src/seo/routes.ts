// The full route list, derived from the content itself. The sitemap, the
// prerender step, and llms.txt all read this, so adding a post or a case study
// is enough to get it crawled.

import { POSTS } from "@/data/posts";
import { CASE_STUDIES } from "@/data/caseStudies";

export type RouteEntry = {
  path: string;
  /** Sitemap hints. Detail pages carry the content's own date. */
  lastmod?: string;
  changefreq: "weekly" | "monthly" | "yearly";
  priority: number;
};

export const ROUTES: RouteEntry[] = [
  { path: "/", changefreq: "monthly", priority: 1.0 },
  { path: "/about", changefreq: "monthly", priority: 0.9 },
  { path: "/portfolio", changefreq: "monthly", priority: 0.9 },
  { path: "/blog", changefreq: "weekly", priority: 0.8 },
  { path: "/contact", changefreq: "yearly", priority: 0.7 },
  ...CASE_STUDIES.map((cs) => ({
    path: `/portfolio/${cs.slug}`,
    changefreq: "yearly" as const,
    priority: 0.8,
  })),
  ...POSTS.map((p) => ({
    path: `/blog/${p.slug}`,
    lastmod: p.updated ?? p.date,
    changefreq: "yearly" as const,
    priority: 0.7,
  })),
];
