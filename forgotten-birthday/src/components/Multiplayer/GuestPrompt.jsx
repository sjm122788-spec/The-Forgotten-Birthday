import { useMemo, useState } from "react";

import "./GuestPrompt.css";

export default function GuestPrompt({ prompt, onSubmit, error = "" }) {
  const [selectedOptionId, setSelectedOptionId] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const options = prompt?.payload?.options ?? [];
  const selectedOption = useMemo(
    () => options.find((option) => option.id === selectedOptionId) ?? null,
    [options, selectedOptionId],
  );

  async function handleSubmit(event) {
    event.preventDefault();

    if (!selectedOption || submitting || submitted) {
      return;
    }

    setSubmitting(true);

    try {
      await onSubmit({
        promptId: prompt.id,
        cueId: prompt.cueId,
        responseType: prompt.type,
        responseData: {
          optionId: selectedOption.id,
          label: selectedOption.label,
        },
      });

      setSubmitted(true);
    } finally {
      setSubmitting(false);
    }
  }

  if (submitted) {
    return (
      <section className="guest-prompt">
        <div className="guest-prompt__card guest-prompt__card--submitted">
          <p className="guest-prompt__eyebrow">Your choice is carried onward</p>
          <h1 className="guest-prompt__title">Return to the television</h1>
          <p className="guest-prompt__copy">The story is listening.</p>
        </div>
      </section>
    );
  }

  return (
    <section className="guest-prompt">
      <div className="guest-prompt__card">
        <p className="guest-prompt__eyebrow">{prompt.payload?.eyebrow ?? "The story needs you"}</p>
        <h1 className="guest-prompt__title">{prompt.payload?.title ?? "Choose carefully"}</h1>

        {prompt.payload?.prompt && (
          <p className="guest-prompt__copy">{prompt.payload.prompt}</p>
        )}

        {prompt.payload?.instructions && (
          <p className="guest-prompt__instructions">{prompt.payload.instructions}</p>
        )}

        <form className="guest-prompt__form" onSubmit={handleSubmit}>
          <div className="guest-prompt__options" role="radiogroup" aria-label={prompt.payload?.title}>
            {options.map((option) => {
              const selected = option.id === selectedOptionId;

              return (
                <label
                  key={option.id}
                  className={[
                    "guest-prompt__option",
                    selected ? "guest-prompt__option--selected" : "",
                  ].filter(Boolean).join(" ")}
                >
                  <input
                    type="radio"
                    name={prompt.id}
                    value={option.id}
                    checked={selected}
                    onChange={() => setSelectedOptionId(option.id)}
                    disabled={submitting}
                  />
                  <span className="guest-prompt__option-copy">
                    <strong>{option.label}</strong>
                    {option.description && <span>{option.description}</span>}
                  </span>
                </label>
              );
            })}
          </div>

          {error && <p className="guest-prompt__error">{error}</p>}

          <button type="submit" disabled={!selectedOption || submitting}>
            {submitting ? "Sending your choice..." : prompt.payload?.confirmLabel ?? "Confirm Choice"}
          </button>
        </form>
      </div>
    </section>
  );
}
