import React from 'react'
import { common } from '../../utils/common';
import useScript from '../common/UseScript';
import TableAction from './TableAction'

export default function TableView({ option }) {
    option = common.defaultIfEmpty(option, {});
    option.headers = common.defaultIfEmpty(option.headers, []);
    option.showAction = common.defaultIfEmpty(option.showAction, true);
    option.data = common.defaultIfEmpty(option.data, []);

    useScript('assets/js/table-datatable.js');
    return (
        <>
            <div className="card">
                <div className="card-body">
                    <div className="table-responsive">
                        <table id="example" className="table table-striped table-bordered" style={{ width: '100%' }}>
                            <thead>
                                <tr>
                                    {
                                        option.headers.map((ele, index) => {
                                            return <th key={index}>{ele.name}</th>
                                        })
                                    }
                                    {option.showAction && <th>Action</th>}
                                </tr>
                            </thead>
                            <tbody>
                                {
                                    option.data.map((dataEle, dataIndex) => {
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
            </div>
        </>
    )
}
