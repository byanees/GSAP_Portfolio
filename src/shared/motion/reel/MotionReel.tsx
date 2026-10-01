import { useEffect, useState, type ComponentType } from "react";
import { createPortal } from "react-dom";
import { REEL_EVENT, type ReelRequest } from "./reelEvents";
import type { ReelPlayerProps } from "./ReelPlayer";

type Run = { id: number; ctx: AudioContext | null };

/**
 * The intro reel's controller. It stays tiny: the scenes, the timeline and the
 * synth live in ReelPlayer, which is only fetched when someone asks for the reel
 * (the hero's "Play intro" button dispatches REEL_EVENT).
 *
 * It never plays by itself. It used to autoplay once per session on a cold
 * landing, but that put a full-screen animation between every first-time
 * visitor and the page, and the page's load metrics measured the reel instead.
 */
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
    return () => window.removeEventListener(REEL_EVENT, onPlay);
  }, []);

  if (!run || !Player) return null;
  return createPortal(<Player key={run.id} audioCtx={run.ctx} onDone={() => setRun(null)} />, document.body);
}
