import { useState } from "react";

import "../Dice/DiceCue.css";

export default function GuestDice({ prompt, onSubmit, error = "" }) {
  const sides = Number(prompt?.payload?.sides ?? 12);
  const [roll, setRoll] = useState(null);
  const [isRolling, setIsRolling] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [localError, setLocalError] = useState("");

  async function handleRoll() {
    if (isRolling || roll !== null || submitted) {
      return;
    }

    setIsRolling(true);
    setLocalError("");

    window.setTimeout(async () => {
      const nextRoll = Math.floor(Math.random() * sides) + 1;
      setRoll(nextRoll);

      try {
        await onSubmit({
          promptId: prompt.id,
          cueId: prompt.cueId,
          responseType: "dice",
          responseKey: "final",
          responseData: {
            roll: nextRoll,
            sides,
          },
        });

        setSubmitted(true);
      } catch (submitError) {
        console.error("Unable to submit dice roll", submitError);
        setLocalError("The roll did not reach the story. Tap send again.");
      } finally {
        setIsRolling(false);
      }
    }, 650);
  }

  async function handleRetry() {
    if (roll === null || isRolling || submitted) {
      return;
    }

    setIsRolling(true);
    setLocalError("");

    try {
      await onSubmit({
        promptId: prompt.id,
        cueId: prompt.cueId,
        responseType: "dice",
        responseKey: "final",
        responseData: {
          roll,
          sides,
        },
      });

      setSubmitted(true);
    } catch (submitError) {
      console.error("Unable to resubmit dice roll", submitError);
      setLocalError("The roll still did not reach the story.");
    } finally {
      setIsRolling(false);
    }
  }

  return (
    <main className="dice-cue">
      <section className="dice-cue__card">
        <header className="dice-cue__header">
          <p className="dice-cue__eyebrow">
            {prompt?.payload?.eyebrow ?? "A Moment of Chance"}
          </p>
          <h1 className="dice-cue__title">
            {prompt?.payload?.title ?? "Roll the Story Die"}
          </h1>

          {prompt?.payload?.prompt && (
            <p className="dice-cue__prompt">{prompt.payload.prompt}</p>
          )}

          {prompt?.payload?.instructions && roll === null && (
            <p className="dice-cue__instructions">
              {prompt.payload.instructions}
            </p>
          )}
        </header>

        <div
          className={[
            "dice-cue__die",
            isRolling ? "dice-cue__die--rolling" : "",
            roll !== null ? "dice-cue__die--resolved" : "",
          ]
            .filter(Boolean)
            .join(" ")}
          aria-live="polite"
        >
          <span className="dice-cue__die-value">
            {isRolling && roll === null ? "…" : roll ?? "?"}
          </span>
          <span className="dice-cue__die-label">d{sides}</span>
        </div>

        {roll === null ? (
          <button
            type="button"
            className="dice-cue__button"
            onClick={handleRoll}
            disabled={isRolling}
          >
            {isRolling
              ? "Rolling…"
              : prompt?.payload?.rollLabel ?? "Roll the Die"}
          </button>
        ) : (
          <div className="dice-cue__result">
            <p className="dice-cue__roll-summary">
              You rolled <strong>{roll}</strong>.
            </p>
            <p className="dice-cue__result-preview">
              {submitted
                ? "The story has received your roll. Return to the television."
                : "The story is waiting for this roll."}
            </p>

            {!submitted && (
              <button
                type="button"
                className="dice-cue__button"
                onClick={handleRetry}
                disabled={isRolling}
              >
                {isRolling ? "Sending…" : "Send This Roll"}
              </button>
            )}
          </div>
        )}

        {(error || localError) && (
          <p className="guest-prompt__error">{localError || error}</p>
        )}
      </section>
    </main>
  );
}
