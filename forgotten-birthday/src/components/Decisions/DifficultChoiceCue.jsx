import {
  useMemo,
  useState,
} from "react";

import "./DifficultChoiceCue.css";

function DifficultChoiceCue({
  cue,
  onComplete,
}) {
  const {
    eyebrow =
      "A Difficult Choice",

    title =
      "Choose Carefully",

    prompt =
      "",

    discussion =
      "",

    instructions =
      "There is no perfect answer.",

    options = cue.choices ?? [],

    selectLabel =
      "Choose This",

    confirmLabel =
      "Make This Choice",

    reconsiderLabel =
      "Choose Again",

    waitingLabel =
      "The choice has been made.",

    allowReconsideration =
      true,
  } = cue;

  const [
    selectedOptionId,
    setSelectedOptionId,
  ] = useState(null);

  const [
    isSubmitting,
    setIsSubmitting,
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
    if (isSubmitting) {
      return;
    }

    setSelectedOptionId(
      optionId,
    );
  }

  function handleReconsider() {
    if (
      isSubmitting ||
      !allowReconsideration
    ) {
      return;
    }

    setSelectedOptionId(
      null,
    );
  }

  function handleConfirm() {
    if (
      !selectedOption ||
      isSubmitting
    ) {
      return;
    }

    setIsSubmitting(true);

    const narration =
      selectedOption.narration ??
      selectedOption.outcome ??
      "";

    onComplete({
      cueId:
        cue.id,

      completed:
        true,

      outcomeId:
        selectedOption.id,

      optionId:
        selectedOption.id,

      label:
        selectedOption.label ??
        selectedOption.title ??
        selectedOption.text ??
        selectedOption.id,

      narration,

      glory:
        selectedOption.glory ??
        cue.glory ??
        0,

      visualState:
        selectedOption.visualState ??
        null,

      metadata:
        selectedOption.metadata ??
        null,
    });
  }

  if (
    options.length === 0
  ) {
    return (
      <section className="difficult-choice-cue">
        <div className="difficult-choice-cue__card">
          <p className="difficult-choice-cue__error">
            No choices were provided.
          </p>

          <button
            type="button"
            className="difficult-choice-cue__confirm"
            onClick={() =>
              onComplete({
                cueId:
                  cue.id,

                completed:
                  false,

                outcomeId:
                  "missing-options",

                optionId:
                  null,

                narration:
                  "",

                glory:
                  0,

                visualState:
                  null,
              })
            }
          >
            Skip Choice
          </button>
        </div>
      </section>
    );
  }

  return (
    <section className="difficult-choice-cue">
      <div className="difficult-choice-cue__card">
        <header className="difficult-choice-cue__header">
          <p className="difficult-choice-cue__eyebrow">
            {eyebrow}
          </p>

          <h2 className="difficult-choice-cue__title">
            {title}
          </h2>

          {prompt && (
            <p className="difficult-choice-cue__prompt">
              {prompt}
            </p>
          )}

          {discussion && (
            <p className="difficult-choice-cue__discussion">
              {discussion}
            </p>
          )}

          {instructions && (
            <p className="difficult-choice-cue__instructions">
              {instructions}
            </p>
          )}
        </header>

        <div
          className="difficult-choice-cue__options"
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

              const optionLabel =
                option.label ??
                option.title ??
                option.text ??
                `Choice ${
                  index + 1
                }`;

              const optionDescription =
                option.description ??
                option.prompt ??
                "";

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
                    "difficult-choice-cue__option",

                    isSelected
                      ? "difficult-choice-cue__option--selected"
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
                  disabled={
                    isSubmitting
                  }
                >
                  <span className="difficult-choice-cue__option-number">
                    {String(
                      index + 1,
                    ).padStart(
                      2,
                      "0",
                    )}
                  </span>

                  <span className="difficult-choice-cue__option-copy">
                    <span className="difficult-choice-cue__option-label">
                      {
                        optionLabel
                      }
                    </span>

                    {optionDescription && (
                      <span className="difficult-choice-cue__option-description">
                        {
                          optionDescription
                        }
                      </span>
                    )}
                  </span>

                  <span
                    className="difficult-choice-cue__option-marker"
                    aria-hidden="true"
                  >
                    {isSelected
                      ? "Chosen"
                      : selectLabel}
                  </span>
                </button>
              );
            },
          )}
        </div>

        {selectedOption && (
          <div className="difficult-choice-cue__confirmation">
            <div className="difficult-choice-cue__selected-summary">
              <p className="difficult-choice-cue__selected-label">
                Your choice
              </p>

              <p className="difficult-choice-cue__selected-value">
                {selectedOption.label ??
                  selectedOption.title ??
                  selectedOption.text}
              </p>
            </div>

            <div className="difficult-choice-cue__actions">
              {allowReconsideration && (
                <button
                  type="button"
                  className="difficult-choice-cue__reconsider"
                  onClick={
                    handleReconsider
                  }
                  disabled={
                    isSubmitting
                  }
                >
                  {
                    reconsiderLabel
                  }
                </button>
              )}

              <button
                type="button"
                className="difficult-choice-cue__confirm"
                onClick={
                  handleConfirm
                }
                disabled={
                  isSubmitting
                }
              >
                {isSubmitting
                  ? waitingLabel
                  : confirmLabel}
              </button>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}

export default DifficultChoiceCue;