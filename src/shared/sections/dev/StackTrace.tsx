import { useEffect, useRef, useState, type CSSProperties } from "react";
import { STACK_TRACE as COPY } from "@/data/stackVersions";
import StackHead from "./StackHead";

const TICKS = [0, 0.25, 0.5, 0.75, 1];

/** Where a span's duration label goes: inside a long bar, left of a late one, else after it. */
function placement(span: { start: number; ms: number }) {
    if (span.ms / COPY.totalMs > 0.6) return " is-long";
    return span.start / COPY.totalMs > 0.5 ? " is-late" : "";
}

/**
 * The stack as one request in a distributed trace: each span is a layer, nested
 * the way the calls nest, with its tools beside it. The bars draw in once, in
 * order, when the trace scrolls into view; prerendered and reduced-motion pages
 * show them drawn.
 */
export default function StackTrace() {
    const ref = useRef<HTMLDivElement>(null);
    const [state, setState] = useState<"idle" | "armed" | "playing">("idle");

    useEffect(() => {
        const el = ref.current;
        if (!el || window.matchMedia?.("(prefers-reduced-motion: reduce)").matches) return;
        if (el.getBoundingClientRect().top < window.innerHeight * 0.8) return;
        setState("armed");
        const io = new IntersectionObserver(
            ([entry]) => {
                if (!entry.isIntersecting) return;
                setState("playing");
                io.disconnect();
            },
            { rootMargin: "0px 0px -20% 0px" },
        );
        io.observe(el);
        return () => io.disconnect();
    }, []);

    return (
        <>
            <StackHead eyebrow={COPY.eyebrow} title={COPY.title} intro={COPY.intro} />

            <div ref={ref} className={`stack-trace${state === "idle" ? "" : ` is-${state}`}`} data-reveal>
                <div className="stack-trace__bar">
                    <span className="stack-trace__method">{COPY.request.method}</span>
                    <span className="stack-trace__path">{COPY.request.path}</span>
                    <span className="stack-trace__status">{COPY.request.status}</span>
                    <span className="stack-trace__total">{COPY.totalMs} ms</span>
                </div>

                <div className="stack-trace__scale" aria-hidden>
                    <span>{COPY.spanLabel}</span>
                    <div className="stack-trace__ticks">
                        {TICKS.map((t) => (
                            <span key={t} style={{ left: `${t * 100}%` }}>
                                {Math.round(t * COPY.totalMs)} ms
                            </span>
                        ))}
                    </div>
                </div>

                <ol className="stack-trace__spans">
                    {COPY.spans.map((span, i) => (
                        <li
                            key={span.name}
                            className={`stack-span${placement(span)}`}
                            data-depth={span.depth}
                            style={
                                {
                                    "--depth": span.depth,
                                    "--start": span.start / COPY.totalMs,
                                    "--width": span.ms / COPY.totalMs,
                                    "--i": i,
                                } as CSSProperties
                            }
                        >
                            <div className="stack-span__label">
                                <span className="stack-span__name">{span.name}</span>
                                <span className="stack-span__tools">{span.tools.join(" · ")}</span>
                            </div>
                            <div className="stack-span__track">
                                <span className="stack-span__fill" />
                                <span className="stack-span__ms">{span.ms} ms</span>
                            </div>
                        </li>
                    ))}
                </ol>
            </div>

            <dl className="stack-around" data-reveal>
                {COPY.around.map((row) => (
                    <div key={row.label}>
                        <dt className="stack-note__label">{row.label}</dt>
                        <dd>{row.tools.join(" · ")}</dd>
                    </div>
                ))}
            </dl>
        </>
    );
}
