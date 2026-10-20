import { useId, useState } from "react";
import RevealText from "@/shared/effects/RevealText";
import { HOME } from "@/data/pages/home";
import { PROFILE } from "@/data/profile";
import { RECOMMENDATIONS } from "@/data/recommendations";
import { ARROW_SVG } from "./icons";

function initials(name: string) {
    const parts = name.split(" ").filter(Boolean);
    return `${parts[0]?.[0] ?? ""}${parts[parts.length - 1]?.[0] ?? ""}`.toUpperCase();
}

/** Past this many characters (about twelve lines on a phone) a quote is
 *  clamped there, where one long recommendation would otherwise fill more
 *  than a screen on its own. Shorter ones show in full. */
const CLAMP_AT = 420;

function Quote({ text }: { text: string }) {
    const [open, setOpen] = useState(false);
    const id = useId();
    const long = text.length > CLAMP_AT;
    return (
        <>
            <blockquote id={id} className={`reco-card__quote${long && !open ? " is-clamped" : ""}`}>
                {text.split("\n\n").map((paragraph, i) => (
                    <p key={i}>{paragraph}</p>
                ))}
            </blockquote>
            {long && (
                <button
                    type="button"
                    className="reco-card__more"
                    aria-expanded={open}
                    aria-controls={id}
                    onClick={() => setOpen((v) => !v)}
                >
                    {open ? HOME.recommendations.less : HOME.recommendations.more}
                </button>
            )}
        </>
    );
}

/** Real LinkedIn recommendations, shown as a masonry of quote cards. */
export default function Recommendations({ muted = false }: { muted?: boolean }) {
    return (
        <section className={`reco-section pt-120 pb-100 ${muted ? "bg-neutral-50" : ""}`.trim()}>
            <div className="container">
                <div className="row align-items-end g-4 pb-50">
                    <div className="col-lg-7">
                        <h2 className="h3 reveal-text mb-0">
                            <RevealText>{HOME.recommendations.title}</RevealText>
                        </h2>
                    </div>
                    <div className="col-lg-4 ms-auto text-lg-end">
                        <a
                            href={PROFILE.linkedin}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="at-btn common-black border-bottom-900 bg-transparent rounded-0 p-0 pb-2"
                        >
                            <span>
                                <span className="text-1">{HOME.recommendations.cta}</span>
                                <span className="text-2">{HOME.recommendations.cta}</span>
                            </span>
                            <i>
                                {ARROW_SVG}
                                {ARROW_SVG}
                            </i>
                        </a>
                    </div>
                </div>

                <div className="reco-grid" data-reveal-group>
                    {RECOMMENDATIONS.map((r) => (
                        <figure key={r.name} className={`reco-card${muted ? " reco-card--light" : ""}`} data-reveal>
                            <Quote text={r.text} />
                            <figcaption className="reco-card__author">
                                <span className="reco-card__initials" aria-hidden>
                                    {initials(r.name)}
                                </span>
                                <span>
                                    <span className="reco-card__name">{r.name}</span>
                                    <span className="reco-card__role">{r.role}</span>
                                    <span className="reco-card__relation">
                                        {r.relationship}, {r.date}
                                    </span>
                                </span>
                            </figcaption>
                        </figure>
                    ))}
                </div>
            </div>
        </section>
    );
}
