// Emits robots.txt, sitemap.xml, rss.xml, llms.txt, and llms-full.txt into
// dist/. Generated from the same modules the app renders from, so they cannot
// describe a site that no longer exists. Runs after `vite build` and before the
// prerender step.

import { execFileSync } from "node:child_process";
import { writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const dist = path.join(root, "dist");

const mod = await import(
  pathToFileURL(path.join(root, "dist-ssr", "entry-prerender.js")).href
);
const { ROUTES, SITE_URL, PROFILE, EXPERIENCE, EDUCATION, CERTIFICATIONS, EXPERTISE, POSTS, CASE_STUDIES } = mod;

const abs = (p) => `${SITE_URL}${p}`;
const current = EXPERIENCE.find((e) => e.current) ?? EXPERIENCE[0];

/* ------------------------------------------------------------------ robots */

// Search, answer, and generative engines are all welcome: the site is
// prerendered so the ones that run no JavaScript still get every page. One
// group per purpose keeps the intent readable; the rules are the same.
const robots = `# https://www.robotstxt.org/robotstxt.html
User-agent: *
Allow: /

# AI search and answer engines, including their live-fetch agents.
User-agent: OAI-SearchBot
User-agent: ChatGPT-User
User-agent: Claude-SearchBot
User-agent: Claude-User
User-agent: PerplexityBot
User-agent: Perplexity-User
User-agent: DuckAssistBot
User-agent: MistralAI-User
Allow: /

# Model training crawlers.
User-agent: GPTBot
User-agent: ClaudeBot
User-agent: Google-Extended
User-agent: Applebot-Extended
User-agent: CCBot
User-agent: meta-externalagent
Allow: /

# Plain-text summaries for language models: ${abs("/llms.txt")}, ${abs("/llms-full.txt")}
Sitemap: ${abs("/sitemap.xml")}
`;

/* ----------------------------------------------------------------- sitemap */

/** Last commit date touching any of these files, as YYYY-MM-DD. Stamping every
 *  URL with the build date would tell Google the whole site changes on every
 *  deploy, and it learns to ignore lastmod altogether. Returns undefined when
 *  git history is unavailable, and the URL then goes out without a lastmod. */
function gitDate(files) {
  try {
    const out = execFileSync("git", ["log", "-1", "--format=%cs", "--", ...files], {
      cwd: root,
      encoding: "utf8",
      stdio: ["ignore", "pipe", "ignore"],
    }).trim();
    return out || undefined;
  } catch {
    return undefined;
  }
}

/** The data each static route is rendered from. */
const ROUTE_SOURCES = {
  "/": ["src/data/profile.ts", "src/data/caseStudies.ts", "src/data/recommendations.ts", "src/seo/siteConfig.ts"],
  "/about": ["src/data/profile.ts", "src/data/recommendations.ts"],
  "/portfolio": ["src/data/caseStudies.ts", "src/data/projects.ts"],
  "/contact": ["src/data/profile.ts"],
};

const newestPost = POSTS.map((p) => p.updated ?? p.date).sort().at(-1);

function lastmodFor({ path: p, lastmod }) {
  if (lastmod) return lastmod;
  if (p === "/blog") return newestPost;
  if (p.startsWith("/portfolio/")) return gitDate(["src/data/caseStudies.ts", "src/data/diagrams.ts"]);
  return ROUTE_SOURCES[p] ? gitDate(ROUTE_SOURCES[p]) : undefined;
}

const urls = ROUTES.map((route) => {
  const lastmod = lastmodFor(route);
  return `  <url>
    <loc>${abs(route.path)}</loc>${lastmod ? `\n    <lastmod>${lastmod}</lastmod>` : ""}
    <changefreq>${route.changefreq}</changefreq>
    <priority>${route.priority.toFixed(1)}</priority>
  </url>`;
}).join("\n");

const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls}
</urlset>
`;

/* --------------------------------------------------------------------- rss */

const xmlEscape = (s) =>
  s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");

/** Figure markers are placeholders the React page swaps for a diagram; in a
 *  feed or a text file they would be empty elements, so they go. */
const stripFigures = (html) => html.replace(/<figure data-figure="[^"]*"><\/figure>\s*/g, "");

const rfc822 = (date) => new Date(`${date}T09:00:00+05:00`).toUTCString();

const byNewest = [...POSTS].sort((a, b) => b.date.localeCompare(a.date));

const rss = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom" xmlns:content="http://purl.org/rss/1.0/modules/content/" xmlns:dc="http://purl.org/dc/elements/1.1/">
  <channel>
    <title>${xmlEscape(`${PROFILE.name} — Notes`)}</title>
    <link>${abs("/blog")}</link>
    <atom:link href="${abs("/rss.xml")}" rel="self" type="application/rss+xml" />
    <description>Engineering write-ups from production work on .NET, Redis, and payment systems.</description>
    <language>en</language>
    <lastBuildDate>${rfc822(newestPost)}</lastBuildDate>
${byNewest
  .map(
    (p) => `    <item>
      <title>${xmlEscape(p.title)}</title>
      <link>${abs(`/blog/${p.slug}`)}</link>
      <guid isPermaLink="true">${abs(`/blog/${p.slug}`)}</guid>
      <pubDate>${rfc822(p.date)}</pubDate>
      <dc:creator>${xmlEscape(PROFILE.name)}</dc:creator>
      <category>${xmlEscape(p.category)}</category>
