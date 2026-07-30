import { useEffect, useMemo, useRef } from "react";

import prologueTrack from "../../assets/audio/Pixel-Birthday-Quest.mp3";
import mapTrack from "../../assets/audio/MapTheme.mp3";
import secretChapterTrack from "../../assets/audio/SecretChapter.mp3";
import finaleTrack from "../../assets/audio/Finale.mp3";
import chapterOneTrack from "../../assets/audio/Chapter1.mp3";
import chapterTwoTrack from "../../assets/audio/Chapter2.mp3";
import chapterThreeTrack from "../../assets/audio/Chapter3.mp3";
import chapterFourTrack from "../../assets/audio/Chapter4.mp3";
import chapterFiveTrack from "../../assets/audio/Chapter5.mp3";
import chapterSixTrack from "../../assets/audio/Chapter6.mp3";
import chapterSevenTrack from "../../assets/audio/Chapter7.mp3";
import chapterEightTrack from "../../assets/audio/Chapter8.mp3";
import chapterNineTrack from "../../assets/audio/Chapter9.mp3";
import chapterTenTrack from "../../assets/audio/Chapter10.mp3";
import chapterElevenTrack from "../../assets/audio/Chapter11.mp3";

const SCREENS = {
  PROLOGUE: "prologue",
  STORYBOOK: "storybook",
  MEMORY_WINDOW: "memory-window",
  CHAPTER: "chapter",
  QUIET_AFTER: "quiet-after",
  FINALE: "finale",
};

const CHAPTER_TRACKS = {
  "chapter-01": chapterOneTrack,
  "chapter-02": chapterTwoTrack,
  "chapter-03": chapterThreeTrack,
  "chapter-04": chapterFourTrack,
  "chapter-05": chapterFiveTrack,
  "chapter-06": chapterSixTrack,
  "chapter-07": chapterSevenTrack,
  "chapter-08": chapterEightTrack,
  "chapter-09": chapterNineTrack,
  "chapter-10": chapterTenTrack,
  "chapter-11": chapterElevenTrack,
};

const CROSSFADE_MS = 500;
const TARGET_VOLUME = 0.50;

function getTrackForScreen(screen, selectedChapterId) {
  if (screen === SCREENS.PROLOGUE) {
    return prologueTrack;
  }

  if (screen === SCREENS.STORYBOOK) {
    return mapTrack;
  }

  if (screen === SCREENS.QUIET_AFTER) {
    return secretChapterTrack;
  }

  if (screen === SCREENS.FINALE) {
    return finaleTrack;
  }

  if (
    screen === SCREENS.CHAPTER ||
    screen === SCREENS.MEMORY_WINDOW ||
    screen === "chapter" ||
    screen === "memory-window" ||
    screen === "memoryWindow"
  ) {
    if (!CHAPTER_TRACKS[selectedChapterId]) {
  console.warn(
    "No soundtrack found for chapter:",
    selectedChapterId,
  );
}

return CHAPTER_TRACKS[selectedChapterId] ?? mapTrack;
  }

  return mapTrack;
}

function isSameTrack(currentSrc, nextTrack) {
  if (!currentSrc || !nextTrack) {
    return false;
  }

  return currentSrc.includes(nextTrack);
}

function fadeAudio({ fromAudio, toAudio, onComplete }) {
  let frameId = null;
  let cancelled = false;

  if (!toAudio) {
    if (typeof onComplete === "function") {
      onComplete();
    }

    return () => {};
  }

  const startTime = performance.now();
  const fromVolume = fromAudio?.volume ?? 0;

  function step(timestamp) {
    if (cancelled) {
      return;
    }

    const progress = Math.min(
      1,
      (timestamp - startTime) / CROSSFADE_MS,
    );

    if (fromAudio) {
      fromAudio.volume = Math.max(
        0,
        fromVolume * (1 - progress),
      );
    }

    toAudio.volume = TARGET_VOLUME * progress;

    if (progress < 1) {
      frameId = requestAnimationFrame(step);
      return;
    }

    if (fromAudio) {
      try {
        fromAudio.pause();
        fromAudio.currentTime = 0;
      } catch (error) {
        console.warn(
          "Error pausing old track during crossfade",
          error,
        );
      }
    }

    if (typeof onComplete === "function") {
      onComplete();
    }
  }

  frameId = requestAnimationFrame(step);

  return () => {
    cancelled = true;

    if (frameId !== null) {
      cancelAnimationFrame(frameId);
    }
  };
}

export default function BackgroundMusic({ screen, selectedChapterId }) {
  const audioRefs = useRef([null, null]);
  const activeIndexRef = useRef(0);
  const activeTrackRef = useRef(null);

  const resolvedTrack = useMemo(
    () => getTrackForScreen(screen, selectedChapterId),
    [screen, selectedChapterId],
  );

  useEffect(() => {
  const activeIndex = activeIndexRef.current;
  const nextIndex = 1 - activeIndex;
  const activeAudio = audioRefs.current[activeIndex];
  const nextAudio = audioRefs.current[nextIndex];

  if (!activeAudio || !nextAudio) {
    return undefined;
  }

  let cancelFade = () => {};

  const playAudio = (audio) => {
    if (!audio) {
      return;
    }

    void audio.play().catch(() => undefined);
  };

  const resumePlayback = () => {
    const currentAudio =
      audioRefs.current[activeIndexRef.current];

    if (currentAudio?.paused) {
      playAudio(currentAudio);
    }
  };

  window.addEventListener("pointerdown", resumePlayback);
  window.addEventListener("keydown", resumePlayback);

  if (
    activeTrackRef.current === resolvedTrack &&
    activeAudio.src
  ) {
    if (activeAudio.paused) {
      playAudio(activeAudio);
    }

    return () => {
      window.removeEventListener(
        "pointerdown",
        resumePlayback,
      );
      window.removeEventListener(
        "keydown",
        resumePlayback,
      );
    };
  }

  if (isSameTrack(activeAudio.src, resolvedTrack)) {
    activeTrackRef.current = resolvedTrack;

    if (activeAudio.paused) {
      playAudio(activeAudio);
    }

    return () => {
      window.removeEventListener(
        "pointerdown",
        resumePlayback,
      );
      window.removeEventListener(
        "keydown",
        resumePlayback,
      );
    };
  }

  const prepareAudio = (audio, src) => {
    audio.pause();
    audio.src = src;
    audio.loop = true;
    audio.preload = "auto";
    audio.volume = 0;
    audio.currentTime = 0;
    audio.load();
    playAudio(audio);
  };

  const incomingAudio = nextAudio;

  prepareAudio(incomingAudio, resolvedTrack);

  cancelFade = fadeAudio({
    fromAudio: activeAudio.src ? activeAudio : null,
    toAudio: incomingAudio,
    onComplete: () => {
      activeIndexRef.current = nextIndex;
      activeTrackRef.current = resolvedTrack;
    },
  });

  return () => {
    cancelFade();

    window.removeEventListener(
      "pointerdown",
      resumePlayback,
    );
    window.removeEventListener(
      "keydown",
      resumePlayback,
    );
  };
}, [resolvedTrack]);

  return (
    <div aria-hidden="true" style={{ display: "none" }}>
      <audio ref={(node) => {
        audioRefs.current[0] = node;
      }} />
      <audio ref={(node) => {
        audioRefs.current[1] = node;
      }} />
    </div>
  );
}
