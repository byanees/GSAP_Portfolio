import { Link } from "react-router-dom";

/**
 * The three numbers worth leading with, each linked to the case study that
 * backs it. Replaces the decorative terminal mock: a visitor gets verifiable
 * proof above the fold instead of a simulated screenshot.
 *
 * The figures are rendered as-is and revealed by the shared [data-reveal]
 * stagger. They are deliberately not counted up: "700-800k" and "4,000+" are a
 * range and a floor, so a counter would display a smaller, wrong number on
 * every frame until it landed.
 */
const PROOF = [
    {
        figure: "700-800k",
        label: "push notifications dispatched per run, in 6-8 minutes",
        slug: "bulk-push-notification-scheduler",
    },
    {
        figure: "600k+",
        label: "concurrent sessions held without Redis pool exhaustion",
        slug: "telecom-agent-apps",
    },
    {
        figure: "4,000+",
        label: "merchants onboarded onto EMV QR Request to Pay",
        slug: "emv-qr-request-to-pay",
    },
];

export default function HeroProof() {
    return (
        <ul className="hero-proof" data-reveal-group>
            {PROOF.map((item) => (
                <li key={item.slug} className="hero-proof__item" data-reveal>
                    <Link to={`/portfolio/${item.slug}`} className="hero-proof__link">
                        <span className="hero-proof__value">{item.figure}</span>
                        <span className="hero-proof__label">{item.label}</span>
                        <span className="hero-proof__cue" aria-hidden="true">
                            Read the case study
                        </span>
                    </Link>
                </li>
            ))}
        </ul>
    );
}
