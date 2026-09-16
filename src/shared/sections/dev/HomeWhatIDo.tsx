import RevealText from "@/shared/effects/RevealText";
import { EXPERTISE } from "@/data/profile";
import Eyebrow from "./Eyebrow";
import StackTags from "./StackTags";

export default function HomeWhatIDo() {
    return (
        <div className="bg-neutral-50">
            <section className="pt-100 pb-100">
                <div className="container">
                    <div className="row pb-60 g-4 align-items-end">
                        <div className="col-lg-2 col-md-3">
                            <Eyebrow>what I do</Eyebrow>
                        </div>
                        <div className="col-lg-6 col-md-9">
                            <h3 className="reveal-text lh-1 mb-0">
                                <RevealText>Building scalable backends, modern frontends, and reliable fintech systems.</RevealText>
                            </h3>
                        </div>
                        <div className="col-lg-3 ms-auto">
                            <p className="neutral-500 mb-0">
                                [ Clean, testable systems built to scale, from the API contract to the dashboard. ]
                            </p>
                        </div>
                    </div>

                    <div className="row g-3">
                        {EXPERTISE.map((item) => (
                            <div key={item.key} className="col-lg-3 col-md-6">
                                <article className="dev-card h-100">
                                    <h5 className="dev-card__title">{item.title}</h5>
                                    <p className="dev-card__desc">{item.description}</p>
                                    <StackTags tags={item.tags} label="Tools I use" />
                                </article>
                            </div>
                        ))}
                    </div>
                </div>
            </section>
        </div>
    );
}
