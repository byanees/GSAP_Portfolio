import { Link } from "react-router-dom";
import RevealText from "@/shared/effects/RevealText";
import { PROFILE } from "@/data/profile";
import Eyebrow from "./Eyebrow";
import { ARROW_SVG } from "./icons";

function UnderlineLink({ href, label, external = false, download = false }: { href: string; label: string; external?: boolean; download?: boolean }) {
    const className = "at-btn common-black border-bottom-900 bg-transparent rounded-0 p-0 pb-2";
    const content = (
        <>
            <span>
                <span className="text-1">{label}</span>
                <span className="text-2">{label}</span>
            </span>
            <i>
                {ARROW_SVG}
                {ARROW_SVG}
            </i>
        </>
    );
    if (href.startsWith("/")) {
        return (
            <Link to={href} className={className}>
                {content}
            </Link>
        );
    }
    return (
        <a
            href={href}
            className={className}
            {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
            {...(download ? { download: true } : {})}
        >
            {content}
        </a>
    );
}

export default function WorkWithMe() {
    return (
        <section id="work-with-me" className="work-with-me pt-120 pb-80 border-top-100">
            <div className="container">
                <div className="row pb-60 g-4 align-items-end">
                    <div className="col-lg-7">
                        <Eyebrow>two ways to work together</Eyebrow>
                        <h2 className="h3 reveal-text mb-0">
                            <RevealText>Hire me full-time, or bring me in for a project</RevealText>
                        </h2>
                    </div>
                </div>

                <div className="row g-4" data-reveal-group>
                    <div className="col-lg-6">
                        <article className="engage-card" data-reveal>
                            <h3 className="h4 mb-0">Full-time roles</h3>
                            <p className="neutral-500 mb-0">
                                Full stack or backend roles where reliability matters: fintech, telecom, and enterprise platforms.
                            </p>
                            <ul className="engage-card__list">
                                <li>Based in {PROFILE.location}, {PROFILE.timezone}</li>
                                <li>Open to relocation or fully remote roles</li>
                                <li>Visa sponsorship needed for relocation</li>
                            </ul>
                            <div className="engage-card__actions">
                                <UnderlineLink href={PROFILE.cvUrl} label="Download CV" download />
                                <UnderlineLink href="/contact" label="Get in touch" />
                            </div>
                        </article>
                    </div>
                    <div className="col-lg-6">
                        <article className="engage-card" data-reveal>
                            <h3 className="h4 mb-0">Freelance &amp; contract</h3>
                            <p className="neutral-500 mb-0">
                                Scoped backend or full stack work: APIs, payment integrations, dashboards, or moving an existing .NET or React codebase forward.
                            </p>
                            <ul className="engage-card__list">
                                <li>Hire through Upwork, or contract directly</li>
                                <li>Scope agreed up front, before any code</li>
                            </ul>
                            <div className="engage-card__actions">
                                <UnderlineLink href={PROFILE.upwork} label="Hire on Upwork" external />
                            </div>
                        </article>
                    </div>
                </div>

            </div>
        </section>
    );
}
