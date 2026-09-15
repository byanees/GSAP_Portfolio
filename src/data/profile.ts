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
  availability:
    "Open to full stack & backend roles in Saudi Arabia, UAE, Qatar, and remote across Europe. Visa sponsorship needed.",
  nowUpdated: "September 2026",
};

export const EXPERIENCE = [
  {
    date: "Jan 2026 — Present",
    title: "AI-Native Full Stack Engineer [ Systems Limited ]",
    desc: "Building REST APIs on .NET 9 and ABP.io with domain-driven design across a microservices architecture, and Angular micro-frontend features for multiple product teams. Coordinating execution across developers, QA, and DevOps in a 40-person delivery team.",
  },
  {
    date: "Aug 2024 — Jan 2026",
    title: "Software Engineer [ DPL ]",
    desc: "Led development of enterprise telecom agent apps for Tanzania and Togo. Built EMV QR payments, Request to Pay (4,000+ merchants), a bulk push notification scheduler (700–800k per run), and batch payment validation that cut processing errors by 30%.",
  },
  {
    date: "Dec 2023 — Aug 2024",
    title: "Full Stack Developer [ Axontick Technologies ]",
    desc: "Built the React frontend for an AI assistant serving 3,000+ users, completed a Dubai property platform on React and .NET Core, and integrated Stripe and PassportJS across client products.",
  },
  {
    date: "Mar 2023 — Aug 2023",
    title: "Web Developer & MERN Stack Fellow [ LantroTech & Bytewise ]",
    desc: "Developed reusable React components for a payment gateway platform, and built REST APIs with Node.js, Express, and MongoDB in a 4-member backend team.",
  },
  {
    date: "Sept 2020 — June 2024",
    title: "BS Computer Science [ COMSATS University Islamabad ]",
    desc: "Completed my degree while building real-world experience through a fellowship, an internship, and full stack client work.",
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
    items: [".NET Core / .NET 9", "ABP.io", ".NET Aspire", "Node.js", "PostgreSQL", "Redis", "EF Core", "RESTful APIs", "Microservices"],
  },
  {
    key: "frontend",
    title: "Frontend",
    items: ["Angular", "React", "Next.js", "Micro-frontends", "TypeScript", "Redux Toolkit", "Tailwind CSS"],
  },
  {
    key: "infrastructure",
    title: "Infrastructure",
    items: ["Docker", "Kubernetes", "Jenkins", "GitHub Actions", "AWS (EC2, S3, SQS, Lambda)", "ELK", "WSO2", "Nginx"],
  },
  {
    key: "architecture",
    title: "Architecture",
    items: ["Clean Architecture", "DDD", "QR / TLV encoding", "REST", "WebSockets"],
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
