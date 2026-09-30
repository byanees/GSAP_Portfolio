// 404 page copy. The list of pages is PAGES; this only says what is on each.

export const NOT_FOUND = {
    title: "Page not found",
    description: "That page doesn't exist. Here's everything that does.",
    eyebrow: "404 error",
    heading: "This page doesn't exist.",
    lead: "Either the link is broken or the page moved when I rebuilt the site. Nothing is lost, and everything this site holds is one click below.",
    linksLabel: "Where you probably meant to go",
    /** Why someone would pick each page, by path. */
    destinations: {
        "/": "The short version: what I build, and what it runs in production.",
        "/about": "Experience, the stack I work in, and how I approach a system.",
        "/portfolio": "Case studies: Request to Pay, the bulk notification scheduler, Redis multiplexing, and more.",
        "/blog": "Notes on backend work, payments, and .NET, written while building.",
        "/contact": "Email, LinkedIn, and what I'm currently open to.",
    } as Record<string, string>,
    home: "Back to home",
    report: {
        label: "Tell me what broke",
        subject: "Broken link on your site",
        body: (path: string) => `I hit a 404 at: ${path}\n\nI got there from: `,
    },
};
