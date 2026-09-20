import { useEffect } from "react";
import { useLocation } from "react-router-dom";

type Smoother = { scrollTo?: (y: number, smooth?: boolean) => void };

/**
 * Every navigation starts at the top of the page.
 *
 * Three things have to line up. The browser restores the previous offset on
 * back/forward, so that is switched to manual. ScrollSmoother owns the scroll
 * position, so window.scrollTo alone is simply overwritten on the next frame
 * and the smoother has to be told directly. And other route effects settle
 * after this one, so the reset is re-asserted briefly rather than fired once.
 *
 * Links to an anchor (/page#section) are left alone, since jumping to the top
 * would defeat the point of the anchor.
 */
const REASSERT_MS = [0, 60, 180, 320];

export default function ScrollToTop() {
    const { pathname, hash } = useLocation();

    useEffect(() => {
        if ("scrollRestoration" in window.history) {
            window.history.scrollRestoration = "manual";
        }
    }, []);

    useEffect(() => {
        if (hash) return;

        let cancelled = false;
        const timers: number[] = [];

        const toTop = (smoother?: Smoother | null) => {
            if (cancelled) return;
            window.scrollTo(0, 0);
            smoother?.scrollTo?.(0, false);
        };

        // If the visitor starts scrolling within the re-assert window, they win.
        // Without this, a quick flick on landing would be yanked back to the top.
        const release = () => {
            cancelled = true;
            timers.forEach(window.clearTimeout);
        };
        const opts = { passive: true, once: true } as const;
        window.addEventListener("wheel", release, opts);
        window.addEventListener("touchstart", release, opts);
        window.addEventListener("keydown", release, opts);

        toTop();

        import("gsap/ScrollSmoother")
            .then((mod) => {
                if (cancelled) return;
                const SS = mod.default as unknown as { get?: () => Smoother | null };
                // Re-assert over the next few frames: the new route's own effects
                // run after this one and can move the scroll position.
                for (const ms of REASSERT_MS) {
                    timers.push(window.setTimeout(() => toTop(SS?.get?.()), ms));
                }
            })
            .catch(() => {
                for (const ms of REASSERT_MS) timers.push(window.setTimeout(() => toTop(), ms));
            });

        return () => {
            cancelled = true;
            timers.forEach(window.clearTimeout);
            window.removeEventListener("wheel", release);
            window.removeEventListener("touchstart", release);
            window.removeEventListener("keydown", release);
        };
    }, [pathname, hash]);

    return null;
}
