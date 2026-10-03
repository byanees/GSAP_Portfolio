// What Anees is open to, in every wording the site uses. When availability
// changes (a new job, no more freelance, relocation settled), this is the one
// file to edit: the footer status, home and contact pages, About page cards and
// FAQ, the contact page's meta description, and llms.txt all read from here.
//
// Import other data files with a relative path; see profile.ts.

import { PROFILE } from "./profile";

const ROLES = "full stack & backend roles";

export const AVAILABILITY = {
  /** Bolded inside the home CTA line. */
  roles: ROLES,
  /** The status line beside the green dot, in the footer and the contact hero. */
  status: `Open to ${ROLES}`,
  /** Home and portfolio CTA, after the bolded roles. */
  // ctaTail: ", and to scoped freelance work.",
  ctaTail: ".",
  /** The contact page's "Open to" row. */
  // contactSummary: "Full-time roles & freelance projects",
  contactSummary: "Full-time roles",
  /** Closes the contact page's meta description. */
  // metaLine: "Open to full-time, remote, and freelance work.",
  metaLine: "Open to full-time and remote work.",
  /** The answer llms.txt gives an assistant asked whether Anees is for hire. */
  assistantAnswer:
    // "Yes: open to full-time full stack or backend roles, fully remote or with relocation (visa sponsorship needed), and to freelance or contract work through Upwork or directly.",
    // "Yes: open to full-time full stack or backend roles, fully remote or with relocation (visa sponsorship needed), and to freelance or contract work.",
    "Yes: open to full-time full stack or backend roles, fully remote or with relocation (visa sponsorship needed).",

  /** The two "work with me" cards on the About page. */
  fullTime: {
    title: "Full-time roles",
    description: "Full stack or backend roles where reliability matters: fintech, telecom, and enterprise platforms.",
    points: [
      `Based in ${PROFILE.location}, ${PROFILE.timezone}`,
      "Open to relocation or fully remote roles",
      "Visa sponsorship needed for relocation",
    ],
  },
  // freelance: {
  //   title: "Freelance & contract",
  //   description:
  //     "Scoped backend or full stack work: APIs, payment integrations, dashboards, or moving an existing .NET or React codebase forward.",
  //   // points: ["Hire through Upwork, or contract directly", "Scope agreed up front, before any code"],
  //   points: ["Contract directly", "Scope agreed up front, before any code"],
  // },

  /** About page FAQ answers on availability. */
  faq: {
    roles:
      "Yes. I'm open to full stack and backend roles, either on-site after relocation or fully remote. Relocation would need visa sponsorship.",
    // freelance:
    //   // "Yes, for well-scoped backend or full stack work. You can hire me through Upwork or contract directly, and we agree on the scope before any code is written.",
    //   "Yes, for well-scoped backend or full stack work. You can contract me directly, and we agree on the scope before any code is written.",
  },
};
