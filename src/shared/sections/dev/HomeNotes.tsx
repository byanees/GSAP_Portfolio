import { Link } from "react-router-dom";
import RevealText from "@/shared/effects/RevealText";
import { POSTS } from "@/data/posts";
import { HOME } from "@/data/pages/home";
import Eyebrow from "./Eyebrow";
import NoteCard from "./NoteCard";

export default function HomeNotes() {
    const latest = POSTS.slice(0, 3);

    return (
        <section className="pt-100 pb-100">
            <div className="container">
                <div className="row align-items-end g-4 pb-40">
                    <div className="col-lg-8">
                        <Eyebrow>{HOME.notes.eyebrow}</Eyebrow>
                        <h2 className="h3 reveal-text mb-0">
                            <RevealText>{HOME.notes.title}</RevealText>
                        </h2>
                    </div>
                    <div className="col-lg-4 text-lg-end">
                        <Link to="/blog" className="neutral-900 text-decoration-underline">
                            {HOME.notes.cta}
                        </Link>
                    </div>
                </div>
                <div className="row g-4" data-reveal-group>
                    {latest.map((post) => (
                        <div key={post.slug} className="col-lg-4 col-md-6" data-reveal>
                            <NoteCard post={post} level={3} />
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
