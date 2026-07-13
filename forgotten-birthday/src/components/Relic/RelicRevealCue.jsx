import "./RelicRevealCue.css";

function RelicRevealCue({ cue, onComplete }) {
  const {
    eyebrow = "A Story Relic",
    title,
    image,
    imageAlt = "",
    description = "",
    protects = "",
    continueLabel = "Carry It Forward",
  } = cue;

  return (
    <section className="relic-reveal-cue">
      <div className="relic-reveal-cue__card">
        <p className="relic-reveal-cue__eyebrow">{eyebrow}</p>
        <h2 className="relic-reveal-cue__title">{title}</h2>

        {image && (
          <div className="relic-reveal-cue__image-wrap">
            <span className="relic-reveal-cue__glow" />
            <img
              className="relic-reveal-cue__image"
              src={image}
              alt={imageAlt}
            />
          </div>
        )}

        {protects && (
          <p className="relic-reveal-cue__protects">
            Protects: {protects}
          </p>
        )}

        {description && (
          <p className="relic-reveal-cue__description">
            {description}
          </p>
        )}

        <button
          type="button"
          className="relic-reveal-cue__button"
          onClick={() =>
            onComplete({
              cueId: cue.id,
              relicId: cue.relicId,
              awarded: true,
            })
          }
        >
          {continueLabel}
        </button>
      </div>
    </section>
  );
}

export default RelicRevealCue;