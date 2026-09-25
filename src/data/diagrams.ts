// "How it works" diagrams for each case study. Hand-placed on a 1000 x 560
// canvas so every layout reads like a drawn blueprint rather than an auto-layout.
// Each one restates the flow its case study describes; nothing here adds a
// claim the case study does not already make.

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
    /** Bends the curve; positive pushes it down/right. For a loop, how far it swings out. */
    bend?: number;
    /** Forces which sides the wire leaves and enters by, when the automatic choice crosses other nodes. */
    axis?: "x" | "y";
    /** A return path between two nodes in a row: drawn beneath them, or above with "above". */
    loop?: boolean | "above";
    /** Puts the label under the wire instead of above it, when another wire crosses the space above. */
    labelBelow?: boolean;
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
    "request-to-pay": {
        title: "Two channels to pay, one payment that counts",
        nodes: [
            { id: "namecheck", x: 100, y: 120, w: 170, label: "Name check", sub: "API", kind: "external" },
            { id: "merchant", x: 100, y: 300, w: 150, label: "Merchant", sub: "MSISDN + amount", kind: "actor" },
            { id: "r2p", x: 360, y: 300, label: "Request to Pay", sub: "idempotent", kind: "service", focus: true },
            { id: "push", x: 620, y: 190, w: 170, label: "Push", sub: "in the app", kind: "channel" },
            { id: "ussd", x: 620, y: 410, w: 170, label: "USSD prompt", sub: "any phone", kind: "channel" },
            { id: "pay", x: 880, y: 300, w: 170, label: "Payment", sub: "first one wins", kind: "service" },
            { id: "record", x: 880, y: 480, w: 190, label: "Request record", sub: "updated in the DB", kind: "store" },
        ],
        edges: [
            { from: "merchant", to: "namecheck", step: 1, label: "MSISDN" },
            { from: "merchant", to: "r2p", step: 2, label: "send" },
            { from: "r2p", to: "push", step: 3 },
            { from: "r2p", to: "ussd", step: 3 },
            { from: "push", to: "pay", step: 4, label: "pay" },
            { from: "ussd", to: "pay", step: 4 },
            { from: "ussd", to: "record", step: 5, dashed: true, label: "callback", axis: "x" },
        ],
        notes: [{ x: 880, y: 400, text: "pay again → already paid", step: 4 }],
        steps: [
            "The merchant enters the customer's MSISDN, and a name-check API confirms who it is",
            "They set the amount and send the request",
            "The customer gets it twice: as a push notification and as a USSD prompt",
            "They pay from either one. Payment is idempotent, so a second attempt gets an 'already paid' error",
            "A USSD payment triggers a callback that updates the request record in the database",
        ],
    },

    "bulk-push-notification-scheduler": {
        title: "800k recipients, never all in memory at once",
        nodes: [
            { id: "admin", x: 90, y: 280, w: 140, label: "Admin", sub: "imports a file", kind: "actor" },
            { id: "notif", x: 300, y: 170, w: 170, label: "Notifications", sub: "body · type · time", kind: "store" },
            { id: "msisdn", x: 300, y: 390, w: 170, label: "MSISDNs", sub: "per notification", kind: "store" },
            { id: "sched", x: 520, y: 280, w: 150, label: "Scheduler", sub: "reads in chunks", kind: "service" },
            { id: "workers", x: 740, y: 280, w: 160, label: "2 workers", sub: "semaphore = 2", kind: "service", focus: true },
            { id: "fcm", x: 925, y: 170, w: 130, label: "FCM", sub: "Android", kind: "external" },
            { id: "hms", x: 925, y: 390, w: 130, label: "Huawei", sub: "HMS Push", kind: "external" },
            { id: "done", x: 520, y: 490, w: 190, h: 64, label: "Marked processed", kind: "store" },
        ],
        edges: [
            { from: "admin", to: "notif", step: 1, axis: "x" },
            { from: "admin", to: "msisdn", step: 1, axis: "x" },
            { from: "notif", to: "sched", step: 2, axis: "x" },
            { from: "msisdn", to: "sched", step: 2, axis: "x" },
            { from: "sched", to: "workers", step: 3, fan: 2 },
            { from: "workers", to: "fcm", step: 4, axis: "x" },
            { from: "workers", to: "hms", step: 4, axis: "x" },
            { from: "workers", to: "done", step: 5 },
            { from: "done", to: "sched", step: 5, dashed: true, label: "retry failed" },
        ],
        notes: [{ x: 520, y: 60, text: "700-800k per run · 6-8 min", step: 3 }],
        steps: [
            "The admin imports a file of MSISDNs and sets the body, type and time in the back office",
            "The scheduler picks up unprocessed notifications and reads their MSISDNs in chunks, never all at once",
            "A semaphore of 2 keeps parallelism controlled: two workers take a chunk each",
            "Each worker looks up the device (FCM or Huawei) and the content, and sends",
            "Sent records are marked processed; failures are retried after every chunk is delivered",
        ],
    },

    "redis-connection-multiplexing": {
        title: "From a connection per request to one shared connection",
        zones: [
            { x: 30, y: 30, w: 940, h: 240, label: "before" },
            { x: 30, y: 300, w: 940, h: 240, label: "after" },
        ],
        nodes: [
            { id: "reqA", x: 150, y: 150, w: 170, label: "Requests", sub: "peak traffic", kind: "actor" },
            { id: "redisA", x: 820, y: 150, w: 190, label: "Redis", sub: "over the limit", kind: "store" },
            { id: "reqB", x: 150, y: 420, w: 170, label: "Requests", sub: "same peak", kind: "actor" },
            { id: "mux", x: 485, y: 420, w: 210, label: "Multiplexer", sub: "one shared connection", kind: "service", focus: true },
            { id: "redisB", x: 820, y: 420, w: 190, label: "Redis", sub: "flat connections", kind: "store" },
        ],
        edges: [
            { from: "reqA", to: "redisA", step: 1, fan: 6, dashed: true, label: "a new connection each" },
            { from: "reqB", to: "mux", step: 2, fan: 6 },
            { from: "mux", to: "redisB", step: 3, label: "pipelined" },
        ],
        notes: [{ x: 485, y: 250, text: "timeouts · runtime errors · downtime", step: 1 }],
        steps: [
            "Before: every request opened its own Redis connection, and at peak the count went past the limit",
            "After: requests share one long-lived, multiplexed connection, created once for the app",
            "Commands are pipelined over it, so peak traffic no longer means more connections, and the timeouts stopped",
        ],
    },

    "preprod-image-promotion": {
        title: "The image that passed UAT is the image in production",
        nodes: [
            { id: "code", x: 90, y: 150, w: 140, label: "Code", sub: "merged", kind: "actor" },
            { id: "jenkins", x: 310, y: 150, w: 190, label: "Jenkins", sub: "builds Docker image", kind: "channel" },
            { id: "preprod", x: 570, y: 150, w: 170, label: "PreProd", sub: "replica of prod", kind: "service" },
            { id: "uat", x: 850, y: 150, w: 170, label: "UAT", sub: "signed off", kind: "actor" },
            { id: "retag", x: 570, y: 400, w: 200, label: "Same image", sub: "new tag, no rebuild", kind: "store", focus: true },
            { id: "prod", x: 850, y: 400, w: 170, label: "Production", sub: "runs what passed", kind: "service" },
        ],
        edges: [
            { from: "code", to: "jenkins", step: 1 },
            { from: "jenkins", to: "preprod", step: 2, label: "deploy" },
            { from: "preprod", to: "uat", step: 3, label: "test" },
            { from: "uat", to: "retag", step: 4, label: "promote" },
            { from: "retag", to: "prod", step: 5, label: "roll out" },
        ],
        notes: [{ x: 570, y: 510, text: "99% fewer deployment errors", step: 5 }],
        steps: [
            "Merged code goes to Jenkins, which builds it into a Docker image",
            "The image is deployed to PreProd, a replica of production",
            "UAT runs on PreProd and is signed off",
            "The same image is promoted under a new tag. Nothing is rebuilt",
            "Production runs exactly what passed UAT, which cut deployment errors by 99%",
        ],
    },

    "emv-qr-p2p-payments": {
        title: "A QR any EMV scanner can read, parsed straight into a transfer",
        nodes: [
            { id: "static", x: 120, y: 160, label: "Static QR", sub: "who to pay", kind: "service" },
            { id: "dynamic", x: 120, y: 380, label: "Dynamic QR", sub: "who + how much", kind: "service" },
            { id: "tlv", x: 400, y: 270, w: 200, label: "TLV encode", sub: "EMV® QR payload", kind: "service", focus: true },
            { id: "scan", x: 650, y: 270, w: 170, label: "Payer scans", sub: "in the app", kind: "actor" },
            { id: "transfer", x: 880, y: 270, w: 170, label: "P2P transfer", sub: "from the fields", kind: "service" },
        ],
        edges: [
            { from: "static", to: "tlv", step: 1 },
            { from: "dynamic", to: "tlv", step: 1 },
            { from: "tlv", to: "scan", step: 2, label: "scan" },
            { from: "scan", to: "transfer", step: 3, label: "parse" },
        ],
        notes: [
            { x: 500, y: 60, text: "00 02 01 · 01 02 12 · 26 ·· ··· · 54 ·· ··· · 63 04 ····", step: 1 },
            { x: 400, y: 470, text: "tag 01: 11 = static · 12 = dynamic", step: 1 },
        ],
        steps: [
            "A QR is generated either static (who to pay) or dynamic (who to pay, and how much)",
            "Every field is TLV-encoded to the EMV® QR Code standard, and the payer scans it in the app",
            "The app parses the TLV back into fields and starts the peer-to-peer transaction",
        ],
    },

    "otapp-bus-ticketing": {
        title: "Route, bus, seat, wallet, ticket: all inside Mixx",
        nodes: [
            { id: "customer", x: 100, y: 140, w: 150, label: "Customer", sub: "Mixx app", kind: "actor" },
            { id: "search", x: 340, y: 140, label: "Route search", sub: "source → dest", kind: "service" },
            { id: "buses", x: 600, y: 140, w: 170, label: "Buses", sub: "departure times", kind: "service" },
            { id: "seat", x: 860, y: 140, w: 170, label: "Seat", sub: "available seats", kind: "service" },
            { id: "details", x: 860, y: 380, label: "Passenger info", sub: "email · contacts", kind: "service" },
            { id: "wallet", x: 600, y: 380, w: 170, label: "Mixx wallet", sub: "pays the fare", kind: "store", focus: true },
            { id: "ticket", x: 340, y: 380, label: "Ticket issued", sub: "details emailed", kind: "service" },
        ],
        edges: [
            { from: "customer", to: "search", step: 1 },
            { from: "search", to: "buses", step: 1, label: "load" },
            { from: "buses", to: "seat", step: 2, label: "pick" },
            { from: "seat", to: "details", step: 3 },
            { from: "details", to: "wallet", step: 4, label: "pay" },
            { from: "wallet", to: "ticket", step: 5, label: "issue" },
            { from: "ticket", to: "customer", step: 5, dashed: true, label: "email" },
        ],
        steps: [
            "The customer picks a source and destination, and matching buses load with their departure times",
            "They choose a bus, see its available seats, and pick one",
            "They add passenger details: email, contact number, emergency contact",
            "Payment comes straight from their Mixx wallet",
            "The ticket is issued, and its details are emailed to them",
        ],
    },

    "qualification-certificate-workflow": {
        title: "Investor, reviewer, approver, and every way back",
        nodes: [
            { id: "investor", x: 110, y: 210, w: 160, label: "Investor", sub: "applies in steps", kind: "actor" },
            { id: "admin", x: 360, y: 210, w: 160, label: "Admin", sub: "reviews", kind: "service" },
            { id: "approver", x: 610, y: 210, w: 170, label: "Approver", sub: "decides", kind: "service", focus: true },
            { id: "external", x: 870, y: 210, w: 170, label: "External system", sub: "informed", kind: "external" },
            { id: "rejected", x: 610, y: 450, w: 150, h: 64, label: "Rejected", kind: "store" },
            { id: "notify", x: 870, y: 450, w: 170, label: "Notifications", sub: "QC issued", kind: "channel" },
        ],
        edges: [
            { from: "investor", to: "admin", step: 1, label: "submit" },
            { from: "admin", to: "investor", step: 2, dashed: true, label: "corrections", loop: true },
            { from: "admin", to: "approver", step: 3, label: "reviewed" },
            { from: "approver", to: "rejected", step: 4, dashed: true, label: "reject" },
            { from: "approver", to: "admin", step: 4, dashed: true, label: "return", loop: "above" },
            { from: "approver", to: "external", step: 5, label: "approve" },
            { from: "external", to: "notify", step: 5 },
        ],
        steps: [
            "The investor applies in steps: license eligibility for the QC, then company representatives",
            "The admin reviews it and can send it back for corrections; the investor corrects and resubmits",
            "Once the review passes, the application goes to the approver",
            "The approver can reject it, or return it to the reviewer",
            "Or approve it with a comment: the external system is informed and 'QC issued' notifications go out",
        ],
    },

    "backend-aggregation-layer": {
        title: "Nine dashboards, one call each",
        zones: [{ x: 310, y: 120, w: 240, h: 420, label: "our backend · ABP.io" }],
        nodes: [
            { id: "investor", x: 110, y: 170, w: 170, label: "Investor", sub: "4 dashboards", kind: "actor" },
            { id: "admin", x: 110, y: 400, w: 170, label: "Admin", sub: "5 dashboards", kind: "actor" },
            { id: "api", x: 430, y: 285, w: 200, label: "Dashboard API", sub: "one per dashboard", kind: "service", focus: true },
            { id: "cache", x: 430, y: 470, w: 200, h: 64, label: "Cache", sub: "short TTL", kind: "store" },
            { id: "external", x: 830, y: 285, w: 200, label: "External system", sub: "its own APIs", kind: "external" },
        ],
        edges: [
            { from: "investor", to: "api", step: 1, axis: "x" },
            { from: "admin", to: "api", step: 1, axis: "x" },
            { from: "api", to: "cache", step: 2, label: "fresh?" },
            { from: "api", to: "external", step: 3, fan: 4, label: "calls" },
        ],
        steps: [
            "Each dashboard, investor or admin, makes one call to its own API",
            "If the short-TTL cache has fresh data, it answers straight away",
            "Otherwise the backend makes the external system's API calls, combines them into one response, and caches it",
        ],
    },

    "batch-payment-validation": {
        title: "Validate every recipient before any money moves",
        nodes: [
            { id: "admin", x: 100, y: 230, w: 150, label: "Admin", sub: "uploads a file", kind: "actor" },
            { id: "validator", x: 370, y: 230, w: 200, label: "Validation", sub: "scheduler · chunks", kind: "service", focus: true },
            { id: "namecheck", x: 370, y: 450, w: 190, label: "Name check", sub: "+ other checks", kind: "external" },
            { id: "db", x: 640, y: 230, w: 170, label: "Record status", sub: "in the DB", kind: "store" },
            { id: "disburse", x: 880, y: 230, w: 170, label: "Disbursement", sub: "second scheduler", kind: "service" },
        ],
        edges: [
            { from: "admin", to: "validator", step: 1, fan: 4 },
            { from: "validator", to: "namecheck", step: 2, label: "each record" },
            { from: "validator", to: "db", step: 3, label: "status" },
            { from: "db", to: "disburse", step: 4, label: "passed" },
        ],
        notes: [{ x: 640, y: 90, text: "30% fewer processing errors", step: 4 }],
        steps: [
            "The admin uploads a file of the people to be paid",
            "The validation scheduler loads it in chunks and runs a name check and the other validations on each record",
            "Each record's status is written to the database",
            "A separate scheduler disburses only the records that passed",
        ],
    },
};
