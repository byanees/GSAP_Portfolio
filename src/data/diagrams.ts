// "How it works" diagrams for each case study. Hand-placed on a 1000 x 560
// canvas so every layout reads like a drawn blueprint rather than an auto-layout.
// Only architecture the CV describes; nothing here adds a claim the case study
// does not already make.

export type NodeKind = "actor" | "service" | "store" | "external" | "channel";

export type DiagramNode = {
    id: string;
    /** Centre of the node on the 1000 x 560 canvas. */
    x: number;
    y: number;
    w?: number;
    h?: number;
    label: string;
    sub?: string;
    kind: NodeKind;
    /** Draws the node in the accent colour: the part of the system the case study is about. */
    focus?: boolean;
};

export type DiagramEdge = {
    from: string;
    to: string;
    /** Step this edge belongs to; packets run along it while that step is active. */
    step: number;
    label?: string;
    /** Several lines fanning in at the source, for many-to-one traffic. */
    fan?: number;
    dashed?: boolean;
    /** Bends the curve; positive pushes it down/right. */
    bend?: number;
    /** Forces which sides the wire leaves and enters by, when the automatic choice crosses other nodes. */
    axis?: "x" | "y";
    /** Leaves and re-enters from the bottom, for a return path drawn beneath a row of nodes. */
    loop?: boolean;
};

export type DiagramNote = { x: number; y: number; text: string; step?: number };

/** A region drawn behind a group of nodes, like a boundary on a whiteboard. */
export type DiagramZone = { x: number; y: number; w: number; h: number; label: string };

export type Diagram = {
    title: string;
    nodes: DiagramNode[];
    edges: DiagramEdge[];
    steps: string[];
    notes?: DiagramNote[];
    zones?: DiagramZone[];
};

