// Earlier client and product work, picked from the old portfolio (ianees.vercel.app/projects)
// for measurable impact. Metrics come from the CV.

import type { Result } from "./caseStudies";

export type Project = {
  slug: string;
  title: string;
  meta: string;
  role: string;
  /** Public domain shown in the card's address bar; omitted for client-owned builds. */
  domain?: string;
  href?: string;
  description: string;
  results: Result[];
  stack: string[];
};

export const PROJECTS: Project[] = [
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
