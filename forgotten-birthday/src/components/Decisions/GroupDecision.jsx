import "./GroupDecision.css";

function GroupDecision({ cue, onComplete }) {
  function handleSelect(option) {
    onComplete(option);
  }

  return (
    <div className="group-decision">
      <p className="group-decision__prompt">
        {cue.prompt}
      </p>

      <div className="group-decision__options">
        {cue.options.map((option) => (
          <button
            key={option.id}
            className="group-decision__option"
            type="button"
            onClick={() => handleSelect(option)}
          >
            {option.label}
          </button>
        ))}
      </div>
    </div>
  );
}

export default GroupDecision;