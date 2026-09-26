// The reel is cut to a click track. Every cue in the timeline and every hit in
// the soundtrack is written in beats, so changing BPM retimes both together.

export const BPM = 128;
export const BEAT = 60 / BPM;

/** Beat position to seconds. */
export const at = (beats: number) => beats * BEAT;

/** Where the final frame starts clearing to reveal the page. */
export const EXIT_BEAT = 20;

/** Acts, for the timecode readout. Each starts on its beat. */
export const ACTS = [
  { from: 0, name: "Hook" },
  { from: 4, name: "Type" },
  { from: 10, name: "Shape" },
  { from: 12.5, name: "Camera" },
  { from: 17, name: "Frame" },
] as const;

export const TEAL = "#00d4aa";
export const INK = "#0f0f0f";
export const PAPER = "#fefefe";
