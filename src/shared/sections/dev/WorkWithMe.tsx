import { Link } from "react-router-dom";
import RevealText from "@/shared/effects/RevealText";
import { EXPERTISE, PROFILE } from "@/data/profile";
import Eyebrow from "./Eyebrow";
import StackTags from "./StackTags";
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
                        <h3 className="reveal-text mb-0">
                            <RevealText>Hire me full-time, or bring me in for a project</RevealText>
                        </h3>
                    </div>
                </div>

                <div className="row g-4">
                    <div className="col-lg-6">
                        <article className="engage-card">
                            <h3 className="mb-0">Full-time roles</h3>
                            <p className="neutral-500 mb-0">
                                Full stack or backend roles where reliability matters: fintech, telecom, and enterprise platforms.
                            </p>
                            <ul className="engage-card__list">
                                <li>Based in {PROFILE.location}, {PROFILE.timezone}</li>
                                <li>Open to Saudi Arabia, UAE, Qatar, and remote across Europe</li>
                                <li>Visa sponsorship needed for relocation</li>
                            </ul>
                            <div className="engage-card__actions">
                                <UnderlineLink href={PROFILE.cvUrl} label="Download CV" download />
                                <UnderlineLink href="/contact" label="Get in touch" />
                            </div>
                        </article>
                    </div>
                    <div className="col-lg-6">
                        <article className="engage-card">
                            <h3 className="mb-0">Freelance &amp; contract</h3>
                            <p className="neutral-500 mb-0">
                                Scoped backend or full stack work: APIs, payment integrations, dashboards, or moving an existing .NET or React codebase forward.
                            </p>
                            <ul className="engage-card__list">
                                <li>Hire through Upwork, or contract directly</li>
                                <li>Scope agreed up front, before any code</li>
                            </ul>
                            <div className="engage-card__actions">
                                <UnderlineLink href={PROFILE.upwork} label="Hire on Upwork" external />
                                <UnderlineLink href="/contact" label="Describe your project" />
                            </div>
                        </article>
                    </div>
                </div>

                <div className="row pt-120 pb-40">
                    <div className="col-lg-6">
                        <Eyebrow>what I can help with</Eyebrow>
                    </div>
                </div>
                <ul className="expertise-list">
                    {EXPERTISE.map((item) => (
                        <li key={item.key} className="expertise-row">
                            <h4 className="expertise-row__title">{item.title}</h4>
                            <p className="expertise-row__desc">{item.description}</p>
                            <StackTags tags={item.tags} label="Tools I use" />
                        </li>
                    ))}
                </ul>
            </div>
        </section>
    );
}
