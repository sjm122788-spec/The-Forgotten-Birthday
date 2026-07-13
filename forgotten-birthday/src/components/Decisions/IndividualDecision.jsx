import { useState } from "react";

import "./IndividualDecision.css";

function IndividualDecision({
  cue,
  onComplete,
}) {
  const {
    eyebrow = "Individual Guest Moment",
    title = "A Choice for One Guest",
    prompt = "",
    instructions = "Choose the response that feels right.",
    selectedGuestName = "",
    options = [],
    confirmLabel = "Confirm Choice",
  } = cue;

  const [selectedOptionId, setSelectedOptionId] = useState(null);

  const selectedOption = options.find(
    (option) => option.id === selectedOptionId,
  );

  function handleSubmit(event) {
    event.preventDefault();

    if (!selectedOption) {
      return;
    }

    onComplete(selectedOption);
  }

  return (
    <section className="individual-decision">
      <div className="individual-decision__card">
        <header className="individual-decision__header">
          <p className="individual-decision__eyebrow">
            {eyebrow}
          </p>

          <h2 className="individual-decision__title">
            {title}
          </h2>

          {selectedGuestName && (
            <p className="individual-decision__guest">
              For {selectedGuestName}
            </p>
          )}
        </header>

        {prompt && (
          <p className="individual-decision__prompt">
            {prompt}
          </p>
        )}

        {instructions && (
          <p className="individual-decision__instructions">
            {instructions}
          </p>
        )}

        <form
          className="individual-decision__form"
          onSubmit={handleSubmit}
        >
          <div
            className="individual-decision__options"
            role="radiogroup"
            aria-label={title}
          >
            {options.map((option) => {
              const isSelected =
                option.id === selectedOptionId;

              return (
                <label
                  key={option.id}
                  className={[
                    "individual-decision__option",
                    isSelected
                      ? "individual-decision__option--selected"
                      : "",
                  ]
                    .filter(Boolean)
                    .join(" ")}
                >
                  <input
                    className="individual-decision__radio"
                    type="radio"
                    name={cue.id || "individual-decision"}
                    value={option.id}
                    checked={isSelected}
                    onChange={() =>
                      setSelectedOptionId(option.id)
                    }
                  />

                  <span
                    className="individual-decision__option-marker"
                    aria-hidden="true"
                  />

                  <span className="individual-decision__option-copy">
                    <span className="individual-decision__option-label">
                      {option.label}
                    </span>

                    {option.description && (
                      <span className="individual-decision__option-description">
                        {option.description}
                      </span>
                    )}
                  </span>
                </label>
              );
            })}
          </div>

          <button
            type="submit"
            className="individual-decision__confirm"
            disabled={!selectedOption}
          >
            {confirmLabel}
          </button>
        </form>
      </div>
    </section>
  );
}

export default IndividualDecision;