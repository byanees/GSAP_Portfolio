import { type CSSProperties, useEffect, useRef, useState } from "react";
import { ABOUT } from "@/data/pages/about";
import { TOOL_ICONS, type ToolIcon } from "@/shared/sections/dev/toolIcons";

// About page tool rail, under the hero: brand-marked tools on top, the
// practices behind them underneath, scrolling against each other. The lists
// are ABOUT.ticker in src/data/pages/about.ts.
//
// Each rail holds its list twice and slides by exactly one copy with a CSS
// transform, so the loop is seamless and never touches layout. The second
// copy is aria-hidden; the first is the real list. Each mark's path is
// written once as an SVG symbol and the chips <use> it, so doubling the list
// does not double the markup.

const SPARK_SVG = (
    <svg className="tool-rail__spark" width="12" height="12" viewBox="0 0 16 16" aria-hidden="true">
        <path
            d="M8 0C8.1206 4.36736 11.6326 7.8794 16 8C11.6326 8.1206 8.1206 11.6326 8 16C7.8794 11.6326 4.36736 8.1206 0 8C4.36736 7.8794 7.8794 4.36736 8 0Z"
            fill="currentColor"
        />
    </svg>
);

const iconId = (key: string) => `tool-icon-${key}`;

export default function AboutToolRail() {
    const { label, tools, practices, pauseLabel, playLabel } = ABOUT.ticker;
    const rootRef = useRef<HTMLElement>(null);
    // Motion that loops for more than five seconds needs a way to stop it.
    // Reduced motion is handled in CSS: the rails stop and wrap.
    const [paused, setPaused] = useState(false);
    const [offscreen, setOffscreen] = useState(false);

    useEffect(() => {
        const el = rootRef.current;
        if (!el || !("IntersectionObserver" in window)) return;
        const io = new IntersectionObserver(([entry]) => setOffscreen(!entry.isIntersecting));
        io.observe(el);
        return () => io.disconnect();
    }, []);

    const toolList = (copy: number) => (
        <ul className="tool-rail__list" aria-hidden={copy > 0 || undefined}>
            {tools.map((key) => {
                const icon = TOOL_ICONS[key];
                return (
                    <li key={key} className="tool-rail__chip" style={{ "--tool-color": icon.color } as CSSProperties}>
                        <svg className="tool-rail__icon" viewBox={icon.viewBox} aria-hidden="true">
                            <use href={`#${iconId(key)}`} />
                        </svg>
                        <span className="tool-rail__name">{icon.label}</span>
                    </li>
                );
            })}
        </ul>
    );

    const practiceList = (copy: number) => (
        <ul className="tool-rail__list" aria-hidden={copy > 0 || undefined}>
            {practices.map((name) => (
                <li key={name} className="tool-rail__practice">
                    {SPARK_SVG}
                    <span>{name}</span>
                </li>
            ))}
        </ul>
    );

    return (
        <section
            ref={rootRef}
            className={`tool-rail pt-30 pb-30${paused || offscreen ? " is-paused" : ""}`}
            aria-label={label}
        >
            <svg className="tool-rail__sprite" aria-hidden="true" focusable="false">
                {tools.map((key) => {
                    const icon: ToolIcon = TOOL_ICONS[key];
                    return (
                        <symbol key={key} id={iconId(key)} viewBox={icon.viewBox}>
                            <path d={icon.d} fillRule={icon.fillRule} fill="currentColor" />
                        </symbol>
                    );
                })}
            </svg>

            <div className="tool-rail__row" style={{ "--rail-duration": `${tools.length * 3.2}s` } as CSSProperties}>
                <div className="tool-rail__track">
                    {toolList(0)}
                    {toolList(1)}
                </div>
            </div>
            <div
                className="tool-rail__row tool-rail__row--reverse"
                style={{ "--rail-duration": `${practices.length * 4.2}s` } as CSSProperties}
            >
                <div className="tool-rail__track">
                    {practiceList(0)}
                    {practiceList(1)}
                </div>
            </div>

            <button type="button" className="tool-rail__toggle" onClick={() => setPaused((p) => !p)} aria-pressed={paused}>
                {paused ? playLabel : pauseLabel}
            </button>
        </section>
    );
}
