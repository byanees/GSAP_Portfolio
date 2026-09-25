import { Link, useParams } from "react-router-dom";
import PageMeta from "@/seo/PageMeta";
import { TITLE_SUFFIX } from "@/seo/siteConfig";
import { breadcrumbSchema, caseStudySchema, graph } from "@/seo/schema";
import { CASE_STUDIES } from "@/data/caseStudies";
import { DIAGRAMS } from "@/data/diagrams";
import CaseStudyCard from "./CaseStudyCard";
import Eyebrow from "./Eyebrow";
import StackTags from "./StackTags";
import SystemDiagram from "./SystemDiagram";

export default function CaseStudyDetail() {
    const { slug } = useParams<{ slug: string }>();
    const index = CASE_STUDIES.findIndex((c) => c.slug === slug);
    const cs = CASE_STUDIES[index];

    if (!cs) {
        return (
            <section className="pt-150 pb-120">
                <PageMeta title={`Case study not found${TITLE_SUFFIX}`} noindex />
                <div className="container">
                    <h1 className="fz-ds-1 fw-500 lh-1">Case study not found</h1>
                    <Link to="/portfolio" className="cs-back mt-30">
                        ← Back to all work
                    </Link>
                </div>
            </section>
        );
    }

    const next = CASE_STUDIES[(index + 1) % CASE_STUDIES.length];
    const diagram = DIAGRAMS[cs.slug];
    const meta = [
        { label: "Company", value: cs.company },
        { label: "Role", value: cs.role },
        { label: "Period", value: cs.period },
        { label: cs.region ? "Region" : "Stack", value: cs.region ?? cs.stack.slice(0, 2).join(", ") },
    ];

    return (
        <>
            <PageMeta
                title={`${cs.title}${TITLE_SUFFIX}`}
                description={cs.summary}
                path={`/portfolio/${cs.slug}`}
                ogType="article"
                jsonLd={graph(
                    caseStudySchema(cs),
                    breadcrumbSchema([
                        { name: "Work", path: "/portfolio" },
                        { name: cs.title, path: `/portfolio/${cs.slug}` },
                    ]),
                )}
            />

            <section className="pt-150 pb-80">
                <div className="container">
                    <Link to="/portfolio" className="cs-back">
                        ← All work
                    </Link>
                    <div className="row">
                        <div className="col-xl-9">
                            <span className="code-card__meta d-block mb-20">
                                {cs.company}, {cs.period}
                            </span>
                            <h1 className="fz-ds-1 fw-500 lh-1 mb-30">{cs.title}</h1>
                            <p className="fz-font-3xl fw-400 neutral-500 mb-0">{cs.summary}</p>
                        </div>
                    </div>
                    <div className="cs-meta">
                        {meta.map((m) => (
                            <div key={m.label}>
                                <span className="cs-meta__label">{m.label}</span>
                                <p className="cs-meta__value">{m.value}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {cs.results.length > 0 && (
            <section className="pb-100">
                <div className="container">
                    <div className="cs-results" data-reveal-group>
                        {cs.results.map((r) => (
                            <div key={r.label} className="cs-result" data-reveal>
                                <span className="cs-result__value">{r.value}</span>
                                <span className="cs-result__label">{r.label}</span>
                            </div>
                        ))}
                    </div>
                </div>
            </section>
            )}

            {diagram && (
                <section className="pt-40 pb-60">
                    <div className="container">
                        <div className="cs-how__head">
                            <div>
                                <Eyebrow>how it works</Eyebrow>
                                <h2 className="cs-how__title">{diagram.title}</h2>
                            </div>
                            <p className="cs-how__hint">Pick a step to replay it</p>
                        </div>
                        <SystemDiagram diagram={diagram} />
                    </div>
                </section>
            )}

            <section className="pt-60 pb-120">
                <div className="container">
                    <div className="row g-5">
                        <div className="col-lg-4">
                            <h2 className="case-section__title">The problem</h2>
                            <p className="cs-problem mt-20 mb-0">{cs.problem}</p>
                        </div>
                        <div className="col-lg-7 ms-lg-auto">
                            <h2 className="case-section__title">What I built</h2>
                            <ol className="build-list mt-20">
                                {cs.built.map((item) => (
                                    <li key={item}>{item}</li>
                                ))}
                            </ol>
                            <div className="pt-50">
                                <StackTags tags={cs.stack} label="Stack" className="stack-line--lg" />
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {next && next.slug !== cs.slug && (
                <section className="pt-100 pb-100 bg-neutral-50">
                    <div className="container">
                        <div className="row g-4 align-items-center">
                            <div className="col-lg-5">
                                <h3 className="h3 mb-0">{next.title}</h3>
                            </div>
                            <div className="col-lg-6 ms-auto">
                                <CaseStudyCard cs={next} />
                            </div>
                        </div>
                    </div>
                </section>
            )}
        </>
    );
}
