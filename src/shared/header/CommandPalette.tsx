// The ⌘K palette: pages, case studies, posts, and the things people come to do
// (copy the email, grab the CV, open WhatsApp), all behind one fuzzy filter.
// Arrow keys move, Enter runs, Esc closes. On phones it fills the screen.

import { memo, useEffect, useMemo, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { CASE_STUDIES } from "@/data/caseStudies";
import { POSTS } from "@/data/posts";
import { PROFILE } from "@/data/profile";
import { CTA } from "@/data/navigation";
import { NAV_LINKS, useScrollLock } from "./nav";

type Command = {
  id: string;
  group: "Go to" | "Case studies" | "Notes" | "Actions";
  title: string;
  hint?: string;
  /** Return "keep-open" to leave the palette up afterwards. */
  run: () => void | "keep-open";
};

const GROUPS: Command["group"][] = ["Go to", "Case studies", "Notes", "Actions"];

/** Scores at or above this are subsequence matches, not substrings. */
const SUBSEQUENCE = 1000;

/** Substring first, then subsequence; lower is better, -1 is no match. */
function score(query: string, text: string) {
  if (!query) return 0;
  const q = query.toLowerCase();
  const t = text.toLowerCase();
  const direct = t.indexOf(q);
  if (direct >= 0) return direct;
  let ti = 0;
  let gaps = 0;
  for (const ch of q) {
    const found = t.indexOf(ch, ti);
    if (found < 0) return -1;
    gaps += found - ti;
    ti = found + 1;
  }
  return SUBSEQUENCE + gaps;
}

type Props = { open: boolean; onClose: () => void };

function CommandPalette({ open, onClose }: Props) {
  const navigate = useNavigate();
  const [query, setQuery] = useState("");
  const [cursor, setCursor] = useState(0);
  const [copied, setCopied] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLDivElement>(null);

  useScrollLock(open);

  const commands = useMemo<Command[]>(() => {
    const go = (to: string) => () => navigate(to);
    const visit = (href: string) => () => void window.open(href, "_blank", "noopener");
    return [
      ...NAV_LINKS.map((l) => ({ id: `page-${l.to}`, group: "Go to" as const, title: l.label, hint: l.to, run: go(l.to) })),
      ...CASE_STUDIES.map((c) => ({
        id: `case-${c.slug}`,
        group: "Case studies" as const,
        title: c.title,
        hint: c.domain,
        run: go(`/portfolio/${c.slug}`),
      })),
      ...POSTS.map((p) => ({ id: `post-${p.slug}`, group: "Notes" as const, title: p.title, run: go(`/blog/${p.slug}`) })),
      {
        id: "copy-email",
        group: "Actions",
        title: "Copy email address",
        hint: PROFILE.email,
        run: () => {
          void navigator.clipboard?.writeText(PROFILE.email);
          setCopied(true);
          window.setTimeout(() => setCopied(false), 1600);
          return "keep-open";
        },
      },
      {
        id: "cv",
        group: "Actions",
        title: CTA.downloadCv,
        hint: "PDF",
        run: () => {
          const a = document.createElement("a");
          a.href = PROFILE.cvUrl;
          a.download = "";
          a.click();
        },
      },
      { id: "whatsapp", group: "Actions", title: CTA.whatsapp, hint: PROFILE.phone, run: visit(PROFILE.whatsapp) },
      { id: "linkedin", group: "Actions", title: "Open LinkedIn", run: visit(PROFILE.linkedin) },
      { id: "github", group: "Actions", title: "Open GitHub", run: visit(PROFILE.github) },
    ];
  }, [navigate]);

  const results = useMemo(() => {
    const q = query.trim();
    let scored = commands
      .map((c, i) => ({ c, i, s: score(q, `${c.title} ${c.hint ?? ""}`) }))
      .filter((r) => r.s >= 0);
    // Loose subsequence hits are only worth showing when nothing contains the
    // query outright.
    if (scored.some((r) => r.s < SUBSEQUENCE)) scored = scored.filter((r) => r.s < SUBSEQUENCE);
    // The group holding the best match leads; with no query, groups keep their
    // order. Within a group, the closest match comes first.
    const best = new Map<string, number>();
    for (const r of scored) best.set(r.c.group, Math.min(best.get(r.c.group) ?? Infinity, r.s));
    const groupRank = (g: string) => (q ? best.get(g)! * GROUPS.length : 0) + GROUPS.indexOf(g as Command["group"]);
    return scored
      .sort((a, b) => groupRank(a.c.group) - groupRank(b.c.group) || a.s - b.s || a.i - b.i)
      .map((r) => r.c);
  }, [commands, query]);

  useEffect(() => setCursor(0), [query]);

  // Focus the field on open, and hand focus back to whatever opened it on close.
  useEffect(() => {
    if (!open) return;
    const opener = document.activeElement as HTMLElement | null;
    setQuery("");
    setCursor(0);
    const frame = requestAnimationFrame(() => inputRef.current?.focus());
    return () => {
      cancelAnimationFrame(frame);
      opener?.focus?.({ preventScroll: true });
    };
  }, [open]);

  useEffect(() => {
    listRef.current?.querySelector(`[data-idx="${cursor}"]`)?.scrollIntoView({ block: "nearest" });
  }, [cursor]);

  const runAt = (i: number) => {
    const cmd = results[i];
    if (cmd && cmd.run() !== "keep-open") onClose();
  };

  const onKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setCursor((c) => Math.min(results.length - 1, c + 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setCursor((c) => Math.max(0, c - 1));
    } else if (e.key === "Enter") {
      e.preventDefault();
      runAt(cursor);
    } else if (e.key === "Escape") {
      e.preventDefault();
      onClose();
    } else if (e.key === "Tab") {
      // The field is the palette; keep focus in it.
      e.preventDefault();
    }
  };

  const activeId = results[cursor] ? `cmdk-${results[cursor].id}` : undefined;
  let lastGroup = "";

  return (
    <div className="cmdk" data-open={open || undefined} inert={!open}>
      <div className="cmdk__scrim" onClick={onClose} aria-hidden="true" />
      <div className="cmdk__panel" role="dialog" aria-modal="true" aria-label="Search the site">
        <div className="cmdk__input">
          <span className="cmdk__prompt" aria-hidden="true">
            &gt;
          </span>
          <input
            ref={inputRef}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={onKeyDown}
            placeholder="Search pages, case studies, posts…"
            aria-label="Search the site"
            role="combobox"
            aria-expanded="true"
            aria-controls="cmdk-list"
            aria-activedescendant={activeId}
            enterKeyHint="go"
            spellCheck={false}
            autoComplete="off"
          />
          <button type="button" className="cmdk__close" onClick={onClose} aria-label="Close search" tabIndex={-1}>
            <kbd>esc</kbd>
            <span className="cmdk__close-touch">Close</span>
          </button>
        </div>
        <div className="cmdk__list" id="cmdk-list" role="listbox" aria-label="Results" ref={listRef}>
          {open && results.length === 0 ? (
            <p className="cmdk__empty">
              No match for <b>{query}</b>. Try &ldquo;redis&rdquo;, &ldquo;cv&rdquo; or &ldquo;pay&rdquo;.
            </p>
          ) : null}
          {/* Built only while open: every page is prerendered, and a hidden
              list of every post and case study has no business in each one. */}
          {(open ? results : []).map((c, i) => {
            const label = c.group !== lastGroup ? c.group : null;
            lastGroup = c.group;
            return (
              <div key={c.id} role="presentation">
                {label ? (
                  <div className="cmdk__group" role="presentation">
                    {label}
                  </div>
                ) : null}
                <div
                  id={`cmdk-${c.id}`}
                  role="option"
                  aria-selected={i === cursor}
                  data-idx={i}
                  className="cmdk__item"
                  onMouseMove={() => setCursor(i)}
                  onClick={() => runAt(i)}
                >
                  <span className="cmdk__title">{c.id === "copy-email" && copied ? "Copied to clipboard ✓" : c.title}</span>
                  {c.hint ? <span className="cmdk__hint">{c.hint}</span> : null}
                </div>
              </div>
            );
          })}
        </div>
        <div className="cmdk__foot" aria-hidden="true">
          <span>
            <kbd>↑</kbd>
            <kbd>↓</kbd> move
          </span>
          <span>
            <kbd>↵</kbd> open
          </span>
          <span>
            <kbd>esc</kbd> close
          </span>
        </div>
      </div>
    </div>
  );
}

// Memoised: the header re-renders every time the pill folds or unfolds, and
// the palette has no reason to follow it while closed.
export default memo(CommandPalette);
