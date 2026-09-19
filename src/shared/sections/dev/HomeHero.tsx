import { Link } from "react-router-dom";
import { PROFILE } from "@/data/profile";
import TerminalCard from "./TerminalCard";
import { ARROW_SVG } from "./icons";

const HERO_LINKS = [
    { label: "Case Studies", href: "/portfolio" },
    { label: "About Me", href: "/about" },
    { label: "Blog", href: "/blog" },
    { label: "Contact", href: "/contact" },
];

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
                        <div className="row align-items-center g-5">
                            <div className="col-xl-6 col-lg-6">
                                <span className="dev-hero__tagline d-inline-flex align-items-center gap-2 mb-30">
                                    <span className="contact-status__dot" aria-hidden />
                                    {PROFILE.role}, based in Islamabad
                                </span>
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
                            <div className="col-xl-6 col-lg-6">
                                <TerminalCard />
                            </div>
                        </div>

                        <div className="dev-hero__footer">
                            <p className="dev-hero__brand text-scale-anim mb-4" aria-hidden="true">Muhammad Anees</p>
                            <div className="row">
                                {HERO_LINKS.map((item) => (
                                    <div key={item.label} className="col-lg-3 col-md-6 col-12 text-center">
                                        <Link
                                            to={item.href}
                                            className="at-btn at-btn-border-white ps-2 pt-20 pb-20 pe-2 text-white bg-transparent rounded-0 border-bottom-0 border-start-0 border-end-0 w-100"
                                        >
                                            <SwapLabel label={item.label} />
                                            <i>
                                                {ARROW_SVG}
                                                {ARROW_SVG}
                                            </i>
                                        </Link>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </section>
            </div>
        </div>
    );
}
