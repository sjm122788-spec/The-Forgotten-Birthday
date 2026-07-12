import AtmosphereLayer from "../Atmosphere/AtmosphereLayer";
import GuardianLayer from "../Guardians/GuardianLayer";
import ChapterDirector from "./ChapterDirector";

import "./ChapterScene.css";

function ChapterScene({ chapter, onCompleteChapter }) {
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
            <span>{chapter.title} illustration</span>
          </div>
        )}

        <AtmosphereLayer
          layers={chapter.atmosphere}
        />

        <GuardianLayer
          guardian={chapter.guardian}
        />

        <ChapterDirector
          sequence={chapter.sequence}
          onCompleteChapter={onCompleteChapter}
        />
      </div>
    </main>
  );
}

export default ChapterScene;