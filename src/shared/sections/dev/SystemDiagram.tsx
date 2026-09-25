import { useEffect, useId, useRef } from "react";
import type { Diagram, DiagramEdge, DiagramNode } from "@/data/diagrams";

/**
 * Draws a case study's architecture as an SVG blueprint, then brings it to life
 * with GSAP: the boxes and wires draw themselves in, and packets run through the
 * system one step at a time while the matching caption lights up.
 *
 * The SVG is complete without JavaScript (and so in the prerendered HTML); the
 * animation only layers on top. Under prefers-reduced-motion it stays static.
 *
 * `mini` is the thumbnail used on cards: no text, just the shape of the system
 * with traffic running through it.
 */

const W = 1000;
const H = 560;
const NODE_W = 180;
const NODE_H = 76;

type Pt = { x: number; y: number };
type Box = { x: number; y: number; w: number; h: number };

const box = (n: DiagramNode): Box => ({ x: n.x, y: n.y, w: n.w ?? NODE_W, h: n.h ?? NODE_H });

/** Picks the facing sides of two boxes and returns the anchor points plus their outward normals. */
function anchors(a: Box, b: Box, axis?: "x" | "y") {
    const dx = b.x - a.x;
    const dy = b.y - a.y;
    const horizontal = axis
        ? axis === "x"
        : Math.abs(dx) / ((a.w + b.w) / 2) >= Math.abs(dy) / ((a.h + b.h) / 2);
    if (horizontal) {
        const s = Math.sign(dx) || 1;
        return {
            horizontal,
            p0: { x: a.x + (s * a.w) / 2, y: a.y },
            p3: { x: b.x - (s * b.w) / 2, y: b.y },
            n0: { x: s, y: 0 },
        };
    }
    const s = Math.sign(dy) || 1;
    return {
        horizontal,
        p0: { x: a.x, y: a.y + (s * a.h) / 2 },
        p3: { x: b.x, y: b.y - (s * b.h) / 2 },
        n0: { x: 0, y: s },
    };
}

type Curve = [Pt, Pt, Pt, Pt];

function curvesFor(edge: DiagramEdge, a: Box, b: Box): Curve[] {
    if (edge.loop) {
        // Out of the bottom of one, round underneath, and back up into the other.
        const p0 = { x: a.x, y: a.y + a.h / 2 };
        const p3 = { x: b.x, y: b.y + b.h / 2 };
        const depth = edge.bend ?? 130;
        return [[p0, { x: p0.x, y: p0.y + depth }, { x: p3.x, y: p3.y + depth }, p3]];
    }
    const { horizontal, p0, p3, n0 } = anchors(a, b, edge.axis);
    const dist = Math.hypot(p3.x - p0.x, p3.y - p0.y);
    const k = Math.max(36, dist * 0.42);
    const bend = edge.bend ?? 0;
    // Perpendicular to the direction of travel, for the bend.
    const perp = { x: -n0.y, y: n0.x };
    const fan = edge.fan ?? 1;
    const spread = (horizontal ? a.h : a.w) * 0.34;

    return Array.from({ length: fan }, (_, i) => {
        const t = fan === 1 ? 0 : i / (fan - 1) - 0.5;
        const off = { x: perp.x * t * spread * 2, y: perp.y * t * spread * 2 };
        const s = { x: p0.x + off.x, y: p0.y + off.y };
        const c1 = { x: s.x + n0.x * k + perp.x * bend, y: s.y + n0.y * k + perp.y * bend };
        const c2 = { x: p3.x - n0.x * k + perp.x * bend, y: p3.y - n0.y * k + perp.y * bend };
        return [s, c1, c2, p3];
    });
}

const d = ([p0, c1, c2, p3]: Curve) =>
    `M${p0.x.toFixed(1)} ${p0.y.toFixed(1)} C${c1.x.toFixed(1)} ${c1.y.toFixed(1)} ${c2.x.toFixed(1)} ${c2.y.toFixed(1)} ${p3.x.toFixed(1)} ${p3.y.toFixed(1)}`;

