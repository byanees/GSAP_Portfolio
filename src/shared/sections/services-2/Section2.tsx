import { useEffect, useState } from "react";
import Marquee from "react-fast-marquee";

// Services 2 Section 2 - Ticker (tech stack labels scroll)

const DOT_SVG = (
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
        <path
            d="M8 0C8.1206 4.36736 11.6326 7.8794 16 8C11.6326 8.1206 8.1206 11.6326 8 16C7.8794 11.6326 4.36736 8.1206 0 8C4.36736 7.8794 7.8794 4.36736 8 0Z"
            fill="#B7B7B7"
        />
    </svg>
);

const TICKER_ITEMS = [
    ".NET 9",
    "ABP.io",
    "Microservices",
    "Angular",
    "React",
    "TypeScript",
    "PostgreSQL",
    "Redis",
    "Docker",
    "Kubernetes",
    "AWS",
    "Clean Architecture",
    "Domain-Driven Design",
    "EMV QR",
];

export default function Section2() {
    // Motion that loops for more than five seconds needs a way to stop it, and
    // must not run at all for visitors who ask for reduced motion.
    const [reduced, setReduced] = useState(false);
    const [playing, setPlaying] = useState(true);

    useEffect(() => {
        const mq = window.matchMedia?.("(prefers-reduced-motion: reduce)");
        if (!mq) return;
        const sync = () => {
            setReduced(mq.matches);
            setPlaying(!mq.matches);
        };
        sync();
        mq.addEventListener("change", sync);
        return () => mq.removeEventListener("change", sync);
    }, []);

    const items = (
        <ul className="d-flex align-items-center justify-content-center gap-4 carouselTicker__list fix">
            {TICKER_ITEMS.map((label, i) => (
                <li key={`${label}-${i}`} className="d-flex align-items-center gap-4 carouselTicker__item mx-0">
                    <span className="ticker-item__label fz-font-md fw-600 text-nowrap">{label}</span>
                    {DOT_SVG}
                </li>
            ))}
        </ul>
    );

    return (
        <section className="sec-2-services pt-30 pb-30" aria-label="Technologies I work with">
            {reduced ? (
                <div className="ticker-static container">{items}</div>
            ) : (
                <div className="carouselTicker carouselTicker-left p-relative">
                    <Marquee speed={40} direction="left" play={playing} pauseOnHover gradient={false} className="carouselTicker__marquee">
                        {items}
                    </Marquee>
                    <button type="button" className="ticker-toggle" onClick={() => setPlaying((p) => !p)} aria-pressed={!playing}>
                        {playing ? "Pause" : "Play"}
                    </button>
                </div>
            )}
        </section>
    );
}
