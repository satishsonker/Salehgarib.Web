import React from 'react'

export default function TableHeaderTop({ option, data }) {
    const getHeaderText=(ele)=>{
        if(typeof ele?.headerTop?.text==="function")
            return ele?.headerTop?.text(option?.data, ele, ele?.action?.footerSumInDecimal);
        else
            return ele.headerTop?.text===undefined?ele?.name:ele?.headerTop?.text;


    }
    return (
        <thead>
            <tr role="row">
                {option.showAction && <th></th>}
                {option.showSerialNo && <th style={{ fontSize: '12px' }}></th>}
                {
                    option.headers.length > 0 && option.headers.map((ele, index) => {
                        if (ele?.headerTop === undefined) {
                            return <th
                                style={{ fontSize: '12px', width: (!ele?.action?.width ? 'inherit' : ele?.action?.width) }}
                                className={ele?.action?.hAlign === undefined ? "sorting" : "sorting text-" + ele?.action?.hAlign?.trim()}
                                tabIndex="0"
                                aria-controls="example"
                                key={index}
                            ></th>
                        }
                        return <th
                            style={{ fontSize: '12px', width: (!ele?.action?.width ? 'inherit' : ele?.action?.width) }}
                            className={ele?.action?.hAlign === undefined ? "sorting" : "sorting text-" + ele?.action?.hAlign?.trim()}
                            tabIndex="0"
                            aria-controls="example"
                            key={index}
                        >{getHeaderText(ele)}</th>
                    })
                }
            </tr>
        </thead>
    )
}
