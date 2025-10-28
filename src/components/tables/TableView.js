import React, { useState } from 'react'
import { common } from '../../utils/common';
import AlertMessage from '../common/AlertMessage';
import './TableFixed.css';
import Pagination from './Pagination';
import TableAction from './TableAction';
import TableImageViewer from './TableImageViewer';
import TableTop from './TableTop';
import TableHeaderTop from './TableHeaderTop';
import TableHeader from './TableHeader';

export default function TableView({ option }) {
    const [sortBy, setSortBy] = useState({
        column: 'default',
        type: 'asc'
    })
    option = common.defaultIfEmpty(option, {});
    option.setTableOption=common.defaultIfEmpty(option?.setTableOption,()=>{});
    option.originalData=common.defaultIfEmpty(option.originalData,[]);
    option.showHeaderTop = common.defaultIfEmpty(option.showHeaderTop, false);
    option.headers = common.defaultIfEmpty(option.headers, []);
    option.showAction = common.defaultIfEmpty(option.showAction, true);
    option.totalRecords = common.defaultIfEmpty(option.totalRecords, 0);
    option.data = common.defaultIfEmpty(option.data, []);
    option.setPageNo = common.defaultIfEmpty(option.setPageNo, () => { });
    option.setSearchTerm = common.defaultIfEmpty(option.setSearchTerm, () => { });
    option.searchTerm = common.defaultIfEmpty(option.searchTerm, '');
    option.setPageSize = common.defaultIfEmpty(option.setPageSize, () => { });
    option.searchHandler = common.defaultIfEmpty(option.searchHandler, () => { });
    option.showTableTop = common.defaultIfEmpty(option.showTableTop, true);
    option.showPagination = common.defaultIfEmpty(option.showPagination, true);
    option.showFooter = common.defaultIfEmpty(option.showFooter, true);
    option.showSerialNo = common.defaultIfEmpty(option.showSerialNo, false);
    option.showSorting = common.defaultIfEmpty(option.showSorting, true);
    option.tableInCard=common.defaultIfEmpty(option.tableInCard, true);
    option.changeRowClassHandler = common.defaultIfEmpty(option.changeRowClassHandler, () => { return '' });
    const handlePageSizeChange = (e) => {
        option.setPageSize(e.target.value);
        option.setPageNo(1);
    }
    const [imageViewerPath, setImageViewerPath] = useState("");
    const clickHandler = (data, action, rowData) => {
        if (action?.image) {
            let imagePath = action.imageProp === undefined ? data : rowData[action.imageProp];
            setImageViewerPath(imagePath);
        }
    }
    const columnDataPlotter = (dataRow, headerRow,rowIndex,colIndex,data,allheaders) => {
        if (headerRow.customColumn && typeof headerRow.customColumn === 'function') {
            return common.formatTableData(headerRow.customColumn(dataRow, headerRow,rowIndex,colIndex,data,allheaders), headerRow.action, dataRow);
        }
        return common.formatTableData(getValue(dataRow,headerRow.prop), headerRow.action, dataRow);
    }
    const getSortedArray = () => {
        return option?.data?.sort((a, b) => {
            if (a[sortBy.column] < b[sortBy.column]) {
                return sortBy?.type === 'asc' ? -1 : 1;
            }
            if (a[sortBy.column] > b[sortBy.column]) {
                return sortBy?.type === 'asc' ? 1 : -1;
            }
            return 0;
        });
    }

    const getValue=(obj, path)=> {
  return path.split('.').reduce((acc, key) => {
    return acc && acc[key] !== undefined ? acc[key] : undefined;
  }, obj);
}
    return (
        <>
            <div className={option.tableInCard?"card":""}>
                <div className={option.tableInCard?"card-body":""}>
                    {
                        option.showTableTop &&
                        <TableTop sortBy={sortBy} showSorting={option?.showSorting} setSortBy={setSortBy} options={option} searchPlaceHolderText={option.searchPlaceHolderText} width={option.searchBoxWidth} handlePageSizeChange={handlePageSizeChange} searchHandler={option.searchHandler}></TableTop>
                    }
                    <div className="table-fixed-wrapper">
                        <div id="example_wrapper" className="dataTables_wrapper dt-bootstrap5">
                            <div className="row">
                                <div className="col-sm-12" style={{ maxHeight: option.maxHeight }}>
                                    <table id="example" className="table table-striped table-bordered table-fixed fixTableHead" style={{ width: "100%" }} role="grid" aria-describedby="example_info">
                                        {option.showHeaderTop && <>
                                            <TableHeaderTop option={option}></TableHeaderTop>
                                            <TableHeader option={option}></TableHeader>
                                        </>}
                                        {!option.showHeaderTop && <>
                                            <TableHeader option={option}></TableHeader>
                                        </>}

                                        <tbody>
                                            {
                                                option.data?.length > 0 && (
                                                    getSortedArray()?.map((dataEle, dataIndex) => {
                                                        return <tr key={dataIndex}>
                                                            {(typeof option.showAction==='function'?option.showAction():option.showAction) && <td><TableAction data={dataEle} dataId={dataEle?.id} datalength={option.data?.length} rowIndex={dataIndex} option={option?.actions}></TableAction></td>}
                                                            {option.showSerialNo && <td className="text-center">{dataIndex + 1}</td>}
                                                            {
                                                                option.headers.map((headerEle, headerIndex) => {
                                                                    return <td
                                                                        style={{ fontSize: '12px', position: 'relative' }}
                                                                        onClick={e => clickHandler(dataEle[headerEle.prop], headerEle.action, dataEle)}
                                                                        key={headerIndex}
                                                                        className={option.changeRowClassHandler(dataEle, headerEle.prop, dataIndex, headerIndex) + (headerEle?.action?.dAlign === undefined ? " text-center" : " text-" + headerEle?.action?.dAlign?.trim())}
                                                                        title={(headerEle?.action?.showTooltip ?? true) === true ? (headerEle.title ?? headerEle.name) : ""}
                                                                        data-toggle={(headerEle?.action?.showTooltip ?? true) === true ? "tooltip" : ""}
                                                                        data-bs-placement="top"
                                                                        data-bs-original-title={(headerEle?.action?.showTooltip ?? true) === true ? (headerEle.title ?? headerEle.name) : ""}>
                                                                        {columnDataPlotter(dataEle, headerEle,dataIndex,headerIndex,getSortedArray(),option.headers)}
                                                                    </td>
                                                                })
                                                            }</tr>
                                                    })
                                                )
                                            }
                                            {/* No record found when data length is zero */}
                                            {
                                                option.data.length === 0 && (
                                                    <tr>
                                                        <td style={{ textAlign: "center", height: "32px", verticalAlign: "middle" }} colSpan={option.headers.length + 1 + (option.showSerialNo ? 1 : 0)}>
                                                            <AlertMessage message="No Record Found" textAlign="center" type="info" />
                                                        </td>
                                                    </tr>
                                                )
                                            }
                                        </tbody>
                                        {
                                            option.showFooter &&
                                            <tfoot>
                                                <tr>
                                                    {option.showAction && <th className="fixed-column"></th>}
                                                    {option.showSerialNo && <th>Sr.</th>}
                                                    {
                                                        option.headers.map((ele, index) => {
                                                            if (ele?.action?.footerCount === true)
                                                                return <th className={ele?.action?.hAlign === undefined ? "" : "text-" + ele?.action?.hAlign?.trim()} key={index}>{option.data?.length}</th>
                                                            else if (ele?.action?.footerSum === undefined || ele?.action?.footerSum === false)
                                                                return <th className={ele?.action?.hAlign === undefined ? "" : "text-" + ele?.action?.hAlign?.trim()} key={index}>{ele?.action?.footerText === undefined ? ele.name : ele?.action?.footerText}{ele?.action?.suffixFooterText === undefined ? "" : ele.action?.suffixFooterText}</th>
                                                            else if (ele?.action?.footerSum === true && (ele?.action?.footerSumInDecimal === undefined || ele?.action?.footerSumInDecimal === true))
                                                                return <th key={index} className={ele?.action?.hAlign === undefined ? "" : " text-" + ele?.action?.hAlign?.trim()}>{common.printDecimal(option?.data.reduce((sum, innerEle) => {
                                                                    return sum += innerEle[ele.prop]
                                                                }, 0))}{ele?.action?.suffixFooterText === undefined ? "" : ele.action?.suffixFooterText}</th>
                                                            else if (ele?.action?.footerSum === true && ele?.action?.footerSumInDecimal === false)
                                                                return <th key={index} className={ele?.action?.hAlign === undefined ? "" : " text-" + ele?.action?.hAlign?.trim()}>{option?.data.reduce((sum, innerEle) => {
                                                                    return sum += innerEle[ele.prop]
                                                                }, 0)}{ele?.action?.suffixFooterText === undefined ? "" : ele.action?.suffixFooterText}</th>
                                                            else if (typeof (ele?.action?.footerSum) === 'function')
                                                                return <th className={ele?.action?.hAlign === undefined ? "" : "text-" + ele?.action?.hAlign?.trim()} key={index}>{ele?.action?.footerSum(option?.data, ele, ele?.action?.footerSumInDecimal)}{ele?.action?.suffixFooterText === undefined ? "" : ele.action?.suffixFooterText}</th>
                                                        })
                                                    }
                                                </tr>
                                            </tfoot>
                                        }
                                    </table>
                                </div>
                            </div>
                        </div>
                    </div>
                    {
                        option.showPagination &&
                        <Pagination option={option} ></Pagination>
                    }
                    <TableImageViewer imagePath={imageViewerPath}></TableImageViewer>
                </div>
            </div>
        </>
    )
}
