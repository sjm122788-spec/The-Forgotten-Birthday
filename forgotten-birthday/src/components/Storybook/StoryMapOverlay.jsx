import { useEffect, useState } from "react";

import inkBlotImage from "../../assets/images/book/inkblot.png";

import "./StoryMapOverlay.css";

const TRANSITION_DURATION = 3000;

function StoryMapOverlay({
  chapters = [],
  onSelectChapter,
}) {
  const [
    openingChapterId,
    setOpeningChapterId,
  ] = useState(null);

  useEffect(() => {
    if (!openingChapterId) {
      return undefined;
    }

    const transitionTimer = window.setTimeout(() => {
      onSelectChapter(openingChapterId);
    }, TRANSITION_DURATION);

    return () => {
      window.clearTimeout(transitionTimer);
    };
  }, [openingChapterId, onSelectChapter]);

  function handleOpenMemory(chapterId) {
    if (openingChapterId) {
      return;
    }

    setOpeningChapterId(chapterId);
  }

  return (
    <div
      className={[
        "story-map-overlay",
        openingChapterId
          ? "story-map-overlay--opening"
          : "",
      ]
        .filter(Boolean)
        .join(" ")}
    >
      {chapters.map((chapter) => {
        const { mapPosition } = chapter;

        if (!mapPosition) {
          return null;
        }

        const isOpening =
          openingChapterId === chapter.id;

        return (
          <button
            key={chapter.id}
            className={[
              "story-map-memory-trigger",
              isOpening
                ? "story-map-memory-trigger--opening"
                : "",
            ]
              .filter(Boolean)
              .join(" ")}
            style={{
              left: `${mapPosition.left}%`,
              top: `${mapPosition.top}%`,
            }}
            type="button"
            aria-label={`Enter ${chapter.title}`}
            onClick={() =>
              handleOpenMemory(chapter.id)
            }
            disabled={Boolean(openingChapterId)}
          >
            <span className="story-map-halo" />

            <svg
              className="story-map-tendrils"
              viewBox="0 0 200 200"
              aria-hidden="true"
            >
              <path
                className="story-map-tendril story-map-tendril--one"
                d="M100 100 C78 91, 61 73, 47 51 C38 37, 26 31, 17 34"
              />

              <path
                className="story-map-tendril story-map-tendril--two"
                d="M100 100 C123 88, 143 72, 153 50 C161 34, 175 27, 186 33"
              />

              <path
                className="story-map-tendril story-map-tendril--three"
                d="M100 100 C86 122, 74 141, 54 153 C41 162, 37 176, 42 187"
              />

              <path
                className="story-map-tendril story-map-tendril--four"
                d="M100 100 C117 120, 132 139, 151 149 C169 159, 177 174, 171 187"
              />
            </svg>

            {chapter.memoryWindowImage && (
              <img
                className="story-map-memory-window"
                src={chapter.memoryWindowImage}
                alt=""
                aria-hidden="true"
              />
            )}

            <img
              className="story-map-ink-blot"
              src={inkBlotImage}
              alt=""
              aria-hidden="true"
            />
          </button>
        );
      })}
    </div>
  );
}

export default StoryMapOverlay;