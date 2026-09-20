import { useEffect } from "react";
import { useLocation } from "react-router-dom";

type Smoother = { scrollTop?: (y?: number) => number | void };

/**
 * Every navigation starts at the top of the page.
 *
 * ScrollSmoother owns the scroll position and lerps towards it, so a single
 * window.scrollTo is simply overwritten on the next frame. Fixed timers are no
 * better: while the incoming route mounts, the smoother is refreshed and any
 * one-shot call is lost, which left the page sitting where it was for most of a
 * second before snapping.
 *
 * So the reset is driven by a frame loop instead. It asserts the position every
 * frame from the first frame after navigation until the page is actually at the
 * top, with a deadline so it can never run away.
 *
 * Anchor links (/page#section) are left alone, and any real scroll input from
 * the visitor ends the loop immediately so they are never fought.
 */
const DEADLINE_MS = 1500;

// Resolved once and reused, so the first frame already has the smoother rather
// than waiting on a dynamic import.
let smootherModule: Promise<{ get?: () => Smoother | null }> | null = null;
function loadSmoother() {
    if (!smootherModule) {
        smootherModule = import("gsap/ScrollSmoother")
            .then((m) => m.default as unknown as { get?: () => Smoother | null })
            .catch(() => ({}));
    }
    return smootherModule;
}

export default function ScrollToTop() {
    const { pathname, hash } = useLocation();

    useEffect(() => {
        if ("scrollRestoration" in window.history) {
            window.history.scrollRestoration = "manual";
        }
        void loadSmoother();
    }, []);

    useEffect(() => {
        if (hash) return;

        let running = true;
        let frame = 0;
        const startedAt = performance.now();
        let smoother: Smoother | null = null;

        loadSmoother().then((SS) => {
            if (running) smoother = SS?.get?.() ?? null;
        });

        const stop = () => {
            running = false;
            if (frame) cancelAnimationFrame(frame);
            window.removeEventListener("wheel", stop);
            window.removeEventListener("touchstart", stop);
            window.removeEventListener("keydown", stop);
        };

        const step = () => {
            if (!running) return;
            window.scrollTo(0, 0);
            smoother?.scrollTop?.(0);

            const done = window.scrollY <= 1;
            if (done || performance.now() - startedAt > DEADLINE_MS) {
                stop();
                return;
            }
            frame = requestAnimationFrame(step);
        };

        // The visitor's own scrolling always wins over the reset.
        const opts = { passive: true, once: true } as const;
        window.addEventListener("wheel", stop, opts);
        window.addEventListener("touchstart", stop, opts);
        window.addEventListener("keydown", stop, opts);

        step();

        return stop;
    }, [pathname, hash]);

    return null;
}
