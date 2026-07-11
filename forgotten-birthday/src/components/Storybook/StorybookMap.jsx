import "./StorybookMap.css";

function StorybookMap({ chapter, onSelectChapter }) {
  return (
    <main className="storybook-screen">
      <div className="storybook-book">
        {chapter.mapImage ? (
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

        <button
          className="storybook-ink-blot"
          type="button"
          onClick={onSelectChapter}
          aria-label={`Enter ${chapter.title}`}
        >
          <span className="storybook-ink-core" />
        </button>
      </div>

      <p className="storybook-instruction">
        Select the first ink blot.
      </p>
    </main>
  );
}

export default StorybookMap;