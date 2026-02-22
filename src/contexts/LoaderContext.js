import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';
import { setLoaderFunctions } from '../utils/loaderManager';

const LoaderContext = createContext(null);

export const useLoaderContext = () => {
    const context = useContext(LoaderContext);
    if (!context) {
        throw new Error('useLoaderContext must be used within a LoaderProvider');
    }
    return context;
};

export const LoaderProvider = ({ children }) => {
    const [activeRequests, setActiveRequests] = useState(0);
    const [showLoader, setShowLoader] = useState(false);

    const startLoading = useCallback(() => {
        setActiveRequests(prev => {
            const newCount = prev + 1;
            if (newCount === 1) {
                setShowLoader(true);
            }
            return newCount;
        });
    }, []);

    const stopLoading = useCallback(() => {
        setActiveRequests(prev => {
            const newCount = Math.max(0, prev - 1);
            if (newCount === 0) {
                setShowLoader(false);
            }
            return newCount;
        });
    }, []);

    const resetLoader = useCallback(() => {
        setActiveRequests(0);
        setShowLoader(false);
    }, []);

    // Expose loader functions globally for use in API interceptors
    useEffect(() => {
        setLoaderFunctions({
            startLoading,
            stopLoading,
            resetLoader
        });
    }, [startLoading, stopLoading, resetLoader]);

    const value = {
        showLoader,
        startLoading,
        stopLoading,
        resetLoader,
        activeRequests
    };

    return (
        <LoaderContext.Provider value={value}>
            {children}
        </LoaderContext.Provider>
    );
};
