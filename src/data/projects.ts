// Projects beyond the case studies: recent platform and product builds first, then
// earlier client work picked from the old portfolio (ianees.vercel.app/projects).
// Metrics come from the CV or Anees' own project write-ups.

import type { Result } from "./caseStudies";

export type Project = {
  slug: string;
  title: string;
  meta: string;
  role: string;
  /** Public domain shown in the card's address bar; omitted for client-owned builds. */
  domain?: string;
  /** Shown in the address bar instead of a domain, for builds with no public URL. */
  owner?: string;
  href?: string;
  /** Case studies that go deeper into parts of this project, linked from the card. */
  caseStudies?: string[];
  description: string;
  results: Result[];
  stack: string[];
};

export const PROJECTS: Project[] = [
  {
    slug: "telco-agent-apps",
    title: "Telco Agent Apps: Tanzania & Togo",
    meta: "DPL, Aug 2025 - Jan 2026",
    role: "Backend lead",
    owner: "Internal telco platform",
    description:
      "Enterprise agent apps for telco operators, serving 60,000+ agents across Tanzania with nationwide coverage planned for both countries. I led backend development and the technical architecture: SIM registration, SIM swap, SIM stock, agent inventory, and airtime and bundle subscriptions, integrated with existing telco and legacy systems. I also built Tanzania's B2B and B2C onboarding, including Kinara, bulk, and enterprise registrations, and ran the backend team's code reviews and mentoring.",
    results: [
      { value: "60,000+", label: "agents across Tanzania" },
      { value: "2", label: "countries, with nationwide coverage planned" },
    ],
    stack: [".NET Core", "PostgreSQL", "Angular", "Jenkins"],
    caseStudies: ["preprod-image-promotion"],
  },
  {
    slug: "emv-qr-p2p-payments",
    title: "EMV QR Peer-to-Peer Payments",
    meta: "DPL, 2024 - 2026",
    role: "Backend",
    owner: "Internal fintech platform",
    description:
      "A P2P QR payment system with static and dynamic codes, built to the EMV® QR Code standard. The QR data structure is TLV (Tag-Length-Value) encoded, and scanned codes are parsed back into their fields, so users can scan a code and start a peer-to-peer transaction inside the app.",
    results: [
      { value: "Static + dynamic", label: "QR codes on one EMV-compliant format" },
      { value: "Scan to pay", label: "P2P transfers started straight from a QR" },
    ],
    stack: [".NET", "Microservices", "EMV QR", "TLV encoding"],
  },
  {
    slug: "dooattend",
    title: "DooAttend",
    meta: "Mar 2025 - Jul 2025",
    role: "Backend",
    owner: "Private build",
    description:
      "A workforce platform for users, events, attendance, shift scheduling, tasks, and leave. I designed its MongoDB schemas with Mongoose, built JWT login with role-based access middleware for everyone from admins to employees, and connected a Python AI service to the Node.js backend so employees check in with a face scan. Modular middleware handles auth, error logging, and subscription checks; live chat and push notifications run on Socket.io and Firebase Cloud Messaging, and Stripe bills the subscriptions.",
    results: [
      { value: "Face scan", label: "contactless check-in through a Python AI service" },
      { value: "Real time", label: "chat and push notifications" },
    ],
    stack: ["Node.js", "MongoDB", "Socket.io", "Stripe", "Firebase", "AWS S3", "Python", "AI/ML"],
  },
  {
    slug: "chadgpt",
    title: "ChadGPT",
    meta: "Axontick Technologies, 2024",
    role: "Frontend",
    domain: "app.chadgpt.com",
    href: "https://app.chadgpt.com/",
    description:
      "An AI assistant that puts ChatGPT, DALL-E, and Llama 3 in one place. I built the responsive React frontend, with drag-and-drop chat management and saved prompts.",
    results: [
      { value: "3,000+", label: "people using it" },
      { value: "40%", label: "faster first load after lazy loading and code splitting" },
    ],
    stack: ["React", "ChatGPT API", "DALL-E", "Llama 3"],
  },
  {
    slug: "unitflix",
    title: "UnitFlix",
    meta: "Axontick Technologies, 2024",
    role: "Full stack",
    domain: "unitflix.com",
    href: "https://unitflix.com/",
    description:
      "A Dubai property platform where people explore, add, and view listings. I completed it end to end, including listing uploads and the admin approval flow.",
    results: [{ value: "30%", label: "faster listing approvals" }],
    stack: ["React", ".NET Core APIs"],
  },
  {
    slug: "high-end-care",
    title: "High End Care",
    meta: "Axontick Technologies, 2024",
    role: "Full stack",
    description:
      "Insurance for watches, jewelry, and bags. Risk is scored during onboarding, and high-risk requests are routed to an admin for verification.",
    results: [
      { value: "25%", label: "higher payment success rate" },
      { value: "40%", label: "less manual verification work" },
    ],
    stack: ["MongoDB", "Express", "React", "Node.js", "Stripe", "PassportJS"],
  },
  {
    slug: "photonbrains",
    title: "PhotonBrains",
    meta: "Client project",
    role: "Full stack",
    domain: "photonbrains.com",
    href: "https://photonbrains.com/",
    description:
      "A responsive MERN website with an admin panel for images, videos, and blog content, published in English and German.",
    results: [{ value: "40%", label: "shorter initial load with lazy loading" }],
    stack: ["MongoDB", "Express", "React", "Node.js"],
  },
];
