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

/** "2024–26", "2026–now", or "2023" for a role inside one year. */
function shortYears(period: string) {
    const { start, end } = parsePeriod(period);
    if (start == null) return period;
    const from = Math.floor(start / 12);
    if (end == null) return `${from}–${COPY.now}`;
    const to = Math.floor(end / 12);
    return from === to ? `${from}` : `${from}–${String(to).slice(2)}`;
}

const ROLES = EXPERIENCE.map((item, i) => ({
    ...item,
    /** The first job is v1.0, the current one the highest release. */
    version: COUNT - i,
    years: shortYears(item.period),
    span: parsePeriod(item.period),
}));

/** Counts a figure like "4,000+" or "30%" up from zero. Ranges such as "700–800k" are left as written. */
function countUp(el: HTMLElement, frames: number[]) {
    const final = el.dataset.value ?? "";
    const m = final.match(/^(\d[\d,]*)(\D*)$/);
    if (!m) return;
    const target = Number(m[1].replace(/,/g, ""));
    const grouped = m[1].includes(",");
    const t0 = performance.now();
    const tick = (t: number) => {
        const p = Math.min((t - t0) / 900, 1);
        const v = Math.round(target * (1 - Math.pow(1 - p, 3)));
        el.textContent = (grouped ? v.toLocaleString("en-US") : String(v)) + m[2];
        if (p < 1) frames.push(requestAnimationFrame(tick));
    };
    frames.push(requestAnimationFrame(tick));
}

const reducedMotion = () => window.matchMedia?.("(prefers-reduced-motion: reduce)").matches ?? false;

type Drag = { id: number; x: number; y: number; dx: number; lastX: number; lastT: number; v: number; on: boolean };

