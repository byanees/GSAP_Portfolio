import HeroButtonContent from "@/shared/sections/dev/HeroButton";
import { PLAY_SVG } from "@/shared/sections/dev/icons";
import { playReel } from "./reelEvents";

/** Replays the intro reel, this time with its soundtrack. Hidden under reduced motion. */
export default function ReelReplayButton() {
  return (
    <button type="button" className="hero-btn hero-btn--ghost reel-replay" onClick={() => playReel({ sound: true })}>
      <HeroButtonContent label="Play intro" note="sound on" icon={PLAY_SVG} />
    </button>
  );
}
