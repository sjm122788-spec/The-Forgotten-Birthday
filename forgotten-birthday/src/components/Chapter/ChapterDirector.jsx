import { useEffect, useState } from "react";

import NarrationCue from "../Narration/NarrationCue";
import GroupDecision from "../Decisions/GroupDecision";
import IndividualDecision from "../Decisions/IndividualDecision";
import ObservationCue from "../Observation/ObservationCue";
import DiceCue from "../Dice/DiceCue";

function ChapterDirector({
  sequence = [],
  onCompleteChapter,
}) {
  const [currentCueIndex, setCurrentCueIndex] = useState(0);
  const [decisionOutcome, setDecisionOutcome] = useState(null);

  const currentCue = sequence[currentCueIndex];

  useEffect(() => {
    setCurrentCueIndex(0);
    setDecisionOutcome(null);
  }, [sequence]);

  useEffect(() => {
    if (currentCue?.type === "chapterComplete") {
      onCompleteChapter();
    }
  }, [currentCue, onCompleteChapter]);

  function advanceCue() {
    setCurrentCueIndex((currentIndex) => {
      const nextIndex = currentIndex + 1;

      if (nextIndex >= sequence.length) {
        return currentIndex;
      }

      return nextIndex;
    });
  }

  function handleGroupDecision(option) {
    setDecisionOutcome({
      id: `${currentCue.id}-${option.id}-outcome`,
      type: "narration",
      text: option.outcome,
      decisionId: currentCue.id,
      optionId: option.id,
    });
  }

  function handleIndividualDecision(option) {
    setDecisionOutcome({
      id: `${currentCue.id}-${option.id}-outcome`,
      type: "narration",
      text: option.outcome,
      decisionId: currentCue.id,
      optionId: option.id,
    });
  }

  function handleDiceComplete(result) {
    setDecisionOutcome({
      id: `${currentCue.id}-${result.outcomeId}-outcome`,
      type: "narration",
      text: result.narration,
      diceCueId: currentCue.id,
      roll: result.roll,
      sides: result.sides,
      outcomeId: result.outcomeId,
      tier: result.tier,
      glory: result.glory,
    });
  }

  function handleOutcomeComplete() {
    setDecisionOutcome(null);
    advanceCue();
  }

  if (!currentCue) {
    return null;
  }
function handleObservationComplete(result) {
  console.log("Observation Result:", result);

  // Later we'll award Glory and track who found what.
  // For now, simply continue the chapter.

  advanceCue();
}
  /*
    The Director temporarily inserts the selected outcome as narration.
    The GroupDecision component does not narrate story consequences.
  */
  if (decisionOutcome) {
    return (
      <NarrationCue
        key={decisionOutcome.id}
        cue={decisionOutcome}
        onAdvance={handleOutcomeComplete}
      />
    );
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

    case "groupDecision":
      return (
        <GroupDecision
          key={currentCue.id}
          cue={currentCue}
          onComplete={handleGroupDecision}
        />
      );

    case "individualDecision":
      return (
        <IndividualDecision
          key={currentCue.id}
          cue={currentCue}
          onComplete={handleIndividualDecision}
        />
      );

    case "dice":
      return (
        <DiceCue
          key={currentCue.id}
          cue={currentCue}
          onComplete={handleDiceComplete}
        />
      );

    case "observation":
      console.log("Rendering observation cue:", currentCue);

      return (
        <ObservationCue
          key={currentCue.id}
          cue={currentCue}
          onComplete={handleObservationComplete}
        />
      );

    case "chapterComplete":
      return null;

    default:
      console.warn(
        `Unsupported chapter cue type: ${currentCue.type}`,
        currentCue,
      );

      return (
        <div className="chapter-director-error">
          <p>Unsupported cue: {currentCue.type}</p>

          <button type="button" onClick={advanceCue}>
            Skip cue
          </button>
        </div>
      );
  }
}

export default ChapterDirector;