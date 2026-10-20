import { Fragment, useRef, useState, type MouseEvent, type PointerEvent } from "react";
import { Link } from "react-router-dom";
import { CASE_STUDIES } from "@/data/caseStudies";
import { ABOUT } from "@/data/pages/about";
import { STACK_LAYERS, STACK_PRINCIPLES } from "@/data/profile";
import StackHead from "./StackHead";

const COPY = ABOUT.stack;
const pad = (n: number) => String(n).padStart(2, "0");
/** Clearance for the fixed island nav. */
const HEADER_ROOM = 96;

/**
 * "AWS" features "AWS EC2, S3 & Lambda" too, and ".NET 9 (ABP.io)" features
 * both ".NET 9" and "ABP.io".
 */
const isFeatured = (featured: string[], item: string) =>
    featured.some((f) => item === f || item.startsWith(`${f} `) || f.includes(item));

const LAYERS = STACK_LAYERS.map((layer) => ({
    ...layer,
    more: layer.items.filter((item) => !isFeatured(layer.featured, item)).length,
    used: CASE_STUDIES.filter((cs) => layer.usedIn.includes(cs.slug)),
    noteId: `stack-note-${layer.key}`,
}));

/** The words between featured tools: "A and B", "A, B and C". */
function joiner(index: number, count: number) {
    if (index === count - 1) return "";
    return index === count - 2 ? " and " : ", ";
}

/**
 * The stack written as one sentence, the way I'd say it out loud. The prose is
 * quiet and the tools are bright, so a skim still picks them out. Each tool group
 * is a footnote link: it opens a note with the rest of that layer and the case
 * studies it shows up in. Every note is in the markup, so the full stack is
 * prerendered; the notes share one grid cell, so switching never shifts the page.
 */
