import { useEffect, useMemo, useRef, useState } from "react";

import finale, { finaleRelics } from "../../data/finale";

import "./FinaleScene.css";

const DEFAULT_RELIC_IDS = finaleRelics.map((relic) => relic.id);

function normalizeRelicIds(earnedRelics) {
  if (!Array.isArray(earnedRelics)) {
    return [];
  }

  return earnedRelics
    .map((relic) =>
      typeof relic === "string" ? relic : relic?.id,
    )
    .filter(Boolean);
}

function FinaleScene({
  earnedRelics = DEFAULT_RELIC_IDS,
  glory = 0,
  maximumGlory = 100,
  playerProgress = {},
  multiplayer = null,
  onComplete,
}) {
  const [sequenceIndex, setSequenceIndex] = useState(0);
  const [returnedRelicCount, setReturnedRelicCount] =
    useState(0);
  const [displayedGlory, setDisplayedGlory] = useState(0);
  const [gloryReturnCount, setGloryReturnCount] = useState(0);
  const [makeRoomCount, setMakeRoomCount] = useState(0);
  const [isComplete, setIsComplete] = useState(false);
  const publishingPromptKeyRef = useRef(null);
  const completedPromptKeysRef = useRef(new Set());

  const currentCue = finale.sequence[sequenceIndex];
  const phase = currentCue?.phase ?? "complete";
  const multiplayerGuests = multiplayer?.guests ?? [];
  const multiplayerEnabled =
    Boolean(multiplayer?.enabled) && multiplayerGuests.length > 0;
  const finaleChapterId = multiplayer?.chapterId ?? "finale";

  const earnedRelicIds = useMemo(
    () => normalizeRelicIds(earnedRelics),
    [earnedRelics],
  );

  const returnedRelics = useMemo(
    () =>
      finaleRelics.filter((relic) =>
        earnedRelicIds.includes(relic.id),
      ),
    [earnedRelicIds],
  );

  const relicOwnerIds = useMemo(() => {
    const ownerIds = new Set();

    for (const [playerId, progress] of Object.entries(playerProgress ?? {})) {
      const relicIds = Array.isArray(progress?.relics) ? progress.relics : [];

      if (relicIds.some((relicId) => earnedRelicIds.includes(relicId))) {
        ownerIds.add(playerId);
      }
    }

    return ownerIds;
  }, [earnedRelicIds, playerProgress]);

  const relicTargetGuests = useMemo(() => {
    const ownedGuests = multiplayerGuests.filter((guest) =>
      relicOwnerIds.has(guest.id),
    );

    return ownedGuests.length > 0 ? ownedGuests : multiplayerGuests;
  }, [multiplayerGuests, relicOwnerIds]);

  const gloryRatio =
    maximumGlory > 0
      ? Math.max(0, Math.min(1, displayedGlory / maximumGlory))
      : 0;

  function getFinalResponsesForPrompt(prompt) {
    const targetIds = new Set(prompt?.targetPlayerIds ?? []);
    const currentGuestIds = new Set(multiplayerGuests.map((guest) => guest.id));
    const responsesByPlayerId = new Map();

    for (const response of multiplayer?.responses ?? []) {
      if (
        response.prompt_id !== prompt?.id ||
        response.response_key !== "final" ||
        !targetIds.has(response.player_id) ||
        !currentGuestIds.has(response.player_id)
      ) {
        continue;
      }

      responsesByPlayerId.set(response.player_id, response);
    }

    return {
      responses: Array.from(responsesByPlayerId.values()),
      connectedTargetIds: (prompt?.targetPlayerIds ?? []).filter((playerId) =>
        currentGuestIds.has(playerId),
      ),
    };
  }

  function publishFinalePrompt({ key, type, targetGuests, payload }) {
    if (
      !multiplayerEnabled ||
      !targetGuests.length ||
      completedPromptKeysRef.current.has(key) ||
      publishingPromptKeyRef.current === key
    ) {
      return;
    }

    const activePrompt = multiplayer?.activePrompt;

    if (activePrompt?.sourceCueId === key) {
      return;
    }

    const promptId =
      globalThis.crypto?.randomUUID?.() ?? `${key}-${Date.now()}`;

    publishingPromptKeyRef.current = key;

    Promise.resolve(
      multiplayer?.publishPrompt?.({
        id: promptId,
        cueId: key,
        sourceCueId: key,
        chapterId: finaleChapterId,
        type,
        status: "open",
        targetPlayerIds: targetGuests.map((guest) => guest.id),
        targetPlayerNames: targetGuests.map((guest) => guest.name),
        payload,
        createdAt: new Date().toISOString(),
      }),
    )
      .catch((error) => {
        console.error("Unable to publish finale prompt", error);
      })
      .finally(() => {
        if (publishingPromptKeyRef.current === key) {
          publishingPromptKeyRef.current = null;
        }
      });
  }

  function finalePromptComplete(key, onCompletePrompt) {
    const activePrompt = multiplayer?.activePrompt;

    if (
      !activePrompt ||
      activePrompt.sourceCueId !== key ||
      completedPromptKeysRef.current.has(key)
    ) {
      return false;
    }

    const { responses, connectedTargetIds } =
      getFinalResponsesForPrompt(activePrompt);
    const complete =
      connectedTargetIds.length > 0 &&
      connectedTargetIds.every((playerId) =>
        responses.some((response) => response.player_id === playerId),
      );

    if (!complete) {
      return false;
    }

    completedPromptKeysRef.current.add(key);

    Promise.resolve(multiplayer?.clearPrompt?.(activePrompt.id))
      .catch((error) => {
        console.error("Unable to clear finale prompt", error);
      })
      .finally(onCompletePrompt);

    return true;
  }

  const guestIsVisible = [
    "doorway",
    "invitation",
    "guest",
    "guest-seated",
    "title-reveal",
    "confetti",
    "closing",
    "complete",
  ].includes(phase);

  const guestIsSeated = [
    "guest-seated",
    "title-reveal",
    "confetti",
    "closing",
    "complete",
  ].includes(phase);

  const celebrationIsRestored = [
    "recognition",
    "doorway",
    "invitation",
    "guest",
    "guest-seated",
    "title-reveal",
    "confetti",
    "closing",
    "complete",
  ].includes(phase);

  function moveToNextCue() {
    if (sequenceIndex >= finale.sequence.length - 1) {
      setIsComplete(true);
      onComplete?.();
      return;
    }

    setSequenceIndex((current) => current + 1);
  }

  function handleNarrationContinue() {
    if (currentCue?.id === "finale-invitation-five" && multiplayerEnabled) {
      return;
    }

    moveToNextCue();
  }

  useEffect(() => {
    if (phase !== "relics") {
      return undefined;
    }

    if (multiplayerEnabled) {
      publishFinalePrompt({
        key: currentCue.id,
        type: "finaleRelics",
        targetGuests: relicTargetGuests,
        payload: {
          eyebrow: "Finale",
          title:
            relicOwnerIds.size > 0
              ? "Return What You Carried"
              : "Return the Relics Together",
          prompt: "Everything carried through the story can come home now.",
          confirmLabel:
            relicOwnerIds.size > 0
              ? "Return the Relic"
              : "Return the Relics Together",
          options: [
            {
              id: "return-relic",
              label:
                relicOwnerIds.size > 0
                  ? "Return the Relic"
                  : "Return the Relics Together",
            },
          ],
        },
      });

      const activePrompt = multiplayer?.activePrompt;

      if (activePrompt?.sourceCueId === currentCue.id) {
        const { responses, connectedTargetIds } =
          getFinalResponsesForPrompt(activePrompt);
        const ratio =
          connectedTargetIds.length > 0
            ? responses.length / connectedTargetIds.length
            : 0;

        setReturnedRelicCount(
          Math.min(
            returnedRelics.length,
            Math.round(ratio * returnedRelics.length),
          ),
        );
      }

      finalePromptComplete(currentCue.id, () => {
        setReturnedRelicCount(returnedRelics.length);
        window.setTimeout(moveToNextCue, 700);
      });

      return undefined;
    }

    if (returnedRelicCount >= returnedRelics.length) {
      const completionTimer = window.setTimeout(
        moveToNextCue,
        1000,
      );

      return () => window.clearTimeout(completionTimer);
    }

    const relicTimer = window.setTimeout(() => {
      setReturnedRelicCount((current) => current + 1);
    }, 1200);

    return () => window.clearTimeout(relicTimer);
  }, [
    phase,
    currentCue?.id,
    multiplayerEnabled,
    multiplayer?.activePrompt,
    multiplayer?.responses,
    returnedRelicCount,
    returnedRelics.length,
    relicOwnerIds.size,
    relicTargetGuests,
  ]);

  useEffect(() => {
    if (phase !== "glory") {
      return undefined;
    }

    if (multiplayerEnabled) {
      publishFinalePrompt({
        key: currentCue.id,
        type: "finaleGlory",
        targetGuests: multiplayerGuests,
        payload: {
          eyebrow: "Finale",
          title: "Send Your Glory",
          prompt: "Everything you restored belongs to the celebration now.",
          confirmLabel: "Send My Glory",
          options: [
            {
              id: "send-glory",
              label: "Send My Glory",
              description:
                "Everything you restored belongs to the celebration now.",
            },
          ],
        },
      });

      const activePrompt = multiplayer?.activePrompt;

      if (activePrompt?.sourceCueId === currentCue.id) {
        const { responses, connectedTargetIds } =
          getFinalResponsesForPrompt(activePrompt);
        const ratio =
          connectedTargetIds.length > 0
            ? responses.length / connectedTargetIds.length
            : 0;

        setGloryReturnCount(responses.length);
        setDisplayedGlory(Math.round(glory * ratio));
      }

      finalePromptComplete(currentCue.id, () => {
        setDisplayedGlory(glory);
        window.setTimeout(moveToNextCue, 700);
      });

      return undefined;
    }

    setDisplayedGlory(glory);
    const gloryTimer = window.setTimeout(moveToNextCue, 2400);

    return () => window.clearTimeout(gloryTimer);
  }, [
    currentCue?.id,
    glory,
    multiplayer?.activePrompt,
    multiplayer?.responses,
    multiplayerEnabled,
    phase,
  ]);

  useEffect(() => {
    if (currentCue?.id !== "finale-invitation-five" || !multiplayerEnabled) {
      return;
    }

    publishFinalePrompt({
      key: currentCue.id,
      type: "finaleMakeRoom",
      targetGuests: multiplayerGuests,
      payload: {
        eyebrow: "Finale",
        title: "Make Room",
        prompt: "The table is waiting.",
        confirmLabel: "Make Room at the Table",
        options: [
          {
            id: "make-room",
            label: "Make Room at the Table",
          },
        ],
      },
    });

    const activePrompt = multiplayer?.activePrompt;

    if (activePrompt?.sourceCueId === currentCue.id) {
      const { responses } = getFinalResponsesForPrompt(activePrompt);
      setMakeRoomCount(responses.length);
    }

    finalePromptComplete(currentCue.id, () => {
      window.setTimeout(moveToNextCue, 500);
    });
  }, [
    currentCue?.id,
    multiplayer?.activePrompt,
    multiplayer?.responses,
    multiplayerEnabled,
  ]);

  const dimBrightness = 0.72;
  const restoredBrightness = 0.9 + gloryRatio * 0.18;
  const dimSaturation = 0.78;
  const restoredSaturation = 0.94 + gloryRatio * 0.28;
  const gloryOpacity = 0.18 + gloryRatio * 0.58;
  const candleOpacity = 0.34 + gloryRatio * 0.28;

  const sceneClassName = [
    "finale-scene",
    `finale-scene--${phase}`,
    celebrationIsRestored
      ? "finale-scene--restored"
      : "",
    guestIsVisible ? "finale-scene--guest-visible" : "",
    guestIsSeated ? "finale-scene--guest-seated" : "",
    isComplete ? "finale-scene--complete" : "",
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <main
      className={sceneClassName}
      style={{
        "--finale-dim-brightness": dimBrightness,
        "--finale-restored-brightness": restoredBrightness,
        "--finale-dim-saturation": dimSaturation,
        "--finale-restored-saturation": restoredSaturation,
        "--finale-glory-opacity": gloryOpacity,
        "--finale-candle-opacity": candleOpacity,
      }}
    >
      <div className="finale-scene__artwork">
        <img
          className="finale-scene__base"
          src={finale.heroImage}
          alt="The restored birthday ballroom with one empty chair"
        />

        <div
          className="finale-scene__glory"
          aria-hidden="true"
        />

        <div
          className="finale-scene__candlelight"
          aria-hidden="true"
        />

        <div
          className="finale-scene__doorway-shadow"
          aria-hidden="true"
        />

        <img
          className="finale-scene__guest"
          src={finale.uninvitedGuestImage}
          alt="The Uninvited Guest taking the final place at the table"
        />

        <div
          className="finale-scene__relics"
          aria-hidden="true"
        >
          {returnedRelics.map((relic, index) => (
            <img
              key={relic.id}
              className={[
                "finale-relic",
                relic.className,
                index < returnedRelicCount
                  ? "finale-relic--returned"
                  : "",
              ]
                .filter(Boolean)
                .join(" ")}
              src={relic.image}
              alt=""
            />
          ))}
        </div>

        <div
          className="finale-scene__confetti"
          aria-hidden="true"
        />

        {phase === "relics" && (
          <p className="finale-scene__interstitial">
            Everything the Guests carried begins to return.
          </p>
        )}

        {phase === "glory" && (
          <div
            className="finale-glory-return"
            aria-live="polite"
          >
            <span className="finale-glory-return__label">
              Glory Returns
            </span>
            <strong className="finale-glory-return__amount">
              {displayedGlory}
            </strong>
            <p>
              {multiplayerEnabled
                ? `${gloryReturnCount} of ${multiplayerGuests.length} Guests have sent their Glory.`
                : "Every act of hope becomes part of the celebration."}
            </p>
          </div>
        )}

        {currentCue?.text && (
          <section
            className="finale-narration"
            aria-live="polite"
          >
            <p>{currentCue.text}</p>

            <button
              type="button"
              className="finale-narration__continue"
              onClick={handleNarrationContinue}
              disabled={
                currentCue.id === "finale-invitation-five" &&
                multiplayerEnabled
              }
            >
              {currentCue.id === "finale-invitation-five" && multiplayerEnabled
                ? `${makeRoomCount} of ${multiplayerGuests.length} Guests`
                : "Continue"}
            </button>
          </section>
        )}

        {isComplete && (
          <section className="finale-ending">
            <h1>The Forgotten Birthday</h1>
            <p>No place remained empty.</p>
          </section>
        )}
      </div>
    </main>
  );
}

export default FinaleScene;
