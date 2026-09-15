import { useState } from "react";
import { Link } from "react-router-dom";
import RevealText from "@/shared/effects/RevealText";

// About 1 Section 4 - Creative Contact Section

const ARROW_SVG = (
    <svg width="11" height="11" viewBox="0 0 11 11" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path
            d="M0.21967 9.40717C-0.0732232 9.70006 -0.0732232 10.1749 0.21967 10.4678C0.512563 10.7607 0.987437 10.7607 1.28033 10.4678L0.21967 9.40717ZM10.6875 0.75C10.6875 0.335786 10.3517 2.97145e-09 9.9375 1.50485e-07L3.1875 -2.70983e-07C2.77329 -2.70983e-07 2.4375 0.335786 2.4375 0.75C2.4375 1.16421 2.77329 1.5 3.1875 1.5H9.1875V7.5C9.1875 7.91421 9.52329 8.25 9.9375 8.25C10.3517 8.25 10.6875 7.91421 10.6875 7.5L10.6875 0.75ZM0.75 9.9375L1.28033 10.4678L10.4678 1.28033L9.9375 0.75L9.40717 0.21967L0.21967 9.40717L0.75 9.9375Z"
            fill="currentColor"
        />
    </svg>
);

const PROJECT_TYPES = [
    "Full Stack Development",
    "Backend / API Architecture",
    "Fintech / Payment Systems",
    "Frontend (Angular / React)",
    "Cloud & DevOps",
    "Other",
];

const QUICK_LINKS = [
    {
        icon: (
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="20" height="16" x="2" y="4" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/></svg>
        ),
        label: "aneese421@gmail.com",
        href: "mailto:aneese421@gmail.com",
        color: "#0066FF",
    },
    {
        icon: (
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/></svg>
        ),
        label: "+92 339 000 4208",
        href: "tel:+923390004208",
        color: "#00D4AA",
    },
    {
        icon: (
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"/><rect width="4" height="12" x="2" y="9"/><circle cx="4" cy="4" r="2"/></svg>
        ),
        label: "linkedin.com/in/ianees",
        href: "https://www.linkedin.com/in/ianees/",
        color: "#6366F1",
    },
    {
        icon: (
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/></svg>
        ),
        label: "Islamabad, Pakistan",
        href: "#",
        color: "#F59E0B",
    },
];