${p.tags.map((t) => `      <category>${xmlEscape(t)}</category>`).join("\n")}
      <description>${xmlEscape(p.excerpt)}</description>
      <content:encoded><![CDATA[${stripFigures(p.bodyHtml).trim().replace(/]]>/g, "]]]]><![CDATA[>")}]]></content:encoded>
    </item>`,
  )
  .join("\n")}
  </channel>
</rss>
`;

/* ---------------------------------------------------------------- llms.txt */

const decode = (s) =>
  s
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#x27;|&#39;/g, "'")
    .replace(/&amp;/g, "&");

/** Post bodies use a small, known set of tags, so a targeted conversion is
 *  enough to turn them into Markdown a language model reads cleanly. Headings
 *  drop two levels to sit under the post's own "###" title. */
function htmlToMarkdown(html) {
  const inline = (s) =>
    decode(
      s
        .replace(/<strong>([\s\S]*?)<\/strong>/g, "**$1**")
        .replace(/<em>([\s\S]*?)<\/em>/g, "*$1*")
        .replace(/<code>([\s\S]*?)<\/code>/g, "`$1`")
        .replace(/<a [^>]*href="([^"]*)"[^>]*>([\s\S]*?)<\/a>/g, "[$2]($1)")
        .replace(/<[^>]+>/g, "")
        .replace(/\s+/g, " ")
        .trim(),
    );

  const blocks = [];
  const re = /<pre><code>([\s\S]*?)<\/code><\/pre>|<h([23])[^>]*>([\s\S]*?)<\/h\2>|<ul>([\s\S]*?)<\/ul>|<p>([\s\S]*?)<\/p>/g;
  for (const m of stripFigures(html).matchAll(re)) {
    if (m[1] !== undefined) blocks.push("```\n" + decode(m[1]).replace(/\n+$/, "") + "\n```");
    else if (m[3] !== undefined) blocks.push(`${"#".repeat(Number(m[2]) + 2)} ${inline(m[3])}`);
    else if (m[4] !== undefined)
      blocks.push([...m[4].matchAll(/<li>([\s\S]*?)<\/li>/g)].map((li) => `- ${inline(li[1])}`).join("\n"));
    else if (m[5] !== undefined) blocks.push(inline(m[5]));
  }
  return blocks.join("\n\n");
}

/** Short, self-contained answers to the questions people ask an assistant
 *  about a person. Every fact comes from the site's own data. */
