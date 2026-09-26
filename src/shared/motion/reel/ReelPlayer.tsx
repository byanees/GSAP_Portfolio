import { useEffect, useMemo, useRef, useState, type CSSProperties } from "react";
import gsap from "gsap";
import { ScrambleTextPlugin } from "gsap/ScrambleTextPlugin";
import { PROFILE, STACK_LAYERS } from "@/data/profile";
import { createReelAudio, type ReelAudio } from "./reelAudio";
import { newAudioContext } from "./reelEvents";
import { ACTS, BEAT, BPM, EXIT_BEAT, INK, PAPER, TEAL, at } from "./reelScore";

gsap.registerPlugin(ScrambleTextPlugin);

export type ReelPlayerProps = {
  /** Present when the reel was started by a click that asked for sound. */
  audioCtx: AudioContext | null;
  onDone: () => void;
};

/* ------------------------------------------------------------------ copy */

// Every figure here is one the site already publishes and links to a case study.
const HOOK_CAPTION = "push notifications · one run · 6-8 min";
const STATS = [
  { value: "600k+", label: "concurrent sessions on one Redis connection", pos: [-95, -55, -4] },
  { value: "4,000+", label: "merchants paid through Request to Pay", pos: [105, 12, 3] },
  { value: "60,000+", label: "telco agents across Tanzania", pos: [-28, 92, -2] },
] as const;
const LANE_WORDS = ["traffic", "requests", "sessions", "pushes", "payments"];

/** Stack names scattered across the camera world, placed on a fixed pseudo-random spiral. */
const TAGS = STACK_LAYERS.flatMap((l) => l.items)
  .slice(0, 22)
  .map((label, i) => {
    const a = i * 2.399963; // golden angle, so nothing stacks up
    const r = 60 + ((i * 37) % 95);
    return { label, x: Math.cos(a) * r * 1.35, y: Math.sin(a) * r, rot: ((i * 13) % 17) - 8, big: i % 5 === 0 };
  });

/** Registration marks on a lattice, so camera moves read against fixed points in space. */
const MARKS = Array.from({ length: 7 * 5 }, (_, i) => ({ x: ((i % 7) - 3) * 60, y: (Math.floor(i / 7) - 2) * 70 }));

/** Font size that fits `chars` characters of display type across the screen. */
const fit = (chars: number, perChar = 0.66, maxVh = 30) =>
  ({ "--fs": `min(${(88 / (chars * perChar)).toFixed(2)}vw, ${maxVh}vh)` }) as CSSProperties;

function Chars({ text }: { text: string }) {
  return (
    <>
      {Array.from(text).map((c, i) => (
        <span key={i} className="reel-ch">
          {c === " " ? " " : c}
        </span>
      ))}
    </>
  );
}

/** Timecode in the editor's own format, at 24 frames a second. */
function timecode(sec: number) {
  const s = Math.max(0, sec);
  const pad = (n: number) => String(Math.floor(n)).padStart(2, "0");
  return `${pad(s / 60)}:${pad(s % 60)}:${pad((s % 1) * 24)}`;
}

/* ---------------------------------------------------------------- player */

