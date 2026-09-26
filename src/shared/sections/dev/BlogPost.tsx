import { Link, useParams } from "react-router-dom";
import PageMeta from "@/seo/PageMeta";
import { TITLE_SUFFIX } from "@/seo/siteConfig";
import { blogPostingSchema, breadcrumbSchema, graph } from "@/seo/schema";
import { PROFILE } from "@/data/profile";
import { POSTS, formatPostDate, postBodyWithIds, postSections } from "@/data/posts";
import Eyebrow from "./Eyebrow";
import NoteCard from "./NoteCard";
import PostFigure from "./PostFigure";
import PostToc from "./PostToc";
import StackTags from "./StackTags";
import { ARROW_SVG } from "./icons";

export default function BlogPost() {
    const { slug } = useParams<{ slug: string }>();
    const post = POSTS.find((p) => p.slug === slug);

    if (!post) {
        return (
            <section className="pt-150 pb-120">
                <PageMeta title={`Post not found${TITLE_SUFFIX}`} noindex />
                <div className="container">
                    <h1 className="fz-ds-1 fw-500 lh-1">Post not found</h1>
                    <Link to="/blog" className="cs-back mt-30">
                        ← Back to the blog
                    </Link>
                </div>
            </section>
        );
    }

    // Two notes to read next: same topic first, then the newest of the rest.
    const others = POSTS.filter((p) => p.slug !== post.slug);
    const next = [
        ...others.filter((p) => p.category === post.category),
        ...others.filter((p) => p.category !== post.category),
    ].slice(0, 2);
    const sections = postSections(post);
    // The body is HTML with figure markers in it: odd entries are figure ids.
    const parts = postBodyWithIds(post).split(/<figure data-figure="([\w-]+)"><\/figure>/);

    return (
        <>
            <PageMeta
                title={`${post.title}${TITLE_SUFFIX}`}
                description={post.excerpt}
                path={`/blog/${post.slug}`}
                ogType="article"
                publishedTime={post.date}
                jsonLd={graph(
                    blogPostingSchema(post),
                    breadcrumbSchema([
                        { name: "Notes", path: "/blog" },
                        { name: post.title, path: `/blog/${post.slug}` },
                    ]),
                )}
            />
            <article className="pt-150 pb-100">
                <div className="container">
                    <div className="row">
                        <div className="col-lg-10 mx-auto mx-xl-0">
                            <Link to="/blog" className="cs-back">
                                ← All notes
                            </Link>
                            <p className="post-meta">
                                <span className="post-meta__topic">{post.category}</span>
                                <time dateTime={post.date}>{formatPostDate(post.date)}</time>
                                <span>{post.readTime}</span>
                            </p>
                            <h1 className="post-title">{post.title}</h1>
                            <p className="fz-font-lg neutral-500 mb-30">{post.excerpt}</p>
                            <StackTags tags={post.tags} label="Filed under" />
                        </div>
                    </div>

                    <div className="row border-top-100 mt-50 pt-50">
                        <aside className="col-xl-3 d-none d-xl-block">
                            <PostToc sections={sections} readTime={post.readTime} />
                        </aside>
                        <div className="col-xl-8 col-lg-10 mx-auto me-xl-0">
                            <div className="post-body">
                                {parts.map((part, i) =>
                                    i % 2 ? (
                                        <PostFigure key={i} id={part} number={(i + 1) / 2} />
                                    ) : (
                                        <div key={i} dangerouslySetInnerHTML={{ __html: part }} />
                                    ),
                                )}
                            </div>
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

            {next.length > 0 && (
                <section className="pt-100 pb-120 bg-neutral-50">
                    <div className="container">
                        <div className="row g-4 align-items-end pb-40">
                            <div className="col-lg-8">
                                <Eyebrow>keep reading</Eyebrow>
                                <h2 className="h3 mb-0">More notes</h2>
                            </div>
                            <div className="col-lg-4 text-lg-end">
                                <Link to="/blog" className="at-btn common-black border-bottom-900 bg-transparent rounded-0 p-0 pb-2">
                                    <span>
                                        <span className="text-1">All notes</span>
                                        <span className="text-2">All notes</span>
                                    </span>
                                    <i>
                                        {ARROW_SVG}
                                        {ARROW_SVG}
                                    </i>
                                </Link>
                            </div>
                        </div>
                        <div className="row g-4">
                            {next.map((p) => (
                                <div key={p.slug} className="col-lg-6">
                                    <NoteCard post={p} level={3} />
                                </div>
                            ))}
                        </div>
                    </div>
                </section>
            )}
        </>
    );
}
