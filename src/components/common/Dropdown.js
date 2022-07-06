import React, { useState, useEffect } from 'react'
import { common } from '../../utils/common'

export default function Dropdown({ key, text, data, searchable = false, name, value, defaultText = "Select...", onChange, defaultValue = "" }) {
    key = common.defaultIfEmpty(key, 'id');
    text = common.defaultIfEmpty(text, "value");
    data = common.defaultIfEmpty(data, []);
    // value = common.defaultIfEmpty(value, data[0]?.id);
    onChange = common.defaultIfEmpty(onChange, () => { });
    name = common.defaultIfEmpty(name, 'dropdown1');
    const [searchTerm, setSearchTerm] = useState("");
    const [listData, setListData] = useState(data);
    const [selectdValue, setSelectdValue] = useState(defaultValue);
    const [isListOpen, setIsListOpen] = useState(false);

    useEffect(() => {
        let mainData = data;
        mainData = mainData.filter(x => searchTerm === "" || x[text].toLowerCase().indexOf(searchTerm) > -1);
        setListData(mainData);
    }, [data, searchTerm, isListOpen]);

    const dropdownSelectHandle = (val) => {
       // setSelectdValue(data.find(x => x[key] === val)?.[text]);
        return {
            target: {
                value: val,
                name: name,
                type: 'select-one'
            }
        }
    }
    const handleTextChange = (e) => {
        setIsListOpen(true);
        if (data.find(x => x[text].toLowerCase() === e.target.value.toLowerCase()) === undefined) {
            //setSelectdValue(defaultValue);
            onChange(dropdownSelectHandle(defaultValue))
            setSearchTerm("");
            return;
        }
        //setSelectdValue(e.target.value);
    }
    return (
        <>
            {
                !searchable &&
                <select className='form-control' onChange={e => onChange(e)} name={name} value={value}>
                    <option value="0">{defaultText}</option>
                    {
                        listData?.map((ele, index) => {
                            return <option key={index} value={ele[key]}>{ele[text]}</option>
                        })
                    }
                </select>
            }

            {
                searchable && <>
                    <input
                        type="text"
                        className='form-control'
                        onClick={e => { setIsListOpen(!isListOpen) }}
                        onKeyUp={e => common.throttling(setSearchTerm, 1000, e.target.value.toLowerCase())}
                        value={value.toString()!==defaultValue.toString() ?data.find(x => x[key] === value)?.[text]: ""} name={name}
                        onChange={e => handleTextChange(e)}
                        placeholder={defaultText}></input>
                    {
                        isListOpen && <ul className="list-group" style={{ height: '154px', overflowY: 'auto', position: 'absolute', width: '48%' }}>
                            {
                                listData?.map((ele, index) => {
                                    return <li
                                        onClick={e => { onChange(dropdownSelectHandle(ele[key])); setIsListOpen(!isListOpen) }}
                                        className="list-group-item"
                                        key={index}>{ele[text]}</li>
                                })
                            }
                        </ul>
                    }
                </>
            }
        </>
    )
}
