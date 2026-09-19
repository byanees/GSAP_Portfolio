import { EXPERIENCE, PROFILE } from "@/data/profile";
import Eyebrow from "./Eyebrow";
import StackTags from "./StackTags";
import { ARROW_SVG } from "./icons";

/** Career timeline: commit-style nodes on a rail, one card per role with its numbers and stack. */
export default function AboutExperience() {
    return (
        <section className="xp-section pt-120 pb-120">
            <div className="container">
                <div className="row g-5">
                    <div className="col-lg-4">
                        <Eyebrow>my journey</Eyebrow>
                        <h2 className="h3 mb-20">Experience</h2>
                        <p className="neutral-500 fz-font-lg mb-30">
                            Building fintech, telecom, and enterprise systems since 2023.
                        </p>
                        <a href={PROFILE.cvUrl} download className="at-btn common-black border-bottom-900 bg-transparent rounded-0 p-0 pb-2">
                            <span>
                                <span className="text-1">Download CV</span>
                                <span className="text-2">Download CV</span>
                            </span>
                            <i>
                                {ARROW_SVG}
                                {ARROW_SVG}
                            </i>
                        </a>
                    </div>

                    <div className="col-lg-8">
                        <ol className="xp-list">
                            {EXPERIENCE.map((item) => (
                                <li
                                    key={item.period}
                                    className={`xp-item${item.current ? " is-current" : ""}`}
                                >
                                    <span className="xp-item__node" aria-hidden />
                                    <div className="xp-item__head">
                                        <span className="xp-item__period">{item.period}</span>
                                        <span>{item.location}</span>
                                        {item.current && <span className="xp-item__badge">Current role</span>}
                                    </div>
                                    <div className="xp-card">
                                        <div className="xp-card__title-row">
                                            <h3 className="h4 xp-card__company">{item.company}</h3>
                                            <span className="xp-card__role">{item.role}</span>
                                        </div>
                                        <p className="xp-card__summary">{item.summary}</p>
                                        {item.highlights.length > 0 && (
                                            <ul className="xp-card__highlights">
                                                {item.highlights.map((h) => (
                                                    <li key={h.label}>
                                                        <strong>{h.value}</strong>
                                                        <span>{h.label}</span>
                                                    </li>
                                                ))}
                                            </ul>
                                        )}
                                        {item.stack.length > 0 && <StackTags tags={item.stack} label="Worked with" dark={item.current} />}
                                    </div>
                                </li>
                            ))}
                        </ol>
                    </div>
                </div>
            </div>
        </section>
    );
}
