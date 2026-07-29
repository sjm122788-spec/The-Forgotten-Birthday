import {
  useEffect,
  useRef,
  useState,
} from "react";

import NarrationCue from "../Narration/NarrationCue";
import GroupDecision from "../Decisions/GroupDecision";
import IndividualDecision from "../Decisions/IndividualDecision";
import DifficultChoiceCue from "../Decisions/DifficultChoiceCue";

import ObservationCue from "../Observation/ObservationCue";
import DiceCue from "../Dice/DiceCue";
import CooperativePuzzleCue from "../Puzzle/CooperativePuzzleCue";
import RelicRevealCue from "../Relic/RelicRevealCue";
import RhythmChallengeCue from "../Rhythm/RhythmChallengeCue";
import GiftSelectionCue from "../GiftSelection/GiftSelectionCue";
import FillTheSilenceCue from "../FillTheSilence/FillTheSilenceCue";

import ProgressIllustrationCue from "../ProgressIllustration/ProgressIllustrationCue";

function ChapterDirector({
  sequence = [],
  onVisualStateChange,
  onCompleteChapter,
  multiplayer,
}) {
  const [
    currentCueIndex,
    setCurrentCueIndex,
  ] = useState(0);

  const [
    decisionOutcome,
    setDecisionOutcome,
  ] = useState(null);

  const [
    cueResults,
    setCueResults,
  ] = useState({});

  const [foundClueIds, setFoundClueIds] = useState([]);

  const currentCue =
    sequence[currentCueIndex];

  const publishingCueIdRef = useRef(null);
  const handledPromptIdsRef = useRef(new Set());

  const isPhoneIndividualDecision =
    multiplayer?.enabled &&
    currentCue?.type === "individualDecision" &&
    currentCue?.audience === "selectedGuest";

  const isPhoneObservation =
    multiplayer?.enabled &&
    currentCue?.type === "observation" &&
    currentCue?.audience === "allGuests";

  const TIER_RANK = {
    failure: 0,
    partial: 1,
    success: 2,
    greatSuccess: 3,
  };

  useEffect(() => {
    setCurrentCueIndex(0);
    setDecisionOutcome(null);
    setCueResults({});
    setFoundClueIds([]);
  }, [sequence]);

  useEffect(() => {
    if (
      currentCue?.type ===
      "chapterComplete"
    ) {
      onCompleteChapter?.();
    }
  }, [
    currentCue,
    onCompleteChapter,
  ]);

  useEffect(() => {
    if (!isPhoneObservation) {
      return;
    }

    const activePrompt = multiplayer?.activePrompt;

    if (
      !activePrompt ||
      activePrompt.cueId !== currentCue?.id
    ) {
      return;
    }

    const nextFoundClueIds = Array.isArray(
      activePrompt.payload?.foundClueIds,
    )
      ? [...new Set(activePrompt.payload.foundClueIds)]
      : [];

    setFoundClueIds(nextFoundClueIds);
  }, [
    isPhoneObservation,
    currentCue?.id,
    multiplayer?.activePrompt,
  ]);

  useEffect(() => {
    if (!isPhoneObservation) {
      return;
    }

    const activePrompt = multiplayer?.activePrompt;
    const existingFoundClueIds = new Set(
      Array.isArray(activePrompt?.payload?.foundClueIds)
        ? activePrompt.payload.foundClueIds
        : [],
    );
    const desiredFoundClueIds = new Set(foundClueIds);

    const promptMatches =
      activePrompt?.cueId === currentCue?.id &&
      activePrompt?.type === currentCue?.type &&
      existingFoundClueIds.size === desiredFoundClueIds.size &&
      [...existingFoundClueIds].every((clueId) =>
        desiredFoundClueIds.has(clueId),
      );

    if (promptMatches) {
      return;
    }

    if (publishingCueIdRef.current === currentCue?.id) {
      return;
    }

    publishingCueIdRef.current = currentCue?.id;

    const promptId =
      globalThis.crypto?.randomUUID?.() ??
      `${currentCue?.id}-${Date.now()}`;

    const prompt = {
      id: promptId,
      cueId: currentCue?.id,
      type: currentCue?.type,
      status: "awaiting-response",
      targetPlayerIds: (multiplayer?.guests ?? []).map((guest) => guest.id),
      targetPlayerNames: (multiplayer?.guests ?? []).map(
        (guest) => guest.name,
      ),
      payload: {
        eyebrow: currentCue.eyebrow,
        title: currentCue.title,
        prompt: currentCue.prompt,
        instructions: currentCue.instructions,
        image: currentCue.image,
        imageAlt: currentCue.imageAlt,
        clues: Array.isArray(currentCue.clues)
          ? currentCue.clues.map((clue) => ({
              id: clue.id,
              label: clue.label,
              hiddenLabel: clue.hiddenLabel,
              x: clue.x,
              y: clue.y,
              width: clue.width,
              height: clue.height,
            }))
          : [],
        foundClueIds: [...desiredFoundClueIds],
      },
      createdAt: new Date().toISOString(),
    };

    Promise.resolve(multiplayer.publishPrompt?.(prompt))
      .catch((error) => {
        console.error("Unable to publish observation prompt", error);
      })
      .finally(() => {
        if (publishingCueIdRef.current === currentCue?.id) {
          publishingCueIdRef.current = null;
        }
      });
  }, [
    currentCue,
    isPhoneObservation,
    multiplayer?.activePrompt,
    multiplayer?.guests,
    multiplayer?.publishPrompt,
    foundClueIds,
  ]);

  useEffect(() => {
    if (!isPhoneObservation) {
      return;
    }

    const activePrompt = multiplayer?.activePrompt;

    if (
      !activePrompt ||
      activePrompt.cueId !== currentCue?.id
    ) {
      return;
    }

    const responses = Array.isArray(multiplayer?.responses)
      ? multiplayer.responses
      : [];

    if (responses.length === 0) {
      return;
    }

    const alreadyFound = new Set(foundClueIds);
    const newDiscoveries = [];

    for (const response of responses) {
      const clueId = response?.response_data?.clueId;
      const playerId = response?.player_id;

      if (!clueId || typeof clueId !== "string") {
        continue;
      }

      if (alreadyFound.has(clueId)) {
        continue;
      }

      alreadyFound.add(clueId);
      newDiscoveries.push({ clueId, playerId });
    }

    if (newDiscoveries.length === 0) {
      return;
    }

    const nextFoundClueIds = [...foundClueIds, ...newDiscoveries.map((item) => item.clueId)];
    setFoundClueIds(nextFoundClueIds);

    newDiscoveries.forEach((discovery) => {
      if (discovery?.playerId) {
        multiplayer?.awardPlayerGlory?.(discovery.playerId, 1);
      }
    });

    const allCluesCount = Array.isArray(currentCue?.clues)
      ? currentCue.clues.length
      : 0;

    if (nextFoundClueIds.length === allCluesCount && allCluesCount > 0) {
      Promise.resolve(multiplayer.clearPrompt?.(activePrompt.id))
        .catch((error) => {
          console.error("Unable to clear observation prompt", error);
        })
        .finally(() => {
          handleObservationComplete({
            cueId: currentCue.id,
            foundClueIds: nextFoundClueIds,
            missedClueIds: [],
            foundAllClues: true,
            foundCount: nextFoundClueIds.length,
            totalClues: allCluesCount,
          });
        });
    }
  }, [
    currentCue,
    foundClueIds,
    isPhoneObservation,
    multiplayer?.activePrompt,
    multiplayer?.responses,
    multiplayer?.clearPrompt,
  ]);
function handleFillTheSilenceComplete(
  result,
) {
  saveCueResult(
    currentCue.id,
    result,
  );

  if (
    result.narration
  ) {
    showOutcomeNarration({
      outcomeId:
        result.outcomeId ??
        "silence-filled",

      text:
        result.narration,

      resultData: {
        fillTheSilenceCueId:
          currentCue.id,

        completed:
          result.completed,

        selectedOptionId:
          result.selectedOptionId,

        hidden:
          true,

        glory:
          result.glory ?? 0,
      },
    });

    return;
  }

  advanceCue();
}
  function advanceCue() {
    setCurrentCueIndex(
      (currentIndex) => {
        const nextIndex =
          currentIndex + 1;

        if (
          nextIndex >=
          sequence.length
        ) {
          return currentIndex;
        }

        return nextIndex;
      },
    );
  }

  function saveCueResult(
    cueId,
    result,
  ) {
    setCueResults(
      (currentResults) => ({
        ...currentResults,

        [cueId]:
          result,
      }),
    );
  }

  function showOutcomeNarration({
    outcomeId,
    text,
    resultData = {},
  }) {
    setDecisionOutcome({
      id:
        `${currentCue.id}-${outcomeId}-outcome`,

      type:
        "narration",

      text,

      sourceCueId:
        currentCue.id,

      ...resultData,
    });
  }

  function relicConditionMet(
    condition,
  ) {
    if (!condition) {
      return true;
    }

    const puzzleResult =
      cueResults[
        condition.puzzleCueId
      ];

    const diceResult =
      cueResults[
        condition.diceCueId
      ];

    if (
      condition.requiresPuzzleCompletion &&
      !puzzleResult?.completed
    ) {
      return false;
    }

    if (
      condition.minimumTier
    ) {
      const actualRank =
        TIER_RANK[
          diceResult?.tier
        ] ?? -1;

      const requiredRank =
        TIER_RANK[
          condition.minimumTier
        ] ?? 0;

      if (
        actualRank <
        requiredRank
      ) {
        return false;
      }
    }

    return true;
  }

  useEffect(() => {
    if (!isPhoneIndividualDecision) {
      return;
    }

    const guests = multiplayer?.guests ?? [];
    const activePrompt = multiplayer?.activePrompt ?? null;

    if (guests.length === 0) {
      return;
    }

    if (!activePrompt || activePrompt.cueId !== currentCue.id) {
      if (publishingCueIdRef.current === currentCue.id) {
        return;
      }

      const selectedGuest = guests[0];
      const promptId =
        globalThis.crypto?.randomUUID?.() ??
        `${currentCue.id}-${Date.now()}`;

      publishingCueIdRef.current = currentCue.id;

      Promise.resolve(
        multiplayer.publishPrompt?.({
          id: promptId,
          cueId: currentCue.id,
          type: currentCue.type,
          status: "awaiting-response",
          targetPlayerIds: [selectedGuest.id],
          targetPlayerNames: [selectedGuest.name],
          payload: {
            eyebrow: currentCue.eyebrow,
            title: currentCue.title,
            prompt: currentCue.prompt,
            instructions: currentCue.instructions,
            confirmLabel: currentCue.confirmLabel,
            options: (currentCue.options ?? []).map((option) => ({
              id: option.id,
              label: option.label,
              description: option.description ?? "",
            })),
          },
          createdAt: new Date().toISOString(),
        }),
      )
        .catch((error) => {
          console.error("Unable to publish phone prompt", error);
        })
        .finally(() => {
          if (publishingCueIdRef.current === currentCue.id) {
            publishingCueIdRef.current = null;
          }
        });

      return;
    }

    const response = (multiplayer?.responses ?? []).find(
      (item) =>
        item.prompt_id === activePrompt.id &&
        activePrompt.targetPlayerIds?.includes(item.player_id),
    );

    if (!response || handledPromptIdsRef.current.has(activePrompt.id)) {
      return;
    }

    const optionId = response.response_data?.optionId;
    const selectedOption = (currentCue.options ?? []).find(
      (option) => option.id === optionId,
    );

    if (!selectedOption) {
      console.warn("Phone response did not match a cue option", response);
      return;
    }

    handledPromptIdsRef.current.add(activePrompt.id);

    Promise.resolve(multiplayer.clearPrompt?.(activePrompt.id))
      .catch((error) => {
        console.error("Unable to clear phone prompt", error);
      })
      .finally(() => {
        handleIndividualDecision(selectedOption);
      });
  }, [
    currentCue,
    isPhoneIndividualDecision,
    multiplayer?.activePrompt,
    multiplayer?.enabled,
    multiplayer?.guests,
    multiplayer?.responses,
    multiplayer?.publishPrompt,
    multiplayer?.clearPrompt,
  ]);

  useEffect(() => {
    if (
      currentCue?.type ===
        "relicReveal" &&
      !relicConditionMet(
        currentCue.condition,
      )
    ) {
      advanceCue();
    }
  }, [
    currentCue,
    cueResults,
  ]);

  function handleGroupDecision(
    option,
  ) {
    showOutcomeNarration({
      outcomeId:
        option.id,

      text:
        option.outcome,

      resultData: {
        decisionId:
          currentCue.id,

        optionId:
          option.id,
      },
    });
  }

  function handleIndividualDecision(
    option,
  ) {
    if (
      option.visualState
    ) {
      onVisualStateChange?.(
        option.visualState,
      );
    }

    showOutcomeNarration({
      outcomeId:
        option.id,

      text:
        option.outcome,

      resultData: {
        decisionId:
          currentCue.id,

        optionId:
          option.id,
      },
    });
  }

  function handleDifficultChoiceComplete(
    result,
  ) {
    saveCueResult(
      currentCue.id,
      result,
    );

    if (
      result.visualState
    ) {
      onVisualStateChange?.(
        result.visualState,
      );
    }

    if (
      result.narration
    ) {
      showOutcomeNarration({
        outcomeId:
          result.outcomeId ??
          result.optionId ??
          "choice",

        text:
          result.narration,

        resultData: {
          difficultChoiceCueId:
            currentCue.id,

          optionId:
            result.optionId,

          glory:
            result.glory ?? 0,
        },
      });

      return;
    }

    advanceCue();
  }

  function handleDiceComplete(
    result,
  ) {
    saveCueResult(
      currentCue.id,
      result,
    );

    showOutcomeNarration({
      outcomeId:
        result.outcomeId,

      text:
        result.narration,

      resultData: {
        diceCueId:
          currentCue.id,

        roll:
          result.roll,

        sides:
          result.sides,

        tier:
          result.tier,

        glory:
          result.glory,
      },
    });
  }

  function handleCooperativePuzzleComplete(
    result,
  ) {
    saveCueResult(
      currentCue.id,
      result,
    );

    if (
      result.narration
    ) {
      showOutcomeNarration({
        outcomeId:
          result.outcomeId,

        text:
          result.narration,

        resultData: {
          puzzleCueId:
            currentCue.id,

          completed:
            result.completed,

          attempts:
            result.attempts,

          glory:
            result.glory,
        },
      });

      return;
    }

    advanceCue();
  }

  function handleGiftSelectionComplete(
    result,
  ) {
    saveCueResult(
      currentCue.id,
      result,
    );

    if (
      result.narration
    ) {
      showOutcomeNarration({
        outcomeId:
          result.outcomeId,

        text:
          result.narration,

        resultData: {
          giftSelectionCueId:
            currentCue.id,

          completed:
            result.completed,

          selectedGiftIds:
            result.selectedGiftIds,

          glory:
            result.glory,
        },
      });

      return;
    }

    advanceCue();
  }

  function handleProgressIllustrationComplete(
    result,
  ) {
    saveCueResult(
      currentCue.id,
      result,
    );

    if (
      result.visualState
    ) {
      onVisualStateChange?.(
        result.visualState,
      );
    }

    if (
      result.narration
    ) {
      showOutcomeNarration({
        outcomeId:
          result.outcomeId ??
          "completed",

        text:
          result.narration,

        resultData: {
          progressIllustrationCueId:
            currentCue.id,

          completed:
            result.completed,

          contributed:
            result.contributed,

          contributions:
            result.contributions,

          frameIndex:
            result.frameIndex,

          finalFrameId:
            result.finalFrameId,

          glory:
            result.glory,
        },
      });

      return;
    }

    advanceCue();
  }

  function handleRelicRevealComplete(
    result,
  ) {
    saveCueResult(
      currentCue.id,
      result,
    );

    advanceCue();
  }

  function handleRhythmChallengeComplete(
    result,
  ) {
    saveCueResult(
      currentCue.id,
      result,
    );

    if (
      result.narration
    ) {
      showOutcomeNarration({
        outcomeId:
          result.outcomeId,

        text:
          result.narration,

        resultData: {
          rhythmCueId:
            currentCue.id,

          completed:
            result.completed,

          attempts:
            result.attempts,

          accuracy:
            result.accuracy,

          glory:
            result.glory,
        },
      });

      return;
    }

    advanceCue();
  }

  function handleObservationComplete(
    result,
  ) {
    saveCueResult(
      currentCue.id,
      result,
    );

    advanceCue();
  }

  function handleOutcomeComplete() {
    setDecisionOutcome(null);
    advanceCue();
  }

  if (!currentCue) {
    return null;
  }

  /*
    The Director temporarily inserts the selected
    outcome as narration.

    Gameplay components return results.
    They do not control chapter progression.
  */
  if (decisionOutcome) {
    return (
      <NarrationCue
        key={
          decisionOutcome.id
        }
        cue={
          decisionOutcome
        }
        onAdvance={
          handleOutcomeComplete
        }
      />
    );
  }

  if (isPhoneIndividualDecision) {
    const targetName =
      multiplayer?.activePrompt?.cueId === currentCue.id
        ? multiplayer.activePrompt.targetPlayerNames?.[0]
        : null;

    return (
      <section className="individual-decision">
        <div className="individual-decision__card">
          <header className="individual-decision__header">
            <p className="individual-decision__eyebrow">A Guest Has Been Chosen</p>
            <h2 className="individual-decision__title">
              {targetName ? `${targetName}, check your phone.` : "Choosing a Guest..."}
            </h2>
          </header>
          <p className="individual-decision__instructions">
            The story will continue when their choice is made.
          </p>
        </div>
      </section>
    );
  }

  switch (
    currentCue.type
  ) {
    case "narration":
      return (
        <NarrationCue
          key={
            currentCue.id
          }
          cue={
            currentCue
          }
          onAdvance={
            advanceCue
          }
        />
      );

    case "groupDecision":
      return (
        <GroupDecision
          key={
            currentCue.id
          }
          cue={
            currentCue
          }
          onComplete={
            handleGroupDecision
          }
        />
      );

    case "individualDecision":
      return (
        <IndividualDecision
          key={
            currentCue.id
          }
          cue={
            currentCue
          }
          onComplete={
            handleIndividualDecision
          }
        />
      );

    case "difficultChoice":
      return (
        <DifficultChoiceCue
          key={
            currentCue.id
          }
          cue={
            currentCue
          }
          onComplete={
            handleDifficultChoiceComplete
          }
        />
      );

    case "dice":
      return (
        <DiceCue
          key={
            currentCue.id
          }
          cue={
            currentCue
          }
          onComplete={
            handleDiceComplete
          }
        />
      );

    case "cooperativePuzzle":
      return (
        <CooperativePuzzleCue
          key={
            currentCue.id
          }
          cue={
            currentCue
          }
          onComplete={
            handleCooperativePuzzleComplete
          }
        />
      );

    case "giftSelection":
      return (
        <GiftSelectionCue
          key={
            currentCue.id
          }
          cue={
            currentCue
          }
          onComplete={
            handleGiftSelectionComplete
          }
        />
      );

    case "progressIllustration":
      return (
        <ProgressIllustrationCue
          key={
            currentCue.id
          }
          cue={
            currentCue
          }
          onComplete={
            handleProgressIllustrationComplete
          }
        />
      );
case "fillTheSilence":
  return (
    <FillTheSilenceCue
      key={
        currentCue.id
      }
      cue={
        currentCue
      }
      onComplete={
        handleFillTheSilenceComplete
      }
    />
  );
    case "relicReveal":
      if (
        !relicConditionMet(
          currentCue.condition,
        )
      ) {
        return null;
      }

      return (
        <RelicRevealCue
          key={
            currentCue.id
          }
          cue={
            currentCue
          }
          onComplete={
            handleRelicRevealComplete
          }
        />
      );

    case "rhythmChallenge":
      return (
        <RhythmChallengeCue
          key={
            currentCue.id
          }
          cue={
            currentCue
          }
          onComplete={
            handleRhythmChallengeComplete
          }
        />
      );

    case "observation":
      return (
        <ObservationCue
          key={
            currentCue.id
          }
          cue={
            currentCue
          }
          onComplete={
            handleObservationComplete
          }
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
          <p>
            Unsupported cue:{" "}
            {currentCue.type}
          </p>

          <button
            type="button"
            onClick={
              advanceCue
            }
          >
            Skip cue
          </button>
        </div>
      );
  }
}

export default ChapterDirector;