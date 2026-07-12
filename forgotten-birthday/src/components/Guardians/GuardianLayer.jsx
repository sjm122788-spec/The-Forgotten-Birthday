import "./GuardianLayer.css";

function GuardianLayer({ guardian }) {
  if (!guardian?.image) {
    return null;
  }

  return (
    <div
      className={`guardian-layer ${guardian.className ?? ""}`}
      data-guardian-id={guardian.id}
    >
      <img
        className="guardian-layer__character"
        src={guardian.image}
        alt={guardian.alt ?? ""}
      />

      {guardian.prop?.image && (
        <img
          className={`guardian-layer__prop ${
            guardian.prop.className ?? ""
          }`}
          src={guardian.prop.image}
          alt={guardian.prop.alt ?? ""}
          aria-hidden={guardian.prop.alt ? undefined : "true"}
        />
      )}
    </div>
  );
}

export default GuardianLayer;