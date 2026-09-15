import { useState } from "react";
import { Link } from "react-router-dom";
import { CASE_STUDIES } from "@/data/caseStudies";
import { SKILLS } from "@/data/profile";
import Eyebrow from "./Eyebrow";

/** Dark panel: pick a stack group on the left, read it as a code file on the right. */
export default function AboutStack() {
    const [active, setActive] = useState(0);
    const group = SKILLS[active];
    const usedIn = CASE_STUDIES.filter((cs) => group.usedIn.includes(cs.slug));

    return (
        <div className="container-2200 pt-30 pb-30">
            <section className="stack-panel rounded-5 mx-lg-3 mx-2 changeless">
                <div className="container">
                    <div className="row g-4 align-items-end pb-60">
                        <div className="col-lg-6">
                            <Eyebrow light>my stack</Eyebrow>
                            <h3 className="text-white mb-0">Tech I work with</h3>
                        </div>
                        <div className="col-lg-5 ms-auto text-lg-end">
                            <p className="stack-panel__intro mb-0">
                                .NET and ABP.io on the backend, Angular and React on the frontend, and Docker, Kubernetes, and AWS underneath.
                            </p>
                        </div>
                    </div>

                    <div className="row g-5">
                        <div className="col-lg-4">
                            <div className="stack-tabs" role="tablist" aria-label="Tech stack groups">
                                {SKILLS.map((g, i) => (
                                    <button
                                        key={g.key}
                                        type="button"
                                        role="tab"
                                        id={`stack-tab-${g.key}`}
                                        aria-selected={i === active}
                                        aria-controls="stack-editor"
                                        className={`stack-tab${i === active ? " is-active" : ""}`}
                                        onClick={() => setActive(i)}
                                    >
                                        <span className="stack-tab__title">{g.title}</span>
                                        <span className="stack-tab__count">{g.items.length}</span>
                                    </button>
                                ))}
                            </div>
                        </div>

                        <div className="col-lg-8">
                            <div className="terminal-card stack-editor" id="stack-editor" role="tabpanel" aria-labelledby={`stack-tab-${group.key}`}>
                                <div className="terminal-card__bar">
                                    <span className="terminal-card__dot" aria-hidden />
                                    <span className="terminal-card__dot" aria-hidden />
                                    <span className="terminal-card__dot" aria-hidden />
                                    <div className="stack-editor__files" aria-hidden>
                                        {SKILLS.map((g, i) => (
                                            <span key={g.key} className={`stack-editor__file${i === active ? " is-active" : ""}`}>
                                                {g.key}.ts
                                            </span>
                                        ))}
                                    </div>
                                </div>
                                <pre className="terminal-card__body stack-editor__body">
                                    <code key={group.key} className="stack-editor__code">
                                        <span className="tok-comment">{`// ${group.comment}`}</span>
                                        {"\n"}
                                        <span className="tok-keyword">export const</span> <span className="tok-name">{group.key}</span>{" "}
                                        <span className="tok-punct">= [</span>
                                        {"\n"}
                                        {group.items.map((item, i) => (
                                            <span key={item}>
                                                {"  "}
                                                <span className="tok-string">{`"${item}"`}</span>
                                                <span className="tok-punct">{i < group.items.length - 1 ? "," : ""}</span>
                                                {"\n"}
                                            </span>
                                        ))}
                                        <span className="tok-punct">]</span> <span className="tok-keyword">as const</span>
                                        <span className="tok-punct">;</span>
                                    </code>
                                </pre>
                            </div>
                            <div className="stack-used">
                                <span className="stack-used__label">{usedIn.length ? "used in →" : "// across every project above"}</span>
                                {usedIn.map((cs) => (
                                    <Link key={cs.slug} to={`/portfolio/${cs.slug}`} className="stack-used__link">
                                        {cs.file}
                                    </Link>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
}
