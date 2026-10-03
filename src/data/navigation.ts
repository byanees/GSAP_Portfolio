// The site's pages and outbound links, and the button labels that repeat across
// it. The header menu, both footers, the 404 page, and the breadcrumb trail in
// the structured data all read from here.

import { PROFILE } from "./profile";

export type Page = {
  to: string;
  /** Footers and the 404 page. */
  label: string;
  /** The header menu, where it differs from `label`. */
  menuLabel?: string;
  /** The page's name in the breadcrumb trail search engines show. */
  crumb: string;
};

export const PAGES: Page[] = [
  { to: "/", label: "Home", crumb: "Home" },
  { to: "/about", label: "About", menuLabel: "About Me", crumb: "About" },
  { to: "/portfolio", label: "Portfolio", crumb: "Work" },
  { to: "/blog", label: "Blog", crumb: "Notes" },
  { to: "/contact", label: "Contact", crumb: "Contact" },
];

/** A page's breadcrumb name, by path. */
export function crumbFor(path: string) {
  return PAGES.find((p) => p.to === path)?.crumb ?? "";
}

/** Labels used on more than one page, so they cannot drift apart. */
export const CTA = {
  downloadCv: "Download CV",
  getInTouch: "Get in touch",
  viewCaseStudies: "View case studies",
  // hireOnUpwork: "Hire on Upwork",
  whatsapp: "Chat on WhatsApp",
};

/** Profiles elsewhere, and the CV. Listed in both footers. */
export const ELSEWHERE = [
  { label: "LinkedIn", href: PROFILE.linkedin },
  { label: "GitHub", href: PROFILE.github },
  // { label: "Upwork", href: PROFILE.upwork },
  { label: CTA.downloadCv, href: PROFILE.cvUrl, download: true },
];
