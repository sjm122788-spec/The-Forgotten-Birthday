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

const FADE_MS = 500;
const TARGET_VOLUME = 0.5;

function getTrackForScreen(screen, selectedChapterId) {
  switch (screen) {
    case SCREENS.PROLOGUE:
      return prologueTrack;

    case SCREENS.STORYBOOK:
      return mapTrack;

    case SCREENS.QUIET_AFTER:
      return secretChapterTrack;

    case SCREENS.FINALE:
      return finaleTrack;

    case SCREENS.CHAPTER:
      return CHAPTER_TRACKS[selectedChapterId] ?? mapTrack;

    default:
      return mapTrack;
  }
}

function getAssignedSrc(audio) {
  return audio?.getAttribute("src") ?? "";
}

export default function BackgroundMusic({ screen, selectedChapterId }) {
  const audioRef = useRef(null);
  const frameRef = useRef(null);
  const currentTrackRef = useRef(null);
  const pendingTrackRef = useRef(null);

  const resolvedTrack = useMemo(
    () => getTrackForScreen(screen, selectedChapterId),
    [screen, selectedChapterId],
  );

  useEffect(() => {
    const audio = audioRef.current;

    if (!audio || !resolvedTrack) {
      return undefined;
    }

    pendingTrackRef.current = resolvedTrack;

    if (frameRef.current !== null) {
      cancelAnimationFrame(frameRef.current);
      frameRef.current = null;
    }

    if (currentTrackRef.current === resolvedTrack && getAssignedSrc(audio)) {
      audio.volume = TARGET_VOLUME;
      void audio.play().catch(() => undefined);
      return undefined;
    }

    const previousVolume = audio.volume || 0;
    const previousTrack = currentTrackRef.current;

    function startNextTrack() {
      if (pendingTrackRef.current !== resolvedTrack) {
        return;
      }

      audio.pause();
      audio.src = resolvedTrack;
      audio.loop = true;
      audio.preload = "auto";
      audio.currentTime = 0;
      audio.volume = 0;
      audio.load();

      currentTrackRef.current = resolvedTrack;

      void audio.play().catch(() => undefined);

      const fadeInStart = performance.now();

      function fadeIn(timestamp) {
        if (pendingTrackRef.current !== resolvedTrack) {
          return;
        }

        const progress = Math.min(1, (timestamp - fadeInStart) / FADE_MS);
        audio.volume = TARGET_VOLUME * progress;

        if (progress < 1) {
          frameRef.current = requestAnimationFrame(fadeIn);
          return;
        }

        audio.volume = TARGET_VOLUME;
        frameRef.current = null;
      }

      frameRef.current = requestAnimationFrame(fadeIn);
    }

    if (!previousTrack || previousVolume <= 0) {
      startNextTrack();
      return undefined;
    }

    const fadeOutStart = performance.now();

    function fadeOut(timestamp) {
      if (pendingTrackRef.current !== resolvedTrack) {
        return;
      }

      const progress = Math.min(1, (timestamp - fadeOutStart) / FADE_MS);
      audio.volume = Math.max(0, previousVolume * (1 - progress));

      if (progress < 1) {
        frameRef.current = requestAnimationFrame(fadeOut);
        return;
      }

      frameRef.current = null;
      startNextTrack();
    }

    frameRef.current = requestAnimationFrame(fadeOut);

    return undefined;
  }, [resolvedTrack]);

  useEffect(() => {
    function resumePlayback() {
      const audio = audioRef.current;

      if (audio?.paused && currentTrackRef.current) {
        void audio.play().catch(() => undefined);
      }
    }

    window.addEventListener("pointerdown", resumePlayback);
    window.addEventListener("keydown", resumePlayback);

    return () => {
      window.removeEventListener("pointerdown", resumePlayback);
      window.removeEventListener("keydown", resumePlayback);
    };
  }, []);

  useEffect(
    () => () => {
      if (frameRef.current !== null) {
        cancelAnimationFrame(frameRef.current);
      }

      const audio = audioRef.current;

      if (audio) {
        audio.pause();
        audio.removeAttribute("src");
        audio.load();
      }
    },
    [],
  );

  return (
    <div aria-hidden="true" style={{ display: "none" }}>
      <audio
        ref={(node) => {
          audioRef.current = node;
        }}
      />
    </div>
  );
}
