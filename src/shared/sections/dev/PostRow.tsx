import { Link } from "react-router-dom";
import { formatPostDate, type Post } from "@/data/posts";
import { ARROW_SVG } from "./icons";

export default function PostRow({ post }: { post: Post }) {
    const href = `/blog/${post.slug}`;
    return (
        <li className="post-row" data-reveal>
            <div className="post-row__meta">
                <span className="post-row__date">{formatPostDate(post.date)}</span>
                <span>
                    {post.category}, {post.readTime}
                </span>
            </div>
            <div>
                <h2 className="h4 post-row__title">
                    <Link to={href}>{post.title}</Link>
                </h2>
                <p className="post-row__excerpt">{post.excerpt}</p>
            </div>
            <Link to={href} className="project-row__link" aria-label={`Read: ${post.title}`}>
                {ARROW_SVG}
            </Link>
        </li>
    );
}
