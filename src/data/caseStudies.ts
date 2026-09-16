// Case studies drawn from Anees' CV. Only facts from the CV; no invented metrics.

export type Result = { value: string; label: string };

export type CaseStudy = {
  slug: string;
  file: string;
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
    slug: "emv-qr-request-to-pay",
    file: "emv-qr-payments.md",
    title: "EMV QR Payments & Request to Pay",
    company: "DPL",
    role: "Software Engineer, led Request to Pay delivery",
    period: "2024 – 2026",
    featured: true,
    summary:
      "Designed a peer-to-peer QR payment system on the EMV standard, and led delivery of Request to Pay across the mobile app and USSD.",
    problem:
      "Customers and merchants needed QR payments that any compliant wallet could read, and a way to request money that also reached users without a smartphone.",
    built: [
      "Designed a P2P QR payment system conforming to EMV standards, using TLV encoding for the payloads",
      "Led delivery of the Request to Pay feature through both the mobile app and USSD",
    ],
    results: [
      { value: "4,000+", label: "merchants adopted Request to Pay" },
      { value: "App + USSD", label: "channels for requesting payments" },
    ],
    stack: [".NET", "Microservices", "EMV QR", "TLV encoding", "USSD"],
  },
  {
    slug: "bulk-push-notification-scheduler",
    file: "push-scheduler.cs",
    title: "Bulk Push Notification Scheduler",
    company: "DPL",
    role: "Software Engineer",
    period: "2024 – 2026",
    featured: true,
    summary:
      "Built a scheduler that dispatches 700–800k push notifications per run in 6–8 minutes, with multilingual payloads for Android and Huawei devices.",
    problem:
      "Large campaigns and alerts had to reach hundreds of thousands of devices quickly, in each user's language, across two different push platforms.",
    built: [
      "Built a bulk push notification scheduler dispatching 700–800k notifications in 6–8 minutes",
      "Supported multilingual payloads so each user receives the message in their language",
      "Targeted both Android and Huawei (HMS) devices from the same scheduler",
    ],
    results: [
      { value: "700–800k", label: "notifications per run" },
      { value: "6–8 min", label: "to dispatch a full run" },
    ],
    stack: [".NET", "Schedulers", "Android push", "HMS Push"],
  },
  {
    slug: "telecom-agent-apps",
    file: "agent-apps.md",
    title: "Telecom Agent Apps for Tanzania & Togo",
    company: "DPL",
    role: "Led development and a small engineering team",
    period: "2024 – 2026",
    region: "Tanzania & Togo",
    featured: true,
    summary:
      "Led development of enterprise agent apps for telecom operators in Tanzania and Togo, and removed the Redis bottleneck that threatened peak traffic.",
    problem:
      "At peak, 600k+ concurrent sessions were exhausting the Redis connection pool, putting the agent apps at risk of outages exactly when traffic mattered most.",
    built: [
      "Led development of the enterprise telecom agent apps for Tanzania and Togo, managing a small engineering team",
      "Implemented a Redis connection multiplexing strategy that eliminated connection pool exhaustion",
      "Migrated all microservices from .NET 7 to .NET 8",
    ],
    results: [
      { value: "600k+", label: "concurrent sessions without pool exhaustion" },
      { value: ".NET 7 → 8", label: "migration across all microservices" },
    ],
    stack: [".NET 8", "Microservices", "Redis"],
  },
  {
    slug: "qualification-certificate-workflow",
    file: "certificate-workflow.ts",
    title: "Qualification Certificate Workflow",
    company: "Systems Limited",
    role: "AI-Native Full Stack Engineer",
    period: "2026 – Present",
    summary:
      "Built the qualification certificate issuance workflow end to end: payment, reviewer assignment, approval, and role-based access.",
    problem:
      "Issuing a certificate involved payment, review, and approval steps owned by different roles, while the business rules kept evolving during delivery.",
    built: [
      "Built the issuance workflow end to end on .NET 9 and ABP.io, with Angular micro-frontend screens",
      "Integrated HyperPay for certificate payments",
      "Implemented reviewer assignment, approval, and role-based access control aligned with evolving business rules",
    ],
    results: [
      { value: "End to end", label: "payment → review → approval → issuance" },
      { value: "RBAC", label: "kept in step with changing business rules" },
    ],
    stack: [".NET 9", "ABP.io", "Angular", "DDD", "HyperPay"],
  },
  {
    slug: "backend-aggregation-layer",
    file: "aggregation-layer.cs",
    title: "Backend Aggregation Layer & Analytics Dashboards",
    company: "Systems Limited",
    role: "AI-Native Full Stack Engineer",
    period: "2026 – Present",
    summary:
      "Built a caching aggregation layer in front of five downstream services, and shipped analytics dashboards for the Online Travel Agency and Admin portals.",
    problem:
      "Portal screens were making redundant calls to several downstream services, and teams needed analytics they could filter and export.",
    built: [
      "Built a backend aggregation layer with response caching across five downstream services",
      "Cut redundant downstream calls made by the portals",
      "Shipped analytics dashboards with filtering and export options for the Online Travel Agency and Admin portals",
    ],
    results: [
      { value: "5", label: "downstream services behind one cached layer" },
      { value: "2", label: "portals with filterable, exportable analytics" },
    ],
    stack: [".NET 9", "ABP.io", "Response caching", "Angular"],
  },
  {
    slug: "batch-payment-validation",
    file: "batch-validation.cs",
    title: "Batch Validation for Bulk Corporate Payments",
    company: "DPL",
    role: "Software Engineer",
    period: "2024 – 2026",
    summary:
      "Built a batch validation scheduler that detects errors before bulk corporate payments are processed, reducing processing errors by 30%.",
    problem:
      "Errors in bulk corporate payments were surfacing during processing, when they are the most expensive to unwind.",
    built: [
      "Built a batch validation scheduler that runs ahead of bulk corporate payment processing",
      "Added pre-processing error detection so problems are caught before payments are processed",
    ],
    results: [{ value: "30%", label: "fewer payment processing errors" }],
    stack: [".NET", "Schedulers", "Microservices"],
  },
];
