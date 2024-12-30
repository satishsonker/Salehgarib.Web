import React from 'react'

export default function TableHeader({option}) {
    return (
        <thead>
            <tr role="row">
                {(typeof option.showAction==='function'?option.showAction():option.showAction)&& <th>Action</th>}
                {option.showSerialNo && <th style={{ fontSize: '12px' }}>Sr.</th>}
                {
                    option.headers.length > 0 && option.headers.map((ele, index) => {
                        return <th
                            style={{ fontSize: '12px', width: (!ele?.action?.width ? 'inherit' : ele?.action?.width) }}
                            className={ele?.action?.hAlign === undefined ? "sorting" : "sorting text-" + ele?.action?.hAlign?.trim()}
                            tabIndex="0"
                            aria-controls="example"
                            key={index}
                        >{ele.name}</th>
                    })
                }
            </tr>
        </thead>
    )
}
