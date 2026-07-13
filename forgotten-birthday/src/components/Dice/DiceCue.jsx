import { useMemo, useState } from "react";

import "./DiceCue.css";

function DiceCue({ cue, onComplete }) {
  const {
    eyebrow = "A Moment of Chance",
    title = "Roll the Story Die",
    prompt = "",
    instructions = "Roll once and let the story decide what happens.",
    sides = 12,
    rollLabel = "Roll the Die",
    continueLabel = "Continue",
    outcomes = [],
  } = cue;

  const [roll, setRoll] = useState(null);
  const [isRolling, setIsRolling] = useState(false);

  const resolvedOutcome = useMemo(() => {
    if (roll === null) return null;

    return [...outcomes]
      .sort((a, b) => (b.min ?? 1) - (a.min ?? 1))
      .find((outcome) => roll >= (outcome.min ?? 1)) ?? null;
  }, [outcomes, roll]);

  function handleRoll() {
    if (isRolling || roll !== null) return;

    setIsRolling(true);

    window.setTimeout(() => {
      setRoll(Math.floor(Math.random() * sides) + 1);
      setIsRolling(false);
    }, 650);
  }

  function handleContinue() {
    if (roll === null || !resolvedOutcome) return;

    onComplete({
      cueId: cue.id,
      roll,
      sides,
      outcome: resolvedOutcome,
      outcomeId: resolvedOutcome.id,
      tier: resolvedOutcome.tier,
      narration: resolvedOutcome.narration,
      glory: resolvedOutcome.glory ?? 0,
    });
  }

  return (
    <section className="dice-cue">
      <div className="dice-cue__card">
        <header className="dice-cue__header">
          <p className="dice-cue__eyebrow">{eyebrow}</p>
          <h2 className="dice-cue__title">{title}</h2>

          {prompt && <p className="dice-cue__prompt">{prompt}</p>}

          {instructions && roll === null && (
            <p className="dice-cue__instructions">{instructions}</p>
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
          aria-label={
            roll === null
              ? `${sides}-sided die waiting to be rolled`
              : `Rolled ${roll} on a ${sides}-sided die`
          }
        >
          <span className="dice-cue__die-value">
            {isRolling ? "…" : roll ?? "?"}
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
            {isRolling ? "Rolling…" : rollLabel}
          </button>
        ) : (
          <div className="dice-cue__result">
            <p className="dice-cue__roll-summary">
              You rolled <strong>{roll}</strong>.
            </p>

            {resolvedOutcome && (
              <>
                <h3 className="dice-cue__result-title">
                  {resolvedOutcome.label}
                </h3>

                {resolvedOutcome.preview && (
                  <p className="dice-cue__result-preview">
                    {resolvedOutcome.preview}
                  </p>
                )}
              </>
            )}

            <button
              type="button"
              className="dice-cue__button"
              onClick={handleContinue}
              disabled={!resolvedOutcome}
            >
              {continueLabel}
            </button>
          </div>
        )}
      </div>
    </section>
  );
}

export default DiceCue;