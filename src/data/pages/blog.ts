// Blog index and post page copy. The posts themselves are in posts.ts.

import { CTA } from "../navigation";
import { PROFILE } from "../profile";

export const BLOG = {
    /** Also the Blog's name in the structured data. */
    title: "Notes from building systems",
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
    next: {
        eyebrow: "keep reading",
        title: "More notes",
        cta: "All notes",
    },
};
