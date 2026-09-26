import { useEffect, useId, useRef, type ReactNode } from "react";

/**
 * Editorial figures for blog posts.
 *
 * Deliberately a different visual language from the case study diagrams
 * (SystemDiagram): those are dark, looping blueprints of how a system is built;
 * these explain one idea inside a piece of reading, so they are ink on paper in
 * the site's neutral tokens (and follow dark mode), draw themselves in once when
 * scrolled to, and then hold still. Each one is the figure type that fits its
 * idea: a chart, a timeline, a sequence, a field-by-field breakdown.
 *
 * A post places one with an empty marker in its body HTML:
 *   <figure data-figure="redis-connections"></figure>
 */

type Arrow = { a: string };

/* ------------------------------------------------------------------ shared */

function Cell({ x, y, w, h = 34, text, tone, size = 14 }: { x: number; y: number; w: number; h?: number; text: string; tone: "id" | "len" | "val"; size?: number }) {
    return (
        <g data-pf-in>
            <rect x={x} y={y} width={w} height={h} rx={4} className={`pf-cell pf-cell--${tone}`} />
            <text x={x + w / 2} y={y + h / 2 + size * 0.36} textAnchor="middle" className={`pf-code pf-code--${tone}`} style={{ fontSize: size }}>
                {text}
            </text>
        </g>
    );
}

function Box({ x, y, w, h = 36, label, strong = false }: { x: number; y: number; w: number; h?: number; label: string; strong?: boolean }) {
    return (
        <g data-pf-in>
            <rect x={x} y={y} width={w} height={h} rx={8} className={strong ? "pf-box pf-box--strong" : "pf-box"} />
            <text x={x + w / 2} y={y + h / 2 + 5} textAnchor="middle" className={strong ? "pf-label pf-label--inv" : "pf-label"}>
                {label}
            </text>
        </g>
    );
}

function Chip({ x, y, w, label, strong = false }: { x: number; y: number; w: number; label: string; strong?: boolean }) {
    return (
        <g data-pf-in>
            <rect x={x} y={y} width={w} height={24} rx={12} className={strong ? "pf-box pf-box--strong" : "pf-box"} />
            <text x={x + w / 2} y={y + 16.5} textAnchor="middle" className={strong ? "pf-mono pf-mono--inv" : "pf-mono"}>
                {label}
            </text>
        </g>
    );
}

/** A straight connector with an arrowhead. */
function Line({ x1, y1, x2, y2, a, dashed = false, strong = false }: { x1: number; y1: number; x2: number; y2: number; dashed?: boolean; strong?: boolean } & Arrow) {
    return (
        <line
            x1={x1}
            y1={y1}
            x2={x2}
            y2={y2}
            className={`pf-wire${strong ? " pf-wire--strong" : ""}${dashed ? " is-dashed" : ""}`}
            markerEnd={`url(#${a})`}
            data-pf-draw
        />
    );
}

/* ----------------------------------------------------------------- figures */

function RedisConnections() {
    return (
        <>
            <rect x={330} y={40} width={230} height={250} className="pf-band" data-pf-in />
            <text x={445} y={314} textAnchor="middle" className="pf-mono">peak traffic</text>

            <line x1={80} y1={290} x2={760} y2={290} className="pf-axis" />
            <line x1={80} y1={40} x2={80} y2={290} className="pf-axis" />
            <text x={760} y={314} textAnchor="end" className="pf-mono">time →</text>
            <text x={50} y={165} textAnchor="middle" className="pf-mono" transform="rotate(-90 50 165)">open connections</text>

            <line x1={80} y1={120} x2={760} y2={120} className="pf-limit" />
            <text x={88} y={112} className="pf-mono">connection limit</text>

            <path
                d="M80 235 C160 235 240 232 300 222 C340 214 360 110 400 80 C430 60 480 58 510 72 C540 86 560 200 600 228 C640 245 700 240 760 238"
                className="pf-line"
                data-pf-draw
            />
            <g data-pf-in>
                <text x={405} y={68} textAnchor="middle" className="pf-x">×</text>
                <text x={455} y={52} textAnchor="middle" className="pf-x">×</text>
                <text x={502} y={60} textAnchor="middle" className="pf-x">×</text>
                <text x={455} y={30} textAnchor="middle" className="pf-mono">timeouts</text>
            </g>
            <text x={590} y={100} className="pf-label" data-pf-in>a connection per request</text>

            <line x1={80} y1={272} x2={760} y2={272} className="pf-line pf-line--strong" data-pf-draw />
            <text x={340} y={262} className="pf-label" data-pf-in>one multiplexed connection</text>
        </>
    );
}

