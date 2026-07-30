import { useMemo, useRef, useState } from "react";

import "./RhythmChallengeCue.css";

/*
  A true call-and-response memory game, Simon-style:

  Round 1 reveals the first beat of the sequence. The Guests
  repeat it. Round 2 replays the first two beats, and so on —
  each successful round adds one more beat to the call. A wrong
  tap sends the Guests all the way back to round 1 to re-watch
  from the beginning, which is what gives a Simon game its real
  tension.

  The pads are shuffled into a random display order on mount, so
  the correct sequence is never just "left to right" — it has to
  actually be watched and remembered.
*/

function shuffleSteps(steps) {
  const shuffled = [...steps];

  for (let i = shuffled.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }

  return shuffled;
}

function RhythmChallengeCue({ cue, onComplete }) {
  const {
    eyebrow = "A Shared Rhythm",
    title = "Give the Parade Its First Step",
    prompt = "",
    instructions =
      "Watch the call, then answer it back. Each time you succeed, the Marshal's call grows a little longer.",
    steps = [],
    sequence = [],
    watchLabel = "Watch the Call",
    startLabel = "We Are Ready",
    nextCallLabel = "Hear the Next Call",
    retryLabel = "Watch From the Beginning",
    continueLabel = "Raise the Baton",
    successNarration = "",
  } = cue;

  const [displaySteps] = useState(() => shuffleSteps(steps));

  const [phase, setPhase] = useState("ready");
  const [attempts, setAttempts] = useState(1);
  const [currentRound, setCurrentRound] = useState(1);
  const [revealIndex, setRevealIndex] = useState(-1);
  const [tappedIds, setTappedIds] = useState([]);

  const timersRef = useRef([]);

  const activePrefix = useMemo(
    () => sequence.slice(0, currentRound),
    [sequence, currentRound],
  );

  function clearTimers() {
    timersRef.current.forEach((timer) => window.clearTimeout(timer));
    timersRef.current = [];
  }

  function playCall(round) {
    clearTimers();

    const prefix = sequence.slice(0, round);

    setPhase("revealing");
    setTappedIds([]);
    setRevealIndex(-1);

    prefix.forEach((_, index) => {
      const timer = window.setTimeout(() => {
        setRevealIndex(index);

        if (index === prefix.length - 1) {
          const settleTimer = window.setTimeout(() => {
            setRevealIndex(-1);
            setPhase("waiting");
          }, 600);

          timersRef.current.push(settleTimer);
        }
      }, index * 700);

      timersRef.current.push(timer);
    });
  }

  function beginRepeating() {
    setTappedIds([]);
    setPhase("repeating");
  }

  function handlePadTap(stepId) {
    if (phase !== "repeating") {
      return;
    }

    const nextIndex = tappedIds.length;
    const expectedId = activePrefix[nextIndex];

    if (stepId !== expectedId) {
      setPhase("incorrect");
      return;
    }

    const nextTappedIds = [...tappedIds, stepId];
    setTappedIds(nextTappedIds);

    if (nextTappedIds.length !== activePrefix.length) {
      return;
    }

    if (currentRound === sequence.length) {
      setPhase("success");
    } else {
      setPhase("roundComplete");
    }
  }

  function handleWatchCall() {
    playCall(currentRound);
  }

  function handleNextRound() {
    const nextRound = currentRound + 1;
    setCurrentRound(nextRound);
    playCall(nextRound);
  }

  function handleRetry() {
    setAttempts((current) => current + 1);
    setCurrentRound(1);
    setTappedIds([]);
    clearTimers();
    setRevealIndex(-1);
    setPhase("ready");
  }

  function handleComplete() {
    if (phase !== "success") {
      return;
    }

    onComplete({
      cueId: cue.id,
      completed: true,
      attempts,
      roundsCompleted: sequence.length,
      outcomeId: "completed",
      narration: successNarration,
      glory: cue.glory ?? 0,
    });
  }

  if (steps.length === 0 || sequence.length === 0) {
    return (
      <section className="rhythm-challenge-cue">
        <div className="rhythm-challenge-cue__card">
          <p className="rhythm-challenge-cue__error">
            No call was left for the parade to answer.
          </p>
        </div>
      </section>
    );
  }

  const completedRounds =
    phase === "success" ? sequence.length : currentRound - 1;

  const isCurrentRoundActive =
    phase === "revealing" ||
    phase === "waiting" ||
    phase === "repeating" ||
    phase === "roundComplete";

  return (
    <section className="rhythm-challenge-cue">
      <div className="rhythm-challenge-cue__card">
        <header className="rhythm-challenge-cue__header">
          <p className="rhythm-challenge-cue__eyebrow">{eyebrow}</p>
          <h2 className="rhythm-challenge-cue__title">{title}</h2>
          {prompt && (
            <p className="rhythm-challenge-cue__prompt">{prompt}</p>
          )}
          {instructions && (
            <p className="rhythm-challenge-cue__instructions">
              {instructions}
            </p>
          )}
        </header>

        <div
          className="rhythm-challenge-cue__pips"
          aria-label={`Round ${Math.min(currentRound, sequence.length)} of ${sequence.length}`}
        >
          {sequence.map((_, index) => (
            <span
              key={`pip-${index}`}
              className={[
                "rhythm-challenge-cue__pip",
                index < completedRounds
                  ? "rhythm-challenge-cue__pip--filled"
                  : "",
                index === completedRounds && isCurrentRoundActive
                  ? "rhythm-challenge-cue__pip--active"
                  : "",
              ]
                .filter(Boolean)
                .join(" ")}
              aria-hidden="true"
            />
          ))}
        </div>

        <div
          className="rhythm-challenge-cue__pads"
          aria-label="The parade's instruments"
        >
          {displaySteps.map((step, stepIndex) => {
            const isRevealing =
              phase === "revealing" &&
              activePrefix[revealIndex] === step.id;

            const tappedPosition = tappedIds.indexOf(step.id);
            const isConfirmed =
              phase === "repeating" && tappedPosition !== -1;

            const isDisabled = phase !== "repeating" || isConfirmed;

            return (
              <button
                key={step.id}
                type="button"
                className={[
                  "rhythm-challenge-cue__pad",
                  `rhythm-challenge-cue__pad--${stepIndex % 4}`,
                  isRevealing
                    ? "rhythm-challenge-cue__pad--revealing"
                    : "",
                  isConfirmed
                    ? "rhythm-challenge-cue__pad--confirmed"
                    : "",
                ]
                  .filter(Boolean)
                  .join(" ")}
                onClick={() => handlePadTap(step.id)}
                disabled={isDisabled}
                aria-label={step.label}
              >
                <span className="rhythm-challenge-cue__pad-ring" aria-hidden="true" />
                <span
                  className="rhythm-challenge-cue__pad-symbol"
                  aria-hidden="true"
                >
                  {step.symbol}
                </span>
                <span className="rhythm-challenge-cue__pad-label">
                  {step.label}
                </span>
                {isConfirmed && (
                  <span
                    className="rhythm-challenge-cue__pad-check"
                    aria-hidden="true"
                  >
                    ✓
                  </span>
                )}
              </button>
            );
          })}
        </div>

        <div
          className="rhythm-challenge-cue__progress"
          aria-live="polite"
        >
          {phase === "revealing" && <p>Listen for the call…</p>}
          {phase === "waiting" && (
            <p>The square is waiting for the Guests to answer.</p>
          )}
          {phase === "repeating" && (
            <p>
              {tappedIds.length} of {activePrefix.length} answered
            </p>
          )}
          {phase === "roundComplete" && (
            <p>
              The parade remembers {currentRound} of {sequence.length}{" "}
              beats.
            </p>
          )}
          {phase === "incorrect" && (
            <p>The parade hesitates — that wasn't quite the call.</p>
          )}
          {phase === "success" && <p>The full call is answered.</p>}
        </div>

        <div className="rhythm-challenge-cue__actions">
          {phase === "ready" && (
            <button
              type="button"
              className="rhythm-challenge-cue__button"
              onClick={handleWatchCall}
            >
              {watchLabel}
            </button>
          )}

          {phase === "waiting" && (
            <button
              type="button"
              className="rhythm-challenge-cue__button"
              onClick={beginRepeating}
            >
              {startLabel}
            </button>
          )}

          {phase === "roundComplete" && (
            <button
              type="button"
              className="rhythm-challenge-cue__button"
              onClick={handleNextRound}
            >
              {nextCallLabel}
            </button>
          )}

          {phase === "incorrect" && (
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