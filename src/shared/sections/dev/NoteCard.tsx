import { Link } from "react-router-dom";
import { formatPostDate, postFigure, type Post } from "@/data/posts";
import PostFigure from "./PostFigure";
import { ARROW_SVG } from "./icons";

type Props = {
    post: Post;
    /** Full-width layout, figure and text side by side on wide screens. */
    wide?: boolean;
    /** Marks the newest note. */
    latest?: boolean;
    /** Heading level for the title, so the card fits the page outline it sits in. */
    level?: 2 | 3;
};

/**
 * A blog post as a card. Built on the case study card (code-card): same bar,
 * border, hover and link, with the post's own figure as its thumbnail.
 */
export default function NoteCard({ post, wide = false, latest = false, level = 2 }: Props) {
    const href = `/blog/${post.slug}`;
    const figure = postFigure(post);
    const Title = level === 2 ? "h2" : "h3";

    return (
        <article className={`code-card note-card h-100${wide ? " note-card--wide" : ""}`}>
            <div className="code-card__bar">
                <span className="code-card__domain">{post.category}</span>
                <span className="code-card__where">
                    <time dateTime={post.date}>{formatPostDate(post.date)}</time>
                </span>
            </div>
            <div className="note-card__inner">
                {figure && (
                    <Link to={href} tabIndex={-1} aria-hidden className="note-card__figure">
                        <PostFigure id={figure} thumb />
                    </Link>
                )}
                <div className="code-card__body">
                    {latest && <span className="code-card__meta">Latest note</span>}
                    <Title className="code-card__title note-card__title">
                        <Link to={href}>{post.title}</Link>
                    </Title>
                    <p className="code-card__summary">{post.excerpt}</p>
                    <div className="note-card__foot">
                        <span className="note-card__time">{post.readTime}</span>
                        <Link to={href} className="code-card__link" aria-label={`Read: ${post.title}`}>
                            Read note {ARROW_SVG}
                        </Link>
                    </div>
                </div>
            </div>
        </article>
    );
}
