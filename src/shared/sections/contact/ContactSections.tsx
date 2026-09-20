import { useState, type ChangeEvent, type FormEvent, type InputHTMLAttributes } from "react";
import { Link } from "react-router-dom";
import RevealText from "@/shared/effects/RevealText";
import { PROFILE } from "@/data/profile";

// Contact page - editorial hero + "letter" style enquiry form

/** Read from the profile so the address lives in exactly one place. */
const EMAIL = PROFILE.email;

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
    { label: "Open to", value: "Full-time roles & freelance projects" },
];

/** Inline "fill in the blank" input that grows with its content. */
function Blank({
    label,
    value,
    placeholder,
    error,
    ...rest
}: InputHTMLAttributes<HTMLInputElement> & { label: string; value: string; placeholder: string; error?: string }) {
    const chars = Math.max(placeholder.length, value.length) + 1;
    const errorId = error ? `${rest.name}-error` : undefined;
    return (
        <input
            className={`contact-letter__blank${error ? " is-invalid" : ""}`}
            aria-label={label}
            aria-invalid={error ? true : undefined}
            aria-describedby={errorId}
            value={value}
            placeholder={placeholder}
            style={{ width: `${chars * 0.62}em` }}
            {...rest}
        />
    );
}

/** Sits under the field it belongs to, in the site's bracket idiom. */
function FieldError({ id, children }: { id: string; children?: string }) {
    if (!children) return null;
    return (
        <span className="contact-letter__error" id={id} role="alert">
            {children}
        </span>
    );
}

