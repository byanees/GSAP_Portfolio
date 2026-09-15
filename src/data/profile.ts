// Personal details, experience, and skills. Sourced from Anees' CV.

export const PROFILE = {
  name: "Muhammad Anees",
  shortName: "Anees",
  role: "Full Stack Engineer",
  location: "Islamabad, Pakistan",
  timezone: "PKT (UTC+5)",
  email: "aneese421@gmail.com",
  phone: "+92 339 000 4208",
  phoneHref: "tel:+923390004208",
  linkedin: "https://www.linkedin.com/in/ianees/",
  github: "https://github.com/ianeesdev",
  upwork: "https://www.upwork.com/freelancers/~017655f3515038fc66",
  cvUrl: "/assets/cv/Muhammad-Anees-Full-Stack-Engineer-CV.pdf",
  /** Set to an image path (e.g. "/assets/imgs/me/portrait.webp") to replace the About page placeholder. */
  portrait: null as string | null,
  heroLead:
    "Full Stack Engineer with 3+ years building fintech, telco, and enterprise platforms. Now building distributed systems on .NET 9, ABP.io, and Angular micro-frontends at Systems Limited.",
  summary:
    "I've delivered payment infrastructure for 60,000+ merchants and a push notification scheduler that processes 700–800k messages per run. Today I build enterprise-grade distributed systems on .NET 9, ABP.io, and Angular micro-frontends, using domain-driven design and clean architecture, with AI-assisted development as part of my daily workflow.",
  relocationCountries: "Saudi Arabia, UAE, Qatar",
  availability:
    "Full stack & backend roles in Saudi Arabia, UAE, Qatar, or remote across Europe. Visa sponsorship needed.",
  nowUpdated: "September 2026",
};

export const ELSEWHERE = [
  { label: "LinkedIn", href: PROFILE.linkedin },
  { label: "GitHub", href: PROFILE.github },
  { label: "Upwork", href: PROFILE.upwork },
  { label: "Download CV", href: PROFILE.cvUrl, download: true },
];

type Highlight = { value: string; label: string };

export type ExperienceItem = {
  kind: "work" | "education";
  period: string;
  company: string;
  role: string;
  location: string;
  current?: boolean;
  summary: string;
  highlights: Highlight[];
  stack: string[];
};

export const EXPERIENCE: ExperienceItem[] = [
  {
    kind: "work",
    period: "Jan 2026 — Present",
    company: "Systems Limited",
    role: "AI-Native Full Stack Engineer",
    location: "Islamabad, PK",
    current: true,
    summary:
      "Building REST APIs on .NET 9 and ABP.io with domain-driven design across a microservices architecture, and Angular micro-frontend features for multiple product teams.",
    highlights: [
      { value: "40", label: "person delivery team, coordinated daily" },
      { value: "5", label: "downstream services behind one cached layer" },
    ],
    stack: [".NET 9", "ABP.io", "Angular", "DDD", "HyperPay"],
  },
  {
    kind: "work",
    period: "Aug 2024 — Jan 2026",
    company: "DPL",
    role: "Software Engineer",
    location: "Islamabad, PK",
    summary:
      "Led development of enterprise telecom agent apps for Tanzania and Togo, managing a small engineering team, and built payment and messaging systems at scale.",
    highlights: [
      { value: "4,000+", label: "merchants on Request to Pay" },
      { value: "700–800k", label: "notifications per run" },
      { value: "600k+", label: "concurrent sessions" },
      { value: "30%", label: "fewer payment errors" },
    ],
    stack: [".NET 8", "Microservices", "Redis", "EMV QR"],
  },
  {
    kind: "work",
    period: "Dec 2023 — Aug 2024",
    company: "Axontick Technologies",
    role: "Full Stack Developer",
    location: "Remote",
    summary:
      "Built the React frontend for an AI assistant, completed a Dubai property platform on React and .NET Core, and integrated payments across client products.",
    highlights: [
      { value: "3,000+", label: "users on the AI assistant" },
      { value: "30%", label: "faster listing approvals" },
      { value: "25%", label: "higher payment success" },
    ],
    stack: ["React", ".NET Core", "Stripe", "PassportJS"],
  },
  {
    kind: "work",
    period: "Mar 2023 — Aug 2023",
    company: "LantroTech & Bytewise",
    role: "Web Developer & MERN Stack Fellow",
    location: "Islamabad, PK",
    summary:
      "Developed reusable React components for a payment gateway platform, and built REST APIs with Node.js, Express, and MongoDB in a 4-member backend team.",
    highlights: [{ value: "35%", label: "less UI development time" }],
    stack: ["React", "Node.js", "Express", "MongoDB"],
  },
  {
    kind: "education",
    period: "Sept 2020 — June 2024",
    company: "COMSATS University Islamabad",
    role: "Bachelor's in Computer Science",
    location: "Islamabad, PK",
    summary: "Certifications: Cybersecurity Essentials V3 · OWASP 2021: Web Application Security Awareness.",
    highlights: [],
    stack: [],
  },
];

