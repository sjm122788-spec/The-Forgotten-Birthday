import "./AtmosphereLayer.css";

function AtmosphereLayer({ layers = [] }) {
  return (
    <div className="atmosphere-layer" aria-hidden="true">
      {layers.map((layer) => (
        <img
          key={layer.id}
          className={`atmosphere-layer__image ${layer.className ?? ""}`}
          src={layer.image}
          alt=""
        />
      ))}
    </div>
  );
}

export default AtmosphereLayer;