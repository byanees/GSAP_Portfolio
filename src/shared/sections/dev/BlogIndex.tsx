import { useState } from "react";
import { POSTS } from "@/data/posts";
import { PROFILE } from "@/data/profile";
import NoteCard from "./NoteCard";
import { ARROW_SVG } from "./icons";

const ALL = "All";

/** Topics in the order they first appear, newest post first, each with its count. */
const TOPICS = [ALL, ...new Set(POSTS.map((p) => p.category))].map((topic) => ({
    topic,
    count: topic === ALL ? POSTS.length : POSTS.filter((p) => p.category === topic).length,
}));

export default function BlogIndex() {
    const [topic, setTopic] = useState(ALL);
    const [filtered, setFiltered] = useState(false);

    const posts = topic === ALL ? POSTS : POSTS.filter((p) => p.category === topic);
    // Unfiltered, the newest note leads full width. The rest sit two to a row,
    // and if that leaves one alone at the end it goes full width too, so the
    // grid never ends on an orphan.
    const lead = topic === ALL ? posts[0] : undefined;
    const grid = lead ? posts.slice(1) : posts;
    const lastWide = grid.length % 2 === 1;

    const choose = (next: string) => {
        setTopic(next);
        setFiltered(true);
    };

    return (
        <section className="pt-150 pb-120">
            <div className="container">
                <div className="row g-4 align-items-end pb-50">
                    <div className="col-xxl-8 col-lg-7">
                        <h1 className="fz-ds-1 fw-500 lh-1">Notes from building systems</h1>
                        <p className="fz-font-lg neutral-900 mb-0">
                            Backend, payments, and scaling lessons from production work, each with a figure that
                            shows the idea at a glance.
                        </p>
                    </div>
                    <div className="col-xxl-3 col-lg-5 ms-lg-auto text-lg-end">
                        <p className="dev-count mb-3">
                            {POSTS.length} notes, {TOPICS.length - 1} topics
                        </p>
                        <a
                            href={PROFILE.linkedin}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="at-btn common-black border-bottom-900 bg-transparent rounded-0 p-0 pb-2"
                        >
                            <span>
                                <span className="text-1">LinkedIn Updates</span>
                                <span className="text-2">LinkedIn Updates</span>
                            </span>
                            <i>
                                {ARROW_SVG}
                                {ARROW_SVG}
                            </i>
                        </a>
                    </div>
                </div>

                <div className="dev-filters" role="group" aria-label="Filter notes by topic">
                    {TOPICS.map(({ topic: t, count }) => {
                        const active = t === topic;
                        return (
                            <button
                                key={t}
                                type="button"
                                className={`dev-filter${active ? " is-active" : ""}`}
                                aria-pressed={active}
                                onClick={() => choose(t)}
                            >
                                {t}
                                <span className="dev-filter__count">{count}</span>
                            </button>
                        );
                    })}
                </div>

                <p className="visually-hidden" aria-live="polite">
                    {topic === ALL ? `Showing all ${posts.length} notes` : `Showing ${posts.length} ${topic} ${posts.length === 1 ? "note" : "notes"}`}
                </p>

                <div key={topic} className={`row g-4 note-grid${filtered ? " is-filtered" : ""}`} data-reveal-group>
                    {lead && (
                        <div className="col-12" data-reveal>
                            <NoteCard post={lead} wide latest />
                        </div>
                    )}
                    {grid.map((post, i) => {
                        const wide = lastWide && i === grid.length - 1;
                        return (
                            <div key={post.slug} className={wide ? "col-12" : "col-lg-6"} data-reveal>
                                <NoteCard post={post} wide={wide} />
                            </div>
                        );
                    })}
                </div>
            </div>
        </section>
    );
}
