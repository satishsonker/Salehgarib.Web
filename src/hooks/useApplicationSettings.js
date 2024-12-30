import { useState, useEffect } from 'react';

const useAppSettings = () => {
  const [applicationSettings, setSettings] = useState(null);

  useEffect(() => {
    // Retrieve the settings string from localStorage
    const settingsStr = window.localStorage.getItem(process.env.REACT_APP_APP_SETTING_STORAGE_KEY);

    // If settings are found, try to parse it as JSON
    if (settingsStr) {
      try {
        const parsedSettings = JSON.parse(settingsStr);
        var parsedJson={};
        parsedSettings?.map((ele=>{
            parsedJson[ele?.key]=ele;
        }))
        setSettings(parsedJson);  // Store the parsed settings in the state
      } catch (error) {
        console.error('Error parsing settings from localStorage:', error);
        setSettings(null);  // If JSON parsing fails, set settings to null
      }
    } else {
      setSettings(null);  // If nothing is found in localStorage, set settings to null
    }
  }, []);  // Empty dependency array means this runs only once on mount

  return applicationSettings;
};

export default useAppSettings;
