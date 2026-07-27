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

import { chapters, chapterById } from "./data/chapters";
import {
  clearGame,
  loadGame,
  saveGame,
} from "./services/gamePersistence";

import "./App.css";

const SCREENS = {
  STORYBOOK: "storybook",
  CHAPTER: "chapter",
  QUIET_AFTER: "quiet-after",
  FINALE: "finale",
};
const DEV_MODE = import.meta.env.DEV;

function isObject(value) {
  return value !== null && typeof value === "object" && !Array.isArray(value);
}

function createFreshState() {
  return {
    screen: SCREENS.STORYBOOK,
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
  };
}

function normalizeScreen(screen, chapterId, transitionChapter) {
  if (transitionChapter?.id) {
    return SCREENS.CHAPTER;
  }

  if (
    screen === SCREENS.CHAPTER ||
    screen === "chapter" ||
    screen === "memory-window" ||
    screen === "memoryWindow" ||
    screen === "transition" ||
    screen === "chapter-entry" ||
    screen === "chapter-entry-animation" ||
    screen === "chapter-exit-animation" ||
    screen === "prologue"
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

  const selectedChapter = chapterById[selectedChapterId] ?? chapters[0];
  const activeChapterId = chapters[activeChapterIndex]?.id ?? null;

  const completedChapterIdSet = useMemo(
    () => new Set(completedChapterIds),
    [completedChapterIds],
  );

  const hasSavedStateRef = useRef(false);

  useEffect(() => {
    if (!hasSavedStateRef.current) {
      hasSavedStateRef.current = true;
      return;
    }

    if (showResumeScreen) {
      return;
    }

    const isFreshState =
      screen === SCREENS.STORYBOOK &&
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
      Object.keys(progression).length === 0;

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
    relics,
    screen,
    secretChoices,
    selectedChapterId,
    showResumeScreen,
    transitionChapter,
    unlockingChapterId,
  ]);

  function resetToFreshState() {
    setScreen(SCREENS.STORYBOOK);
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
    clearGame();
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
      case SCREENS.CHAPTER:
        return (
          <ChapterScene
            chapter={selectedChapter}
            onCompleteChapter={handleCompleteChapter}
          />
        );

      case SCREENS.QUIET_AFTER:
        return <QuietAfter onComplete={handleQuietAfterComplete} />;

      case SCREENS.FINALE:
        return (
          <FinaleScene
            earnedRelics={DEV_MODE && relics.length === 0 ? [
              "candle-of-first-light",
              "laughter-balloon",
              "ribbon-of-belonging",
              "pocket-watch-of-lost-time",
              "open-seal",
            ] : relics}
            glory={DEV_MODE && glory === 0 ? 72 : glory}
            maximumGlory={100}
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
      {renderScreen()}

      {transitionChapter && (
        <ChapterTransition
          chapter={transitionChapter}
          origin={transitionOrigin}
          onCoveredScreen={handleTransitionCoveredScreen}
          onFinished={handleTransitionFinished}
        />
      )}

      {DEV_MODE && (
        <aside className="dev-toolbar">
          <span className="dev-toolbar__label">Dev</span>

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