import React, { useState, useEffect } from 'react'
import { common } from '../../utils/common'

export default function Dropdown({
    elemenyKey,
    text, data,
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
    currentIndex=-1
}) {
    
    elemenyKey = common.defaultIfEmpty(elemenyKey, 'id');
    text = common.defaultIfEmpty(text, "value");
    data = common.defaultIfEmpty(data, []);
    value = common.defaultIfEmpty(value, "");
    onChange = common.defaultIfEmpty(onChange, () => { });
    itemOnClick = common.defaultIfEmpty(itemOnClick, () => { });
    name = common.defaultIfEmpty(name, 'dropdown1');
    const [searchTerm, setSearchTerm] = useState("");
    const [listData, setListData] = useState(data);
    const [isListOpen, setIsListOpen] = useState(false);
    const [multiSelectList, setMultiSelectList] = useState(value?.toString().split(','));

if(multiSelect && multiSelectList.length===0)
{
    value="";
}
    useEffect(() => {
        if (!data || data.length === 0)
            return;
        let mainData = data;
        if(typeof mainData.filter !=="undefined")
        mainData = searchHandler !== undefined ? searchHandler(mainData, searchTerm) : mainData?.filter(x => searchTerm === "" || x[text].toLowerCase().indexOf(searchTerm.toLowerCase()) > -1);
        setListData(mainData);
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
        if(!isListOpen)
        {
            setIsListOpen(true);
        }
        onChange(dropdownSelectHandle(e.target.value));
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
    
   if(!Array.isArray(listData) && multiSelect && Object.keys(listData).length>0)
   {
     let data=[];
     Object.keys(listData).forEach(ele=>{
        data.push(listData[ele]);
     });
     setListData([...data]);
   }
    return (
        <>
            {
                !searchable && !multiSelect &&
                <select className={'form-control ' + className} onChange={e => onChange(e)} name={name} value={value}>
                    <option key={0} value="0">{defaultText}</option>
                    {
                        listData?.map((ele, index) => {
                            return <option onClick={e => itemOnClick(ele)} key={ele[elemenyKey]} value={ele[elemenyKey]}>{ele[text]}</option>
                        })
                    }
                </select>
            }

            {
                searchable && <>
                    <div style={{ position: "relative" }}>
                        <input
                            type="text"
                            className={'form-control ' + className}
                            onClick={e => { setIsListOpen(!isListOpen) }}
                            onKeyUp={e => common.throttling(setSearchTerm, 200, e.target.value)}
                            value={value.toString() !== defaultValue.toString() ? data?.find(x => x[elemenyKey] === value)?.[text] : ""}
                            name={name}
                            onChange={e => handleTextChange(e)}
                            onBlur={e=>setIsListOpen(true)}
                            placeholder={defaultText}></input>
                        {
                            isListOpen && <ul onMouseLeave={e=>setIsListOpen(false)} className="list-group" style={{ height: "auto", boxShadow: "2px 2px 4px 1px grey", maxHeight: '154px', overflowY: 'auto', position: 'absolute', width: width, zIndex: '100' }}>
                                {
                                    listData?.map((ele, index) => {
                                        return <li style={{ cursor: "pointer" }}
                                            onClick={e => { onChange(dropdownSelectHandle(ele[elemenyKey])); setIsListOpen(!isListOpen); itemOnClick(ele,currentIndex) }}
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
                    <div style={{ position: "relative" }}>
                        <input
                            type="text"
                            className={'form-control ' + className}
                            onClick={e => { setIsListOpen(!isListOpen) }}
                            value={multiSelectList.filter(x => x !== '').join(",")}
                            name={name}
                            onChange={e => { }}
                            placeholder={defaultText}></input>
                        {
                            isListOpen && <ul onMouseLeave={e=>setIsListOpen(false)} className="list-group" style={{ height: "auto", boxShadow: "2px 2px 4px 1px grey", maxHeight: '154px', overflowY: 'auto', position: 'absolute', width: width, zIndex: '100' }}>
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
}
