import React,{useState} from 'react'
import { common } from '../../utils/common';
import useScript from '../common/UseScript';
import Pagination from './Pagination';
import TableAction from './TableAction'

export default function TableView({ option }) {
    option = common.defaultIfEmpty(option, {});
    option.headers = common.defaultIfEmpty(option.headers, []);
    option.showAction = common.defaultIfEmpty(option.showAction, true);
    option.totalRecords = common.defaultIfEmpty(option.totalRecords, 0);
    option.data = common.defaultIfEmpty(option.data, []);
    option.setPageNo = common.defaultIfEmpty(option.setPageNo, ()=>{});
    option.setPageSize = common.defaultIfEmpty(option.setPageSize, ()=>{});
   
    const handlePageSizeChange=(e)=>{
        option.setPageSize(e.target.value);
        option.setPageNo(1);
    }
    //useScript('assets/js/table-datatable.js');
    return (
        <>
            <div className="card">
                <div className="card-body">
                    <div className="table-responsive">
                        <div id="example_wrapper" className="dataTables_wrapper dt-bootstrap5">
                            <div className="row">
                                <div className="col-sm-12 col-md-6">
                                    <div className="dataTables_length" id="example_length">
                                        <label>Show
                                            <select onChange={e=>handlePageSizeChange(e)} name="example_length" aria-controls="example" className="form-select form-select-sm">
                                                <option value="10">10</option>
                                                <option value="25">25</option>
                                                <option value="50">50</option>
                                                <option value="100">100</option>
                                            </select>
                                            entries
                                        </label>
                                    </div>
                                </div>
                                <div className="col-sm-12 col-md-6">
                                    <div id="example_filter" className="dataTables_filter">
                                        <label>Search:
                                            <input type="search" className="form-control form-control-sm" placeholder="" aria-controls="example" />
                                        </label>
                                    </div>
                                </div>
                            </div>
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
                                                option.data.length > 0 && option.data.map((dataEle, dataIndex) => {
                                                    return <tr key={dataIndex}>
                                                        {
                                                            option.headers.map((headerEle, headerIndex) => {
                                                                return <td key={headerIndex}>{dataEle[headerEle.prop]}</td>
                                                            })
                                                        }
                                                        {option.showAction && <td><TableAction option={option.actions}></TableAction></td>}
                                                    </tr>
                                                })
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
                           <Pagination option={option} ></Pagination>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}
