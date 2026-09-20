import { Link } from "react-router-dom";
import { PROFILE } from "@/data/profile";
import HeroProof from "./HeroProof";
import { ARROW_SVG } from "./icons";

function SwapLabel({ label }: { label: string }) {
    return (
        <span>
            <span className="text-1">{label}</span>
            <span className="text-2">{label}</span>
        </span>
    );
}

export default function HomeHero() {
    return (
        <div className="bg-neutral-50">
            <div className="container-2200 p-relative z-0 pt-85">
                <section className="dev-hero p-relative mt-20 rounded-5 mx-lg-3 mx-2 changeless">
                    <div className="container p-relative z-index-1">
                        <div className="row">
                            <div className="col-xl-10 col-lg-11">
                                <p className="dev-hero__tagline d-inline-flex align-items-center gap-2 mb-30">
                                    <span className="contact-status__dot" aria-hidden />
                                    {PROFILE.role}, based in Islamabad
                                </p>
                                <h1 className="dev-hero__headline fw-600 text-white mb-30">
                                    I build payment platforms and backend systems that hold up under real traffic.
                                </h1>
                                <p className="dev-hero__lead mb-40">{PROFILE.heroLead}</p>
                                <div className="d-flex flex-wrap align-items-center gap-4">
                                    <Link to="/portfolio" className="at-btn text-white rounded-0">
                                        <SwapLabel label="View case studies" />
                                        <i>
                                            {ARROW_SVG}
                                            {ARROW_SVG}
                                        </i>
                                    </Link>
                                    <a href={PROFILE.cvUrl} download className="at-btn text-white border-bottom-opacity bg-transparent rounded-0 p-0 pb-2">
                                        <SwapLabel label="Download CV" />
                                        <i>
                                            {ARROW_SVG}
                                            {ARROW_SVG}
                                        </i>
                                    </a>
                                </div>
                            </div>
                        </div>

                        {/* Proof band: the numbers a recruiter is scanning for, each one
                            a link straight to the case study that backs it. */}
                        <HeroProof />
                    </div>
                </section>
            </div>
        </div>
    );
}
