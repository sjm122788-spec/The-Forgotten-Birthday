import { useMemo, useState } from "react";
import "./ObservationCue.css";

export default function ObservationCue({
  cue,
  onComplete,
}) {
  const {
    title = "Look Carefully",
    instructions = "Search the illustration for anything unusual.",
    image,
    clues = [],
    allowEarlyFinish = true,
    completeLabel = "Finish Looking",
  } = cue;

  const [foundClueIds, setFoundClueIds] = useState([]);

  const allCluesFound =
    clues.length > 0 && foundClueIds.length === clues.length;

  const foundClues = useMemo(
    () => clues.filter((clue) => foundClueIds.includes(clue.id)),
    [clues, foundClueIds]
  );

  function handleHotspotClick(clueId) {
    setFoundClueIds((currentIds) => {
      if (currentIds.includes(clueId)) {
        return currentIds;
      }

      return [...currentIds, clueId];
    });
  }

  function handleComplete() {
    onComplete({
      cueId: cue.id,
      foundClueIds,
      missedClueIds: clues
        .filter((clue) => !foundClueIds.includes(clue.id))
        .map((clue) => clue.id),
      foundAllClues: allCluesFound,
      foundCount: foundClueIds.length,
      totalClues: clues.length,
    });
  }

  if (!image) {
    return (
      <section className="observation-cue observation-cue--error">
        <h2>Observation image missing</h2>
        <p>This observation cue does not have an image configured.</p>

        <button
          type="button"
          className="observation-cue__complete-button"
          onClick={handleComplete}
        >
          Continue
        </button>
      </section>
    );
  }

  return (
    <section className="observation-cue">
      <header className="observation-cue__header">
        <p className="observation-cue__eyebrow">
          Shared Observation
        </p>

        <h2 className="observation-cue__title">
          {title}
        </h2>

        <p className="observation-cue__instructions">
          {instructions}
        </p>
      </header>

      <div className="observation-cue__layout">
        <div className="observation-cue__scene">
          <img
            className="observation-cue__image"
            src={image}
            alt={cue.imageAlt || "Observation scene"}
            draggable="false"
          />

          {clues.map((clue) => {
            const isFound = foundClueIds.includes(clue.id);

            return (
              <button
                key={clue.id}
                type="button"
                className={[
                  "observation-cue__hotspot",
                  isFound
                    ? "observation-cue__hotspot--found"
                    : "",
                ]
                  .filter(Boolean)
                  .join(" ")}
                style={{
                  left: `${clue.x}%`,
                  top: `${clue.y}%`,
                  width: `${clue.width ?? 8}%`,
                  height: `${clue.height ?? 8}%`,
                }}
                aria-label={
                  isFound
                    ? `${clue.label} found`
                    : `Search this area`
                }
                disabled={isFound}
                onClick={() => handleHotspotClick(clue.id)}
              >
                {isFound && (
                  <span className="observation-cue__found-marker">
                    ✓
                  </span>
                )}
              </button>
            );
          })}
        </div>

        <aside className="observation-cue__clue-panel">
          <h3>Things to Find</h3>

          <ul className="observation-cue__clue-list">
            {clues.map((clue) => {
              const isFound = foundClueIds.includes(clue.id);

              return (
                <li
                  key={clue.id}
                  className={
                    isFound
                      ? "observation-cue__clue observation-cue__clue--found"
                      : "observation-cue__clue"
                  }
                >
                  <span
                    className="observation-cue__clue-status"
                    aria-hidden="true"
                  >
                    {isFound ? "✓" : "?"}
                  </span>

                  <span>
                    {isFound ? clue.label : clue.hiddenLabel || "Something hidden"}
                  </span>
                </li>
              );
            })}
          </ul>

          <p className="observation-cue__progress">
            {foundClues.length} of {clues.length} found
          </p>

          {(allowEarlyFinish || allCluesFound) && (
            <button
              type="button"
              className="observation-cue__complete-button"
              onClick={handleComplete}
            >
              {allCluesFound
                ? "All Clues Found"
                : completeLabel}
            </button>
          )}
        </aside>
      </div>
    </section>
  );
}