/**
 * Career as a deck of release cards, newest on top. Drag or swipe the front card
 * away (or use the buttons, arrow keys, the index, or the tenure ruler) to deal
 * the next role. Every card is in the markup, so the full history is prerendered
 * and indexable; only the front one is interactive to assistive tech.
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
    const seen = useRef(false);
    const frames = useRef<number[]>([]);

    useEffect(() => {
        const d = new Date();
        setNowMonth(d.getFullYear() * 12 + d.getMonth());
    }, []);

    const runCounters = useCallback((index: number) => {
        frames.current.forEach(cancelAnimationFrame);
        frames.current = [];
        if (reducedMotion()) return;
        cards.current[index]?.querySelectorAll<HTMLElement>("[data-value]").forEach((el) => countUp(el, frames.current));
    }, []);

    // First sight of the deck: count the front card's numbers up and nudge it, hinting that it moves.
    useEffect(() => {
        const stack = stackRef.current;
        if (!stack) return;
        const io = new IntersectionObserver(
            ([entry]) => {
                if (!entry.isIntersecting) return;
                io.disconnect();
                seen.current = true;
                runCounters(activeRef.current);
                if (!reducedMotion()) stack.dataset.nudge = "";
            },
            { threshold: 0.45 },
        );
        io.observe(stack);
        return () => {
            io.disconnect();
            frames.current.forEach(cancelAnimationFrame);
        };
    }, [runCounters]);

    const commit = useCallback(
        (next: number) => {
            activeRef.current = next;
            flushSync(() => setActive(next));
            if (seen.current) runCounters(next);
        },
        [runCounters],
    );

    /** Deals the deck one card: 1 sends the front card to the back, -1 pulls the back card to the front. */
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

    // The ruler spans the first start to this month, and is drawn only once the month is known.
    const first = Math.min(...ROLES.map((r) => r.span.start ?? Infinity));
    const last = nowMonth != null ? nowMonth + 1 : null;
    const total = last != null ? last - first : 0;
    const ticks =
        last != null ? Array.from({ length: Math.floor((last - 1) / 12) - Math.floor(first / 12) + 1 }, (_, k) => Math.floor(first / 12) + k) : [];

    const durationOf = (span: { start: number | null; end: number | null }) => {
        if (span.start == null) return null;
        const end = span.end ?? nowMonth;
        return end == null ? null : formatDuration(end - span.start + 1);
    };

    const current = ROLES[active];

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
                                                <span className="xp-index__ver">v{role.version}.0</span>
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
                        <div className="xp-ruler" aria-label={COPY.timelineLabel} role="group">
                            <div className={`xp-ruler__track${last != null ? " is-ready" : ""}`}>
                                {last != null &&
                                    ROLES.map((role, i) => {
                                        if (role.span.start == null) return null;
                                        // Closed roles end where the next one begins, so bars that share a month don't overlap.
                                        const end = role.span.end ?? nowMonth! + 1;
                                        const style = {
                                            "--left": `${((role.span.start - first) / total) * 100}%`,
                                            "--width": `${((end - role.span.start) / total) * 100}%`,
                                            "--i": role.version - 1,
                                        } as CSSProperties;
                                        return (
                                            <button
                                                key={role.period}
                                                type="button"
                                                tabIndex={-1}
                                                className={`xp-ruler__seg${i === active ? " is-active" : ""}${role.current ? " is-live" : ""}`}
                                                style={style}
                                                onClick={() => jump(i)}
                                                aria-label={`${role.company}, ${durationOf(role.span)}`}
                                            >
                                                <span className="xp-ruler__ver">v{role.version}</span>
                                            </button>
                                        );
                                    })}
                                {ticks.map((year) => (
                                    <span
                                        key={year}
                                        className="xp-ruler__tick"
                                        style={{ "--left": `${(Math.max(year * 12 - first, 0) / total) * 100}%` } as CSSProperties}
                                        aria-hidden
                                    >
                                        {year}
                                    </span>
                                ))}
                                {last != null && (
                                    <span className="xp-ruler__now" aria-hidden>
                                        {COPY.now}
                                    </span>
                                )}
                            </div>
                        </div>

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
                                            className={`xp-slide${isFront ? " is-front" : ""}${role.current ? " is-live" : ""}`}
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
                                                <header className="xp-slide__meta">
                                                    <span className="xp-slide__ver">v{role.version}.0</span>
                                                    {role.current && (
                                                        <span className="xp-slide__live">
                                                            <span className="xp-slide__pulse" aria-hidden />
                                                            {COPY.currentBadge}
                                                        </span>
                                                    )}
                                                    <span className="xp-slide__period">
                                                        {role.period}
                                                        {duration && <span className="xp-slide__duration"> · {duration}</span>}
                                                    </span>
                                                </header>

                                                <h3 className="xp-slide__company">{role.company}</h3>
                                                <p className="xp-slide__role">
                                                    {role.role}
                                                    <span>{role.location}</span>
                                                </p>
                                                <p className="xp-slide__summary">{role.summary}</p>

                                                {role.highlights.length > 0 && (
                                                    <ul className="xp-slide__stats">
                                                        {role.highlights.map((h) => (
                                                            <li key={h.label}>
                                                                <strong data-value={h.value}>{h.value}</strong>
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
                                            </div>
                                            <span className="xp-slide__mark" aria-hidden>
                                                v{role.version}
                                            </span>
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
                                <span className="xp-deck__count" aria-hidden>
                                    <strong>{String(active + 1).padStart(2, "0")}</strong> / {String(COUNT).padStart(2, "0")}
                                </span>
                                <button type="button" className="xp-deck__btn" onClick={() => deal(1)} aria-label={COPY.nextLabel}>
                                    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
                                        <path d="m6 3 5 5-5 5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
                                    </svg>
                                </button>
                                <span className={`xp-deck__hint${touched ? " is-hidden" : ""}`}>{COPY.hint}</span>
                            </div>

                            <p className="visually-hidden" aria-live="polite">
                                {touched ? `${active + 1} of ${COUNT}: ${current.company}, ${current.role}, ${current.period}` : ""}
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