export default function Section4({ classList = "" }: { classList?: string }) {
    const [selectedType, setSelectedType] = useState<string | null>(null);

    return (
        <section className={`sec-4-about pt-120 pb-120 ${classList}`.trim()}>
            <div className="container">
                {/* Header */}
                <div className="row g-4 align-items-end mb-60">
                    <div className="col-lg-7">
                        <span className="at-btn common-black bg-transparent mb-10 rounded-0 p-0">
                            <span className="text-uppercase">
                                <span className="text-1">Let&apos;s Connect</span>
                                <span className="text-2">Let&apos;s Connect</span>
                            </span>
                            <i>
                                {ARROW_SVG}
                                {ARROW_SVG}
                            </i>
                        </span>
                        <h1 className="alt-section-title fz-ds-1 lh-1 fw-500 mb-0 reveal-text">
                            <RevealText>Have a project in mind?</RevealText>
                        </h1>
                    </div>
                    <div className="col-lg-5 text-lg-end">
                        <p className="fz-font-lg mb-0 neutral-500">
                            Whether it&apos;s a fintech platform, enterprise system, or a backend overhaul — I&apos;d love to hear about it.
                        </p>
                    </div>
                </div>

                <div className="row g-5">
                    {/* Left: Quick links + availability */}
                    <div className="col-lg-5">
                        {/* Quick Contact Cards */}
                        <div className="d-flex flex-column gap-3 mb-5">
                            {QUICK_LINKS.map((link, i) => (
                                <Link
                                    key={i}
                                    to={link.href}
                                    className="d-flex align-items-center gap-3 text-decoration-none"
                                    style={{
                                        padding: "16px 20px",
                                        borderRadius: 16,
                                        background: "var(--at-neutral-0, #fff)",
                                        border: "1px solid var(--at-neutral-100, #eee)",
                                        transition: "all 0.3s ease",
                                        color: "inherit",
                                    }}
                                    onMouseEnter={(e) => {
                                        e.currentTarget.style.transform = "translateX(8px)";
                                        e.currentTarget.style.borderColor = `${link.color}40`;
                                        e.currentTarget.style.boxShadow = `0 4px 20px ${link.color}15`;
                                    }}
                                    onMouseLeave={(e) => {
                                        e.currentTarget.style.transform = "translateX(0)";
                                        e.currentTarget.style.borderColor = "var(--at-neutral-100, #eee)";
                                        e.currentTarget.style.boxShadow = "none";
                                    }}
                                >
                                    <span
                                        style={{
                                            display: "inline-flex",
                                            alignItems: "center",
                                            justifyContent: "center",
                                            width: 44,
                                            height: 44,
                                            borderRadius: 12,
                                            background: `${link.color}12`,
                                            color: link.color,
                                            flexShrink: 0,
                                        }}
                                    >
                                        {link.icon}
                                    </span>
                                    <span className="fw-500" style={{ fontSize: 15 }}>{link.label}</span>
                                </Link>
                            ))}
                        </div>

                        {/* Availability Badge */}
                        <div
                            style={{
                                padding: "20px 24px",
                                borderRadius: 20,
                                background: "linear-gradient(135deg, rgba(0, 102, 255, 0.06) 0%, rgba(0, 212, 170, 0.06) 100%)",
                                border: "1px solid rgba(0, 102, 255, 0.12)",
                            }}
                        >
                            <div className="d-flex align-items-center gap-2 mb-2">
                                <span
                                    style={{
                                        width: 10,
                                        height: 10,
                                        borderRadius: "50%",
                                        background: "#00D4AA",
                                        display: "inline-block",
                                        animation: "pulse 2s infinite",
                                    }}
                                />
                                <span className="fw-600" style={{ fontSize: 14, color: "#00D4AA" }}>
                                    Open to Opportunities
                                </span>
                            </div>
                            <p className="mb-0 neutral-500" style={{ fontSize: 13, lineHeight: 1.5 }}>
                                Full stack &amp; backend roles in Saudi Arabia, UAE, Qatar, and remote in Europe. Visa sponsorship needed.
                            </p>
                        </div>
                    </div>

                    {/* Right: Creative Form */}
                    <div className="col-lg-7">
                        <form
                            className="h-100"
                            action="#"
                            method="post"
                            style={{
                                padding: "40px",
                                borderRadius: 24,
                                background: "var(--at-neutral-0, #fff)",
                                border: "1px solid var(--at-neutral-100, #eee)",
                            }}
                        >
                            {/* Step 1: What type of project */}
                            <p className="fw-600 mb-3" style={{ fontSize: 14, textTransform: "uppercase", letterSpacing: 1, color: "#0066FF" }}>
                                What do you need help with?
                            </p>
                            <div className="d-flex flex-wrap gap-2 mb-4">
                                {PROJECT_TYPES.map((type) => (
                                    <button
                                        key={type}
                                        type="button"
                                        onClick={() => setSelectedType(selectedType === type ? null : type)}
                                        style={{
                                            padding: "8px 18px",
                                            borderRadius: 50,
                                            fontSize: 13,
                                            fontWeight: 500,
                                            border: `1.5px solid ${selectedType === type ? "#0066FF" : "rgba(0,0,0,0.1)"}`,
                                            background: selectedType === type ? "rgba(0, 102, 255, 0.08)" : "transparent",
                                            color: selectedType === type ? "#0066FF" : "#666",
                                            cursor: "pointer",
                                            transition: "all 0.2s ease",
                                        }}
                                    >
                                        {type}
                                    </button>
                                ))}
                            </div>

                            {/* Form fields with floating style */}
                            <div className="row g-3 mb-3">
                                <div className="col-md-6">
                                    <div style={{ position: "relative" }}>
                                        <input
                                            type="text"
                                            name="name"
                                            required
                                            placeholder="Your name"
                                            aria-label="Your name"
                                            style={{
                                                width: "100%",
                                                padding: "14px 18px",
                                                borderRadius: 14,
                                                border: "1.5px solid rgba(0,0,0,0.08)",
                                                fontSize: 15,
                                                outline: "none",
                                                transition: "border-color 0.3s ease",
                                                background: "rgba(0,0,0,0.02)",
                                            }}
                                            onFocus={(e) => { e.currentTarget.style.borderColor = "#0066FF"; e.currentTarget.style.background = "#fff"; }}
                                            onBlur={(e) => { e.currentTarget.style.borderColor = "rgba(0,0,0,0.08)"; e.currentTarget.style.background = "rgba(0,0,0,0.02)"; }}
                                        />
                                    </div>
                                </div>
                                <div className="col-md-6">
                                    <input
                                        type="email"
                                        name="email"
                                        required
                                        placeholder="Your email"
                                        aria-label="Your email"
                                        style={{
                                            width: "100%",
                                            padding: "14px 18px",
                                            borderRadius: 14,
                                            border: "1.5px solid rgba(0,0,0,0.08)",
                                            fontSize: 15,
                                            outline: "none",
                                            transition: "border-color 0.3s ease",
                                            background: "rgba(0,0,0,0.02)",
                                        }}
                                        onFocus={(e) => { e.currentTarget.style.borderColor = "#0066FF"; e.currentTarget.style.background = "#fff"; }}
                                        onBlur={(e) => { e.currentTarget.style.borderColor = "rgba(0,0,0,0.08)"; e.currentTarget.style.background = "rgba(0,0,0,0.02)"; }}
                                    />
                                </div>
                            </div>
                            <div className="mb-3">
                                <input
                                    type="text"
                                    name="company"
                                    placeholder="Company / Organization (optional)"
                                    aria-label="Company"
                                    style={{
                                        width: "100%",
                                        padding: "14px 18px",
                                        borderRadius: 14,
                                        border: "1.5px solid rgba(0,0,0,0.08)",
                                        fontSize: 15,
                                        outline: "none",
                                        transition: "border-color 0.3s ease",
                                        background: "rgba(0,0,0,0.02)",
                                    }}
                                    onFocus={(e) => { e.currentTarget.style.borderColor = "#0066FF"; e.currentTarget.style.background = "#fff"; }}
                                    onBlur={(e) => { e.currentTarget.style.borderColor = "rgba(0,0,0,0.08)"; e.currentTarget.style.background = "rgba(0,0,0,0.02)"; }}
                                />
                            </div>
                            <div className="mb-4">
                                <textarea
                                    name="message"
                                    required
                                    placeholder="Tell me about your project — what are you building, what's the timeline, and how can I help?"
                                    rows={4}
                                    aria-label="Project details"
                                    style={{
                                        width: "100%",
                                        padding: "14px 18px",
                                        borderRadius: 14,
                                        border: "1.5px solid rgba(0,0,0,0.08)",
                                        fontSize: 15,
                                        outline: "none",
                                        resize: "vertical",
                                        fontFamily: "inherit",
                                        transition: "border-color 0.3s ease",
                                        background: "rgba(0,0,0,0.02)",
                                    }}
                                    onFocus={(e) => { e.currentTarget.style.borderColor = "#0066FF"; e.currentTarget.style.background = "#fff"; }}
                                    onBlur={(e) => { e.currentTarget.style.borderColor = "rgba(0,0,0,0.08)"; e.currentTarget.style.background = "rgba(0,0,0,0.02)"; }}
                                />
                            </div>

                            {/* Submit */}
                            <div className="d-flex flex-wrap align-items-center justify-content-between gap-3">
                                <button
                                    type="submit"
                                    className="at-btn"
                                    style={{
                                        padding: "14px 32px",
                                        borderRadius: 50,
                                        fontSize: 14,
                                        fontWeight: 600,
                                    }}
                                >
                                    <span>
                                        <span className="text-1">Send Message</span>
                                        <span className="text-2">Send Message</span>
                                    </span>
                                    <i>
                                        {ARROW_SVG}
                                        {ARROW_SVG}
                                    </i>
                                </button>
                                <span className="neutral-500" style={{ fontSize: 13 }}>
                                    Typically respond within 24 hours
                                </span>
                            </div>
                        </form>
                    </div>
                </div>
            </div>

            {/* Pulse animation keyframe */}
            <style>{`
                @keyframes pulse {
                    0%, 100% { opacity: 1; transform: scale(1); }
                    50% { opacity: 0.5; transform: scale(1.3); }
                }
            `}</style>
        </section>
    );
}
