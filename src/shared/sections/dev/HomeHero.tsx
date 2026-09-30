import { Link } from "react-router-dom";
import { CTA } from "@/data/navigation";
import { HOME } from "@/data/pages/home";
import { PROFILE } from "@/data/profile";
import ReelReplayButton from "@/shared/motion/reel/ReelReplayButton";
import HeroButtonContent from "./HeroButton";
import HeroProof from "./HeroProof";
import { ARROW_SVG, DOWNLOAD_SVG } from "./icons";

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
                                    {HOME.hero.tagline}
                                </p>
                                <h1 className="dev-hero__headline fw-600 text-white mb-30">{HOME.hero.headline}</h1>
                                <p className="dev-hero__lead mb-40">{PROFILE.heroLead}</p>
                                <div className="hero-actions">
                                    <Link to="/portfolio" className="hero-btn hero-btn--primary">
                                        <HeroButtonContent label={CTA.viewCaseStudies} icon={ARROW_SVG} />
                                    </Link>
                                    <a href={PROFILE.cvUrl} download className="hero-btn hero-btn--secondary">
                                        <HeroButtonContent label={CTA.downloadCv} icon={DOWNLOAD_SVG} />
                                    </a>
                                    <ReelReplayButton />
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
