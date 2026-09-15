import { Link } from "react-router-dom";
import { useBlogPost } from "./BlogPostContext";

const CHEVRON_SVG = (
    <svg xmlns="http://www.w3.org/2000/svg" width="6" height="11" viewBox="0 0 6 11" fill="none">
        <path d="M0.666992 0.666672L5.33366 5.33334L0.666992 10" stroke="#585959" strokeWidth="1.33333" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
);

const UPWORK_SVG = (
    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="16" viewBox="0 0 18 16" fill="none" aria-hidden="true">
        <path
            fillRule="evenodd"
            clipRule="evenodd"
            d="M12.731 7.649c-.849 2.183-2.062 3.838-3.21 3.838-1.227 0-1.956-1.17-1.956-3.108 0-3.063 1.551-5.217 3.757-5.217 1.354 0 2.469.918 3.104 2.426l-1.695 2.061zm1.885-7.649C11.954 0 9.773 1.98 8.74 4.908 8.12 3.254 7.073 2.156 5.67 2.156c-.374 0-.76.066-1.155.197C5.263.93 5.91.344 6.83.163L6.495 0C3.204.386 1.075 3.254 1.075 7.38c0 2.829 1.383 4.647 3.604 4.647 1.66 0 3.026-1.065 3.887-3.02.425 1.93 1.555 3.02 3.109 3.02 1.82 0 3.327-1.386 4.325-3.964V16h2V0h-3.384z"
            fill="currentColor"
        />
    </svg>
);

const PREV_SVG = (
    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="13" viewBox="0 0 14 13" fill="none">
        <path d="M3.19036 5.64852H13.3333V7.31518H3.19036L7.66033 11.7851L6.48183 12.9636L0 6.48185L6.48183 0L7.66033 1.17851L3.19036 5.64852Z" fill="currentColor" />
    </svg>
);

const NEXT_SVG = (
    <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 22 22" fill="none">
        <path d="M12.5 6.5L17.2143 11L12.5 15.5" stroke="currentColor" strokeWidth="1.28571" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M16.9999 11H4.78564" stroke="currentColor" strokeWidth="1.28571" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
);

export default function Section1() {
    const { data: post, loading } = useBlogPost();

    if (loading || !post) {
        return <section className="sec-1-blog-details overflow-hidden pt-150 pb-100" />;
    }

    const formattedDate = new Date(post.published_at).toLocaleDateString("en-US", {
        month: "long", day: "numeric", year: "numeric",
    });

    return (
        <section className="sec-1-blog-details overflow-hidden pt-150 pb-100">
            <div className="container">
                <div className="row align-items-center">
                    <div className="col-lg-8 mx-auto">
                        <div className="nav-menu d-flex align-items-center gap-2 pb-2">
                            <Link to="/archive-4" className="nav-menu__item neutral-900">Blog</Link>
                            <span className="nav-menu__item-separator">{CHEVRON_SVG}</span>
                            <span className="nav-menu__item neutral-500">{post.category}</span>
                        </div>
                        <h2 className="fw-600 lh-1 mb-0">{post.title}</h2>
                        <div className="d-flex flex-column flex-md-row align-items-md-end gap-2 justify-content-between pt-30">
                            <div className="d-flex align-items-center gap-2">
                                {post.author_avatar && (
                                    <div className="size-56 rounded-circle overflow-hidden">
                                        <img className="img-cover" src={post.author_avatar} alt={post.author} width={56} height={56} loading="lazy" />
                                    </div>
                                )}
                                <div>
                                    <h6 className="mb-0">{post.author}</h6>
                                    <span className="nav-menu__item fz-font-sm neutral-500">{formattedDate}</span>
                                </div>
                            </div>
                            <div className="d-flex align-items-center gap-4">
                                <span className="nav-menu__item fz-font-label fw-600 neutral-500">CONNECT</span>
                                <ul className="at-social-list list-unstyled d-flex flex-wrap align-items-end gap-md-4 gap-3">
                                    <li>
                                        <a href="https://www.upwork.com/freelancers/~017655f3515038fc66" target="_blank" rel="noopener noreferrer" className="at-social__link d-flex align-items-center gap-2" aria-label="Upwork">
                                            {UPWORK_SVG}
                                        </a>
                                    </li>
                                </ul>
                            </div>
                        </div>
                    </div>

                    {/* Hero image */}
                    <div className="col-12 py-5 text-center">
                        <img
                            src={post.hero_image ?? post.cover_image}
                            className="img-fluid"
                            alt={post.title}
                            width={1720}
                            height={789}
                            style={{ width: "auto", height: "auto" }}
                            loading="lazy"
                        />
                    </div>

                    <div className="col-lg-8 mx-auto">
                        <div className="content">
                            {/* Body HTML */}
                            {post.body_html && (
                                <div dangerouslySetInnerHTML={{ __html: post.body_html }} />
                            )}

                            {/* Inline gallery */}
                            {post.gallery_images?.length > 0 && (
                                <div className="row mb-60 g-3">
                                    {post.gallery_images.map((img, i) => (
                                        <div key={i} className="col-md-6">
                                            <img src={img.url} className="img-fluid" alt={img.alt} width={600} height={400} loading="lazy" />
                                        </div>
                                    ))}
                                </div>
                            )}

                            {/* Tags */}
                            {post.tags?.length > 0 && (
                                <div className="border-top-100 py-5">
                                    <div className="d-flex flex-wrap align-items-center justify-content-center gap-2">
                                        {post.tags.map((tag) => (
                                            <Link key={tag} to="/archive-4" className="at-btn filter-btn btn-sm">{tag}</Link>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* Prev / Next navigation */}
                            <div className="row">
                                {post.prev_slug && (
                                    <div className="col-md-5 me-auto d-flex flex-column gap-2">
                                        <Link to={`/blog-details/${post.prev_slug}`} aria-label="Previous">
                                            {PREV_SVG}
                                            <span className="text-uppercase"> Prev</span>
                                        </Link>
                                        <h6 className="fw-600">
                                            <Link to={`/blog-details/${post.prev_slug}`}>{post.prev_title}</Link>
                                        </h6>
                                    </div>
                                )}
                                {post.next_slug && (
                                    <div className="col-md-5 ms-auto d-flex flex-column gap-2 text-end">
                                        <Link to={`/blog-details/${post.next_slug}`} aria-label="Next">
                                            <span className="text-uppercase">Next</span>
                                            {NEXT_SVG}
                                        </Link>
                                        <h6 className="fw-600">
                                            <Link to={`/blog-details/${post.next_slug}`}>{post.next_title}</Link>
                                        </h6>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
