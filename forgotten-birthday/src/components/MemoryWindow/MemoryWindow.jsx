import "./MemoryWindow.css";

function MemoryWindow({ chapter, onEnterChapter, onBack }) {
  return (
    <main className="memory-window-screen">
      <button
        className="memory-window-back"
        type="button"
        onClick={onBack}
      >
        Back to map
      </button>

      <div className="memory-window-stage">
        <div className="memory-window-ink" />

        <button
          className="memory-window-frame"
          type="button"
          onClick={onEnterChapter}
          aria-label={`Enter ${chapter.title}`}
        >
          {chapter.memoryWindowImage ? (
            <img
              src={chapter.memoryWindowImage}
              alt={`Memory window for ${chapter.title}`}
            />
          ) : (
            <div className="memory-window-placeholder">
              <span>Memory Window</span>
              <strong>{chapter.title}</strong>
            </div>
          )}
        </button>
      </div>

      <p className="memory-window-instruction">
        Select the window to enter the memory.
      </p>
    </main>
  );
}

export default MemoryWindow;