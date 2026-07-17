import { useMemo, useState } from "react";

import StorybookMap from "./components/Storybook/StorybookMap";
import MemoryWindow from "./components/MemoryWindow/MemoryWindow";
import ChapterScene from "./components/Chapter/ChapterScene";
import QuietAfter from "./components/QuietAfter/QuietAfter";

import { chapters, chapterById } from "./data/chapters";

import "./App.css";

const SCREENS = {
  STORYBOOK: "storybook",
  MEMORY_WINDOW: "memory-window",
  CHAPTER: "chapter",
  QUIET_AFTER: "quiet-after",
};

function App() {
  const [screen, setScreen] = useState(SCREENS.STORYBOOK);

  const [selectedChapterId, setSelectedChapterId] = useState(
    chapters[0]?.id ?? "chapter-01",
  );

  const [completedChapterIds, setCompletedChapterIds] =
    useState([]);

  const [activeChapterIndex, setActiveChapterIndex] =
    useState(0);

  const [unlockingChapterId, setUnlockingChapterId] =
    useState(null);

  const selectedChapter =
    chapterById[selectedChapterId] ?? chapters[0];

  const activeChapterId =
    chapters[activeChapterIndex]?.id ?? null;

  const completedChapterIdSet = useMemo(
    () => new Set(completedChapterIds),
    [completedChapterIds],
  );

  function handleSelectChapter(chapterId) {
    const nextChapter = chapterById[chapterId];

    if (!nextChapter) {
      console.warn(
        `Unknown chapter selected: ${chapterId}`,
      );
      return;
    }

    if (chapterId !== activeChapterId) {
      return;
    }

    setSelectedChapterId(chapterId);
    setUnlockingChapterId(null);
    setScreen(SCREENS.MEMORY_WINDOW);
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

    unlockNextChapter(completedId);
  }

  function handleQuietAfterComplete() {
    unlockNextChapter("chapter-05");
  }

  function renderScreen() {
    switch (screen) {
      case SCREENS.MEMORY_WINDOW:
        return (
          <MemoryWindow
            chapter={selectedChapter}
            onEnterChapter={() =>
              setScreen(SCREENS.CHAPTER)
            }
            onBack={() =>
              setScreen(SCREENS.STORYBOOK)
            }
          />
        );

      case SCREENS.CHAPTER:
        return (
          <ChapterScene
            chapter={selectedChapter}
            onCompleteChapter={handleCompleteChapter}
          />
        );

      case SCREENS.QUIET_AFTER:
        return (
          <QuietAfter
            onComplete={handleQuietAfterComplete}
          />
        );

      case SCREENS.STORYBOOK:
      default:
        return (
          <StorybookMap
            chapters={chapters}
            activeChapterId={activeChapterId}
            completedChapterIds={[
              ...completedChapterIdSet,
            ]}
            unlockingChapterId={unlockingChapterId}
            onSelectChapter={handleSelectChapter}
          />
        );
    }
  }

  return <div className="app">{renderScreen()}</div>;
}

export default App;