export default function StackSentence() {
    const [active, setActive] = useState(0);
    const notesRef = useRef<HTMLDivElement>(null);

    const drag = useRef<{ id: number; x: number; y: number; dx: number; lastX: number; lastT: number; v: number; on: boolean } | null>(null);
    const dragged = useRef(false);

    // On touch, swipe the open note sideways to step through the layers.
    const onPointerDown = (e: PointerEvent<HTMLDivElement>) => {
        if (e.pointerType === "mouse") return;
        dragged.current = false;
        const t = performance.now();
        drag.current = { id: e.pointerId, x: e.clientX, y: e.clientY, dx: 0, lastX: e.clientX, lastT: t, v: 0, on: false };
    };

    const onPointerMove = (e: PointerEvent<HTMLDivElement>) => {
        const d = drag.current;
        if (!d || d.id !== e.pointerId) return;
        const el = e.currentTarget;
        const note = el.children[active] as HTMLElement | undefined;
        let dx = e.clientX - d.x;
        const dy = e.clientY - d.y;
        if (!d.on) {
            if (Math.abs(dx) < 8 && Math.abs(dy) < 8) return;
            // A mostly vertical gesture is a page scroll, not a swipe.
            if (Math.abs(dy) > Math.abs(dx)) {
                drag.current = null;
                return;
            }
            d.on = true;
            dragged.current = true;
            el.setPointerCapture(e.pointerId);
            el.dataset.motion = "drag";
        }
        const t = performance.now();
        d.v = (e.clientX - d.lastX) / Math.max(t - d.lastT, 1);
        d.lastX = e.clientX;
        d.lastT = t;
        d.dx = dx;
        // Nothing past the first or last layer, so pull against a rubber band there.
        if ((dx > 0 && active === 0) || (dx < 0 && active === LAYERS.length - 1)) dx *= 0.3;
        if (note) {
            note.style.transform = `translate3d(${dx}px, 0, 0)`;
            note.style.opacity = String(1 - Math.min(Math.abs(dx) / el.offsetWidth, 0.6));
        }
    };

    const onPointerUp = (e: PointerEvent<HTMLDivElement>) => {
        const d = drag.current;
        drag.current = null;
        if (!d?.on) return;
        const el = e.currentTarget;
        const note = el.children[active] as HTMLElement | undefined;
        delete el.dataset.motion;
        note?.style.removeProperty("transform");
        note?.style.removeProperty("opacity");
        const threshold = Math.min(120, el.offsetWidth * 0.2);
        const flick = Math.abs(d.v) > 0.5 && Math.abs(d.dx) > 30;
        if ((d.dx < -threshold || (flick && d.v < 0)) && active < LAYERS.length - 1) setActive(active + 1);
        else if ((d.dx > threshold || (flick && d.v > 0)) && active > 0) setActive(active - 1);
    };

    // A swipe that ends on a case study link shouldn't open it.
    const onClickCapture = (e: MouseEvent<HTMLDivElement>) => {
        if (!dragged.current) return;
        dragged.current = false;
        e.preventDefault();
        e.stopPropagation();
    };

    const select = (i: number) => (e: MouseEvent<HTMLAnchorElement>) => {
        e.preventDefault();
        setActive(i);
        // Scroll only as far as it takes to show the whole note, but keep the tapped
        // tool on screen and the note's top clear of the header. Often no scroll at all.
        const pick = e.currentTarget;
        requestAnimationFrame(() => {
            const note = notesRef.current?.children[i];
            const end = note?.lastElementChild?.getBoundingClientRect().bottom;
            if (!note || end == null) return;
            const below = end - (window.innerHeight - 24);
            if (below <= 0) return;
            const by = Math.min(
                below,
                note.getBoundingClientRect().top - HEADER_ROOM,
                pick.getBoundingClientRect().top - HEADER_ROOM - 16,
            );
            if (by <= 0) return;
            const smooth = !window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;
            window.scrollBy({ top: by, behavior: smooth ? "smooth" : "auto" });
        });
    };

    return (
        <>
            <StackHead eyebrow={COPY.eyebrow} title={COPY.title} intro={COPY.intro} />

            <p className="stack-sentence" data-reveal>
                {LAYERS.map((layer, i) => (
                    <Fragment key={layer.key}>
                        {layer.lead}{" "}
                        <a
                            href={`#${layer.noteId}`}
                            className={`stack-pick${i === active ? " is-active" : ""}`}
                            aria-controls={layer.noteId}
                            aria-current={i === active ? "true" : undefined}
                            onClick={select(i)}
                        >
                            {layer.featured.map((tool, t) => (
                                <Fragment key={tool}>
                                    <span className="stack-pick__tool">{tool}</span>
                                    {joiner(t, layer.featured.length)}
                                </Fragment>
                            ))}
                            {layer.more > 0 && (
                                <>
                                    <sup className="stack-pick__more" aria-hidden>
                                        +{layer.more}
                                    </sup>
                                    <span className="visually-hidden">, {COPY.moreLabel(layer.more, layer.name)}</span>
                                </>
                                    )}
                                </a>
                                {layer.after}{" "}
                            </Fragment>
                        ))}
                        <span className="stack-sentence__caret" aria-hidden />
                    </p>

                    <div
                        className="stack-notes"
                        ref={notesRef}
                        data-reveal
                        onPointerDown={onPointerDown}
                        onPointerMove={onPointerMove}
                        onPointerUp={onPointerUp}
                        onPointerCancel={onPointerUp}
                        onClickCapture={onClickCapture}
                    >
                        {LAYERS.map((layer, i) => (
                            <div
                                key={layer.key}
                                id={layer.noteId}
                                className={`stack-note${i === active ? " is-active" : i < active ? " is-before" : ""}`}
                                role="group"
                                aria-labelledby={`${layer.noteId}-name`}
                                inert={i !== active}
                            >
                                <div className="stack-note__head">
                                    <span className="stack-note__index">
                                        {pad(i + 1)} <span aria-hidden>/</span> {pad(LAYERS.length)}
                                    </span>
                                    <h3 id={`${layer.noteId}-name`} className="stack-note__name">
                                        {layer.name}
                                    </h3>
                                    <p className="stack-note__role">{layer.role}</p>
                                </div>

                                <div className="stack-note__block">
                                    <span className="stack-note__label">{COPY.toolsLabel}</span>
                                    <ul className="stack-note__tools">
                                        {layer.items.map((item) => (
                                            <li key={item} className={isFeatured(layer.featured, item) ? "is-featured" : undefined}>
                                                {item}
                                            </li>
                                        ))}
                                    </ul>
                                </div>

                                <div className="stack-note__block">
                                    <span className="stack-note__label">{COPY.usedInLabel}</span>
                                    {layer.used.length ? (
                                        <ul className="stack-note__used">
                                            {layer.used.map((cs) => (
                                                <li key={cs.slug}>
                                                    <Link to={`/portfolio/${cs.slug}`}>{cs.title}</Link>
                                                </li>
                                            ))}
                                        </ul>
                                    ) : (
                                        <p className="stack-note__everywhere">{COPY.everywhere}</p>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className="stack-principles" data-reveal>
                        <span className="stack-note__label">{COPY.principlesLabel}</span>
                        <ul>
                            {STACK_PRINCIPLES.map((p) => (
                                <li key={p}>{p}</li>
                            ))}
                        </ul>
                    </div>
        </>
    );
}
