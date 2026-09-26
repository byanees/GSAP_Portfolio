type Ctor = typeof AudioContext;

export function newAudioContext(): AudioContext | null {
  const AC: Ctor | undefined =
    window.AudioContext ?? (window as unknown as { webkitAudioContext?: Ctor }).webkitAudioContext;
  if (!AC) return null;
  const ctx = new AC();
  void ctx.resume();
  return ctx;
}

export const REEL_EVENT = "reel:play";

export type ReelRequest = { ctx: AudioContext | null };

/**
 * Asks the mounted MotionReel to play. Call it from a click handler when sound
 * is wanted: the AudioContext has to be created inside the gesture, or Safari
 * keeps it suspended.
 */
export function playReel({ sound }: { sound: boolean }) {
  const detail: ReelRequest = { ctx: sound ? newAudioContext() : null };
  window.dispatchEvent(new CustomEvent<ReelRequest>(REEL_EVENT, { detail }));
}
