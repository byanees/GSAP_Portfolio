import { useState, type ChangeEvent, type FormEvent, type InputHTMLAttributes } from "react";
import { Link } from "react-router-dom";
import RevealText from "@/shared/effects/RevealText";

// Contact page - editorial hero + "letter" style enquiry form

const EMAIL = "aneese421@gmail.com";

const ARROW_SVG = (
    <svg width="11" height="11" viewBox="0 0 11 11" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
        <path
            d="M0.21967 9.40717C-0.0732232 9.70006 -0.0732232 10.1749 0.21967 10.4678C0.512563 10.7607 0.987437 10.7607 1.28033 10.4678L0.21967 9.40717ZM10.6875 0.75C10.6875 0.335786 10.3517 2.97145e-09 9.9375 1.50485e-07L3.1875 -2.70983e-07C2.77329 -2.70983e-07 2.4375 0.335786 2.4375 0.75C2.4375 1.16421 2.77329 1.5 3.1875 1.5H9.1875V7.5C9.1875 7.91421 9.52329 8.25 9.9375 8.25C10.3517 8.25 10.6875 7.91421 10.6875 7.5L10.6875 0.75ZM0.75 9.9375L1.28033 10.4678L10.4678 1.28033L9.9375 0.75L9.40717 0.21967L0.21967 9.40717L0.75 9.9375Z"
            fill="currentColor"
        />
    </svg>
);

const ARROW_CIRCLE_SVG = (
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="15" viewBox="0 0 16 15" fill="none" aria-hidden="true">
        <path
            d="M0.0001297 8.99993L0 3.00407e-05L2 0L2.0001 6.99993L12.1719 7.00003L8.22224 3.05027L9.63644 1.63606L16.0003 8.00003L9.63644 14.364L8.22224 12.9497L12.1719 9.00003L0.0001297 8.99993Z"
            fill="currentColor"
        />
    </svg>
);

const TOPICS = [
    "Backend & APIs",
    "Fintech & Payments",
    "Full Stack Product",
    "Angular / React",
    "Cloud & DevOps",
    "A full-time role",
];

const DETAILS = [
    { label: "Email", value: EMAIL, href: `mailto:${EMAIL}` },
    { label: "Phone", value: "+92 339 000 4208", href: "tel:+923390004208" },
    { label: "LinkedIn", value: "in/ianees", href: "https://www.linkedin.com/in/ianees/" },
    { label: "Upwork", value: "Hire on Upwork", href: "https://www.upwork.com/freelancers/~017655f3515038fc66" },
    { label: "Based in", value: "Islamabad, Pakistan (PKT, UTC+5)" },
];

function EyebrowLabel({ children }: { children: string }) {
    return (
        <span className="at-btn common-black bg-transparent mb-10 rounded-0 p-0">
            <span className="text-uppercase">
                <span className="text-1">{children}</span>
                <span className="text-2">{children}</span>
            </span>
            <i>
                {ARROW_SVG}
                {ARROW_SVG}
            </i>
        </span>
    );
}

/** Inline "fill in the blank" input that grows with its content. */
function Blank({ label, value, placeholder, ...rest }: InputHTMLAttributes<HTMLInputElement> & { label: string; value: string; placeholder: string }) {
    const chars = Math.max(placeholder.length, value.length) + 1;
    return (
        <input
            className="contact-letter__blank"
            aria-label={label}
            value={value}
            placeholder={placeholder}
            style={{ width: `${chars * 0.62}em` }}
            {...rest}
        />
    );
}

