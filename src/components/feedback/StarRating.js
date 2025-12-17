import React, { useState } from 'react';

export default function StarRating({ 
    value, 
    onChange, 
    maxStars = 10, 
    label = "",
    disabled = false 
}) {
    const [hoveredStar, setHoveredStar] = useState(null);

    const getRatingLabel = (starValue) => {
        if (starValue <= 2) return "Poor";
        if (starValue <= 4) return "Average";
        if (starValue <= 6) return "Good";
        if (starValue <= 8) return "Excellent";
        return "Awesome";
    };

    const handleStarClick = (starValue) => {
        if (!disabled && onChange) {
            onChange(starValue);
        }
    };

    const handleStarHover = (starValue) => {
        if (!disabled) {
            setHoveredStar(starValue);
        }
    };

    const handleMouseLeave = () => {
        setHoveredStar(null);
    };

    const displayValue = hoveredStar !== null ? hoveredStar : value || 0;

    return (
        <div className="star-rating-container" style={{ marginBottom: '15px' }}>
            {label && (
                <div style={{ marginBottom: '8px', fontSize: '14px', fontWeight: '500' }}>
                    {label}
                </div>
            )}
            <div 
                className="star-rating"
                style={{ 
                    display: 'flex', 
                    alignItems: 'center',
                    gap: '4px',
                    flexWrap: 'wrap'
                }}
                onMouseLeave={handleMouseLeave}
            >
                {Array.from({ length: maxStars }, (_, index) => {
                    const starValue = index + 1;
                    const isFilled = starValue <= displayValue;
                    
                    return (
                        <span
                            key={starValue}
                            onClick={() => handleStarClick(starValue)}
                            onMouseEnter={() => handleStarHover(starValue)}
                            style={{
                                fontSize: '28px',
                                color: isFilled ? '#ffc107' : '#e0e0e0',
                                cursor: disabled ? 'not-allowed' : 'pointer',
                                transition: 'color 0.2s ease',
                                userSelect: 'none',
                                lineHeight: '1'
                            }}
                        >
                            ★
                        </span>
                    );
                })}
                {hoveredStar !== null && (
                    <span 
                        style={{ 
                            marginLeft: '10px', 
                            fontSize: '14px', 
                            fontWeight: '600',
                            color: '#495057',
                            minWidth: '80px'
                        }}
                    >
                        {getRatingLabel(hoveredStar)}
                    </span>
                )}
                {hoveredStar === null && value && (
                    <span 
                        style={{ 
                            marginLeft: '10px', 
                            fontSize: '14px', 
                            fontWeight: '600',
                            color: '#495057',
                            minWidth: '80px'
                        }}
                    >
                        {getRatingLabel(value)}
                    </span>
                )}
            </div>
        </div>
    );
}

