import React, { useState, useMemo, useCallback, memo } from 'react';
import { common } from '../../utils/common';
import AlertMessage from '../common/AlertMessage';
import Pagination from './Pagination';
import TableAction from './TableAction';
import TableImageViewer from './TableImageViewer';
import TableTop from './TableTop';
import TableHeaderTop from './TableHeaderTop';
import TableHeader from './TableHeader';

const TableView = memo(({ option }) => {
    const [sortBy, setSortBy] = useState({
        column: 'default',
        type: 'asc'
    });
    const [imageViewerPath, setImageViewerPath] = useState("");

    // Memoize options object
    const processedOptions = useMemo(() => ({
        ...option,
        setTableOption: common.defaultIfEmpty(option?.setTableOption, () => {}),
        originalData: common.defaultIfEmpty(option.originalData, []),
        showHeaderTop: common.defaultIfEmpty(option.showHeaderTop, false),
        headers: common.defaultIfEmpty(option.headers, []),
        showAction: common.defaultIfEmpty(option.showAction, true),
        totalRecords: common.defaultIfEmpty(option.totalRecords, 0),
        data: common.defaultIfEmpty(option.data, []),
        setPageNo: common.defaultIfEmpty(option.setPageNo, () => {}),
        setPageSize: common.defaultIfEmpty(option.setPageSize, () => {}),
        searchHandler: common.defaultIfEmpty(option.searchHandler, () => {}),
        showTableTop: common.defaultIfEmpty(option.showTableTop, true),
        showPagination: common.defaultIfEmpty(option.showPagination, true),
        showFooter: common.defaultIfEmpty(option.showFooter, true),
        showSerialNo: common.defaultIfEmpty(option.showSerialNo, false),
        showSorting: common.defaultIfEmpty(option.showSorting, true),
        tableInCard: common.defaultIfEmpty(option.tableInCard, true),
        changeRowClassHandler: common.defaultIfEmpty(option.changeRowClassHandler, () => '')
    }), [option]);

    // Memoize handlers
    const handlePageSizeChange = useCallback((e) => {
        processedOptions.setPageSize(e.target.value);
        processedOptions.setPageNo(1);
    }, [processedOptions]);

    const clickHandler = useCallback((data, action, rowData) => {
        if (action?.image) {
            const imagePath = action.imageProp === undefined ? data : rowData[action.imageProp];
            setImageViewerPath(imagePath);
        }
    }, []);

    const columnDataPlotter = useCallback((dataRow, headerRow, rowIndex, colIndex, data, allheaders) => {
        if (headerRow.customColumn && typeof headerRow.customColumn === 'function') {
            return common.formatTableData(
                headerRow.customColumn(dataRow, headerRow, rowIndex, colIndex, data, allheaders),
                headerRow.action,
                dataRow
            );
        }
        return common.formatTableData(dataRow[headerRow.prop], headerRow.action, dataRow);
    }, []);

    // Memoize sorted data
    const sortedData = useMemo(() => {
        if (!processedOptions.data?.length) return [];
        if (!sortBy.column || sortBy.column === 'default') return processedOptions.data;
        
        return [...processedOptions.data].sort((a, b) => {
            const aVal = a[sortBy.column];
            const bVal = b[sortBy.column];
            
            if (aVal < bVal) return sortBy.type === 'asc' ? -1 : 1;
            if (aVal > bVal) return sortBy.type === 'asc' ? 1 : -1;
            return 0;
        });
    }, [processedOptions.data, sortBy]);

    // Memoize the table body content
    const tableBodyContent = useMemo(() => {
        if (!sortedData.length) {
            return (
                <tr>
                    <td
                        style={{ textAlign: "center", height: "32px", verticalAlign: "middle" }}
                        colSpan={processedOptions.headers.length + 1 + (processedOptions.showSerialNo ? 1 : 0)}
                    >
                        <AlertMessage message="No Record Found" textAlign="center" type="info" />
                    </td>
                </tr>
            );
        }

        return sortedData.map((dataEle, dataIndex) => (
            <tr key={dataIndex}>
                {processedOptions.showAction && (
                    <td>
                        <TableAction
                            data={dataEle}
                            dataId={dataEle?.id}
                            option={processedOptions.actions}
                        />
                    </td>
                )}
                {processedOptions.showSerialNo && (
                    <td className="text-center">{dataIndex + 1}</td>
                )}
                {processedOptions.headers.map((headerEle, headerIndex) => (
                    <td
                        key={headerIndex}
                        style={{ fontSize: '12px', position: 'relative' }}
                        onClick={() => clickHandler(dataEle[headerEle.prop], headerEle.action, dataEle)}
                        className={`${processedOptions.changeRowClassHandler(dataEle, headerEle.prop, dataIndex, headerIndex)} ${
                            headerEle?.action?.dAlign === undefined
                                ? "text-center"
                                : `text-${headerEle.action.dAlign.trim()}`
                        }`}
                        title={(headerEle?.action?.showTooltip ?? true) ? (headerEle.title ?? headerEle.name) : ""}
                        data-toggle={(headerEle?.action?.showTooltip ?? true) ? "tooltip" : ""}
                        data-bs-placement="top"
                    >
                        {columnDataPlotter(dataEle, headerEle, dataIndex, headerIndex, sortedData, processedOptions.headers)}
                    </td>
                ))}
            </tr>
        ));
    }, [sortedData, processedOptions, columnDataPlotter, clickHandler]);

    // Memoize footer content
    const footerContent = useMemo(() => {
        if (!processedOptions.showFooter) return null;

        return (
            <tfoot>
                <tr>
                    {processedOptions.showAction && <th></th>}
                    {processedOptions.showSerialNo && <th>Sr.</th>}
                    {processedOptions.headers.map((ele, index) => {
                        if (ele?.action?.footerCount === true) {
                            return (
                                <th key={index} className={ele?.action?.hAlign ? `text-${ele.action.hAlign.trim()}` : ""}>
                                    {processedOptions.data?.length}
                                </th>
                            );
                        }

                        if (ele?.action?.footerSum === undefined || ele?.action?.footerSum === false) {
                            return (
                                <th key={index} className={ele?.action?.hAlign ? `text-${ele.action.hAlign.trim()}` : ""}>
                                    {ele?.action?.footerText ?? ele.name}
                                    {ele?.action?.suffixFooterText}
                                </th>
                            );
                        }

                        if (typeof ele?.action?.footerSum === "function") {
                            return (
                                <th key={index} className={ele?.action?.hAlign ? `text-${ele.action.hAlign.trim()}` : ""}>
                                    {ele.action.footerSum(processedOptions.data, ele, ele?.action?.footerSumInDecimal)}
                                    {ele?.action?.suffixFooterText}
                                </th>
                            );
                        }

                        return (
                            <th key={index} className={ele?.action?.hAlign ? `text-${ele.action.hAlign.trim()}` : ""}>
                                {common.printDecimal(processedOptions.data.reduce((sum, innerEle) => sum + (innerEle[ele.prop] || 0), 0))}
                                {ele?.action?.suffixFooterText}
                            </th>
                        );
                    })}
                </tr>
            </tfoot>
        );
    }, [processedOptions]);

    return (
        <div className={processedOptions.tableInCard ? "card" : ""}>
            <div className={processedOptions.tableInCard ? "card-body" : ""}>
                {processedOptions.showTableTop && (
                    <TableTop
                        sortBy={sortBy}
                        showSorting={processedOptions.showSorting}
                        setSortBy={setSortBy}
                        options={processedOptions}
                        searchPlaceHolderText={processedOptions.searchPlaceHolderText}
                        width={processedOptions.searchBoxWidth}
                        handlePageSizeChange={handlePageSizeChange}
                        searchHandler={processedOptions.searchHandler}
                    />
                )}
                <div className="table-responsive">
                    <div id="example_wrapper" className="dataTables_wrapper dt-bootstrap5">
                        <div className="row">
                            <div className="col-sm-12" style={{ maxHeight: processedOptions.maxHeight }}>
                                <table id="example" className="table table-striped table-bordered fixTableHead" style={{ width: "100%" }}>
                                    {processedOptions.showHeaderTop && (
                                        <>
                                            <TableHeaderTop option={processedOptions} />
                                            <TableHeader option={processedOptions} />
                                        </>
                                    )}
                                    {!processedOptions.showHeaderTop && <TableHeader option={processedOptions} />}
                                    <tbody>
                                        {tableBodyContent}
                                    </tbody>
                                    {footerContent}
                                </table>
                            </div>
                        </div>
                    </div>
                </div>
                {processedOptions.showPagination && <Pagination option={processedOptions} />}
                <TableImageViewer imagePath={imageViewerPath} />
            </div>
        </div>
    );
});

TableView.displayName = 'TableView';

export default TableView;
