import { useEffect, useMemo, useState } from "react";
import inkblotImage from "../../assets/images/book/inkblot.png";

import "./StoryRouteOverlay.css";

const DEFAULT_DRAW_DURATION = 1800;
const DEFAULT_BLOT_REVEAL_DELAY = 1450;

/*
  Expected chapter shape:

  {
    id: "chapter-1",
    title: "The Empty Celebration",
    mapPosition: {
      left: 23,
      top: 61
    },
    routeToNext: "M 23 61 C 28 58, 31 54, 36 50"
  }

  mapState should be supplied by the parent:

  "hidden"
  "completed"
  "active"
*/

function StoryRouteOverlay({
  chapters = [],
  activeChapterId,
  completedChapterIds = [],
  unlockingChapterId = null,
  onSelectChapter,
  drawDuration = DEFAULT_DRAW_DURATION,
  revealDelay = DEFAULT_BLOT_REVEAL_DELAY,
  devMode = false,
}) {
  const [revealedUnlockId, setRevealedUnlockId] = useState(null);

  const completedSet = useMemo(
    () => new Set(completedChapterIds),
    [completedChapterIds],
  );

  useEffect(() => {
    if (!unlockingChapterId) {
      setRevealedUnlockId(null);
      return undefined;
    }

    setRevealedUnlockId(null);

    const timer = window.setTimeout(() => {
      setRevealedUnlockId(unlockingChapterId);
    }, revealDelay);

    return () => {
      window.clearTimeout(timer);
    };
  }, [unlockingChapterId, revealDelay]);

  function getMapState(chapter) {
    if (completedSet.has(chapter.id)) {
      return "completed";
    }

    if (chapter.id === activeChapterId) {
      return "active";
    }

    if (
      chapter.id === unlockingChapterId &&
      chapter.id === revealedUnlockId
    ) {
      return "active";
    }

    return "hidden";
  }

  function handleSelect(chapter) {
    const state = getMapState(chapter);

    if (!devMode && state !== "active") {
      return;
    }

    onSelectChapter?.(chapter.id);
  }

  return (
    <div className="story-route-overlay" aria-label="Story progression">
      <svg
        className="story-route-lines"
        viewBox="0 0 100 100"
        preserveAspectRatio="none"
        aria-hidden="true"
      >
        {chapters.map((chapter, index) => {
          const nextChapter = chapters[index + 1];

          if (!nextChapter || !chapter.routeToNext) {
            return null;
          }

          const routeIsCompleted =
            completedSet.has(chapter.id) &&
            (
              completedSet.has(nextChapter.id) ||
              nextChapter.id === activeChapterId
            );

          const routeIsDrawing =
            completedSet.has(chapter.id) &&
            nextChapter.id === unlockingChapterId;

          if (!routeIsCompleted && !routeIsDrawing) {
            return null;
          }

          return (
            <path
              key={`${chapter.id}-to-${nextChapter.id}`}
              className={[
                "story-route-path",
                routeIsDrawing
                  ? "story-route-path--drawing"
                  : "story-route-path--revealed",
              ]
                .filter(Boolean)
                .join(" ")}
              d={chapter.routeToNext}
              pathLength="1"
              style={{
                "--story-route-draw-duration": `${drawDuration}ms`,
              }}
            />
          );
        })}
      </svg>

      {chapters.map((chapter) => {
        const { mapPosition } = chapter;

        if (!mapPosition) {
          return null;
        }

        const mapState = getMapState(chapter);

        if (mapState === "hidden" && !devMode) {
          return null;
        }

        const markerImage = inkblotImage;

        const isUnlocking =
          chapter.id === unlockingChapterId &&
          chapter.id === revealedUnlockId;

        const isCompleted =
          mapState === "completed";

        const isActive =
          mapState === "active";

        const markerClassName = [
          "story-route-marker",
          isCompleted
            ? "story-route-marker--completed"
            : "",
          isActive
            ? "story-route-marker--active"
            : "",
          isUnlocking
            ? "story-route-marker--forming"
            : "",
          devMode && mapState === "hidden"
            ? "story-route-marker--dev-hidden"
            : "",
        ]
          .filter(Boolean)
          .join(" ");

        const markerStyle = {
          left: `${mapPosition.left}%`,
          top: `${mapPosition.top}%`,
        };

        if (isCompleted && !devMode) {
          return (
            <div
              key={chapter.id}
              className={markerClassName}
              style={markerStyle}
              aria-hidden="true"
            >
              {markerImage && (
                <img
                  className="story-route-inkblot"
                  src={markerImage}
                  alt=""
                  draggable="false"
                />
              )}
            </div>
          );
        }

        return (
          <button
            key={chapter.id}
            className={markerClassName}
            style={markerStyle}
            type="button"
            aria-label={`Enter ${chapter.title}`}
            aria-disabled={!devMode && !isActive}
            disabled={!devMode && !isActive}
            onClick={() => handleSelect(chapter)}
          >
            {isActive && (
              <span
                className="story-route-active-glow"
                aria-hidden="true"
              />
            )}

            {markerImage && (
              <img
                className="story-route-inkblot"
                src={markerImage}
                alt=""
                draggable="false"
              />
            )}
          </button>
        );
      })}
    </div>
  );
}

export default StoryRouteOverlay;