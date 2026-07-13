import { useState } from "react";

import StorybookMap from "./components/Storybook/StorybookMap";
import MemoryWindow from "./components/MemoryWindow/MemoryWindow";
import ChapterScene from "./components/Chapter/ChapterScene";

import { chapters, chapterById } from "./data/chapters";

import "./App.css";

const SCREENS = {
  STORYBOOK: "storybook",
  MEMORY_WINDOW: "memory-window",
  CHAPTER: "chapter",
};

function App() {
  const [screen, setScreen] = useState(SCREENS.STORYBOOK);

  const [selectedChapterId, setSelectedChapterId] = useState(
    chapters[0]?.id ?? "chapter-01",
  );

  const selectedChapter =
    chapterById[selectedChapterId] ?? chapters[0];

  function handleSelectChapter(chapterId) {
    const nextChapter = chapterById[chapterId];

    if (!nextChapter) {
      console.warn(
        `Unknown chapter selected: ${chapterId}`,
      );
      return;
    }

    setSelectedChapterId(chapterId);
    setScreen(SCREENS.MEMORY_WINDOW);
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
            onCompleteChapter={() =>
              setScreen(SCREENS.STORYBOOK)
            }
          />
        );

      case SCREENS.STORYBOOK:
      default:
        return (
          <StorybookMap
            chapters={chapters}
            onSelectChapter={handleSelectChapter}
          />
        );
    }
  }

  return (
    <div className="app">
      {renderScreen()}
    </div>
  );
}

export default App;