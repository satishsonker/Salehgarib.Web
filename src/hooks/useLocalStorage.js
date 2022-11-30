
export default function useLocalStorage(storageKey = null) {
    storageKey = storageKey === undefined || storageKey === null ? process.env.REACT_APP_TOKEN_STORAGE_KEY : storageKey;
    const getItem=(isJson=true)=>{
        var item=localStorage.getItem(storageKey);
        if(item===undefined)
        return item;
        return isJson?JSON.parse(item):item;
    }
    const getItemWithKey=(key,isJson=true)=>{
        var item=localStorage.getItem(key);
        if(item===undefined || item===null)
        return item;
        return isJson?JSON.parse(item):item;
    }

    const setItem=(data,isJson=true)=>{
        data= isJson?JSON.stringify(data):data;
        localStorage.setItem(storageKey, data);
    }
    const setItemWithKey=(data,key)=>{
        localStorage.setItem(key, data);
    }
    return [getItem,setItem,getItemWithKey,setItemWithKey];
}
