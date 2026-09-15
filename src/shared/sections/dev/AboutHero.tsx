import { Link } from "react-router-dom";
import RevealText from "@/shared/effects/RevealText";
import { PROFILE } from "@/data/profile";
import Eyebrow from "./Eyebrow";
import { ARROW_CIRCLE_SVG, ARROW_SVG } from "./icons";

export default function AboutHero() {
    return (
        <section className="sec-1-about pt-150 overflow-hidden">
            <div className="container pb-70">
                <div className="row align-items-end g-4">
                    <div className="col-xxl-6 col-lg-7">
                        <Eyebrow>hi, I&apos;m Muhammad Anees</Eyebrow>
                        <h1 className="section-title fw-600 fz-ds-1 lh-1 reveal-text">
                            <RevealText>About Me</RevealText>
                        </h1>
                        <p className="mb-0 fz-font-lg fw-600 neutral-900">{PROFILE.heroLead}</p>
                    </div>
                    <div className="col-lg-5 ms-auto">
                        <div className="d-flex flex-wrap justify-content-lg-end align-items-center gap-4">
                            <div className="at-btn-group">
                                <Link className="at-btn-circle" to="/portfolio" aria-hidden tabIndex={-1}>
                                    {ARROW_CIRCLE_SVG}
                                </Link>
                                <Link className="at-btn z-index-1" to="/portfolio">
                                    See my work
                                </Link>
                                <Link className="at-btn-circle" to="/portfolio" aria-hidden tabIndex={-1}>
                                    {ARROW_CIRCLE_SVG}
                                </Link>
                            </div>
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
                    </div>
                </div>
            </div>

            <div className="container">
                <div className="about-portrait">
                    {PROFILE.portrait ? (
                        <img src={PROFILE.portrait} alt="Muhammad Anees" loading="lazy" />
                    ) : (
                        <div className="about-portrait__placeholder">
                            <span className="about-portrait__mark" aria-hidden>
                                MA
                            </span>
                            <span>portrait.webp — coming soon</span>
                        </div>
                    )}
                </div>
            </div>

            <div className="container pt-60">
                <p className="about-summary mb-0">{PROFILE.summary}</p>
            </div>
        </section>
    );
}