export default function ReelPlayer({ audioCtx, onDone }: ReelPlayerProps) {
  const rootRef = useRef<HTMLDivElement>(null);
  const skipRef = useRef<HTMLButtonElement>(null);
  const api = useRef<{ skip: () => void; toggleSound: () => void } | null>(null);
  const [sound, setSound] = useState<"off" | "on" | "muted">(audioCtx ? "on" : "off");

  // Sized once, from the viewport the reel opens in.
  const grid = useMemo(() => {
    const w = window.innerWidth;
    const h = window.innerHeight;
    const cell = Math.max(w, h) / 10;
    const cols = Math.ceil(w / cell);
    const rows = Math.ceil(h / cell);
    return { cols, rows, count: cols * rows, center: Math.floor(rows / 2) * cols + Math.floor(cols / 2) };
  }, []);

  useEffect(() => {
    const root = rootRef.current!;
    const q = gsap.utils.selector(root);
    const html = document.documentElement;
    const page = document.getElementById("root");

    // Take over from the loader: the reel's first frame is the loader's frame.
    document.getElementById("site-loader")?.remove();
    html.classList.remove("is-loading");
    html.classList.add("reel-lock");
    if (page) page.inert = true;
    skipRef.current?.focus({ preventScroll: true });

    let tl: gsap.core.Timeline | null = null;
    let audio: ReelAudio | null = null;
    let muted = false;
    let manual = true; // the timeline follows our clock until a skip hands it back to GSAP
    let finished = false;
    let cancelled = false;
    let perfZero = 0;
    let clock = () => (performance.now() - perfZero) / 1000;

    const hud = {
      time: q(".reel-hud__time")[0],
      act: q(".reel-hud__act")[0],
      beats: q(".reel-hud__beat"),
      progress: q(".reel-hud__progress")[0],
    };
    let lastBeat = -1;
    let lastAct = "";
    const paintHud = (t: number) => {
      if (!tl) return;
      hud.time.textContent = timecode(t);
      const b = t / BEAT;
      let act: string = ACTS[0].name;
      for (const a of ACTS) if (b >= a.from) act = a.name;
      if (act !== lastAct) hud.act.textContent = lastAct = act;
      const beat = Math.floor(b);
      if (beat !== lastBeat) {
        lastBeat = beat;
        hud.beats.forEach((el, i) => el.classList.toggle("is-on", i === beat % 4));
      }
      hud.progress.style.transform = `scaleX(${Math.min(1, t / tl.duration())})`;
    };

    const finish = () => {
      if (finished) return;
      finished = true;
      html.classList.remove("reel-lock");
      if (page) page.inert = false;
      // The exit hides the HUD, which drops focus to <body>; hand it to the page.
      const active = document.activeElement;
      if (!active || active === document.body || root.contains(active)) {
        document.getElementById("main-content")?.focus({ preventScroll: true });
      }
      audio?.stop();
      audio = null;
      onDone();
    };

    const tick = () => {
      if (!tl) return;
      if (manual) {
        const t = clock();
        if (t >= 0) tl.time(Math.min(t, tl.duration()));
        if (t >= tl.duration()) finish();
      }
      paintHud(tl.time());
    };

    // The reel follows the audio clock once there is sound, so a context that
    // never starts would freeze it. Wait briefly, then carry on silent.
    const whenRunning = async (ctx: AudioContext) => {
      if (ctx.state !== "running") await Promise.race([ctx.resume(), new Promise((r) => setTimeout(r, 400))]);
      if (ctx.state === "running") return true;
      void ctx.close();
      setSound("off");
      return false;
    };

    const attachAudio = (ctx: AudioContext) => {
      audio = createReelAudio(ctx);
      const now = tl ? tl.time() : 0;
      const zero = ctx.currentTime + (tl ? -now : 0.05);
      audio.start(zero, tl ? now + 0.04 : 0);
      const a = audio;
      clock = () => a.ctx.currentTime - zero;
    };

    api.current = {
      skip() {
        if (!tl || finished || tl.time() >= at(EXIT_BEAT)) return;
        manual = false;
        audio?.setMuted(true);
        tl.seek("exit").play();
      },
      toggleSound() {
        if (audio) {
          muted = !muted;
          audio.setMuted(muted);
          setSound(muted ? "muted" : "on");
          return;
        }
        if (!manual || finished) return; // skipping: nothing left worth scoring
        const ctx = newAudioContext();
        if (!ctx) return;
        setSound("on");
        void whenRunning(ctx).then((ok) => {
          if (!ok) return;
          if (cancelled || finished || audio) void ctx.close();
          else attachAudio(ctx);
        });
      },
    };

    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.preventDefault();
        api.current?.skip();
      }
    };
    window.addEventListener("keydown", onKey);

    // Display type must be measured in its real face, but a slow font never
    // holds the reel up for more than a moment: the first beat has no type.
    const fontsReady = Promise.race([document.fonts?.ready, new Promise((r) => setTimeout(r, 700))]);

    void (async () => {
      await fontsReady;
      const withSound = audioCtx ? await whenRunning(audioCtx) : false;
      if (cancelled) return;
      tl = buildTimeline(root, grid);
      tl.eventCallback("onComplete", finish);
      if (withSound) attachAudio(audioCtx!);
      else perfZero = performance.now() + 30;
      gsap.ticker.add(tick);
      // Dev only: window.__reel.hold(beat) freezes the reel on a frame for review.
      if (import.meta.env.DEV) {
        (window as unknown as { __reel: unknown }).__reel = {
          hold: (beat: number) => {
            clock = () => at(beat);
            tick();
          },
        };
      }
    })();

    return () => {
      cancelled = true;
      window.removeEventListener("keydown", onKey);
      gsap.ticker.remove(tick);
      tl?.kill();
      audio?.stop();
      html.classList.remove("reel-lock");
      if (page) page.inert = false;
    };
    // audioCtx and onDone belong to this run; a new run remounts the player.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div ref={rootRef} className="reel" role="dialog" aria-modal="true" aria-label="Intro reel">
      <div className="reel-frame">
        <div className="reel-cam" aria-hidden="true">
          {/* 01 HOOK: a dot, a slice, the screen splits on a number. */}
          <section className="reel-scene reel-hook">
            <div className="reel-hook__stage">
              <div className="reel-num">
                <span className="reel-num__glyph">7</span>
                <span className="reel-num__ring" />
                <span className="reel-num__ring" />
                <span className="reel-num__glyph reel-num__dash">–</span>
                <span className="reel-num__glyph">8</span>
                <span className="reel-num__ring" />
                <span className="reel-num__ring" data-zoom-ring />
                <span className="reel-num__glyph">k</span>
              </div>
              <p className="reel-hook__cap" data-text={HOOK_CAPTION} />
            </div>
            <div className="reel-shutter reel-shutter--top" />
            <div className="reel-shutter reel-shutter--bottom" />
            <div className="reel-dot" />
          </section>

          {/* 02 TYPE: the headline, one cut per beat. */}
          <section className="reel-scene reel-card reel-card--teal" data-card="build">
            <span className="reel-word" style={fit(7)}>
              <span className="reel-line">
                <Chars text="I build" />
              </span>
            </span>
          </section>
          <section className="reel-scene reel-card reel-card--ink" data-card="payment">
            <span className="reel-word" style={fit(9, 0.66, 20)}>
              <span className="reel-line reel-line--outline">Payment</span>
              <span className="reel-line reel-line--wipe">platforms</span>
            </span>
          </section>
          <section className="reel-scene reel-card reel-card--paper" data-card="backends">
            <span className="reel-word reel-word--mono" style={fit(10, 0.6, 26)} data-text="& backends" />
            <span className="reel-underline" />
          </section>
          <section className="reel-scene reel-card reel-card--ink" data-card="hold">
            <span className="reel-word reel-word--small">That</span>
            <span className="reel-word reel-word--teal" style={fit(7, 0.66, 34)}>
              <span className="reel-line">
                <Chars text="hold up" />
              </span>
            </span>
          </section>
          <section className="reel-scene reel-card reel-card--ink" data-card="traffic">
            <div className="reel-lanes">
              {[0, 1, 2, 3, 4].map((i) => (
                <div key={i} className={`reel-lane${i === 2 ? " reel-lane--accent" : ""}`}>
                  {Array.from({ length: 8 }, (_, k) => `${LANE_WORDS[(i + k) % LANE_WORDS.length]} · `).join("")}
                </div>
              ))}
            </div>
            <div className="reel-slam">
              <span className="reel-slam__kicker">under</span>
              <span className="reel-word" style={fit(13, 0.64, 24)}>
                Real traffic<span className="reel-period" data-period="traffic" />
              </span>
            </div>
          </section>

          {/* 03 SHAPE: the site's grid, as tiles that turn, round off and fold into one. */}
          <section
            className="reel-scene reel-tiles"
            style={{ "--cols": grid.cols, "--rows": grid.rows } as CSSProperties}
          >
            {Array.from({ length: grid.count }, (_, i) => (
              <span key={i} className="reel-tile" />
            ))}
          </section>

          {/* 04 CAMERA: one large world, shot with pans, rolls and a crane. */}
          <section className="reel-scene reel-set">
            <div className="reel-world">
              {MARKS.map((m) => (
                <span
                  key={`${m.x},${m.y}`}
                  className="reel-cross"
                  style={{ "--x": `${m.x}vmin`, "--y": `${m.y}vmin`, "--r": "0deg" } as CSSProperties}
                >
                  +
                </span>
              ))}
              {TAGS.map((t) => (
                <span
                  key={t.label}
                  className={`reel-tag${t.big ? " reel-tag--big" : ""}`}
                  style={{ "--x": `${t.x}vmin`, "--y": `${t.y}vmin`, "--r": `${t.rot}deg` } as CSSProperties}
                >
                  {t.label}
                </span>
              ))}
              {STATS.map((s, i) => (
                <div
                  key={s.value}
                  className="reel-stat"
                  style={{ "--x": `${s.pos[0]}vmin`, "--y": `${s.pos[1]}vmin`, "--r": `${s.pos[2]}deg` } as CSSProperties}
                >
                  <span className="reel-stat__index">0{i + 1}</span>
                  <span className="reel-stat__value">
                    <span className="reel-line">
                      <Chars text={s.value} />
                    </span>
                  </span>
                  <span className="reel-stat__label" data-text={s.label} />
                </div>
              ))}
              <span className="reel-world-dot" />
            </div>
          </section>

          {/* 05 FRAME: the dot that opened the reel closes it, as a full stop. */}
          <section className="reel-scene reel-final">
            <div className="reel-final__inner">
              <span className="reel-mark">MA</span>
              <span className="reel-name">
                <span className="reel-line">
                  <Chars text={PROFILE.name} />
                  <span className="reel-period" data-period="final" />
                </span>
              </span>
              <span className="reel-role" data-text={`${PROFILE.role} · ${PROFILE.location.split(",")[0]}`} />
              <span className="reel-rule">
                <span className="reel-rule__fill" />
              </span>
            </div>
            <div className="reel-iris" />
          </section>
        </div>

        <div className="reel-flash" aria-hidden="true" />

        <div className="reel-hud">
          <span className="reel-chip reel-hud__tl" aria-hidden="true">
            {PROFILE.shortName} · Reel 01
          </span>
          <div className="reel-hud__tr">
            <button type="button" className="reel-chip reel-btn" onClick={() => api.current?.toggleSound()} aria-pressed={sound === "on"}>
              <span className="reel-btn__icon" data-state={sound} aria-hidden="true" />
              {sound === "on" ? "Sound on" : "Sound off"}
            </button>
            <button ref={skipRef} type="button" className="reel-chip reel-btn" onClick={() => api.current?.skip()}>
              Skip intro <kbd>Esc</kbd>
            </button>
          </div>
          <div className="reel-chip reel-hud__bl" aria-hidden="true">
            <span className="reel-hud__time">00:00:00</span>
            <span className="reel-hud__act">Hook</span>
          </div>
          <div className="reel-chip reel-hud__br" aria-hidden="true">
            {BPM} bpm
            <span className="reel-hud__beats">
              {[0, 1, 2, 3].map((i) => (
                <span key={i} className="reel-hud__beat" />
              ))}
            </span>
          </div>
          <span className="reel-hud__track" aria-hidden="true">
            <span className="reel-hud__progress" />
          </span>
        </div>
      </div>
      <div className="reel-curtain" aria-hidden="true" />
    </div>
  );
}

