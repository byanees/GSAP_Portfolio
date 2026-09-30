import { Link } from "react-router-dom";
import { HOME } from "@/data/pages/home";

/**
 * The three numbers worth leading with, each linked to the case study that
 * backs it. Replaces the decorative terminal mock: a visitor gets verifiable
 * proof above the fold instead of a simulated screenshot.
 *
 * The figures and labels are HOME.hero.proof. They are revealed by the shared
 * [data-reveal] stagger, and deliberately not counted up: "700-800k" and
 * "4,000+" are a range and a floor, so a counter would display a smaller,
 * wrong number on every frame until it landed.
 */
export default function HeroProof() {
    return (
        <ul className="hero-proof" data-reveal-group>
            {HOME.hero.proof.map((item) => (
                <li key={item.slug} className="hero-proof__item" data-reveal>
                    <Link to={`/portfolio/${item.slug}`} className="hero-proof__link">
                        <span className="hero-proof__value">{item.figure}</span>
                        <span className="hero-proof__label">{item.label}</span>
                        <span className="hero-proof__cue" aria-hidden="true">
                            {HOME.hero.proofCue}
                        </span>
                    </Link>
                </li>
            ))}
        </ul>
    );
}
