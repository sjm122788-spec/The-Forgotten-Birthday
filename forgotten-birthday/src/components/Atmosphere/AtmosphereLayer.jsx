import "./AtmosphereLayer.css";

function AtmosphereLayer({ layers = [] }) {
  return (
    <div
      className="atmosphere-layer"
      aria-hidden="true"
    >
      {layers.map((layer) => {
        const className = [
          "atmosphere-layer__item",
          layer.image
            ? "atmosphere-layer__image"
            : "atmosphere-layer__effect",
          layer.className ?? "",
        ]
          .filter(Boolean)
          .join(" ");

        if (layer.image) {
          return (
            <img
              key={layer.id}
              className={className}
              src={layer.image}
              alt=""
            />
          );
        }

        return (
          <div
            key={layer.id}
            className={className}
          />
        );
      })}
    </div>
  );
}

export default AtmosphereLayer;