export const DIAGRAMS: Record<string, Diagram> = {
    "emv-qr-request-to-pay": {
        title: "One QR any wallet can read, one request that reaches any phone",
        nodes: [
            { id: "merchant", x: 120, y: 150, label: "Merchant", sub: "shows a QR", kind: "actor" },
            { id: "qr", x: 420, y: 150, w: 200, label: "EMV QR", sub: "TLV-encoded payload", kind: "service", focus: true },
            { id: "wallet", x: 860, y: 150, label: "Any EMV wallet", sub: "scans + decodes", kind: "external" },
            { id: "requester", x: 120, y: 430, label: "Requester", sub: "asks to be paid", kind: "actor" },
            { id: "r2p", x: 390, y: 430, label: "Request to Pay", sub: "4,000+ merchants", kind: "service", focus: true },
            { id: "app", x: 640, y: 350, w: 150, label: "Mobile app", sub: "smartphone", kind: "channel" },
            { id: "ussd", x: 640, y: 510, w: 150, h: 70, label: "USSD", sub: "any phone", kind: "channel" },
            { id: "pay", x: 860, y: 430, label: "Payments", sub: ".NET microservices", kind: "service" },
        ],
        edges: [
            { from: "merchant", to: "qr", step: 1, label: "encode" },
            { from: "qr", to: "wallet", step: 2, label: "scan" },
            { from: "wallet", to: "pay", step: 3, label: "pay" },
            { from: "requester", to: "r2p", step: 4, label: "request" },
            { from: "r2p", to: "app", step: 5 },
            { from: "r2p", to: "ussd", step: 5 },
            { from: "app", to: "pay", step: 6, label: "approve" },
            { from: "ussd", to: "pay", step: 6 },
        ],
        notes: [{ x: 420, y: 60, text: "00 02 01 · 01 02 12 · 53 03 ··· · 54 ·· ··· · 63 04 ····", step: 1 }],
        steps: [
            "The merchant's QR is generated to the EMV standard, with every field TLV-encoded",
            "Any EMV-compliant wallet can scan and decode it, not only ours",
            "The payment settles through the P2P payment services",
            "A requester can instead send a Request to Pay",
            "It reaches the payer in the mobile app, or over USSD on a phone without data",
            "The payer approves, and it settles on the same payment rails",
        ],
    },

    "bulk-push-notification-scheduler": {
        title: "One scheduled run, 700-800k phones, 6-8 minutes",
        zones: [{ x: 235, y: 110, w: 490, h: 340, label: "scheduler · .NET" }],
        nodes: [
            { id: "trigger", x: 100, y: 280, w: 150, label: "Campaign", sub: "scheduled run", kind: "actor" },
            { id: "batch", x: 350, y: 280, w: 170, label: "Audience", sub: "split into batches", kind: "service" },
            { id: "i18n", x: 600, y: 280, w: 180, label: "Localise", sub: "each user's language", kind: "service", focus: true },
            { id: "android", x: 875, y: 190, w: 170, label: "Android push", sub: "Android devices", kind: "external" },
            { id: "hms", x: 875, y: 370, w: 170, label: "HMS Push", sub: "Huawei devices", kind: "external" },
        ],
        edges: [
            { from: "trigger", to: "batch", step: 1 },
            { from: "batch", to: "i18n", step: 2, fan: 5 },
            { from: "i18n", to: "android", step: 3, fan: 3 },
            { from: "i18n", to: "hms", step: 3, fan: 3 },
        ],
        notes: [
            { x: 600, y: 500, text: "700-800k notifications · 6-8 min per run", step: 3 },
            { x: 600, y: 70, text: '{ "lang": user.lang, "title": "…" }', step: 2 },
        ],
        steps: [
            "A campaign or alert fires on its schedule",
            "The audience is split into batches so the run is dispatched in parallel",
            "Each batch renders the payload in the recipient's own language, then fans out to Android push and Huawei HMS Push",
        ],
    },

    "telecom-agent-apps": {
        title: "600k+ sessions, a handful of Redis connections",
        zones: [{ x: 300, y: 60, w: 400, h: 330, label: ".NET 8 microservices" }],
        nodes: [
            { id: "agents", x: 120, y: 220, w: 170, h: 96, label: "60,000+ agents", sub: "Tanzania & Togo", kind: "actor" },
            { id: "sim", x: 500, y: 130, w: 300, label: "SIM registration · swap · stock", kind: "service" },
            { id: "airtime", x: 500, y: 220, w: 300, label: "Airtime & bundles · inventory", kind: "service" },
            { id: "onboard", x: 500, y: 310, w: 300, label: "Kinara · bulk · B2B onboarding", kind: "service" },
            { id: "mux", x: 840, y: 220, w: 180, label: "Multiplexer", sub: "shared connections", kind: "service", focus: true },
            { id: "redis", x: 840, y: 400, w: 180, label: "Redis", sub: "no pool exhaustion", kind: "store" },
            { id: "jenkins", x: 330, y: 480, w: 150, label: "Jenkins", sub: "pipeline", kind: "channel" },
            { id: "docker", x: 600, y: 480, w: 150, label: "Docker", sub: "30% fewer deploy errors", kind: "channel" },
        ],
        edges: [
            { from: "agents", to: "sim", step: 1, bend: -20 },
            { from: "agents", to: "airtime", step: 1 },
            { from: "agents", to: "onboard", step: 1, bend: 20 },
            { from: "sim", to: "mux", step: 2, fan: 3 },
            { from: "airtime", to: "mux", step: 2, fan: 3 },
            { from: "onboard", to: "mux", step: 2, fan: 3 },
            { from: "mux", to: "redis", step: 2, label: "multiplexed" },
            { from: "jenkins", to: "docker", step: 3, label: "build" },
            { from: "docker", to: "onboard", step: 3, dashed: true, label: "deploy" },
        ],
        steps: [
            "60,000+ agents run SIM, airtime, stock and onboarding operations from the agent apps",
            "At peak, 600k+ sessions share a small set of multiplexed Redis connections instead of draining the pool",
            "Every release ships through the same Jenkins and Docker pipeline, onto .NET 8",
        ],
    },

    "otapp-bus-ticketing": {
        title: "Book and pay for a seat without leaving the wallet",
        zones: [{ x: 290, y: 90, w: 420, h: 380, label: "Mixx Tanzania · .NET" }],
        nodes: [
            { id: "customer", x: 120, y: 280, w: 150, label: "Customer", sub: "in the super app", kind: "actor" },
            { id: "api", x: 500, y: 180, w: 200, label: "Ticketing API", sub: "the app's own surface", kind: "service", focus: true },
            { id: "wallet", x: 500, y: 380, w: 200, label: "Wallet balance", sub: "pays for the seat", kind: "store" },
            { id: "otapp", x: 870, y: 180, w: 170, label: "OTAPP", sub: "3rd-party ticketing", kind: "external" },
            { id: "guard", x: 870, y: 380, w: 170, label: "Timeout guard", sub: "no seat, no charge", kind: "service" },
        ],
        edges: [
            { from: "customer", to: "api", step: 1, label: "search", bend: -20 },
            { from: "api", to: "otapp", step: 1, label: "routes + seats" },
            { from: "customer", to: "wallet", step: 2, label: "pay", bend: 20 },
            { from: "wallet", to: "api", step: 2 },
            { from: "api", to: "otapp", step: 3, label: "confirm", bend: 60 },
            { from: "otapp", to: "guard", step: 4, dashed: true, label: "timeout?" },
            { from: "guard", to: "wallet", step: 4, dashed: true },
        ],
        steps: [
            "The customer searches routes and picks a seat; the app's API asks OTAPP behind the scenes",
            "They pay from the wallet balance they already have",
            "The booking is confirmed with OTAPP",
            "If OTAPP times out, the guard makes sure nobody is charged for a seat they did not get",
        ],
    },

    "qualification-certificate-workflow": {
        title: "Payment to certificate, with the right person at every gate",
        zones: [{ x: 40, y: 410, w: 920, h: 110, label: "role-based access · ABP.io" }],
        nodes: [
            { id: "applicant", x: 110, y: 170, w: 140, label: "Applicant", sub: "Angular MFE", kind: "actor" },
            { id: "pay", x: 300, y: 170, w: 140, label: "Payment", sub: "HyperPay", kind: "external" },
            { id: "assign", x: 490, y: 170, w: 140, label: "Assign", sub: "to a reviewer", kind: "service", focus: true },
            { id: "review", x: 680, y: 170, w: 140, label: "Review", sub: "reviewer role", kind: "service" },
            { id: "issue", x: 880, y: 170, w: 140, label: "Certificate", sub: "issued", kind: "store" },
            { id: "rbac", x: 585, y: 470, w: 400, h: 56, label: "Who can act at each step", kind: "service" },
        ],
        edges: [
            { from: "applicant", to: "pay", step: 1 },
            { from: "pay", to: "assign", step: 2 },
            { from: "assign", to: "review", step: 3 },
            { from: "review", to: "issue", step: 4 },
            { from: "review", to: "applicant", step: 4, dashed: true, label: "changes requested", loop: true },
            { from: "rbac", to: "assign", step: 3, dashed: true },
            { from: "rbac", to: "review", step: 3, dashed: true },
        ],
        steps: [
            "The applicant starts from the Angular micro-frontend and pays through HyperPay",
            "Once payment clears, the application is assigned to a reviewer",
            "Role-based access decides who can review and approve, and it follows the rules as they change",
            "Approval issues the certificate; anything else goes back to the applicant",
        ],
    },

    "backend-aggregation-layer": {
        title: "Five downstream services, one cached answer",
        zones: [{ x: 330, y: 90, w: 300, h: 420, label: "aggregation layer · .NET 9" }],
        nodes: [
            { id: "ota", x: 130, y: 200, w: 180, label: "Travel Agency", sub: "portal", kind: "actor" },
            { id: "admin", x: 110, y: 400, w: 160, label: "Admin", sub: "portal", kind: "actor" },
            { id: "agg", x: 480, y: 200, w: 220, label: "Aggregator", sub: "one call per screen", kind: "service", focus: true },
            { id: "cache", x: 480, y: 400, w: 220, label: "Response cache", sub: "cuts repeat calls", kind: "store" },
            { id: "s1", x: 860, y: 90, w: 180, h: 56, label: "Service 1", kind: "external" },
            { id: "s2", x: 860, y: 180, w: 180, h: 56, label: "Service 2", kind: "external" },
            { id: "s3", x: 860, y: 270, w: 180, h: 56, label: "Service 3", kind: "external" },
            { id: "s4", x: 860, y: 360, w: 180, h: 56, label: "Service 4", kind: "external" },
            { id: "s5", x: 860, y: 450, w: 180, h: 56, label: "Service 5", kind: "external" },
        ],
        edges: [
            { from: "ota", to: "agg", step: 1, axis: "x" },
            { from: "admin", to: "agg", step: 1, axis: "x" },
            { from: "agg", to: "cache", step: 2, label: "hit?" },
            { from: "agg", to: "s1", step: 3, axis: "x" },
            { from: "agg", to: "s2", step: 3, axis: "x" },
            { from: "agg", to: "s3", step: 3, axis: "x" },
            { from: "agg", to: "s4", step: 3, axis: "x" },
            { from: "agg", to: "s5", step: 3, axis: "x" },
            { from: "cache", to: "admin", step: 4, dashed: true, label: "dashboards", axis: "x" },
        ],
        steps: [
            "Both portals call one aggregation layer instead of each downstream service",
            "A cached response answers straight away",
            "On a miss, the layer calls the five downstream services once and caches the result",
            "The same data drives analytics dashboards people can filter and export",
        ],
    },

    "batch-payment-validation": {
        title: "Catch the bad rows before the money moves",
        zones: [{ x: 280, y: 90, w: 300, h: 380, label: "runs ahead of processing" }],
        nodes: [
            { id: "batch", x: 120, y: 280, w: 160, label: "Corporate batch", sub: "bulk payments", kind: "actor" },
            { id: "validate", x: 430, y: 280, w: 200, h: 96, label: "Validation", sub: "scheduled, per batch", kind: "service", focus: true },
            { id: "process", x: 820, y: 170, w: 200, label: "Processing", sub: "clean rows only", kind: "service" },
            { id: "errors", x: 820, y: 400, w: 200, label: "Errors flagged", sub: "fixed before processing", kind: "store" },
        ],
        edges: [
            { from: "batch", to: "validate", step: 1, fan: 4 },
            { from: "validate", to: "process", step: 2, label: "valid" },
            { from: "validate", to: "errors", step: 3, dashed: true, label: "invalid" },
        ],
        notes: [{ x: 820, y: 510, text: "30% fewer processing errors", step: 3 }],
        steps: [
            "A bulk corporate payment batch arrives",
            "The validation scheduler checks it before processing, and clean rows go through",
            "Errors are caught here, where they are cheap to fix, instead of mid-processing",
        ],
    },
};