export function ContactHero() {
    return (
        <section className="sec-1-about pt-150 overflow-hidden">
            <div className="container pb-70">
                <div className="row align-items-end g-4">
                    <div className="col-xxl-6 col-lg-7">
                        <EyebrowLabel>Let&apos;s build something</EyebrowLabel>
                        <h1 className="section-title fw-600 fz-ds-1 lh-1 reveal-text">
                            <RevealText>Contact</RevealText>
                        </h1>
                        <p className="mb-0 fz-font-lg fw-600 neutral-900">
                            Payment platform, enterprise system, or a backend that needs untangling. <br />
                            Tell me what you&apos;re building and I&apos;ll tell you how I can help.
                        </p>
                    </div>
                    <div className="col-lg-5 ms-auto">
                        <div className="d-flex flex-column align-items-start align-items-lg-end gap-3">
                            <span className="contact-status neutral-500">
                                <span className="contact-status__dot" aria-hidden />
                                [ Open to full stack &amp; backend roles ]
                            </span>
                            <a
                                href={`mailto:${EMAIL}`}
                                className="contact-email-link at-btn common-black border-bottom-900 bg-transparent rounded-0 p-0 pb-2"
                            >
                                <span>
                                    <span className="text-1">{EMAIL}</span>
                                    <span className="text-2">{EMAIL}</span>
                                </span>
                                <i>
                                    {ARROW_SVG}
                                    {ARROW_SVG}
                                </i>
                            </a>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}

export function ContactForm() {
    const [form, setForm] = useState({ name: "", company: "", email: "", message: "" });
    const [topics, setTopics] = useState<string[]>([]);
    const [opened, setOpened] = useState(false);

    const update = (key: keyof typeof form) => (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
        setForm((f) => ({ ...f, [key]: e.target.value }));

    const toggleTopic = (topic: string) =>
        setTopics((ts) => (ts.includes(topic) ? ts.filter((t) => t !== topic) : [...ts, topic]));

    const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const company = form.company.trim();
        const subject = `Project enquiry from ${form.name.trim()}${company ? ` (${company})` : ""}`;
        const body = [
            "Hi Muhammad,",
            "",
            `My name is ${form.name.trim()}${company ? ` and I work at ${company}` : ""}.`,
            topics.length ? `I'm reaching out about: ${topics.join(", ")}.` : null,
            "",
            form.message.trim(),
            "",
            `You can reach me at ${form.email.trim()}.`,
        ]
            .filter((line) => line !== null)
            .join("\n");
        window.location.href = `mailto:${EMAIL}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
        setOpened(true);
    };

    return (
        <section className="contact-letter-section pt-100 pb-120">
            <div className="container">
                <div className="row g-5">
                    <div className="col-xl-4 col-lg-5">
                        <EyebrowLabel>Get in touch</EyebrowLabel>
                        <h3 className="mb-40">Direct lines</h3>
                        <ul className="contact-info" role="list">
                            {DETAILS.map((d, i) => (
                                <li key={d.label} className="contact-info__item border-bottom-100">
                                    <span className="contact-info__index neutral-500">{String(i + 1).padStart(2, "0")}</span>
                                    <div>
                                        <span className="contact-info__label neutral-500 text-uppercase">{d.label}</span>
                                        {d.href ? (
                                            <a
                                                className="contact-info__value neutral-900"
                                                href={d.href}
                                                {...(d.href.startsWith("http") ? { target: "_blank", rel: "noopener noreferrer" } : {})}
                                            >
                                                {d.value}
                                                {ARROW_SVG}
                                            </a>
                                        ) : (
                                            <span className="contact-info__value neutral-900">{d.value}</span>
                                        )}
                                    </div>
                                </li>
                            ))}
                        </ul>
                        <p className="neutral-500 fz-font-md mt-30 mb-0">
                            [ Available for roles in Saudi Arabia, UAE, Qatar, and remote across Europe. Visa sponsorship needed. ]
                        </p>
                    </div>

                    <div className="col-xl-7 col-lg-7 ms-lg-auto">
                        <EyebrowLabel>Write me a note</EyebrowLabel>
                        <form className="contact-letter" onSubmit={handleSubmit}>
                            <p className="contact-letter__text">
                                Hi Muhammad, my name is{" "}
                                <Blank label="Your name" name="name" placeholder="your name" value={form.name} onChange={update("name")} required autoComplete="name" />
                                {" "}and I work at{" "}
                                <span className="text-nowrap">
                                    <Blank label="Company (optional)" name="company" placeholder="company, optional" value={form.company} onChange={update("company")} autoComplete="organization" />.
                                </span>{" "}
                                I&apos;m reaching out about
                            </p>

                            <div className="contact-letter__topics" role="group" aria-label="What is this about">
                                {TOPICS.map((topic) => {
                                    const active = topics.includes(topic);
                                    return (
                                        <button
                                            key={topic}
                                            type="button"
                                            className={`contact-letter__topic${active ? " is-active" : ""}`}
                                            aria-pressed={active}
                                            onClick={() => toggleTopic(topic)}
                                        >
                                            {topic}
                                        </button>
                                    );
                                })}
                            </div>

                            <p className="contact-letter__text">
                                You can reply to me at{" "}
                                <span className="text-nowrap">
                                    <Blank label="Your email" name="email" type="email" placeholder="you@company.com" value={form.email} onChange={update("email")} required autoComplete="email" />.
                                </span>{" "}
                                Here&apos;s what I have in mind:
                            </p>

                            <textarea
                                className="contact-letter__message"
                                name="message"
                                aria-label="Project details"
                                placeholder="What you're building, where it's stuck, and the timeline you're working with."
                                rows={3}
                                value={form.message}
                                onChange={update("message")}
                                onInput={(e) => {
                                    e.currentTarget.style.height = "auto";
                                    e.currentTarget.style.height = `${e.currentTarget.scrollHeight}px`;
                                }}
                                required
                            />

                            <div className="d-flex flex-wrap align-items-center justify-content-between gap-4 pt-40">
                                <div className="at-btn-group">
                                    <button type="submit" className="at-btn-circle" aria-hidden tabIndex={-1}>
                                        {ARROW_CIRCLE_SVG}
                                    </button>
                                    <button type="submit" className="at-btn z-index-1">
                                        Send message
                                    </button>
                                    <button type="submit" className="at-btn-circle" aria-hidden tabIndex={-1}>
                                        {ARROW_CIRCLE_SVG}
                                    </button>
                                </div>
                                <span className="neutral-500 fz-font-md" aria-live="polite">
                                    {opened
                                        ? "[ Your email app should be open. Hit send there. ]"
                                        : "[ Opens in your email app. I reply within 24 hours ]"}
                                </span>
                            </div>
                        </form>
                        <p className="neutral-500 fz-font-md mt-30 mb-0">
                            Prefer to skip the form? <Link to="/portfolio" className="neutral-900 text-decoration-underline">Browse my work</Link> first.
                        </p>
                    </div>
                </div>
            </div>
        </section>
    );
}
