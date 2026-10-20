import { useCallback, useEffect, useRef, useState, type CSSProperties, type KeyboardEvent, type PointerEvent } from "react";
import { flushSync } from "react-dom";
import { CTA } from "@/data/navigation";
import { ABOUT } from "@/data/pages/about";
import { EXPERIENCE, PROFILE } from "@/data/profile";
import Eyebrow from "./Eyebrow";
import { ARROW_SVG } from "./icons";

const COPY = ABOUT.experience;
const COUNT = EXPERIENCE.length;
/** Resting tilt of the cards behind the front one, so the stack reads as a hand-held deck. */
const TILTS = [0, -1.8, 1.4, -2.4];
const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

/** "Mar 2023" or "Sept 2020" → months since year 0. */
function toMonth(text: string): number | null {
    const m = text.trim().match(/^([A-Za-z]{3})[a-z]*\.?\s+(\d{4})$/);
    if (!m) return null;
    const month = MONTHS.indexOf(m[1]);
    return month < 0 ? null : Number(m[2]) * 12 + month;
}

/** Start and end month of a period like "Aug 2024 – Jan 2026". An open end ("Present") is null. */
function parsePeriod(period: string) {
    const [from, to = ""] = period.split(/\s+[–-]\s+/);
    return { start: toMonth(from), end: toMonth(to) };
}

/** Inclusive, the way LinkedIn and most CVs count: Mar–Aug is 6 months. */
function formatDuration(months: number) {
    const y = Math.floor(months / 12);
    const m = months % 12;
    const parts = [];
    if (y) parts.push(`${y} yr${y > 1 ? "s" : ""}`);
    if (m) parts.push(`${m} mo${m > 1 ? "s" : ""}`);
    return parts.join(" ");
}

/** "2024 – 2026", "2026 – Present", or "2023" for a role inside one year. */
function yearRange(period: string) {
    const { start, end } = parsePeriod(period);
    if (start == null) return period;
    const from = Math.floor(start / 12);
    if (end == null) return `${from} – ${period.split(/\s+[–-]\s+/)[1] ?? ""}`.trim();
    const to = Math.floor(end / 12);
    return from === to ? `${from}` : `${from} – ${to}`;
}

const ROLES = EXPERIENCE.map((item) => ({
    ...item,
    years: yearRange(item.period),
    span: parsePeriod(item.period),
}));

const reducedMotion = () => window.matchMedia?.("(prefers-reduced-motion: reduce)").matches ?? false;

type Drag = { id: number; x: number; y: number; dx: number; lastX: number; lastT: number; v: number; on: boolean };

/**
 * Career as a deck of cards, newest on top. Drag or swipe the front card away (or
 * use the buttons, arrow keys, or the index) to bring up the next role. Every card
 * is in the markup, so the full history is prerendered and indexable; only the
 * front one is interactive to assistive tech.
 */
