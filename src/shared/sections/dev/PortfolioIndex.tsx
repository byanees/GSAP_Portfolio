import { CASE_STUDIES } from "@/data/caseStudies";
import { PROFILE } from "@/data/profile";
import { PROJECTS } from "@/data/projects";
import CaseStudyCard from "./CaseStudyCard";
import Eyebrow from "./Eyebrow";
import StackTags from "./StackTags";
import { ARROW_SVG } from "./icons";

export default function PortfolioIndex() {
    return (
        <>
            <section className="pt-150 pb-80">
                <div className="container">
                    <div className="row g-4 align-items-end pb-60 border-bottom-100">
                        <div className="col-xxl-8 col-lg-7">
                            <h1 className="fz-ds-1 fw-500 lh-1">What I&apos;ve Built</h1>
                            <p className="fz-font-lg neutral-900 mb-0">
                                Case studies from fintech and enterprise platforms first, then earlier client projects picked for measurable impact.
                            </p>
                        </div>
                        <div className="col-xxl-3 col-lg-5 ms-lg-auto text-lg-end">
                            <p className="dev-count mb-3">
                                {CASE_STUDIES.length} case studies and {PROJECTS.length} earlier projects
                            </p>
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
            </section>

            <section className="pb-120">
                <div className="container">
                    <div className="row pb-40">
                        <div className="col-lg-6">
                            <Eyebrow>case studies</Eyebrow>
                            <h2 className="h3 mb-0">Production systems</h2>
                        </div>
                    </div>
                    <div className="row g-4">
                        {CASE_STUDIES.map((cs) => (
                            <div key={cs.slug} className="col-lg-6">
                                <CaseStudyCard cs={cs} />
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            <section className="pt-120 pb-120 bg-neutral-50">
                <div className="container">
                    <div className="row pb-50 g-4 align-items-end">
                        <div className="col-lg-6">
                            <Eyebrow>projects</Eyebrow>
                            <h2 className="h3 mb-0">Earlier client work</h2>
                        </div>
                        <div className="col-lg-5 ms-auto text-lg-end">
                            <p className="neutral-500 mb-0">
                                Products I built for clients before moving into fintech full time, most of them still live.
                            </p>
                        </div>
                    </div>
                    <div className="row g-4">
                        {PROJECTS.map((p) => (
                            <div key={p.slug} className="col-lg-6">
                                <article className="web-card h-100">
                                    <div className="web-card__bar">
                                        <span className="code-card__dots" aria-hidden>
                                            <i />
                                            <i />
                                            <i />
                                        </span>
                                        <span className="web-card__url">{p.domain ?? "Client-owned build"}</span>
                                    </div>
                                    <div className="web-card__body">
                                        <div className="web-card__top">
                                            <span className="code-card__meta">{p.meta}</span>
                                            <span className="web-card__role">{p.role}</span>
                                        </div>
                                        <h3 className="h4 web-card__title">{p.title}</h3>
                                        <p className="web-card__desc">{p.description}</p>
                                        <ul className="web-card__metrics">
                                            {p.results.map((r) => (
                                                <li key={r.label}>
                                                    <strong>{r.value}</strong>
                                                    <span>{r.label}</span>
                                                </li>
                                            ))}
                                        </ul>
                                        <StackTags tags={p.stack} />
                                        {p.href ? (
                                            <a href={p.href} target="_blank" rel="noopener noreferrer" className="web-card__visit">
                                                Visit {p.domain} {ARROW_SVG}
                                            </a>
                                        ) : (
                                            <span className="web-card__private">No public link, the client owns this one</span>
                                        )}
                                    </div>
                                </article>
                            </div>
                        ))}
                    </div>
                </div>
            </section>
        </>
    );
}