function TlvAnatomy({ a }: Arrow) {
    // Row 1: the payload, field by field. [x, id, len, value, valueWidth]
    const fields: [number, string, string, string, number][] = [
        [55, "00", "02", "01", 30],
        [153, "01", "02", "12", 30],
        [251, "26", "38", "…", 30],
        [393, "54", "08", "25000.00", 84],
        [545, "58", "02", "TZ", 30],
        [643, "63", "04", "CRC", 42],
    ];
    return (
        <>
            <text x={55} y={44} className="pf-mono">a dynamic payload, left to right</text>
            {fields.map(([x, id, len, val, w]) => (
                <g key={id}>
                    <Cell x={x} y={60} w={30} text={id} tone="id" />
                    <Cell x={x + 30} y={60} w={30} text={len} tone="len" />
                    <Cell x={x + 60} y={60} w={w} text={val} tone="val" />
                </g>
            ))}
            <text x={367} y={82} textAnchor="middle" className="pf-mono" data-pf-in>· · ·</text>

            <path d="M296 94 C296 140 96 130 96 180" className="pf-wire" markerEnd={`url(#${a})`} data-pf-draw />
            <path d="M465 94 C465 140 635 130 635 180" className="pf-wire" markerEnd={`url(#${a})`} data-pf-draw />

            {/* Field 26: a template whose value is TLV again */}
            <Cell x={66} y={184} w={30} text="26" tone="id" />
            <Cell x={96} y={184} w={30} text="38" tone="len" />
            <rect x={126} y={180} width={423} height={42} rx={6} className="pf-cell pf-cell--val" data-pf-in />
            <Cell x={132} y={188} w={30} h={26} text="00" tone="id" size={13} />
            <Cell x={162} y={188} w={30} h={26} text="18" tone="len" size={13} />
            <Cell x={192} y={188} w={168} h={26} text="com.example.wallet" tone="val" size={13} />
            <Cell x={366} y={188} w={30} h={26} text="01" tone="id" size={13} />
            <Cell x={396} y={188} w={30} h={26} text="12" tone="len" size={13} />
            <Cell x={426} y={188} w={117} h={26} text="MERCHANT-001" tone="val" size={13} />
            <g data-pf-in>
                <text x={66} y={250} className="pf-label">26 = merchant account, a template</text>
                <text x={66} y={270} className="pf-note">Its value is TLV again; 38 is the length of all of it.</text>
            </g>

            {/* Field 54: a plain field */}
            <Cell x={590} y={184} w={30} text="54" tone="id" />
            <Cell x={620} y={184} w={30} text="08" tone="len" />
            <Cell x={650} y={184} w={84} text="25000.00" tone="val" />
            <g data-pf-in>
                <text x={590} y={250} className="pf-label">54 = amount</text>
                <text x={590} y={270} className="pf-note">08 = eight characters</text>
            </g>

            <g data-pf-in>
                <rect x={66} y={296} width={14} height={14} rx={3} className="pf-cell pf-cell--id" />
                <text x={86} y={308} className="pf-mono">ID</text>
                <rect x={126} y={296} width={14} height={14} rx={3} className="pf-cell pf-cell--len" />
                <text x={146} y={308} className="pf-mono">length</text>
                <rect x={214} y={296} width={14} height={14} rx={3} className="pf-cell pf-cell--val" />
                <text x={234} y={308} className="pf-mono">value</text>
            </g>
        </>
    );
}

