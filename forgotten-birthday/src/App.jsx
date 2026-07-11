import { useState } from "react";

import StorybookMap from "./components/Storybook/StorybookMap";
import MemoryWindow from "./components/MemoryWindow/MemoryWindow";
import ChapterScene from "./components/Chapter/ChapterScene";

import chapterOne from "./data/chapterOne";

import "./App.css";

const SCREENS = {
  STORYBOOK: "storybook",
  MEMORY_WINDOW: "memory-window",
  CHAPTER: "chapter",
};

function App() {
  const [screen, setScreen] = useState(SCREENS.STORYBOOK);

  function renderScreen() {
    switch (screen) {
      case SCREENS.MEMORY_WINDOW:
        return (
          <MemoryWindow
            chapter={chapterOne}
            onEnterChapter={() => setScreen(SCREENS.CHAPTER)}
            onBack={() => setScreen(SCREENS.STORYBOOK)}
          />
        );

      case SCREENS.CHAPTER:
        return (
          <ChapterScene
            chapter={chapterOne}
            onCompleteChapter={() => setScreen(SCREENS.STORYBOOK)}
          />
        );

      case SCREENS.STORYBOOK:
      default:
        return (
          <StorybookMap
            chapter={chapterOne}
            onSelectChapter={() => setScreen(SCREENS.MEMORY_WINDOW)}
          />
        );
    }
  }

  return <div className="app">{renderScreen()}</div>;
}

export default App;