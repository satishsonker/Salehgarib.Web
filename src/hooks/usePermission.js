import React from 'react'
import useLocalStorage from './useLocalStorage';
export default function usePermission() {
    const [getItem] = useLocalStorage(process.env.REACT_APP_PERMISSION_STORAGE_KEY);
    var permissions = getItem();
    const hasUserPermission = (permissionName) => {
        return permissions.find(x => x.permissionResourceName.toLowerCase() === permissionName.toLowerCase()) === undefined ? false : true;
    }

    return [hasUserPermission];
}