function PushChunks() {
    const lanes = [
        { label: "Worker 1", y: 108, chunks: [[150, 258, 1], [264, 372, 3], [378, 486, 5], [492, 600, 7]] },
        { label: "Worker 2", y: 178, chunks: [[150, 252, 2], [258, 376, 4], [382, 484, 6], [490, 610, 8]] },
    ];
    return (
        <>
            <text x={150} y={30} className="pf-mono">MSISDNs for one notification, read a chunk at a time</text>
            {Array.from({ length: 8 }, (_, i) => (
                <g key={i} data-pf-in>
                    <rect x={150 + i * 58} y={40} width={54} height={24} rx={4} className="pf-cell pf-cell--len" />
                    <text x={177 + i * 58} y={57} textAnchor="middle" className="pf-mono">{i + 1}</text>
                </g>
            ))}
            <g data-pf-in>
                <rect x={660} y={44} width={12} height={12} rx={2} className="pf-fail" />
                <text x={680} y={55} className="pf-mono">failed send</text>
            </g>

            <text x={20} y={92} className="pf-mono">semaphore = 2</text>
            {lanes.map((lane) => (
                <g key={lane.label}>
                    <text x={20} y={lane.y + 25} className="pf-label">{lane.label}</text>
                    <line x1={150} y1={lane.y + 20} x2={760} y2={lane.y + 20} className="pf-grid" />
                    {lane.chunks.map(([x1, x2, n]) => (
                        <g key={n} data-pf-in>
                            <rect x={x1} y={lane.y} width={x2 - x1} height={40} rx={8} className="pf-box" />
                            <text x={(x1 + x2) / 2} y={lane.y + 25} textAnchor="middle" className="pf-mono">chunk {n}</text>
                        </g>
                    ))}
                </g>
            ))}
            <rect x={356} y={114} width={10} height={10} rx={2} className="pf-fail" data-pf-in />
            <rect x={468} y={184} width={10} height={10} rx={2} className="pf-fail" data-pf-in />

            <line x1={622} y1={96} x2={622} y2={232} className="pf-limit" data-pf-in />
            <text x={622} y={250} textAnchor="middle" className="pf-mono">all chunks sent</text>
            <g data-pf-in>
                <rect x={636} y={108} width={124} height={40} rx={8} className="pf-box pf-box--strong" />
                <text x={698} y={133} textAnchor="middle" className="pf-label pf-label--inv">retry failed</text>
            </g>

            <line x1={150} y1={270} x2={760} y2={270} className="pf-axis" />
            <text x={760} y={292} textAnchor="end" className="pf-mono">time →</text>
        </>
    );
}

function RequestToPaySequence({ a }: Arrow) {
    const lifelines = [
        { x: 80, label: "Merchant" },
        { x: 250, label: "Request to Pay" },
        { x: 420, label: "App (push)" },
        { x: 580, label: "USSD" },
        { x: 730, label: "Database" },
    ];
    const msg = (y: number, from: number, to: number, label: string, opts: { dashed?: boolean; strong?: boolean } = {}) => (
        <g key={`${y}-${label}`}>
            <Line x1={from} y1={y} x2={to + (to > from ? -4 : 4)} y2={y} a={a} {...opts} />
            <text x={(from + to) / 2} y={y - 8} textAnchor="middle" className={opts.strong ? "pf-mono pf-mono--strong" : "pf-mono"} data-pf-in>
                {label}
            </text>
        </g>
    );
    return (
        <>
            {lifelines.map((l) => (
                <g key={l.label}>
                    <line x1={l.x} y1={62} x2={l.x} y2={400} className="pf-lifeline" />
                    <Box x={l.x - 65} y={26} w={130} label={l.label} strong={l.label === "Request to Pay"} />
                </g>
            ))}
            {msg(100, 80, 250, "MSISDN + amount")}
            {msg(140, 250, 420, "push")}
            {msg(172, 250, 580, "USSD prompt")}
            {msg(218, 420, 250, "pay")}
            {msg(250, 250, 730, "Pending → Paid, only if Pending", { strong: true })}
            {msg(282, 730, 250, "1 row: paid ✓", { dashed: true })}
            {msg(330, 580, 250, "pay")}
            {msg(362, 250, 730, "Pending → Paid, only if Pending", { strong: true })}
            {msg(394, 730, 250, "0 rows: already paid ✗", { dashed: true })}
        </>
    );
}

