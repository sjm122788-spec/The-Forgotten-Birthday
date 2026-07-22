import { useEffect, useMemo, useState } from "react";

import finale, { finaleRelics } from "../../data/finale";

import "./FinaleScene.css";

const DEFAULT_RELIC_IDS = finaleRelics.map((relic) => relic.id);

function normalizeRelicIds(earnedRelics) {
  if (!Array.isArray(earnedRelics)) {
    return [];
  }

  return earnedRelics
    .map((relic) =>
      typeof relic === "string" ? relic : relic?.id,
    )
    .filter(Boolean);
}

function FinaleScene({
  earnedRelics = DEFAULT_RELIC_IDS,
  glory = 0,
  maximumGlory = 100,
  onComplete,
}) {
  const [sequenceIndex, setSequenceIndex] = useState(0);
  const [returnedRelicCount, setReturnedRelicCount] =
    useState(0);
  const [isComplete, setIsComplete] = useState(false);

  const currentCue = finale.sequence[sequenceIndex];
  const phase = currentCue?.phase ?? "complete";

  const earnedRelicIds = useMemo(
    () => normalizeRelicIds(earnedRelics),
    [earnedRelics],
  );

  const returnedRelics = useMemo(
    () =>
      finaleRelics.filter((relic) =>
        earnedRelicIds.includes(relic.id),
      ),
    [earnedRelicIds],
  );

  const gloryRatio =
    maximumGlory > 0
      ? Math.max(0, Math.min(1, glory / maximumGlory))
      : 0;

  const guestIsVisible = [
    "doorway",
    "invitation",
    "guest",
    "guest-seated",
    "title-reveal",
    "confetti",
    "closing",
    "complete",
  ].includes(phase);

  const guestIsSeated = [
    "guest-seated",
    "title-reveal",
    "confetti",
    "closing",
    "complete",
  ].includes(phase);

  const celebrationIsRestored = [
    "recognition",
    "doorway",
    "invitation",
    "guest",
    "guest-seated",
    "title-reveal",
    "confetti",
    "closing",
    "complete",
  ].includes(phase);

  function moveToNextCue() {
    if (sequenceIndex >= finale.sequence.length - 1) {
      setIsComplete(true);
      onComplete?.();
      return;
    }

    setSequenceIndex((current) => current + 1);
  }

  useEffect(() => {
    if (phase !== "relics") {
      return undefined;
    }

    if (returnedRelicCount >= returnedRelics.length) {
      const completionTimer = window.setTimeout(
        moveToNextCue,
        1000,
      );

      return () => window.clearTimeout(completionTimer);
    }

    const relicTimer = window.setTimeout(() => {
      setReturnedRelicCount((current) => current + 1);
    }, 1200);

    return () => window.clearTimeout(relicTimer);
  }, [
    phase,
    returnedRelicCount,
    returnedRelics.length,
  ]);

  useEffect(() => {
    if (phase !== "glory") {
      return undefined;
    }

    const gloryTimer = window.setTimeout(moveToNextCue, 2400);

    return () => window.clearTimeout(gloryTimer);
  }, [phase]);

  const dimBrightness = 0.72;
  const restoredBrightness = 0.9 + gloryRatio * 0.18;
  const dimSaturation = 0.78;
  const restoredSaturation = 0.94 + gloryRatio * 0.28;
  const gloryOpacity = 0.18 + gloryRatio * 0.58;
  const candleOpacity = 0.34 + gloryRatio * 0.28;

  const sceneClassName = [
    "finale-scene",
    `finale-scene--${phase}`,
    celebrationIsRestored
      ? "finale-scene--restored"
      : "",
    guestIsVisible ? "finale-scene--guest-visible" : "",
    guestIsSeated ? "finale-scene--guest-seated" : "",
    isComplete ? "finale-scene--complete" : "",
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <main
      className={sceneClassName}
      style={{
        "--finale-dim-brightness": dimBrightness,
        "--finale-restored-brightness": restoredBrightness,
        "--finale-dim-saturation": dimSaturation,
        "--finale-restored-saturation": restoredSaturation,
        "--finale-glory-opacity": gloryOpacity,
        "--finale-candle-opacity": candleOpacity,
      }}
    >
      <div className="finale-scene__artwork">
        <img
          className="finale-scene__base"
          src={finale.heroImage}
          alt="The restored birthday ballroom with one empty chair"
        />

        <div
          className="finale-scene__glory"
          aria-hidden="true"
        />

        <div
          className="finale-scene__candlelight"
          aria-hidden="true"
        />

        <div
          className="finale-scene__doorway-shadow"
          aria-hidden="true"
        />

        <img
          className="finale-scene__guest"
          src={finale.uninvitedGuestImage}
          alt="The Uninvited Guest taking the final place at the table"
        />

        <div
          className="finale-scene__relics"
          aria-hidden="true"
        >
          {returnedRelics.map((relic, index) => (
            <img
              key={relic.id}
              className={[
                "finale-relic",
                relic.className,
                index < returnedRelicCount
                  ? "finale-relic--returned"
                  : "",
              ]
                .filter(Boolean)
                .join(" ")}
              src={relic.image}
              alt=""
            />
          ))}
        </div>

        <div
          className="finale-scene__confetti"
          aria-hidden="true"
        />

        {phase === "relics" && (
          <p className="finale-scene__interstitial">
            Everything the Guests carried begins to return.
          </p>
        )}

        {phase === "glory" && (
          <div
            className="finale-glory-return"
            aria-live="polite"
          >
            <span className="finale-glory-return__label">
              Glory Returns
            </span>
            <strong className="finale-glory-return__amount">
              {glory}
            </strong>
            <p>
              Every act of hope becomes part of the celebration.
            </p>
          </div>
        )}

        {currentCue?.text && (
          <section
            className="finale-narration"
            aria-live="polite"
          >
            <p>{currentCue.text}</p>

            <button
              type="button"
              className="finale-narration__continue"
              onClick={moveToNextCue}
            >
              Continue
            </button>
          </section>
        )}

        {isComplete && (
          <section className="finale-ending">
            <h1>The Forgotten Birthday</h1>
            <p>No place remained empty.</p>
          </section>
        )}
      </div>
    </main>
  );
}

export default FinaleScene;
