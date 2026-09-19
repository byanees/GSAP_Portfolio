import { Link } from "react-router-dom";
import { PROFILE } from "@/data/profile";
import Eyebrow from "./Eyebrow";
import { ARROW_SVG } from "./icons";

const LINKS = [
    { label: "Follow on LinkedIn", href: PROFILE.linkedin, external: true },
    { label: "Suggest a topic", href: "/contact" },
    { label: "View case studies", href: "/portfolio" },
];

/** Blog-only closing section: follow along, suggest a topic, or jump to the work. */
export default function BlogCta() {
    return (
        <section className="blog-cta pt-40 pb-120">
            <div className="container">
                <div className="blog-cta__panel changeless">
                    <div className="row g-5 align-items-center">
                        <div className="col-lg-7">
                            <Eyebrow light>keep in touch</Eyebrow>
                            <h2 className="blog-cta__title text-white mb-0">New notes go up here first, then on LinkedIn.</h2>
                            <p className="blog-cta__lead mt-30 mb-0">
                                Short write-ups on problems I run into while building payment and backend systems. Follow along, or tell me what you'd like me to write about next.
                            </p>
                        </div>
                        <div className="col-lg-4 ms-auto">
                            <ul className="blog-cta__links">
                                {LINKS.map((link) => (
                                    <li key={link.label}>
                                        {link.external ? (
                                            <a href={link.href} target="_blank" rel="noopener noreferrer">
                                                <span>{link.label}</span>
                                                {ARROW_SVG}
                                            </a>
                                        ) : (
                                            <Link to={link.href}>
                                                <span>{link.label}</span>
                                                {ARROW_SVG}
                                            </Link>
                                        )}
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
