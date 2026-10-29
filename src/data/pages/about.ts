// About page copy, including the FAQ. The opening line is PROFILE.aboutLead and
// the summary is PROFILE.summary; experience, stack, and credentials are in
// profile.ts. The FAQ is also published as FAQPage structured data.

import { AVAILABILITY } from "../availability";
import { METRICS } from "../metrics";
import { PROFILE } from "../profile";
import type { ToolIconKey } from "@/shared/sections/dev/toolIcons";

export type FaqItem = { question: string; answer: string };

/** Shown on the About page, and sent to search and answer engines as FAQPage
 *  structured data. Plain text only: the same string goes into both. */
export const FAQ: FaqItem[] = [
    {
        question: "What is your current role?",
        answer: `I'm a ${PROFILE.role} at Systems Limited. In practice that's full stack software engineering with product ownership: .NET 9 and ABP.io services on the backend, Angular micro-frontends on the front, and features carried from the API contract to the dashboard and through go-live.`,
    },
    {
        question: "What technologies do you specialize in?",
        answer: ".NET 9 and ABP.io on the backend, Angular and React on the frontend, and Docker, Kubernetes, and AWS for infrastructure, with most of my work in fintech, telecom, and government platforms.",
    },
    {
        question: "What kind of projects have you worked on?",
        answer: `Enterprise platforms with 10+ government and third-party integrations, telco agent apps serving ${METRICS.agents} agents across Tanzania, Request to Pay adopted by ${METRICS.merchants} merchants, EMV QR payments, and earlier client products like an AI assistant and a Dubai property platform.`,
    },
    {
        question: "Do you work with AI tools?",
        answer: "Yes, every day: I'm an AI-native engineer. I work in a multi-agent Cursor workflow, with orchestrator, backend, frontend, code-review, and security agents, and write structured prompts with file-scoped context and explicit acceptance criteria. I also use agents for root-cause analysis on production incidents.",
    },
    {
        question: "Are you available for new opportunities?",
        answer: AVAILABILITY.faq.roles,
    },
    {
        question: "Can you handle both frontend and backend?",
        answer: "Yes. I build Angular micro-frontends and React apps on the frontend and .NET microservices on the backend, and I've shipped features end to end across both.",
    },
    // {
    //     question: "Do you take freelance or contract work?",
    //     answer: AVAILABILITY.faq.freelance,
    // },
];

export const ABOUT = {
    hero: {
        title: "About Me",
    },
    portrait: {
        localTimeLabel: "Local time",
        currentlyLabel: "Currently",
    },
    /** The two scrolling rails under the hero. `tools` are keys into
     *  TOOL_ICONS (src/shared/sections/dev/toolIcons.ts), which holds each
     *  tool's display name and brand mark. */
    ticker: {
        label: "Technologies I work with",
        pauseLabel: "Pause",
        playLabel: "Play",
        tools: [
            "dotnet",
            "angular",
            "react",
            "typescript",
            "nextjs",
            "nodejs",
            "nestjs",
            "postgresql",
            "sqlserver",
            "redis",
            "mongodb",
            "rabbitmq",
            "docker",
            "kubernetes",
            "aws",
            "githubactions",
            "nginx",
        ] satisfies ToolIconKey[],
        practices: [
            "ABP.io",
            "Microservices",
            "Micro-frontends",
            "Clean Architecture",
            "Domain-Driven Design",
            "EMV QR",
            "REST & GraphQL",
            "Multi-agent AI workflows",
        ],
    },
    /** Each role is a card in a deck, newest on top. */
    experience: {
        eyebrow: "my journey",
        title: "Experience",
        lead: `Building fintech, telecom, and government systems since ${PROFILE.since}.`,
        stackLabel: "Worked with",
        impactLabel: "Impact",
        moreLabel: "View details",
        closeLabel: "Close details",
        deckLabel: "Roles, newest first",
        indexLabel: "Jump to a role",
        prevLabel: "Newer role",
        nextLabel: "Older role",
    },
    /** The stack as one sentence; each tool group opens a note with the rest of its layer. */
    stack: {
        eyebrow: "my stack",
        title: "The whole stack, in one sentence",
        intro: "Pick a highlighted tool to see the rest of that layer, and where it shows up in my work.",
        moreLabel: (n: number, layer: string) => `${n} more in ${layer}`,
        toolsLabel: "Everything in this layer",
        usedInLabel: "Shows up in",
        /** For a layer no single case study is about. */
        everywhere: "Every project I ship",
        principlesLabel: "Held together by",
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
        // eyebrow: "two ways to work together",
        // title: "Hire me full-time, or bring me in for a project",
        eyebrow: "work together",
        title: "Hire me full-time",
    },
    faq: {
        eyebrow: "FAQ",
        /** One entry per line. */
        title: ["Frequently", "Asked Questions"],
        lead: ["Your questions about my experience, skills,", "and availability, answered."],
    },
};
