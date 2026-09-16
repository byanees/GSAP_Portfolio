import { useEffect, useState } from "react";

type Line = { kind: "cmd" | "out" | "json" | "ok"; text: string };

const LINES: Line[] = [
    { kind: "cmd", text: "whoami" },
    { kind: "out", text: "Muhammad Anees, Full Stack Engineer (3+ yrs)" },
    { kind: "cmd", text: "cat stack.json" },
    { kind: "json", text: "{" },
    { kind: "json", text: '  "backend":  [".NET 9", "ABP.io", "PostgreSQL", "Redis"],' },
    { kind: "json", text: '  "frontend": ["Angular", "React", "TypeScript"],' },
    { kind: "json", text: '  "infra":    ["Docker", "Kubernetes", "AWS"]' },
    { kind: "json", text: "}" },
    { kind: "cmd", text: "./impact --top 3" },
    { kind: "out", text: "✓ 60,000+ merchants on payment infrastructure" },
    { kind: "out", text: "✓ 700–800k push notifications per run, in 6–8 min" },
    { kind: "out", text: "✓ 600k+ concurrent sessions, no Redis pool exhaustion" },
    { kind: "cmd", text: "status" },
    { kind: "ok", text: "● open to full stack & backend roles" },
];

/** Dark terminal window that "types" a short summary line by line. */
export default function TerminalCard() {
    const [visible, setVisible] = useState(0);

    useEffect(() => {
        if (window.matchMedia?.("(prefers-reduced-motion: reduce)").matches) {
            setVisible(LINES.length);
            return;
        }
        let shown = 0;
        const id = window.setInterval(() => {
            shown += 1;
            setVisible(shown);
            if (shown >= LINES.length) window.clearInterval(id);
        }, 260);
        return () => window.clearInterval(id);
    }, []);

    return (
        <figure className="terminal-card mb-0" aria-label="Terminal summary of Muhammad Anees">
            <div className="terminal-card__bar" aria-hidden>
                <span className="terminal-card__dot" />
                <span className="terminal-card__dot" />
                <span className="terminal-card__dot" />
                <span className="terminal-card__title">anees@islamabad: ~</span>
            </div>
            <pre className="terminal-card__body">
                <code>
                    {LINES.map((line, i) => (
                        <span key={i} className={`terminal-line terminal-line--${line.kind}${i < visible ? " is-visible" : ""}`}>
                            {line.kind === "cmd" && <span className="terminal-line__prompt">$ </span>}
                            {line.text}
                            {i === visible - 1 && <span className="terminal-cursor" aria-hidden />}
                        </span>
                    ))}
                </code>
            </pre>
        </figure>
    );
}
