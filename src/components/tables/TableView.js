import React from 'react'
import { common } from '../../utils/common';
import Pagination from './Pagination';
import TableAction from './TableAction';
import TableTop from './TableTop';

export default function TableView({ option }) {
    option = common.defaultIfEmpty(option, {});
    option.headers = common.defaultIfEmpty(option.headers, []);
    option.showAction = common.defaultIfEmpty(option.showAction, true);
    option.totalRecords = common.defaultIfEmpty(option.totalRecords, 0);
    option.data =common.defaultIfEmpty(option.data, []);
    option.setPageNo = common.defaultIfEmpty(option.setPageNo, () => { });
    option.setPageSize = common.defaultIfEmpty(option.setPageSize, () => { });
    option.searchHandler = common.defaultIfEmpty(option.searchHandler, () => { });

    const handlePageSizeChange = (e) => {
        option.setPageSize(e.target.value);
        option.setPageNo(1);
    }
    //useScript('assets/js/table-datatable.js');
    return (
        <>
            <div className="card">
                <div className="card-body">
                    <TableTop handlePageSizeChange={handlePageSizeChange} searchHandler={option.searchHandler}></TableTop>
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
                                                                    return <td key={headerIndex}>{common.formatTableData(dataEle[headerEle.prop])}</td>
                                                                })
                                                            }
                                                            {option.showAction && <td><TableAction dataId={dataEle.id} option={option.actions}></TableAction></td>}
                                                        </tr>
                                                    })
                                                )
                                            }
                                                {/* No record found when data length is zero */}
                                            {
                                                option.data.length===0 && (
                                                    <tr>
                                                        <td style={{textAlign:"center",height:"32px",verticalAlign:"middle"}} colSpan={option.headers.length+1}>No record found</td>
                                                    </tr>
                                                )
                                            }
                                        </tbody>
                                        <tfoot>
                                            {
                                                option.headers.map((ele, index) => {
                                                    return <th key={index}>{ele.name}</th>
                                                })
                                            }
                                            {option.showAction && <th>Action</th>}
                                        </tfoot>
                                    </table>
                                </div>
                            </div>
                        </div>
                    </div>
                    <Pagination option={option} ></Pagination>
                </div>
            </div>
        </>
    )
}
