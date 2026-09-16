import { Link } from "react-router-dom";
import RevealText from "@/shared/effects/RevealText";
import { PROFILE } from "@/data/profile";
import Eyebrow from "./Eyebrow";
import { ARROW_CIRCLE_SVG, ARROW_SVG } from "./icons";

export default function HomeCta() {
    return (
        <section className="dev-cta pt-120 pb-120 border-top-100">
            <div className="container">
                <div className="row align-items-end g-5">
                    <div className="col-lg-8">
                        <Eyebrow>let&apos;s talk</Eyebrow>
                        <h2 className="dev-cta__title reveal-text mb-0">
                            <RevealText>Building something that has to work on the first attempt?</RevealText>
                        </h2>
                        <p className="availability mt-30 mb-0">
                            <span className="contact-status__dot" aria-hidden />
                            <span>
                                Open to <strong>full stack &amp; backend roles</strong>, and to scoped freelance work.
                            </span>
                        </p>
                    </div>
                    <div className="col-lg-4">
                        <div className="d-flex flex-wrap align-items-center justify-content-lg-end gap-4">
                            <div className="at-btn-group">
                                <Link className="at-btn-circle" to="/contact" aria-hidden tabIndex={-1}>
                                    {ARROW_CIRCLE_SVG}
                                </Link>
                                <Link className="at-btn z-index-1" to="/contact">
                                    Get in touch
                                </Link>
                                <Link className="at-btn-circle" to="/contact" aria-hidden tabIndex={-1}>
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
        </section>
    );
}
