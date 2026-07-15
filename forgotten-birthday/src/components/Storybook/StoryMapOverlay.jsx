import { useMemo, useState } from "react";

import "./StoryMapOverlay.css";

/*
  These SVG paths are used only during the large opening transition.

  The normal map marker remains the existing inkblot PNG.
  We are not replacing the approved map asset with a procedural blob.
*/
const TRANSITION_BLOB_KEYFRAMES = [
  "M77,27 C112,27 132,52 132,77 C132,105 112,127 77,127 C42,127 22,105 22,77 C22,52 42,27 77,27 Z",
  "M77,22 C117,32 142,57 135,82 C129,109 105,129 75,125 C45,121 17,97 25,69 C32,43 55,19 77,22 Z",
  "M75,29 C107,25 137,45 137,75 C137,103 115,125 79,127 C47,129 19,109 22,79 C25,51 47,32 75,29 Z",
  "M77,27 C112,27 132,52 132,77 C132,105 112,127 77,127 C42,127 22,105 22,77 C22,52 42,27 77,27 Z",
].join(";");

function seedForChapter(chapterId) {
  const value = String(chapterId ?? "");
  let total = 0;

  for (let index = 0; index < value.length; index += 1) {
    total += value.charCodeAt(index);
  }

  return 2 + (total % 6);
}

function getChapterMapState(chapter) {
  /*
    Progression can begin supplying:

    "hidden"
    "completed"
    "active"

    Until then, existing chapters remain active by default so this rewrite
    does not break the current developer map.
  */
  return chapter.mapState ?? "active";
}

function StoryMapOverlay({
  chapters = [],
  onSelectChapter,
  inkblotImage,
}) {
  const [openingChapterId, setOpeningChapterId] = useState(null);

  const openingChapter = useMemo(
    () =>
      chapters.find(
        (chapter) => chapter.id === openingChapterId,
      ) ?? null,
    [chapters, openingChapterId],
  );

  function handleOpenMemory(chapter) {
    if (openingChapterId) {
      return;
    }

    const mapState = getChapterMapState(chapter);

    if (mapState !== "active") {
      return;
    }

    setOpeningChapterId(chapter.id);
  }

  function handleOpeningAnimationEnd(event) {
    /*
      Child animations also bubble animationend events.

      Only advance when the main scene-expansion animation finishes.
    */
    if (
      event.target !== event.currentTarget ||
      event.animationName !== "storyMapOpeningSceneExpand"
    ) {
      return;
    }

    if (!openingChapterId) {
      return;
    }

    onSelectChapter?.(openingChapterId);
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

        const mapState = getChapterMapState(chapter);

        if (mapState === "hidden") {
          return null;
        }

        const markerImage =
          chapter.inkblotImage ?? inkblotImage;

        const markerStyle = {
          left: `${mapPosition.left}%`,
          top: `${mapPosition.top}%`,
        };

        if (mapState === "completed") {
          return (
            <div
              key={chapter.id}
              className="story-map-memory-marker story-map-memory-marker--completed"
              style={markerStyle}
              aria-hidden="true"
            >
              {markerImage && (
                <img
                  className="story-map-inkblot-image"
                  src={markerImage}
                  alt=""
                  draggable="false"
                />
              )}
            </div>
          );
        }

        const isOpening =
          openingChapterId === chapter.id;

        return (
          <button
            key={chapter.id}
            className={[
              "story-map-memory-marker",
              "story-map-memory-trigger",
              isOpening
                ? "story-map-memory-trigger--opening"
                : "",
            ]
              .filter(Boolean)
              .join(" ")}
            style={markerStyle}
            type="button"
            aria-label={`Enter ${chapter.title}`}
            aria-disabled={Boolean(openingChapterId)}
            disabled={Boolean(openingChapterId)}
            onClick={() => handleOpenMemory(chapter)}
          >
            <span
              className="story-map-active-glow"
              aria-hidden="true"
            />

            {markerImage && (
              <img
                className="story-map-inkblot-image"
                src={markerImage}
                alt=""
                draggable="false"
              />
            )}
          </button>
        );
      })}

      {openingChapter?.mapPosition && (
        <OpeningMemoryTransition
          chapter={openingChapter}
          onAnimationEnd={handleOpeningAnimationEnd}
        />
      )}
    </div>
  );
}

function OpeningMemoryTransition({
  chapter,
  onAnimationEnd,
}) {
  const filterId = `story-map-ink-turbulence-${chapter.id}`;
  const maskId = `story-map-window-mask-${chapter.id}`;
  const blobId = `story-map-transition-blob-${chapter.id}`;
  const seed = seedForChapter(chapter.id);

  return (
    <div
      className="story-map-opening-origin"
      style={{
        left: `${chapter.mapPosition.left}%`,
        top: `${chapter.mapPosition.top}%`,
      }}
      aria-hidden="true"
    >
      <svg
        className="story-map-opening-scene"
        viewBox="0 0 154 154"
        preserveAspectRatio="xMidYMid meet"
        onAnimationEnd={onAnimationEnd}
      >
        <defs>
          <filter
            id={filterId}
            x="-60%"
            y="-60%"
            width="220%"
            height="220%"
          >
            <feTurbulence
              type="fractalNoise"
              baseFrequency="0.012"
              numOctaves="2"
              seed={seed}
              result="inkNoise"
            >
              <animate
                attributeName="baseFrequency"
                values="0.010;0.019;0.012"
                dur="4s"
                repeatCount="indefinite"
              />
            </feTurbulence>

            <feDisplacementMap
              in="SourceGraphic"
              in2="inkNoise"
              scale="12"
              xChannelSelector="R"
              yChannelSelector="G"
            />
          </filter>

          <path id={blobId}>
            <animate
              attributeName="d"
              values={TRANSITION_BLOB_KEYFRAMES}
              dur="5s"
              repeatCount="indefinite"
            />
          </path>

          <mask
            id={maskId}
            maskUnits="userSpaceOnUse"
            x="0"
            y="0"
            width="154"
            height="154"
          >
            <rect
              x="0"
              y="0"
              width="154"
              height="154"
              fill="#000"
            />

            <use
              href={`#${blobId}`}
              fill="#fff"
              filter={`url(#${filterId})`}
            />
          </mask>
        </defs>

        {chapter.memoryWindowImage && (
          <image
            className="story-map-memory-window"
            href={chapter.memoryWindowImage}
            x="0"
            y="0"
            width="154"
            height="154"
            preserveAspectRatio="xMidYMid slice"
            mask={`url(#${maskId})`}
          />
        )}

        <use
          href={`#${blobId}`}
          className="story-map-transition-ink"
          fill="#17100d"
          filter={`url(#${filterId})`}
        />
      </svg>
    </div>
  );
}

export default StoryMapOverlay;