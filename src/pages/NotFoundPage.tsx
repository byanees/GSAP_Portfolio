import { Link, useLocation } from "react-router-dom";
import PageMeta from "@/seo/PageMeta";
import RevealText from "@/shared/effects/RevealText";
import Eyebrow from "@/shared/sections/dev/Eyebrow";
import { ARROW_CIRCLE_SVG, ARROW_SVG } from "@/shared/sections/dev/icons";
import { PAGES } from "@/data/navigation";
import { NOT_FOUND } from "@/data/pages/notFound";
import { PROFILE } from "@/data/profile";
import { TITLE_SUFFIX } from "@/seo/siteConfig";

/** Every page this site serves, with a line on why someone would pick it. */
const DESTINATIONS = PAGES.map((p) => ({ to: p.to, label: p.label, desc: NOT_FOUND.destinations[p.to] }));

export default function NotFoundPage() {
    const { pathname } = useLocation();
    const reportHref = `mailto:${PROFILE.email}?subject=${encodeURIComponent(NOT_FOUND.report.subject)}&body=${encodeURIComponent(
        NOT_FOUND.report.body(pathname),
    )}`;

    return (
        <>
            <PageMeta
                title={`${NOT_FOUND.title}${TITLE_SUFFIX}`}
                description={NOT_FOUND.description}
                noindex
            />
            <section className="nf sec-1-404 overflow-hidden pt-150 pb-120">
                <div className="container">
                    <div className="row">
                        <div className="col-xxl-9 col-lg-10">
                            <Eyebrow>{NOT_FOUND.eyebrow}</Eyebrow>
                            <h1 className="section-title reveal-text fw-600 fz-ds-1 lh-1 mb-30">
                                <RevealText>{NOT_FOUND.heading}</RevealText>
                            </h1>
                            <p className="nf__lead">{NOT_FOUND.lead}</p>
                            <p className="nf-request" aria-label={`The address ${pathname} returned a 404 response`}>
                                <span className="nf-request__method">GET</span>
                                <span className="nf-request__path">{pathname}</span>
                                <span className="nf-request__status">404</span>
                            </p>
                        </div>
                    </div>

                    <nav className="nf-links-wrap" aria-label="Pages on this site">
                        <p className="nf-links__label">{NOT_FOUND.linksLabel}</p>
                        <ul className="nf-links" data-reveal-group>
                            {DESTINATIONS.map((item) => (
                                <li className="nf-link" data-reveal key={item.to}>
                                    <Link className="nf-link__anchor" to={item.to}>
                                        <span className="nf-link__label">{item.label}</span>
                                        <span className="nf-link__desc">{item.desc}</span>
                                        <span className="nf-link__icon" aria-hidden="true">
                                            {ARROW_SVG}
                                        </span>
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </nav>

                    <div className="nf-actions d-flex flex-wrap align-items-center gap-4">
                        <div className="at-btn-group">
                            <Link className="at-btn-circle" to="/" aria-hidden tabIndex={-1}>
                                {ARROW_CIRCLE_SVG}
                            </Link>
                            <Link className="at-btn z-index-1" to="/">
                                {NOT_FOUND.home}
                            </Link>
                            <Link className="at-btn-circle" to="/" aria-hidden tabIndex={-1}>
                                {ARROW_CIRCLE_SVG}
                            </Link>
                        </div>
                        <a href={reportHref} className="at-btn common-black border-bottom-900 bg-transparent rounded-0 p-0 pb-2">
                            <span>
                                <span className="text-1">{NOT_FOUND.report.label}</span>
                                <span className="text-2">{NOT_FOUND.report.label}</span>
                            </span>
                            <i>
                                {ARROW_SVG}
                                {ARROW_SVG}
                            </i>
                        </a>
                    </div>
                </div>
            </section>
        </>
    );
}