const faq = [
  [
    `Who is ${PROFILE.name}?`,
    `${PROFILE.name} is a ${current.role.toLowerCase()} at ${current.company} in ${PROFILE.location}, with 3+ years building fintech, telecom, and enterprise platforms. ${PROFILE.summary}`,
  ],
  [
    `What technologies does ${PROFILE.shortName} work with?`,
    EXPERTISE.map((x) => `${x.title}: ${x.tags.join(", ")}.`).join(" "),
  ],
  [
    `What has ${PROFILE.shortName} built?`,
    CASE_STUDIES.map((c) => `${c.title} (${c.company}): ${c.summary}`).join(" "),
  ],
  [
    `Is ${PROFILE.shortName} available for hire?`,
    `Yes: open to full-time full stack or backend roles, fully remote or with relocation (visa sponsorship needed), and to freelance or contract work through Upwork or directly. Contact: ${PROFILE.email}, ${abs("/contact")}.`,
  ],
  [`Where is ${PROFILE.shortName} based?`, `${PROFILE.location}, ${PROFILE.timezone}.`],
];

const header = `# ${PROFILE.name}

> ${current.role} at ${current.company}, ${PROFILE.location}. ${PROFILE.summary}

Site: ${SITE_URL}
Contact: ${PROFILE.email}
LinkedIn: ${PROFILE.linkedin}
GitHub: ${PROFILE.github}
Upwork: ${PROFILE.upwork}
CV: ${abs(PROFILE.cvUrl)}

## Summary

${PROFILE.heroLead}

${PROFILE.aboutLead}

## Frequently asked

${faq.map(([q, a]) => `### ${q}\n\n${a}`).join("\n\n")}`;

const experience = `## Experience

${EXPERIENCE.map(
  (e) => `### ${e.role}, ${e.company} (${e.period}, ${e.location})

${e.summary}

${e.highlights.map((h) => `- ${h.value} ${h.label}`).join("\n")}

Stack: ${e.stack.join(", ")}`,
).join("\n\n")}

## Areas of work

${EXPERTISE.map((x) => `### ${x.title}\n\n${x.description}\n\nTools: ${x.tags.join(", ")}`).join("\n\n")}`;

const caseStudies = `## Case studies

${CASE_STUDIES.map(
  (c) => `### ${c.title}

${abs(`/portfolio/${c.slug}`)}

- Domain: ${c.domain}
- Company: ${c.company}${c.region ? `\n- Region: ${c.region}` : ""}
- Role: ${c.role}
- Period: ${c.period}

${c.summary}

Problem: ${c.problem}

Built:
${c.built.map((b) => `- ${b}`).join("\n")}

Results:
${c.results.map((r) => `- ${r.value} ${r.label}`).join("\n")}

Stack: ${c.stack.join(", ")}`,
).join("\n\n")}`;

const education = `## Education

${EDUCATION.degree}, ${EDUCATION.school} (${EDUCATION.period})

Certifications: ${CERTIFICATIONS.join("; ")}`;

const postMeta = (p) => `${abs(`/blog/${p.slug}`)}

- Author: ${PROFILE.name}
- Published: ${p.date}${p.updated ? `\n- Updated: ${p.updated}` : ""}
- Category: ${p.category}
- Tags: ${p.tags.join(", ")}`;

const llms = `${header}

${experience}

${caseStudies}

## Writing

Full text of every post: ${abs("/llms-full.txt")}

${byNewest.map((p) => `### ${p.title}\n\n${postMeta(p)}\n\n${p.excerpt}`).join("\n\n")}

${education}

## Pages

${ROUTES.map(({ path: p }) => `- ${abs(p)}`).join("\n")}
- ${abs("/rss.xml")} (RSS feed of the notes)
`;

// The long form: the same document with every post in full, for engines that
// would rather read one file than crawl eighteen pages.
const llmsFull = `${header}

${experience}

${caseStudies}

## Writing

${byNewest.map((p) => `### ${p.title}\n\n${postMeta(p)}\n\n${htmlToMarkdown(p.bodyHtml)}`).join("\n\n---\n\n")}

${education}
`;

await writeFile(path.join(dist, "robots.txt"), robots, "utf8");
await writeFile(path.join(dist, "sitemap.xml"), sitemap, "utf8");
await writeFile(path.join(dist, "rss.xml"), rss, "utf8");
await writeFile(path.join(dist, "llms.txt"), llms, "utf8");
await writeFile(path.join(dist, "llms-full.txt"), llmsFull, "utf8");

console.log("wrote robots.txt, sitemap.xml, rss.xml, llms.txt, llms-full.txt");
