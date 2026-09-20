import { Link, useLocation } from "react-router-dom";

/**
 * Persistent route to the contact page, so someone who finds something
 * interesting halfway down a case study does not have to go hunting for it.
 *
 * Sits bottom-left. Back-to-top owns bottom-right, and the header owns the top,
 * so this is the one corner where a fixed control does not land on body copy.
 * Hidden on the contact page, where it would point at itself.
 */
export default function ContactDock() {
    const { pathname } = useLocation();
    if (pathname === "/contact") return null;

    return (
        <Link to="/contact" className="contact-dock">
            <span className="contact-dock__dot" aria-hidden="true" />
            <span className="contact-dock__label">Let&apos;s talk</span>
            <svg className="contact-dock__arrow" width="11" height="11" viewBox="0 0 11 11" fill="none" aria-hidden="true">
                <path
                    d="M0.21967 9.40717C-0.0732232 9.70006 -0.0732232 10.1749 0.21967 10.4678C0.512563 10.7607 0.987437 10.7607 1.28033 10.4678L0.21967 9.40717ZM10.6875 0.75C10.6875 0.335786 10.3517 2.97145e-09 9.9375 1.50485e-07L3.1875 -2.70983e-07C2.77329 -2.70983e-07 2.4375 0.335786 2.4375 0.75C2.4375 1.16421 2.77329 1.5 3.1875 1.5H9.1875V7.5C9.1875 7.91421 9.52329 8.25 9.9375 8.25C10.3517 8.25 10.6875 7.91421 10.6875 7.5L10.6875 0.75ZM0.75 9.9375L1.28033 10.4678L10.4678 1.28033L9.9375 0.75L9.40717 0.21967L0.21967 9.40717L0.75 9.9375Z"
                    fill="currentColor"
                />
            </svg>
        </Link>
    );
}
