import { useState } from "react";
import "./ChapterScene.css";

function ChapterScene({ chapter, onCompleteChapter }) {
  const [narrationIndex, setNarrationIndex] = useState(0);

  const currentNarration = chapter.narration[narrationIndex];
  const isLastNarration =
    narrationIndex === chapter.narration.length - 1;

  function handleAdvance() {
    if (isLastNarration) {
      onCompleteChapter();
      return;
    }

    setNarrationIndex((currentIndex) => currentIndex + 1);
  }

  return (
    <main className="chapter-scene">
      <div className="chapter-artwork">
        {chapter.heroImage ? (
          <img
            className="chapter-hero-image"
            src={chapter.heroImage}
            alt={chapter.title}
          />
        ) : (
          <div className="chapter-placeholder">
            <span>Chapter 1 hero illustration</span>
          </div>
        )}

        <div className="chapter-light-layer" />
        <div className="chapter-dust-layer" />

        <div className="chapter-narration-wrap">
          <p className="chapter-narration">
            {currentNarration}
          </p>

          <button
            className="chapter-advance"
            type="button"
            onClick={handleAdvance}
          >
            {isLastNarration ? "Return to the storybook" : "Continue"}
          </button>
        </div>
      </div>
    </main>
  );
}

export default ChapterScene;