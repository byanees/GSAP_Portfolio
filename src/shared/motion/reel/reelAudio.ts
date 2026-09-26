import { BEAT } from "./reelScore";

/**
 * The reel's soundtrack, synthesised on the spot with Web Audio: no audio files
 * to download, and every hit lands on the same beat grid the timeline uses.
 *
 * Browsers only let an AudioContext make sound after a user gesture, so the
 * context is created inside the click handler that asked for sound (see
 * newAudioContext) and handed in here, never created on page load.
 */

export type ReelAudio = {
  ctx: AudioContext;
  /** Schedules every hit from `fromSec` onwards, with timeline zero at audio time `zero`. */
  start: (zero: number, fromSec: number) => void;
  setMuted: (muted: boolean) => void;
  stop: () => void;
};

// A minor, then F, C, G: four chords, one per bar.
const HZ = { A1: 55, C2: 65.41, F1: 43.65, G1: 49 };
const CHORD = {
  Am: [220, 261.63, 329.63],
  F: [174.61, 220, 261.63],
  C: [261.63, 329.63, 392],
  G: [196, 246.94, 293.66],
};

export function createReelAudio(ctx: AudioContext): ReelAudio {
  const master = ctx.createGain();
  master.gain.value = 0.75;
  const comp = ctx.createDynamicsCompressor();
  comp.threshold.value = -16;
  comp.ratio.value = 4;
  master.connect(comp).connect(ctx.destination);

  const noise = ctx.createBuffer(1, ctx.sampleRate, ctx.sampleRate);
  const data = noise.getChannelData(0);
  for (let i = 0; i < data.length; i++) data[i] = Math.random() * 2 - 1;

  const sources: AudioScheduledSourceNode[] = [];

  const env = (at: number, peak: number, decay: number, attack = 0.002) => {
    const g = ctx.createGain();
    g.gain.setValueAtTime(0.0001, at);
    g.gain.linearRampToValueAtTime(peak, at + attack);
    g.gain.exponentialRampToValueAtTime(0.0001, at + attack + decay);
    g.connect(master);
    return g;
  };

  const osc = (type: OscillatorType, freq: number, at: number, end: number, out: AudioNode) => {
    const o = ctx.createOscillator();
    o.type = type;
    o.frequency.setValueAtTime(freq, at);
    o.connect(out);
    o.start(at);
    o.stop(end);
    sources.push(o);
    return o;
  };

  const noiseSrc = (at: number, end: number, out: AudioNode) => {
    const s = ctx.createBufferSource();
    s.buffer = noise;
    s.loop = true;
    s.connect(out);
    s.start(at);
    s.stop(end);
    sources.push(s);
  };

  const filter = (type: BiquadFilterType, freq: number, out: AudioNode, q = 1) => {
    const f = ctx.createBiquadFilter();
    f.type = type;
    f.frequency.value = freq;
    f.Q.value = q;
    f.connect(out);
    return f;
  };

  const kick = (at: number, level = 1) => {
    const o = osc("sine", 150, at, at + 0.4, env(at, level, 0.34));
    o.frequency.exponentialRampToValueAtTime(42, at + 0.12);
  };

  const hat = (at: number, level = 0.18) => {
    noiseSrc(at, at + 0.06, filter("highpass", 7500, env(at, level, 0.045)));
  };

  const clap = (at: number) => {
    const out = filter("bandpass", 1600, env(at, 0.5, 0.16), 0.9);
    noiseSrc(at, at + 0.2, out);
  };

  const stab = (at: number, freqs: number[]) => {
    const f = filter("lowpass", 2600, env(at, 0.1, 0.24));
    f.frequency.exponentialRampToValueAtTime(500, at + 0.22);
    for (const hz of freqs) osc("sawtooth", hz, at, at + 0.3, f);
  };

  const bass = (at: number, hz: number) => {
    osc("sawtooth", hz, at, at + BEAT * 0.5, filter("lowpass", 380, env(at, 0.32, BEAT * 0.42)));
  };

  const blip = (at: number, hz: number, level = 0.2) => {
    osc("sine", hz, at, at + 0.16, env(at, level, 0.12));
  };

  const bell = (at: number, hz: number) => {
    const out = env(at, 0.16, 1.4);
    osc("sine", hz, at, at + 1.5, out);
    osc("sine", hz * 2.76, at, at + 0.6, env(at, 0.05, 0.5));
  };

  /** Filtered-noise sweep: up for risers, down for whooshes. */
  const sweep = (at: number, dur: number, up = true, level = 0.32) => {
    const g = ctx.createGain();
    g.gain.setValueAtTime(0.0001, at);
    g.gain.linearRampToValueAtTime(level, at + dur * (up ? 0.92 : 0.25));
    g.gain.linearRampToValueAtTime(0.0001, at + dur);
    g.connect(master);
    const f = filter("bandpass", up ? 300 : 5000, g, 2.2);
    f.frequency.exponentialRampToValueAtTime(up ? 7000 : 250, at + dur);
    noiseSrc(at, at + dur + 0.02, f);
  };

  const impact = (at: number) => {
    kick(at, 1.1);
    const sub = osc("sine", 62, at, at + 1.3, env(at, 0.7, 1.2));
    sub.frequency.exponentialRampToValueAtTime(30, at + 0.9);
    noiseSrc(at, at + 1, filter("lowpass", 3200, env(at, 0.28, 0.9)));
  };

  const pad = (at: number, dur: number, freqs: number[]) => {
    const g = ctx.createGain();
    g.gain.setValueAtTime(0.0001, at);
    g.gain.linearRampToValueAtTime(0.07, at + 0.35);
    g.gain.linearRampToValueAtTime(0.0001, at + dur);
    g.connect(master);
    const f = filter("lowpass", 1400, g);
    for (const hz of freqs) {
      for (const cents of [-8, 8]) {
        osc("sawtooth", hz, at, at + dur + 0.05, f).detune.value = cents;
      }
    }
  };

  // [beat, hit]. Kept next to each other so the score reads like the storyboard.
  const score: [number, (t: number) => void][] = [];
  const on = (beat: number, fn: (t: number) => void) => score.push([beat, fn]);
  const range = (from: number, to: number, step: number) => {
    const out: number[] = [];
    for (let b = from; b < to - 1e-6; b += step) out.push(b);
    return out;
  };

  // Hook: the dot, the slice, the split, the strobe, the dive through the zero.
  on(0, (t) => blip(t, 1760, 0.25));
  on(0.5, (t) => sweep(t, BEAT * 0.5, true, 0.2));
  on(1, impact);
  on(2, (t) => stab(t, CHORD.Am));
  on(2.5, (t) => stab(t, CHORD.F));
  on(3, (t) => stab(t, CHORD.C));
  for (const b of [2, 2.5, 3]) on(b, (t) => hat(t));
  on(3.25, (t) => sweep(t, BEAT * 0.75, true, 0.4));

  // Type: four on the floor, offbeat bass, a stab on every cut.
  for (const b of range(4, 9, 1)) on(b, (t) => kick(t));
  for (const b of range(4.5, 10, 1)) on(b, (t) => hat(t));
  for (const b of [5, 7]) on(b, clap);
  for (const b of range(4.5, 8, 1)) on(b, (t) => bass(t, HZ.A1));
  for (const b of [8.5, 9.5]) on(b, (t) => bass(t, HZ.F1));
  on(4, (t) => stab(t, CHORD.Am));
  on(5, (t) => stab(t, CHORD.F));
  on(5.5, (t) => stab(t, CHORD.F));
  on(6, (t) => stab(t, CHORD.C));
  on(7, (t) => stab(t, CHORD.G));
  on(7.5, (t) => stab(t, CHORD.G));
  on(8, (t) => stab(t, CHORD.Am));
  on(9, impact);

  // Shape: sixteenth hats and an arpeggio for the tiles, then a riser.
  for (const b of [10, 11]) on(b, (t) => kick(t));
  on(11, clap);
  for (const b of range(10, 12, 0.25)) on(b, (t) => hat(t, 0.12));
  const arp = [880, 1318.5, 1046.5, 1760];
  range(10.25, 11.5, 0.25).forEach((b, i) => on(b, (t) => blip(t, arp[i % arp.length], 0.12)));
  on(11.5, (t) => sweep(t, BEAT, true, 0.36));

  // Camera: a breath on 12, the drop on 12.5, whooshes on every move.
  on(12.5, impact);
  for (const b of range(13, 17, 1)) on(b, (t) => kick(t));
  for (const b of range(13.5, 17, 1)) on(b, (t) => hat(t));
  for (const b of [14, 16]) on(b, clap);
  range(13.5, 17, 1).forEach((b, i) => on(b, (t) => bass(t, i % 2 ? HZ.G1 : HZ.C2)));
  on(13.5, (t) => sweep(t, BEAT * 0.45, false, 0.34));
  on(14.25, (t) => sweep(t, BEAT * 0.75, false, 0.28));
  on(15.25, (t) => sweep(t, BEAT * 0.75, true, 0.2));
  on(16, (t) => sweep(t, BEAT, true, 0.42));

  // Frame: one hit, a held chord, two bells, out.
  on(17, impact);
  on(17, (t) => pad(t, BEAT * 4.5, CHORD.Am));
  on(17.5, (t) => bell(t, 880));
  on(18, (t) => kick(t, 0.45));
  on(18.5, (t) => bell(t, 1318.5));
  on(19, (t) => kick(t, 0.45));
  on(20, (t) => blip(t, 1760, 0.2));
  on(20, (t) => sweep(t, BEAT * 1.1, false, 0.3));

  return {
    ctx,
    start(zero, fromSec) {
      for (const [beat, fn] of score) {
        const sec = beat * BEAT;
        if (sec < fromSec) continue;
        fn(zero + sec);
      }
    },
    setMuted(muted) {
      master.gain.setTargetAtTime(muted ? 0 : 0.75, ctx.currentTime, 0.03);
    },
    stop() {
      master.gain.setTargetAtTime(0, ctx.currentTime, 0.05);
      window.setTimeout(() => {
        for (const s of sources) {
          try {
            s.stop();
          } catch {
            /* already stopped */
          }
        }
        void ctx.close();
      }, 300);
    },
  };
}
