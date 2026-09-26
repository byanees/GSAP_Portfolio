import { useEffect, useState, type MouseEvent } from "react";

type Section = { id: string; title: string };

/**
 * "On this page" rail for long posts: lists the post's sections and marks the
 * one being read. Sticky beside the body on wide screens only; on smaller
 * screens the post reads straight through.
 */
export default function PostToc({ sections, readTime }: { sections: Section[]; readTime: string }) {
    const [active, setActive] = useState(sections[0]?.id);

    useEffect(() => {
        const headings = sections
            .map((s) => document.getElementById(s.id))
            .filter((el): el is HTMLElement => el !== null);
        if (!headings.length) return;

        // A section counts as current once its heading passes the top third of
        // the viewport, and stays current until the next heading does.
        const update = () => {
            const line = window.innerHeight / 3;
            let current = headings[0].id;
            for (const h of headings) {
                if (h.getBoundingClientRect().top <= line) current = h.id;
            }
            setActive(current);
        };
        update();
        window.addEventListener("scroll", update, { passive: true });
        window.addEventListener("resize", update);
        return () => {
            window.removeEventListener("scroll", update);
            window.removeEventListener("resize", update);
        };
    }, [sections]);

    const go = (e: MouseEvent<HTMLAnchorElement>, id: string) => {
        const target = document.getElementById(id);
        if (!target) return;
        e.preventDefault();
        target.scrollIntoView({ behavior: "smooth", block: "start" });
        // Linkable, without adding a history entry per click.
        window.history.replaceState(window.history.state, "", `#${id}`);
        setActive(id);
    };

    if (sections.length < 2) return null;

    return (
        <nav className="post-toc" aria-label="On this page">
            <span className="code-card__meta d-block mb-20">On this page</span>
            <ol className="post-toc__list">
                {sections.map((s) => (
                    <li key={s.id}>
                        <a
                            href={`#${s.id}`}
                            className={`post-toc__link${s.id === active ? " is-active" : ""}`}
                            aria-current={s.id === active ? "location" : undefined}
                            onClick={(e) => go(e, s.id)}
                        >
                            {s.title}
                        </a>
                    </li>
                ))}
            </ol>
            <span className="post-toc__time">{readTime}</span>
        </nav>
    );
}
