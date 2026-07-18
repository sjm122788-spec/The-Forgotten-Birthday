import { useMemo, useState } from "react";

import "./GiftSelectionCue.css";

function GiftSelectionCue({
  cue,
  onComplete,
}) {
  const [selectedGiftIds, setSelectedGiftIds] =
    useState([]);

  const selectedGiftIdSet = useMemo(
    () => new Set(selectedGiftIds),
    [selectedGiftIds],
  );

  const allGiftsSelected =
    selectedGiftIds.length ===
    cue.gifts.length;

  function handleSelectGift(gift) {
    if (selectedGiftIdSet.has(gift.id)) {
      return;
    }

    setSelectedGiftIds((currentIds) => [
      ...currentIds,
      gift.id,
    ]);
  }

  function handleContinue() {
    if (!allGiftsSelected) {
      return;
    }

    onComplete?.({
      completed: true,
      selectedGiftIds,
      outcomeId:
        cue.outcomeId ??
        "gift-selection-complete",
      narration:
        cue.successNarration ?? "",
      glory: cue.glory ?? 0,
    });
  }

  return (
    <section className="gift-selection">
      <div className="gift-selection__panel">
        {cue.eyebrow && (
          <p className="gift-selection__eyebrow">
            {cue.eyebrow}
          </p>
        )}

        <h2 className="gift-selection__title">
          {cue.title}
        </h2>

        {cue.prompt && (
          <p className="gift-selection__prompt">
            {cue.prompt}
          </p>
        )}

        {cue.instructions && (
          <p className="gift-selection__instructions">
            {cue.instructions}
          </p>
        )}

        <div className="gift-selection__grid">
          {cue.gifts.map((gift) => {
            const isSelected =
              selectedGiftIdSet.has(gift.id);

            return (
              <button
                key={gift.id}
                className={[
                  "gift-selection__gift",
                  isSelected
                    ? "gift-selection__gift--selected"
                    : "",
                ]
                  .filter(Boolean)
                  .join(" ")}
                type="button"
                disabled={isSelected}
                onClick={() =>
                  handleSelectGift(gift)
                }
              >
                <span className="gift-selection__image-frame">
                  <img
                    className="gift-selection__image"
                    src={gift.image}
                    alt={gift.imageAlt ?? gift.label}
                  />
                </span>

                <span className="gift-selection__gift-copy">
                  <strong className="gift-selection__gift-label">
                    {gift.label}
                  </strong>

                  {gift.description && (
                    <span className="gift-selection__gift-description">
                      {gift.description}
                    </span>
                  )}

                  {isSelected && gift.reveal && (
                    <span className="gift-selection__reveal">
                      {gift.reveal}
                    </span>
                  )}
                </span>
              </button>
            );
          })}
        </div>

        <div className="gift-selection__progress">
          {selectedGiftIds.length} of{" "}
          {cue.gifts.length} gifts remembered
        </div>

        <button
          className="gift-selection__continue"
          type="button"
          disabled={!allGiftsSelected}
          onClick={handleContinue}
        >
          {cue.continueLabel ??
            "Finish the Gifts"}
        </button>
      </div>
    </section>
  );
}

export default GiftSelectionCue;