import React, { memo, useMemo } from 'react'

const TableHeader = memo(({ option }) => {
    const headerContent = useMemo(() => (
        <>
                            {option.showAction && (
                    <th className="fixed-column text-center" style={{ width: 'auto', minWidth: 'max-content' }}>
                        Action
                    </th>
                )}
            {option.showSerialNo && <th style={{ fontSize: '12px' }}>Sr.</th>}
            {option.headers.map((ele, index) => (
                <th
                    key={index}
                    style={{ fontSize: '12px', width: ele?.action?.width || 'inherit' }}
                    className={ele?.action?.hAlign ? `sorting text-${ele.action.hAlign.trim()}` : "sorting"}
                    tabIndex="0"
                    aria-controls="example"
                >
                    {ele.name}
                </th>
            ))}
        </>
    ), [option.headers, option.showAction, option.showSerialNo]);

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
    );
});

TableHeader.displayName = 'TableHeader';

export default TableHeader;
