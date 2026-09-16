import { Link, useParams } from "react-router-dom";
import PageMeta from "@/seo/PageMeta";
import { PROFILE } from "@/data/profile";
import { POSTS, formatPostDate } from "@/data/posts";
import Eyebrow from "./Eyebrow";
import PostRow from "./PostRow";
import StackTags from "./StackTags";

export default function BlogPost() {
    const { slug } = useParams<{ slug: string }>();
    const post = POSTS.find((p) => p.slug === slug);

    if (!post) {
        return (
            <section className="pt-150 pb-120">
                <PageMeta title="Muhammad Anees — Post not found" />
                <div className="container">
                    <h1 className="fz-ds-1 fw-500 lh-1">Post not found</h1>
                    <Link to="/blog" className="cs-back mt-30">
                        ← Back to the blog
                    </Link>
                </div>
            </section>
        );
    }

    const others = POSTS.filter((p) => p.slug !== post.slug);

    return (
        <>
            <PageMeta title={`${post.title} — Muhammad Anees`} />
            <article className="pt-150 pb-100">
                <div className="container">
                    <div className="row">
                        <div className="col-xl-8 col-lg-10 mx-auto">
                            <Link to="/blog" className="cs-back">
                                ← All posts
                            </Link>
                            <span className="code-card__meta d-block mb-20">
                                {post.category}, {formatPostDate(post.date)}
                            </span>
                            <h1 className="post-title">{post.title}</h1>
                            <p className="fz-font-lg neutral-500 mb-30">{post.excerpt}</p>
                            <StackTags tags={[...post.tags, post.readTime]} label="Filed under" />
                            <div className="post-body border-top-100 mt-50 pt-50" dangerouslySetInnerHTML={{ __html: post.bodyHtml }} />
                            <div className="post-author border-top-100 mt-60 pt-40">
                                <span className="site-logo__mark post-author__mark" aria-hidden>
                                    MA
                                </span>
                                <div>
                                    <span className="d-block fw-600 neutral-900">Written by {PROFILE.name}</span>
                                    <span className="neutral-500">
                                        {PROFILE.role} ·{" "}
                                        <a href={PROFILE.linkedin} target="_blank" rel="noopener noreferrer" className="neutral-900 text-decoration-underline">
                                            LinkedIn
                                        </a>
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </article>

            {others.length > 0 && (
                <section className="pt-100 pb-100 bg-neutral-50">
                    <div className="container">
                        <Eyebrow>keep reading</Eyebrow>
                        <ul className="post-list mt-30">
                            {others.map((p) => (
                                <PostRow key={p.slug} post={p} />
                            ))}
                        </ul>
                    </div>
                </section>
            )}
        </>
    );
}
