import { Link, useLocation } from "react-router-dom";
import PageMeta from "@/seo/PageMeta";
import RevealText from "@/shared/effects/RevealText";
import Eyebrow from "@/shared/sections/dev/Eyebrow";
import { ARROW_CIRCLE_SVG, ARROW_SVG } from "@/shared/sections/dev/icons";
import { PROFILE } from "@/data/profile";

/** Every route this site actually serves, with a line on what is behind it.
 *  Mirrors MainMenu, plus the reason someone would pick each one. */
const DESTINATIONS = [
    { to: "/", label: "Home", desc: "The short version: what I build, and what it runs in production." },
    { to: "/about", label: "About", desc: "Experience, the stack I work in, and how I approach a system." },
    { to: "/portfolio", label: "Portfolio", desc: "Case studies: Request to Pay, the bulk notification scheduler, Redis multiplexing, and more." },
    { to: "/blog", label: "Blog", desc: "Notes on backend work, payments, and .NET, written while building." },
    { to: "/contact", label: "Contact", desc: "Email, LinkedIn, and what I'm currently open to." },
];

export default function NotFoundPage() {
    const { pathname } = useLocation();
    const reportHref = `mailto:${PROFILE.email}?subject=${encodeURIComponent("Broken link on your site")}&body=${encodeURIComponent(
        `I hit a 404 at: ${pathname}\n\nI got there from: `,
    )}`;

    return (
        <>
            <PageMeta
                title="Page not found — Muhammad Anees"
                description="That page doesn't exist. Here's everything that does."
                noindex
            />
            <section className="nf sec-1-404 overflow-hidden pt-150 pb-120">
                <div className="container">
                    <div className="row">
                        <div className="col-xxl-9 col-lg-10">
                            <Eyebrow>404 error</Eyebrow>
                            <h1 className="section-title reveal-text fw-600 fz-ds-1 lh-1 mb-30">
                                <RevealText>This page doesn&apos;t exist.</RevealText>
                            </h1>
                            <p className="nf__lead">
                                Either the link is broken or the page moved when I rebuilt the site. Nothing is lost, and
                                everything this site holds is one click below.
                            </p>
                            <p className="nf-request" aria-label={`The address ${pathname} returned a 404 response`}>
                                <span className="nf-request__method">GET</span>
                                <span className="nf-request__path">{pathname}</span>
                                <span className="nf-request__status">404</span>
                            </p>
                        </div>
                    </div>

                    <nav className="nf-links-wrap" aria-label="Pages on this site">
                        <p className="nf-links__label">Where you probably meant to go</p>
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
                                Back to home
                            </Link>
                            <Link className="at-btn-circle" to="/" aria-hidden tabIndex={-1}>
                                {ARROW_CIRCLE_SVG}
                            </Link>
                        </div>
                        <a href={reportHref} className="at-btn common-black border-bottom-900 bg-transparent rounded-0 p-0 pb-2">
                            <span>
                                <span className="text-1">Tell me what broke</span>
                                <span className="text-2">Tell me what broke</span>
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
