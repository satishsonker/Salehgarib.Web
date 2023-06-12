import React, { useState, useEffect, useRef } from 'react'
import { common } from '../../utils/common'

export default React.memo(({
    elementKey,
    text,
    data,
    searchable = false,
    searchHandler,
    name,
    value,
    defaultText = "Select...",
    onChange,
    defaultValue = "",
    itemOnClick,
    className = "",
    width = "100%",
    multiSelect = false,
    currentIndex = -1,
    title = '',
    disableTitle = true,
    disabled = false,
    displayDefaultText = true,
    searchPattern = "%%",
    clearValue = false
}) => {
    elementKey = common.defaultIfEmpty(elementKey, 'id');
    text = common.defaultIfEmpty(text, "value");
    data = common.defaultIfEmpty(data, []);
    value = common.defaultIfEmpty(value, "");
    onChange = common.defaultIfEmpty(onChange, () => { });
    itemOnClick = common.defaultIfEmpty(itemOnClick, () => { });
    name = common.defaultIfEmpty(name, 'dropdown1');
    clearValue = common.defaultIfEmpty(clearValue, false);
    const [searchTerm, setSearchTerm] = useState("");
    const [listData, setListData] = useState(data);
    const [isListOpen, setIsListOpen] = useState(false);
    const [multiSelectList, setMultiSelectList] = useState(value?.toString().split(','));
    const listDdlRef = useRef();
    const searchBoxRef=useRef();
    if (multiSelect && multiSelectList.length === 0) {
        value = "";
    }
    const [localText, setLocalText] = useState(" ")
    useEffect(() => {
        if (!data)
            return;
        if (typeof data.filter !== "undefined") {
            if (searchHandler !== undefined) {
                data = searchHandler(data, searchTerm)
            }
            else {
                if (searchPattern === "_%") { // Start With
                    data = data?.filter(x => searchTerm?.trim() === "" || x[text].toLowerCase().startsWith(searchTerm.toLowerCase()));
                }
                if (searchPattern === "%_") { // Start With
                    data = data?.filter(x => searchTerm?.trim() === "" || x[text].toLowerCase().endsWith(searchTerm.toLowerCase()));
                }
                else
                    data = data?.filter(x => searchTerm?.trim() === "" || x[text].toLowerCase().indexOf(searchTerm.toLowerCase()) > -1);
            }
        }
        setListData([...data]);
        if(searchBoxRef.current!==undefined){
        searchBoxRef.current.value=""; // Assign default value when datat change
        }
    }, [searchTerm, data, isListOpen]);


    const dropdownSelectHandle = (val) => {

        return {
            target: {
                value: val,
                name: name,
                type: 'select-one'
            }
        }
    }
    const handleTextChange = (e) => {
        if (!isListOpen) {
            setIsListOpen(true);
        }
        setLocalText(e.target.value);
        //onChange(dropdownSelectHandle(e.target.value));
    }

    const handleMultiSelect = (data, e) => {
        var mainData = multiSelectList;
        if (e.target.checked && mainData?.indexOf(data) === -1) {
            mainData.push(data);
        }
        else {
            mainData = mainData.filter(x => x !== data);
        }
        setMultiSelectList(mainData);
        onChange(dropdownSelectHandle(mainData.filter(x => x !== '').join(",")));
    }

    if (!Array.isArray(listData) && multiSelect && Object.keys(listData).length > 0) {
        let data = [];
        Object.keys(listData).forEach(ele => {
            data.push(listData[ele]);
        });
        setListData([...data]);
    }
    const getTextBoxValue = () => {
        var result = value.toString() !== defaultValue.toString() && (localText === " " || localText === undefined) ? data?.find(x => x[elementKey] === value)?.[text] : localText;
        if (clearValue) {
            clearValue = false;
            return defaultValue;
        }
        return result;
    }
    const toggleListDdl = (visible,override) => {
        var ddl = listDdlRef.current;
        var hoverEle = document.querySelectorAll(":hover");
        if (visible === undefined) {
            if (ddl.classList.contains('list-ddl')) {
                ddl.classList.remove('list-ddl')
                ddl.classList.add('active-list-ddl')
            }
            else {
                ddl.classList.add('list-ddl')
                ddl.classList.remove('active-list-ddl')
            }
        }
        if (visible === false) {
            if ([...hoverEle].filter(element => element.classList.contains('active-list-ddl')).length === 0 || override===true) {
                ddl.classList.add('list-ddl');
                ddl.classList.remove('active-list-ddl');
            }
        }
        else {
            ddl.classList.remove('list-ddl')
            ddl.classList.add('active-list-ddl')
        }
    }

    return (
        <>
            {
                !searchable && !multiSelect &&
                <select title={title} data-toggle={disableTitle ? "" : "tooltip"} className={'form-control ' + className} disabled={disabled ? "disabled" : ""} onChange={e => onChange(e)} name={name} value={value}>
                    {displayDefaultText && <option key={0} value="0">{defaultText}</option>}
                    {
                        listData?.length > 0 && listData?.map(ele => {
                            return <option onClick={e => itemOnClick(ele)} key={ele[elementKey]} value={ele[elementKey]}>{ele[text]}</option>
                        })
                    }
                </select>
            }

            {
                searchable && <>
                    <div style={{ position: "relative" }} title={title} data-toggle={disableTitle ? "" : "tooltip"}>
                        <input title={title}
                            type="text"
                            ref={searchBoxRef}
                            autoComplete='off'
                            className={'form-control ' + className}
                            onClick={e => {
                                //setIsListOpen(!isListOpen); 
                                toggleListDdl();
                            }}
                            onKeyUp={e => common.throttling(setSearchTerm, 200, e.target.value)}
                            value={getTextBoxValue()===" "?"":getTextBoxValue()}
                            name={name}
                            onBlur={e => toggleListDdl(false)}
                            onChange={e => handleTextChange(e)}
                            disabled={disabled ? "disabled" : ""}
                            placeholder={defaultText}></input>
                        {

                            <ul
                                onBlur={e => toggleListDdl(false)} id='searchable-ddl' ref={listDdlRef} onMouseLeave={e => setIsListOpen(false)}
                                className="list-group list-ddl"
                                tabIndex="0"
                                style={{ height: "auto", boxShadow: "2px 2px 4px 1px grey", maxHeight: '154px', overflowY: 'auto', position: 'absolute', width: width, zIndex: '100', minWidth: '200px' }}>
                                {
                                    listData?.map((ele, index) => {
                                        return <li style={{ cursor: "pointer" }}
                                            onClick={e => {
                                                onChange(dropdownSelectHandle(ele[elementKey])); setLocalText(" ")
                                                itemOnClick(ele, currentIndex); toggleListDdl(false,true);
                                            }}
                                            className="list-group-item"
                                            key={index}>{ele[text]}</li>
                                    })
                                }
                            </ul>
                        }
                    </div>
                </>
            }

            {
                multiSelect &&
                <>
                    <div style={{ position: "relative" }} title={title} data-toggle={disableTitle ? "" : "tooltip"}>
                        <input title={title}
                            type="text"
                            className={'form-control ' + className}
                            onClick={e => { setIsListOpen(!isListOpen) }}
                            value={multiSelectList.filter(x => x !== '').join(",")}
                            name={name}
                            onChange={e => { }}
                            disabled={disabled ? "disabled" : ""}
                            placeholder={defaultText}></input>
                        {
                            !disabled && isListOpen && <ul onMouseLeave={e => setIsListOpen(false)} className="list-group" style={{ height: "auto", boxShadow: "2px 2px 4px 1px grey", maxHeight: '154px', overflowY: 'auto', position: 'absolute', width: width, zIndex: '100' }}>
                                {
                                    listData?.map((ele, index) => {
                                        return <li style={{ cursor: "pointer" }}
                                            className="list-group-item"
                                            key={index}>
                                            <div className="form-check form-switch">
                                                <input onChange={e => { }} checked={multiSelectList?.indexOf(ele[text]) > -1 ? "checked" : ""} onClick={e => { handleMultiSelect(ele[text], e) }} className="form-check-input" type="checkbox" id="flexSwitchCheckDefault" />
                                                <label className="form-check-label" htmlFor="flexSwitchCheckDefault">
                                                    {ele[text]}</label>
                                            </div>
                                        </li>
                                    })
                                }
                            </ul>
                        }
                    </div>
                </>
            }
        </>
    )
})
