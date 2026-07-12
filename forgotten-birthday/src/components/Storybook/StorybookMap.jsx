import StoryMapOverlay from "./StoryMapOverlay";
import "./StorybookMap.css";

function StorybookMap({ chapter, onSelectChapter }) {
  return (
    <main className="storybook-screen">
      <div className="storybook-book">
  {chapter?.mapImage ? (
    <img
      className="storybook-map-image"
      src={chapter.mapImage}
      alt="The Forgotten Birthday story map"
    />
  ) : (
    <div className="storybook-map-placeholder">
      <p>Storybook map placeholder</p>
    </div>
  )}

  <StoryMapOverlay
    chapter={chapter}
    onSelectChapter={onSelectChapter}
  />
      </div>
    </main>
  );
}

export default StorybookMap;