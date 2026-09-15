import { Link } from "react-router-dom";
import RevealText from "@/shared/effects/RevealText";
import { EXPERIENCE, PROFILE } from "@/data/profile";
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

            <div className="container pt-100 pb-100">
                <div className="row g-5">
                    <div className="col-lg-3">
                        <Eyebrow>my journey</Eyebrow>
                        <h3 className="mb-0">Experience</h3>
                        <h6 className="fz-font-lg reveal-text">
                            <RevealText>Building fintech, telecom, and enterprise systems since 2023</RevealText>
                        </h6>
                    </div>
                    <div className="col-lg-8 ms-lg-auto block-journey">
                        <div className="journey-list-wrap">
                            <div className="journey-list-line" aria-hidden />
                            <ul className="journey-list" role="list">
                                {EXPERIENCE.map((item) => (
                                    <li key={item.date} className="journey-list__item border-bottom-100">
                                        <span className="journey-list__date neutral-900">{item.date}</span>
                                        <div className="journey-list__body">
                                            <h6 className="journey-list__title neutral-900">{item.title}</h6>
                                            <p className="journey-list__desc neutral-500">{item.desc}</p>
                                        </div>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
