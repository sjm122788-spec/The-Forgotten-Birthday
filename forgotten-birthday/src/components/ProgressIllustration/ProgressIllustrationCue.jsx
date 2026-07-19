import {
  useEffect,
  useRef,
  useState,
} from "react";

import "./ProgressIllustrationCue.css";

function ProgressIllustrationCue({
  cue,
  onComplete,
}) {
  const {
    eyebrow =
      "A Shared Offering",

    title =
      "Help the Illustration Grow",

    prompt =
      "",

    instructions =
      "",

    frames =
      [],

    startingFrame =
      0,

    contributeLabel =
      "Offer a Little Help",

    declineLabel =
      "Hold Back for Now",

    continueLabel =
      "Continue",

    completionLabel =
      "The Illustration Comes Alive",

    completionNarration =
      "",

    contributionGlory =
      1,

    maximumSharedGlory =
      5,

    previewMode =
      true,

    transitionDuration =
      650,
  } = cue;

  const safeStartingFrame =
    Math.min(
      Math.max(startingFrame, 0),
      Math.max(frames.length - 1, 0),
    );

  const [
    currentFrameIndex,
    setCurrentFrameIndex,
  ] = useState(
    safeStartingFrame,
  );

  const [
    previousFrameIndex,
    setPreviousFrameIndex,
  ] = useState(null);

  const [
    contributions,
    setContributions,
  ] = useState(0);

  const [
    hasChosen,
    setHasChosen,
  ] = useState(false);

  const [
    isComplete,
    setIsComplete,
  ] = useState(false);

  const [
    isTransitioning,
    setIsTransitioning,
  ] = useState(false);

  const [
    burstId,
    setBurstId,
  ] = useState(0);

  const transitionTimeoutRef =
    useRef(null);

  const autoGrowthIntervalRef =
    useRef(null);

  const currentFrame =
    frames[currentFrameIndex];

  const previousFrame =
    previousFrameIndex === null
      ? null
      : frames[previousFrameIndex];

  useEffect(() => {
    return () => {
      window.clearTimeout(
        transitionTimeoutRef.current,
      );

      window.clearInterval(
        autoGrowthIntervalRef.current,
      );
    };
  }, []);

  function moveToFrame(
    nextFrameIndex,
  ) {
    const clampedFrameIndex =
      Math.min(
        Math.max(nextFrameIndex, 0),
        Math.max(
          frames.length - 1,
          0,
        ),
      );

    if (
      clampedFrameIndex ===
      currentFrameIndex
    ) {
      return;
    }

    window.clearTimeout(
      transitionTimeoutRef.current,
    );

    setPreviousFrameIndex(
      currentFrameIndex,
    );

    setCurrentFrameIndex(
      clampedFrameIndex,
    );

    setBurstId(
      (current) =>
        current + 1,
    );

    setIsTransitioning(true);

    transitionTimeoutRef.current =
      window.setTimeout(() => {
        setPreviousFrameIndex(
          null,
        );

        setIsTransitioning(
          false,
        );
      }, transitionDuration);
  }

  function beginGrowthSequence() {
    window.clearInterval(
      autoGrowthIntervalRef.current,
    );

    let nextFrameIndex =
      currentFrameIndex + 1;

    autoGrowthIntervalRef.current =
      window.setInterval(() => {
        if (
          nextFrameIndex >=
          frames.length
        ) {
          window.clearInterval(
            autoGrowthIntervalRef.current,
          );

          setIsComplete(true);

          return;
        }

        moveToFrame(
          nextFrameIndex,
        );

        nextFrameIndex += 1;
      }, transitionDuration + 180);
  }

  function handleContribute() {
    if (
      hasChosen ||
      frames.length === 0
    ) {
      return;
    }

    setHasChosen(true);

    setContributions(1);

    /*
      V1 uses a single local contribution to demonstrate
      the full interaction on the host screen.

      During the multiplayer pass, this can instead respond
      to contribution totals arriving from player phones.
    */
    if (previewMode) {
      beginGrowthSequence();

      return;
    }

    moveToFrame(
      currentFrameIndex + 1,
    );
  }

  function handleDecline() {
    if (hasChosen) {
      return;
    }

    setHasChosen(true);
    setContributions(0);
    setIsComplete(true);
  }

  function handleComplete() {
    if (!isComplete) {
      return;
    }

    const glory =
      Math.min(
        contributions *
          contributionGlory,
        maximumSharedGlory,
      );

    onComplete({
      cueId:
        cue.id,

      completed:
        true,

      contributed:
        contributions > 0,

      contributions,

      frameIndex:
        currentFrameIndex,

      finalFrameId:
        currentFrame?.id ??
        null,

      outcomeId:
        contributions > 0
          ? "contributed"
          : "withheld",

      narration:
        completionNarration,

      glory,
    });
  }

  if (frames.length === 0) {
    return (
      <section className="progress-illustration-cue">
        <div className="progress-illustration-cue__card">
          <p className="progress-illustration-cue__error">
            No illustration frames were provided.
          </p>

          <button
            type="button"
            className="progress-illustration-cue__continue"
            onClick={() =>
              onComplete({
                cueId:
                  cue.id,

                completed:
                  false,

                outcomeId:
                  "missing-frames",

                narration:
                  "",

                glory:
                  0,
              })
            }
          >
            Skip Interaction
          </button>
        </div>
      </section>
    );
  }

  return (
    <section className="progress-illustration-cue">
      <div className="progress-illustration-cue__card">
        <header className="progress-illustration-cue__header">
          <p className="progress-illustration-cue__eyebrow">
            {eyebrow}
          </p>

          <h2 className="progress-illustration-cue__title">
            {title}
          </h2>

          {prompt && (
            <p className="progress-illustration-cue__prompt">
              {prompt}
            </p>
          )}

          {instructions && (
            <p className="progress-illustration-cue__instructions">
              {instructions}
            </p>
          )}
        </header>

        <div
          className={[
            "progress-illustration-cue__stage",

            isTransitioning
              ? "progress-illustration-cue__stage--transitioning"
              : "",

            isComplete
              ? "progress-illustration-cue__stage--complete"
              : "",
          ]
            .filter(Boolean)
            .join(" ")}
        >
          <div className="progress-illustration-cue__light" />

          {previousFrame && (
            <img
              key={`previous-${previousFrame.id ?? previousFrameIndex}`}
              className="progress-illustration-cue__image progress-illustration-cue__image--previous"
              src={
                previousFrame.image
              }
              alt=""
              aria-hidden="true"
            />
          )}

          <img
            key={`current-${currentFrame?.id ?? currentFrameIndex}`}
            className="progress-illustration-cue__image progress-illustration-cue__image--current"
            src={
              currentFrame.image
            }
            alt={
              currentFrame.alt ??
              title
            }
          />

          {burstId > 0 && (
            <div
              key={burstId}
              className="progress-illustration-cue__burst"
              aria-hidden="true"
            >
              {Array.from(
                {
                  length: 12,
                },
                (_, index) => (
                  <span
                    key={index}
                    style={{
                      "--particle-index":
                        index,
                    }}
                  />
                ),
              )}
            </div>
          )}

          <div
            className="progress-illustration-cue__drops"
            aria-hidden="true"
          >
            <span />
            <span />
            <span />
          </div>
        </div>

        {!hasChosen && (
          <div className="progress-illustration-cue__choices">
            <button
              type="button"
              className="progress-illustration-cue__choice progress-illustration-cue__choice--contribute"
              onClick={
                handleContribute
              }
            >
              {contributeLabel}
            </button>

            <button
              type="button"
              className="progress-illustration-cue__choice progress-illustration-cue__choice--decline"
              onClick={
                handleDecline
              }
            >
              {declineLabel}
            </button>
          </div>
        )}

        {hasChosen &&
          !isComplete && (
            <p
              className="progress-illustration-cue__waiting"
              aria-live="polite"
            >
              The illustration is
              responding to the care
              it received…
            </p>
          )}

        {isComplete && (
          <div
            className="progress-illustration-cue__completion"
            aria-live="polite"
          >
            <p className="progress-illustration-cue__completion-label">
              {contributions > 0
                ? completionLabel
                : "The Garden Waits"}
            </p>

            <button
              type="button"
              className="progress-illustration-cue__continue"
              onClick={
                handleComplete
              }
            >
              {continueLabel}
            </button>
          </div>
        )}
      </div>
    </section>
  );
}

export default ProgressIllustrationCue;