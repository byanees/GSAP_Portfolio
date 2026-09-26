import { playReel } from "./reelEvents";

/** Replays the intro reel, this time with its soundtrack. Hidden under reduced motion. */
export default function ReelReplayButton() {
  return (
    <button type="button" className="reel-replay" onClick={() => playReel({ sound: true })}>
      <span className="reel-replay__play" aria-hidden="true" />
      Play intro, sound on
    </button>
  );
}
