import { Link } from "react-router-dom";
import PortfolioCard3 from "@/shared/cards/PortfolioCard3";
import OdometerCounter from "@/shared/elements/OdometerCounter";
import PortfolioFilterSort, { type FilterValue } from "@/shared/sections/portfolio-1/PortfolioFilterSort";

const AVATARS = [
    "/assets/imgs/template/avatar/avatar-10.webp",
    "/assets/imgs/template/avatar/avatar-11.webp",
    "/assets/imgs/template/avatar/avatar-12.webp",
    "/assets/imgs/template/avatar/avatar-13.webp",
];

const ARROW_SVG = (
    <svg width="11" height="11" viewBox="0 0 11 11" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M0.21967 9.40717C-0.0732232 9.70006 -0.0732232 10.1749 0.21967 10.4678C0.512563 10.7607 0.987437 10.7607 1.28033 10.4678L0.21967 9.40717ZM10.6875 0.75C10.6875 0.335786 10.3517 2.97145e-09 9.9375 1.50485e-07L3.1875 -2.70983e-07C2.77329 -2.70983e-07 2.4375 0.335786 2.4375 0.75C2.4375 1.16421 2.77329 1.5 3.1875 1.5H9.1875V7.5C9.1875 7.91421 9.52329 8.25 9.9375 8.25C10.3517 8.25 10.6875 7.91421 10.6875 7.5L10.6875 0.75ZM0.75 9.9375L1.28033 10.4678L10.4678 1.28033L9.9375 0.75L9.40717 0.21967L0.21967 9.40717L0.75 9.9375Z" fill="currentColor" />
    </svg>
);

const PLUS_ICON = (
    <svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
        <path d="M6 1v10M1 6h10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
);

const FEATURED_PROJECT = {
    title: "EMV QR Payment System",
    slug: "emv-qr-payment",
    category: "fintech",
    card_image: "/assets/imgs/pages/img-43-lg.webp",
    featured_image: "/assets/imgs/pages/img-43-lg.webp",
    featured_description:
        "Designed and shipped a peer-to-peer QR payment system conforming to EMV QR Code standards with TLV encoding for static and dynamic QR generation — powering mobile payments for AXIAN Group's Mixx Tanzania platform.",
    metric_prefix: "",
    metric_value: "4000",
    metric_label: "Merchants Onboarded",
    featured_metric_2_value: "800",
    featured_metric_2_prefix: "",
    featured_metric_2_label: "K+ Notifications/Batch",
    featured_tags: ["Fintech", "EMV QR", ".NET Core", "Microservices"],
    tags: ["Fintech", "EMV QR", ".NET Core"],
};

const PROJECTS = [
    {
        title: "Request to Pay Platform",
        slug: "request-to-pay",
        category: "fintech" as FilterValue,
        card_image: "/assets/imgs/pages/img-74.webp",
        metric_prefix: "",
        metric_value: "4000",
        metric_label: "Active Merchants",
        tags: ["Fintech", "USSD", ".NET Core", "Angular"],
    },
    {
        title: "Enterprise Certificate Workflow",
        slug: "certificate-workflow",
        category: "enterprise" as FilterValue,
        card_image: "/assets/imgs/pages/img-75.webp",
        metric_prefix: "",
        metric_value: "98",
        metric_label: "Approval Accuracy",
        tags: [".NET 9", "ABP.io", "Angular", "HyperPay"],
    },
    {
        title: "Bulk Notification Scheduler",
        slug: "notification-scheduler",
        category: "fintech" as FilterValue,
        card_image: "/assets/imgs/pages/img-76.webp",
        metric_prefix: "",
        metric_value: "700",
        metric_label: "K+ Messages in Minutes",
        tags: [".NET Core", "Redis", "Docker", "Kubernetes"],
    },
    {
        title: "Dubai Real Estate Platform",
        slug: "real-estate-platform",
        category: "enterprise" as FilterValue,
        card_image: "/assets/imgs/pages/img-77.webp",
        metric_prefix: "",
        metric_value: "100",
        metric_label: "Listings Managed",
        tags: ["React", ".NET Core", "MongoDB"],
    },
    {
        title: "Backend Aggregation Layer",
        slug: "aggregation-layer",
        category: "enterprise" as FilterValue,
        card_image: "/assets/imgs/pages/img-78.webp",
        metric_prefix: "",
        metric_value: "5",
        metric_label: "Services Consolidated",
        tags: [".NET 9", "Redis", "RabbitMQ"],
    },
    {
        title: "Insurance Enrollment Platform",
        slug: "insurance-platform",
        category: "enterprise" as FilterValue,
        card_image: "/assets/imgs/pages/img-79.webp",
        metric_prefix: "",
        metric_value: "95",
        metric_label: "Enrollment Completion",
        tags: ["React", "Stripe", ".NET Core", "Node.js"],
    },
];

const portfolioItems = PROJECTS.map((item) => ({
    classList: "col-lg-6",
    category: item.category,
    link: "#",
    img: item.card_image,
    title: item.title,
    metricPrefix: item.metric_prefix,
    metricValue: item.metric_value,
    metricLabel: item.metric_label,
    tags: item.tags,
}));

