// Content for the alternative versions of the About page stack section, under
// review in ?stack=trace and ?stack=problems. Whichever version isn't picked
// goes, along with its part of this file.

/** B: one request as a tracing tool would draw it. Timings are illustrative. */
export const STACK_TRACE = {
    eyebrow: "my stack",
    title: "One request, traced through my stack",
    intro: "A request on the visa platform, drawn the way a tracing tool shows it. Every span is a layer I build.",
    request: { method: "POST", path: "/api/visa/applications", status: "201 Created" },
    totalMs: 184,
    spanLabel: "Span",
    /** depth is the nesting level; start and ms are in milliseconds. */
    spans: [
        { name: "browser", tools: ["Angular", "React", "TypeScript"], depth: 0, start: 0, ms: 184 },
        { name: "gateway", tools: ["Nginx", "Kubernetes", "AWS"], depth: 1, start: 8, ms: 168 },
        { name: "visa-service", tools: [".NET 9", "ABP.io", "REST"], depth: 2, start: 14, ms: 154 },
        { name: "cache", tools: ["Redis"], depth: 3, start: 20, ms: 6 },
        { name: "database", tools: ["PostgreSQL", "EF Core"], depth: 3, start: 30, ms: 62 },
        { name: "notify-service", tools: ["NestJS", "GraphQL"], depth: 3, start: 96, ms: 54 },
        { name: "queue", tools: ["AWS SQS"], depth: 3, start: 152, ms: 8 },
    ],
    /** What sits around the request rather than in it. */
    around: [
        { label: "Shipped by", tools: ["GitHub Actions", "Jenkins", "Docker"] },
        { label: "Watched in", tools: ["ELK"] },
        { label: "Also in the toolbox", tools: ["Next.js", "Micro-frontends", "Redux Toolkit", "Tailwind CSS", "WebSockets", "WSO2"] },
    ],
};

/** C: pick a problem, see the system I built for it and what it took. */
export const STACK_PROBLEMS = {
    eyebrow: "my stack",
    title: "Name the problem, I'll show you the tools",
    intro: "Pick something you need built. Each one is a system I've shipped, with the stack it took.",
    builtWithLabel: "Built with",
    readLabel: "Read the case study",
    problems: [
        { slug: "request-to-pay", ask: "A payment that can never go through twice" },
        { slug: "bulk-push-notification-scheduler", ask: "A push campaign to every phone, in minutes" },
        { slug: "redis-connection-multiplexing", ask: "An app that stays up at peak load" },
        { slug: "preprod-image-promotion", ask: "Releases that ship exactly what was tested" },
        { slug: "qualification-certificate-workflow", ask: "A government approval workflow, end to end" },
        { slug: "backend-aggregation-layer", ask: "Nine dashboards, one API call each" },
    ],
};

/** The review switcher shown with ?stack= in the URL. */
export const STACK_REVIEW = {
    label: "Stack section versions",
    versions: [
        { key: "sentence", label: "A · Sentence" },
        { key: "trace", label: "B · Trace" },
        { key: "problems", label: "C · Problems" },
    ],
};
