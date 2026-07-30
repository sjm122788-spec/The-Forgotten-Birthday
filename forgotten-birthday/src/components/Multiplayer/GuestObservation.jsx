import { useEffect, useMemo, useState } from "react";

import "./GuestObservation.css";

export default function GuestObservation({ prompt, onSubmit, error = "" }) {
  const [submittingClueId, setSubmittingClueId] = useState(null);
  const [localError, setLocalError] = useState("");

  const clues = prompt?.payload?.clues ?? [];
  const foundClueIds =
    prompt?.sharedState?.foundClueIds ??
    prompt?.payload?.foundClueIds ??
    [];

  const foundClueIdSet = useMemo(
    () => new Set(foundClueIds),
    [foundClueIds],
  );

  useEffect(() => {
    setSubmittingClueId(null);
    setLocalError("");
  }, [prompt?.id]);

  useEffect(() => {
    if (submittingClueId && foundClueIdSet.has(submittingClueId)) {
      setSubmittingClueId(null);
    }
  }, [foundClueIdSet, submittingClueId]);

  async function handleClueClick(clue) {
    if (!clue?.id || submittingClueId || foundClueIdSet.has(clue.id)) {
      return;
    }

    setSubmittingClueId(clue.id);
    setLocalError("");

    try {
      await onSubmit({
        promptId: prompt.id,
        cueId: prompt.cueId,
        responseType: "observation",
        responseKey: clue.id,
        responseData: {
          clueId: clue.id,
          label: clue.label,
        },
      });
    } catch (submitError) {
      console.error("Unable to submit observation clue", submitError);
      setLocalError("That clue did not reach the story. Tap it again.");
      setSubmittingClueId(null);
    }
  }

  const allCluesFound =
    clues.length > 0 && foundClueIds.length >= clues.length;

  return (
    <main className="guest-observation">
      <section className="guest-observation__card">
        <header className="guest-observation__header">
          <p className="guest-observation__eyebrow">
            {prompt?.payload?.eyebrow ?? "Shared Observation"}
          </p>
          <h1 className="guest-observation__title">
            {prompt?.payload?.title ?? "Look Carefully"}
          </h1>
          {prompt?.payload?.instructions && (
            <p className="guest-observation__instructions">
              {prompt.payload.instructions}
            </p>
          )}
        </header>

        <div className="guest-observation__scene">
          <img
            className="guest-observation__image"
            src={prompt?.payload?.image}
            alt={prompt?.payload?.imageAlt ?? "Observation scene"}
            draggable="false"
          />

          {clues.map((clue) => {
            const isFound = foundClueIdSet.has(clue.id);
            const isSubmitting = submittingClueId === clue.id;

            return (
              <button
                key={clue.id}
                type="button"
                className={[
                  "guest-observation__hotspot",
                  isFound ? "guest-observation__hotspot--found" : "",
                  isSubmitting ? "guest-observation__hotspot--submitting" : "",
                ]
                  .filter(Boolean)
                  .join(" ")}
                style={{
                  left: `${clue.x}%`,
                  top: `${clue.y}%`,
                  width: `${clue.width ?? 8}%`,
                  height: `${clue.height ?? 8}%`,
                }}
                aria-label={isFound ? `${clue.label} found` : "Search this area"}
                disabled={isFound || Boolean(submittingClueId) || allCluesFound}
                onClick={() => handleClueClick(clue)}
              >
                {isFound && (
                  <span className="guest-observation__found-marker">✓</span>
                )}
                {isSubmitting && !isFound && (
                  <span className="guest-observation__submitting-marker">…</span>
                )}
              </button>
            );
          })}
        </div>

        <div className="guest-observation__status">
          <p>
            <strong>{foundClueIds.length}</strong> of{" "}
            <strong>{clues.length}</strong> clues found
          </p>
          <p>
            {allCluesFound
              ? "All clues have been found. Return to the television."
              : submittingClueId
                ? "The story is checking your discovery..."
                : "Tap anything that seems to remember more than it should."}
          </p>
        </div>

        {(error || localError) && (
          <p className="guest-observation__error">{localError || error}</p>
        )}
      </section>
    </main>
  );
}
