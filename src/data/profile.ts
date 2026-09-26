// Personal details, experience, and skills. Sourced from Anees' CV.

export const PROFILE = {
  name: "Muhammad Anees",
  shortName: "Anees",
  role: "AI-Native Full Stack Engineer",
  location: "Islamabad, Pakistan",
  timezone: "PKT (UTC+5)",
  email: "hello@byanees.com",
  phone: "+92 339 000 4208",
  phoneHref: "tel:+923390004208",
  linkedin: "https://www.linkedin.com/in/byaneees/",
  github: "https://github.com/byanees",
  upwork: "https://www.upwork.com/freelancers/~018e9a658c85846d75",
  cvUrl: "/assets/cv/Muhammad-Anees-Full-Stack-Engineer-CV.pdf",
  /** Set to an image path (e.g. "/assets/imgs/me/portrait.webp") to replace the About page placeholder. */
  portrait: null as string | null,
  heroLead:
    "3+ years building fintech, telco, and enterprise platforms. Now on .NET 9, ABP.io, and Angular micro-frontends at Systems Limited.",
  /** About page opening line. Deliberately different from heroLead, which the
   *  home hero already prints. */
  aboutLead:
    "I work on the parts of a product that have to stay up: payment rails, schedulers, and the services behind them. Three years in, mostly fintech and telecom.",
  summary:
    "I've led the backend for telco agent apps serving 60,000+ agents across Tanzania, delivered Request to Pay to 4,000+ merchants, and built a scheduler that pushes 700-800k notifications per run. Today I build enterprise-grade distributed systems on .NET 9, ABP.io, and Angular micro-frontends, using domain-driven design and clean architecture, with AI-assisted development as part of my daily workflow.",
};

export const ELSEWHERE = [
  { label: "LinkedIn", href: PROFILE.linkedin },
  { label: "GitHub", href: PROFILE.github },
  { label: "Upwork", href: PROFILE.upwork },
  { label: "Download CV", href: PROFILE.cvUrl, download: true },
];

type Highlight = { value: string; label: string };

export type ExperienceItem = {
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
    period: "Jan 2026 - Present",
    company: "Systems Limited",
    role: "AI-Native Full Stack Engineer",
    location: "Islamabad, PK",
    current: true,
    summary:
      "Building REST APIs on .NET 9 and ABP.io with domain-driven design across a microservices architecture, and Angular micro-frontend features for multiple product teams.",
    highlights: [
      { value: "40", label: "person delivery team, coordinated daily" },
      { value: "9", label: "dashboards, each served by one cached API" },
    ],
    stack: [".NET 9", "ABP.io", "Angular", "DDD", "HyperPay"],
  },
  {
    period: "Aug 2024 - Jan 2026",
    company: "DPL",
    role: "Software Engineer",
    location: "Islamabad, PK",
    summary:
      "Led development of enterprise telecom agent apps for Tanzania and Togo, managing a small engineering team, and built payment and messaging systems at scale.",
    highlights: [
      { value: "4,000+", label: "merchants on Request to Pay" },
      { value: "700-800k", label: "notifications per run" },
      { value: "600k+", label: "concurrent sessions" },
    ],
    stack: [".NET 8", "Microservices", "Redis", "EMV QR"],
  },
  {
    period: "Dec 2023 - Aug 2024",
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
    period: "Mar 2023 - Aug 2023",
    company: "LantroTech & Bytewise",
    role: "Web Developer & MERN Stack Fellow",
    location: "Islamabad, PK",
    summary:
      "Developed reusable React components for a payment gateway platform, and built REST APIs with Node.js, Express, and MongoDB in a 4-member backend team.",
    highlights: [{ value: "35%", label: "less UI development time" }],
    stack: ["React", "Node.js", "Express", "MongoDB"],
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

/** The stack as layers a request passes through, top to bottom. From the CV's skills section. */
export const STACK_LAYERS = [
  {
    key: "interface",
    name: "Interface",
    role: "What people click, scan, and export.",
    items: ["Angular", "React", "Next.js", "TypeScript", "Micro-frontends", "Redux Toolkit", "Tailwind CSS"],
    usedIn: ["qualification-certificate-workflow", "backend-aggregation-layer"],
  },
  {
    key: "services",
    name: "Services",
    role: "APIs and business rules, split into services.",
    items: [".NET 9", ".NET Core", "ABP.io", ".NET Aspire", "Node.js", "REST", "WebSockets"],
    usedIn: ["request-to-pay", "bulk-push-notification-scheduler", "otapp-bus-ticketing"],
  },
  {
    key: "data",
    name: "Data & messaging",
    role: "Where state lives and work gets queued.",
    items: ["PostgreSQL", "EF Core", "Redis", "AWS SQS"],
    usedIn: ["redis-connection-multiplexing"],
  },
  {
    key: "platform",
    name: "Platform",
    role: "Containers, gateways, and cloud underneath.",
    items: ["Docker", "Kubernetes", "AWS EC2, S3 & Lambda", "Nginx", "WSO2"],
    usedIn: [] as string[],
  },
  {
    key: "delivery",
    name: "Delivery",
    role: "Shipping changes and watching them run.",
    items: ["Jenkins", "GitHub Actions", "ELK"],
    usedIn: ["preprod-image-promotion"],
  },
];

export const STACK_PRINCIPLES = ["Clean Architecture", "Domain-driven design", "QR / TLV encoding", "AI-assisted development"];

/** Education and certifications, from the CV. */
export const EDUCATION = {
  degree: "BS Computer Science",
  school: "COMSATS University Islamabad",
  period: "Sept 2020 - June 2024",
  coursework: [
    "Data Structures & Algorithms",
    "Database Systems",
    "Operating Systems",
    "Object Oriented Programming",
    "Machine Learning & DevOps",
  ],
};

export const CERTIFICATIONS = [
  "Cybersecurity Essentials V3",
  "OWASP 2021: Web Application Security Awareness",
];

export const LANGUAGES = [
  { name: "English", level: "Fluent" },
  { name: "Urdu", level: "Native" },
];
