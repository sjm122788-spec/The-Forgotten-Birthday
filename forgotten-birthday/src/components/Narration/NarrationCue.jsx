import "./NarrationCue.css";

function NarrationCue({ cue, onAdvance }) {
  return (
    <div className="narration-cue">
      <p className="narration-cue__text">
        {cue.text}
      </p>

      <button
        className="narration-cue__advance"
        type="button"
        onClick={onAdvance}
      >
        Continue
      </button>
    </div>
  );
}

export default NarrationCue;