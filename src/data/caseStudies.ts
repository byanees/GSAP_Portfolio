// Case studies from Anees' CV and his own write-ups of how each system works.
// Only facts he has stated; no invented metrics.

export type Result = { value: string; label: string };

export type CaseStudy = {
  slug: string;
  /** Real problem domain, shown as the card's category label. */
  domain: string;
  title: string;
  company: string;
  role: string;
  period: string;
  region?: string;
  featured?: boolean;
  summary: string;
  problem: string;
  built: string[];
  results: Result[];
  stack: string[];
};

export const CASE_STUDIES: CaseStudy[] = [
  {
    slug: "request-to-pay",
    domain: "Payments",
    title: "Request to Pay over App and USSD",
    company: "DPL",
    role: "Software Engineer, led Request to Pay delivery",
    period: "2024 - 2026",
    featured: true,
    summary:
      "Led delivery of Request to Pay: a merchant requests money from a customer, who can pay from a push notification or a USSD prompt, and can never pay twice.",
    problem:
      "Merchants needed to collect payments from customers on any phone, smartphone or not. Sending every request down two channels at once raised the obvious risk: a customer paying on both.",
    built: [
      "Built the merchant flow: enter the customer's MSISDN, confirm the name through a name-check API, set the amount, and send",
      "Delivered each request to the customer twice, as a push notification in the app and as a USSD prompt, so it also reaches phones without data",
      "Made payment idempotent: the first payment settles the request, and any second attempt, on either channel, gets an 'already paid' business exception",
      "Closed the USSD loop with a callback that updates the request record in the database once the USSD payment completes",
    ],
    results: [
      { value: "4,000+", label: "merchants adopted Request to Pay" },
      { value: "Paid once", label: "whichever channel the customer uses" },
    ],
    stack: [".NET", "Microservices", "USSD", "Push notifications", "Idempotency"],
  },
  {
    slug: "bulk-push-notification-scheduler",
    domain: "Messaging at scale",
    title: "Bulk Push Notification Scheduler",
    company: "DPL",
    role: "Software Engineer",
    period: "2024 - 2026",
    featured: true,
    summary:
      "Built the scheduler behind bulk push campaigns: 700-800k notifications per run in 6-8 minutes, read in chunks and sent with controlled parallelism to Android (FCM) and Huawei devices.",
    problem:
      "A campaign can target 800k or more MSISDNs. Loading that many recipients into memory at once would take the system down, and anything that fails to send still has to go out.",
    built: [
      "Back-office flow: the admin imports a file of MSISDNs and sets the notification's body, type, and send time",
      "A scheduler picks up unprocessed notifications, then reads the MSISDNs stored against each one",
      "Recipients are read in fixed-size chunks instead of all at once, since holding 800k+ records in memory is not safe",
      "A semaphore caps parallelism at 2, so two workers each process a chunk at a time",
      "Each worker looks up the device (FCM or Huawei) and the notification content, then delivers to the right platform",
      "Sent records are marked processed, and anything that failed is retried once every chunk has been delivered",
    ],
    results: [
      { value: "700-800k", label: "notifications per run" },
      { value: "6-8 min", label: "to dispatch a full run" },
    ],
    stack: [".NET", "Schedulers", "Semaphore", "FCM", "HMS Push"],
  },
  {
    slug: "redis-connection-multiplexing",
    domain: "Reliability",
    title: "Redis Connection Multiplexing",
    company: "DPL",
    role: "Software Engineer, Mixx Tanzania app",
    period: "2024 - 2026",
    region: "Tanzania",
    featured: true,
    summary:
      "In the Mixx Tanzania app, every Redis call was opening its own connection. At peak that went past the connection limit and caused downtime, so I replaced it with one shared, multiplexed connection.",
    problem:
      "Each request created a new Redis connection. During peak traffic, with 600k+ concurrent sessions, the connection count went past the limit, causing timeouts, runtime errors, and downtime in the Mixx Tanzania app.",
    built: [
      "Traced the peak-time timeouts to connection handling: every Redis call opened a new connection instead of reusing one",
      "Replaced it with a single, long-lived multiplexed connection shared across the application, so concurrent commands are pipelined over the same connection",
      "Created that connection once for the application's lifetime instead of per request, so the connection count stays flat however busy it gets",
      "Eliminated the timeout errors during peak traffic and made the platform noticeably more stable",
    ],
    results: [
      { value: "600k+", label: "concurrent sessions without running out of connections" },
      { value: "Zero", label: "Redis timeout errors at peak after the change" },
    ],
    stack: [".NET", "Redis", "Connection multiplexing"],
  },
  {
    slug: "preprod-image-promotion",
    domain: "DevOps",
    title: "Build Once, Promote to Production",
    company: "DPL",
    role: "Backend lead, telco agent apps",
    period: "2025 - 2026",
    summary:
      "Automated CI/CD for the telco agent apps with Docker and Jenkins. The image signed off in UAT on PreProd is the exact image that goes to production, under a new tag, which cut deployment errors by 99%.",
    problem:
      "Deployments were slow and error-prone, and issues that never appeared in testing were turning up at runtime in production.",
    built: [
      "Automated the build and release pipeline with Jenkins, packaging each service as a Docker image",
      "Kept PreProd as a replica of production, so UAT runs against the same setup the release will land on",
      "Once UAT is signed off on PreProd, the same image is rolled out to production under a new tag, with no rebuild in between",
      "Tightened image tagging so every release is traceable to the exact image that was tested",
    ],
    results: [
      { value: "99%", label: "fewer deployment errors" },
      { value: "Same image", label: "from PreProd UAT to production" },
    ],
    stack: ["Docker", "Jenkins", "CI/CD", ".NET"],
  },
  {
    slug: "otapp-bus-ticketing",
    domain: "Third-party integration",
    title: "Bus Ticketing Inside the Mixx Tanzania App",
    company: "DPL",
    role: "Software Engineer",
    period: "2024 - 2026",
    region: "Tanzania",
    summary:
      "Built bus ticketing into the Mixx Tanzania wallet app: pick a route, a bus and a seat, pay from the Mixx wallet, and get the ticket by email.",
    problem:
      "Buying a bus ticket meant leaving the wallet app and paying somewhere else. The super app needed ticketing as a first-class service, paid from the balance the customer already had.",
    built: [
      "Route search: the customer picks a source and destination, and buses load with their departure times",
      "Seat selection: they choose a bus, see which seats are available, and pick one",
      "Passenger details, including email, contact number, and emergency contact",
      "Payment from the customer's Mixx wallet, after which the ticket is issued and its details are emailed to them",
    ],
    results: [
      { value: "In-app", label: "search, seat, payment and ticket without leaving the wallet" },
      { value: "Emailed", label: "ticket details as soon as it is issued" },
    ],
    stack: [".NET", "Microservices", "Third-party APIs"],
  },
  {
    slug: "qualification-certificate-workflow",
    domain: "Enterprise workflow",
    title: "Qualification Certificate Workflow",
    company: "Systems Limited",
    role: "AI-Native Full Stack Engineer",
    period: "2026 - Present",
    summary:
      "Built the Qualification Certificate workflow end to end: an investor applies, an admin reviews, an approver decides, and an approved QC is reported to an external system and announced.",
    problem:
      "A QC application passes through three roles and can be sent back more than once, but has to end the same way every time: a decision on record, and an issued certificate the external system knows about.",
    built: [
      "Multi-step investor application, covering license eligibility for the QC and selection of company representatives",
      "Company representatives can later add card details on the company's behalf through HyperPay, and view the company dashboard",
      "Admin review: the admin can send the application back for corrections, and the investor corrects and resubmits it",
      "Approval: the approver can reject, return the application to the reviewer, or approve it with a comment",
      "On approval, the external system is informed and notifications go out that the QC has been issued",
      "Role-based access control for investors, representatives, admins, and approvers",
    ],
    results: [
      { value: "3 roles", label: "investor, admin reviewer, approver" },
      { value: "End to end", label: "application to issued certificate" },
    ],
    stack: [".NET 9", "ABP.io", "Angular", "DDD", "HyperPay"],
  },
  {
    slug: "backend-aggregation-layer",
    domain: "Platform & analytics",
    title: "Visa by Package Dashboards: One API per Dashboard",
    company: "Systems Limited",
    role: "AI-Native Full Stack Engineer",
    period: "2026 - Present",
    summary:
      "Nine dashboards, 4 for investors and 5 for admins, draw their data from another system's APIs. I centralised those calls in our ABP.io backend, so each dashboard makes one call, with a short-TTL cache in front.",
    problem:
      "The dashboard data lives in another system, exposed through its own APIs. Calling them from the frontend would mean several requests per dashboard, made straight from the browser.",
    built: [
      "Centralised the external system's API calls in our own ABP.io backend",
      "Exposed a single API per dashboard, so the frontend makes one call instead of many",
      "Added a caching layer with a short TTL, so repeat loads are fast and the data stays current",
      "Covered all 9 dashboards: 4 on the investor side and 5 on the admin side",
    ],
    results: [
      { value: "9", label: "dashboards: 4 investor, 5 admin" },
      { value: "1 call", label: "per dashboard from the frontend" },
    ],
    stack: [".NET 9", "ABP.io", "Caching", "Angular"],
  },
  {
    slug: "batch-payment-validation",
    domain: "Payments",
    title: "Validation Scheduler for Bulk Payments",
    company: "DPL",
    role: "Software Engineer",
    period: "2024 - 2026",
    summary:
      "Built the scheduler that validates bulk payment files before any money moves: it name-checks every recipient in chunks and marks each record for the disbursement scheduler.",
    problem:
      "Admins upload files of people to be paid. Errors found during disbursement, after money has started moving, are the most expensive to unwind.",
    built: [
      "The admin uploads a file of the people to be paid",
      "The validation scheduler loads the records in chunks rather than the whole file at once",
      "Each record goes through a name check and the other validations",
      "Every record's status is updated in the database, for a separate scheduler to pick up and disburse",
    ],
    results: [],
    stack: [".NET", "Schedulers", "Microservices"],
  },
];