function midpoint([p0, c1, c2, p3]: Curve): Pt {
    // Cubic bezier at t = 0.5.
    return {
        x: 0.125 * p0.x + 0.375 * c1.x + 0.375 * c2.x + 0.125 * p3.x,
        y: 0.125 * p0.y + 0.375 * c1.y + 0.375 * c2.y + 0.125 * p3.y,
    };
}

function NodeShape({ n, mini }: { n: DiagramNode; mini: boolean }) {
    const { x, y, w, h } = box(n);
    const left = x - w / 2;
    const top = y - h / 2;
    const rx = n.kind === "actor" ? h / 2 : 12;
    const cls = `dg-node dg-node--${n.kind}${n.focus ? " is-focus" : ""}`;

    return (
        <g className={cls} data-node={n.id}>
            <rect className="dg-node__glow" x={left - 6} y={top - 6} width={w + 12} height={h + 12} rx={rx + 6} />
            <rect className="dg-node__box" x={left} y={top} width={w} height={h} rx={rx} />
            {n.kind === "store" && (
                <path className="dg-node__detail" d={`M${left} ${top + 14} Q${x} ${top + 30} ${left + w} ${top + 14}`} />
            )}
            {n.kind === "channel" && (
                <path
                    className="dg-node__detail"
                    d={`M${left + 10} ${top + 22} v-12 h12 M${left + w - 10} ${top + h - 22} v12 h-12`}
                />
            )}
            {mini ? (
                <g className="dg-node__bars">
                    <rect x={x - w * 0.28} y={y - 9} width={w * 0.56} height={7} rx={3.5} />
                    {n.sub && <rect x={x - w * 0.2} y={y + 6} width={w * 0.4} height={5} rx={2.5} />}
                </g>
            ) : (
                <>
                    <text className="dg-node__label" x={x} y={n.sub ? y - 4 : y + 6} textAnchor="middle">
                        {n.label}
                    </text>
                    {n.sub && (
                        <text className="dg-node__sub" x={x} y={y + 18} textAnchor="middle">
                            {n.sub}
                        </text>
                    )}
                </>
            )}
        </g>
    );
}

type Props = { diagram: Diagram; mini?: boolean; className?: string };

