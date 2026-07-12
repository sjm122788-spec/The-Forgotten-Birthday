import { useEffect, useState } from "react";

import NarrationCue from "../Narration/NarrationCue";

function ChapterDirector({
  sequence = [],
  onCompleteChapter,
}) {
  const [currentCueIndex, setCurrentCueIndex] =
    useState(0);

  const currentCue = sequence[currentCueIndex];

  useEffect(() => {
    setCurrentCueIndex(0);
  }, [sequence]);

  function advanceCue() {
    setCurrentCueIndex((currentIndex) => {
      const nextIndex = currentIndex + 1;

      if (nextIndex >= sequence.length) {
        return currentIndex;
      }

      return nextIndex;
    });
  }

  if (!currentCue) {
    return null;
  }

  switch (currentCue.type) {
    case "narration":
      return (
        <NarrationCue
          key={currentCue.id}
          cue={currentCue}
          onAdvance={advanceCue}
        />
      );

    case "chapterComplete":
      onCompleteChapter();
      return null;

    default:
      console.warn(
        `Unsupported chapter cue type: ${currentCue.type}`,
        currentCue,
      );

      return (
        <div className="chapter-director-error">
          Unsupported cue: {currentCue.type}
          <button type="button" onClick={advanceCue}>
            Skip cue
          </button>
        </div>
      );
  }
}

export default ChapterDirector;