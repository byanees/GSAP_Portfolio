import { useState, type CSSProperties } from "react";
import { Link } from "react-router-dom";
import { CASE_STUDIES } from "@/data/caseStudies";
import { STACK_PROBLEMS as COPY } from "@/data/stackVersions";
import StackHead from "./StackHead";
import { ARROW_SVG } from "./icons";

/** Clearance for the fixed island nav. */
const HEADER_ROOM = 96;

const PROBLEMS = COPY.problems.flatMap((p) => {
    const cs = CASE_STUDIES.find((c) => c.slug === p.slug);
    return cs ? [{ ...p, cs }] : [];
});

/**
 * The stack through the problems it solved: pick one and see the system and
 * the tools it took. One answer is open at a time. On a phone each answer
 * opens under its question; from 992px the questions sit left and the open
 * answer fills the column beside them.
 */
export default function StackProblems() {
    const [open, setOpen] = useState(0);

    // On a phone, closing an answer above the tapped question pulls that question
    // up, sometimes under the header. Bring it back to just below the header.
    const choose = (i: number, button: HTMLButtonElement) => {
        setOpen(i);
        requestAnimationFrame(() => {
            const { top } = button.getBoundingClientRect();
            if (top < HEADER_ROOM) window.scrollBy({ top: top - HEADER_ROOM, behavior: "auto" });
        });
    };

    return (
        <>
            <StackHead eyebrow={COPY.eyebrow} title={COPY.title} intro={COPY.intro} />

            <div className="stack-q" data-reveal style={{ "--rows": PROBLEMS.length } as CSSProperties}>
                {PROBLEMS.map((p, i) => {
                    const id = `stack-q-${p.slug}`;
                    const isOpen = i === open;
                    return (
                        <div key={p.slug} className={`stack-q__item${isOpen ? " is-active" : ""}`}>
                            <h3 className="stack-q__ask">
                                <button type="button" aria-expanded={isOpen} aria-controls={id} onClick={(e) => choose(i, e.currentTarget)}>
                                    <span className="stack-q__num" aria-hidden>
                                        {String(i + 1).padStart(2, "0")}
                                    </span>
                                    <span>{p.ask}</span>
                                </button>
                            </h3>
                            <div id={id} className="stack-q__answer" inert={!isOpen}>
                                <span className="stack-q__domain">{p.cs.domain}</span>
                                <p className="stack-q__title">{p.cs.title}</p>
                                <p className="stack-q__summary">{p.cs.summary}</p>
                                <span className="stack-note__label">{COPY.builtWithLabel}</span>
                                <ul className="stack-note__tools">
                                    {p.cs.stack.map((tool) => (
                                        <li key={tool}>{tool}</li>
                                    ))}
                                </ul>
                                <Link className="stack-q__link" to={`/portfolio/${p.slug}`}>
                                    {COPY.readLabel}
                                    <span aria-hidden>{ARROW_SVG}</span>
                                </Link>
                            </div>
                        </div>
                    );
                })}
            </div>
        </>
    );
}
