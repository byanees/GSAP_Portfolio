// The site header: one dark pill, centred.
//
// At the top of a page it is the full menu. Once you scroll it folds down to
// the page you're on and a ring that fills as you read; hovering or focusing it
// unfolds it again. On phones the ring opens a sheet that drops out of the pill.
//
// React only tracks the rare changes: scrolled past the fold point, pinned open
// from the ring, sheet or palette open. Hover and keyboard focus unfold the
// pill in CSS (:hover, :focus-within), so moving the pointer over it costs no
// renders. The folded widths are measured once and handed to CSS as custom
// properties, since `width: auto` does not transition.
//
// ⌘K / Ctrl+K, or "/" outside a text field, opens the command palette, which
// also reaches case studies, posts, and the contact actions.

import { Link, NavLink, useLocation } from "react-router-dom";
import { useCallback, useEffect, useLayoutEffect, useRef, useState } from "react";
import { PROFILE } from "@/data/profile";
import { CTA } from "@/data/navigation";
import CommandPalette from "./CommandPalette";
import { NAV_LINKS, activeIndex, useScrollLock, useScrollProgress, useScrolled } from "./nav";

const RING = 2 * Math.PI * 15;
/** Folds past this scroll depth, and unfolds again only above FOLD_EXIT. */
const FOLD_AT = 120;
const FOLD_EXIT = 48;
/** Below this the pill never unfolds sideways; the ring opens the sheet instead. */
const PHONE_QUERY = "(max-width: 991.98px)";

function isTyping(el: Element | null) {
  if (!el) return false;
  const tag = el.tagName;
  return tag === "INPUT" || tag === "TEXTAREA" || tag === "SELECT" || (el as HTMLElement).isContentEditable;
}