export function ContactHero() {
    return (
        <section className="sec-1-about pt-150 overflow-hidden">
            <div className="container pb-70">
                <div className="row align-items-end g-4">
                    <div className="col-xxl-6 col-lg-7">
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
                                Open to full stack &amp; backend roles
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

/** Idle until it has actually sent, so the status line can only report what
 *  really happened. The previous version announced "your email app should be
 *  open" whether or not anything had opened. */
type SendState = { status: "idle" | "sending" | "sent" } | { status: "error"; message: string };

/** Mirrors the checks in api/contact.ts. Catching these here saves a round trip
 *  and points at the field that is wrong, which a server error string cannot. */
type FieldErrors = Partial<Record<"name" | "email" | "message", string>>;

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function validate(values: { name: string; email: string; message: string }): FieldErrors {
    const errors: FieldErrors = {};
    if (!values.name.trim()) errors.name = "Your name is missing.";
    if (!values.email.trim()) errors.email = "Your email is missing.";
    else if (!EMAIL_PATTERN.test(values.email.trim())) errors.email = "That email doesn't look right.";
    const message = values.message.trim();
    if (!message) errors.message = "The message is empty.";
    else if (message.length < 10) errors.message = `A bit more detail, please — ${10 - message.length} more character${10 - message.length === 1 ? "" : "s"}.`;
    return errors;
}

export function ContactForm() {
    const [form, setForm] = useState({ name: "", company: "", email: "", message: "" });
    const [topics, setTopics] = useState<string[]>([]);
    const [send, setSend] = useState<SendState>({ status: "idle" });
    const [errors, setErrors] = useState<FieldErrors>({});
    /** Errors appear on the first submit attempt, not while someone is still
     *  typing their name. After that they update live as fields are corrected. */
    const [showErrors, setShowErrors] = useState(false);
    /** Honeypot: hidden from people, and bots fill it in. */
    const [website, setWebsite] = useState("");

    const update = (key: keyof typeof form) => (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const next = { ...form, [key]: e.target.value };
        setForm(next);
        if (showErrors) setErrors(validate(next));
    };

    const toggleTopic = (topic: string) =>
        setTopics((ts) => (ts.includes(topic) ? ts.filter((t) => t !== topic) : [...ts, topic]));

    const sending = send.status === "sending";
    const hasErrors = showErrors && Object.keys(errors).length > 0;

    const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (sending) return;

        const found = validate(form);
        setErrors(found);
        setShowErrors(true);
        if (Object.keys(found).length) {
            // Send focus to the first problem so keyboard and screen reader
            // users are not left hunting for it.
            const firstInvalid = (["name", "email", "message"] as const).find((k) => found[k]);
            const el = e.currentTarget.querySelector<HTMLElement>(`[name="${firstInvalid}"]`);
            el?.focus();
            setSend({ status: "idle" });
            return;
        }

        setSend({ status: "sending" });

        try {
            const res = await fetch("/api/contact", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    name: form.name.trim(),
                    company: form.company.trim(),
                    email: form.email.trim(),
                    message: form.message.trim(),
                    topics,
                    website,
                }),
            });
            const data: { ok?: boolean; error?: string } = await res.json().catch(() => ({}));

            if (!res.ok || !data.ok) {
                setSend({ status: "error", message: data.error ?? "That didn't send. Try again, or email me directly." });
                return;
            }

            setSend({ status: "sent" });
            setForm({ name: "", company: "", email: "", message: "" });
            setTopics([]);
            setErrors({});
            setShowErrors(false);
        } catch {
            // Offline, or the request never landed. Say so, rather than leaving
            // the button sitting there looking busy.
            setSend({ status: "error", message: "Couldn't reach the server. Check your connection, or email me directly." });
        }
    };

    return (
        <section className="contact-letter-section pt-100 pb-120">
            <div className="container">
                <div className="row g-5">
                    <div className="col-xl-4 col-lg-5">
                        <h2 className="h3 mb-40">Direct lines</h2>
                        <ul className="contact-info" role="list" data-reveal-group>
                            {DETAILS.map((d, i) => (
                                <li key={d.label} className="contact-info__item border-bottom-100" data-reveal>
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
                    </div>

                    <div className="col-xl-7 col-lg-7 ms-lg-auto">
                        <h2 className="h3 mb-40">Write me a note</h2>

                        {send.status === "sent" ? (
                            /* The form is replaced rather than merely annotated. A cleared
                               form with a small grey caption reads as though the page
                               discarded the message, which is the opposite of reassuring. */
                            <div className="contact-sent" role="status">
                                <span className="contact-sent__mark" aria-hidden="true">
                                    <svg width="22" height="22" viewBox="0 0 22 22" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <path d="M4.5 11.5L9 16L17.5 6.5" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
                                    </svg>
                                </span>
                                <h3 className="contact-sent__title">Message sent.</h3>
                                <p className="contact-sent__text">
                                    It&apos;s in my inbox and I reply within 24 hours, usually sooner. If it&apos;s urgent,{" "}
                                    <a href={`mailto:${EMAIL}`} className="neutral-900 text-decoration-underline">
                                        email me directly
                                    </a>
                                    .
                                </p>
                                <button
                                    type="button"
                                    className="contact-sent__again"
                                    onClick={() => setSend({ status: "idle" })}
                                >
                                    Send another message
                                </button>
                            </div>
                        ) : (
                        <form className="contact-letter" onSubmit={handleSubmit} noValidate>
                            <p className="contact-letter__text">
                                Hi Anees, my name is{" "}
                                <Blank label="Your name" name="name" placeholder="your name" value={form.name} onChange={update("name")} error={errors.name} autoComplete="name" />
                                {" "}and I work at{" "}
                                <span className="text-nowrap">
                                    <Blank label="Company (optional)" name="company" placeholder="company, optional" value={form.company} onChange={update("company")} autoComplete="organization" />.
                                </span>{" "}
                                I&apos;m reaching out about
                            </p>
                            <FieldError id="name-error">{errors.name}</FieldError>

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
                                    <Blank label="Your email" name="email" type="email" inputMode="email" spellCheck={false} placeholder="you@company.com" value={form.email} onChange={update("email")} error={errors.email} autoComplete="email" />.
                                </span>{" "}
                                Here&apos;s what I have in mind:
                            </p>
                            <FieldError id="email-error">{errors.email}</FieldError>

                            <textarea
                                className={`contact-letter__message${errors.message ? " is-invalid" : ""}`}
                                name="message"
                                aria-label="Project details"
                                aria-invalid={errors.message ? true : undefined}
                                aria-describedby={errors.message ? "message-error" : undefined}
                                placeholder="What you’re building, where it’s stuck, and the timeline you’re working with…"
                                rows={3}
                                value={form.message}
                                onChange={update("message")}
                                onInput={(e) => {
                                    e.currentTarget.style.height = "auto";
                                    e.currentTarget.style.height = `${e.currentTarget.scrollHeight}px`;
                                }}
                            />
                            <FieldError id="message-error">{errors.message}</FieldError>

                            {/* Off-screen rather than display:none, which some bots skip.
                                tabIndex -1 and aria-hidden keep it away from people. */}
                            <input
                                type="text"
                                name="website"
                                tabIndex={-1}
                                autoComplete="off"
                                aria-hidden="true"
                                value={website}
                                onChange={(e) => setWebsite(e.target.value)}
                                style={{ position: "absolute", width: 1, height: 1, opacity: 0, pointerEvents: "none", left: "-9999px" }}
                            />

                            <div className="d-flex flex-wrap align-items-center justify-content-between gap-4 pt-40">
                                <div className="at-btn-group">
                                    <button type="submit" className="at-btn-circle" aria-hidden tabIndex={-1} disabled={sending}>
                                        {ARROW_CIRCLE_SVG}
                                    </button>
                                    <button type="submit" className="at-btn z-index-1" disabled={sending}>
                                        {sending ? "Sending…" : "Send message"}
                                    </button>
                                    <button type="submit" className="at-btn-circle" aria-hidden tabIndex={-1} disabled={sending}>
                                        {ARROW_CIRCLE_SVG}
                                    </button>
                                </div>
                                <span
                                    className={`fz-font-md${send.status === "error" || hasErrors ? " contact-letter__status--error" : " neutral-500"}`}
                                    aria-live="polite"
                                >
                                    {sending
                                        ? "[ Sending… ]"
                                        : send.status === "error"
                                          ? `[ ${send.message} ]`
                                          : hasErrors
                                            ? "[ Check the highlighted fields above ]"
                                            : "[ Goes straight to my inbox. I reply within 24 hours ]"}
                                </span>
                            </div>
                        </form>
                        )}
                        <p className="neutral-500 fz-font-md mt-30 mb-0">
                            Prefer to skip the form? <Link to="/portfolio" className="neutral-900 text-decoration-underline">View case studies</Link> first.
                        </p>
                    </div>
                </div>
            </div>
        </section>
    );
}
