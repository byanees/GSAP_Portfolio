// Portfolio page and case study page copy. The work itself is in
// caseStudies.ts, projects.ts, and diagrams.ts.

export const PORTFOLIO = {
    title: "What I've Built",
    lead: "A selection, not everything I have shipped. Case studies from fintech and enterprise platforms, and other projects, each picked because the outcome is measurable. Happy to walk through the rest.",
    count: (caseStudies: number, projects: number) => `${caseStudies} selected case studies, ${projects} projects`,
    tabs: {
        caseStudies: { label: "Case studies", hint: "Production systems, and how each one works" },
        projects: { label: "Projects", hint: "Platforms, products, and client builds" },
    },
    /** A project card's address bar, when the project has no domain or owner. */
    clientOwned: "Client-owned build",
    visit: "Visit",
    caseStudyLink: "Case study:",
    noPublicLink: "No public link, the client owns this one",
};

export const CASE_STUDY_PAGE = {
    notFound: "Case study not found",
    backToAll: "← Back to all work",
    notes: {
        eyebrow: "written up",
        title: "Read the engineering note",
    },
    back: "← All work",
    labels: {
        company: "Company",
        role: "Role",
        period: "Period",
        region: "Region",
        stack: "Stack",
    },
    howItWorks: "how it works",
    replayHint: "Pick a step to replay it",
    problemTitle: "The problem",
    builtTitle: "What I built",
};
