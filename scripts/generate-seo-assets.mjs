// Emits robots.txt, sitemap.xml, and llms.txt into dist/. Generated from the
// same modules the app renders from, so they cannot describe a site that no
// longer exists. Runs after `vite build` and before the prerender step.

import { readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const dist = path.join(root, "dist");

const mod = await import(
  pathToFileURL(path.join(root, "dist-ssr", "entry-prerender.js")).href
);
const { ROUTES, SITE_URL, PROFILE, EXPERIENCE, EDUCATION, CERTIFICATIONS, EXPERTISE, POSTS, CASE_STUDIES } = mod;

const abs = (p) => `${SITE_URL}${p}`;
const today = new Date().toISOString().slice(0, 10);

/* ------------------------------------------------------------------ robots */

const robots = `# https://www.robotstxt.org/robotstxt.html
User-agent: *
Allow: /

# Answer and generative engines are welcome; the site is prerendered for them.
User-agent: GPTBot
Allow: /

User-agent: OAI-SearchBot
Allow: /

User-agent: ClaudeBot
Allow: /

User-agent: PerplexityBot
Allow: /

User-agent: Google-Extended
Allow: /

User-agent: Applebot-Extended
Allow: /

Sitemap: ${abs("/sitemap.xml")}
`;

/* ----------------------------------------------------------------- sitemap */

const urls = ROUTES.map(
  ({ path: p, lastmod, changefreq, priority }) => `  <url>
    <loc>${abs(p)}</loc>
    <lastmod>${lastmod ?? today}</lastmod>
    <changefreq>${changefreq}</changefreq>
    <priority>${priority.toFixed(1)}</priority>
  </url>`,
).join("\n");

const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls}
</urlset>
`;

/* ---------------------------------------------------------------- llms.txt */

const llms = `# ${PROFILE.name}

> ${EXPERIENCE.find((e) => e.current)?.role ?? PROFILE.role} at ${EXPERIENCE[0].company}, ${PROFILE.location}. ${PROFILE.summary}

Site: ${SITE_URL}
Contact: ${PROFILE.email}
LinkedIn: ${PROFILE.linkedin}
GitHub: ${PROFILE.github}

## Summary

${PROFILE.heroLead}

${PROFILE.aboutLead}

## Experience

${EXPERIENCE.map(
  (e) => `### ${e.role}, ${e.company} (${e.period}, ${e.location})

${e.summary}

${e.highlights.map((h) => `- ${h.value} ${h.label}`).join("\n")}

Stack: ${e.stack.join(", ")}`,
).join("\n\n")}

## Areas of work

${EXPERTISE.map((x) => `### ${x.title}\n\n${x.description}\n\nTools: ${x.tags.join(", ")}`).join("\n\n")}

## Case studies

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
).join("\n\n")}

## Writing

${POSTS.map(
  (p) => `### ${p.title}

${abs(`/blog/${p.slug}`)}

- Published: ${p.date}
- Category: ${p.category}
- Tags: ${p.tags.join(", ")}

${p.excerpt}`,
).join("\n\n")}

## Education

${EDUCATION.degree}, ${EDUCATION.school} (${EDUCATION.period})

Certifications: ${CERTIFICATIONS.join("; ")}

## Pages

${ROUTES.map(({ path: p }) => `- ${abs(p)}`).join("\n")}
`;

await writeFile(path.join(dist, "robots.txt"), robots, "utf8");
await writeFile(path.join(dist, "sitemap.xml"), sitemap, "utf8");
await writeFile(path.join(dist, "llms.txt"), llms, "utf8");

console.log("wrote robots.txt, sitemap.xml, llms.txt");
