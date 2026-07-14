import { useEffect, useMemo, useRef, useState } from "react";

import "./RhythmChallengeCue.css";

function RhythmChallengeCue({ cue, onComplete }) {
  const {
    eyebrow = "A Shared Rhythm",
    title = "Wake the Parade",
    prompt = "",
    instructions = "Listen to the pattern, then tap it back together.",
    pattern = [0, 450, 900, 1450],
    tolerance = 240,
    previewLabel = "Hear the Rhythm",
    startLabel = "Start Tapping",
    tapLabel = "Tap",
    retryLabel = "Try Again",
    continueLabel = "Begin the Parade",
  } = cue;

  const [phase, setPhase] = useState("ready");
  const [attempts, setAttempts] = useState(1);
  const [tapTimes, setTapTimes] = useState([]);
  const [accuracy, setAccuracy] = useState(null);

  const previewTimersRef = useRef([]);
  const attemptStartRef = useRef(null);

  const expectedIntervals = useMemo(
    () => pattern.map((time) => time - pattern[0]),
    [pattern],
  );

  useEffect(() => {
    return () => {
      previewTimersRef.current.forEach((timer) =>
        window.clearTimeout(timer),
      );
    };
  }, []);

  function playPreview() {
    if (phase === "previewing") return;

    previewTimersRef.current.forEach((timer) =>
      window.clearTimeout(timer),
    );
    previewTimersRef.current = [];

    setPhase("previewing");
    setTapTimes([]);
    setAccuracy(null);

    pattern.forEach((time, index) => {
      const timer = window.setTimeout(() => {
        const pulse = document.querySelector(
          ".rhythm-challenge-cue__pulse",
        );

        pulse?.animate(
          [
            { transform: "scale(1)", opacity: 0.55 },
            { transform: "scale(1.18)", opacity: 1 },
            { transform: "scale(1)", opacity: 0.55 },
          ],
          {
            duration: 260,
            easing: "ease-out",
          },
        );

        if (index === pattern.length - 1) {
          window.setTimeout(() => {
            setPhase("waiting");
          }, 350);
        }
      }, time);

      previewTimersRef.current.push(timer);
    });
  }

  function beginAttempt() {
    setTapTimes([]);
    setAccuracy(null);
    attemptStartRef.current = null;
    setPhase("tapping");
  }

  function handleTap() {
    if (phase !== "tapping") return;

    const now = performance.now();

    if (attemptStartRef.current === null) {
      attemptStartRef.current = now;
    }

    const relativeTime = now - attemptStartRef.current;
    const nextTapTimes = [...tapTimes, relativeTime];
    setTapTimes(nextTapTimes);

    if (nextTapTimes.length !== expectedIntervals.length) {
      return;
    }

    const totalError = nextTapTimes.reduce(
      (sum, tapTime, index) =>
        sum + Math.abs(tapTime - expectedIntervals[index]),
      0,
    );

    const averageError =
      totalError / expectedIntervals.length;

    const nextAccuracy = Math.max(
      0,
      Math.round(100 - (averageError / tolerance) * 100),
    );

    setAccuracy(nextAccuracy);
    setPhase(
      averageError <= tolerance ? "success" : "failed",
    );
  }

  function handleRetry() {
    setAttempts((current) => current + 1);
    setTapTimes([]);
    setAccuracy(null);
    attemptStartRef.current = null;
    setPhase("ready");
  }

  function handleComplete() {
    onComplete({
      cueId: cue.id,
      completed: true,
      attempts,
      accuracy,
      outcomeId: "completed",
      narration: cue.successNarration,
      glory: cue.glory ?? 0,
    });
  }

  return (
    <section className="rhythm-challenge-cue">
      <div className="rhythm-challenge-cue__card">
        <header className="rhythm-challenge-cue__header">
          <p className="rhythm-challenge-cue__eyebrow">
            {eyebrow}
          </p>

          <h2 className="rhythm-challenge-cue__title">
            {title}
          </h2>

          {prompt && (
            <p className="rhythm-challenge-cue__prompt">
              {prompt}
            </p>
          )}

          {instructions && (
            <p className="rhythm-challenge-cue__instructions">
              {instructions}
            </p>
          )}
        </header>

        <div
          className="rhythm-challenge-cue__pulse"
          aria-hidden="true"
        >
          <span>♪</span>
        </div>

        <div
          className="rhythm-challenge-cue__progress"
          aria-live="polite"
        >
          {phase === "previewing" && <p>Listen carefully…</p>}
          {phase === "waiting" && (
            <p>The rhythm is waiting for the Guests.</p>
          )}
          {phase === "tapping" && (
            <p>
              {tapTimes.length} of {expectedIntervals.length} beats
            </p>
          )}
          {phase === "failed" && (
            <p>
              The parade almost woke. Accuracy: {accuracy}%.
            </p>
          )}
          {phase === "success" && (
            <p>
              The rhythm holds. Accuracy: {accuracy}%.
            </p>
          )}
        </div>

        <div className="rhythm-challenge-cue__actions">
          {phase === "ready" && (
            <button
              type="button"
              className="rhythm-challenge-cue__button"
              onClick={playPreview}
            >
              {previewLabel}
            </button>
          )}

          {phase === "waiting" && (
            <button
              type="button"
              className="rhythm-challenge-cue__button"
              onClick={beginAttempt}
            >
              {startLabel}
            </button>
          )}

          {phase === "tapping" && (
            <button
              type="button"
              className="rhythm-challenge-cue__tap"
              onClick={handleTap}
            >
              {tapLabel}
            </button>
          )}

          {phase === "failed" && (
            <button
              type="button"
              className="rhythm-challenge-cue__button"
              onClick={handleRetry}
            >
              {retryLabel}
            </button>
          )}

          {phase === "success" && (
            <button
              type="button"
              className="rhythm-challenge-cue__button"
              onClick={handleComplete}
            >
              {continueLabel}
            </button>
          )}
        </div>
      </div>
    </section>
  );
}

export default RhythmChallengeCue;