export default function AboutExperience() {
    const [active, setActive] = useState(0);
    const [touched, setTouched] = useState(false);
    /** Current month, known only on the client, so prerendered markup never goes stale. */
    const [nowMonth, setNowMonth] = useState<number | null>(null);

    const activeRef = useRef(0);
    const busy = useRef(false);
    const drag = useRef<Drag | null>(null);
    const cards = useRef<(HTMLElement | null)[]>([]);
    const stackRef = useRef<HTMLDivElement>(null);

    /** Role open in the details sheet. Its content renders only while open, so the
     *  prerendered page carries each role's text once, on its card. */
    const [sheet, setSheet] = useState<number | null>(null);
    const sheetRef = useRef<HTMLDialogElement>(null);

    useEffect(() => {
        const dialog = sheetRef.current;
        if (sheet == null || !dialog) return;
        if (!dialog.open) dialog.showModal();
        const root = document.documentElement;
        const overflow = root.style.overflow;
        root.style.overflow = "hidden";
        return () => {
            root.style.overflow = overflow;
        };
    }, [sheet]);

    useEffect(() => {
        const d = new Date();
        setNowMonth(d.getFullYear() * 12 + d.getMonth());
    }, []);

    // On first sight, nudge the front card once so it reads as something that moves.
    useEffect(() => {
        const stack = stackRef.current;
        if (!stack || reducedMotion()) return;
        const io = new IntersectionObserver(
            ([entry]) => {
                if (!entry.isIntersecting) return;
                io.disconnect();
                stack.dataset.nudge = "";
            },
            { threshold: 0.45 },
        );
        io.observe(stack);
        return () => io.disconnect();
    }, []);

    const commit = useCallback((next: number) => {
        activeRef.current = next;
        flushSync(() => setActive(next));
    }, []);

    /** 1 sends the front card to the back of the deck, -1 pulls the back card to the front. */
    const deal = useCallback(
        (dir: 1 | -1) => {
            if (busy.current) return;
            setTouched(true);
            delete stackRef.current?.dataset.nudge;
            const from = activeRef.current;
            const to = (from + dir + COUNT) % COUNT;
            const front = cards.current[from];
            const stack = stackRef.current;
            if (!front || !stack || reducedMotion()) {
                if (front) {
                    delete front.dataset.motion;
                    front.style.transform = "";
                }
                commit(to);
                return;
            }

            const off = `translate3d(${-stack.offsetWidth * 1.15}px, -28px, 0) rotate(-14deg)`;
            busy.current = true;

            if (dir === 1) {
                // Throw the front card off to the left, then tuck it under the deck.
                front.dataset.motion = "fling";
                front.style.transform = off;
                window.setTimeout(() => {
                    commit(to);
                    delete front.dataset.motion;
                    front.style.transform = "";
                    busy.current = false;
                }, 320);
                return;
            }

            // Bring the back card in from where thrown cards went.
            const incoming = cards.current[to];
            delete front.dataset.motion;
            front.style.transform = "";
            if (!incoming) {
                commit(to);
                busy.current = false;
                return;
            }
            incoming.dataset.motion = "drag";
            incoming.style.transform = off;
            incoming.getBoundingClientRect();
            commit(to);
            requestAnimationFrame(() => {
                delete incoming.dataset.motion;
                incoming.style.transform = "";
                busy.current = false;
            });
        },
        [commit],
    );

    const jump = (index: number) => {
        if (index === activeRef.current) return;
        if (index === (activeRef.current + 1) % COUNT) return deal(1);
        if (index === (activeRef.current - 1 + COUNT) % COUNT) return deal(-1);
        setTouched(true);
        commit(index);
    };

    const onKeyDown = (e: KeyboardEvent) => {
        if (e.key === "ArrowRight" || e.key === "ArrowDown") deal(1);
        else if (e.key === "ArrowLeft" || e.key === "ArrowUp") deal(-1);
        else return;
        e.preventDefault();
    };

    const onPointerDown = (e: PointerEvent<HTMLElement>) => {
        if (busy.current || e.button !== 0) return;
        const t = performance.now();
        drag.current = { id: e.pointerId, x: e.clientX, y: e.clientY, dx: 0, lastX: e.clientX, lastT: t, v: 0, on: false };
    };

    const onPointerMove = (e: PointerEvent<HTMLElement>) => {
        const d = drag.current;
        if (!d || d.id !== e.pointerId) return;
        const el = e.currentTarget;
        const dx = e.clientX - d.x;
        const dy = e.clientY - d.y;
        if (!d.on) {
            if (Math.abs(dx) < 8 && Math.abs(dy) < 8) return;
            // A mostly vertical gesture is a page scroll, not a drag.
            if (Math.abs(dy) > Math.abs(dx)) {
                drag.current = null;
                return;
            }
            d.on = true;
            el.setPointerCapture(e.pointerId);
            el.dataset.motion = "drag";
            window.getSelection()?.removeAllRanges();
            delete stackRef.current?.dataset.nudge;
        }
        const t = performance.now();
        d.v = (e.clientX - d.lastX) / Math.max(t - d.lastT, 1);
        d.lastX = e.clientX;
        d.lastT = t;
        d.dx = dx;
        el.style.transform = `translate3d(${dx}px, ${dy * 0.12}px, 0) rotate(${dx * 0.045}deg)`;
    };

    const onPointerUp = (e: PointerEvent<HTMLElement>) => {
        const d = drag.current;
        drag.current = null;
        if (!d?.on) return;
        const el = e.currentTarget;
        const threshold = Math.min(140, el.offsetWidth * 0.22);
        const flick = Math.abs(d.v) > 0.6 && Math.abs(d.dx) > 30;
        if (d.dx < -threshold || (flick && d.v < 0)) {
            el.dataset.motion = "fling";
            deal(1);
        } else if (d.dx > threshold || (flick && d.v > 0)) {
            deal(-1);
        } else {
            delete el.dataset.motion;
            el.style.transform = "";
        }
    };

    const durationOf = (span: { start: number | null; end: number | null }) => {
        if (span.start == null) return null;
        const end = span.end ?? nowMonth;
        return end == null ? null : formatDuration(end - span.start + 1);
    };

    const current = ROLES[active];
    const open = sheet == null ? null : ROLES[sheet];
    const openDuration = open ? durationOf(open.span) : null;

    return (
        <section className="xp-section pt-120 pb-120" aria-labelledby="xp-title">
            <div className="container">
                <div className="row g-5">
                    <div className="col-lg-4">
                        <div className="xp-intro">
                            <Eyebrow>{COPY.eyebrow}</Eyebrow>
                            <h2 id="xp-title" className="h3 mb-20">
                                {COPY.title}
                            </h2>
                            <p className="neutral-500 fz-font-lg mb-30">{COPY.lead}</p>

                            <nav className="xp-index" aria-label={COPY.indexLabel}>
                                <ol>
                                    {ROLES.map((role, i) => (
                                        <li key={role.period}>
                                            <button
                                                type="button"
                                                className={`xp-index__row${i === active ? " is-active" : ""}`}
                                                aria-current={i === active ? "true" : undefined}
                                                onClick={() => jump(i)}
                                            >
                                                <span className="xp-index__name">
                                                    <span className="xp-index__company">{role.company}</span>
                                                    <span className="xp-index__role">{role.role}</span>
                                                </span>
                                                <span className="xp-index__years">{role.years}</span>
                                            </button>
                                        </li>
                                    ))}
                                </ol>
                            </nav>

                            <a href={PROFILE.cvUrl} download className="at-btn common-black border-bottom-900 bg-transparent rounded-0 p-0 pb-2">
                                <span>
                                    <span className="text-1">{CTA.downloadCv}</span>
                                    <span className="text-2">{CTA.downloadCv}</span>
                                </span>
                                <i>
                                    {ARROW_SVG}
                                    {ARROW_SVG}
                                </i>
                            </a>
                        </div>
                    </div>

                    <div className="col-lg-8">
                        <div
                            className="xp-deck"
                            role="region"
                            aria-roledescription="carousel"
                            aria-label={COPY.deckLabel}
                            tabIndex={0}
                            onKeyDown={onKeyDown}
                        >
                            <div className="xp-deck__stack" ref={stackRef}>
                                {ROLES.map((role, i) => {
                                    const depth = (i - active + COUNT) % COUNT;
                                    const isFront = depth === 0;
                                    const duration = durationOf(role.span);
                                    const style = {
                                        "--depth": depth,
                                        "--tilt": TILTS[depth % TILTS.length],
                                        zIndex: COUNT - depth,
                                    } as CSSProperties;
                                    return (
                                        <article
                                            key={role.period}
                                            ref={(el) => {
                                                cards.current[i] = el;
                                            }}
                                            className={`xp-slide${isFront ? " is-front" : ""}${role.current ? " is-current" : ""}`}
                                            style={style}
                                            aria-roledescription="slide"
                                            aria-label={`${i + 1} of ${COUNT}`}
                                            inert={!isFront}
                                            onPointerDown={isFront ? onPointerDown : undefined}
                                            onPointerMove={isFront ? onPointerMove : undefined}
                                            onPointerUp={isFront ? onPointerUp : undefined}
                                            onPointerCancel={isFront ? onPointerUp : undefined}
                                        >
                                            <div className="xp-slide__inner">
                                                <div className="xp-slide__meta">
                                                    <span className="xp-slide__period">
                                                        {role.period}
                                                        {duration && <span className="xp-slide__duration">{duration}</span>}
                                                    </span>
                                                    <span className="xp-slide__location">{role.location}</span>
                                                </div>

                                                <h3 className="xp-slide__company">{role.company}</h3>
                                                <p className="xp-slide__role">{role.role}</p>
                                                <p className="xp-slide__summary">{role.summary}</p>

                                                {role.highlights.length > 0 && (
                                                    <ul className="xp-slide__stats">
                                                        {role.highlights.map((h) => (
                                                            <li key={h.label}>
                                                                <strong>{h.value}</strong>
                                                                <span>{h.label}</span>
                                                            </li>
                                                        ))}
                                                    </ul>
                                                )}

                                                {role.stack.length > 0 && (
                                                    <div className="xp-slide__stack">
                                                        <span className="xp-slide__stack-label">{COPY.stackLabel}</span>
                                                        <ul>
                                                            {role.stack.map((tag) => (
                                                                <li key={tag}>{tag}</li>
                                                            ))}
                                                        </ul>
                                                    </div>
                                                )}

                                                <button
                                                    type="button"
                                                    className="xp-slide__more"
                                                    aria-haspopup="dialog"
                                                    onClick={() => setSheet(i)}
                                                >
                                                    {COPY.moreLabel}
                                                    <span className="visually-hidden">: {role.company}</span>
                                                    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
                                                        <path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
                                                    </svg>
                                                </button>
                                            </div>
                                        </article>
                                    );
                                })}
                            </div>

                            <div className="xp-deck__controls">
                                <button type="button" className="xp-deck__btn" onClick={() => deal(-1)} aria-label={COPY.prevLabel}>
                                    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
                                        <path d="M10 3 5 8l5 5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
                                    </svg>
                                </button>
                                <button type="button" className="xp-deck__btn" onClick={() => deal(1)} aria-label={COPY.nextLabel}>
                                    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
                                        <path d="m6 3 5 5-5 5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
                                    </svg>
                                </button>
                                <span className="xp-deck__count" aria-hidden>
                                    {active + 1} / {COUNT}
                                </span>
                            </div>

                            <p className="visually-hidden" aria-live="polite">
                                {touched ? `${active + 1} of ${COUNT}: ${current.company}, ${current.role}, ${current.period}` : ""}
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            <dialog
                ref={sheetRef}
                className="xp-sheet"
                aria-labelledby="xp-sheet-title"
                onClose={() => setSheet(null)}
                onClick={(e) => {
                    // A click on the backdrop lands on the dialog itself, not its panel.
                    if (e.target === e.currentTarget) e.currentTarget.close();
                }}
            >
                {open && (
                    <div className="xp-sheet__panel">
                        <div className="xp-sheet__head">
                            <span className="xp-sheet__grip" aria-hidden="true" />
                            <button type="button" className="xp-sheet__close" onClick={() => sheetRef.current?.close()} aria-label={COPY.closeLabel}>
                                <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
                                    <path d="m4 4 8 8M12 4l-8 8" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
                                </svg>
                            </button>
                        </div>

                        <div className="xp-slide__meta">
                            <span className="xp-slide__period">
                                {open.period}
                                {openDuration && <span className="xp-slide__duration">{openDuration}</span>}
                            </span>
                            <span className="xp-slide__location">{open.location}</span>
                        </div>
                        <h2 id="xp-sheet-title" className="xp-slide__company">
                            {open.company}
                        </h2>
                        <p className="xp-slide__role">{open.role}</p>
                        <p className="xp-sheet__summary">{open.summary}</p>

                        {open.highlights.length > 0 && (
                            <section className="xp-sheet__group" aria-labelledby="xp-sheet-impact">
                                <h3 id="xp-sheet-impact" className="xp-slide__stack-label">
                                    {COPY.impactLabel}
                                </h3>
                                <ul className="xp-sheet__stats">
                                    {open.highlights.map((h) => (
                                        <li key={h.label}>
                                            <strong>{h.value}</strong>
                                            <span>{h.label}</span>
                                        </li>
                                    ))}
                                </ul>
                            </section>
                        )}

                        {open.stack.length > 0 && (
                            <section className="xp-sheet__group xp-slide__stack" aria-labelledby="xp-sheet-stack">
                                <h3 id="xp-sheet-stack" className="xp-slide__stack-label">
                                    {COPY.stackLabel}
                                </h3>
                                <ul>
                                    {open.stack.map((tag) => (
                                        <li key={tag}>{tag}</li>
                                    ))}
                                </ul>
                            </section>
                        )}
                    </div>
                )}
            </dialog>
        </section>
    );
}
