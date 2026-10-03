// JSON-LD builders. Everything here is derived from src/data, so the structured
// data and the visible page always describe the same facts.

import { SITE_NAME, SITE_URL, absoluteUrl, OG_IMAGE } from "./siteConfig";
import { PROFILE, EXPERIENCE, EDUCATION, CERTIFICATIONS, EXPERTISE, LANGUAGES, STACK_LAYERS } from "@/data/profile";
import { crumbFor } from "@/data/navigation";
import { BLOG } from "@/data/pages/blog";
import type { FaqItem } from "@/data/pages/about";
import { POSTS, type Post } from "@/data/posts";
import { CASE_STUDIES, type CaseStudy } from "@/data/caseStudies";

/** Stable @id so every graph node points at one Person, not five copies. */
export const PERSON_ID = `${SITE_URL}/#person`;
const WEBSITE_ID = `${SITE_URL}/#website`;
const BLOG_ID = `${SITE_URL}/blog#blog`;
const PORTFOLIO_ID = `${SITE_URL}/portfolio#collection`;

/** Topics, taken from the expertise tags and stack layers rather than guessed. */
function knowsAbout() {
  const fromExpertise = EXPERTISE.flatMap((e) => e.tags);
  const fromStack = STACK_LAYERS.flatMap((l) => l.items);
  return Array.from(new Set([...fromExpertise, ...fromStack]));
}

export function personSchema() {
  const current = EXPERIENCE.find((e) => e.current) ?? EXPERIENCE[0];
  return {
    "@type": "Person",
    "@id": PERSON_ID,
    name: PROFILE.name,
    alternateName: PROFILE.shortName,
    url: SITE_URL,
    image: {
      "@type": "ImageObject",
      "@id": `${SITE_URL}/#headshot`,
      url: absoluteUrl(PROFILE.headshot),
      contentUrl: absoluteUrl(PROFILE.headshot),
      width: 800,
      height: 800,
      caption: PROFILE.name,
    },
    jobTitle: current.role,
    description: PROFILE.summary,
    email: `mailto:${PROFILE.email}`,
    telephone: PROFILE.phone,
    address: {
      "@type": "PostalAddress",
      addressLocality: PROFILE.city,
      addressCountry: PROFILE.countryCode,
    },
    worksFor: {
      "@type": "Organization",
      name: current.company,
    },
    alumniOf: {
      "@type": "CollegeOrUniversity",
      name: EDUCATION.school,
    },
    hasCredential: CERTIFICATIONS.map((name) => ({
      "@type": "EducationalOccupationalCredential",
      name,
    })),
    hasOccupation: {
      "@type": "Occupation",
      name: PROFILE.role,
      occupationLocation: { "@type": "City", name: PROFILE.city },
      skills: knowsAbout().join(", "),
    },
    knowsAbout: knowsAbout(),
    knowsLanguage: LANGUAGES.map((l) => l.name),
    // sameAs: [PROFILE.linkedin, PROFILE.github, PROFILE.upwork],
    sameAs: [PROFILE.linkedin, PROFILE.github],
  };
}

export function websiteSchema() {
  return {
    "@type": "WebSite",
    "@id": WEBSITE_ID,
    url: SITE_URL,
    name: SITE_NAME,
    inLanguage: "en",
    publisher: { "@id": PERSON_ID },
  };
}

/** Trail for a deep page. Pass the crumbs in order, excluding Home. */
export function breadcrumbSchema(crumbs: { name: string; path: string }[]) {
  return {
    "@type": "BreadcrumbList",
    itemListElement: [{ name: crumbFor("/"), path: "/" }, ...crumbs].map((c, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: c.name,
      item: absoluteUrl(c.path),
    })),
  };
}

/** Posts carry a date but no time. Google's Rich Results Test flags a bare
 *  date as an incomplete datetime, so anchor it to the timezone the posts were
 *  written in. */
function isoDateTime(date: string) {
  return `${date}T09:00:00+05:00`;
}

/** Words in a post body, for BlogPosting.wordCount. */
function wordCount(html: string) {
  return html.replace(/<[^>]+>/g, " ").split(/\s+/).filter(Boolean).length;
}

export function blogPostingSchema(post: Post) {
  const url = absoluteUrl(`/blog/${post.slug}`);
  return {
    "@type": "BlogPosting",
    "@id": `${url}#post`,
    headline: post.title,
    description: post.excerpt,
    url,
    mainEntityOfPage: url,
    datePublished: isoDateTime(post.date),
    dateModified: isoDateTime(post.updated ?? post.date),
    articleSection: post.category,
    keywords: post.tags.join(", "),
    wordCount: wordCount(post.bodyHtml),
    timeRequired: `PT${parseInt(post.readTime, 10) || 5}M`,
    inLanguage: "en",
    image: absoluteUrl(OG_IMAGE),
    isPartOf: { "@id": BLOG_ID },
    author: { "@id": PERSON_ID },
    publisher: { "@id": PERSON_ID },
  };
}

