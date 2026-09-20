import { useEffect, useRef, useState } from "react";
import { Link, useLocation } from "react-router-dom";

/**
 * Persistent route to the contact page, so someone who finds something
 * interesting halfway down a case study does not have to go hunting for it.
 *
 * Sits directly above back-to-top, right-aligned with it. Collapsed to a round
 * icon so it covers as little of the page as possible, and it expands to show
 * the label on hover or keyboard focus. It also retreats while the visitor is
 * scrolling down and comes back the moment they stop or scroll up, so it never
 * sits on top of something being read.
 *
 * The icon is inline SVG to match every other icon in this project (the arrows,
 * the back-to-top chevron). Pulling in an icon package for one glyph would add
 * a dependency for roughly 200 bytes of path data.
 */
const IDLE_MS = 500;
const DOWN_THRESHOLD = 8;

export default function ContactDock() {
    const { pathname } = useLocation();
    const [hidden, setHidden] = useState(false);
    const lastY = useRef(0);
    const idleTimer = useRef(0);
    const frame = useRef(0);

    useEffect(() => {
        if (window.matchMedia?.("(prefers-reduced-motion: reduce)").matches) return;

        lastY.current = window.scrollY;

        const evaluate = () => {
            frame.current = 0;
            const y = window.scrollY;
            const delta = y - lastY.current;
            lastY.current = y;

            // Retreat only while moving down and clear of the top of the page.
            if (delta > DOWN_THRESHOLD && y > 240) setHidden(true);
            else if (delta < 0) setHidden(false);

            window.clearTimeout(idleTimer.current);
            idleTimer.current = window.setTimeout(() => setHidden(false), IDLE_MS);
        };

        const onScroll = () => {
            // rAF-throttled: the listener only ever schedules, it never measures.
            if (frame.current) return;
            frame.current = requestAnimationFrame(evaluate);
        };

        window.addEventListener("scroll", onScroll, { passive: true });
        return () => {
            window.removeEventListener("scroll", onScroll);
            window.clearTimeout(idleTimer.current);
            if (frame.current) cancelAnimationFrame(frame.current);
        };
    }, []);

    // A fresh page starts at the top, so the dock should always be showing.
    useEffect(() => setHidden(false), [pathname]);

    if (pathname === "/contact") return null;

    return (
        <Link
            to="/contact"
            className={`contact-dock${hidden ? " is-tucked" : ""}`}
            aria-label="Go to the contact page"
        >
            <span className="contact-dock__icon" aria-hidden="true">
                <svg width="19" height="19" viewBox="0 0 20 20" fill="none">
                    <path
                        d="M3 5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v6a2 2 0 0 1-2 2H8.5L5 16.4V13a2 2 0 0 1-2-2V5Z"
                        stroke="currentColor"
                        strokeWidth="1.6"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                    />
                </svg>
            </span>
            <span className="contact-dock__label">Let&apos;s talk</span>
        </Link>
    );
}
