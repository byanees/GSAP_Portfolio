import { useEffect, useRef, useState, type KeyboardEvent } from "react";
import { Link, useLocation } from "react-router-dom";
import { CASE_STUDIES } from "@/data/caseStudies";
import { PROFILE } from "@/data/profile";
import { PROJECTS } from "@/data/projects";
import CaseStudyCard from "./CaseStudyCard";
import StackTags from "./StackTags";
import { ARROW_SVG } from "./icons";

const TABS = [
    {
        key: "case-studies",
        label: "Case studies",
        hint: "Production systems, and how each one works",
        count: CASE_STUDIES.length,
    },
    {
        key: "projects",
        label: "Projects",
        hint: "Platforms, products, and client builds",
        count: PROJECTS.length,
    },
] as const;

type TabKey = (typeof TABS)[number]["key"];

/** `/portfolio#projects` opens on the projects tab; anything else on the case studies. */
const tabFromHash = (hash: string): TabKey => (hash === "#projects" ? "projects" : "case-studies");

export default function PortfolioIndex() {
    const { hash } = useLocation();
    // Always starts on case studies so the first client render matches the
    // prerendered HTML; the hash is applied once hydrated.
    const [tab, setTab] = useState<TabKey>("case-studies");
    // Panels only animate in after a switch, so the first paint is left to the
    // cards' own scroll reveal.
    const [switched, setSwitched] = useState(false);
    const tabRefs = useRef<(HTMLButtonElement | null)[]>([]);
    const mounted = useRef(false);

    useEffect(() => {
        const next = tabFromHash(hash);
        setTab(next);
        if (next !== "case-studies") setSwitched(true);
    }, [hash]);

    useEffect(() => {
        // Hidden cards were measured at zero height, so ScrollTrigger (the diagram
        // thumbnails, the footer reveal) needs fresh positions once a panel shows.
        if (!mounted.current) {
            mounted.current = true;
            return;
        }
        void import("gsap/ScrollTrigger").then(({ default: ScrollTrigger }) => ScrollTrigger.refresh());
    }, [tab]);

    const select = (key: TabKey) => {
        setTab(key);
        setSwitched(true);
        // Kept in the URL so the tab survives a reload and can be linked to, without
        // a router navigation (which would reset the scroll position).
        const url = key === "projects" ? "#projects" : window.location.pathname + window.location.search;
        window.history.replaceState(window.history.state, "", url);
    };

    // Arrow keys, Home and End move between tabs, per the WAI-ARIA tabs pattern.
    const onKeyDown = (e: KeyboardEvent<HTMLButtonElement>, i: number) => {
        const last = TABS.length - 1;
        const next =
            e.key === "ArrowRight" ? (i === last ? 0 : i + 1)
            : e.key === "ArrowLeft" ? (i === 0 ? last : i - 1)
            : e.key === "Home" ? 0
            : e.key === "End" ? last
            : null;
        if (next === null) return;
        e.preventDefault();
        select(TABS[next].key);
        tabRefs.current[next]?.focus();
    };

    return (
        <>
            <section className="pt-150">
                <div className="container">
                    <div className="row g-4 align-items-end pb-60">
                        <div className="col-xxl-8 col-lg-7">
                            <h1 className="fz-ds-1 fw-500 lh-1">What I&apos;ve Built</h1>
                            <p className="fz-font-lg neutral-900 mb-0">
                                A selection, not everything I have shipped. Case studies from fintech and
                                enterprise platforms, and other projects, each picked because the outcome
                                is measurable. Happy to walk through the rest.
                            </p>
                        </div>
                        <div className="col-xxl-3 col-lg-5 ms-lg-auto text-lg-end">
                            <p className="dev-count mb-3">
                                {CASE_STUDIES.length} selected case studies, {PROJECTS.length} projects
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

                    <div className="dev-tabs" role="tablist" aria-label="Work">
                        {TABS.map((t, i) => {
                            const active = tab === t.key;
                            return (
                                <button
                                    key={t.key}
                                    ref={(el) => {
                                        tabRefs.current[i] = el;
                                    }}
                                    type="button"
                                    role="tab"
                                    id={`work-tab-${t.key}`}
                                    aria-controls={`work-panel-${t.key}`}
                                    aria-selected={active}
                                    tabIndex={active ? 0 : -1}
                                    className={`dev-tab${active ? " is-active" : ""}`}
                                    onClick={() => select(t.key)}
                                    onKeyDown={(e) => onKeyDown(e, i)}
                                >
                                    <span className="dev-tab__label">
                                        {t.label}
                                        <span className="dev-tab__count">{String(t.count).padStart(2, "0")}</span>
                                    </span>
                                    <span className="dev-tab__hint">{t.hint}</span>
                                </button>
                            );
                        })}
                    </div>
                </div>
            </section>

            <section className="pt-50 pb-120">
                <div className="container">
                    <div
                        role="tabpanel"
                        id="work-panel-case-studies"
                        aria-labelledby="work-tab-case-studies"
                        className={`dev-tabpanel${switched ? " is-switched" : ""}`}
                        hidden={tab !== "case-studies"}
                    >
                        <h2 className="visually-hidden">Case studies</h2>
                        <div className="row g-4" data-reveal-group>
                            {CASE_STUDIES.map((cs) => (
                                <div key={cs.slug} className="col-lg-6" data-reveal>
                                    <CaseStudyCard cs={cs} />
                                </div>
                            ))}
                        </div>
                    </div>

                    <div
                        role="tabpanel"
                        id="work-panel-projects"
                        aria-labelledby="work-tab-projects"
                        className={`dev-tabpanel${switched ? " is-switched" : ""}`}
                        hidden={tab !== "projects"}
                    >
                        <h2 className="visually-hidden">Projects</h2>
                        <div className="row g-4" data-reveal-group>
                            {PROJECTS.map((p) => (
                                <div key={p.slug} className="col-lg-6" data-reveal>
                                    <article className="web-card h-100">
                                        <div className="web-card__bar">
                                            <span className="web-card__url">{p.domain ?? p.owner ?? "Client-owned build"}</span>
                                            <span className="code-card__where">{p.meta}</span>
                                        </div>
                                        <div className="web-card__body">
                                            <div className="web-card__top">
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
                                            ) : p.caseStudies?.length ? (
                                                <div className="web-card__related">
                                                    {p.caseStudies.map((slug) => {
                                                        const cs = CASE_STUDIES.find((c) => c.slug === slug);
                                                        return cs ? (
                                                            <Link key={slug} to={`/portfolio/${slug}`} className="web-card__visit">
                                                                Case study: {cs.title} {ARROW_SVG}
                                                            </Link>
                                                        ) : null;
                                                    })}
                                                </div>
                                            ) : p.owner ? null : (
                                                <span className="web-card__private">No public link, the client owns this one</span>
                                            )}
                                        </div>
                                    </article>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </section>
        </>
    );
}
