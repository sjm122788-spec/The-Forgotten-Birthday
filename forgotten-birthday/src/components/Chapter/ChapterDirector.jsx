import { useEffect, useState } from "react";

import NarrationCue from "../Narration/NarrationCue";
import GroupDecision from "../Decisions/GroupDecision";
import IndividualDecision from "../Decisions/IndividualDecision";
import ObservationCue from "../Observation/ObservationCue";
import DiceCue from "../Dice/DiceCue";
import CooperativePuzzleCue from "../Puzzle/CooperativePuzzleCue";
import RelicRevealCue from "../Relic/RelicRevealCue";
import RhythmChallengeCue from "../Rhythm/RhythmChallengeCue";


function ChapterDirector({
  sequence = [],
  onVisualStateChange,
  onCompleteChapter,
}) {
  const [currentCueIndex, setCurrentCueIndex] = useState(0);
  const [decisionOutcome, setDecisionOutcome] = useState(null);
  const [cueResults, setCueResults] = useState({});

  const currentCue = sequence[currentCueIndex];

  useEffect(() => {
    setCurrentCueIndex(0);
    setDecisionOutcome(null);
    setCueResults({});
  }, [sequence]);

  useEffect(() => {
    if (currentCue?.type === "chapterComplete") {
      onCompleteChapter();
    }
  }, [currentCue, onCompleteChapter]);

  const TIER_RANK = {
    failure: 0,
    partial: 1,
    success: 2,
    greatSuccess: 3,
  };

  function saveCueResult(cueId, result) {
    setCueResults((current) => ({
      ...current,
      [cueId]: result,
    }));
  }

  function relicConditionMet(condition) {
    if (!condition) {
      return true;
    }

    const puzzleResult = cueResults[condition.puzzleCueId];
    const diceResult = cueResults[condition.diceCueId];

    if (
      condition.requiresPuzzleCompletion &&
      !puzzleResult?.completed
    ) {
      return false;
    }

    if (condition.minimumTier) {
      const actualRank = TIER_RANK[diceResult?.tier] ?? -1;
      const requiredRank = TIER_RANK[condition.minimumTier] ?? 0;

      if (actualRank < requiredRank) {
        return false;
      }
    }

    return true;
  }

  useEffect(() => {
    if (
      currentCue?.type === "relicReveal" &&
      !relicConditionMet(currentCue.condition)
    ) {
      advanceCue();
    }
  }, [currentCue, cueResults]);

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

function handleIndividualDecision(
  option,
) {
  if (option.visualState) {
    onVisualStateChange?.(
      option.visualState,
    );
  }

  setDecisionOutcome({
    id:
      `${currentCue.id}-${option.id}-outcome`,
    type: "narration",
    text: option.outcome,
    decisionId: currentCue.id,
    optionId: option.id,
  });
}

  function handleDiceComplete(result) {
    saveCueResult(currentCue.id, result);

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

  function handleCooperativePuzzleComplete(result) {
    saveCueResult(currentCue.id, result);

    if (result.narration) {
      setDecisionOutcome({
        id: `${currentCue.id}-${result.outcomeId}-outcome`,
        type: "narration",
        text: result.narration,
        puzzleCueId: currentCue.id,
        completed: result.completed,
        attempts: result.attempts,
        glory: result.glory,
      });

      return;
    }

    advanceCue();
  }

  function handleRelicRevealComplete(result) {
    saveCueResult(currentCue.id, result);
    advanceCue();
  }

  function handleRhythmChallengeComplete(result) {
    saveCueResult(currentCue.id, result);

    if (result.narration) {
      setDecisionOutcome({
        id: `${currentCue.id}-${result.outcomeId}-outcome`,
        type: "narration",
        text: result.narration,
        rhythmCueId: currentCue.id,
        completed: result.completed,
        attempts: result.attempts,
        accuracy: result.accuracy,
        glory: result.glory,
      });

      return;
    }

    advanceCue();
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

    case "cooperativePuzzle":
      return (
        <CooperativePuzzleCue
          key={currentCue.id}
          cue={currentCue}
          onComplete={handleCooperativePuzzleComplete}
        />
      );

    case "relicReveal":
      if (!relicConditionMet(currentCue.condition)) {
        return null;
      }

      return (
        <RelicRevealCue
          key={currentCue.id}
          cue={currentCue}
          onComplete={handleRelicRevealComplete}
        />
      );

    case "rhythmChallenge":
      return (
        <RhythmChallengeCue
          key={currentCue.id}
          cue={currentCue}
          onComplete={handleRhythmChallengeComplete}
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