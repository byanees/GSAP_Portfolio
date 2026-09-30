// About page copy, including the FAQ. The opening line is PROFILE.aboutLead and
// the summary is PROFILE.summary; experience, stack, and credentials are in
// profile.ts. The FAQ is also published as FAQPage structured data.

import { AVAILABILITY } from "../availability";
import { METRICS } from "../metrics";
import { PROFILE } from "../profile";

export type FaqItem = { question: string; answer: string };

/** Shown on the About page, and sent to search and answer engines as FAQPage
 *  structured data. Plain text only: the same string goes into both. */
export const FAQ: FaqItem[] = [
    {
        question: "What technologies do you specialize in?",
        answer: ".NET 9 and ABP.io on the backend, Angular and React on the frontend, and Docker, Kubernetes, and AWS for infrastructure, with most of my work in fintech and telecom payment systems.",
    },
    {
        question: "What kind of projects have you worked on?",
        answer: `Telco agent apps serving ${METRICS.agents} agents across Tanzania, Request to Pay adopted by ${METRICS.merchants} merchants, EMV QR payments, an enterprise certificate workflow, and earlier client products like an AI assistant and a Dubai property platform.`,
    },
    {
        question: "Do you work with AI tools?",
        answer: "Yes. AI-assisted development with tools like Cursor and Claude is part of my daily workflow, and it helps me move faster on day-to-day development.",
    },
    {
        question: "Are you available for new opportunities?",
        answer: AVAILABILITY.faq.roles,
    },
    {
        question: "Can you handle both frontend and backend?",
        answer: "Yes. I build Angular micro-frontends and React apps on the frontend and .NET microservices on the backend, and I've shipped features end to end across both.",
    },
    {
        question: "Do you take freelance or contract work?",
        answer: AVAILABILITY.faq.freelance,
    },
];

export const ABOUT = {
    hero: {
        title: "About Me",
    },
    portrait: {
        localTimeLabel: "Local time",
        currentlyLabel: "Currently",
    },
    /** The scrolling strip under the hero. */
    ticker: {
        label: "Technologies I work with",
        items: [
            ".NET 9",
            "ABP.io",
            "Microservices",
            "Angular",
            "React",
            "TypeScript",
            "PostgreSQL",
            "Redis",
            "Docker",
            "Kubernetes",
            "AWS",
            "Clean Architecture",
            "Domain-Driven Design",
            "EMV QR",
        ],
    },
    experience: {
        eyebrow: "my journey",
        title: "Experience",
        lead: `Building fintech, telecom, and enterprise systems since ${PROFILE.since}.`,
        currentBadge: "Current role",
        stackLabel: "Worked with",
    },
    stack: {
        eyebrow: "my stack",
        title: "From the screen to the server, what I use at every layer",
        intro: "Follow a request down through the systems I build. Hover a layer to see where it shows up in my work.",
        usedInLabel: "Shows up in",
        /** For a layer no single case study is about. */
        everywhereLabel: "Behind",
        everywhere: "every project I ship",
        principlesLabel: "Holding it together",
    },
    credentials: {
        title: "Education & credentials",
        lead: "Computer science degree, plus the security certifications that matter when you work on payment systems.",
        courseworkLabel: "Coursework",
        certificationsTitle: "Certifications",
        languagesTitle: "Languages",
    },
    /** The cards themselves are AVAILABILITY.fullTime and AVAILABILITY.freelance. */
    workWithMe: {
        eyebrow: "two ways to work together",
        title: "Hire me full-time, or bring me in for a project",
    },
    faq: {
        eyebrow: "FAQ",
        /** One entry per line. */
        title: ["Frequently", "Asked Questions"],
        lead: ["Your questions about my experience, skills,", "and availability, answered."],
    },
};
