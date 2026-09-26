import { useEffect, useState, type ComponentType } from "react";
import { createPortal } from "react-dom";
import { REEL_EVENT, type ReelRequest } from "./reelEvents";
import type { ReelPlayerProps } from "./ReelPlayer";

const SEEN_KEY = "reel:seen";

/**
 * The intro reel's controller. It stays tiny: the scenes, the timeline and the
 * synth live in ReelPlayer, which is only fetched when the reel is about to play.
 *
 * It plays by itself once per session, and only on a cold landing, while the
 * site loader is still covering the page. That way the reel takes over from the
 * loader's black frame instead of popping up over a page someone is reading.
 * A client-side visit to "/" never has a loader, so it never autoplays.
 */
function shouldAutoplay() {
  if (window.matchMedia?.("(prefers-reduced-motion: reduce)").matches) return false;
  if (navigator.webdriver) return false;
  if (window.location.hash) return false;
  const loader = document.getElementById("site-loader");
  if (!loader || loader.classList.contains("is-leaving")) return false;
  try {
    if (sessionStorage.getItem(SEEN_KEY)) return false;
    sessionStorage.setItem(SEEN_KEY, "1");
  } catch {
    return false;
  }
  return true;
}

type Run = { id: number; ctx: AudioContext | null };

export default function MotionReel() {
  const [run, setRun] = useState<Run | null>(null);
  const [Player, setPlayer] = useState<ComponentType<ReelPlayerProps> | null>(null);

  useEffect(() => {
    const start = (ctx: AudioContext | null) => {
      void import("./ReelPlayer").then((m) => {
        setPlayer(() => m.default);
        setRun({ id: Date.now(), ctx });
      });
    };
    const onPlay = (e: Event) => start((e as CustomEvent<ReelRequest>).detail?.ctx ?? null);

    window.addEventListener(REEL_EVENT, onPlay);
    if (shouldAutoplay()) start(null);
    return () => window.removeEventListener(REEL_EVENT, onPlay);
  }, []);

  if (!run || !Player) return null;
  return createPortal(<Player key={run.id} audioCtx={run.ctx} onDone={() => setRun(null)} />, document.body);
}
