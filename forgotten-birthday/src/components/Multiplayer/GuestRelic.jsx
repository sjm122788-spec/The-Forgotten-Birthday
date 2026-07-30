import { useState } from "react";

import "../Relic/RelicRevealCue.css";

export default function GuestRelic({ prompt, onSubmit, error = "" }) {
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [localError, setLocalError] = useState("");

  async function handleCarry() {
    if (submitting || submitted) {
      return;
    }

    setSubmitting(true);
    setLocalError("");

    try {
      await onSubmit({
        promptId: prompt.id,
        cueId: prompt.cueId,
        responseType: "relicReveal",
        responseKey: "final",
        responseData: {
          accepted: true,
          relicId: prompt?.payload?.relicId,
        },
      });

      setSubmitted(true);
    } catch (submitError) {
      console.error("Unable to carry relic", submitError);
      setLocalError("The relic could not find your hand. Try again.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <main className="relic-reveal-cue">
      <section className="relic-reveal-cue__card">
        <p className="relic-reveal-cue__eyebrow">
          {prompt?.payload?.eyebrow ?? "A Story Relic"}
        </p>
        <h1 className="relic-reveal-cue__title">
          {prompt?.payload?.title}
        </h1>

        {prompt?.payload?.image && (
          <div className="relic-reveal-cue__image-wrap">
            <span className="relic-reveal-cue__glow" />
            <img
              className="relic-reveal-cue__image"
              src={prompt.payload.image}
              alt={prompt?.payload?.imageAlt ?? ""}
            />
          </div>
        )}

        {prompt?.payload?.protects && (
          <p className="relic-reveal-cue__protects">
            Protects: {prompt.payload.protects}
          </p>
        )}

        {prompt?.payload?.description && (
          <p className="relic-reveal-cue__description">
            {prompt.payload.description}
          </p>
        )}

        <button
          type="button"
          className="relic-reveal-cue__button"
          onClick={handleCarry}
          disabled={submitting || submitted}
        >
          {submitted
            ? "The light is yours"
            : submitting
              ? "Carrying the light…"
              : prompt?.payload?.continueLabel ?? "Carry It Forward"}
        </button>

        {(error || localError) && (
          <p className="guest-prompt__error">{localError || error}</p>
        )}
      </section>
    </main>
  );
}
