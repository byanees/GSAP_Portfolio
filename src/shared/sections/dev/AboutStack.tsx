import { Fragment, useRef, useState, type MouseEvent } from "react";
import { Link } from "react-router-dom";
import { CASE_STUDIES } from "@/data/caseStudies";
import { ABOUT } from "@/data/pages/about";
import { STACK_LAYERS, STACK_PRINCIPLES } from "@/data/profile";
import Eyebrow from "./Eyebrow";

const COPY = ABOUT.stack;
const pad = (n: number) => String(n).padStart(2, "0");

const LAYERS = STACK_LAYERS.map((layer) => ({
    ...layer,
    more: layer.items.length - layer.featured.length,
    used: CASE_STUDIES.filter((cs) => layer.usedIn.includes(cs.slug)),
    noteId: `stack-note-${layer.key}`,
}));

/** "AWS" features "AWS EC2, S3 & Lambda" too. */
const isFeatured = (featured: string[], item: string) => featured.some((f) => item === f || item.startsWith(`${f} `));

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
export default function AboutStack() {
    const [active, setActive] = useState(0);
    const notesRef = useRef<HTMLDivElement>(null);

    const select = (i: number) => (e: MouseEvent<HTMLAnchorElement>) => {
        e.preventDefault();
        setActive(i);
        // On a phone the note can sit below the fold; bring its top into view.
        const notes = notesRef.current;
        if (!notes) return;
        const { top } = notes.getBoundingClientRect();
        if (top > window.innerHeight * 0.7) {
            const smooth = !window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;
            notes.scrollIntoView({ block: "start", behavior: smooth ? "smooth" : "auto" });
        }
    };

    return (
        <div className="container-2200 pt-30 pb-30">
            <section className="stack-panel rounded-5 mx-lg-3 mx-2 changeless" aria-labelledby="stack-title">
                <div className="container">
                    <div className="row g-4 align-items-end stack-panel__head">
                        <div className="col-lg-7">
                            <Eyebrow light>{COPY.eyebrow}</Eyebrow>
                            <h2 id="stack-title" className="h3 text-white mb-0">
                                {COPY.title}
                            </h2>
                        </div>
                        <div className="col-lg-4 ms-auto text-lg-end">
                            <p className="stack-panel__intro mb-0">{COPY.intro}</p>
                        </div>
                    </div>

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

                    <div className="stack-notes" ref={notesRef} data-reveal>
                        {LAYERS.map((layer, i) => (
                            <div
                                key={layer.key}
                                id={layer.noteId}
                                className={`stack-note${i === active ? " is-active" : ""}`}
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
                </div>
            </section>
        </div>
    );
}
