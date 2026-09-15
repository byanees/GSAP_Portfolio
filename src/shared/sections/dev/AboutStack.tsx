import RevealText from "@/shared/effects/RevealText";
import { SKILLS } from "@/data/profile";
import Eyebrow from "./Eyebrow";
import StackTags from "./StackTags";

export default function AboutStack() {
    return (
        <section className="about-stack pt-120 pb-100">
            <div className="container">
                <div className="row pb-60 align-items-lg-end g-4">
                    <div className="col-lg-4">
                        <Eyebrow>my stack</Eyebrow>
                        <h3 className="reveal-text mb-0">
                            <RevealText>Tech I work with</RevealText>
                        </h3>
                    </div>
                    <div className="col-xxl-5 col-lg-7 text-lg-end ms-auto">
                        <h6 className="fw-600 fz-font-lg mb-0">
                            .NET and ABP.io on the backend, Angular and React on the frontend, and Docker, Kubernetes, and AWS underneath.
                        </h6>
                    </div>
                </div>
                <div className="row g-4">
                    {SKILLS.map((group) => (
                        <div key={group.key} className="col-lg-3 col-md-6">
                            <div className="stack-group">
                                <span className="stack-group__key">{`"${group.key}"`}</span>
                                <h6 className="stack-group__title">{group.title}</h6>
                                <StackTags tags={group.items} />
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
