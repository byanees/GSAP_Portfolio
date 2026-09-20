import { useLayoutEffect } from "react";
import { useLocation } from "react-router-dom";

/**
 * Every navigation renders at the top of the page.
 *
 * useLayoutEffect, not useEffect: this runs after the new route's DOM is in
 * place but before the browser paints, so the page is simply drawn at the top.
 * Nothing scrolls, nothing animates, and the visitor never sees the previous
 * position. (An earlier version reset the scroll after paint, which produced a
 * visible forced scroll on every navigation.)
 *
 * Links to an anchor (/page#section) are left alone, since jumping to the top
 * would defeat the point of the anchor.
 */
export default function ScrollToTop() {
    const { pathname, hash } = useLocation();

    useLayoutEffect(() => {
        // Stop the browser restoring the old offset on back/forward: a page
        // should open at the top however the visitor arrived at it.
        if ("scrollRestoration" in window.history) {
            window.history.scrollRestoration = "manual";
        }
    }, []);

    useLayoutEffect(() => {
        if (hash) return;
        // behavior: "instant" overrides html { scroll-behavior: smooth }, which
        // otherwise animates this into the visible forced scroll it replaced.
        // In-page anchor links keep the smooth behaviour.
        window.scrollTo({ top: 0, left: 0, behavior: "instant" });
    }, [pathname, hash]);

    return null;
}
