import { NOW, PROFILE } from "@/data/profile";
import Eyebrow from "./Eyebrow";

export default function AboutNow() {
    return (
        <section className="about-now pt-120 pb-120 bg-neutral-50">
            <div className="container">
                <div className="row g-5">
                    <div className="col-lg-4">
                        <Eyebrow>/now</Eyebrow>
                        <h3 className="mb-20">What I&apos;m doing now</h3>
                        <p className="neutral-500 mb-0">[ Updated {PROFILE.nowUpdated} ]</p>
                    </div>
                    <div className="col-lg-8">
                        <ul className="now-list">
                            {NOW.map((item) => (
                                <li key={item.key} className="now-list__item">
                                    <span className="now-list__key">{item.key}</span>
                                    <p className="now-list__value">{item.value}</p>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>
            </div>
        </section>
    );
}
