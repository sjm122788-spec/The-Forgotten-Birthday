import { useEffect, useState } from "react";

import AtmosphereLayer from "../Atmosphere/AtmosphereLayer";
import GuardianLayer from "../Guardians/GuardianLayer";
import ChapterDirector from "./ChapterDirector";

import "./ChapterScene.css";

function ChapterScene({
  chapter,
  onCompleteChapter,
}) {
  const [
    activeVisualLayer,
    setActiveVisualLayer,
  ] = useState(null);

  useEffect(() => {
    setActiveVisualLayer(null);
  }, [chapter.id]);

  function handleVisualStateChange(
    visualState,
  ) {
    setActiveVisualLayer(visualState);
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
            <span>
              {chapter.title} illustration
            </span>
          </div>
        )}

        <AtmosphereLayer
          layers={chapter.atmosphere}
        />

        {activeVisualLayer?.image && (
          <img
            key={activeVisualLayer.id}
            className={[
              "chapter-visual-layer",
              activeVisualLayer.className ?? "",
            ]
              .filter(Boolean)
              .join(" ")}
            src={activeVisualLayer.image}
            alt={activeVisualLayer.alt ?? ""}
            aria-hidden={
              activeVisualLayer.alt
                ? undefined
                : "true"
            }
          />
        )}

        <GuardianLayer
          guardian={chapter.guardian}
        />

        <ChapterDirector
          sequence={chapter.sequence}
          onVisualStateChange={
            handleVisualStateChange
          }
          onCompleteChapter={
            onCompleteChapter
          }
        />
      </div>
    </main>
  );
}

export default ChapterScene;