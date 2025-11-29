// Thumb.jsx
import React, { useState } from "react";

export default function Thumb({ img, config, layout, onClick = () => { } }) {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const src = !error ? img.thumb : config.fallback;

  const containerStyle = layout === "horizontal"
    ? { height: `${config.thumbnailHeight + 50}px` }
    : {};

  const imgStyle = layout === "horizontal"
    ? { height: `${config.thumbnailHeight}px`, width: "auto" }
    : { height: `${config.thumbnailHeight}px`, objectFit: 'fill' };

  return (
    <div
      className={`thumb-wrapper ${layout === "horizontal" ? "horizontal-item" : ""} ${layout === "list" ? "list-item" : ""}`}
      style={containerStyle}
      onClick={onClick}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => { if (e.key === "Enter") onClick(); }}
    >
      {config.showProgress && loading && (
        <div className="progress loading-bar">
          <div className="progress-bar" />
        </div>
      )}

      <img
        loading="lazy"
        src={src}
        alt={img.label}
        className={`thumb-img  my-2 ${loading ? "hidden" : ""}`}
        onLoad={() => setLoading(false)}
        onError={() => { setError(true); setLoading(false); }}
        style={imgStyle}
      />

      {config.showLabels && img.label && <div className="thumb-label">{img.label}</div>}
    </div>
  );
}
