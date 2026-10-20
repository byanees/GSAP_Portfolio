import Eyebrow from "./Eyebrow";

/** Title row shared by every version of the stack section. */
export default function StackHead({ eyebrow, title, intro }: { eyebrow: string; title: string; intro: string }) {
    return (
        <div className="row g-4 align-items-end stack-panel__head">
            <div className="col-lg-7">
                <Eyebrow light>{eyebrow}</Eyebrow>
                <h2 id="stack-title" className="h3 text-white mb-0">
                    {title}
                </h2>
            </div>
            <div className="col-lg-4 ms-auto text-lg-end">
                <p className="stack-panel__intro mb-0">{intro}</p>
            </div>
        </div>
    );
}
