import { Link } from "react-router-dom";
import RevealText from "@/shared/effects/RevealText";
import { CASE_STUDIES } from "@/data/caseStudies";
import CaseStudyCard from "./CaseStudyCard";
import Eyebrow from "./Eyebrow";
import { ARROW_CIRCLE_SVG } from "./icons";

export default function HomeCaseStudies() {
    const featured = CASE_STUDIES.filter((cs) => cs.featured).slice(0, 3);

    return (
        <div className="container-2200 bg-neutral-50 pt-30">
            <section className="pt-100 pb-100 rounded-5 mx-lg-3 mx-2 fix p-relative bg-neutral-0 border-100">
                <div className="container">
                    <div className="row align-items-end g-4">
                        <div className="col-lg-6">
                            <Eyebrow>case studies</Eyebrow>
                            <h3 className="reveal-text mb-0">
                                <RevealText>Production systems, with the numbers to show for it</RevealText>
                            </h3>
                        </div>
                        <div className="col-lg-3 ms-auto d-flex justify-content-lg-end">
                            <div className="at-btn-group at-btn-group-transparent">
                                <Link className="at-btn-circle" to="/portfolio" aria-hidden tabIndex={-1}>
                                    {ARROW_CIRCLE_SVG}
                                </Link>
                                <Link className="at-btn z-index-1" to="/portfolio">
                                    All work
                                </Link>
                                <Link className="at-btn-circle" to="/portfolio" aria-hidden tabIndex={-1}>
                                    {ARROW_CIRCLE_SVG}
                                </Link>
                            </div>
                        </div>
                    </div>

                    <div className="row g-4 pt-60">
                        {featured.map((cs) => (
                            <div key={cs.slug} className="col-lg-4 col-md-6">
                                <CaseStudyCard cs={cs} />
                            </div>
                        ))}
                    </div>
                </div>
            </section>
        </div>
    );
}
