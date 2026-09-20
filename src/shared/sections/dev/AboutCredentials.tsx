import { CERTIFICATIONS, EDUCATION, LANGUAGES } from "@/data/profile";

/**
 * Education, certifications and languages.
 *
 * Replaces the old stats strip, which repeated the same three figures the home
 * hero already leads with. This is the information a recruiter looks for and
 * the site had nowhere at all.
 */
export default function AboutCredentials() {
    return (
        <section className="credentials pt-120 pb-120 border-top-100">
            <div className="container">
                <div className="row g-5">
                    <div className="col-lg-4">
                        <h2 className="h3 mb-20">Education &amp; credentials</h2>
                        <p className="section-lead neutral-500 mb-0">
                            Computer science degree, plus the security certifications that matter when you
                            work on payment systems.
                        </p>
                    </div>

                    <div className="col-lg-7 ms-lg-auto">
                        <div data-reveal-group>
                            <article className="credential" data-reveal>
                                <span className="credential__period">{EDUCATION.period}</span>
                                <h3 className="h4 credential__title">{EDUCATION.degree}</h3>
                                <p className="credential__where">{EDUCATION.school}</p>
                                <p className="credential__detail mb-0">
                                    <span className="credential__label">Coursework</span>
                                    {EDUCATION.coursework.join(", ")}
                                </p>
                            </article>

                            <article className="credential" data-reveal>
                                <h3 className="h4 credential__title">Certifications</h3>
                                <ul className="credential__list">
                                    {CERTIFICATIONS.map((c) => (
                                        <li key={c}>{c}</li>
                                    ))}
                                </ul>
                            </article>

                            <article className="credential" data-reveal>
                                <h3 className="h4 credential__title">Languages</h3>
                                <ul className="credential__list credential__list--inline">
                                    {LANGUAGES.map((l) => (
                                        <li key={l.name}>
                                            {l.name} <span className="credential__level">{l.level}</span>
                                        </li>
                                    ))}
                                </ul>
                            </article>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
