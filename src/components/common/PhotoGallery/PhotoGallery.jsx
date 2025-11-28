// PhotoGallery.jsx
import React, { useState } from "react";
import Thumb from "./LazyImageThumb";
import "./../../../css/PhotoGallery.css";

const defaultConfig = {
  mode: "",                     // "" => allow switching; otherwise lock to that mode
  showProgress: true,
  fallback: "/images/no-image.png",
  showLabels: true,
  allowPreview: true,
  thumbnailHeight: 110,
};

function PhotoGallery({ images = [], config = {}, measurementUpdateModel }) {
  const mergedConfig = { ...defaultConfig, ...config };
  const layoutLocked = !!mergedConfig.mode;
  const [activeMode, setActiveMode] = useState(mergedConfig.mode || "grid");
  const [previewImage, setPreviewImage] = useState(null);

  const modes = [
    { mode: "grid", icon: "bi-grid-3x3-gap", title: "Grid" },
    { mode: "masonry", icon: "bi-columns-gap", title: "Masonry" },
    { mode: "collage", icon: "bi-aspect-ratio", title: "Collage" },
    { mode: "list", icon: "bi-view-list", title: "List" },
    { mode: "compact", icon: "bi-grid-fill", title: "Compact" },
    { mode: "horizontal", icon: "bi-arrow-right", title: "Horizontal" },
  ];

  const openPreview = (full) => {
    if (!mergedConfig.allowPreview) return;
    setPreviewImage(full);
  };
  const closePreview = () => setPreviewImage(null);

  return (
    <div className="photo-gallery-root">
      {/* layout buttons only if not locked by config.mode */}
      {!layoutLocked && (
        <div className="layout-switcher my-2 btn-group text-end">
          {modes.map((m) => (
            <button
              key={m.mode}
              type="button"
              className={`layout-btn btn btn-outline-secondary ${activeMode === m.mode ? "active" : ""}`}
              title={m.title}
              onClick={() => setActiveMode(m.mode)}
            >
              <i className={`bi ${m.icon} layout-icon`} />
              <span className="layout-text">{m.title}</span>
            </button>
          ))}
        </div>
      )}

      {/* gallery container */}
      <div
        className={`gallery-container ${activeMode}`}
        data-mode={activeMode}
        style={activeMode === "horizontal" ? { "--thumb-h": mergedConfig.thumbnailHeight + "px" } : {}}
      >
        {images?.map((ele, idx) => {
          // preserve original input shape minimal-change:
          const orderNo = measurementUpdateModel?.orderDetails?.find(x => x.id === ele.moduleId)?.orderNo;
          const img = {
            id: ele.id ?? idx,
            thumb: (process.env.REACT_APP_API_URL || "") + (ele.thumbPath || ""),
            full: (process.env.REACT_APP_API_URL || "") + (ele.filePath || ""),
            label: orderNo ?? ele.orderNo ?? `#${idx}`,
          };

          return (
            <Thumb
              key={img.id}
              img={img}
              layout={activeMode}
              config={mergedConfig}
              onClick={() => openPreview(img)}
            />
          );
        })}
      </div>

      {/* preview modal */}
      {previewImage?.full && (
        <div className="preview-modal" onClick={closePreview}>
          <img src={previewImage?.full} className="preview-img" alt="preview" />
          {config.showLabels && previewImage.label && <div className="img-label">{previewImage.label}</div>}
        </div>
      )}
    </div>
  );
}

export default PhotoGallery;
