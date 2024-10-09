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
    className = "",
    width = "100%",
    multiSelect = false,
    currentIndex = -1,
    itemOnClick,
    title = '',
    disableTitle = true,
    disabled = false,
    displayDefaultText = true,
    searchPattern = "%%",
    clearValue = false,
    ddlListHeight = '154px'
}) => {
    elementKey = common.defaultIfEmpty(elementKey, 'id');
    text = common.defaultIfEmpty(text, "value");
    data = common.defaultIfEmpty(data, []);
    value = common.defaultIfEmpty(value, "");
    onChange = common.defaultIfEmpty(onChange, () => { });
    itemOnClick = common.defaultIfEmpty(itemOnClick, () => { });
    name = common.defaultIfEmpty(name, 'dropdown1');
    clearValue = common.defaultIfEmpty(clearValue, false);
    const [cursor, setCursor] = useState(0)
    const [searchTerm, setSearchTerm] = useState("");
    const [listData, setListData] = useState(data);
    const [isListOpen, setIsListOpen] = useState(false);
    const [multiSelectList, setMultiSelectList] = useState(value?.toString().split(','));
    const listDdlRef = useRef();
    const searchBoxRef = useRef();
    const randomListContainterId = parseInt(Math.random() * 10000000000000000000);
    const randomListItemId = parseInt(Math.random() * 10000000000000000000);
    if (multiSelect && multiSelectList.length === 0) {
        value = "";
    }
    const [localText, setLocalText] = useState(" ")
    useEffect(() => {
        if (!data || data?.length===0)
            return;
        let newData;
        if (typeof data.filter !== "undefined") {
            if (searchHandler !== undefined) {
                newData = searchHandler(data, searchTerm)
            }
            else {
                if (searchPattern === "_%") { // Start With
                    newData = data?.filter(x => searchTerm?.trim() === "" || x[text].toLowerCase().startsWith(searchTerm.toLowerCase()));
                }
                if (searchPattern === "%_") { // Start With
                    newData = data?.filter(x => searchTerm?.trim() === "" || x[text].toLowerCase().endsWith(searchTerm.toLowerCase()));
                }
                else
                    newData = data?.filter(x => searchTerm?.trim() === "" || x[text].toLowerCase().indexOf(searchTerm.toLowerCase()) > -1);
            }
        }
        setCursor(0);
        if (newData) {
            setListData([...newData]);
        }
        if (searchBoxRef.current !== undefined) {
            searchBoxRef.current.value = ""; // Assign default value when data change
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
    const toggleListDdl = (visible, override) => {
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
            if ([...hoverEle].filter(element => element.classList.contains('active-list-ddl')).length === 0 || override === true) {
                ddl.classList.add('list-ddl');
                ddl.classList.remove('active-list-ddl');
            }
        }
        else {
            ddl.classList.remove('list-ddl')
            ddl.classList.add('active-list-ddl')
        }

        setIsListOpen(visible ?? true);
    }
    const handleKeyDown = (e) => {
        var { key, keyCode } = e;
        const element = document.getElementById('listItem_' + randomListItemId.toString() + "_" + cursor);
        var topPos = element.offsetTop;
        // arrow up/down button should select next/previous list element
        if (keyCode === 38 && cursor > 0) {
            setCursor(prevState => prevState - 1);
            scrollTo(document.getElementById("ddlContainer_" + randomListContainterId), topPos - 30, 600);
        } else if (keyCode === 40 && cursor < listData.length - 1) {
            setCursor(prevState => prevState + 1);
            toggleListDdl(true, true);
            scrollTo(document.getElementById("ddlContainer_" + randomListContainterId), topPos - 30, 600);
        }
        else if (key === "Enter") {
            onChange(dropdownSelectHandle(listData[cursor][elementKey])); setLocalText(" ")
            itemOnClick(listData[cursor], cursor); toggleListDdl(false, true);

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
                                toggleListDdl();
                            }}
                            onKeyUp={e => common.throttling(setSearchTerm, 200, e.target.value)}
                            onKeyDown={e => { handleKeyDown(e) }}
                            value={getTextBoxValue() === " " ? "" : getTextBoxValue()}
                            name={name}
                            onBlur={e => toggleListDdl(false)}
                            onChange={e => handleTextChange(e)}
                            disabled={disabled ? "disabled" : ""}
                            placeholder={defaultText}></input>
                        {
                            <div id={"ddlContainer_" + randomListContainterId}
                                onBlur={e => toggleListDdl(false)}
                                style={{ height: "auto", boxShadow: isListOpen ? "2px 2px 4px 1px grey" : "none", maxHeight: ddlListHeight, position: 'absolute', width: width, zIndex: '100', minWidth: '200px', overflowY: 'auto' }}>
                                <ul
                                    id='searchable-ddl' ref={listDdlRef}
                                    className="list-group list-ddl"
                                    tabIndex="0"
                                >
                                    {
                                        listData?.map((ele, index) => {
                                            return <li style={{ cursor: "pointer" }} id={"listItem_" + randomListItemId.toString() + "_" + index}
                                                onClick={e => {
                                                    onChange(dropdownSelectHandle(ele[elementKey])); setLocalText(" ")
                                                    itemOnClick(ele, currentIndex); toggleListDdl(false, true);
                                                }}
                                                className={cursor === index ? "list-group-item active-list-ddl-hover" : "list-group-item"}
                                                key={index}>{ele[text]}</li>
                                        })
                                    }
                                </ul>
                            </div>
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
});

function scrollTo(element, to, duration) {
    var start = element.scrollTop,
        change = to - start,
        currentTime = 0,
        increment = 30;

    var animateScroll = function () {
        currentTime += increment;
        var val = Math.easeInOutQuad(currentTime, start, change, duration);
        element.scrollTop = val;
        if (currentTime < duration) {
            setTimeout(animateScroll, increment);
        }
    };
    animateScroll();
}

//t = current time
//b = start value
//c = change in value
//d = duration
Math.easeInOutQuad = (t, b, c, d) => {
    t /= d / 2;
    if (t < 1) return c / 2 * t * t + b;
    t--;
    return -c / 2 * (t * (t - 2) - 1) + b;
};
