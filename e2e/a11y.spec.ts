// Automated accessibility checks (axe-core, WCAG 2.1 A and AA). Fails on
// serious and critical violations; lesser ones are attached to the report.

import AxeBuilder from "@axe-core/playwright";
import { expect, settle, sitemapPaths, test } from "./helpers";

// One of each page type: the section pages, a case study, and a post.
const paths = (() => {
  const all = sitemapPaths();
  const pick = (prefix: string) => all.find((p) => p.startsWith(prefix) && p !== prefix.slice(0, -1));
  return ["/", "/about", "/portfolio", "/blog", "/contact", pick("/portfolio/")!, pick("/blog/")!];
})();

for (const path of paths) {
  test(`${path} has no serious accessibility violations`, async ({ page }, testInfo) => {
    await page.goto(path);
    await settle(page);
    const results = await new AxeBuilder({ page }).withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa"]).analyze();

    const summary = results.violations.map((v) => ({
      id: v.id,
      impact: v.impact,
      help: v.help,
      nodes: v.nodes.length,
      targets: v.nodes.slice(0, 5).map((n) => n.target.join(" ")),
    }));
    await testInfo.attach("axe-violations.json", { body: JSON.stringify(summary, null, 2), contentType: "application/json" });

    const blocking = summary.filter((v) => v.impact === "serious" || v.impact === "critical");
    expect(blocking, JSON.stringify(blocking, null, 2)).toEqual([]);
  });
}
