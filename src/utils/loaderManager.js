// Global loader manager that can be accessed from anywhere
// This will be set by the LoaderProvider
let loaderFunctions = null;

export const setLoaderFunctions = (functions) => {
    loaderFunctions = functions;
};

export const getLoaderFunctions = () => {
    if (!loaderFunctions) {
        console.warn('Loader functions not initialized. Make sure LoaderProvider is mounted.');
        return {
            startLoading: () => {},
            stopLoading: () => {},
            resetLoader: () => {}
        };
    }
    return loaderFunctions;
};
