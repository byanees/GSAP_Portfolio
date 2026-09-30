// The header's link list and the small hooks the Island nav and the command
// palette share.

import { useEffect, useState } from "react";
import { PAGES } from "@/data/navigation";

export type NavItem = {
  to: string;
  /** The header wording ("About Me"). */
  label: string;
  /** "01", "02", … */
  index: string;
};

export const NAV_LINKS: NavItem[] = PAGES.map((p, i) => ({
  to: p.to,
  label: p.menuLabel ?? p.label,
  index: String(i + 1).padStart(2, "0"),
}));

/** Index of the link the path belongs to; "/portfolio/x" counts as Portfolio. */
export function activeIndex(pathname: string) {
  if (pathname === "/") return 0;
  return NAV_LINKS.findIndex((l) => l.to !== "/" && (pathname === l.to || pathname.startsWith(`${l.to}/`)));
}

/**
 * True once the page has scrolled past `enterAt` pixels, and false again only
 * back above `leaveAt`. The gap stops anything tied to it from flapping while
 * someone scrolls slowly around a single threshold.
 */
export function useScrolled(enterAt: number, leaveAt = enterAt) {
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const onScroll = () =>
      setScrolled((was) => (was ? window.scrollY > leaveAt : window.scrollY >= enterAt));
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [enterAt, leaveAt]);
  return scrolled;
}

/** Calls `onChange` with scroll progress (0–1), at most once per frame. */
export function useScrollProgress(onChange: (progress: number) => void) {
  useEffect(() => {
    let frame = 0;
    const read = () => {
      frame = 0;
      const max = document.documentElement.scrollHeight - window.innerHeight;
      onChange(max > 0 ? Math.min(1, Math.max(0, window.scrollY / max)) : 0);
    };
    const schedule = () => {
      if (!frame) frame = requestAnimationFrame(read);
    };
    read();
    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", schedule);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", schedule);
    };
  }, [onChange]);
}

/** Locks page scroll while an overlay is open. */
export function useScrollLock(locked: boolean) {
  useEffect(() => {
    if (!locked) return;
    const root = document.documentElement;
    const prev = root.style.overflow;
    root.style.overflow = "hidden";
    return () => {
      root.style.overflow = prev;
    };
  }, [locked]);
}
