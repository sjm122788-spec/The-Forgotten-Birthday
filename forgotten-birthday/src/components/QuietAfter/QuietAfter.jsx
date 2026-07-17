import { useEffect, useState } from "react";

import storybookMap from "../../assets/images/book/map.png";
import quietAfterImage from "../../assets/images/chapters/QuietAfter.png";

import "./QuietAfter.css";

const MAP_HOLD_DURATION = 6000;
const FIRST_FLICKER_DURATION = 2500;
const SECOND_FLICKER_DURATION = 3500;
const MAP_ZOOM_DURATION = 18000;
const WINDOW_BLOOM_DURATION = 1100;
const ROOM_REVEAL_DURATION = 1000;
const ROOM_HOLD_DURATION = 33000;
const ENDING_DURATION = 5000;

function QuietAfter({ onComplete }) {
  const [phase, setPhase] = useState("map-hold");

  useEffect(() => {
    const firstFlickerAt = MAP_HOLD_DURATION;
    const secondFlickerAt = firstFlickerAt + FIRST_FLICKER_DURATION;
    const mapZoomAt = secondFlickerAt + SECOND_FLICKER_DURATION;
    const windowBloomAt = mapZoomAt + MAP_ZOOM_DURATION;
    const roomAt = windowBloomAt + WINDOW_BLOOM_DURATION;
    const endingAt = roomAt + ROOM_REVEAL_DURATION + ROOM_HOLD_DURATION;
    const completeAt = endingAt + ENDING_DURATION;

    const timers = [
      window.setTimeout(() => setPhase("first-flicker"), firstFlickerAt),
      window.setTimeout(() => setPhase("second-flicker"), secondFlickerAt),
      window.setTimeout(() => setPhase("map-zoom"), mapZoomAt),
      window.setTimeout(() => setPhase("window-bloom"), windowBloomAt),
      window.setTimeout(() => setPhase("room"), roomAt),
      window.setTimeout(() => setPhase("ending"), endingAt),
      window.setTimeout(() => onComplete?.(), completeAt),
    ];

    return () => {
      timers.forEach((timer) => window.clearTimeout(timer));
    };
  }, [onComplete]);

  return (
    <main className={`quiet-after quiet-after--${phase}`}>
      <div className="quiet-after__frame">
        <div className="quiet-after__map-layer" aria-hidden="true">
          <div className="quiet-after__map-camera">
            <img
              className="quiet-after__map"
              src={storybookMap}
              alt=""
              draggable="false"
            />

            <div className="quiet-after__window-light" />
          </div>
        </div>

        <div
          className="quiet-after__window-bloom"
          aria-hidden="true"
        />

        <div className="quiet-after__room-layer">
          <img
            className="quiet-after__image"
            src={quietAfterImage}
            alt="A quiet birthday room after the celebration has ended"
            draggable="false"
          />

          <div className="quiet-after__candle-glow" aria-hidden="true" />
          <div className="quiet-after__flame-core" aria-hidden="true" />
          <div className="quiet-after__vignette" aria-hidden="true" />
          <div className="quiet-after__final-blackout" aria-hidden="true" />
        </div>
      </div>
    </main>
  );
}

export default QuietAfter;