function BuildOnce({ a }: Arrow) {
    return (
        <>
            <text x={40} y={36} className="pf-kicker">Rebuild per environment</text>
            <Box x={40} y={62} w={110} label="Build" />
            <Line x1={150} y1={80} x2={171} y2={80} a={a} />
            <Chip x={175} y={68} w={100} label="sha a1f3" />
            <Line x1={275} y1={80} x2={296} y2={80} a={a} />
            <Box x={300} y={62} w={140} label="PreProd · UAT" />

            <text x={225} y={116} textAnchor="middle" className="pf-neq" data-pf-in>≠</text>

            <Box x={40} y={124} w={110} label="Build" />
            <Line x1={150} y1={142} x2={171} y2={142} a={a} />
            <Chip x={175} y={130} w={100} label="sha 7c20" />
            <Line x1={275} y1={142} x2={296} y2={142} a={a} />
            <Box x={300} y={124} w={140} label="Production" />

            <g data-pf-in>
                <text x={480} y={96} className="pf-label">Two builds, two artifacts.</text>
                <text x={480} y={118} className="pf-note">What reached production was never</text>
                <text x={480} y={138} className="pf-note">the thing UAT signed off.</text>
            </g>

            <line x1={40} y1={182} x2={760} y2={182} className="pf-grid" />

            <text x={40} y={214} className="pf-kicker">Build once, promote</text>
            <Box x={40} y={240} w={110} label="Build" />
            <Line x1={150} y1={258} x2={171} y2={258} a={a} />
            <Chip x={175} y={246} w={100} label="sha 4d2e" strong />
            <Line x1={275} y1={258} x2={296} y2={258} a={a} />
            <Box x={300} y={240} w={150} label="PreProd · UAT ✓" />
            <Line x1={450} y1={258} x2={471} y2={258} a={a} />
            <Box x={475} y={240} w={110} label="New tag" />
            <Line x1={585} y1={258} x2={606} y2={258} a={a} />
            <Box x={610} y={240} w={130} label="Production" strong />

            <Chip x={325} y={290} w={100} label="sha 4d2e" strong />
            <Chip x={625} y={290} w={100} label="sha 4d2e" strong />
            <text x={530} y={307} textAnchor="middle" className="pf-mono" data-pf-in>same image</text>
        </>
    );
}

function TtlTimeline({ a }: Arrow) {
    const windows = [200, 420, 600];
    const hits = [235, 262, 300, 330, 455, 480, 530, 640, 700];
    return (
        <>
            <text x={20} y={95} className="pf-mono">external APIs</text>
            <text x={20} y={205} className="pf-mono">dashboard loads</text>
            <line x1={170} y1={90} x2={770} y2={90} className="pf-grid" />

            {windows.map((x) => (
                <g key={x}>
                    <rect x={x} y={150} width={140} height={80} rx={6} className="pf-band" data-pf-in />
                    <text x={x + 8} y={166} className="pf-mono">TTL</text>
                    <Line x1={x} y1={192} x2={x} y2={108} a={a} strong />
                    <g data-pf-in>
                        <line x1={x - 7} y1={78} x2={x - 7} y2={100} className="pf-tick" />
                        <line x1={x} y1={74} x2={x} y2={100} className="pf-tick" />
                        <line x1={x + 7} y1={78} x2={x + 7} y2={100} className="pf-tick" />
                    </g>
                    <circle cx={x} cy={200} r={7} className="pf-dot pf-dot--miss" data-pf-in />
                </g>
            ))}
            {hits.map((x) => (
                <circle key={x} cx={x} cy={200} r={6} className="pf-dot" data-pf-in />
            ))}
            <text x={170} y={40} className="pf-label" data-pf-in>Inside a window, the data is never more than one TTL old</text>

            <line x1={170} y1={245} x2={770} y2={245} className="pf-axis" />
            <text x={770} y={264} textAnchor="end" className="pf-mono">time →</text>

            <g data-pf-in>
                <circle cx={176} cy={283} r={6} className="pf-dot pf-dot--miss" />
                <text x={190} y={288} className="pf-mono">miss: call the external APIs, cache the answer</text>
                <circle cx={560} cy={283} r={5.5} className="pf-dot" />
                <text x={574} y={288} className="pf-mono">hit: served from cache</text>
            </g>
        </>
    );
}

/* ---------------------------------------------------------------- registry */

type FigureDef = { w: number; h: number; label: string; caption: string; render: (a: string) => ReactNode };

