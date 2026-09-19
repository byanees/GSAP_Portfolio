import { POSTS } from "@/data/posts";
import PostRow from "./PostRow";

export default function BlogIndex() {
    return (
        <section className="pt-150 pb-120">
            <div className="container">
                <div className="row g-4 align-items-end pb-60">
                    <div className="col-lg-8 pb-20">
                        <h1 className="fz-ds-1 lh-1 fw-500 mb-0">Notes from building systems</h1>
                    </div>
                    <div className="col-lg-7">
                        <p className="section-lead neutral-500 mb-0">Backend, payments, and scaling lessons from production work.</p>
                    </div>
                </div>
                <ul className="post-list" data-reveal-group>
                    {POSTS.map((post) => (
                        <PostRow key={post.slug} post={post} />
                    ))}
                </ul>
            </div>
        </section>
    );
}
