import { useEffect, useRef, useState, type CSSProperties } from "react";
import { EXPERIENCE, PROFILE } from "@/data/profile";

type Killable = { kill?: () => void };

const clock = new Intl.DateTimeFormat("en-GB", {
    hour: "2-digit",
    minute: "2-digit",
    timeZone: "Asia/Karachi",
});

/** Local time in Islamabad. The prerendered HTML carries the plain timezone,
 *  since a build-time clock would be wrong by the time anyone reads it; the
 *  live time takes over after hydration. */
function useLocalTime() {
    const [time, setTime] = useState<string | null>(null);
    useEffect(() => {
        const tick = () => setTime(clock.format(new Date()));
        tick();
        const id = window.setInterval(tick, 30_000);
        return () => window.clearInterval(id);
    }, []);
    return time;
}

/**
 * The About page portrait: the photo sits on the left third, captioned with the
 * two facts the rest of the page does not give, local time and current work.
 * Name and role are left out on purpose; the header and title already say them.
 *
 * Motion, all skipped under prefers-reduced-motion:
 * - on entry, the frame opens from the centre while the photo settles
 * - on scroll, the photo drifts slightly slower than its frame
 * - on hover (fine pointers only), B&W gives way to color and the grid
 *   brightens under the cursor
 */
export default function AboutPortrait({ src, colorSrc }: { src: string; colorSrc: string }) {
    const frameRef = useRef<HTMLElement>(null);
    const time = useLocalTime();
    const current = EXPERIENCE.find((e) => e.current) ?? EXPERIENCE[0];

    useEffect(() => {
        const frame = frameRef.current;
        if (!frame || window.matchMedia?.("(prefers-reduced-motion: reduce)").matches) return;

        let mounted = true;
        const created: Killable[] = [];

        (async () => {
            const gsap = (await import("gsap")).default;
            const ScrollTrigger = (await import("gsap/ScrollTrigger")).default;
            gsap.registerPlugin(ScrollTrigger);
            if (!mounted) return;

            const layer = frame.querySelector<HTMLElement>(".about-portrait__layer");
            const rows = frame.querySelectorAll<HTMLElement>(".about-portrait__row");
            const radius = getComputedStyle(frame).borderTopLeftRadius;

            const reveal = gsap.timeline({
                scrollTrigger: { trigger: frame, start: "top 85%", once: true },
                defaults: { ease: "power3.out" },
            });
            reveal
                .from(frame, { clipPath: `inset(10% 16% 10% 16% round ${radius})`, duration: 1.2, ease: "power4.inOut" })
                .from(layer, { scale: 1.2, duration: 1.4 }, 0)
                .from(rows, { opacity: 0, y: 12, duration: 0.6, stagger: 0.07 }, 0.55)
                // Leaves no inline clip-path behind, so the CSS radius owns the corners.
                .set(frame, { clearProps: "clipPath" });
            created.push(reveal as Killable);

            const drift = gsap.fromTo(
                layer,
                { yPercent: -3 },
                {
                    yPercent: 3,
                    ease: "none",
                    scrollTrigger: { trigger: frame, start: "top bottom", end: "bottom top", scrub: true },
                },
            );
            created.push(drift as Killable);

            for (const t of [reveal, drift]) {
                const st = (t as unknown as { scrollTrigger?: Killable }).scrollTrigger;
                if (st) created.push(st);
            }
        })();

        return () => {
            mounted = false;
            created.forEach((c) => c?.kill?.());
        };
    }, []);

    // The spotlight follows the cursor through two custom properties, updated
    // at most once a frame.
    useEffect(() => {
        const frame = frameRef.current;
        if (!frame || !window.matchMedia?.("(hover: hover) and (pointer: fine)").matches) return;

        let raf = 0;
        const onMove = (e: PointerEvent) => {
            cancelAnimationFrame(raf);
            raf = requestAnimationFrame(() => {
                const r = frame.getBoundingClientRect();
                frame.style.setProperty("--mx", `${e.clientX - r.left}px`);
                frame.style.setProperty("--my", `${e.clientY - r.top}px`);
            });
        };
        frame.addEventListener("pointermove", onMove);
        return () => {
            cancelAnimationFrame(raf);
            frame.removeEventListener("pointermove", onMove);
        };
    }, []);

    return (
        <figure ref={frameRef} className="about-portrait" style={{ "--portrait-color": `url(${colorSrc})` } as CSSProperties}>
            <div className="about-portrait__media">
                <div className="about-portrait__shift">
                    <div className="about-portrait__layer">
                        <img src={src} alt={`Portrait of ${PROFILE.name}`} width={2400} height={1050} />
                        {/* A background rather than an <img>, so it is only fetched
                            where the hover rule applies. */}
                        <div className="about-portrait__color" aria-hidden="true" />
                    </div>
                </div>
                <div className="about-portrait__grid" aria-hidden="true" />
                <div className="about-portrait__spot" aria-hidden="true" />
            </div>

            <dl className="about-portrait__spec">
                <div className="about-portrait__row">
                    <dt>Local time</dt>
                    <dd>
                        {PROFILE.location.split(",")[0]} · {time ? `${time} PKT (UTC+5)` : PROFILE.timezone}
                    </dd>
                </div>
                <div className="about-portrait__row">
                    <dt>Currently</dt>
                    <dd>
                        {current.company} · {current.stack.slice(0, 3).join(", ")}
                    </dd>
                </div>
            </dl>
        </figure>
    );
}
