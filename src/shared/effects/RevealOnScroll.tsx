import { useEffect } from "react";
import { useLocation } from "react-router-dom";

type Killable = { kill?: () => void };

/**
 * Reveals [data-reveal] elements as they scroll into view, staggering siblings
 * inside a [data-reveal-group] so a row of cards arrives in reading order.
 *
 * Driven by GSAP ScrollTrigger rather than IntersectionObserver: ScrollSmoother
 * transforms #smooth-content, which puts every element's viewport rect out of
 * step with what IntersectionObserver reports. ScrollTrigger is smoother-aware.
 *
 * Under prefers-reduced-motion nothing is hidden and no trigger is created.
 */
const STAGGER = 0.06;
const MAX_STAGGER_STEPS = 4;

export default function RevealOnScroll() {
    const { pathname } = useLocation();

    useEffect(() => {
        if (window.matchMedia?.("(prefers-reduced-motion: reduce)").matches) return;

        let mounted = true;
        const created: Killable[] = [];

        (async () => {
            const gsap = (await import("gsap")).default;
            const ScrollTrigger = (await import("gsap/ScrollTrigger")).default;
            gsap.registerPlugin(ScrollTrigger);
            if (!mounted) return;

            const targets = gsap.utils.toArray<HTMLElement>("[data-reveal]");
            if (!targets.length) return;

            for (const el of targets) {
                const group = el.closest<HTMLElement>("[data-reveal-group]");
                let step = 0;
                if (group) {
                    const siblings = Array.from(group.querySelectorAll<HTMLElement>("[data-reveal]"));
                    step = Math.min(Math.max(siblings.indexOf(el), 0), MAX_STAGGER_STEPS);
                }

                const tween = gsap.from(el, {
                    opacity: 0,
                    y: 20,
                    duration: 0.55,
                    ease: "power3.out",
                    delay: step * STAGGER,
                    // Starts just before the element is properly in view, so a fast
                    // scroller does not outrun it. Worst case is 0.55s + 0.24s stagger.
                    scrollTrigger: { trigger: el, start: "top 92%", once: true },
                });
                created.push(tween as Killable);
                const st = (tween as unknown as { scrollTrigger?: Killable }).scrollTrigger;
                if (st) created.push(st);
            }

            // Deliberately no ScrollTrigger.refresh() here: it restores the saved
            // scroll position, which fights ScrollToTop on every navigation. The
            // triggers above are created against the new route's DOM already.
        })();

        return () => {
            mounted = false;
            created.forEach((c) => c?.kill?.());
        };
    }, [pathname]);

    return null;
}
