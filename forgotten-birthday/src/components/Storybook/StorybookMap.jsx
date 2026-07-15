import StoryRouteOverlay from "./StoryRouteOverlay";

import "./StorybookMap.css";

function StorybookMap({
  chapters = [],
  activeChapterId,
  completedChapterIds = [],
  unlockingChapterId,
  onSelectChapter,
}) {
  const mapImage = chapters.find(
    (chapter) => chapter.mapImage,
  )?.mapImage;

  return (
    <main className="storybook-screen">
      <div className="storybook-book">
        {mapImage ? (
          <img
            className="storybook-map-image"
            src={mapImage}
            alt="The Forgotten Birthday story map"
          />
        ) : (
          <div className="storybook-map-placeholder">
            <p>Storybook map placeholder</p>
          </div>
        )}

        <StoryRouteOverlay
          chapters={chapters}
          activeChapterId={activeChapterId}
          completedChapterIds={completedChapterIds}
          unlockingChapterId={unlockingChapterId}
          onSelectChapter={onSelectChapter}
        />
      </div>
    </main>
  );
}

export default StorybookMap;