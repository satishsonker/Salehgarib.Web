import React, { useState, useEffect } from 'react'
import { common } from '../../utils/common'

export default function Dropdown({
    elemenyKey,
    text, data,
    searchable = false,
    name,
    value,
    defaultText = "Select...",
    onChange,
    defaultValue = "",
    itemOnClick,
    className = "",
    width = "100%"
}) {
    elemenyKey = common.defaultIfEmpty(elemenyKey, 'id');
    text = common.defaultIfEmpty(text, "value");
    data = common.defaultIfEmpty(data, []);
    onChange = common.defaultIfEmpty(onChange, () => { });
    itemOnClick = common.defaultIfEmpty(itemOnClick, () => { });
    name = common.defaultIfEmpty(name, 'dropdown1');
    const [searchTerm, setSearchTerm] = useState("");
    const [listData, setListData] = useState(data);
    const [isListOpen, setIsListOpen] = useState(false);


    useEffect(() => {
        if (data?.length > 0) {
            console.log('Dropdown Rerender');
            let mainData = data;
            mainData = mainData.filter(x => searchTerm === "" || x[text].toLowerCase().indexOf(searchTerm) > -1);
            setListData(mainData);
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
        onChange(dropdownSelectHandle(e.target.value));
    }
    return (
        <>
            {
                !searchable &&
                <select className={'form-control ' + className} onChange={e => onChange(e)} name={name} value={value}>
                    <option value="0">{defaultText}</option>
                    {
                        listData?.map((ele, index) => {
                            return <option onClick={e => itemOnClick(ele)} key={index} value={ele[elemenyKey]}>{ele[text]}</option>
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
                            value={value.toString() !== defaultValue.toString() ? data.find(x => x[elemenyKey] === value)?.[text] : ""}
                            name={name}
                            onChange={e => { handleTextChange(e) }}
                            //onBlur={e=>setIsListOpen(false)}
                            placeholder={defaultText}></input>
                        {
                            isListOpen && <ul className="list-group" style={{ height: "auto", boxShadow: "2px 2px 4px 1px grey", maxHeight: '154px', overflowY: 'auto', position: 'absolute', width: width, zIndex: '100' }}>
                                {
                                    listData?.map((ele, index) => {
                                        return <li style={{ cursor: "pointer" }}
                                            onClick={e => { onChange(dropdownSelectHandle(ele[elemenyKey])); setIsListOpen(!isListOpen); itemOnClick(ele) }}
                                            className="list-group-item"
                                            key={index}>{ele[text]}</li>
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