export const EXPERTISE = [
  {
    key: "backend",
    title: "Backend Engineering",
    description:
      "REST APIs and microservices in C# on .NET 9 and ABP.io, shaped with domain-driven design and clean architecture.",
    tags: [".NET 9", "ABP.io", "EF Core", "PostgreSQL", "Redis"],
  },
  {
    key: "fintech",
    title: "Fintech & Payments",
    description:
      "EMV-compliant QR payments with TLV encoding, Request to Pay flows, bulk payment validation, and HyperPay and Stripe integrations.",
    tags: ["EMV QR", "TLV", "HyperPay", "Stripe"],
  },
  {
    key: "frontend",
    title: "Frontend Development",
    description:
      "Angular micro-frontends and React apps, from admin portals to analytics dashboards with filtering and exports.",
    tags: ["Angular", "React", "Next.js", "TypeScript"],
  },
  {
    key: "infra",
    title: "Cloud & DevOps",
    description:
      "Containerised services on Docker and Kubernetes, CI/CD with Jenkins and GitHub Actions, AWS, and ELK for observability.",
    tags: ["Docker", "Kubernetes", "AWS", "GitHub Actions", "ELK"],
  },
];

export const SKILLS = [
  {
    key: "backend",
    title: "Backend",
    comment: "what I reach for in production",
    items: [".NET Core / .NET 9", "ABP.io", ".NET Aspire", "Node.js", "PostgreSQL", "Redis", "EF Core", "RESTful APIs", "Microservices"],
    usedIn: ["telecom-agent-apps", "bulk-push-notification-scheduler", "backend-aggregation-layer"],
  },
  {
    key: "frontend",
    title: "Frontend",
    comment: "micro-frontends, dashboards, and product UIs",
    items: ["Angular", "React", "Next.js", "Micro-frontends", "TypeScript", "Redux Toolkit", "Tailwind CSS"],
    usedIn: ["qualification-certificate-workflow", "backend-aggregation-layer"],
  },
  {
    key: "infrastructure",
    title: "Infrastructure",
    comment: "shipping it and keeping it running",
    items: ["Docker", "Kubernetes", "Jenkins", "GitHub Actions", "AWS (EC2, S3, SQS, Lambda)", "ELK", "WSO2", "Nginx"],
    usedIn: [] as string[],
  },
  {
    key: "architecture",
    title: "Architecture",
    comment: "how the pieces fit together",
    items: ["Clean Architecture", "DDD", "QR / TLV encoding", "REST", "WebSockets"],
    usedIn: ["emv-qr-request-to-pay", "qualification-certificate-workflow"],
  },
];

export const NOW = [
  {
    key: "building",
    value: "Enterprise-grade distributed systems on .NET 9, ABP.io, and Angular micro-frontends at Systems Limited, using DDD and clean architecture.",
  },
  {
    key: "workflow",
    value: "AI-assisted development as part of the daily workflow, with tools like Cursor and Claude.",
  },
  {
    key: "team",
    value: "Coordinating execution across developers, QA, and DevOps in a 40-person delivery team.",
  },
  {
    key: "open_to",
    value: PROFILE.availability,
  },
  {
    key: "certified",
    value: "Cybersecurity Essentials V3 · OWASP 2021: Web Application Security Awareness",
  },
];