export default function Section1() {
    return (
        <section className="sec-1-portfolio-3 overflow-hidden pt-150 pb-110 border-bottom-100">
            <div className="container pb-60">
                <div className="row g-4 align-items-end">
                    <div className="col-xxl-8 col-lg-7">
                        <h1 className="fz-ds-1 fw-500">What I&apos;ve Built</h1>
                        <p className="fz-font-lg neutral-900 mb-0">
                            A selection of projects shaped by clean architecture and meaningful engineering outcomes.
                        </p>
                    </div>
                    <div className="col-xxl-3 col-lg-5 ms-lg-auto">
                        <div className="sec-2-home-5__avatars-row d-flex justify-content-lg-end gap-2">
                            {AVATARS.map((src, i) => (
                                <div key={i} className="sec-2-home-5__avatar-sm at-offcanvas-gallery-img">
                                    <img className="img-cover" src={src} alt="" width={48} height={48} loading="lazy" />
                                </div>
                            ))}
                        </div>
                        <h6 className="fw-500 fz-font-lg text-lg-end mt-3 mb-0">
                            aneese421@gmail.com / +923390004208
                        </h6>
                    </div>
                    <div className="col-12">
                        <div className="border-bottom-100 pb-30" />
                    </div>
                </div>
            </div>

            <div className="container">
                <PortfolioFilterSort items={portfolioItems}>
                    {(visibleItems, { hasMore, onLoadMore }) => (
                        <div className="row align-items-center g-4">
                            {/* Featured card */}
                            <div className="col-12">
                                <div className="card_case__studies-list card_case__studies">
                                    <div className="card_case__studies-card">
                                        <div className="card_case__studies-left">
                                            <span className="card_case__studies-featured-tag">Featured case</span>
                                            <h4 className="card_case__studies-title">
                                                <Link to="#">
                                                    {FEATURED_PROJECT.title}
                                                </Link>
                                            </h4>
                                            <p className="card_case__studies-desc">{FEATURED_PROJECT.featured_description}</p>
                                            <div className="card_case__studies-metrics">
                                                <div className="card_case__studies-metric">
                                                    <h4 className="card_case__studies-metric-value mb-0">
                                                        <OdometerCounter count={Number(FEATURED_PROJECT.metric_value)} prefix={FEATURED_PROJECT.metric_prefix} suffix="+" />
                                                    </h4>
                                                    <span className="card_case__studies-metric-label">{FEATURED_PROJECT.metric_label}</span>
                                                </div>
                                                <div className="card_case__studies-metric-divider" />
                                                <div className="card_case__studies-metric">
                                                    <h4 className="card_case__studies-metric-value mb-0">
                                                        <OdometerCounter count={Number(FEATURED_PROJECT.featured_metric_2_value)} prefix={FEATURED_PROJECT.featured_metric_2_prefix} suffix="K+" />
                                                    </h4>
                                                    <span className="card_case__studies-metric-label">{FEATURED_PROJECT.featured_metric_2_label}</span>
                                                </div>
                                            </div>
                                            <div className="d-flex align-items-end justify-content-between mt-auto">
                                                <div className="card_case__studies-tags">
                                                    {FEATURED_PROJECT.featured_tags.map((tag) => (
                                                        <Link key={tag} to="#" className="card_case__studies-tag">{tag}</Link>
                                                    ))}
                                                </div>
                                                <Link to="#" className="card_case__studies-link text-white">
                                                    <span className="text-white text-nowrap">View case</span>
                                                    {PLUS_ICON}
                                                </Link>
                                            </div>
                                        </div>
                                        <div className="card_case__studies-right">
                                            <div className="card_case__studies-thumb anim-zoomin">
                                                <Link to="#">
                                                    <img src={FEATURED_PROJECT.featured_image} alt={FEATURED_PROJECT.title} width={800} height={500} className="img-cover" loading="lazy" />
                                                </Link>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Grid cards */}
                            {visibleItems.map((item, idx) => (
                                <PortfolioCard3
                                    key={`${item.title}-${idx}`}
                                    classList={item.classList}
                                    category={item.category}
                                    link={item.link}
                                    img={item.img}
                                    title={item.title}
                                    metricPrefix={item.metricPrefix}
                                    metricValue={item.metricValue}
                                    metricLabel={item.metricLabel}
                                    tags={item.tags}
                                />
                            ))}

                            {hasMore && (
                                <div className="col-12 text-center pt-40">
                                    <button type="button" className="at-btn" onClick={onLoadMore}>
                                        <span>
                                            <span className="text-1">LOAD MORE PROJECTS</span>
                                            <span className="text-2">LOAD MORE PROJECTS</span>
                                        </span>
                                        <i>{ARROW_SVG}{ARROW_SVG}</i>
                                    </button>
                                </div>
                            )}
                        </div>
                    )}
                </PortfolioFilterSort>
            </div>
        </section>
    );
}
