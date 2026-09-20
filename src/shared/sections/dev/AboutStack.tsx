import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { CASE_STUDIES } from "@/data/caseStudies";
import { STACK_LAYERS, STACK_PRINCIPLES } from "@/data/profile";
import Eyebrow from "./Eyebrow";

/**
 * The stack drawn as the layers a request passes through. Layers light up in turn
 * (paused while the visitor hovers or focuses one) and each shows where it was used.
 */
export default function AboutStack() {
    const [active, setActive] = useState(0);
    const [paused, setPaused] = useState(false);

    useEffect(() => {
        if (paused || window.matchMedia?.("(prefers-reduced-motion: reduce)").matches) return;
        const id = window.setInterval(() => setActive((i) => (i + 1) % STACK_LAYERS.length), 2800);
        return () => window.clearInterval(id);
    }, [paused]);

    const focusLayer = (i: number) => {
        setPaused(true);
        setActive(i);
    };

    return (
        <div className="container-2200 pt-30 pb-30">
            <section className="stack-panel rounded-5 mx-lg-3 mx-2 changeless">
                <div className="container">
                    <div className="row g-4 align-items-end pb-60">
                        <div className="col-lg-7">
                            <Eyebrow light>my stack</Eyebrow>
                            <h2 className="h3 text-white mb-0">From the screen to the server, what I use at every layer</h2>
                        </div>
                        <div className="col-lg-4 ms-auto text-lg-end">
                            <p className="stack-panel__intro mb-0">
                                Follow a request down through the systems I build. Hover a layer to see where it shows up in my work.
                            </p>
                        </div>
                    </div>

                    <div className="arch" onMouseLeave={() => setPaused(false)}>
                        <ol className="arch__layers" data-reveal-group>
                            {STACK_LAYERS.map((layer, i) => {
                                const used = CASE_STUDIES.filter((cs) => layer.usedIn.includes(cs.slug));
                                return (
                                    <li
                                        key={layer.key}
                                        className={`arch-layer${i === active ? " is-active" : ""}`}
                                        data-reveal
                                        tabIndex={0}
                                        onMouseEnter={() => focusLayer(i)}
                                        onFocus={() => focusLayer(i)}
                                        onBlur={() => setPaused(false)}
                                    >
                                        <span className="arch-layer__node" aria-hidden />
                                        <div className="arch-layer__head">
                                            <span className="arch-layer__name">{layer.name}</span>
                                            <p className="arch-layer__role">{layer.role}</p>
                                        </div>
                                        <ul className="arch-layer__items">
                                            {layer.items.map((item) => (
                                                <li key={item}>{item}</li>
                                            ))}
                                        </ul>
                                        <div className="arch-layer__used">
                                            <span className="arch-layer__used-label">{used.length ? "Shows up in" : "Behind"}</span>
                                            {used.length ? (
                                                used.map((cs) => (
                                                    <Link key={cs.slug} to={`/portfolio/${cs.slug}`}>
                                                        {cs.title}
                                                    </Link>
                                                ))
                                            ) : (
                                                <span>every project I ship</span>
                                            )}
                                        </div>
                                    </li>
                                );
                            })}
                        </ol>

                        <aside className="arch__principles">
                            <span className="arch__principles-label">Holding it together</span>
                            <ul>
                                {STACK_PRINCIPLES.map((p) => (
                                    <li key={p}>{p}</li>
                                ))}
                            </ul>
                        </aside>
                    </div>
                </div>
            </section>
        </div>
    );
}
