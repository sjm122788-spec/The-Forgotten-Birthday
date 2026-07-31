import { useState } from "react";

import "./GuestReward.css";

export default function GuestReward({ prompt, onAcknowledge }) {
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [localError, setLocalError] = useState("");

  const rewardKind = prompt?.payload?.rewardKind ?? "glory";
  const glory = Number(prompt?.payload?.glory ?? 0);
  const title =
    prompt?.payload?.title ??
    (rewardKind === "relic" ? "Relic Restored" : "Glory Restored");
  const message =
    prompt?.payload?.message ??
    (rewardKind === "relic"
      ? "A little more wonder returns to the room."
      : "The celebration grows brighter.");

  async function handleAcknowledge() {
    if (submitting || submitted) {
      return;
    }

    setSubmitting(true);
    setLocalError("");

    try {
      await onAcknowledge?.();
      setSubmitted(true);
    } catch (error) {
      console.error("Unable to acknowledge reward", error);
      setLocalError("The light did not return to the story. Try again.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <main className="guest-reward">
      <div className="guest-reward__glow" />
      <div className="guest-reward__pulse" />
      <div className="guest-reward__sparkles" aria-hidden="true">
        <span>✦</span>
        <span>✧</span>
        <span>✦</span>
        <span>✧</span>
        <span>✦</span>
      </div>

      <section className="guest-reward__card" aria-live="polite">
        <p className="guest-reward__eyebrow">
          {rewardKind === "relic" ? "Relic Restored" : "Glory Restored"}
        </p>
        <div className="guest-reward__sigil" aria-hidden="true">
          ✨
        </div>
        <h1 className="guest-reward__title">{title}</h1>

        {rewardKind === "glory" && (
          <p className="guest-reward__amount">+{glory} Glory</p>
        )}

        <p className="guest-reward__message">{message}</p>

        <button
          type="button"
          className="guest-reward__button"
          onClick={handleAcknowledge}
          disabled={submitting || submitted}
        >
          {submitted
            ? "Returning..."
            : submitting
              ? "Returning..."
              : "Return to the Story"}
        </button>

        {localError && <p className="guest-reward__error">{localError}</p>}
      </section>
    </main>
  );
}
