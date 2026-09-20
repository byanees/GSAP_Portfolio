import RevealText from "@/shared/effects/RevealText";
import { EXPERTISE } from "@/data/profile";
import StackTags from "./StackTags";

export default function HomeWhatIDo() {
    const [lead, ...rest] = EXPERTISE;

    return (
        <div className="bg-neutral-50">
            <section className="pt-100 pb-100">
                <div className="container">
                    <div className="row pb-60">
                        <div className="col-lg-8">
                            <h2 className="h3 reveal-text lh-1 mb-0">
                                <RevealText>Building scalable backends, modern frontends, and reliable fintech systems.</RevealText>
                            </h2>
                            <p className="section-lead neutral-500 mt-30 mb-0">
                                Clean, testable systems built to scale, from the API contract to the dashboard.
                            </p>
                        </div>
                    </div>

                    {/* Asymmetric split: the lead discipline gets a full panel, the rest read as a stacked list. */}
                    <div className="row g-3" data-reveal-group>
                        <div className="col-lg-5">
                            <article className="dev-card dev-card--lead h-100" data-reveal>
                                <h3 className="h5 dev-card__title">{lead.title}</h3>
                                <p className="dev-card__desc">{lead.description}</p>
                                <StackTags tags={lead.tags} label="Tools I use" />
                            </article>
                        </div>
                        <div className="col-lg-7">
                            <ul className="dev-stack-list">
                                {rest.map((item) => (
                                    <li key={item.key} className="dev-stack-list__item" data-reveal>
                                        <h3 className="h5 dev-card__title">{item.title}</h3>
                                        <p className="dev-card__desc">{item.description}</p>
                                        <StackTags tags={item.tags} label="Tools I use" />
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
}
