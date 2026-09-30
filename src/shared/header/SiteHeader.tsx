// The site header: one dark pill, centred.
//
// At the top of a page it is the full menu. Once you scroll it folds down to
// the page you're on and a ring that fills as you read; hovering or focusing it
// unfolds it again. On phones the ring opens a sheet that drops out of the pill.
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
  const scrolled = useScrolled(90);
  const [engaged, setEngaged] = useState(false);
  const [sheetOpen, setSheetOpen] = useState(false);
  const [paletteOpen, setPaletteOpen] = useState(false);
  // "⌘" until we know the visitor isn't on a Mac; set after hydration so the
  // prerendered markup matches.
  const [modKey, setModKey] = useState("⌘");
  const expanded = !scrolled || engaged;

  const nowRef = useRef<HTMLDivElement>(null);
  const linksRef = useRef<HTMLDivElement>(null);
  const blobRef = useRef<HTMLSpanElement>(null);
  const ringRef = useRef<SVGCircleElement>(null);

  useScrollLock(sheetOpen);

  useEffect(() => {
    setSheetOpen(false);
    setPaletteOpen(false);
    setEngaged(false);
  }, [pathname]);

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

  // The two folding regions get explicit pixel widths so the pill can animate
  // between them; `width: auto` does not transition.
  const measure = useCallback(() => {
    const now = nowRef.current;
    const links = linksRef.current;
    if (!now || !links) return;
    const nowW = (now.firstElementChild as HTMLElement).scrollWidth;
    const linksW = (links.firstElementChild as HTMLElement).scrollWidth;
    now.style.width = expanded ? "0px" : `${nowW}px`;
    links.style.width = expanded ? `${linksW}px` : "0px";
  }, [expanded]);

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

  const current = NAV_LINKS[active] ?? NAV_LINKS[0];
  const foldedTab = expanded ? undefined : -1;

  return (
    <>
      <header className="site-nav" data-expanded={expanded || undefined} data-sheet={sheetOpen || undefined}>
        <div className="site-nav__scrim" onClick={() => setSheetOpen(false)} aria-hidden="true" />

        <div
          className="site-nav__pill"
          onMouseEnter={() => setEngaged(true)}
          onMouseLeave={() => setEngaged(false)}
          onFocus={() => setEngaged(true)}
          onBlur={(e) => {
            if (!e.currentTarget.contains(e.relatedTarget as Node)) setEngaged(false);
          }}
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
                    tabIndex={foldedTab}
                    onMouseEnter={(e) => moveBlob(e.currentTarget)}
                    onFocus={(e) => moveBlob(e.currentTarget)}
                  >
                    {l.label}
                  </NavLink>
                ))}
                <button
                  type="button"
                  className="site-nav__search"
                  tabIndex={foldedTab}
                  onClick={openPalette}
                  aria-label="Search the site"
                  aria-keyshortcuts="Meta+K Control+K /"
                >
                  <SearchIcon />
                  <kbd>{modKey} K</kbd>
                </button>
                <Link to="/contact" className="site-nav__cta" tabIndex={foldedTab}>
                  {CTA.letsTalk}
                </Link>
              </div>
            </nav>

            <button
              type="button"
              className="site-nav__ring"
              aria-label={sheetOpen ? "Close menu" : expanded ? "Menu" : "Open menu"}
              aria-expanded={sheetOpen}
              onClick={() => {
                if (window.matchMedia(PHONE_QUERY).matches) setSheetOpen((v) => !v);
                else setEngaged((v) => !v);
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
      <CommandPalette open={paletteOpen} onClose={() => setPaletteOpen(false)} />
    </>
  );
}