export default function SystemDiagram({ diagram, mini = false, className = "" }: Props) {
    const rootRef = useRef<HTMLDivElement>(null);
    const uid = useId().replace(/:/g, "");
    const nodesById = new Map(diagram.nodes.map((n) => [n.id, n]));
    const stepCount = Math.max(...diagram.edges.map((e) => e.step));

    // Each edge's curves, plus the first edge of each step, which carries the step badge.
    const seenSteps = new Set<number>();
    const edges = diagram.edges.flatMap((e, i) => {
        const a = nodesById.get(e.from);
        const b = nodesById.get(e.to);
        if (!a || !b) return [];
        const curves = curvesFor(e, box(a), box(b));
        const badge = !seenSteps.has(e.step);
        seenSteps.add(e.step);
        const main = curves[Math.floor(curves.length / 2)];
        // Mostly-horizontal wires have no room beside the badge, so their label sits above it.
        const flat = Math.abs(main[3].x - main[0].x) >= Math.abs(main[3].y - main[0].y);
        return [{ e, i, curves, mid: midpoint(main), badge, flat }];
    });

    useEffect(() => {
        const root = rootRef.current;
        if (!root) return;
        if (window.matchMedia?.("(prefers-reduced-motion: reduce)").matches) return;

        let alive = true;
        const cleanups: (() => void)[] = [];

        (async () => {
            const gsap = (await import("gsap")).default;
            const ScrollTrigger = (await import("gsap/ScrollTrigger")).default;
            const MotionPathPlugin = (await import("gsap/MotionPathPlugin")).default;
            gsap.registerPlugin(ScrollTrigger, MotionPathPlugin);
            if (!alive) return;

            const ctx = gsap.context(() => {
                const q = gsap.utils.selector(root);
                const svg = root.querySelector("svg");
                const packetLayer = root.querySelector<SVGGElement>(".dg-packets");
                if (!svg || !packetLayer) return;

                // Solid wires draw in from their source; dashed ones fade, since their
                // dash pattern is already using the stroke-dasharray the draw needs.
                const solid = q<SVGPathElement>(".dg-wire:not(.is-dashed)");
                solid.forEach((p) => {
                    const len = p.getTotalLength();
                    gsap.set(p, { strokeDasharray: len, strokeDashoffset: len });
                });

                const intro = gsap.timeline({ paused: true, defaults: { ease: "power3.out" } });
                intro
                    .from(q(".dg-zone"), { opacity: 0, duration: 0.6 })
                    .from(
                        q(".dg-node"),
                        { opacity: 0, scale: 0.92, transformOrigin: "50% 50%", duration: 0.5, stagger: 0.06 },
                        0.1,
                    )
                    .to(solid, { strokeDashoffset: 0, duration: 0.7, stagger: 0.03, ease: "power2.inOut" }, 0.35)
                    .from(q(".dg-wire.is-dashed"), { opacity: 0, duration: 0.5, stagger: 0.04 }, 0.6)
                    .from(q(".dg-badge, .dg-note"), { opacity: 0, y: 6, duration: 0.4, stagger: 0.05 }, 0.8);

                // The traffic loop: one segment per step, packets on every wire in it.
                const loop = gsap.timeline({ paused: true, repeat: -1, repeatDelay: mini ? 0.4 : 1 });
                const hold = mini ? 1.1 : 2.1;

                for (let s = 1; s <= stepCount; s++) {
                    loop.addLabel(`s${s}`);
                    const at = loop.duration();
                    const wires = q<SVGPathElement>(`.dg-wire[data-step="${s}"]`);
                    const caption = root.querySelector(`[data-caption="${s}"]`);
                    const targets = new Set(wires.map((w) => w.dataset.to));

                    loop.call(
                        () => {
                            root.querySelectorAll(".is-active").forEach((el) => el.classList.remove("is-active"));
                            wires.forEach((w) => w.classList.add("is-active"));
                            caption?.classList.add("is-active");
                            q(`.dg-badge[data-step="${s}"]`).forEach((b) => b.classList.add("is-active"));
                        },
                        [],
                        at,
                    );

                    wires.forEach((wire, i) => {
                        const dot = document.createElementNS("http://www.w3.org/2000/svg", "circle");
                        dot.setAttribute("r", mini ? "7" : "5");
                        dot.setAttribute("class", "dg-packet");
                        dot.style.opacity = "0";
                        packetLayer.appendChild(dot);
                        loop.fromTo(
                            dot,
                            { opacity: 0 },
                            {
                                opacity: 1,
                                duration: 1.05,
                                ease: "power1.inOut",
                                motionPath: { path: wire, align: wire, alignOrigin: [0.5, 0.5] },
                                immediateRender: false,
                            },
                            at + (i % 6) * 0.07,
                        ).to(dot, { opacity: 0, duration: 0.2 }, ">-0.05");
                    });

                    targets.forEach((id) => {
                        const glow = root.querySelector(`[data-node="${id}"] .dg-node__glow`);
                        if (glow) {
                            loop.fromTo(
                                glow,
                                { opacity: 0 },
                                { opacity: 1, duration: 0.25, yoyo: true, repeat: 1, repeatDelay: 0.35 },
                                at + 0.95,
                            );
                        }
                    });

                    loop.to({}, { duration: hold }, at);
                }

                ScrollTrigger.create({
                    trigger: root,
                    start: "top 80%",
                    end: "bottom top",
                    once: false,
                    onEnter: () => {
                        if (!intro.progress()) intro.play().then(() => loop.play());
                        else loop.play();
                    },
                    onEnterBack: () => loop.play(),
                    onLeave: () => loop.pause(),
                    onLeaveBack: () => loop.pause(),
                });

                // Captions double as controls: click one to replay the system from that step.
                const buttons = root.querySelectorAll<HTMLButtonElement>("[data-caption]");
                buttons.forEach((btn) => {
                    const go = () => {
                        intro.progress(1);
                        loop.play(`s${btn.dataset.caption}`);
                    };
                    btn.addEventListener("click", go);
                    cleanups.push(() => btn.removeEventListener("click", go));
                });
            }, root);

            cleanups.push(() => ctx.revert());
        })();

        return () => {
            alive = false;
            cleanups.forEach((fn) => fn());
            root.querySelectorAll(".dg-packet").forEach((el) => el.remove());
        };
    }, [mini, stepCount]);

    const arrowId = `dg-arrow-${uid}`;
    const gridId = `dg-grid-${uid}`;

    return (
        <div ref={rootRef} className={`dg${mini ? " dg--mini" : ""} ${className}`.trim()}>
            <div className={mini ? undefined : "dg-scroll"}>
                <svg
                    viewBox={`0 0 ${W} ${H}`}
                    className="dg-svg"
                    role={mini ? undefined : "img"}
                    aria-hidden={mini || undefined}
                    aria-label={mini ? undefined : `${diagram.title}. ${diagram.steps.join(". ")}.`}
                >
                    <defs>
                        <pattern id={gridId} width="24" height="24" patternUnits="userSpaceOnUse">
                            <circle cx="1" cy="1" r="1" className="dg-grid-dot" />
                        </pattern>
                        <marker
                            id={arrowId}
                            viewBox="0 0 10 10"
                            refX="9"
                            refY="5"
                            markerWidth="7"
                            markerHeight="7"
                            orient="auto-start-reverse"
                        >
                            <path d="M0 1 L9 5 L0 9 z" className="dg-arrow" />
                        </marker>
                    </defs>
                    <rect width={W} height={H} fill={`url(#${gridId})`} />

                    {diagram.zones?.map((z) => (
                        <g key={z.label} className="dg-zone">
                            <rect x={z.x} y={z.y} width={z.w} height={z.h} rx={20} />
                            {!mini && (
                                <text x={z.x + 16} y={z.y + 22}>
                                    {z.label}
                                </text>
                            )}
                        </g>
                    ))}

                    <g className="dg-wires">
                        {edges.map(({ e, i, curves }) =>
                            curves.map((c, j) => (
                                <path
                                    key={`${i}-${j}`}
                                    d={d(c)}
                                    className={`dg-wire${e.dashed ? " is-dashed" : ""}`}
                                    data-step={e.step}
                                    data-edge={i}
                                    data-from={e.from}
                                    data-to={e.to}
                                    markerEnd={j === Math.floor(curves.length / 2) ? `url(#${arrowId})` : undefined}
                                />
                            )),
                        )}
                    </g>

                    <g className="dg-nodes">
                        {diagram.nodes.map((n) => (
                            <NodeShape key={n.id} n={n} mini={mini} />
                        ))}
                    </g>

                    {!mini &&
                        edges.map(({ e, i, mid, badge, flat }) =>
                            badge || e.label ? (
                                <g key={`b${i}`} className="dg-badge" data-step={e.step} data-edge={i}>
                                    {badge && (
                                        <>
                                            <circle cx={mid.x} cy={mid.y} r={12} />
                                            <text x={mid.x} y={mid.y + 4} textAnchor="middle" className="dg-badge__num">
                                                {e.step}
                                            </text>
                                        </>
                                    )}
                                    {e.label && (
                                        <text
                                            x={mid.x + (badge && !flat ? 18 : 0)}
                                            y={mid.y + (e.labelBelow ? 30 : !badge ? -8 : flat ? -20 : 4)}
                                            textAnchor={badge && !flat ? "start" : "middle"}
                                            className="dg-badge__label"
                                        >
                                            {e.label}
                                        </text>
                                    )}
                                </g>
                            ) : null,
                        )}

                    {!mini &&
                        diagram.notes?.map((n) => (
                            <text key={n.text} x={n.x} y={n.y} textAnchor="middle" className="dg-note">
                                {n.text}
                            </text>
                        ))}

                    <g className="dg-packets" />
                </svg>
            </div>

            {!mini && (
                <ol className="dg-steps">
                    {diagram.steps.map((s, i) => (
                        <li key={s}>
                            <button type="button" className="dg-step" data-caption={i + 1}>
                                <span className="dg-step__num">{String(i + 1).padStart(2, "0")}</span>
                                <span className="dg-step__text">{s}</span>
                            </button>
                        </li>
                    ))}
                </ol>
            )}
        </div>
    );
}
