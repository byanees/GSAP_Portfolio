import RevealText from "@/shared/effects/RevealText";
import { PROFILE } from "@/data/profile";
import { RECOMMENDATIONS } from "@/data/recommendations";
import { ARROW_SVG } from "./icons";

function initials(name: string) {
    const parts = name.split(" ").filter(Boolean);
    return `${parts[0]?.[0] ?? ""}${parts[parts.length - 1]?.[0] ?? ""}`.toUpperCase();
}

/** Real LinkedIn recommendations, shown as a masonry of quote cards. */
export default function Recommendations({ muted = false }: { muted?: boolean }) {
    return (
        <section className={`reco-section pt-120 pb-100 ${muted ? "bg-neutral-50" : ""}`.trim()}>
            <div className="container">
                <div className="row align-items-end g-4 pb-50">
                    <div className="col-lg-7">
                        <h2 className="h3 reveal-text mb-0">
                            <RevealText>What colleagues say</RevealText>
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
                                <span className="text-1">Read them on LinkedIn</span>
                                <span className="text-2">Read them on LinkedIn</span>
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
                            <blockquote className="reco-card__quote">
                                {r.text.split("\n\n").map((paragraph, i) => (
                                    <p key={i}>{paragraph}</p>
                                ))}
                            </blockquote>
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
