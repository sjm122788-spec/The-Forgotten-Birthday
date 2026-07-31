import { useMemo, useState } from "react";

import "./CooperativePuzzleCue.css";

function CooperativePuzzleCue({ cue, onComplete }) {
  const {
    eyebrow = "A Shared Puzzle",
    title = "Restore the Order",
    prompt = "",
    instructions = "Work together to choose the pieces in the correct order.",
    candles = [],
    items = [],
    solution = [],
    successLabel = "The Pattern Holds",
    resetLabel = "Try Again",
    successNarration = "",
  } = cue;

  const puzzleItems = candles.length > 0 ? candles : items;
  const usesCandles = candles.length > 0;

  const [selectedIds, setSelectedIds] = useState([]);
  const [attempts, setAttempts] = useState(1);
  const [status, setStatus] = useState("playing");

  const selectedItems = useMemo(
    () =>
      selectedIds
        .map((id) => puzzleItems.find((item) => item.id === id))
        .filter(Boolean),
    [puzzleItems, selectedIds],
  );

  const assembledFragments = solution.map((_, index) => {
    const selectedItem = selectedItems[index];

    return selectedItem?.fragment ?? selectedItem?.label ?? null;
  });

  function describeCandle(candle) {
    if (candle.ariaLabel) {
      return candle.ariaLabel;
    }

    const waxHeight = candle.waxHeight ?? 0.5;

    if (waxHeight <= 0.3) {
      return "A candle burned nearly to the base, wax pooled deep around it.";
    }

    if (waxHeight <= 0.6) {
      return "A candle burned partway down, wax beginning to pool.";
    }

    return "A candle barely touched, still standing tall.";
  }

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

    const solved = nextSelectedIds.every((id, index) => id === solution[index]);
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
      outcomeId: "puzzle-solved",
      narration: successNarration,
      glory: cue.glory ?? 0,
    });
  }

  if (puzzleItems.length === 0 || solution.length === 0) {
    return (
      <section className="cooperative-puzzle-cue">
        <div className="cooperative-puzzle-cue__card">
          <p className="cooperative-puzzle-cue__error">
            No puzzle pieces were left for this chapter.
          </p>
        </div>
      </section>
    );
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

        <div className="cooperative-puzzle-cue__sentence" aria-live="polite">
          {assembledFragments.map((fragment, index) => (
            <span
              key={`fragment-${index}`}
              className={[
                "cooperative-puzzle-cue__sentence-piece",
                fragment ? "cooperative-puzzle-cue__sentence-piece--filled" : "",
                status === "incorrect"
                  ? "cooperative-puzzle-cue__sentence-piece--tangled"
                  : "",
              ]
                .filter(Boolean)
                .join(" ")}
            >
              {fragment ?? "..."}
            </span>
          ))}
        </div>

        <div
          className="cooperative-puzzle-cue__row"
          aria-label="The order being assembled"
          style={{
            "--puzzle-slot-count": solution.length,
          }}
        >
          {solution.map((_, index) => {
            const filledItem = selectedItems[index];

            return (
              <div
                key={`slot-${index}`}
                className={[
                  "cooperative-puzzle-cue__slot",
                  filledItem ? "cooperative-puzzle-cue__slot--filled" : "",
                ]
                  .filter(Boolean)
                  .join(" ")}
              >
                <span className="cooperative-puzzle-cue__slot-index">
                  {index + 1}
                </span>
              </div>
            );
          })}
        </div>

        <div
          className={[
            "cooperative-puzzle-cue__shelf",
            usesCandles ? "" : "cooperative-puzzle-cue__shelf--cards",
          ]
            .filter(Boolean)
            .join(" ")}
          aria-label="Waiting puzzle pieces - choose one at a time"
        >
          {puzzleItems.map((item) => {
            const isSelected = selectedIds.includes(item.id);

            if (usesCandles) {
              return (
                <button
                  key={item.id}
                  type="button"
                  className={[
                    "cooperative-puzzle-cue__candle",
                    isSelected ? "cooperative-puzzle-cue__candle--selected" : "",
                  ]
                    .filter(Boolean)
                    .join(" ")}
                  style={{
                    "--wax-height": item.waxHeight ?? 0.5,
                  }}
                  onClick={() => handleSelect(item.id)}
                  disabled={isSelected || status !== "playing"}
                  aria-label={describeCandle(item)}
                >
                  <span
                    className="cooperative-puzzle-cue__glow"
                    aria-hidden="true"
                  />
                  <span
                    className="cooperative-puzzle-cue__flame"
                    aria-hidden="true"
                  />
                  <span
                    className="cooperative-puzzle-cue__wick"
                    aria-hidden="true"
                  />
                  <span
                    className="cooperative-puzzle-cue__body"
                    aria-hidden="true"
                  />
                  <span
                    className="cooperative-puzzle-cue__pool"
                    aria-hidden="true"
                  />
                </button>
              );
            }

            return (
              <button
                key={item.id}
                type="button"
                className={[
                  "cooperative-puzzle-cue__memory-card",
                  isSelected
                    ? "cooperative-puzzle-cue__memory-card--selected"
                    : "",
                ]
                  .filter(Boolean)
                  .join(" ")}
                onClick={() => handleSelect(item.id)}
                disabled={isSelected || status !== "playing"}
              >
                {item.symbol && (
                  <span
                    className="cooperative-puzzle-cue__memory-symbol"
                    aria-hidden="true"
                  >
                    {item.symbol}
                  </span>
                )}
                <span className="cooperative-puzzle-cue__memory-label">
                  {item.label}
                </span>
                {item.hint && (
                  <span className="cooperative-puzzle-cue__memory-hint">
                    {item.hint}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        <div className="cooperative-puzzle-cue__status" aria-live="polite">
          {status === "incorrect" && (
            <>
              <p>The order tangles. Something belongs somewhere else.</p>
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
              <p className="cooperative-puzzle-cue__success">{successLabel}</p>
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
