import React, { memo, useCallback, useMemo } from 'react'

const TableHeaderTop = memo(({ option }) => {
    const getHeaderText = useCallback((ele) => {
        if (typeof ele?.headerTop?.text === "function") {
            return ele?.headerTop?.text(option?.data, ele, option, ele?.action?.footerSumInDecimal);
        }
        return ele.headerTop?.text ?? ele?.name;
    }, [option?.data]);

    const headerContent = useMemo(() => (
        <>
            {option.showAction && <th></th>}
            {option.showSerialNo && <th style={{ fontSize: '12px' }}></th>}
            {option.headers.map((ele, index) => {
                if (ele?.headerTop === undefined) {
                    return (
                        <th
                            key={index}
                            style={{ fontSize: '12px', width: ele?.action?.width || 'inherit' }}
                            className={ele?.action?.hAlign ? `sorting text-${ele.action.hAlign.trim()}` : "sorting"}
                            tabIndex="0"
                            aria-controls="example"
                        />
                    );
                }

                return (
                    <th
                        key={index}
                        style={{
                            fontSize: '12px',
                            zIndex: '100',
                            width: ele?.action?.width || 'inherit'
                        }}
                        className={ele?.action?.hAlign ? `sorting text-${ele.action.hAlign.trim()}` : "sorting"}
                        tabIndex="0"
                        aria-controls="example"
                    >
                        {getHeaderText(ele)}
                    </th>
                );
            })}
        </>
    ), [option.headers, option.showAction, option.showSerialNo, getHeaderText]);

    return (
        <thead>
            <tr role="row">
                {headerContent}
            </tr>
        </thead>
    );
});

TableHeaderTop.displayName = 'TableHeaderTop';

export default TableHeaderTop;
