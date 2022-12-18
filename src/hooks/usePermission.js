import React from 'react'
import useLocalStorage from './useLocalStorage';
export default function usePermission() {
    const [getItem] = useLocalStorage(process.env.REACT_APP_PERMISSION_STORAGE_KEY);
    var permissions = getItem();
    const hasUserPermission = (permissionName) => {
        if(!permissions)
        return false;
        return permissions.find(x => x.permissionResourceCode.toLowerCase() === permissionName.toLowerCase()) === undefined ? false : true;
    }
    return [hasUserPermission];
}
