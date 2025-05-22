import React, { memo, useMemo } from 'react'

const TableHeader = memo(({ option }) => {
    const headerContent = useMemo(() => (
        <>
            {option.showAction && <th>Action</th>}
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
                {headerContent}
            </tr>
        </thead>
    );
});

TableHeader.displayName = 'TableHeader';

export default TableHeader;
