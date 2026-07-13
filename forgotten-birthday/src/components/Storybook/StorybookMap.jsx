import StoryMapOverlay from "./StoryMapOverlay";

import "./StorybookMap.css";

function StorybookMap({
  chapters = [],
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

        <StoryMapOverlay
          chapters={chapters}
          onSelectChapter={onSelectChapter}
        />
      </div>
    </main>
  );
}

export default StorybookMap;