import "./MemoryWindow.css";

function MemoryWindow({
  chapter,
  mapImage,
  onEnterChapter,
  onBack,
}) {
  if (!chapter) {
    return null;
  }

  const originLeft =
    chapter.mapPosition?.left ?? 50;

  const originTop =
    chapter.mapPosition?.top ?? 50;

  const screenStyle = {
    "--memory-origin-x": `${originLeft}%`,
    "--memory-origin-y": `${originTop}%`,
  };

  return (
    <main
      className="memory-window-screen"
      style={screenStyle}
      aria-label={`Memory window for ${chapter.title}`}
    >
      <div className="memory-transition-book">
        {/* Layer 1: Storybook map */}
        <div
          className="memory-window-map-layer"
          aria-hidden="true"
        >
          {mapImage ? (
            <img
              className="memory-window-map-image"
              src={mapImage}
              alt=""
              draggable="false"
            />
          ) : (
            <div className="memory-window-map-placeholder">
              <p>Storybook map placeholder</p>
            </div>
          )}
        </div>

        {/* Layer 2: Ink transition effects */}
        <div
          className="memory-window-effects-layer"
          aria-hidden="true"
        >
          <div className="memory-window-ink">
  <span
    className="memory-window-ink-wisp memory-window-ink-wisp--one"
  />
  <span
    className="memory-window-ink-wisp memory-window-ink-wisp--two"
  />
  <span
    className="memory-window-ink-wisp memory-window-ink-wisp--three"
  />

  <div className="memory-window-ink-core" />
</div>
        </div>

        {/* Layer 3: Memory Window */}
        <div className="memory-window-stage">
          <button
            className="memory-window-frame"
            type="button"
            onClick={onEnterChapter}
            aria-label={`Enter ${chapter.title}`}
          >
            {chapter.memoryWindowImage ? (
              <img
                className="memory-window-image"
                src={chapter.memoryWindowImage}
                alt={`A glimpse into ${chapter.title}`}
                draggable="false"
              />
            ) : (
              <div className="memory-window-placeholder">
                <span>Memory Window</span>
                <strong>{chapter.title}</strong>
              </div>
            )}
          </button>
        </div>
      </div>

      {/* Temporary development controls */}
      <div className="memory-window-controls">
        {onBack && (
          <button
            className="memory-window-back"
            type="button"
            onClick={onBack}
          >
            Back to map
          </button>
        )}

        <p className="memory-window-instruction">
          Select the window to enter the memory.
        </p>
      </div>
    </main>
  );
}

export default MemoryWindow;