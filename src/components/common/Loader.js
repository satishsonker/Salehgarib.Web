import React, { useEffect, useState, useRef } from 'react'
import { common } from '../../utils/common'
import './Loader.css'

export default function Loader({ show, message, variant = 'overlay', size = 'medium' }) {
    show = common.defaultIfEmpty(show, false);
    const [showModel, setShowModel] = useState(show)
    const loaderRef = useRef(null);
    
    useEffect(() => {
        setShowModel(show);
    }, [show])

    // Ensure proper viewport height on mobile devices
    useEffect(() => {
        if (showModel && variant === 'overlay' && loaderRef.current) {
            const setViewportHeight = () => {
                const vh = window.innerHeight * 0.01;
                document.documentElement.style.setProperty('--vh', `${vh}px`);
                if (loaderRef.current) {
                    loaderRef.current.style.height = `${window.innerHeight}px`;
                }
            };

            setViewportHeight();
            window.addEventListener('resize', setViewportHeight);
            window.addEventListener('orientationchange', setViewportHeight);

            return () => {
                window.removeEventListener('resize', setViewportHeight);
                window.removeEventListener('orientationchange', setViewportHeight);
            };
        }
    }, [showModel, variant]);

    if (!showModel)
        return <></>

    const isOverlay = variant === 'overlay';
    const sizeClass = `loader-${size}`;

    return (
        <div 
            ref={loaderRef}
            className={`loader-app ${isOverlay ? 'loader-overlay' : 'loader-inline'} ${sizeClass}`}
        >
            <div className="loader-container">
                <div className="loader-spinner">
                    <div className="spinner-ring"></div>
                    <div className="spinner-ring"></div>
                    <div className="spinner-ring"></div>
                    <div className="spinner-ring"></div>
                </div>
                {message && (
                    <div className="loader-message">
                        {message}
                    </div>
                )}
            </div>
        </div>
    )
}