/** "2024 - 2026" becomes the ISO 8601 interval "2024/2026"; an open-ended
 *  "2026 - Present" becomes "2026/..". */
function temporalCoverage(period: string) {
  const [from, to] = period.split("-").map((p) => p.trim());
  return `${from}/${!to || /present/i.test(to) ? ".." : to}`;
}

export function caseStudySchema(cs: CaseStudy) {
  const url = absoluteUrl(`/portfolio/${cs.slug}`);
  return {
    "@type": "CreativeWork",
    "@id": `${url}#work`,
    name: cs.title,
    headline: cs.title,
    description: cs.summary,
    url,
    mainEntityOfPage: url,
    inLanguage: "en",
    genre: cs.domain,
    keywords: cs.stack.join(", "),
    temporalCoverage: temporalCoverage(cs.period),
    image: absoluteUrl(OG_IMAGE),
    isPartOf: { "@id": PORTFOLIO_ID },
    author: { "@id": PERSON_ID },
    creator: { "@id": PERSON_ID },
    sourceOrganization: { "@type": "Organization", name: cs.company },
  };
}

/** The home page. Its main entity is the Person, which is what someone
 *  searching the name is looking for. */
export function homePageSchema(description: string) {
  return {
    "@type": "WebPage",
    "@id": `${SITE_URL}/#webpage`,
    url: absoluteUrl("/"),
    name: SITE_NAME,
    description,
    inLanguage: "en",
    isPartOf: { "@id": WEBSITE_ID },
    about: { "@id": PERSON_ID },
    mainEntity: { "@id": PERSON_ID },
    primaryImageOfPage: absoluteUrl(OG_IMAGE),
  };
}

/** The About page, as a profile of the Person rather than a generic WebPage. */
export function profilePageSchema() {
  return {
    "@type": "ProfilePage",
    "@id": `${SITE_URL}/about#profile`,
    url: absoluteUrl("/about"),
    name: `About ${PROFILE.name}`,
    inLanguage: "en",
    mainEntity: { "@id": PERSON_ID },
    isPartOf: { "@id": WEBSITE_ID },
    // The FAQ at the foot of the page, published as its own FAQPage node.
    hasPart: { "@id": `${SITE_URL}/about#faq` },
  };
}

export function contactPageSchema() {
  return {
    "@type": "ContactPage",
    "@id": `${SITE_URL}/contact#contact`,
    url: absoluteUrl("/contact"),
    name: `Contact ${PROFILE.name}`,
    inLanguage: "en",
    mainEntity: { "@id": PERSON_ID },
    isPartOf: { "@id": WEBSITE_ID },
  };
}

/** Questions and answers shown on a page, for answer engines. The same strings
 *  the page renders, so the markup never claims what the page does not say. */
export function faqPageSchema(path: string, items: FaqItem[]) {
  return {
    "@type": "FAQPage",
    "@id": `${absoluteUrl(path)}#faq`,
    url: absoluteUrl(path),
    inLanguage: "en",
    isPartOf: { "@id": WEBSITE_ID },
    about: { "@id": PERSON_ID },
    mainEntity: items.map((item) => ({
      "@type": "Question",
      name: item.question,
      acceptedAnswer: { "@type": "Answer", text: item.answer },
    })),
  };
}

/** Wraps page nodes in a single @graph. The Person and WebSite nodes go in on
 *  every page, because nodes elsewhere in the graph reference them by @id and a
 *  crawler only ever sees one page at a time: without them, `author` and
 *  `publisher` resolve to nothing. */
export function graph(...nodes: object[]) {
  return {
    "@context": "https://schema.org",
    "@graph": [personSchema(), websiteSchema(), ...nodes],
  };
}

/** The work index as an ordered list, so an answer engine can enumerate the
 *  case studies without following every link. */
export function portfolioListSchema() {
  return {
    "@type": "CollectionPage",
    "@id": PORTFOLIO_ID,
    url: absoluteUrl("/portfolio"),
    name: crumbFor("/portfolio"),
    inLanguage: "en",
    isPartOf: { "@id": WEBSITE_ID },
    about: { "@id": PERSON_ID },
    mainEntity: {
      "@type": "ItemList",
      itemListElement: CASE_STUDIES.map((cs, i) => ({
        "@type": "ListItem",
        position: i + 1,
        name: cs.title,
        url: absoluteUrl(`/portfolio/${cs.slug}`),
      })),
    },
  };
}

/** Same idea for the writing index. */
export function blogListSchema() {
  return {
    "@type": "Blog",
    "@id": BLOG_ID,
    url: absoluteUrl("/blog"),
    name: BLOG.title,
    inLanguage: "en",
    isPartOf: { "@id": WEBSITE_ID },
    author: { "@id": PERSON_ID },
    blogPost: POSTS.map((p) => ({
      "@type": "BlogPosting",
      headline: p.title,
      description: p.excerpt,
      url: absoluteUrl(`/blog/${p.slug}`),
      datePublished: isoDateTime(p.date),
      author: { "@id": PERSON_ID },
    })),
  };
}
