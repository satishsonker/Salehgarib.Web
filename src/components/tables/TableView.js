import React, { useState } from 'react'
import { common } from '../../utils/common';
import Pagination from './Pagination';
import TableAction from './TableAction';
import TableImageViewer from './TableImageViewer';
import TableTop from './TableTop';

export default function TableView({ option }) {
    option = common.defaultIfEmpty(option, {});
    option.headers = common.defaultIfEmpty(option.headers, []);
    option.showAction = common.defaultIfEmpty(option.showAction, true);
    option.totalRecords = common.defaultIfEmpty(option.totalRecords, 0);
    option.data = common.defaultIfEmpty(option.data, []);
    option.setPageNo = common.defaultIfEmpty(option.setPageNo, () => { });
    option.setPageSize = common.defaultIfEmpty(option.setPageSize, () => { });
    option.searchHandler = common.defaultIfEmpty(option.searchHandler, () => { });
    option.showTableTop = common.defaultIfEmpty(option.showTableTop, true);
    option.showPagination = common.defaultIfEmpty(option.showPagination, true);
    option.showFooter = common.defaultIfEmpty(option.showFooter, true);
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
    const columnDataPlotter = (dataRow, headerRow) => {
        if (headerRow.customColumn && typeof headerRow.customColumn === 'function') {
            return common.formatTableData(headerRow.customColumn(dataRow, headerRow), headerRow.action, dataRow);
        }
        return common.formatTableData(dataRow[headerRow.prop], headerRow.action, dataRow);
    }
    return (
        <>
            <div className="card">
                <div className="card-body">
                    {
                        option.showTableTop &&
                        <TableTop searchPlaceHolderText={option.searchPlaceHolderText} width={option.searchBoxWidth} handlePageSizeChange={handlePageSizeChange} searchHandler={option.searchHandler}></TableTop>
                    }
                    <div className="table-responsive">
                        <div id="example_wrapper" className="dataTables_wrapper dt-bootstrap5">
                            <div className="row">
                                <div className="col-sm-12" style={{ maxHeight: option.maxHeight }}>
                                    <table id="example" className="table table-striped table-bordered fixTableHead" style={{ width: "100%" }} role="grid" aria-describedby="example_info">
                                        <thead>
                                            <tr role="row">
                                                {option.showAction && <th>Action</th>}
                                                {
                                                    option.headers.length > 0 && option.headers.map((ele, index) => {
                                                        return <th style={{ fontSize: '12px' }} className={ele?.action?.hAlign === undefined ? "sorting" : "sorting text-" + ele?.action?.hAlign?.trim()} tabIndex="0" aria-controls="example" key={index}>{ele.name}</th>
                                                    })
                                                }

                                            </tr>
                                        </thead>
                                        <tbody>
                                            {
                                                option.data.length > 0 && (
                                                    option.data.map((dataEle, dataIndex) => {
                                                        return <tr key={dataIndex}>
                                                            {option.showAction && <td><TableAction data={dataEle} dataId={dataEle.id} option={option.actions}></TableAction></td>}
                                                            {
                                                                option.headers.map((headerEle, headerIndex) => {
                                                                    return <td
                                                                        style={{ fontSize: '12px' }}
                                                                        onClick={e => clickHandler(dataEle[headerEle.prop], headerEle.action, dataEle)}
                                                                        key={headerIndex}
                                                                        className={option.changeRowClassHandler(dataEle, headerEle.prop, dataIndex, headerIndex) + (headerEle?.action?.dAlign === undefined ? " text-center" : " text-" + headerEle?.action?.dAlign?.trim())}
                                                                        title={headerEle.title}>{columnDataPlotter(dataEle, headerEle)}
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
                                                        <td style={{ textAlign: "center", height: "32px", verticalAlign: "middle" }} colSpan={option.headers.length + 1}>No record found</td>
                                                    </tr>
                                                )
                                            }
                                        </tbody>
                                        {
                                            option.showFooter &&
                                            <tfoot>
                                                <tr>
                                                    {option.showAction && <th></th>}
                                                    {
                                                        option.headers.map((ele, index) => {
                                                            if (ele?.action?.footerSum === undefined || ele?.action?.footerSum === false)
                                                                return <th className={ele?.action?.hAlign === undefined ? "" : "text-" + ele?.action?.hAlign?.trim()} key={index}>{ele?.action?.footerText === undefined ? ele.name : ele?.action?.footerText}{ele?.action?.suffixFooterText === undefined ? "" : ele.action?.suffixFooterText}</th>
                                                            else if (ele?.action?.footerSum === true && (ele?.action?.footerSumInDecimal===undefined || ele?.action?.footerSumInDecimal===true))
                                                                return <th key={index} className={ele?.action?.hAlign === undefined ? "" : " text-" + ele?.action?.hAlign?.trim()}>{common.printDecimal(option?.data.reduce((sum, innerEle) => {
                                                                    return sum += innerEle[ele.prop]
                                                                }, 0))}{ele?.action?.suffixFooterText === undefined ? "" : ele.action?.suffixFooterText}</th>
                                                                else if (ele?.action?.footerSum === true && ele?.action?.footerSumInDecimal===false)
                                                                return <th key={index} className={ele?.action?.hAlign === undefined ? "" : " text-" + ele?.action?.hAlign?.trim()}>{option?.data.reduce((sum, innerEle) => {
                                                                    return sum += innerEle[ele.prop]
                                                                }, 0)}{ele?.action?.suffixFooterText === undefined ? "" : ele.action?.suffixFooterText}</th>
                                                            else if (typeof (ele?.action?.footerSum) === 'function')
                                                                return <th className={ele?.action?.hAlign === undefined ? "" : "text-" + ele?.action?.hAlign?.trim()} key={index}>{ele?.action?.footerSum(option?.data, ele)}{ele?.action?.suffixFooterText === undefined ? "" : ele.action?.suffixFooterText}</th>
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
