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
                            <Eyebrow>selected work</Eyebrow>
                            <h1 className="fz-ds-1 fw-500 lh-1">What I&apos;ve Built</h1>
                            <p className="fz-font-lg neutral-900 mb-0">
                                Case studies from fintech and enterprise platforms first, then earlier client projects picked for measurable impact.
                            </p>
                        </div>
                        <div className="col-xxl-3 col-lg-5 ms-lg-auto text-lg-end">
                            <p className="dev-count mb-3">
                                [ {CASE_STUDIES.length} case studies · {PROJECTS.length} projects ]
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
                            <h3 className="mb-0">Production systems</h3>
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
                            <h3 className="mb-0">Earlier client work</h3>
                        </div>
                        <div className="col-lg-5 ms-auto text-lg-end">
                            <p className="neutral-500 mb-0">[ Frontend and full stack products, 2023–2024 ]</p>
                        </div>
                    </div>
                    <ul className="project-list">
                        {PROJECTS.map((p) => (
                            <li key={p.slug} className="project-row">
                                <div>
                                    <span className="project-row__meta">{p.meta}</span>
                                    <h4 className="project-row__title">{p.title}</h4>
                                    <span className="project-row__type">{p.type}</span>
                                </div>
                                <div>
                                    <p className="project-row__desc">{p.description}</p>
                                    <StackTags tags={p.stack} />
                                </div>
                                <ul className="project-row__results">
                                    {p.results.map((r) => (
                                        <li key={r.label}>
                                            <strong>{r.value}</strong>
                                            <span>{r.label}</span>
                                        </li>
                                    ))}
                                </ul>
                                <div className="project-row__action">
                                    {p.link && (
                                        <a
                                            href={p.link.href}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="project-row__link"
                                            aria-label={`${p.title}: ${p.link.label}`}
                                            title={p.link.label}
                                        >
                                            {ARROW_SVG}
                                        </a>
                                    )}
                                </div>
                            </li>
                        ))}
                    </ul>
                </div>
            </section>
        </>
    );
}
