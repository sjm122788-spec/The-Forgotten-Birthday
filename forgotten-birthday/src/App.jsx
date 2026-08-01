import {
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";

import StorybookMap from "./components/Storybook/StorybookMap";
import ChapterTransition from "./components/ChapterTransition/ChapterTransition";
import ChapterScene from "./components/Chapter/ChapterScene";
import QuietAfter from "./components/QuietAfter/QuietAfter";
import FinaleScene from "./components/Finale/FinaleScene";
import Prologue from "./components/prologue/Prologue";
import BackgroundMusic from "./components/BackgroundMusic/BackgroundMusic";
import RoleSelect from "./components/Multiplayer/RoleSelect";
import HostLobby from "./components/Multiplayer/HostLobby";
import GuestJoin from "./components/Multiplayer/GuestJoin";
import GuestWaiting from "./components/Multiplayer/GuestWaiting";

import { chapters, chapterById } from "./data/chapters";
import {
  clearGame,
  loadGame,
  saveGame,
} from "./services/gamePersistence";
import {
  clearActivePrompt,
  clearMultiplayerIdentity,
  createGameSession,
  findSessionByRoomCode,
  getGameSession,
  getSessionPlayers,
  getStoredMultiplayerIdentity,
  joinGameSession,
  leaveChannel,
  setActivePrompt,
  setStoredMultiplayerIdentity,
  startGameSession,
  submitPlayerResponse,
  getPromptResponses,
  subscribeToPromptResponses,
  subscribeToGameSession,
  subscribeToSessionPlayers,
  updateActivePrompt,
  updateGameSessionState,
} from "./services/multiplayerSession";

import "./App.css";

const SCREENS = {
  PROLOGUE: "prologue",
  STORYBOOK: "storybook",
  MEMORY_WINDOW: "memory-window",
  CHAPTER: "chapter",
  QUIET_AFTER: "quiet-after",
  FINALE: "finale",
};
const DEV_MODE = import.meta.env.DEV;
const FINALE_CHAPTER_ID = "finale";
const FINALE_FALLBACK_RELICS = [
  "candle-of-first-light",
  "laughter-balloon",
  "ribbon-of-belonging",
  "pocket-watch-of-lost-time",
  "open-seal",
];

function isObject(value) {
  return value !== null && typeof value === "object" && !Array.isArray(value);
}

function createFreshState() {
  return {
    screen: SCREENS.PROLOGUE,
    selectedChapterId: chapters[0]?.id ?? "chapter-01",
    completedChapterIds: [],
    activeChapterIndex: 0,
    unlockingChapterId: null,
    glory: 0,
    relics: [],
    players: [],
    decisions: {},
    secretChoices: {},
    chapterState: {},
    progression: {},
    playerProgress: {},
  };
}

function normalizeScreen(screen, chapterId, transitionChapter) {
  if (transitionChapter?.id) {
    return SCREENS.CHAPTER;
  }

  if (screen === SCREENS.PROLOGUE || screen === "prologue") {
    return SCREENS.PROLOGUE;
  }

  if (
    screen === SCREENS.CHAPTER ||
    screen === "chapter" ||
    screen === "memory-window" ||
    screen === "memoryWindow" ||
    screen === "transition" ||
    screen === "chapter-entry" ||
    screen === "chapter-entry-animation" ||
    screen === "chapter-exit-animation"
  ) {
    return SCREENS.CHAPTER;
  }

  if (
    screen === SCREENS.QUIET_AFTER ||
    screen === "quiet-after" ||
    screen === "quietAfter"
  ) {
    return SCREENS.QUIET_AFTER;
  }

  if (
    screen === SCREENS.FINALE ||
    screen === "finale" ||
    screen === "finale-entry"
  ) {
    return SCREENS.FINALE;
  }

  if (chapterId) {
    return SCREENS.CHAPTER;
  }

  return SCREENS.STORYBOOK;
}

function getInitialAppState() {
  const savedGame = loadGame();

  if (!savedGame) {
    return {
      ...createFreshState(),
      showResumeScreen: false,
    };
  }

  const completedChapterIds = Array.isArray(savedGame.completedChapters)
    ? savedGame.completedChapters.filter((chapterId) => chapterById[chapterId])
    : [];

  const progression = isObject(savedGame.progression)
    ? savedGame.progression
    : {};

  const selectedChapterId =
    typeof savedGame.chapterId === "string" && chapterById[savedGame.chapterId]
      ? savedGame.chapterId
      : chapters[0]?.id ?? "chapter-01";

  const activeChapterIndex = Number.isInteger(progression.activeChapterIndex)
    ? Math.min(
        chapters.length - 1,
        Math.max(0, progression.activeChapterIndex),
      )
    : Math.min(chapters.length - 1, Math.max(0, completedChapterIds.length));

  return {
    ...createFreshState(),
    screen: normalizeScreen(savedGame.screen, selectedChapterId, null),
    selectedChapterId,
    completedChapterIds,
    activeChapterIndex,
    unlockingChapterId:
      typeof progression.unlockingChapterId === "string"
        ? progression.unlockingChapterId
        : null,
    glory: typeof savedGame.glory === "number" ? savedGame.glory : 0,
    relics: Array.isArray(savedGame.relics) ? savedGame.relics : [],
    players: Array.isArray(savedGame.players) ? savedGame.players : [],
    decisions: isObject(savedGame.decisions) ? savedGame.decisions : {},
    secretChoices: isObject(savedGame.secretChoices)
      ? savedGame.secretChoices
      : {},
    chapterState: isObject(savedGame.chapterState)
      ? savedGame.chapterState
      : {},
    progression,
    playerProgress: isObject(savedGame.playerProgress)
      ? savedGame.playerProgress
      : {},
    showResumeScreen: true,
  };
}

function App() {
  const initialAppState = getInitialAppState();

  const [screen, setScreen] = useState(initialAppState.screen);
  const [selectedChapterId, setSelectedChapterId] = useState(
    initialAppState.selectedChapterId,
  );
  const [completedChapterIds, setCompletedChapterIds] = useState(
    initialAppState.completedChapterIds,
  );
  const [activeChapterIndex, setActiveChapterIndex] = useState(
    initialAppState.activeChapterIndex,
  );
  const [unlockingChapterId, setUnlockingChapterId] = useState(
    initialAppState.unlockingChapterId,
  );
  const [transitionChapter, setTransitionChapter] = useState(null);
  const [transitionOrigin, setTransitionOrigin] = useState(null);
  const [showResumeScreen, setShowResumeScreen] = useState(
    initialAppState.showResumeScreen,
  );
  const [glory, setGlory] = useState(initialAppState.glory);
  const [relics, setRelics] = useState(initialAppState.relics);
  const [players, setPlayers] = useState(initialAppState.players);
  const [decisions, setDecisions] = useState(initialAppState.decisions);
  const [secretChoices, setSecretChoices] = useState(
    initialAppState.secretChoices,
  );
  const [chapterState, setChapterState] = useState(initialAppState.chapterState);
  const [progression, setProgression] = useState(initialAppState.progression);
  const [playerProgress, setPlayerProgress] = useState(
    initialAppState.playerProgress,
  );

  const [multiplayerRole, setMultiplayerRole] = useState(null);
  const [multiplayerSession, setMultiplayerSession] = useState(null);
  const [multiplayerPlayer, setMultiplayerPlayer] = useState(null);
  const [multiplayerGuests, setMultiplayerGuests] = useState([]);
  const [multiplayerLoading, setMultiplayerLoading] = useState(true);
  const [multiplayerBusy, setMultiplayerBusy] = useState(false);
  const [multiplayerError, setMultiplayerError] = useState("");
  const [activePromptResponses, setActivePromptResponses] = useState([]);
  const [guestPromptError, setGuestPromptError] = useState("");
  const [adminOpen, setAdminOpen] = useState(false);

  const selectedChapter = chapterById[selectedChapterId] ?? chapters[0];
  const activeChapterId = chapters[activeChapterIndex]?.id ?? null;
  const canUseAdmin =
    multiplayerRole !== "guest" &&
    !multiplayerLoading;
  const currentChapterIndex = chapters.findIndex(
    (chapter) => chapter.id === selectedChapterId,
  );
  const nextChapter =
    currentChapterIndex >= 0 ? chapters[currentChapterIndex + 1] : null;

  const completedChapterIdSet = useMemo(
    () => new Set(completedChapterIds),
    [completedChapterIds],
  );

  const hasSavedStateRef = useRef(false);
  const lastHostSyncRef = useRef(null);
  const activePromptRef = useRef(null);
  const adminTapRef = useRef({
    count: 0,
    timerId: null,
  });
  const promptWriteQueueRef = useRef(Promise.resolve());
  const sessionChannelRef = useRef(null);
  const playersChannelRef = useRef(null);
  const responsesChannelRef = useRef(null);

  useEffect(() => {
    function handleAdminShortcut(event) {
      if (!canUseAdmin) {
        return;
      }

      const key = event.key.toLowerCase();
      const isOriginalShortcut =
        event.ctrlKey && event.shiftKey && key === "a";
      const isPartyShortcut =
        event.altKey && event.shiftKey && key === "k";

      if (isOriginalShortcut || isPartyShortcut) {
        event.preventDefault();
        event.stopPropagation();
        setAdminOpen((isOpen) => !isOpen);
      }
    }

    window.addEventListener("keydown", handleAdminShortcut);

    return () => {
      window.removeEventListener("keydown", handleAdminShortcut);
    };
  }, [canUseAdmin]);

  useEffect(() => {
    return () => {
      if (adminTapRef.current.timerId) {
        window.clearTimeout(adminTapRef.current.timerId);
      }
    };
  }, []);

  useEffect(() => {
    if (players.length === 0) {
      return;
    }

    setPlayerProgress((currentProgress) => {
      let changed = false;
      const nextProgress = { ...currentProgress };

      players.forEach((player) => {
        if (!player?.id || nextProgress[player.id]) {
          return;
        }

        nextProgress[player.id] = {
          glory: 0,
          relics: [],
        };
        changed = true;
      });

      return changed ? nextProgress : currentProgress;
    });
  }, [players]);

  useEffect(() => {
    let cancelled = false;

    async function restoreMultiplayerSession() {
      const storedIdentity = getStoredMultiplayerIdentity();

      if (!storedIdentity?.sessionId) {
        if (!cancelled) {
          setMultiplayerLoading(false);
          setShowResumeScreen(false);
          setMultiplayerRole(null);
        }
        return;
      }

      try {
        const session = await getGameSession(storedIdentity.sessionId);

        if (!session || cancelled) {
          return;
        }

        if (storedIdentity.role === "host") {
          setMultiplayerRole("host");
          setMultiplayerSession(session);
          setMultiplayerPlayer(null);
          setMultiplayerError("");
          setShowResumeScreen(false);

          const guestRows = await getSessionPlayers(session.id);
          if (!cancelled) {
            setMultiplayerGuests(guestRows);
            setPlayers(guestRows);
          }
        } else if (storedIdentity.role === "guest") {
          setMultiplayerRole("guest");
          setMultiplayerSession(session);
          setMultiplayerPlayer({
            id: storedIdentity.playerId,
            name: storedIdentity.playerName || "Guest",
            role: "guest",
          });
          setMultiplayerError("");
          setShowResumeScreen(false);

          const guestRows = await getSessionPlayers(session.id);
          if (!cancelled) {
            setMultiplayerGuests(guestRows);
            setPlayers(guestRows);
          }
        } else {
          if (!cancelled) {
            clearMultiplayerIdentity();
            setMultiplayerRole(null);
            setMultiplayerSession(null);
            setMultiplayerPlayer(null);
            setMultiplayerGuests([]);
          }
        }
      } catch (error) {
        console.error("Unable to restore multiplayer session", error);

        if (!cancelled) {
          setMultiplayerError("We could not reopen that room. Please start again.");
          clearMultiplayerIdentity();
          setMultiplayerRole(null);
          setMultiplayerSession(null);
          setMultiplayerPlayer(null);
          setMultiplayerGuests([]);
          setShowResumeScreen(false);
        }
      } finally {
        if (!cancelled) {
          setMultiplayerLoading(false);
        }
      }
    }

    restoreMultiplayerSession();

    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    if (!multiplayerSession?.id) {
      if (sessionChannelRef.current) {
        leaveChannel(sessionChannelRef.current);
        sessionChannelRef.current = null;
      }

      if (playersChannelRef.current) {
        leaveChannel(playersChannelRef.current);
        playersChannelRef.current = null;
      }

      if (responsesChannelRef.current) {
        leaveChannel(responsesChannelRef.current);
        responsesChannelRef.current = null;
      }

      return undefined;
    }

    if (sessionChannelRef.current) {
      leaveChannel(sessionChannelRef.current);
      sessionChannelRef.current = null;
    }

    if (playersChannelRef.current) {
      leaveChannel(playersChannelRef.current);
      playersChannelRef.current = null;
    }

    if (responsesChannelRef.current) {
      leaveChannel(responsesChannelRef.current);
      responsesChannelRef.current = null;
    }

    const sessionChannel = subscribeToGameSession(multiplayerSession.id, (sessionPayload) => {
      const nextSession = sessionPayload?.new ?? sessionPayload;
      if (!nextSession) {
        return;
      }

      activePromptRef.current = nextSession.active_prompt ?? null;
      setMultiplayerSession(nextSession);
    });

    const playersChannel = subscribeToSessionPlayers(
      multiplayerSession.id,
      async () => {
        try {
          const guestRows = await getSessionPlayers(multiplayerSession.id);

          setMultiplayerGuests(guestRows);
          setPlayers(guestRows);
        } catch (error) {
          console.error("Unable to refresh guest list", error);
        }
      },
    );

    const responsesChannel = subscribeToPromptResponses(
      multiplayerSession.id,
      (payload) => {
        const nextResponse = payload?.new;
        const oldResponse = payload?.old;

        if (nextResponse?.id) {
          setActivePromptResponses((currentResponses) => [
            ...currentResponses.filter((item) => item.id !== nextResponse.id),
            nextResponse,
          ]);
          return;
        }

        if (oldResponse?.id) {
          setActivePromptResponses((currentResponses) =>
            currentResponses.filter((item) => item.id !== oldResponse.id),
          );
        }
      },
    );

    sessionChannelRef.current = sessionChannel;
    playersChannelRef.current = playersChannel;
    responsesChannelRef.current = responsesChannel;

    return () => {
      if (sessionChannelRef.current) {
        leaveChannel(sessionChannelRef.current);
        sessionChannelRef.current = null;
      }

      if (playersChannelRef.current) {
        leaveChannel(playersChannelRef.current);
        playersChannelRef.current = null;
      }

      if (responsesChannelRef.current) {
        leaveChannel(responsesChannelRef.current);
        responsesChannelRef.current = null;
      }
    };
  }, [multiplayerSession?.id]);

  useEffect(() => {
  const sessionId = multiplayerSession?.id;
  const activePromptId =
    multiplayerSession?.active_prompt?.id;

  if (
    multiplayerRole !== "host" ||
    !sessionId ||
    !activePromptId
  ) {
    setActivePromptResponses([]);
    return undefined;
  }

  let cancelled = false;
  let requestInFlight = false;

  async function refreshPromptResponses() {
    if (requestInFlight) {
      return;
    }

    requestInFlight = true;

    try {
      const responses = await getPromptResponses({
        sessionId,
        promptId: activePromptId,
      });

      if (!cancelled) {
        setActivePromptResponses(responses);
      }
    } catch (error) {
      console.error("Unable to load phone responses", error);
    } finally {
      requestInFlight = false;
    }
  }

  void refreshPromptResponses();

  const intervalId = window.setInterval(
    refreshPromptResponses,
    1000,
  );

  return () => {
    cancelled = true;
    window.clearInterval(intervalId);
  };
}, [
  multiplayerRole,
  multiplayerSession?.id,
  multiplayerSession?.active_prompt?.id,
]);

  useEffect(() => {
    if (multiplayerRole !== "host" || !multiplayerSession?.id || multiplayerSession.status !== "playing") {
      return;
    }

    const nextHostState = {
      current_screen: screen,
      current_chapter_id:
        screen === SCREENS.CHAPTER
          ? selectedChapterId
          : screen === SCREENS.FINALE
            ? FINALE_CHAPTER_ID
            : null,
      game_state: {
        completedChapterIds,
        activeChapterIndex,
        unlockingChapterId,
        glory,
        relics,
        playerProgress,
        players: players.map((player) => ({
          id: player.id,
          name: player.name,
          role: player.role ?? "guest",
        })),
      },
    };

    const serializedState = JSON.stringify(nextHostState);

    if (lastHostSyncRef.current === serializedState) {
      return;
    }

    lastHostSyncRef.current = serializedState;

    void updateGameSessionState(multiplayerSession.id, {
      current_screen: nextHostState.current_screen,
      current_chapter_id: nextHostState.current_chapter_id,
      game_state: nextHostState.game_state,
    }).catch((error) => {
      console.error("Unable to sync the host session state", error);
    });
  }, [
    activeChapterIndex,
    completedChapterIds,
    glory,
    multiplayerRole,
    multiplayerSession?.id,
    multiplayerSession?.status,
    players,
    playerProgress,
    relics,
    screen,
    selectedChapterId,
    unlockingChapterId,
  ]);

  useEffect(() => {
    if (!hasSavedStateRef.current) {
      hasSavedStateRef.current = true;
      return;
    }

    if (showResumeScreen) {
      return;
    }

    const isFreshState =
      screen === SCREENS.PROLOGUE &&
      selectedChapterId === (chapters[0]?.id ?? "chapter-01") &&
      completedChapterIds.length === 0 &&
      activeChapterIndex === 0 &&
      unlockingChapterId === null &&
      glory === 0 &&
      relics.length === 0 &&
      players.length === 0 &&
      Object.keys(decisions).length === 0 &&
      Object.keys(secretChoices).length === 0 &&
      Object.keys(chapterState).length === 0 &&
      Object.keys(progression).length === 0 &&
      Object.keys(playerProgress).length === 0;

    if (isFreshState) {
      return;
    }

    const saveState = {
      screen: transitionChapter?.id ? SCREENS.CHAPTER : screen,
      chapterId:
        transitionChapter?.id ??
        (screen === SCREENS.CHAPTER ? selectedChapterId : null),
      completedChapters: completedChapterIds,
      cueIndex: 0,
      players,
      glory,
      relics,
      chapterState,
      decisions,
      secretChoices,
      playerProgress,
      progression: {
        activeChapterIndex,
        unlockingChapterId,
      },
    };

    saveGame(saveState);
  }, [
    activeChapterIndex,
    chapterState,
    completedChapterIds,
    decisions,
    glory,
    players,
    progression,
    playerProgress,
    relics,
    screen,
    secretChoices,
    selectedChapterId,
    showResumeScreen,
    transitionChapter,
    unlockingChapterId,
  ]);

  function resetToFreshState() {
    setScreen(SCREENS.PROLOGUE);
    setSelectedChapterId(chapters[0]?.id ?? "chapter-01");
    setCompletedChapterIds([]);
    setActiveChapterIndex(0);
    setUnlockingChapterId(null);
    setTransitionChapter(null);
    setTransitionOrigin(null);
    setShowResumeScreen(false);
    setGlory(0);
    setRelics([]);
    setPlayers([]);
    setDecisions({});
    setSecretChoices({});
    setChapterState({});
    setProgression({});
    setPlayerProgress({});
    clearGame();
  }

  function resetMultiplayerState() {
    setMultiplayerRole(null);
    setMultiplayerSession(null);
    setMultiplayerPlayer(null);
    setMultiplayerGuests([]);
    setMultiplayerBusy(false);
    setMultiplayerError("");
    setActivePromptResponses([]);
    setGuestPromptError("");
    clearMultiplayerIdentity();
  }

  async function handleCreateRoom() {
    setMultiplayerBusy(true);
    setMultiplayerError("");

    try {
      const session = await createGameSession();
      setStoredMultiplayerIdentity({
        role: "host",
        sessionId: session.id,
        roomCode: session.room_code,
        hostToken: session.host_token,
      });

      setMultiplayerRole("host");
      setMultiplayerSession(session);
      setMultiplayerPlayer(null);
      setMultiplayerGuests([]);
      setShowResumeScreen(false);
    } catch (error) {
      console.error("Unable to create a multiplayer room", error);
      setMultiplayerError("The room could not be created. Please try again.");
    } finally {
      setMultiplayerBusy(false);
    }
  }

  async function handleJoinGuest({ roomCode, name }) {
    const normalizedRoomCode = String(roomCode ?? "").trim().toUpperCase();
    const trimmedName = String(name ?? "").trim();

    if (!normalizedRoomCode) {
      setMultiplayerError("Please enter the room code.");
      return;
    }

    if (!trimmedName) {
      setMultiplayerError("Please enter your name.");
      return;
    }

    setMultiplayerBusy(true);
    setMultiplayerError("");

    try {
      const session = await findSessionByRoomCode(normalizedRoomCode);

      if (!session) {
        setMultiplayerError("No room was found for that code.");
        return;
      }

      if (session.status !== "lobby") {
        setMultiplayerError("The story is already underway. Please wait for the host.");
        return;
      }

      const player = await joinGameSession({ sessionId: session.id, name: trimmedName });
      setStoredMultiplayerIdentity({
        role: "guest",
        sessionId: session.id,
        roomCode: session.room_code,
        playerId: player.id,
        playerName: player.name,
      });

      const guestRows = await getSessionPlayers(session.id);
      setMultiplayerRole("guest");
      setMultiplayerSession(session);
      setMultiplayerPlayer(player);
      setMultiplayerGuests(guestRows);
      setPlayers(guestRows);
      setShowResumeScreen(false);
    } catch (error) {
  console.error("Unable to join the multiplayer room", error);

  setMultiplayerError(
    error?.message
      ? `Join failed: ${error.message}`
      : "We could not join that room. Please try again.",
  );
}
  }

  async function handleStartStory() {
    if (!multiplayerSession?.id || multiplayerGuests.length === 0) {
      return;
    }

    setMultiplayerBusy(true);
    setMultiplayerError("");

    try {
      const nextSession = await startGameSession(multiplayerSession.id);
      setMultiplayerSession(nextSession);
      setScreen(SCREENS.PROLOGUE);
      setShowResumeScreen(false);
      setTransitionChapter(null);
      setTransitionOrigin(null);
    } catch (error) {
      console.error("Unable to start the story", error);
      setMultiplayerError("The story could not be started. Please try again.");
    } finally {
      setMultiplayerBusy(false);
    }
  }

  function enqueuePromptWrite(operation) {
    const queuedOperation = promptWriteQueueRef.current.then(
      operation,
      operation,
    );

    promptWriteQueueRef.current = queuedOperation.catch(() => null);
    return queuedOperation;
  }

  async function handlePublishPhonePrompt(activePrompt) {
    if (!multiplayerSession?.id || multiplayerRole !== "host") {
      return null;
    }

    const sessionId = multiplayerSession.id;

    return enqueuePromptWrite(async () => {
      const updatedSession = await setActivePrompt(sessionId, activePrompt);

      activePromptRef.current = updatedSession?.active_prompt ?? activePrompt;
      setMultiplayerSession((currentSession) =>
        currentSession?.id === sessionId ? updatedSession : currentSession,
      );
      setActivePromptResponses([]);

      return updatedSession;
    });
  }

  async function handleUpdatePhonePrompt(promptId, updates = {}) {
    if (!multiplayerSession?.id || multiplayerRole !== "host" || !promptId) {
      return null;
    }

    const sessionId = multiplayerSession.id;

    return enqueuePromptWrite(async () => {
      let currentPrompt = activePromptRef.current;

      if (currentPrompt?.id !== promptId) {
        const freshSession = await getGameSession(sessionId);
        currentPrompt = freshSession?.active_prompt ?? null;

        if (freshSession) {
          activePromptRef.current = currentPrompt;
          setMultiplayerSession((currentSession) =>
            currentSession?.id === sessionId ? freshSession : currentSession,
          );
        }
      }

      if (currentPrompt?.id !== promptId) {
        return null;
      }

      const nextPrompt = {
        ...currentPrompt,
        ...updates,
        id: currentPrompt.id,
        payload: updates.payload
          ? {
              ...(currentPrompt.payload ?? {}),
              ...updates.payload,
            }
          : currentPrompt.payload,
        sharedState: updates.sharedState
          ? {
              ...(currentPrompt.sharedState ?? {}),
              ...updates.sharedState,
            }
          : currentPrompt.sharedState,
      };

      const updatedSession = await updateActivePrompt(
        sessionId,
        promptId,
        nextPrompt,
      );

      activePromptRef.current = updatedSession?.active_prompt ?? null;
      setMultiplayerSession((currentSession) =>
        currentSession?.id === sessionId ? updatedSession : currentSession,
      );

      return updatedSession;
    });
  }

  async function handleClearPhonePrompt(promptId) {
    if (!multiplayerSession?.id || multiplayerRole !== "host") {
      return null;
    }

    const sessionId = multiplayerSession.id;

    return enqueuePromptWrite(async () => {
      const updatedSession = await clearActivePrompt(sessionId, promptId);

      activePromptRef.current = updatedSession?.active_prompt ?? null;
      setMultiplayerSession((currentSession) =>
        currentSession?.id === sessionId ? updatedSession : currentSession,
      );

      if (!updatedSession?.active_prompt || updatedSession.active_prompt.id !== promptId) {
        setActivePromptResponses([]);
      }

      return updatedSession;
    });
  }

  useEffect(() => {
    activePromptRef.current = multiplayerSession?.active_prompt ?? null;
  }, [multiplayerSession?.active_prompt]);

  useEffect(() => {
    if (
      multiplayerRole !== "host" ||
      multiplayerSession?.status !== "playing" ||
      !multiplayerSession?.active_prompt?.id
    ) {
      return;
    }

    const prompt = multiplayerSession.active_prompt;
    const promptMatchesCurrentChapter =
      screen === SCREENS.CHAPTER &&
      prompt.chapterId === selectedChapterId;

    if (promptMatchesCurrentChapter) {
      return;
    }

    void handleClearPhonePrompt(prompt.id).catch((error) => {
      console.error("Unable to clear a prompt after leaving its chapter", error);
    });
  }, [
    multiplayerRole,
    multiplayerSession?.active_prompt?.chapterId,
    multiplayerSession?.active_prompt?.id,
    multiplayerSession?.status,
    screen,
    selectedChapterId,
  ]);

useEffect(() => {
  if (
    multiplayerRole !== "guest" ||
    !multiplayerSession?.id
  ) {
    return undefined;
  }

  let cancelled = false;
  let requestInFlight = false;

  async function refreshGuestSession() {
    if (requestInFlight) {
      return;
    }

    requestInFlight = true;

    try {
      const freshSession = await getGameSession(multiplayerSession.id);

      if (!cancelled && freshSession) {
        setMultiplayerSession((currentSession) => {
          const currentUpdatedAt = currentSession?.updated_at ?? "";
          const freshUpdatedAt = freshSession.updated_at ?? "";

          if (
            currentSession?.id === freshSession.id &&
            currentUpdatedAt === freshUpdatedAt
          ) {
            return currentSession;
          }

          return freshSession;
        });
      }
    } catch (error) {
      console.error("Unable to refresh guest session", error);
    } finally {
      requestInFlight = false;
    }
  }

  void refreshGuestSession();

  const intervalId = window.setInterval(
    refreshGuestSession,
    1000,
  );

  return () => {
    cancelled = true;
    window.clearInterval(intervalId);
  };
}, [multiplayerRole, multiplayerSession?.id]);
  async function handleSubmitGuestPrompt({
    promptId,
    cueId,
    responseType,
    responseKey = "final",
    responseData,
  }) {
    if (!multiplayerSession?.id || !multiplayerPlayer?.id) {
      throw new Error("Your guest seat could not be found.");
    }

    setGuestPromptError("");

    try {
      return await submitPlayerResponse({
        sessionId: multiplayerSession.id,
        playerId: multiplayerPlayer.id,
        promptId,
        cueId,
        responseType,
        responseKey,
        responseData,
      });
    } catch (error) {
      console.error("Unable to submit guest response", error);
      setGuestPromptError("Your choice did not reach the story. Please try again.");
      throw error;
    }
  }

  function handleAwardPlayerGlory(playerId, amount = 0) {
    const normalizedAmount = Number(amount);

    if (!playerId || !Number.isFinite(normalizedAmount) || normalizedAmount === 0) {
      return;
    }

    setPlayerProgress((currentProgress) => {
      const currentPlayer = currentProgress[playerId] ?? {
        glory: 0,
        relics: [],
      };

      return {
        ...currentProgress,
        [playerId]: {
          ...currentPlayer,
          glory: Math.max(0, (currentPlayer.glory ?? 0) + normalizedAmount),
          relics: Array.isArray(currentPlayer.relics)
            ? currentPlayer.relics
            : [],
        },
      };
    });

    setGlory((currentGlory) => Math.max(0, currentGlory + normalizedAmount));
  }

  function handleAwardPlayerRelic(playerId, relicId) {
    if (!playerId || !relicId) {
      return;
    }

    setPlayerProgress((currentProgress) => {
      const currentPlayer = currentProgress[playerId] ?? {
        glory: 0,
        relics: [],
      };
      const currentRelics = Array.isArray(currentPlayer.relics)
        ? currentPlayer.relics
        : [];

      if (currentRelics.includes(relicId)) {
        return currentProgress;
      }

      return {
        ...currentProgress,
        [playerId]: {
          ...currentPlayer,
          relics: [...currentRelics, relicId],
        },
      };
    });

    setRelics((currentRelics) =>
      currentRelics.includes(relicId)
        ? currentRelics
        : [...currentRelics, relicId],
    );
  }

  function handleLeaveRoom() {
    resetMultiplayerState();
  }

  function clearAdminPromptIfNeeded() {
    const promptId = multiplayerSession?.active_prompt?.id;

    if (!promptId || multiplayerRole !== "host") {
      return;
    }

    void handleClearPhonePrompt(promptId).catch((error) => {
      console.error("Unable to clear the active phone prompt", error);
    });
  }

  function handleAdminNavigate(navigate) {
    clearAdminPromptIfNeeded();
    setTransitionChapter(null);
    setTransitionOrigin(null);
    setShowResumeScreen(false);
    navigate();
    setAdminOpen(false);
  }

  function handleAdminOpenChapter(chapterId) {
    handleAdminNavigate(() => {
      handleDevOpenChapter(chapterId);
    });
  }

  function handleAdminCompleteCurrentChapter() {
    if (screen !== SCREENS.CHAPTER || !selectedChapter?.id) {
      return;
    }

    handleAdminNavigate(() => {
      handleCompleteChapter();
    });
  }

  function handleAdminClearPrompt() {
    clearAdminPromptIfNeeded();
    setAdminOpen(false);
  }

  function handleAdminHotspotTap() {
    if (!canUseAdmin) {
      return;
    }

    if (adminTapRef.current.timerId) {
      window.clearTimeout(adminTapRef.current.timerId);
    }

    const nextCount = adminTapRef.current.count + 1;

    if (nextCount >= 3) {
      adminTapRef.current.count = 0;
      adminTapRef.current.timerId = null;
      setAdminOpen(true);
      return;
    }

    adminTapRef.current.count = nextCount;
    adminTapRef.current.timerId = window.setTimeout(() => {
      adminTapRef.current.count = 0;
      adminTapRef.current.timerId = null;
    }, 1200);
  }

  function handleDevOpenChapter(chapterId) {
    const chapter = chapterById[chapterId];

    if (!chapter) {
      console.warn(`Unknown chapter selected: ${chapterId}`);
      return;
    }

    setSelectedChapterId(chapterId);
    setScreen(SCREENS.CHAPTER);
    setShowResumeScreen(false);
  }

  function handleDevOpenQuietAfter() {
    setScreen(SCREENS.QUIET_AFTER);
    setShowResumeScreen(false);
  }

  function handleDevOpenMap() {
    setScreen(SCREENS.STORYBOOK);
    setShowResumeScreen(false);
  }

  function handleDevOpenPrologue() {
    setScreen(SCREENS.PROLOGUE);
    setShowResumeScreen(false);
  }

  function handlePrologueComplete() {
    setScreen(SCREENS.STORYBOOK);
    setShowResumeScreen(false);
  }

  function handleDevOpenFinale() {
    setScreen(SCREENS.FINALE);
    setShowResumeScreen(false);
  }

  function handleContinueStory() {
    setShowResumeScreen(false);
  }

  function handleStartNewStory() {
    const wantsNewStory = window.confirm(
      "The old candlelight shutters close. Begin again with a fresh birthday?",
    );

    if (!wantsNewStory) {
      return;
    }

    resetToFreshState();
  }

  function handleClearSavedGame() {
    if (!window.confirm("Clear the saved story and return to a fresh start?")) {
      return;
    }

    resetToFreshState();
  }

  function handleSelectChapter(chapterId, origin) {
    const nextChapter = chapterById[chapterId];

    if (!nextChapter) {
      console.warn(`Unknown chapter selected: ${chapterId}`);
      return;
    }

    if (chapterId !== activeChapterId) {
      return;
    }

    if (transitionChapter) {
      return;
    }

    setUnlockingChapterId(null);
    setTransitionOrigin(origin ?? null);
    setTransitionChapter(nextChapter);
    setShowResumeScreen(false);
  }

  function handleTransitionCoveredScreen() {
    if (!transitionChapter) {
      return;
    }

    setSelectedChapterId(transitionChapter.id);
    setScreen(SCREENS.CHAPTER);
  }

  function handleTransitionFinished() {
    setTransitionChapter(null);
    setTransitionOrigin(null);
  }

  function markChapterComplete(chapterId) {
    setCompletedChapterIds((currentIds) => {
      if (currentIds.includes(chapterId)) {
        return currentIds;
      }

      return [...currentIds, chapterId];
    });
  }

  function unlockNextChapter(completedChapterId) {
    const completedIndex = chapters.findIndex(
      (chapter) => chapter.id === completedChapterId,
    );

    const nextChapter = chapters[completedIndex + 1];

    if (nextChapter) {
      setActiveChapterIndex(completedIndex + 1);
      setUnlockingChapterId(nextChapter.id);
    }

    setScreen(SCREENS.STORYBOOK);
  }

  function handleCompleteChapter() {
    const completedId = selectedChapter.id;

    markChapterComplete(completedId);

    if (completedId === "chapter-05") {
      setUnlockingChapterId(null);
      setScreen(SCREENS.QUIET_AFTER);
      return;
    }

    if (completedId === "chapter-11") {
      setUnlockingChapterId(null);
      setScreen(SCREENS.FINALE);
      return;
    }

    unlockNextChapter(completedId);
  }

  function handleQuietAfterComplete() {
    unlockNextChapter("chapter-05");
  }

  function renderScreen() {
    switch (screen) {
      case SCREENS.PROLOGUE:
        return (
          <Prologue
            connectedGuests={players.length}
            requiredGuests={0}
            devMode={DEV_MODE || multiplayerRole === "host"}
            onComplete={handlePrologueComplete}
          />
        );

      case SCREENS.CHAPTER:
        return (
          <ChapterScene
            chapter={selectedChapter}
            onCompleteChapter={handleCompleteChapter}
            multiplayer={{
              enabled:
                multiplayerRole === "host" &&
                multiplayerSession?.status === "playing",
              sessionId: multiplayerSession?.id ?? null,
              chapterId: selectedChapterId,
              guests: multiplayerGuests,
              activePrompt: multiplayerSession?.active_prompt ?? null,
              responses: activePromptResponses,
              publishPrompt: handlePublishPhonePrompt,
              updatePrompt: handleUpdatePhonePrompt,
              clearPrompt: handleClearPhonePrompt,
              playerProgress,
              awardPlayerGlory: handleAwardPlayerGlory,
              awardPlayerRelic: handleAwardPlayerRelic,
            }}
          />
        );

      case SCREENS.QUIET_AFTER:
        return <QuietAfter onComplete={handleQuietAfterComplete} />;

      case SCREENS.FINALE:
        return (
          <FinaleScene
            earnedRelics={
              relics.length === 0
                ? FINALE_FALLBACK_RELICS
                : relics
            }
            glory={glory === 0 ? 72 : glory}
            maximumGlory={100}
            playerProgress={playerProgress}
            multiplayer={{
              enabled:
                multiplayerRole === "host" &&
                multiplayerSession?.status === "playing",
              chapterId: FINALE_CHAPTER_ID,
              guests: multiplayerGuests,
              activePrompt: multiplayerSession?.active_prompt ?? null,
              responses: activePromptResponses,
              publishPrompt: handlePublishPhonePrompt,
              clearPrompt: handleClearPhonePrompt,
            }}
          />
        );

      case SCREENS.STORYBOOK:
      default:
        return (
          <StorybookMap
            chapters={chapters}
            activeChapterId={activeChapterId}
            completedChapterIds={[...completedChapterIdSet]}
            unlockingChapterId={unlockingChapterId}
            onSelectChapter={handleSelectChapter}
          />
        );
    }
  }

  const musicScreen = transitionChapter ? SCREENS.CHAPTER : screen;
  const musicChapterId =
    musicScreen === SCREENS.CHAPTER
      ? transitionChapter?.id ?? selectedChapterId
      : null;

  if (multiplayerLoading) {
    return (
      <div className="app">
        <main className="resume-screen">
          <div className="resume-screen__card">
            <p className="resume-screen__eyebrow">The room is waking</p>
            <h1 className="resume-screen__title">Checking the circle</h1>
          </div>
        </main>
      </div>
    );
  }

  if (!multiplayerRole && !multiplayerSession) {
    return (
      <RoleSelect
        onHostCreate={handleCreateRoom}
        onJoinGuest={() => {
          setMultiplayerRole("guest");
          setMultiplayerError("");
        }}
        loading={multiplayerBusy}
        error={multiplayerError}
      />
    );
  }

  if (multiplayerRole === "guest" && !multiplayerSession) {
    return (
      <GuestJoin
        onJoin={handleJoinGuest}
        onBack={handleLeaveRoom}
        loading={multiplayerBusy}
        error={multiplayerError}
      />
    );
  }

  if (multiplayerRole === "host" && multiplayerSession?.status === "lobby") {
    return (
      <div className="app">
        <BackgroundMusic
          screen={SCREENS.PROLOGUE}
          selectedChapterId={null}
        />

        <HostLobby
          roomCode={multiplayerSession.room_code}
          guests={multiplayerGuests}
          loading={multiplayerBusy}
          error={multiplayerError}
          onStartStory={handleStartStory}
          onLeaveRoom={handleLeaveRoom}
        />
      </div>
    );
  }

  if (multiplayerRole === "guest") {
    return (
      <GuestWaiting
        roomCode={multiplayerSession?.room_code ?? ""}
        playerId={multiplayerPlayer?.id ?? null}
        playerName={multiplayerPlayer?.name ?? "Guest"}
        guestCount={multiplayerGuests.length}
        started={multiplayerSession?.status === "playing"}
        currentChapterId={multiplayerSession?.current_chapter_id ?? null}
        activePrompt={multiplayerSession?.active_prompt ?? null}
        onSubmitPrompt={handleSubmitGuestPrompt}
        promptError={guestPromptError}
        onLeaveRoom={handleLeaveRoom}
      />
    );
  }

  if (showResumeScreen) {
    return (
      <div className="app">
        <main className="resume-screen">
          <div className="resume-screen__card">
            <p className="resume-screen__eyebrow">A candle still burns</p>
            <h1 className="resume-screen__title">Continue the story?</h1>
            <p className="resume-screen__copy">
              Pick up from the last saved point and return to the host’s table.
            </p>

            <div className="resume-screen__actions">
              <button type="button" onClick={handleContinueStory}>
                Continue Story
              </button>
              <button type="button" onClick={handleStartNewStory}>
                Start New Story
              </button>
            </div>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="app">
      <BackgroundMusic
        screen={musicScreen}
        selectedChapterId={musicChapterId}
      />
      {renderScreen()}

      {transitionChapter && (
        <ChapterTransition
          chapter={transitionChapter}
          origin={transitionOrigin}
          onCoveredScreen={handleTransitionCoveredScreen}
          onFinished={handleTransitionFinished}
        />
      )}

      {canUseAdmin && (
        <button
          type="button"
          className="admin-hotspot"
          aria-label="Open host admin controls"
          onClick={handleAdminHotspotTap}
        />
      )}

      {canUseAdmin && adminOpen && (
        <aside
          className="admin-panel"
          role="dialog"
          aria-label="Host emergency controls"
        >
          <div className="admin-panel__header">
            <div>
              <p className="admin-panel__eyebrow">Host Only</p>
              <h2>Emergency Jump</h2>
            </div>

            <button
              type="button"
              className="admin-panel__close"
              onClick={() => setAdminOpen(false)}
              aria-label="Close admin controls"
            >
              x
            </button>
          </div>

          <p className="admin-panel__copy">
            Use this only if a puzzle, phone prompt, or transition gets stuck.
          </p>

          <div className="admin-panel__actions">
            <button
              type="button"
              onClick={() => handleAdminNavigate(handleDevOpenPrologue)}
            >
              Prologue
            </button>

            <button
              type="button"
              onClick={() => handleAdminNavigate(handleDevOpenMap)}
            >
              Map
            </button>

            <button
              type="button"
              onClick={() => handleAdminNavigate(handleDevOpenQuietAfter)}
            >
              Quiet After
            </button>

            <button
              type="button"
              onClick={() => handleAdminNavigate(handleDevOpenFinale)}
            >
              Finale
            </button>

            <button
              type="button"
              onClick={handleAdminCompleteCurrentChapter}
              disabled={screen !== SCREENS.CHAPTER}
            >
              Complete Current Chapter
            </button>

            <button
              type="button"
              onClick={() => handleAdminOpenChapter(nextChapter.id)}
              disabled={!nextChapter}
            >
              Next Chapter
            </button>

            <button
              type="button"
              onClick={handleAdminClearPrompt}
              disabled={!multiplayerSession?.active_prompt?.id}
            >
              Clear Phone Prompt
            </button>
          </div>

          <div className="admin-panel__chapters">
            {chapters.map((chapter, index) => (
              <button
                key={chapter.id}
                type="button"
                onClick={() => handleAdminOpenChapter(chapter.id)}
                className={
                  chapter.id === selectedChapterId
                    ? "admin-panel__chapter admin-panel__chapter--active"
                    : "admin-panel__chapter"
                }
              >
                {index + 1}
              </button>
            ))}
          </div>
        </aside>
      )}

      {DEV_MODE && (
        <aside className="dev-toolbar">
          <span className="dev-toolbar__label">Dev</span>

          <button type="button" onClick={handleDevOpenPrologue}>
            Prologue
          </button>

          <button type="button" onClick={handleDevOpenMap}>
            Map
          </button>

          <button type="button" onClick={handleDevOpenQuietAfter}>
            Quiet After
          </button>

          <button type="button" onClick={handleDevOpenFinale}>
            Finale
          </button>

          <button type="button" onClick={handleClearSavedGame}>
            Clear Saved Game
          </button>

          {chapters.map((chapter, index) => (
            <button
              key={chapter.id}
              type="button"
              onClick={() => handleDevOpenChapter(chapter.id)}
            >
              Ch {index + 1}
            </button>
          ))}
        </aside>
      )}
    </div>
  );
}

export default App;
