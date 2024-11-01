// components/ImageWithFallback.js
import React, { useState } from 'react';
import '../../css/imageWithFallback.css'; // For modal styling
import { common } from '../../utils/common';

const ImageWithFallback = ({ src, alt, className, fallbackSrc, style, zoomClassName,title }) => {
    var defaultImagePath="/assets/images/default-image.png" ;
    var onErrorImagePath="/assets/images/error-image.png";
    src=common.defaultIfEmpty(src,defaultImagePath);
    fallbackSrc=common.defaultIfEmpty(fallbackSrc,onErrorImagePath);
    const [imgSrc, setImgSrc] = useState(src);
    const [imgTitle, setImgTitle] = useState(src!==defaultImagePath? title:'Image is not available/uploaded so showing this image.');
    const [isZoomed, setIsZoomed] = useState(false);

    // Handle image loading error by setting fallback image
    const handleError = () => {
        setImgSrc(fallbackSrc);
        setImgTitle("Unable to download the original image so showing this image.");
    };

    // Open modal to zoom image
    const handleImageClick = () => {
        setIsZoomed(true);
    };

    // Close zoomed image modal
    const handleCloseModal = () => {
        setIsZoomed(false);
    };

    return (
        <>
            {/* The image with lazy loading and error handling */}
            <img
                className={className}
                src={imgSrc}
                alt={alt}
                loading="lazy"
                title={imgTitle}
                onError={handleError}
                style={style}
                onClick={handleImageClick} // Click to zoom
            />

            {/* Modal for zoomed image */}
            {isZoomed && (
                <div className="modal-overlay" onClick={handleCloseModal}>
                    <div className="modal-content">
                        <span className="close-button" onClick={handleCloseModal}>&times;</span>
                        <img
                            className={zoomClassName}
                            src={imgSrc?.replace("thumb_","")}
                            alt={alt}
                            onError={handleError} // Ensuring fallback works on zoom as well
                        />
                    </div>
                </div>
            )}
        </>
    );
};

export default ImageWithFallback;
