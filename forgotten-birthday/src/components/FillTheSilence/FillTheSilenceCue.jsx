import {
  useMemo,
  useState,
} from "react";

import "./FillTheSilenceCue.css";

function FillTheSilenceCue({
  cue,
  onComplete,
}) {
  const {
    eyebrow =
      "A Quiet Question",

    title =
      "Fill the Silence",

    prompt =
      "",

    instructions =
      "Choose privately.",

    privacyMessage =
      "Your answer will remain hidden.",

    options =
      [],

    confirmLabel =
      "Place My Answer",

    completeLabel =
      "Answer Placed",

    completionNarration =
      "",

    glory =
      0,
  } = cue;

  const [
    selectedOptionId,
    setSelectedOptionId,
  ] = useState(null);

  const [
    submitted,
    setSubmitted,
  ] = useState(false);

  const [
    isCompleting,
    setIsCompleting,
  ] = useState(false);

  const selectedOption =
    useMemo(
      () =>
        options.find(
          (option) =>
            option.id ===
            selectedOptionId,
        ) ?? null,
      [
        options,
        selectedOptionId,
      ],
    );

  function handleSelect(
    optionId,
  ) {
    if (
      submitted ||
      isCompleting
    ) {
      return;
    }

    setSelectedOptionId(
      optionId,
    );
  }

  function handleSubmit() {
    if (
      !selectedOption ||
      submitted ||
      isCompleting
    ) {
      return;
    }

    setSubmitted(true);

    /*
      The selection remains inside the returned
      result, but it is never displayed on-screen.

      Later, multiplayer can send this result
      privately from each phone.
    */
  }

  function handleContinue() {
    if (
      !submitted ||
      isCompleting
    ) {
      return;
    }

    setIsCompleting(true);

    onComplete({
      cueId:
        cue.id,

      completed:
        true,

      outcomeId:
        "silence-filled",

      selectedOptionId:
        selectedOption?.id ??
        null,

      hidden:
        true,

      narration:
        completionNarration,

      glory:
        selectedOption?.glory ??
        glory,

      metadata:
        {
          privateSelection:
            selectedOption?.id ??
            null,
        },
    });
  }

  if (
    options.length === 0
  ) {
    return (
      <section className="fill-the-silence">
        <div className="fill-the-silence__card">
          <p className="fill-the-silence__error">
            No private responses were provided.
          </p>

          <button
            type="button"
            className="fill-the-silence__continue"
            onClick={() =>
              onComplete({
                cueId:
                  cue.id,

                completed:
                  false,

                outcomeId:
                  "missing-options",

                selectedOptionId:
                  null,

                hidden:
                  true,

                narration:
                  "",

                glory:
                  0,
              })
            }
          >
            Continue
          </button>
        </div>
      </section>
    );
  }

  return (
    <section className="fill-the-silence">
      <div className="fill-the-silence__card">
        {!submitted ? (
          <>
            <header className="fill-the-silence__header">
              <p className="fill-the-silence__eyebrow">
                {eyebrow}
              </p>

              <h2 className="fill-the-silence__title">
                {title}
              </h2>

              {prompt && (
                <p className="fill-the-silence__prompt">
                  {prompt}
                </p>
              )}

              {instructions && (
                <p className="fill-the-silence__instructions">
                  {instructions}
                </p>
              )}
            </header>

            <div className="fill-the-silence__privacy">
              <span
                className="fill-the-silence__privacy-symbol"
                aria-hidden="true"
              >
                ◌
              </span>

              <p>
                {privacyMessage}
              </p>
            </div>

            <div
              className="fill-the-silence__options"
              role="radiogroup"
              aria-label={title}
            >
              {options.map(
                (
                  option,
                  index,
                ) => {
                  const isSelected =
                    option.id ===
                    selectedOptionId;

                  return (
                    <button
                      key={
                        option.id
                      }
                      type="button"
                      role="radio"
                      aria-checked={
                        isSelected
                      }
                      className={[
                        "fill-the-silence__option",

                        isSelected
                          ? "fill-the-silence__option--selected"
                          : "",
                      ]
                        .filter(
                          Boolean,
                        )
                        .join(" ")}
                      onClick={() =>
                        handleSelect(
                          option.id,
                        )
                      }
                    >
                      <span className="fill-the-silence__option-number">
                        {String(
                          index + 1,
                        ).padStart(
                          2,
                          "0",
                        )}
                      </span>

                      <span className="fill-the-silence__option-label">
                        {option.label}
                      </span>

                      <span
                        className="fill-the-silence__option-mark"
                        aria-hidden="true"
                      >
                        {isSelected
                          ? "●"
                          : "○"}
                      </span>
                    </button>
                  );
                },
              )}
            </div>

            <button
              type="button"
              className="fill-the-silence__submit"
              onClick={
                handleSubmit
              }
              disabled={
                !selectedOption
              }
            >
              {confirmLabel}
            </button>
          </>
        ) : (
          <div className="fill-the-silence__complete">
            <div
              className="fill-the-silence__sealed-mark"
              aria-hidden="true"
            >
              <span />
            </div>

            <p className="fill-the-silence__complete-eyebrow">
              A private answer was placed
            </p>

            <h2 className="fill-the-silence__complete-title">
              Nothing Is Revealed
            </h2>

            <p className="fill-the-silence__complete-copy">
              The Invitation Keeper does not read the answer aloud.
            </p>

            <p className="fill-the-silence__complete-privacy">
              {privacyMessage}
            </p>

            <button
              type="button"
              className="fill-the-silence__continue"
              onClick={
                handleContinue
              }
              disabled={
                isCompleting
              }
            >
              {isCompleting
                ? "Folding the Invitation..."
                : completeLabel}
            </button>
          </div>
        )}
      </div>
    </section>
  );
}

export default FillTheSilenceCue;