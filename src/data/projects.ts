// Earlier client and product work, picked from the old portfolio (ianees.vercel.app/projects)
// for measurable impact. Metrics come from the CV.

import type { Result } from "./caseStudies";

export type Project = {
  slug: string;
  title: string;
  meta: string;
  type: string;
  description: string;
  results: Result[];
  stack: string[];
  link?: { label: string; href: string };
};

export const PROJECTS: Project[] = [
  {
    slug: "chadgpt",
    title: "ChadGPT",
    meta: "Axontick Technologies · 2024",
    type: "AI assistant · React frontend",
    description:
      "Responsive React frontend for an AI assistant bringing ChatGPT, DALL-E, and Llama 3 into one interface, with drag-and-drop chat management and saved prompts.",
    results: [
      { value: "3,000+", label: "users" },
      { value: "40%", label: "faster initial load with lazy loading and code splitting" },
    ],
    stack: ["React", "ChatGPT API", "DALL-E", "Llama 3"],
    link: { label: "Live site", href: "https://app.chadgpt.com/" },
  },
  {
    slug: "unitflix",
    title: "UnitFlix",
    meta: "Axontick Technologies · 2024",
    type: "Dubai property platform",
    description:
      "Real estate platform for Dubai properties where users explore, add, and view listings, with listing uploads and admin approval workflows.",
    results: [{ value: "30%", label: "faster listing approvals" }],
    stack: ["React", ".NET Core APIs"],
    link: { label: "Live site", href: "https://unitflix.com/" },
  },
  {
    slug: "high-end-care",
    title: "High End Care",
    meta: "Axontick Technologies · 2024",
    type: "Luxury-item insurance platform",
    description:
      "Insurance platform for watches, jewelry, and bags. Risk is scored during onboarding, and high-risk requests are routed to admin verification.",
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
    type: "Portfolio site & CMS",
    description:
      "Responsive MERN website with an admin panel for managing images, videos, and blog content, in English and German.",
    results: [{ value: "40%", label: "shorter initial load with lazy loading" }],
    stack: ["MongoDB", "Express", "React", "Node.js"],
    link: { label: "Live site", href: "https://photonbrains.com/" },
  },
];
