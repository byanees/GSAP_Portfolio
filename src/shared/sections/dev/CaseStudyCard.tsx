import { Link } from "react-router-dom";
import type { CaseStudy } from "@/data/caseStudies";
import StackTags from "./StackTags";
import { ARROW_SVG } from "./icons";

/** Text-first case study card, headed by the problem domain it belongs to. */
export default function CaseStudyCard({ cs }: { cs: CaseStudy }) {
    const href = `/portfolio/${cs.slug}`;
    const headline = cs.results[0];

    return (
        <article className="code-card h-100">
            <div className="code-card__bar">
                <span className="code-card__domain">{cs.domain}</span>
                <span className="code-card__where">
                    {cs.company}, {cs.period}
                </span>
            </div>
            <div className="code-card__body">
                <h3 className="h5 code-card__title">
                    <Link to={href}>{cs.title}</Link>
                </h3>
                <p className="code-card__summary">{cs.summary}</p>
                {headline && (
                    <div className="code-card__result">
                        <span className="code-card__result-value">{headline.value}</span>
                        <span className="code-card__result-label">{headline.label}</span>
                    </div>
                )}
                <StackTags tags={cs.stack.slice(0, 4)} />
                <Link to={href} className="code-card__link">
                    Read case study {ARROW_SVG}
                </Link>
            </div>
        </article>
    );
}