const FIGURES: Record<string, FigureDef> = {
    "redis-connections": {
        w: 800,
        h: 330,
        label: "Line chart of open Redis connections over time, against the connection limit",
        caption:
            "Illustrative. With a connection per request, open connections follow traffic and cross the limit at peak, which is where the timeouts start. A multiplexed connection stays flat however busy it gets.",
        render: () => <RedisConnections />,
    },
    "tlv-anatomy": {
        w: 800,
        h: 324,
        label: "An EMV QR payload broken into TLV fields, with fields 26 and 54 expanded",
        caption:
            "A dynamic payload, field by field. Every field is an ID, a two-digit length, and a value. A template like 26 carries more TLV fields inside its value, and its length covers all of them.",
        render: (a) => <TlvAnatomy a={a} />,
    },
    "push-chunks": {
        w: 800,
        h: 300,
        label: "Timeline of two workers each sending one chunk at a time, then a retry pass",
        caption:
            "Illustrative timing. The semaphore keeps two chunks in flight, one per worker, until the list is done. Failed sends wait for a single retry pass at the end instead of slowing the run down.",
        render: () => <PushChunks />,
    },
    "r2p-sequence": {
        w: 800,
        h: 420,
        label: "Sequence diagram of a request paid in the app, then attempted again over USSD",
        caption:
            "The customer pays in the app first, so the conditional update moves the request to Paid. The USSD attempt finds nothing left to update and gets an 'already paid' answer. The same holds the other way round.",
        render: (a) => <RequestToPaySequence a={a} />,
    },
    "build-once": {
        w: 800,
        h: 330,
        label: "Two release pipelines compared: rebuilding per environment, and promoting one image",
        caption:
            "Rebuilding per environment produces a new artifact every time, so production runs something UAT never saw. Building once and promoting by tag means production runs the exact image that passed.",
        render: (a) => <BuildOnce a={a} />,
    },
    "ttl-timeline": {
        w: 800,
        h: 300,
        label: "Timeline of dashboard loads, cache hits and misses, and calls to the external APIs",
        caption:
            "The first load after a TTL window expires pays for the external API calls; every load inside the window is served from cache. A short TTL keeps the data close to live while cutting upstream calls to one per window.",
        render: (a) => <TtlTimeline a={a} />,
    },
};

export default function PostFigure({ id, number }: { id: string; number: number }) {
    const ref = useRef<HTMLElement>(null);
    const arrowId = `pf-arrow-${useId().replace(/:/g, "")}`;
    const fig = FIGURES[id];

    useEffect(() => {
        const root = ref.current;
        if (!root || !fig) return;
        if (window.matchMedia?.("(prefers-reduced-motion: reduce)").matches) return;

        let alive = true;
        let revert: (() => void) | undefined;
        (async () => {
            const gsap = (await import("gsap")).default;
            const ScrollTrigger = (await import("gsap/ScrollTrigger")).default;
            gsap.registerPlugin(ScrollTrigger);
            if (!alive) return;

            const ctx = gsap.context(() => {
                const q = gsap.utils.selector(root);
                const draw = q<SVGGeometryElement>("[data-pf-draw]:not(.is-dashed)");
                draw.forEach((el) => {
                    const len = el.getTotalLength();
                    gsap.set(el, { strokeDasharray: len, strokeDashoffset: len });
                });
                gsap.timeline({
                    defaults: { ease: "power3.out" },
                    scrollTrigger: { trigger: root, start: "top 80%", once: true },
                })
                    .to(draw, { strokeDashoffset: 0, duration: 0.9, stagger: 0.05, ease: "power2.inOut" }, 0)
                    .from(q("[data-pf-in], [data-pf-draw].is-dashed"), { opacity: 0, y: 6, duration: 0.45, stagger: 0.025 }, 0.15);
            }, root);
            revert = () => ctx.revert();
        })();

        return () => {
            alive = false;
            revert?.();
        };
    }, [fig]);

    if (!fig) return null;

    return (
        <figure ref={ref} className="post-figure">
            <div className="post-figure__canvas">
                <svg viewBox={`0 0 ${fig.w} ${fig.h}`} className="post-figure__svg" role="img" aria-label={fig.label}>
                    <defs>
                        <marker id={arrowId} viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse">
                            <path d="M0 1 L9 5 L0 9 z" className="pf-arrow" />
                        </marker>
                    </defs>
                    {fig.render(arrowId)}
                </svg>
            </div>
            <figcaption className="post-figure__caption">
                <span className="post-figure__num">Fig. {number}</span>
                {fig.caption}
            </figcaption>
        </figure>
    );
}