/* -------------------------------------------------------------- timeline */

type Grid = { cols: number; rows: number; count: number; center: number };

function buildTimeline(root: HTMLElement, grid: Grid) {
  const q = gsap.utils.selector(root);
  const one = (sel: string) => q(sel)[0] as HTMLElement;
  const W = window.innerWidth;
  const H = window.innerHeight;
  const vmin = Math.min(W, H) / 100;
  const diag = Math.hypot(W, H);

  // Measure first, while nothing is transformed yet.
  const centerOf = (el: Element) => {
    const r = el.getBoundingClientRect();
    return { x: r.left + r.width / 2, y: r.top + r.height / 2, r: r.width / 2 };
  };
  const ring = centerOf(one("[data-zoom-ring]"));
  const trafficDot = centerOf(one('[data-period="traffic"]'));
  const finalDot = centerOf(one('[data-period="final"]'));

  const tl = gsap.timeline({ paused: true, defaults: { ease: "expo.out" } });

  const scenes = {
    hook: one(".reel-hook"),
    build: one('[data-card="build"]'),
    payment: one('[data-card="payment"]'),
    backends: one('[data-card="backends"]'),
    hold: one('[data-card="hold"]'),
    traffic: one('[data-card="traffic"]'),
    tiles: one(".reel-tiles"),
    set: one(".reel-set"),
    final: one(".reel-final"),
  };
  const cam = one(".reel-cam");
  const flashEl = one(".reel-flash");

  /** A hard cut: `show` appears and `hide` is gone on the same frame. */
  const cut = (beat: number, show: Element, hide?: Element) => {
    tl.set(show, { autoAlpha: 1 }, at(beat));
    if (hide) tl.set(hide, { autoAlpha: 0 }, at(beat));
  };
  const flash = (beat: number, peak = 0.85) =>
    tl.fromTo(flashEl, { opacity: peak }, { opacity: 0, duration: 0.6 * BEAT, ease: "power2.out", immediateRender: false }, at(beat));
  const shake = (beat: number, px = 14) =>
    tl.to(
      cam,
      {
        keyframes: { x: [0, px, -px * 0.7, px * 0.45, -px * 0.2, 0], y: [0, -px * 0.5, px * 0.6, -px * 0.3, px * 0.1, 0] },
        duration: 0.6 * BEAT,
        ease: "none",
      },
      at(beat),
    );
  const scramble = (el: Element, beat: number, beats: number, chars = "01/#{}[]*") => {
    const text = el.getAttribute("data-text") ?? "";
    tl.set(el, { textContent: "" }, 0);
    tl.to(el, { scrambleText: { text, chars, speed: 0.7, revealDelay: 0.15 }, duration: beats * BEAT, ease: "none" }, at(beat));
  };
  const rise = (targets: gsap.TweenTarget, beat: number, stagger = 0.035, extra: gsap.TweenVars = {}) =>
    tl.from(targets, { yPercent: 115, rotation: 6, duration: 0.6 * BEAT, stagger: stagger * BEAT, ...extra }, at(beat));

  tl.set(Object.values(scenes), { autoAlpha: 0 }, 0);

  /* ---- 01 HOOK -------------------------------------------------------- */
  const stage = one(".reel-hook__stage");
  const dot = one(".reel-dot");
  const [shutTop, shutBottom] = q(".reel-shutter");
  const num = one(".reel-num");

  tl.set(scenes.hook, { autoAlpha: 1 }, 0);
  tl.fromTo(dot, { xPercent: -50, yPercent: -50, scale: 0 }, { scale: 1, duration: 0.35 * BEAT, ease: "back.out(4)" }, 0);
  tl.to(dot, { width: "100vw", height: 3, duration: 0.5 * BEAT, ease: "expo.inOut" }, at(0.5));
  tl.set(dot, { autoAlpha: 0 }, at(1));
  tl.to(shutTop, { yPercent: -100, duration: 0.8 * BEAT }, at(1));
  tl.to(shutBottom, { yPercent: 100, duration: 0.8 * BEAT }, at(1));
  tl.from(num, { scale: 1.6, duration: 1.4 * BEAT }, at(1));
  flash(1);
  shake(1, 20);
  scramble(one(".reel-hook__cap"), 1.5, 1.2);

  // Colour strobe on the beat: ink, paper, back to teal.
  const strobe: [number, string, string][] = [
    [2, INK, TEAL],
    [2.5, PAPER, INK],
    [3, TEAL, INK],
  ];
  for (const [beat, bg, fg] of strobe) {
    tl.set(stage, { backgroundColor: bg, color: fg }, at(beat));
    tl.fromTo(num, { scale: 1.07 }, { scale: 1, duration: 0.45 * BEAT, immediateRender: false }, at(beat));
  }

  // Dive through the last zero. The ring's counter is teal, so is the next card.
  tl.to(
    stage,
    { scale: 80, transformOrigin: `${ring.x}px ${ring.y}px`, duration: 0.75 * BEAT, ease: "expo.in" },
    at(3.25),
  );

  /* ---- 02 TYPE -------------------------------------------------------- */
  cut(4, scenes.build, scenes.hook);
  rise(q('[data-card="build"] .reel-ch'), 4);
  tl.to(q('[data-card="build"] .reel-word'), { scale: 0.92, duration: BEAT, ease: "power1.inOut" }, at(4.2));

  cut(5, scenes.payment, scenes.build);
  tl.from(one(".reel-line--outline"), { letterSpacing: "0.45em", opacity: 0, duration: 0.7 * BEAT }, at(5));
  tl.fromTo(
    one(".reel-line--wipe"),
    { clipPath: "inset(0% 100% 0% 0%)" },
    { clipPath: "inset(0% 0% 0% 0%)", duration: 0.45 * BEAT, ease: "expo.inOut", immediateRender: false },
    at(5.5),
  );
  tl.set(one(".reel-line--wipe"), { clipPath: "inset(0% 100% 0% 0%)" }, 0);
  shake(5.5, 8);

  cut(6, scenes.backends, scenes.payment);
  scramble(one('[data-card="backends"] .reel-word'), 6, 0.9, "01{}[]/=;$");
  tl.from(one(".reel-underline"), { scaleX: 0, transformOrigin: "0% 50%", duration: 0.5 * BEAT, ease: "expo.inOut" }, at(6.5));

  cut(7, scenes.hold, scenes.backends);
  tl.from(one(".reel-word--small"), { scale: 0, duration: 0.4 * BEAT, ease: "back.out(3)" }, at(7));
  tl.from(
    q('[data-card="hold"] .reel-word--teal .reel-ch'),
    { scaleY: 0, transformOrigin: "50% 100%", duration: 0.9 * BEAT, ease: "elastic.out(1, 0.45)", stagger: 0.03 * BEAT },
    at(7.5),
  );
  shake(7.5, 12);

  cut(8, scenes.traffic, scenes.hold);
  q(".reel-lane").forEach((lane, i) => {
    const dir = i % 2 ? 1 : -1;
    tl.fromTo(
      lane,
      { xPercent: dir > 0 ? -48 : -4 },
      { xPercent: dir > 0 ? -22 : -30, duration: 1.6 * BEAT, ease: "power4.out", immediateRender: false },
      at(8) + i * 0.02,
    );
  });
  tl.set(q(".reel-lane"), { xPercent: (i: number) => (i % 2 ? -48 : -4) }, 0);
  tl.from(one(".reel-slam__kicker"), { autoAlpha: 0, y: 24, duration: 0.5 * BEAT }, at(8.5));
  tl.to(q(".reel-lane"), { opacity: 0.12, duration: 0.3 * BEAT }, at(9));
  tl.from(one(".reel-slam .reel-word"), { scale: 2.6, autoAlpha: 0, duration: 0.45 * BEAT }, at(9));
  tl.from(one('[data-period="traffic"]'), { scale: 0, duration: 0.35 * BEAT, ease: "back.out(5)" }, at(9.5));
  flash(9, 0.6);
  shake(9, 16);

  /* ---- 03 SHAPE ------------------------------------------------------- */
  // Opens as an iris out of the full stop that ended the sentence.
  const tiles = q(".reel-tile");
  const hub = tiles[grid.center];
  const others = tiles.filter((_, i) => i !== grid.center);
  const gridStagger = (from: gsap.StaggerVars["from"], amount: number) => ({ grid: [grid.rows, grid.cols] as [number, number], from, amount: amount * BEAT });
  const checker = (i: number) => ((Math.floor(i / grid.cols) + (i % grid.cols)) % 2 ? TEAL : INK);

  tl.set(scenes.tiles, { autoAlpha: 1, clipPath: `circle(0px at ${trafficDot.x}px ${trafficDot.y}px)` }, at(10));
  tl.to(scenes.tiles, { clipPath: `circle(${diag}px at ${trafficDot.x}px ${trafficDot.y}px)`, duration: 0.5 * BEAT, ease: "power3.in" }, at(10));
  tl.set(scenes.traffic, { autoAlpha: 0 }, at(10.5));
  tl.set(scenes.tiles, { clipPath: "none" }, at(10.5));
  tl.from(tiles, { scale: 0, duration: 0.45 * BEAT, ease: "back.out(2)", stagger: gridStagger("center", 0.6) }, at(10.1));
  tl.to(
    tiles,
    { rotation: 90, borderRadius: "50%", backgroundColor: checker, duration: 0.5 * BEAT, ease: "expo.inOut", stagger: gridStagger("edges", 0.4) },
    at(11),
  );
  tl.to(
    tiles,
    { yPercent: -45, duration: 0.25 * BEAT, ease: "sine.inOut", yoyo: true, repeat: 1, stagger: { ...gridStagger("start", 0.35), axis: "x" } },
    at(11.5),
  );
  tl.to(others, { scale: 0, duration: 0.3 * BEAT, ease: "back.in(2)", stagger: gridStagger("edges", 0.2) }, at(12));
  tl.to(hub, { backgroundColor: INK, scale: (2 * diag) / hub.getBoundingClientRect().width + 2, duration: 0.4 * BEAT, ease: "expo.in" }, at(12.1));

  /* ---- 04 CAMERA ------------------------------------------------------ */
  const world = one(".reel-world");
  // Framing a point of the world: move the world so that point lands at the
  // centre of the lens, after scale and roll are applied.
  const shot = (px: number, py: number, scale: number, rotation = 0) => {
    const a = (rotation * Math.PI) / 180;
    const X = scale * px * vmin;
    const Y = scale * py * vmin;
    return { x: -(X * Math.cos(a) - Y * Math.sin(a)), y: -(X * Math.sin(a) + Y * Math.cos(a)), scale, rotation, rotationX: 0 };
  };
  const [A, Bc, C] = STATS.map((s) => s.pos);
  // A card is 62vmin wide. On a portrait phone vmin is the width, so close-ups
  // are capped to keep the whole card in frame.
  const close = (scale: number) => Math.min(scale, (0.86 * W) / (62 * vmin));
  const stats = q(".reel-stat");
  const reveal = (i: number, beat: number) => {
    rise(stats[i].querySelectorAll(".reel-ch"), beat, 0.03);
    scramble(stats[i].querySelector(".reel-stat__label")!, beat + 0.25, 0.8, "abcdefghijklmnopqrstuvwxyz");
  };

  cut(12.5, scenes.set, scenes.tiles);
  tl.fromTo(world, shot(A[0], A[1], 3.4, -10), { ...shot(A[0], A[1], close(1.45), -3), duration: BEAT, immediateRender: false }, at(12.5));
  tl.set(world, shot(A[0], A[1], 3.4, -10), 0);
  reveal(0, 12.6);
  flash(12.5, 0.5);

  // Whip pan. The smear is a skew and stretch on the lens: a blur filter over
  // the full-screen 3D set re-rasterises every frame and drops frames.
  tl.to(world, { ...shot(Bc[0], Bc[1], close(1.45), 3), duration: 0.45 * BEAT, ease: "expo.inOut" }, at(13.5));
  tl.to(
    scenes.set,
    { keyframes: { skewX: [0, -18, 0], scaleX: [1, 1.12, 1] }, duration: 0.45 * BEAT, ease: "none" },
    at(13.5),
  );
  reveal(1, 13.8);

  // Dolly in on a dutch roll.
  tl.to(world, { ...shot(C[0], C[1], close(1.7), -9), duration: 0.75 * BEAT, ease: "power4.inOut" }, at(14.25));
  reveal(2, 14.75);

  // Pull all the way back, then crane over the whole set.
  tl.to(world, { ...shot(0, 0, 0.3, 0), duration: 0.75 * BEAT, ease: "expo.inOut" }, at(15.25));
  tl.from(q(".reel-tag"), { opacity: 0, duration: 0.5 * BEAT, stagger: { amount: 0.5 * BEAT, from: "random" } }, at(15.25));
  tl.to(world, { rotationX: 52, rotation: -22, scale: 0.42, duration: 0.5 * BEAT, ease: "power3.inOut" }, at(16));

  // And dive into the dot at the centre of it.
  tl.to(world, { rotationX: 0, rotation: 0, scale: 90, x: 0, y: 0, duration: 0.5 * BEAT, ease: "expo.in" }, at(16.5));

  /* ---- 05 FRAME ------------------------------------------------------- */
  const iris = one(".reel-iris");
  cut(17, scenes.final, scenes.set);
  tl.fromTo(
    iris,
    { clipPath: `circle(${diag}px at ${finalDot.x}px ${finalDot.y}px)` },
    { clipPath: `circle(${finalDot.r}px at ${finalDot.x}px ${finalDot.y}px)`, duration: 0.6 * BEAT, ease: "expo.inOut", immediateRender: false },
    at(17),
  );
  tl.set(iris, { autoAlpha: 0 }, at(17.6));
  tl.set(iris, { autoAlpha: 1, clipPath: `circle(${diag}px at ${finalDot.x}px ${finalDot.y}px)` }, 0);
  tl.from(one(".reel-mark"), { scale: 0, rotation: -120, duration: 0.7 * BEAT, ease: "back.out(2)" }, at(17.5));
  rise(q(".reel-name .reel-ch"), 17.6, 0.03);
  scramble(one(".reel-role"), 18, 0.9, "ABCDEFGHIJKLMNOPQRSTUVWXYZ");
  tl.from(one(".reel-rule__fill"), { scaleX: 0, transformOrigin: "0% 50%", duration: 0.7 * BEAT, ease: "expo.inOut" }, at(18.5));

  // Out: the frame lifts off the page with a teal band trailing it.
  tl.addLabel("exit", at(EXIT_BEAT));
  tl.to(one(".reel-hud"), { autoAlpha: 0, duration: 0.3 * BEAT }, "exit");
  tl.to(one(".reel-final__inner"), { yPercent: -40, duration: 1.1 * BEAT, ease: "expo.in" }, "exit");
  tl.to(root, { yPercent: -120, duration: 1.2 * BEAT, ease: "expo.inOut" }, "exit");

  return tl;
}
