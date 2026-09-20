import { useEffect, useRef } from "react";

type TimelineInstance = { kill?: () => void };

/**
 * Footer "fixed bottom" reveal: the footer sits fixed behind the page and
 * scales up as the placeholder at the end of the content scrolls over it.
 *
 * This used to also create ScrollSmoother. That was removed: the smoother
 * animates every change of scroll position, which meant a route change could
 * not land at the top without a visible glide or judder. Scrolling is native
 * now, and ScrollTrigger below works against native scroll without it.
 */
export default function FooterRevealEffect() {
  const timelineRef = useRef<TimelineInstance | null>(null);
  const resizeObserverRef = useRef<ResizeObserver | null>(null);

  useEffect(() => {
    let mounted = true;
    let resizeHandler: (() => void) | null = null;

    const init = async () => {
      const gsap = (await import("gsap")).default;
      const ScrollTrigger = (await import("gsap/ScrollTrigger")).default;
      gsap.registerPlugin(ScrollTrigger);
      if (!mounted) return;

      const footerFixedBottom = document.querySelector(".footer-fixed-bottom") as HTMLElement | null;
      const footerPlaceholder = document.querySelector(".footer-placeholder") as HTMLElement | null;
      const footerInner = document.querySelector(".footer-fixed-bottom .at-footer-area") as HTMLElement | null;

      if (!footerFixedBottom || !footerPlaceholder || !footerInner) return;

      // The placeholder reserves exactly as much room as the fixed footer needs.
      const updatePlaceholderHeight = () => {
        if (!mounted) return;
        footerPlaceholder.style.height = `${footerFixedBottom.offsetHeight}px`;
        ScrollTrigger.refresh();
      };

      updatePlaceholderHeight();
      resizeHandler = updatePlaceholderHeight;
      window.addEventListener("resize", resizeHandler);
      resizeObserverRef.current = new ResizeObserver(updatePlaceholderHeight);
      resizeObserverRef.current.observe(footerFixedBottom);

      gsap.set(footerInner, { scale: 0.95 });
      timelineRef.current = gsap
        .timeline({
          scrollTrigger: {
            trigger: footerPlaceholder,
            start: "top bottom",
            end: "bottom bottom",
            scrub: 1,
            invalidateOnRefresh: true,
          },
        })
        .to(footerInner, { scale: 1, ease: "none" }, 0);
    };

    void init();

    return () => {
      mounted = false;
      if (resizeHandler) window.removeEventListener("resize", resizeHandler);
      resizeObserverRef.current?.disconnect();
      resizeObserverRef.current = null;
      timelineRef.current?.kill?.();
      timelineRef.current = null;
    };
  }, []);

  return null;
}
