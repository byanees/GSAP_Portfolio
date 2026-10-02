// Blog index and post page copy. The posts themselves are in posts.ts.

import { CTA } from "../navigation";
import { PROFILE } from "../profile";

export const BLOG = {
    /** Also the Blog's name in the structured data. */
    title: "Notes from building systems",
    intro:
        "Short engineering write-ups from production work on .NET, ABP.io, Redis, and payment systems: idempotent Request to Pay flows, Redis connection pool exhaustion, EMV QR TLV encoding, bulk push notification scheduling, and CI/CD that promotes one image from UAT to production. Each note ties back to a case study on the work page.",
    lead: "Backend, payments, and scaling lessons from production work, each with a figure that shows the idea at a glance.",
    count: (notes: number, topics: number) => `${notes} notes, ${topics} topics`,
    linkedinCta: "LinkedIn Updates",
    /** The filter that shows every topic. */
    allTopics: "All",
    /** The closing section. */
    cta: {
        eyebrow: "keep in touch",
        title: "New notes go up here first, then on LinkedIn.",
        lead: "Short write-ups on problems I run into while building payment and backend systems. Follow along, or tell me what you'd like me to write about next.",
        links: [
            { label: "Follow on LinkedIn", href: PROFILE.linkedin, external: true },
            { label: "Suggest a topic", href: "/contact" },
            { label: CTA.viewCaseStudies, href: "/portfolio" },
        ],
    },
};

export const POST_PAGE = {
    notFound: "Post not found",
    backToBlog: "← Back to the blog",
    back: "← All notes",
    tagsLabel: "Filed under",
    writtenBy: "Written by",
    tocTitle: "On this page",
    latestBadge: "Latest note",
    related: {
        eyebrow: "the project behind it",
        title: "Read the case study",
    },
    next: {
        eyebrow: "keep reading",
        title: "More notes",
        cta: "All notes",
    },
};
