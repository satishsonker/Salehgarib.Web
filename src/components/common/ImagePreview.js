import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { common } from '../../utils/common';
import '../../css/ImagePreview.css'

const ImagePreview = ({ src, onClick, width = '100%', height = '100%', alt = '', title = '', showThumb = false, zoomClassName = "" }) => {
    const [imageSrc, setImageSrc] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [hasError, setHasError] = useState(false);
    const [isZoomed, setIsZoomed] = useState(false);
    const [isZoomedLoading, setIsZoomedLoading] = useState(false);
    src = showThumb ? common.appendThumbnailToFileName(src) : src;
    src = common.getImageFullPath(src)
    const defaultImage = common.defaultImageUrl;
    // Open modal to zoom image
    const handleImageClick = () => {
        setIsZoomed(true);
        setIsZoomedLoading(true);
    };

    // Close zoomed image modal
    const handleCloseModal = () => {
        setIsZoomed(false);
    };
    useEffect(() => {
        if (src) {
            setIsLoading(true);
            const loadImage =  () => {
                try {
                    const img = new Image();
                    img.src = src;

                    img.onload = () => {
                        setImageSrc(src);
                        setIsLoading(false);
                        setHasError(false);
                    };

                    img.onerror = () => {
                        setImageSrc(defaultImage);
                        setIsLoading(false);
                        setHasError(true);
                    };
                } catch (error) {
                    setImageSrc(defaultImage);
                    setIsLoading(false);
                    setHasError(true);
                }
            };

            loadImage();
        } else {
            setImageSrc(defaultImage);
            setIsLoading(false);
            setHasError(true);
        }
    }, [src]);

    return (
        <> <div
            onClick={onClick}
            style={{
                width: width,
                height: height,
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                position: 'relative',
                border:'1px solid gray',
                borderRadius:'4px'
            }}
        >
            {isLoading ? (
                <div
                    style={{
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                        width: width,
                        height: height,
                    }}
                >
                    <div className="image-preview-spinner">
                    </div>
                    <div>Loading...</div>
                    
                </div>
            ) : (
                <img
                    src={imageSrc}
                    alt={alt}
                    title={title}
                    style={{
                        width: width,
                        height: height,
                        objectFit: 'cover',
                    }}
                    onClick={handleImageClick} // Click to zoom
                />
            )}

        </div>
            {/* Modal for zoomed image */}
            {isZoomed && (
                <div className="modal-overlay" onClick={handleCloseModal}>
                    <div className="modal-content img-popup">
                        <span className="close-button" onClick={handleCloseModal}>&times;</span>
                        {isZoomedLoading && <>
                            <div
                                style={{
                                    display: 'flex',
                                    justifyContent: 'center',
                                    alignItems: 'center',
                                    width: '100%',
                                    height: '100%',
                                }}
                            >
                                <div className="image-preview-spinner" />
                            </div>
                        </>}
                        <img
                            className={zoomClassName}
                            src={src?.replace("thumb_", "")}
                            alt={alt}
                            onLoad={() => { setIsZoomedLoading(false) }}
                        //onError={} // Ensuring fallback works on zoom as well
                        />
                    </div>
                </div>
            )}
        </>


    );
};

ImagePreview.propTypes = {
    src: PropTypes.string,
    onClick: PropTypes.func,
    width: PropTypes.string,
    height: PropTypes.string,
    alt: PropTypes.string,
    title: PropTypes.string,
    showThumb: PropTypes.bool,
    defaultImage: PropTypes.string.isRequired, // Fallback image is mandatory
};

ImagePreview.defaultProps = {
    onClick: () => { },
    alt: 'Image preview',
    title: '',
};

export default ImagePreview;
