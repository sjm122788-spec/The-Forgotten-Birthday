import { useMemo, useState } from "react";

import "./CooperativePuzzleCue.css";

function CooperativePuzzleCue({ cue, onComplete }) {
  const {
    eyebrow = "A Shared Puzzle",
    title = "Restore the Pattern",
    prompt = "",
    instructions = "Work together to choose the candles in the correct order.",
    items = [],
    solution = [],
    successLabel = "The Pattern Is Restored",
    resetLabel = "Try Again",
  } = cue;

  const [selectedIds, setSelectedIds] = useState([]);
  const [attempts, setAttempts] = useState(1);
  const [status, setStatus] = useState("playing");

  const selectedItems = useMemo(
    () =>
      selectedIds
        .map((id) => items.find((item) => item.id === id))
        .filter(Boolean),
    [items, selectedIds],
  );

  function handleSelect(itemId) {
    if (
      status !== "playing" ||
      selectedIds.includes(itemId) ||
      selectedIds.length >= solution.length
    ) {
      return;
    }

    const nextSelectedIds = [...selectedIds, itemId];
    setSelectedIds(nextSelectedIds);

    if (nextSelectedIds.length !== solution.length) {
      return;
    }

    const solved = nextSelectedIds.every(
      (id, index) => id === solution[index],
    );

    setStatus(solved ? "success" : "incorrect");
  }

  function handleReset() {
    setSelectedIds([]);
    setAttempts((current) => current + 1);
    setStatus("playing");
  }

  function handleComplete() {
    if (status !== "success") {
      return;
    }

    onComplete({
      cueId: cue.id,
      completed: true,
      attempts,
      selectedIds,
      outcomeId: "completed",
      narration: cue.successNarration,
      glory: cue.glory ?? 0,
    });
  }

  return (
    <section className="cooperative-puzzle-cue">
      <div className="cooperative-puzzle-cue__card">
        <header className="cooperative-puzzle-cue__header">
          <p className="cooperative-puzzle-cue__eyebrow">{eyebrow}</p>
          <h2 className="cooperative-puzzle-cue__title">{title}</h2>
          {prompt && <p className="cooperative-puzzle-cue__prompt">{prompt}</p>}
          {instructions && (
            <p className="cooperative-puzzle-cue__instructions">
              {instructions}
            </p>
          )}
        </header>

        <div className="cooperative-puzzle-cue__sequence">
          {solution.map((_, index) => {
            const selectedItem = selectedItems[index];

            return (
              <div
                key={`slot-${index}`}
                className={[
                  "cooperative-puzzle-cue__slot",
                  selectedItem
                    ? "cooperative-puzzle-cue__slot--filled"
                    : "",
                ]
                  .filter(Boolean)
                  .join(" ")}
              >
                {selectedItem ? (
                  <>
                    <span className="cooperative-puzzle-cue__slot-symbol">
                      {selectedItem.symbol}
                    </span>
                    <span className="cooperative-puzzle-cue__slot-label">
                      {selectedItem.label}
                    </span>
                  </>
                ) : (
                  <span className="cooperative-puzzle-cue__slot-number">
                    {index + 1}
                  </span>
                )}
              </div>
            );
          })}
        </div>

        <div
          className="cooperative-puzzle-cue__items"
          aria-label="Puzzle choices"
        >
          {items.map((item) => {
            const isSelected = selectedIds.includes(item.id);

            return (
              <button
                key={item.id}
                type="button"
                className={[
                  "cooperative-puzzle-cue__item",
                  isSelected
                    ? "cooperative-puzzle-cue__item--selected"
                    : "",
                ]
                  .filter(Boolean)
                  .join(" ")}
                onClick={() => handleSelect(item.id)}
                disabled={isSelected || status !== "playing"}
              >
                <span className="cooperative-puzzle-cue__item-flame">
                  {item.symbol}
                </span>
                <span className="cooperative-puzzle-cue__item-label">
                  {item.label}
                </span>
                {item.hint && (
                  <span className="cooperative-puzzle-cue__item-hint">
                    {item.hint}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        <div
          className="cooperative-puzzle-cue__status"
          aria-live="polite"
        >
          {status === "incorrect" && (
            <>
              <p>The candles flicker, but the pattern does not hold.</p>
              <button
                type="button"
                className="cooperative-puzzle-cue__action"
                onClick={handleReset}
              >
                {resetLabel}
              </button>
            </>
          )}

          {status === "success" && (
            <>
              <p className="cooperative-puzzle-cue__success">
                {successLabel}
              </p>
              <button
                type="button"
                className="cooperative-puzzle-cue__action"
                onClick={handleComplete}
              >
                Continue
              </button>
            </>
          )}
        </div>
      </div>
    </section>
  );
}

export default CooperativePuzzleCue;