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
    const clickHandler = (data, action) => {
        if (action?.image) {
            setImageViewerPath(data);
        }
    }
    return (
        <>
            <div className="card">
                <div className="card-body">
                    {
                        option.showTableTop &&
                        <TableTop handlePageSizeChange={handlePageSizeChange} searchHandler={option.searchHandler}></TableTop>
                    }
                    <div className="table-responsive">
                        <div id="example_wrapper" className="dataTables_wrapper dt-bootstrap5">
                            <div className="row">
                                <div className="col-sm-12">
                                    <table id="example" className="table table-striped table-bordered dataTable" style={{ width: "100%" }} role="grid" aria-describedby="example_info">
                                        <thead>
                                            <tr role="row">
                                                {
                                                    option.headers.length > 0 && option.headers.map((ele, index) => {
                                                        return <th className="sorting" tabIndex="0" aria-controls="example" key={index}>{ele.name}</th>
                                                    })
                                                }
                                                {option.showAction && <th>Action</th>}
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {
                                                option.data.length > 0 && (
                                                    option.data.map((dataEle, dataIndex) => {
                                                        return <tr key={dataIndex}>
                                                            {
                                                                option.headers.map((headerEle, headerIndex) => {
                                                                    return <td
                                                                        onClick={e => clickHandler(dataEle[headerEle.prop], headerEle.action)}
                                                                        key={headerIndex}
                                                                        className={option.changeRowClassHandler(dataEle,headerEle.prop,dataIndex,headerIndex)}
                                                                        title={headerEle.title}>{common.formatTableData(dataEle[headerEle.prop], headerEle.action)}
                                                                    </td>
                                                                })
                                                            }
                                                            {option.showAction && <td><TableAction data={dataEle} dataId={dataEle.id} option={option.actions}></TableAction></td>}
                                                        </tr>
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
                                                    {
                                                        option.headers.map((ele, index) => {
                                                            return <th key={index}>{ele.name}</th>
                                                        })
                                                    }
                                                    {option.showAction && <th>Action</th>}
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
