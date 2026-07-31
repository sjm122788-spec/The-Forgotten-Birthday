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

  const [
    phoneObservationFoundClueIds,
    setPhoneObservationFoundClueIds,
  ] = useState([]);

  const [
    phoneProgressContributions,
    setPhoneProgressContributions,
  ] = useState(0);

  const [
    phonePrivateChoiceResponses,
    setPhonePrivateChoiceResponses,
  ] = useState(0);

  const currentCue =
    sequence[currentCueIndex];

  const publishingCueIdRef = useRef(null);
  const handledPromptIdsRef = useRef(new Set());
  const completedPhoneCueIdsRef = useRef(new Set());
  const awardedAllGuestCueIdsRef = useRef(new Set());
  const awardedProgressResponseKeysRef = useRef(new Set());
  const awardedPrivateChoiceResponseKeysRef = useRef(new Set());
  const handledObservationResponseIdsRef = useRef(new Set());
  const processingObservationRef = useRef(false);

  const isPhoneIndividualDecision =
    multiplayer?.enabled &&
    currentCue?.type === "individualDecision" &&
    currentCue?.audience === "selectedGuest";

  const isPhoneObservation =
    multiplayer?.enabled &&
    currentCue?.type === "observation" &&
    currentCue?.audience === "allGuests";

  const isPhoneProgressIllustration =
    multiplayer?.enabled &&
    currentCue?.type === "progressIllustration" &&
    currentCue?.audience === "allGuests";

  const isPhoneFillTheSilence =
    multiplayer?.enabled &&
    currentCue?.type === "fillTheSilence" &&
    currentCue?.audience === "allGuests";

  const isPhoneDice =
    multiplayer?.enabled &&
    currentCue?.type === "dice" &&
    currentCue?.audience === "selectedGuest";

  const isPhoneRelicReveal =
    multiplayer?.enabled &&
    currentCue?.type === "relicReveal" &&
    currentCue?.audience === "resultPlayer";

  const TIER_RANK = {
    failure: 0,
    partial: 1,
    success: 2,
    greatSuccess: 3,
  };

  function selectGuestForCue(guests, cueId, excludedPlayerIds = []) {
    if (!Array.isArray(guests) || guests.length === 0) {
      return null;
    }

    const excludedIds = new Set(excludedPlayerIds.filter(Boolean));
    const availableGuests = guests.filter((guest) => !excludedIds.has(guest.id));
    const selectableGuests = availableGuests.length > 0 ? availableGuests : guests;

    const hash = String(cueId ?? "").split("").reduce(
      (total, character) => total + character.charCodeAt(0),
      0,
    );

    return selectableGuests[hash % selectableGuests.length] ?? selectableGuests[0];
  }

  function resolveDiceOutcome(cue, roll) {
    return [...(cue?.outcomes ?? [])]
      .sort((a, b) => (b.min ?? 1) - (a.min ?? 1))
      .find((outcome) => roll >= (outcome.min ?? 1)) ?? null;
  }

  function publishGloryReward({
    sourceCue,
    playerId,
    playerName,
    amount,
    result,
  }) {
    const promptId =
      globalThis.crypto?.randomUUID?.() ??
      `${sourceCue.id}-glory-reward-${Date.now()}`;

    return multiplayer.publishPrompt?.({
      id: promptId,
      cueId: `${sourceCue.id}-glory-reward`,
      sourceCueId: sourceCue.id,
      chapterId: multiplayer.chapterId,
      type: "reward",
      status: "open",
      targetPlayerIds: [playerId],
      targetPlayerNames: [playerName],
      payload: {
        rewardKind: "glory",
        glory: amount,
        title: "Glory Restored",
        message: "The celebration grows brighter.",
        result,
      },
      createdAt: new Date().toISOString(),
    });
  }

  function awardAllGuestsGloryOnce(cueId, amount) {
    if (
      !cueId ||
      !amount ||
      awardedAllGuestCueIdsRef.current.has(cueId)
    ) {
      return;
    }

    awardedAllGuestCueIdsRef.current.add(cueId);

    (multiplayer?.guests ?? []).forEach((guest) => {
      multiplayer?.awardPlayerGlory?.(guest.id, amount);
    });
  }

  useEffect(() => {
    setCurrentCueIndex(0);
    setDecisionOutcome(null);
    setCueResults({});
    setPhoneObservationFoundClueIds([]);
    setPhoneProgressContributions(0);
    setPhonePrivateChoiceResponses(0);
    handledPromptIdsRef.current.clear();
    completedPhoneCueIdsRef.current.clear();
    awardedAllGuestCueIdsRef.current.clear();
    awardedProgressResponseKeysRef.current.clear();
    awardedPrivateChoiceResponseKeysRef.current.clear();
    handledObservationResponseIdsRef.current.clear();
    processingObservationRef.current = false;
  }, [sequence]);

  useEffect(() => {
    setPhoneObservationFoundClueIds([]);
    setPhoneProgressContributions(0);
    setPhonePrivateChoiceResponses(0);
    handledObservationResponseIdsRef.current.clear();
    processingObservationRef.current = false;
  }, [currentCue?.id]);

  useEffect(() => {
    if (!isPhoneObservation) {
      return;
    }

    const activePrompt = multiplayer?.activePrompt;

    if (
      activePrompt?.cueId !== currentCue?.id ||
      activePrompt?.chapterId !== multiplayer?.chapterId
    ) {
      return;
    }

    const sharedFoundClueIds = Array.isArray(
      activePrompt?.sharedState?.foundClueIds,
    )
      ? activePrompt.sharedState.foundClueIds
      : [];

    setPhoneObservationFoundClueIds((currentIds) => {
      if (
        currentIds.length === sharedFoundClueIds.length &&
        currentIds.every((clueId, index) => clueId === sharedFoundClueIds[index])
      ) {
        return currentIds;
      }

      return sharedFoundClueIds;
    });
  }, [
    currentCue?.id,
    isPhoneObservation,
    multiplayer?.activePrompt,
    multiplayer?.chapterId,
  ]);

  useEffect(() => {
    const activePrompt = multiplayer?.activePrompt;

    if (!multiplayer?.enabled || !activePrompt?.id) {
      return;
    }

    const promptBelongsToCurrentCue =
      activePrompt.chapterId === multiplayer?.chapterId &&
      (activePrompt.cueId === currentCue?.id ||
        (
          activePrompt.type === "reward" &&
          activePrompt.sourceCueId === currentCue?.id
        ));

    if (promptBelongsToCurrentCue) {
      return;
    }

    Promise.resolve(multiplayer.clearPrompt?.(activePrompt.id)).catch((error) => {
      console.error("Unable to clear a stale phone prompt", error);
    });
  }, [
    currentCue?.id,
    multiplayer?.activePrompt,
    multiplayer?.chapterId,
    multiplayer?.clearPrompt,
    multiplayer?.enabled,
  ]);

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

    if (
      activePrompt?.type === "reward" &&
      activePrompt.sourceCueId === currentCue.id
    ) {
      const response = (multiplayer?.responses ?? []).find(
        (item) =>
          item.prompt_id === activePrompt.id &&
          item.response_key === "final" &&
          item.response_type === "reward" &&
          activePrompt.targetPlayerIds?.includes(item.player_id) &&
          item.response_data?.acknowledged === true,
      );

      if (!response || handledPromptIdsRef.current.has(activePrompt.id)) {
        return;
      }

      handledPromptIdsRef.current.add(activePrompt.id);

      Promise.resolve(multiplayer.clearPrompt?.(activePrompt.id))
        .catch((error) => {
          console.error("Unable to clear individual reward prompt", error);
        })
        .finally(() => {
          const option = activePrompt.payload?.result?.option;

          if (option) {
            handleIndividualDecision(option);
          }
        });

      return;
    }

    if (!activePrompt || activePrompt.cueId !== currentCue.id) {
      if (
        completedPhoneCueIdsRef.current.has(currentCue.id) ||
        publishingCueIdRef.current === currentCue.id
      ) {
        return;
      }

      const previousResult =
        cueResults[currentCue.excludePreviousPlayerFromCueId];
      const selectedGuest = selectGuestForCue(
        guests,
        currentCue.id,
        [previousResult?.playerId],
      );
      const promptId =
        globalThis.crypto?.randomUUID?.() ??
        `${currentCue.id}-${Date.now()}`;

      publishingCueIdRef.current = currentCue.id;

      const fallbackPhoneOptions = [
        {
          id: "careful-drop",
          label: "A careful drop",
          description: "Offer one small, careful kindness.",
        },
        {
          id: "steady-pour",
          label: "A steady pour",
          description: "Offer what you can with steady care.",
        },
        {
          id: "all-i-can-spare",
          label: "All I can spare",
          description: "Give the flower everything you can spare.",
        },
      ];
      const phoneOptions =
        Array.isArray(currentCue.phoneOptions) &&
        currentCue.phoneOptions.length > 0
          ? currentCue.phoneOptions
          : fallbackPhoneOptions;

      Promise.resolve(
        multiplayer.publishPrompt?.({
          id: promptId,
          cueId: currentCue.id,
          chapterId: multiplayer.chapterId,
          type: currentCue.type,
          status: "open",
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
    completedPhoneCueIdsRef.current.add(currentCue.id);

    const playerName =
      activePrompt.targetPlayerNames?.[
        activePrompt.targetPlayerIds?.indexOf(response.player_id)
      ] ?? null;
    const glory = currentCue.glory ?? 0;
    const result = {
      completed: true,
      option: selectedOption,
      optionId: selectedOption.id,
      glory,
      playerId: response.player_id,
      playerName,
    };

    saveCueResult(currentCue.id, result);
    multiplayer.awardPlayerGlory?.(response.player_id, glory);

    if (glory <= 0) {
      Promise.resolve(multiplayer.clearPrompt?.(activePrompt.id))
        .catch((error) => {
          console.error("Unable to clear phone prompt", error);
        })
        .finally(() => {
          handleIndividualDecision(selectedOption);
        });

      return;
    }

    Promise.resolve(
      publishGloryReward({
        sourceCue: currentCue,
        playerId: response.player_id,
        playerName,
        amount: glory,
        result,
      }),
    ).catch((error) => {
      console.error("Unable to publish individual glory reward", error);
      Promise.resolve(multiplayer.clearPrompt?.(activePrompt.id))
        .catch((clearError) => {
          console.error("Unable to clear phone prompt", clearError);
        })
        .finally(() => {
          handleIndividualDecision(selectedOption);
        });
    });
  }, [
    currentCue,
    cueResults,
    isPhoneIndividualDecision,
    multiplayer?.activePrompt,
    multiplayer?.awardPlayerGlory,
    multiplayer?.chapterId,
    multiplayer?.enabled,
    multiplayer?.guests,
    multiplayer?.responses,
    multiplayer?.publishPrompt,
    multiplayer?.clearPrompt,
  ]);

  useEffect(() => {
    if (!isPhoneObservation) {
      return;
    }

    const guests = multiplayer?.guests ?? [];
    const activePrompt = multiplayer?.activePrompt ?? null;

    if (guests.length === 0) {
      return;
    }

    if (!activePrompt || activePrompt.cueId !== currentCue.id) {
      if (
        completedPhoneCueIdsRef.current.has(currentCue.id) ||
        publishingCueIdRef.current === currentCue.id
      ) {
        return;
      }

      const promptId =
        globalThis.crypto?.randomUUID?.() ??
        `${currentCue.id}-${Date.now()}`;

      publishingCueIdRef.current = currentCue.id;

      Promise.resolve(
        multiplayer.publishPrompt?.({
          id: promptId,
          cueId: currentCue.id,
          chapterId: multiplayer.chapterId,
          type: "observation",
          status: "open",
          targetPlayerIds: guests.map((guest) => guest.id),
          targetPlayerNames: guests.map((guest) => guest.name),
          payload: {
            eyebrow: currentCue.eyebrow ?? "Shared Observation",
            title: currentCue.title,
            instructions: currentCue.instructions,
            image: currentCue.image,
            imageAlt: currentCue.imageAlt,
            clues: (currentCue.clues ?? []).map((clue) => ({
              id: clue.id,
              label: clue.label,
              hiddenLabel: clue.hiddenLabel,
              x: clue.x,
              y: clue.y,
              width: clue.width,
              height: clue.height,
            })),
          },
          sharedState: {
            foundClueIds: [],
          },
          createdAt: new Date().toISOString(),
        }),
      )
        .catch((error) => {
          console.error("Unable to publish observation prompt", error);
        })
        .finally(() => {
          if (publishingCueIdRef.current === currentCue.id) {
            publishingCueIdRef.current = null;
          }
        });

      return;
    }

    if (processingObservationRef.current) {
      return;
    }

    const validClueIds = new Set(
      (currentCue.clues ?? []).map((clue) => clue.id),
    );
    const alreadyFound = new Set(phoneObservationFoundClueIds);
    const acceptedResponses = [];

    for (const response of multiplayer?.responses ?? []) {
      if (response.prompt_id !== activePrompt.id) {
  continue;
}

      const clueId = response.response_data?.clueId;

      if (!validClueIds.has(clueId) || alreadyFound.has(clueId)) {
        continue;
      }

      alreadyFound.add(clueId);
      acceptedResponses.push({ response, clueId });
    }

    if (acceptedResponses.length === 0) {
      return;
    }

    processingObservationRef.current = true;

    const nextFoundClueIds = Array.from(alreadyFound);
    setPhoneObservationFoundClueIds(nextFoundClueIds);

    acceptedResponses.forEach(({ response }) => {
      multiplayer.awardPlayerGlory?.(response.player_id, 1);
    });

    const allCluesFound =
      (currentCue.clues ?? []).length > 0 &&
      nextFoundClueIds.length >= (currentCue.clues ?? []).length;

    if (allCluesFound) {
      completedPhoneCueIdsRef.current.add(currentCue.id);

      Promise.resolve(multiplayer.clearPrompt?.(activePrompt.id))
        .catch((error) => {
          console.error("Unable to clear observation prompt", error);
        })
        .finally(() => {
          processingObservationRef.current = false;
          handleObservationComplete({
            cueId: currentCue.id,
            foundClueIds: nextFoundClueIds,
            missedClueIds: [],
            foundAllClues: true,
            foundCount: nextFoundClueIds.length,
            totalClues: (currentCue.clues ?? []).length,
          });
        });

      return;
    }

    Promise.resolve(
      multiplayer.updatePrompt?.(activePrompt.id, {
        sharedState: {
          ...(activePrompt.sharedState ?? {}),
          foundClueIds: nextFoundClueIds,
        },
      }),
    )
      .catch((error) => {
        console.error("Unable to update observation progress", error);
      })
      .finally(() => {
        processingObservationRef.current = false;
      });
  }, [
    currentCue,
    isPhoneObservation,
    multiplayer?.activePrompt,
    multiplayer?.awardPlayerGlory,
    multiplayer?.chapterId,
    multiplayer?.clearPrompt,
    multiplayer?.guests,
    multiplayer?.publishPrompt,
    multiplayer?.responses,
    multiplayer?.updatePrompt,
    phoneObservationFoundClueIds,
  ]);

  useEffect(() => {
    if (!isPhoneDice) {
      return;
    }

    const guests = multiplayer?.guests ?? [];
    const activePrompt = multiplayer?.activePrompt ?? null;

    if (guests.length === 0) {
      return;
    }

    if (
      activePrompt?.type === "reward" &&
      activePrompt.sourceCueId === currentCue.id
    ) {
      const response = (multiplayer?.responses ?? []).find(
        (item) =>
          item.prompt_id === activePrompt.id &&
          item.response_key === "final" &&
          item.response_type === "reward" &&
          activePrompt.targetPlayerIds?.includes(item.player_id) &&
          item.response_data?.acknowledged === true,
      );

      if (!response || handledPromptIdsRef.current.has(activePrompt.id)) {
        return;
      }

      handledPromptIdsRef.current.add(activePrompt.id);

      Promise.resolve(multiplayer.clearPrompt?.(activePrompt.id))
        .catch((error) => {
          console.error("Unable to clear reward prompt", error);
        })
        .finally(() => {
          const result = activePrompt.payload?.result;

          if (result) {
            handleDiceComplete(result);
          }
        });

      return;
    }

    if (!activePrompt || activePrompt.cueId !== currentCue.id) {
      if (
        completedPhoneCueIdsRef.current.has(currentCue.id) ||
        publishingCueIdRef.current === currentCue.id
      ) {
        return;
      }

      const selectedGuest = selectGuestForCue(guests, currentCue.id);
      const promptId =
        globalThis.crypto?.randomUUID?.() ??
        `${currentCue.id}-${Date.now()}`;

      publishingCueIdRef.current = currentCue.id;

      Promise.resolve(
        multiplayer.publishPrompt?.({
          id: promptId,
          cueId: currentCue.id,
          chapterId: multiplayer.chapterId,
          type: "dice",
          status: "open",
          targetPlayerIds: [selectedGuest.id],
          targetPlayerNames: [selectedGuest.name],
          payload: {
            eyebrow: currentCue.eyebrow,
            title: currentCue.title,
            prompt: currentCue.prompt,
            instructions: currentCue.instructions,
            sides: currentCue.sides ?? 12,
            rollLabel: currentCue.rollLabel,
          },
          createdAt: new Date().toISOString(),
        }),
      )
        .catch((error) => {
          console.error("Unable to publish dice prompt", error);
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
        item.response_key === "final" &&
        activePrompt.targetPlayerIds?.includes(item.player_id),
    );

    if (!response || handledPromptIdsRef.current.has(activePrompt.id)) {
      return;
    }

    const roll = Number(response.response_data?.roll);
    const sides = Number(currentCue.sides ?? 12);
    const resolvedOutcome = Number.isInteger(roll)
      ? resolveDiceOutcome(currentCue, roll)
      : null;

    if (!resolvedOutcome || roll < 1 || roll > sides) {
      console.warn("Phone dice response was invalid", response);
      return;
    }

    handledPromptIdsRef.current.add(activePrompt.id);
    completedPhoneCueIdsRef.current.add(currentCue.id);

    const result = {
      cueId: currentCue.id,
      roll,
      sides,
      outcome: resolvedOutcome,
      outcomeId: resolvedOutcome.id,
      tier: resolvedOutcome.tier,
      narration: resolvedOutcome.narration,
      glory: resolvedOutcome.glory ?? 0,
      playerId: response.player_id,
      playerName:
        activePrompt.targetPlayerNames?.[
          activePrompt.targetPlayerIds?.indexOf(response.player_id)
        ] ?? null,
    };

    multiplayer.awardPlayerGlory?.(
      response.player_id,
      resolvedOutcome.glory ?? 0,
    );

    saveCueResult(currentCue.id, result);

    if ((resolvedOutcome.glory ?? 0) <= 0) {
      Promise.resolve(multiplayer.clearPrompt?.(activePrompt.id))
        .catch((error) => {
          console.error("Unable to clear dice prompt", error);
        })
        .finally(() => {
          handleDiceComplete(result);
        });

      return;
    }

    Promise.resolve(
      publishGloryReward({
        sourceCue: currentCue,
        playerId: response.player_id,
        playerName: result.playerName,
        amount: resolvedOutcome.glory ?? 0,
        result,
      }),
    ).catch((error) => {
      console.error("Unable to publish glory reward", error);
      Promise.resolve(multiplayer.clearPrompt?.(activePrompt.id))
        .catch((clearError) => {
          console.error("Unable to clear dice prompt", clearError);
        })
        .finally(() => {
          handleDiceComplete(result);
        });
    });
  }, [
    currentCue,
    isPhoneDice,
    multiplayer?.activePrompt,
    multiplayer?.awardPlayerGlory,
    multiplayer?.chapterId,
    multiplayer?.clearPrompt,
    multiplayer?.guests,
    multiplayer?.publishPrompt,
    multiplayer?.responses,
  ]);

  useEffect(() => {
    if (!isPhoneProgressIllustration) {
      return;
    }

    const guests = multiplayer?.guests ?? [];
    const activePrompt = multiplayer?.activePrompt ?? null;

    if (guests.length === 0) {
      return;
    }

    if (!activePrompt || activePrompt.cueId !== currentCue.id) {
      if (
        completedPhoneCueIdsRef.current.has(currentCue.id) ||
        publishingCueIdRef.current === currentCue.id
      ) {
        return;
      }

      const promptId =
        globalThis.crypto?.randomUUID?.() ??
        `${currentCue.id}-${Date.now()}`;

      publishingCueIdRef.current = currentCue.id;

      Promise.resolve(
        multiplayer.publishPrompt?.({
          id: promptId,
          cueId: currentCue.id,
          chapterId: multiplayer.chapterId,
          type: currentCue.type,
          status: "open",
          targetPlayerIds: guests.map((guest) => guest.id),
          targetPlayerNames: guests.map((guest) => guest.name),
          payload: {
            eyebrow: currentCue.eyebrow,
            title: currentCue.title,
            prompt: currentCue.prompt,
            instructions: currentCue.instructions,
            confirmLabel: currentCue.contributeLabel ?? "Offer Water",
            options: phoneOptions.map((option) => ({
              id: option.id,
              label: option.label,
              description: option.description ?? "",
            })),
          },
          createdAt: new Date().toISOString(),
        }),
      )
        .catch((error) => {
          console.error("Unable to publish watering prompt", error);
        })
        .finally(() => {
          if (publishingCueIdRef.current === currentCue.id) {
            publishingCueIdRef.current = null;
          }
        });

      return;
    }

    const validOptionIds = new Set(
      (
        Array.isArray(activePrompt.payload?.options)
          ? activePrompt.payload.options
          : []
      ).map((option) => option.id),
    );
    const currentGuestIds = new Set(guests.map((guest) => guest.id));
    const promptTargetPlayerIds = activePrompt.targetPlayerIds ?? [];
    const targetPlayerIds = new Set(promptTargetPlayerIds);
    const connectedTargetPlayerIds = promptTargetPlayerIds.filter((playerId) =>
      currentGuestIds.has(playerId),
    );
    const responsesByPlayerId = new Map();

    for (const response of multiplayer?.responses ?? []) {
      if (
        response.prompt_id !== activePrompt.id ||
        response.response_key !== "final" ||
        !targetPlayerIds.has(response.player_id) ||
        !validOptionIds.has(response.response_data?.optionId)
      ) {
        continue;
      }

      responsesByPlayerId.set(response.player_id, response);
    }

    const acceptedResponses = Array.from(responsesByPlayerId.values());
    setPhoneProgressContributions(acceptedResponses.length);

    acceptedResponses.forEach((response) => {
      const awardKey = `${activePrompt.id}:${response.player_id}`;

      if (awardedProgressResponseKeysRef.current.has(awardKey)) {
        return;
      }

      awardedProgressResponseKeysRef.current.add(awardKey);
      multiplayer.awardPlayerGlory?.(
        response.player_id,
        currentCue.contributionGlory ?? 1,
      );
    });

    const allTargetsResponded =
      connectedTargetPlayerIds.length > 0 &&
      connectedTargetPlayerIds.every((playerId) =>
        responsesByPlayerId.has(playerId),
      );

    if (!allTargetsResponded || handledPromptIdsRef.current.has(activePrompt.id)) {
      return;
    }

    handledPromptIdsRef.current.add(activePrompt.id);
    completedPhoneCueIdsRef.current.add(currentCue.id);

    const finalFrameIndex = Math.max((currentCue.frames ?? []).length - 1, 0);
    const finalFrame = currentCue.frames?.[finalFrameIndex] ?? null;

    Promise.resolve(multiplayer.clearPrompt?.(activePrompt.id))
      .catch((error) => {
        console.error("Unable to clear watering prompt", error);
      })
      .finally(() => {
        handleProgressIllustrationComplete({
          cueId: currentCue.id,
          completed: true,
          contributed: acceptedResponses.length > 0,
          contributions: acceptedResponses.length,
          frameIndex: finalFrameIndex,
          finalFrameId: finalFrame?.id ?? null,
          outcomeId:
            acceptedResponses.length > 0
              ? "contributed"
              : "withheld",
          narration: currentCue.completionNarration,
          glory:
            Math.min(
              acceptedResponses.length * (currentCue.contributionGlory ?? 1),
              currentCue.maximumSharedGlory ?? Infinity,
            ),
        });
      });
  }, [
    currentCue,
    isPhoneProgressIllustration,
    multiplayer?.activePrompt,
    multiplayer?.awardPlayerGlory,
    multiplayer?.chapterId,
    multiplayer?.clearPrompt,
    multiplayer?.guests,
    multiplayer?.publishPrompt,
    multiplayer?.responses,
  ]);

  useEffect(() => {
    if (!isPhoneFillTheSilence) {
      return;
    }

    const guests = multiplayer?.guests ?? [];
    const activePrompt = multiplayer?.activePrompt ?? null;

    if (guests.length === 0) {
      return;
    }

    if (!activePrompt || activePrompt.cueId !== currentCue.id) {
      if (
        completedPhoneCueIdsRef.current.has(currentCue.id) ||
        publishingCueIdRef.current === currentCue.id
      ) {
        return;
      }

      const promptId =
        globalThis.crypto?.randomUUID?.() ??
        `${currentCue.id}-${Date.now()}`;

      publishingCueIdRef.current = currentCue.id;

      Promise.resolve(
        multiplayer.publishPrompt?.({
          id: promptId,
          cueId: currentCue.id,
          chapterId: multiplayer.chapterId,
          type: currentCue.type,
          status: "open",
          targetPlayerIds: guests.map((guest) => guest.id),
          targetPlayerNames: guests.map((guest) => guest.name),
          payload: {
            eyebrow: currentCue.eyebrow,
            title: currentCue.title,
            prompt: currentCue.prompt,
            instructions: currentCue.instructions,
            confirmLabel: currentCue.confirmLabel,
            options: (currentCue.options ?? []).map((option) => ({
              id: option.id,
              label: option.label,
              description: "",
            })),
          },
          createdAt: new Date().toISOString(),
        }),
      )
        .catch((error) => {
          console.error("Unable to publish private choice prompt", error);
        })
        .finally(() => {
          if (publishingCueIdRef.current === currentCue.id) {
            publishingCueIdRef.current = null;
          }
        });

      return;
    }

    const validOptionIds = new Set(
      (currentCue.options ?? []).map((option) => option.id),
    );
    const currentGuestIds = new Set(guests.map((guest) => guest.id));
    const promptTargetPlayerIds = activePrompt.targetPlayerIds ?? [];
    const targetPlayerIds = new Set(promptTargetPlayerIds);
    const connectedTargetPlayerIds = promptTargetPlayerIds.filter((playerId) =>
      currentGuestIds.has(playerId),
    );
    const responsesByPlayerId = new Map();

    for (const response of multiplayer?.responses ?? []) {
      if (
        response.prompt_id !== activePrompt.id ||
        response.response_key !== "final" ||
        !targetPlayerIds.has(response.player_id) ||
        !validOptionIds.has(response.response_data?.optionId)
      ) {
        continue;
      }

      responsesByPlayerId.set(response.player_id, response);
    }

    const acceptedResponses = Array.from(responsesByPlayerId.values());
    setPhonePrivateChoiceResponses(acceptedResponses.length);

    acceptedResponses.forEach((response) => {
      const awardKey = `${activePrompt.id}:${response.player_id}`;

      if (awardedPrivateChoiceResponseKeysRef.current.has(awardKey)) {
        return;
      }

      awardedPrivateChoiceResponseKeysRef.current.add(awardKey);
      multiplayer.awardPlayerGlory?.(response.player_id, currentCue.glory ?? 0);
    });

    const allTargetsResponded =
      connectedTargetPlayerIds.length > 0 &&
      connectedTargetPlayerIds.every((playerId) =>
        responsesByPlayerId.has(playerId),
      );

    if (!allTargetsResponded || handledPromptIdsRef.current.has(activePrompt.id)) {
      return;
    }

    handledPromptIdsRef.current.add(activePrompt.id);
    completedPhoneCueIdsRef.current.add(currentCue.id);

    Promise.resolve(multiplayer.clearPrompt?.(activePrompt.id))
      .catch((error) => {
        console.error("Unable to clear private choice prompt", error);
      })
      .finally(() => {
        handleFillTheSilenceComplete({
          cueId: currentCue.id,
          completed: true,
          outcomeId: "silence-filled",
          selectedOptionId: null,
          hidden: true,
          narration: currentCue.completionNarration,
          glory: acceptedResponses.length * (currentCue.glory ?? 0),
          metadata: {
            responseCount: acceptedResponses.length,
          },
        });
      });
  }, [
    currentCue,
    isPhoneFillTheSilence,
    multiplayer?.activePrompt,
    multiplayer?.awardPlayerGlory,
    multiplayer?.chapterId,
    multiplayer?.clearPrompt,
    multiplayer?.guests,
    multiplayer?.publishPrompt,
    multiplayer?.responses,
  ]);

  useEffect(() => {
    if (!isPhoneRelicReveal || !relicConditionMet(currentCue?.condition)) {
      return;
    }

    const sourceResult = cueResults[currentCue?.playerSourceCueId];
    const targetPlayerId = sourceResult?.playerId;
    const targetPlayerName = sourceResult?.playerName ?? "A Guest";
    const activePrompt = multiplayer?.activePrompt ?? null;

    if (!targetPlayerId) {
      console.warn(
        `Relic cue ${currentCue?.id} could not find its source player`,
      );
      return;
    }

    if (!activePrompt || activePrompt.cueId !== currentCue.id) {
      if (
        completedPhoneCueIdsRef.current.has(currentCue.id) ||
        publishingCueIdRef.current === currentCue.id
      ) {
        return;
      }

      const promptId =
        globalThis.crypto?.randomUUID?.() ??
        `${currentCue.id}-${Date.now()}`;

      publishingCueIdRef.current = currentCue.id;

      Promise.resolve(
        multiplayer.publishPrompt?.({
          id: promptId,
          cueId: currentCue.id,
          chapterId: multiplayer.chapterId,
          type: "relicReveal",
          status: "open",
          targetPlayerIds: [targetPlayerId],
          targetPlayerNames: [targetPlayerName],
          payload: {
            eyebrow: currentCue.eyebrow,
            title: currentCue.title,
            image: currentCue.image,
            imageAlt: currentCue.imageAlt,
            description: currentCue.description,
            protects: currentCue.protects,
            continueLabel: currentCue.continueLabel,
            relicId: currentCue.relicId,
          },
          createdAt: new Date().toISOString(),
        }),
      )
        .catch((error) => {
          console.error("Unable to publish relic prompt", error);
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
        item.response_key === "final" &&
        item.player_id === targetPlayerId,
    );

    if (!response || handledPromptIdsRef.current.has(activePrompt.id)) {
      return;
    }

    handledPromptIdsRef.current.add(activePrompt.id);
    completedPhoneCueIdsRef.current.add(currentCue.id);

    multiplayer.awardPlayerRelic?.(
      targetPlayerId,
      currentCue.relicId,
    );

    Promise.resolve(multiplayer.clearPrompt?.(activePrompt.id))
      .catch((error) => {
        console.error("Unable to clear relic prompt", error);
      })
      .finally(() => {
        handleRelicRevealComplete({
          cueId: currentCue.id,
          relicId: currentCue.relicId,
          awarded: true,
          playerId: targetPlayerId,
          playerName: targetPlayerName,
        });
      });
  }, [
    cueResults,
    currentCue,
    isPhoneRelicReveal,
    multiplayer?.activePrompt,
    multiplayer?.awardPlayerRelic,
    multiplayer?.chapterId,
    multiplayer?.clearPrompt,
    multiplayer?.publishPrompt,
    multiplayer?.responses,
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
      currentCue.awardGloryTo === "allGuests"
    ) {
      awardAllGuestsGloryOnce(
        currentCue.id,
        result.glory ?? 0,
      );
    }

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
      currentCue.awardGloryTo === "allGuests"
    ) {
      awardAllGuestsGloryOnce(
        currentCue.id,
        result.glory ?? 0,
      );
    }

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
      currentCue.awardGloryTo === "allGuests"
    ) {
      awardAllGuestsGloryOnce(
        currentCue.id,
        result.glory ?? 0,
      );
    }

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
      currentCue.awardGloryTo === "allGuests"
    ) {
      awardAllGuestsGloryOnce(
        currentCue.id,
        result.glory ?? 0,
      );
    }

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

  if (isPhoneDice) {
    const targetName =
      multiplayer?.activePrompt?.cueId === currentCue.id
        ? multiplayer.activePrompt.targetPlayerNames?.[0]
        : null;

    return (
      <section className="dice-cue">
        <div className="dice-cue__card">
          <header className="dice-cue__header">
            <p className="dice-cue__eyebrow">
              {currentCue.eyebrow ?? "A Moment of Chance"}
            </p>
            <h2 className="dice-cue__title">{currentCue.title}</h2>
            <p className="dice-cue__prompt">
              {targetName
                ? `${targetName}, reach for the flame. Check your phone.`
                : "Choosing the Guest who will roll..."}
            </p>
          </header>
        </div>
      </section>
    );
  }

  if (isPhoneRelicReveal && relicConditionMet(currentCue.condition)) {
    const sourceResult = cueResults[currentCue.playerSourceCueId];
    const targetName = sourceResult?.playerName ?? "The chosen Guest";

    return (
      <RelicRevealCue
        key={currentCue.id}
        cue={{
          ...currentCue,
          continueLabel: `Waiting for ${targetName} to carry the light...`,
        }}
        disabled
      />
    );
  }

  if (isPhoneObservation) {
    const totalClues = currentCue.clues?.length ?? 0;
    const foundCount = phoneObservationFoundClueIds.length;

    return (
      <section className="observation-cue">
        <header className="observation-cue__header">
          <p className="observation-cue__eyebrow">Shared Observation</p>
          <h2 className="observation-cue__title">{currentCue.title}</h2>
          <p className="observation-cue__instructions">
            Everyone, check your phone and search the room together.
          </p>
        </header>

        <div className="observation-cue__clue-panel">
          <h3>{foundCount} of {totalClues} clues found</h3>
          <p className="observation-cue__progress">
            The story will continue when the room has revealed everything.
          </p>
        </div>
      </section>
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

  if (isPhoneFillTheSilence && (multiplayer?.guests ?? []).length > 0) {
    const guestCount = multiplayer?.activePrompt?.targetPlayerIds?.length ??
      (multiplayer?.guests ?? []).length;

    return (
      <section className="fill-the-silence">
        <div className="fill-the-silence__card">
          <header className="fill-the-silence__header">
            <p className="fill-the-silence__eyebrow">
              {currentCue.eyebrow ?? "A Quiet Question"}
            </p>

            <h2 className="fill-the-silence__title">
              {currentCue.title ?? "Fill the Silence"}
            </h2>

            {currentCue.prompt && (
              <p className="fill-the-silence__prompt">
                {currentCue.prompt}
              </p>
            )}
          </header>

          <div className="fill-the-silence__privacy">
            <span
              className="fill-the-silence__privacy-symbol"
              aria-hidden="true"
            >
              O
            </span>

            <p>
              {phonePrivateChoiceResponses} of {guestCount} Guests have answered.
            </p>
          </div>

          <p className="fill-the-silence__complete-copy">
            The story will continue when every current Guest has placed an answer.
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
          controlledContributions={
            isPhoneProgressIllustration &&
            (multiplayer?.guests ?? []).length > 0
              ? phoneProgressContributions
              : null
          }
          controlledComplete={
            isPhoneProgressIllustration &&
            completedPhoneCueIdsRef.current.has(currentCue.id)
          }
          waitingForResponses={
            isPhoneProgressIllustration &&
            (multiplayer?.guests ?? []).length > 0 &&
            !completedPhoneCueIdsRef.current.has(currentCue.id)
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
