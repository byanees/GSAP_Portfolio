import StackSentence from "./StackSentence";

/** The About page stack section: the whole stack written as one sentence. */
export default function AboutStack() {
    return (
        <div className="container-2200 pt-30 pb-30">
            <section className="stack-panel rounded-5 mx-lg-3 mx-2 changeless" aria-labelledby="stack-title">
                <div className="container">
                    <StackSentence />
                </div>
            </section>
        </div>
    );
}
