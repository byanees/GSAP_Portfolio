// Contact page copy. Every detail in "Direct lines" is read from PROFILE, and
// the status line from AVAILABILITY.

import { AVAILABILITY } from "../availability";
import { CTA } from "../navigation";
import { PROFILE } from "../profile";

/** "in/handle", derived rather than typed, so it cannot disagree with the link. */
const LINKEDIN_HANDLE = `in/${PROFILE.linkedin.replace(/\/+$/, "").split("/").pop()}`;

const REPLY_TIME = "I reply within 24 hours";

export const CONTACT = {
    title: "Contact",
    /** One entry per line. */
    lead: [
        "Payment platform, enterprise system, or a backend that needs untangling.",
        "Tell me what you're building and I'll tell you how I can help.",
    ],
    detailsTitle: "Direct lines",
    details: [
        { label: "Email", value: PROFILE.email, href: `mailto:${PROFILE.email}` },
        { label: "Phone", value: PROFILE.phone, href: PROFILE.phoneHref },
        { label: "WhatsApp", value: CTA.whatsapp, href: PROFILE.whatsapp },
        { label: "LinkedIn", value: LINKEDIN_HANDLE, href: PROFILE.linkedin },
        { label: "Upwork", value: CTA.hireOnUpwork, href: PROFILE.upwork },
        { label: "Based in", value: `${PROFILE.location} (${PROFILE.timezoneAbbr}, ${PROFILE.utcOffset})` },
        { label: "Open to", value: AVAILABILITY.contactSummary },
    ] as { label: string; value: string; href?: string }[],

    formTitle: "Write me a note",
    /** What a visitor can tick under "I'm reaching out about". */
    topics: [
        "Backend & APIs",
        "Fintech & Payments",
        "Full Stack Product",
        "Angular / React",
        "Cloud & DevOps",
        "A full-time role",
    ],
    /** The form reads as a letter; these are the words between the blanks. */
    letter: {
        greeting: `Hi ${PROFILE.shortName}, my name is`,
        company: "and I work at",
        topic: "I'm reaching out about",
        email: "You can reply to me at",
        message: "Here's what I have in mind:",
        placeholders: {
            name: "your name",
            company: "company, optional",
            email: "you@company.com",
            message: "What you’re building, where it’s stuck, and the timeline you’re working with…",
        },
    },
    submit: "Send message",
    sending: "Sending…",
    /** The line beside the button, shown in brackets. */
    status: {
        idle: `Goes straight to my inbox. ${REPLY_TIME}`,
        sending: "Sending…",
        invalid: "Check the highlighted fields above",
    },
    sent: {
        title: "Message sent.",
        text: `It's in my inbox and ${REPLY_TIME}, usually sooner. If it's urgent,`,
        link: "email me directly",
        again: "Send another message",
    },
    /** Under the form. The link text is CTA.viewCaseStudies. */
    skipForm: {
        before: "Prefer to skip the form?",
        after: "first.",
    },
};
