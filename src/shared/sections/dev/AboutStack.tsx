import { useEffect, useState } from "react";
import { STACK_REVIEW } from "@/data/stackVersions";
import StackProblems from "./StackProblems";
import StackSentence from "./StackSentence";
import StackTrace from "./StackTrace";

const VERSIONS = {
    sentence: StackSentence,
    trace: StackTrace,
    problems: StackProblems,
};
type Version = keyof typeof VERSIONS;
const isVersion = (v: string | null): v is Version => v != null && v in VERSIONS;

/**
 * The About page stack section. Three versions are under review: the page
 * prerenders the sentence, and ?stack=trace or ?stack=problems swaps in another
 * after load, with a switcher between them.
 */
export default function AboutStack() {
    const [version, setVersion] = useState<Version>("sentence");
    const [reviewing, setReviewing] = useState(false);

    useEffect(() => {
        const asked = new URLSearchParams(window.location.search).get("stack");
        if (asked == null) return;
        setReviewing(true);
        if (isVersion(asked)) setVersion(asked);
    }, []);

    const pick = (v: Version) => {
        setVersion(v);
        const url = new URL(window.location.href);
        url.searchParams.set("stack", v);
        window.history.replaceState(window.history.state, "", url);
    };

    const Body = VERSIONS[version];

    return (
        <div className="container-2200 pt-30 pb-30">
            <section className={`stack-panel stack-panel--${version} rounded-5 mx-lg-3 mx-2 changeless`} aria-labelledby="stack-title">
                <div className="container">
                    {reviewing && (
                        <nav className="stack-review" aria-label={STACK_REVIEW.label}>
                            {STACK_REVIEW.versions.map((v) => (
                                <button
                                    key={v.key}
                                    type="button"
                                    aria-pressed={v.key === version}
                                    onClick={() => isVersion(v.key) && pick(v.key)}
                                >
                                    {v.label}
                                </button>
                            ))}
                        </nav>
                    )}
                    <Body key={version} />
                </div>
            </section>
        </div>
    );
}
