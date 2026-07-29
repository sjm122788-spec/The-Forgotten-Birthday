import { useMemo, useState } from "react";
import "./GuestObservation.css";

export default function GuestObservation({ prompt, onSubmit, error = "" }) {
  const [submittingClueIds, setSubmittingClueIds] = useState([]);

  const clues = Array.isArray(prompt?.payload?.clues) ? prompt.payload.clues : [];
  const foundClueIds = useMemo(
    () => new Set(Array.isArray(prompt?.payload?.foundClueIds) ? prompt.payload.foundClueIds : []),
    [prompt],
  );

  const foundCount = clues.filter((clue) => foundClueIds.has(clue.id)).length;
  const remainingClues = clues.filter((clue) => !foundClueIds.has(clue.id));

  async function handleHotspotClick(clueId) {
    if (!clueId || foundClueIds.has(clueId) || submittingClueIds.includes(clueId)) {
      return;
    }

    setSubmittingClueIds((current) => [...current, clueId]);

    try {
      await onSubmit({
        promptId: prompt.id,
        cueId: prompt.cueId,
        responseType: prompt.type,
        responseData: { clueId },
      });
    } finally {
      setSubmittingClueIds((current) => current.filter((id) => id !== clueId));
    }
  }

  return (
    <main className="guest-observation">
      <section className="guest-observation__card">
        <p className="guest-observation__eyebrow">Observe the scene</p>
        <h1 className="guest-observation__title">{prompt.payload?.title ?? "Look carefully"}</h1>
        {prompt.payload?.instructions ? (
          <p className="guest-observation__copy">{prompt.payload.instructions}</p>
        ) : (
          <p className="guest-observation__copy">Tap any hotspot to share what you found.</p>
        )}

        <div className="guest-observation__scene">
          <img
            className="guest-observation__image"
            src={prompt.payload?.image}
            alt={prompt.payload?.imageAlt ?? "Observation scene"}
            draggable="false"
          />

          {clues.map((clue) => {
            const isFound = foundClueIds.has(clue.id);
            const isSubmitting = submittingClueIds.includes(clue.id);

            return (
              <button
                key={clue.id}
                type="button"
                className={[
                  "guest-observation__hotspot",
                  isFound ? "guest-observation__hotspot--found" : "",
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
                    : `Submit ${clue.label}`
                }
                disabled={isFound || isSubmitting}
                onClick={() => handleHotspotClick(clue.id)}
              >
                {isFound && <span>✓</span>}
                {isSubmitting && <span>...</span>}
              </button>
            );
          })}
        </div>

        <aside className="guest-observation__panel">
          <div className="guest-observation__status">
            <span>{foundCount}</span>
            <span>of</span>
            <span>{clues.length}</span>
          </div>
          <p className="guest-observation__hint">
            {remainingClues.length > 0
              ? `Find ${remainingClues.length} more clue${remainingClues.length === 1 ? "" : "s"}.`
              : "Waiting for the host to continue the story."}
          </p>
          {error && <p className="guest-observation__error">{error}</p>}
        </aside>
      </section>
    </main>
  );
}
