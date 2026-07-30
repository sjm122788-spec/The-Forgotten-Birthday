import { useMemo, useState } from "react";

import "./CooperativePuzzleCue.css";

/*
  The Candle Keeper's puzzle:

  A shelf of candles, each burned to a different height, sits in
  front of the player. Every candle secretly holds one fragment of
  a single forgotten birthday wish — but the words stay hidden
  until a candle is placed in the sentence row.

  There is exactly one rule, given once in the instructions: the
  candle that has waited longest speaks first. Nothing in the
  shelf tells the player the order in words — only the wax itself
  does (how low it has burned, how much has pooled at the base).

  Getting the order right assembles the wish into something whole.
  Getting it wrong assembles it into something that reads as
  tangled or unfinished — which doubles as the puzzle's only
  feedback, no pass/fail marker required.
*/
function CooperativePuzzleCue({ cue, onComplete }) {
  const {
    eyebrow = "The Candle Keeper",
    title = "Hear the Forgotten Wish",
    prompt = "",
    instructions =
      "Some of these candles have waited far longer than others. Look closely at how low they've burned — the ones who have waited longest speak first.",
    candles = [],
    solution = [],
    successLabel = "The Wish Is Finally Heard",
    resetLabel = "Let the Wax Settle Again",
    successNarration = "",
  } = cue;

  const [selectedIds, setSelectedIds] = useState([]);
  const [attempts, setAttempts] = useState(1);
  const [status, setStatus] = useState("playing");

  const selectedCandles = useMemo(
    () =>
      selectedIds
        .map((id) => candles.find((candle) => candle.id === id))
        .filter(Boolean),
    [candles, selectedIds],
  );

  const assembledFragments = solution.map(
    (_, index) => selectedCandles[index]?.fragment ?? null,
  );

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

  function handleSelect(candleId) {
    if (
      status !== "playing" ||
      selectedIds.includes(candleId) ||
      selectedIds.length >= solution.length
    ) {
      return;
    }

    const nextSelectedIds = [...selectedIds, candleId];
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
      outcomeId: "wish-heard",
      narration: successNarration,
      glory: cue.glory ?? 0,
    });
  }

  if (candles.length === 0 || solution.length === 0) {
    return (
      <section className="cooperative-puzzle-cue">
        <div className="cooperative-puzzle-cue__card">
          <p className="cooperative-puzzle-cue__error">
            No candles were left for this chapter.
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
            <p className="cooperative-puzzle-cue__instructions">{instructions}</p>
          )}
        </header>

        <div className="cooperative-puzzle-cue__sentence" aria-live="polite">
          {assembledFragments.map((fragment, index) => (
            <span
              key={`fragment-${index}`}
              className={[
                "cooperative-puzzle-cue__sentence-piece",
                fragment
                  ? "cooperative-puzzle-cue__sentence-piece--filled"
                  : "",
                status === "incorrect"
                  ? "cooperative-puzzle-cue__sentence-piece--tangled"
                  : "",
              ]
                .filter(Boolean)
                .join(" ")}
            >
              {fragment ?? "···"}
            </span>
          ))}
        </div>

        <div
          className="cooperative-puzzle-cue__row"
          aria-label="The sentence being assembled"
        >
          {solution.map((_, index) => {
            const filledCandle = selectedCandles[index];

            return (
              <div
                key={`slot-${index}`}
                className={[
                  "cooperative-puzzle-cue__slot",
                  filledCandle
                    ? "cooperative-puzzle-cue__slot--filled"
                    : "",
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
          className="cooperative-puzzle-cue__shelf"
          aria-label="Waiting candles — choose one at a time"
        >
          {candles.map((candle) => {
            const isSelected = selectedIds.includes(candle.id);

            return (
              <button
                key={candle.id}
                type="button"
                className={[
                  "cooperative-puzzle-cue__candle",
                  isSelected
                    ? "cooperative-puzzle-cue__candle--selected"
                    : "",
                ]
                  .filter(Boolean)
                  .join(" ")}
                style={{
                  "--wax-height": candle.waxHeight ?? 0.5,
                }}
                onClick={() => handleSelect(candle.id)}
                disabled={isSelected || status !== "playing"}
                aria-label={describeCandle(candle)}
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
          })}
        </div>

        <div className="cooperative-puzzle-cue__status" aria-live="polite">
          {status === "incorrect" && (
            <>
              <p>The wish comes out tangled. Something is out of order.</p>
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