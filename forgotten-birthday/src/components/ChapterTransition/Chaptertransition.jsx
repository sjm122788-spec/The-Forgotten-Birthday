import { useEffect, useRef, useState } from "react";

import "./ChapterTransition.css";

/*
  ChapterTransition

  This replaces the old two-screen hop (map -> MemoryWindow screen ->
  hard cut to ChapterScene) with a single, continuous animation that:

    1. Swirls the ink in place at the chapter's map position
       (a couple of full rotations, organic morph via SVG turbulence)
    2. Expands that ink outward from the map into a full-bleed
       Memory Window, revealing chapter.memoryWindowImage through
       an animated blob mask
    3. Keeps scaling past full-bleed ("flying through" the window)
       while a dark ink cover grows to fully cover the viewport
    4. Fires onCoveredScreen() the moment the screen is fully covered,
       so the parent can swap the underlying screen to ChapterScene
       with an invisible cut
    5. Fades the whole overlay out to reveal the chapter scene, then
       calls onFinished() so the parent can unmount this component

  It is rendered as a fixed, viewport-level overlay by App.jsx (not
  nested inside the storybook "book" box), so it can survive the
  underlying screen swap without unmounting.
*/

const BLOB_KEYFRAMES = [
  "M77,27 C112,27 132,52 132,77 C132,105 112,127 77,127 C42,127 22,105 22,77 C22,52 42,27 77,27 Z",
  "M77,22 C117,32 142,57 135,82 C129,109 105,129 75,125 C45,121 17,97 25,69 C32,43 55,19 77,22 Z",
  "M75,29 C107,25 137,45 137,75 C137,103 115,125 79,127 C47,129 19,109 22,79 C25,51 47,32 75,29 Z",
  "M78,24 C114,20 140,48 138,80 C136,110 108,132 76,128 C44,124 20,96 24,66 C28,40 50,27 78,24 Z",
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

// Keep in sync with the "100%" mark of chapterTransitionScale in the CSS.
const TOTAL_DURATION_MS = 4200;
// Fire the screen swap once the cover has fully covered the
// viewport (see chapterCoverGrow keyframes), but comfortably before
// the animation technically ends, so there is zero visible gap.
const COVER_FIRE_AT_MS = 3700;

// Mirrors the CSS media-query shortening under prefers-reduced-motion,
// so the JS-driven screen swap/reveal don't leave the viewport frozen
// on a fully-covered frame after the CSS animation has already finished.
const REDUCED_TOTAL_DURATION_MS = 300;
const REDUCED_COVER_FIRE_AT_MS = 220;

function getTransitionDurations() {
  const prefersReducedMotion =
    typeof window !== "undefined" &&
    typeof window.matchMedia === "function" &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  return prefersReducedMotion
    ? {
        total: REDUCED_TOTAL_DURATION_MS,
        coverAt: REDUCED_COVER_FIRE_AT_MS,
      }
    : {
        total: TOTAL_DURATION_MS,
        coverAt: COVER_FIRE_AT_MS,
      };
}

function ChapterTransition({
  chapter,
  origin,
  onCoveredScreen,
  onFinished,
}) {
  const [revealing, setRevealing] = useState(false);
  const coveredFiredRef = useRef(false);

  useEffect(() => {
    coveredFiredRef.current = false;
    setRevealing(false);

    const { total, coverAt } = getTransitionDurations();

    const coverTimer = window.setTimeout(() => {
      if (!coveredFiredRef.current) {
        coveredFiredRef.current = true;
        onCoveredScreen?.();
      }
    }, coverAt);

    // Safety net in case animationend never fires (e.g. tab was
    // backgrounded). Guarantees we don't get stuck mid-transition.
    const safetyTimer = window.setTimeout(() => {
      setRevealing(true);
    }, total + 60);

    return () => {
      window.clearTimeout(coverTimer);
      window.clearTimeout(safetyTimer);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [chapter?.id]);

  if (!chapter?.mapPosition) {
    return null;
  }

  const seed = seedForChapter(chapter.id);

  const filterId = `chapter-transition-turbulence-${chapter.id}`;
  const maskId = `chapter-transition-mask-${chapter.id}`;
  const blobId = `chapter-transition-blob-${chapter.id}`;

  // Origin is the clicked marker's real on-screen center point
  // (in pixels), measured by StoryRouteOverlay via
  // getBoundingClientRect(). Falls back to viewport center if,
  // for some reason, no origin was measured (e.g. a dev shortcut).
  const originX =
    typeof origin?.x === "number"
      ? `${origin.x}px`
      : "50%";

  const originY =
    typeof origin?.y === "number"
      ? `${origin.y}px`
      : "50%";

  const overlayStyle = {
    "--transition-origin-x": originX,
    "--transition-origin-y": originY,
  };

  function handleAnimationEnd(event) {
    if (event.target !== event.currentTarget) return;
    if (event.animationName !== "chapterTransitionScale") return;

    if (!coveredFiredRef.current) {
      coveredFiredRef.current = true;
      onCoveredScreen?.();
    }

    setRevealing(true);
  }

  function handleRevealTransitionEnd(event) {
    if (event.propertyName !== "opacity") return;
    onFinished?.();
  }

  return (
    <div
      className={[
        "chapter-transition-overlay",
        revealing ? "chapter-transition-overlay--revealing" : "",
      ]
        .filter(Boolean)
        .join(" ")}
      style={overlayStyle}
      aria-hidden="true"
      onTransitionEnd={handleRevealTransitionEnd}
    >
      <svg
        className="chapter-transition-scene"
        viewBox="0 0 154 154"
        preserveAspectRatio="xMidYMid meet"
        onAnimationEnd={handleAnimationEnd}
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
                values="0.010;0.020;0.011;0.019;0.010"
                dur="3.4s"
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
              values={BLOB_KEYFRAMES}
              dur="3.8s"
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
            className="chapter-transition-window"
            href={chapter.memoryWindowImage}
            x="0"
            y="0"
            width="154"
            height="154"
            preserveAspectRatio="xMidYMid meet"
            mask={`url(#${maskId})`}
          />
        )}

        <use
          href={`#${blobId}`}
          className="chapter-transition-ink"
          fill="#17100d"
          filter={`url(#${filterId})`}
        />

        {/* Full-bleed rect that finishes covering the viewport right
            before the underlying screen swaps, so the cut is hidden
            inside the ink instead of being a visible pop. This is a
            dark ink cover, not a bright flash. */}
        <rect
          className="chapter-transition-cover"
          x="-40"
          y="-40"
          width="234"
          height="234"
        />
      </svg>
    </div>
  );
}

export default ChapterTransition;