function SearchIcon() {
  return (
    <svg viewBox="0 0 16 16" fill="none" aria-hidden="true">
      <circle cx="7" cy="7" r="4.75" stroke="currentColor" strokeWidth="1.5" />
      <path d="M10.5 10.5 14 14" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}

export default function SiteHeader() {
  const { pathname } = useLocation();
  const active = activeIndex(pathname);
  const scrolled = useScrolled(FOLD_AT, FOLD_EXIT);
  const [pinned, setPinned] = useState(false);
  const [sheetOpen, setSheetOpen] = useState(false);
  const [paletteOpen, setPaletteOpen] = useState(false);
  // "⌘" until we know the visitor isn't on a Mac; set after hydration so the
  // prerendered markup matches.
  const [modKey, setModKey] = useState("⌘");
  /** Unfolded by scroll position alone; hover and focus are CSS's business. */
  const expanded = !scrolled;

  const headerRef = useRef<HTMLElement>(null);
  const nowRef = useRef<HTMLDivElement>(null);
  const linksRef = useRef<HTMLDivElement>(null);
  const blobRef = useRef<HTMLSpanElement>(null);
  const ringRef = useRef<SVGCircleElement>(null);

  useScrollLock(sheetOpen);

  useEffect(() => {
    setSheetOpen(false);
    setPaletteOpen(false);
    setPinned(false);
  }, [pathname]);

  // Back at the top the menu is open anyway, so a pin has nothing left to do.
  useEffect(() => {
    if (!scrolled) setPinned(false);
  }, [scrolled]);

  useEffect(() => {
    if (!/Mac|iPhone|iPad/.test(navigator.platform || navigator.userAgent)) setModKey("Ctrl");
  }, []);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setPaletteOpen((v) => !v);
      } else if (e.key === "/" && !e.metaKey && !e.ctrlKey && !e.altKey && !isTyping(document.activeElement)) {
        e.preventDefault();
        setPaletteOpen(true);
      } else if (e.key === "Escape") {
        setSheetOpen(false);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  // The natural width of each folding region, for CSS to animate between.
  // Only the current-page label changes with the route; nothing else moves.
  const measure = useCallback(() => {
    const header = headerRef.current;
    const now = nowRef.current?.firstElementChild as HTMLElement | undefined;
    const links = linksRef.current?.firstElementChild as HTMLElement | undefined;
    if (!header || !now || !links) return;
    header.style.setProperty("--site-nav-now-w", `${now.scrollWidth}px`);
    header.style.setProperty("--site-nav-links-w", `${links.scrollWidth}px`);
  }, []);

  useLayoutEffect(() => {
    measure();
  }, [measure, pathname]);

  useEffect(() => {
    window.addEventListener("resize", measure);
    void document.fonts?.ready.then(measure);
    return () => window.removeEventListener("resize", measure);
  }, [measure]);

  // The highlight rests on the active link and slides to whichever is hovered.
  const moveBlob = useCallback(
    (el: HTMLElement | null) => {
      const blob = blobRef.current;
      if (!blob) return;
      const target = el ?? linksRef.current?.querySelectorAll<HTMLElement>(".site-nav__link")[active] ?? null;
      if (!target) {
        blob.style.opacity = "0";
        return;
      }
      blob.style.opacity = "1";
      blob.style.transform = `translateX(${target.offsetLeft}px)`;
      blob.style.width = `${target.offsetWidth}px`;
    },
    [active],
  );

  useLayoutEffect(() => moveBlob(null), [moveBlob]);
  useEffect(() => {
    void document.fonts?.ready.then(() => moveBlob(null));
  }, [moveBlob]);

  useScrollProgress(
    useCallback((p: number) => {
      if (ringRef.current) ringRef.current.style.strokeDashoffset = String(RING * (1 - p));
    }, []),
  );

  const openPalette = () => {
    setSheetOpen(false);
    setPaletteOpen(true);
  };
  const closePalette = useCallback(() => setPaletteOpen(false), []);

  const current = NAV_LINKS[active] ?? NAV_LINKS[0];

  return (
    <>
      <header
        ref={headerRef}
        className="site-nav"
        data-expanded={expanded || undefined}
        data-pinned={pinned || undefined}
        data-sheet={sheetOpen || undefined}
      >
        <div className="site-nav__scrim" onClick={() => setSheetOpen(false)} aria-hidden="true" />

        <div
          className="site-nav__pill"
        >
          <div className="site-nav__row">
            <Link to="/" className="site-nav__mark" aria-label={`${PROFILE.name}, home`}>
              {PROFILE.initials}
            </Link>

            <div className="site-nav__fold site-nav__now" ref={nowRef} aria-hidden={expanded}>
              <span className="site-nav__now-inner">
                <span className="site-nav__pulse" aria-hidden="true" />
                <span key={current.to} className="site-nav__now-label">
                  {current.label}
                </span>
              </span>
            </div>

            <nav className="site-nav__fold site-nav__links" ref={linksRef} aria-label="Primary">
              <div className="site-nav__links-inner" onMouseLeave={() => moveBlob(null)}>
                <span className="site-nav__blob" ref={blobRef} aria-hidden="true" />
                {NAV_LINKS.map((l) => (
                  <NavLink
                    key={l.to}
                    to={l.to}
                    end={l.to === "/"}
                    className="site-nav__link"
                    onMouseEnter={(e) => moveBlob(e.currentTarget)}
                    onFocus={(e) => moveBlob(e.currentTarget)}
                  >
                    {l.label}
                  </NavLink>
                ))}
                <button
                  type="button"
                  className="site-nav__search"
                  onClick={openPalette}
                  aria-label="Search the site"
                  aria-keyshortcuts="Meta+K Control+K /"
                >
                  <SearchIcon />
                  <kbd>{modKey} K</kbd>
                </button>
              </div>
            </nav>

            <button
              type="button"
              className="site-nav__ring"
              aria-label={sheetOpen ? "Close menu" : "Menu"}
              aria-expanded={sheetOpen || pinned}
              onClick={() => {
                if (window.matchMedia(PHONE_QUERY).matches) setSheetOpen((v) => !v);
                else setPinned((v) => !v);
              }}
            >
              <svg viewBox="0 0 36 36" aria-hidden="true">
                <circle className="site-nav__ring-track" cx="18" cy="18" r="15" />
                <circle
                  ref={ringRef}
                  className="site-nav__ring-fill"
                  cx="18"
                  cy="18"
                  r="15"
                  strokeDasharray={RING}
                  strokeDashoffset={RING}
                />
              </svg>
              <span className="site-nav__glyph" aria-hidden="true">
                <i />
                <i />
              </span>
            </button>
          </div>

          <div className="site-nav__sheet" inert={!sheetOpen}>
            <div className="site-nav__sheet-inner">
              <button type="button" className="site-nav__sheet-search" onClick={openPalette}>
                <SearchIcon />
                Search pages, case studies, posts…
              </button>
              <nav aria-label="Primary">
                {NAV_LINKS.map((l, i) => (
                  <NavLink
                    key={l.to}
                    to={l.to}
                    end={l.to === "/"}
                    className="site-nav__sheet-link"
                    style={{ transitionDelay: sheetOpen ? `${80 + i * 45}ms` : "0ms" }}
                  >
                    <span className="site-nav__sheet-idx">{l.index}</span>
                    {l.label}
                  </NavLink>
                ))}
              </nav>
              <div className="site-nav__sheet-foot">
                <a href={`mailto:${PROFILE.email}`}>{PROFILE.email}</a>
                <a href={PROFILE.cvUrl} download>
                  {CTA.downloadCv}
                </a>
              </div>
            </div>
          </div>
        </div>
      </header>
      <CommandPalette open={paletteOpen} onClose={closePalette} />
    </>
  );
}
