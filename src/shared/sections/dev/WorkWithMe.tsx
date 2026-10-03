import { Link } from "react-router-dom";
import RevealText from "@/shared/effects/RevealText";
import { AVAILABILITY } from "@/data/availability";
import { CTA } from "@/data/navigation";
import { ABOUT } from "@/data/pages/about";
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
                        <Eyebrow>{ABOUT.workWithMe.eyebrow}</Eyebrow>
                        <h2 className="h3 reveal-text mb-0">
                            <RevealText>{ABOUT.workWithMe.title}</RevealText>
                        </h2>
                    </div>
                </div>

                <div className="row g-4" data-reveal-group>
                    {/* <div className="col-lg-6"> */}
                    <div className="col-12">
                        {/* <article className="engage-card" data-reveal> */}
                        <article className="engage-card engage-card--wide" data-reveal>
                            <h3 className="h4 mb-0">{AVAILABILITY.fullTime.title}</h3>
                            <p className="neutral-500 mb-0">{AVAILABILITY.fullTime.description}</p>
                            <ul className="engage-card__list">
                                {AVAILABILITY.fullTime.points.map((point) => (
                                    <li key={point}>{point}</li>
                                ))}
                            </ul>
                            <div className="engage-card__actions">
                                <UnderlineLink href={PROFILE.cvUrl} label={CTA.downloadCv} download />
                                <UnderlineLink href="/contact" label={CTA.getInTouch} />
                            </div>
                        </article>
                    </div>
                    {/* <div className="col-lg-6">
                        <article className="engage-card" data-reveal>
                            <h3 className="h4 mb-0">{AVAILABILITY.freelance.title}</h3>
                            <p className="neutral-500 mb-0">{AVAILABILITY.freelance.description}</p>
                            <ul className="engage-card__list">
                                {AVAILABILITY.freelance.points.map((point) => (
                                    <li key={point}>{point}</li>
                                ))}
                            </ul>
                            <div className="engage-card__actions">
                                <UnderlineLink href={PROFILE.upwork} label={CTA.hireOnUpwork} external />
                            </div>
                        </article>
                    </div> */}
                </div>

            </div>
        </section>
    );
}
