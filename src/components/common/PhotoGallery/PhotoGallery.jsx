// PhotoGallery.jsx
import React, { useState, useEffect } from "react";
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

    const mappedImages = (images || []).map((ele, idx) => {
        // if ele already has thumb/full, keep them; otherwise build from your original fields
        const thumb = ele.thumb || ((process.env.REACT_APP_API_URL || "") + (ele.thumbPath || ""));
        const full = ele.full || ((process.env.REACT_APP_API_URL || "") + (ele.filePath || ""));
        const label = ele.label || ele.orderNo || (ele.moduleId ? (
            // if you passed measurementUpdateModel, try to resolve orderNo like earlier code
            (measurementUpdateModel?.orderDetails?.find(x => x.id === ele.moduleId)?.orderNo) || `#${idx}`
        ) : `#${idx}`);
        return { id: ele.id ?? idx, thumb, full, label };
    });
    const [activeMode, setActiveMode] = useState(mergedConfig.mode || "grid");
    const [previewIndex, setPreviewIndex] = useState(null);

    let previewImage = previewIndex !== null ? mappedImages[previewIndex] : null;

    const modes = [
        { mode: "grid", icon: "bi-grid-3x3-gap", title: "Grid" },
        { mode: "masonry", icon: "bi-columns-gap", title: "Masonry" },
        { mode: "collage", icon: "bi-aspect-ratio", title: "Collage" },
        { mode: "list", icon: "bi-view-list", title: "List" },
        { mode: "compact", icon: "bi-grid-fill", title: "Compact" },
        { mode: "horizontal", icon: "bi-arrow-right", title: "Horizontal" },
    ];

    const openPreview = (index) => {
        if (!mergedConfig.allowPreview) return;
        setPreviewIndex(index);
    };
    const closePreview = () => setPreviewIndex(null);

    useEffect(() => {
        if (previewIndex === null) return;

        const handler = (e) => {
            if (e.key === "Escape") {
                setPreviewIndex(null);
                return;
            }
            if (e.key === "ArrowLeft") {
                setPreviewIndex((prev) => (prev === null ? null : (prev - 1 + images.length) % images.length));
                return;
            }
            if (e.key === "ArrowRight") {
                setPreviewIndex((prev) => (prev === null ? null : (prev + 1) % images.length));
                return;
            }
        };

        window.addEventListener("keydown", handler);
        return () => window.removeEventListener("keydown", handler);
    }, [previewIndex, images.length]);

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
                            onClick={() => openPreview(idx)}
                        />
                    );
                })}
            </div>

            {/* preview modal */}
            {previewImage && (
                <div className="preview-modal" onClick={closePreview}>
                    <button
                        className="nav-btn prev"
                        onClick={(e) => {
                            e.stopPropagation();
                            setPreviewIndex((i) => (i === null ? null : (i - 1 + images.length) % images.length));
                        }}
                        aria-label="Previous image"
                    >
                        <i className="bi bi-chevron-left" />
                    </button>

                    <div className="preview-inner" onClick={(e) => e.stopPropagation()}>
                        {/* optional label (you already added .img-label earlier) */}
                        {mergedConfig.showLabels && previewImage?.label && (
                            <div className="img-label">{previewImage.label}</div>
                        )}

                        <img src={previewImage.full} className="preview-img" alt={previewImage.label || "preview"} />
                    </div>

                    <button
                        className="nav-btn next"
                        onClick={(e) => {
                            e.stopPropagation();
                            setPreviewIndex((i) => (i === null ? null : (i + 1) % images.length));
                        }}
                        aria-label="Next image"
                    >
                        <i className="bi bi-chevron-right" />
                    </button>
                </div>
            )}

        </div>
    );
}

export default PhotoGallery;
