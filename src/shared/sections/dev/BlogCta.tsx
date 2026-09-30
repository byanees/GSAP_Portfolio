import { Link } from "react-router-dom";
import { BLOG } from "@/data/pages/blog";
import Eyebrow from "./Eyebrow";
import { ARROW_SVG } from "./icons";

/** Blog-only closing section: follow along, suggest a topic, or jump to the work. */
export default function BlogCta() {
    return (
        <section className="blog-cta pt-40 pb-120">
            <div className="container">
                <div className="blog-cta__panel changeless">
                    <div className="row g-5 align-items-center">
                        <div className="col-lg-7">
                            <Eyebrow light>{BLOG.cta.eyebrow}</Eyebrow>
                            <h2 className="blog-cta__title text-white mb-0">{BLOG.cta.title}</h2>
                            <p className="blog-cta__lead mt-30 mb-0">{BLOG.cta.lead}</p>
                        </div>
                        <div className="col-lg-4 ms-auto">
                            <ul className="blog-cta__links" data-reveal-group>
                                {BLOG.cta.links.map((link) => (
                                    <li key={link.label} data-reveal>
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
