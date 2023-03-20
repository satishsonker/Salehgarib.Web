import React, { useState, useEffect, useRef } from 'react'
import { common } from '../../utils/common';
import { headerFormat } from '../../utils/tableHeaderFormat';
import Breadcrumb from '../common/Breadcrumb'
import Inputbox from '../common/Inputbox';
import ReactToPrint from 'react-to-print';
import ButtonBox from '../common/ButtonBox';
import { Api } from '../../apis/Api';
import { apiUrls } from '../../apis/ApiUrls';
import TableView from '../tables/TableView';
import PrintEachKandooraExpReport from '../print/admin/account/PrintEachKandooraExpReport';

export default function EachKandooraExpenseReport() {
    const printRef = useRef();
    const CURR_DATE = new Date();
    const [pageNo, setPageNo] = useState(1);
    const [pageSize, setPageSize] = useState(20);
    const [filterData, setFilterData] = useState({
        fromDate: common.getHtmlDate(common.getFirstDateOfMonth(CURR_DATE.getMonth(), CURR_DATE.getFullYear())),
        toDate: common.getHtmlDate(common.getLastDateOfMonth(CURR_DATE.getMonth() + 1, CURR_DATE.getFullYear())),
    });
    const breadcrumbOption = {
        title: 'Kandoora Expense Report',
        items: [
            {
                title: "Report",
                icon: "bi bi-journal-bookmark-fill",
                isActive: false,
            },
            {
                title: "Kandoora Expense Report",
                icon: "bi bi-file-bar-graph",
                isActive: false,
            }
        ]
    }
    const tableOptionTemplet = {
        headers: headerFormat.eachKandooraExpReort,
        data: [],
        totalRecords: 0,
        pageSize: pageSize,
        pageNo: pageNo,
        setPageNo: setPageNo,
        setPageSize: setPageSize,
        showAction: false
    }
    const [tableOption, setTableOption] = useState(tableOptionTemplet);
    const textChangeHandler = (e) => {
        var { name, type, value } = e.target;
        setFilterData({ ...filterData, [name]: value });
    }
    const getReportData = () => {
        Api.Get(apiUrls.reportController.getKandooraExpReport + `fromDate=${filterData.fromDate}&toDate=${filterData.toDate}&pageNo=${pageNo}&pageSize=${pageSize}`)
            .then(res => {
                tableOptionTemplet.data = res.data.data;
                tableOptionTemplet.totalRecords = res.data.totalRecords;
                setTableOption({ ...tableOptionTemplet });
            });
    }
    useEffect(() => {
        getReportData();
    }, [pageNo, pageSize])

    return (
        <>
            <Breadcrumb option={breadcrumbOption} />
            <div className="d-flex justify-content-between">
                <h6 className="mb-0 text-uppercase">Each Kandoora Expense Report</h6>
                <div>
                    <div className='d-flex'>
                        <div className='mx-2'>
                            <Inputbox title="From Date" max={common.getHtmlDate(new Date())} onChangeHandler={textChangeHandler} name="fromDate" value={filterData.fromDate} className="form-control-sm" showLabel={false} type="date"></Inputbox>
                        </div>
                        <div className='mx-2'>
                            <Inputbox title="To Date" max={common.getHtmlDate(common.getLastDateOfMonth(CURR_DATE.getMonth() + 1, CURR_DATE.getFullYear()))} onChangeHandler={textChangeHandler} name="toDate" value={filterData.toDate} className="form-control-sm" showLabel={false} type="date"></Inputbox>
                        </div>

                        <div className='mx-2'>
                            <ButtonBox type="go" className="btn-sm" onClickHandler={getReportData} />
                            <ReactToPrint
                                trigger={() => {
                                    return <button className='btn btn-sm btn-warning mx-2'><i className='bi bi-printer'></i> Print</button>
                                }}
                                content={(el) => (printRef.current)}
                            />
                        </div>
                    </div>
                </div>
            </div>
            <hr />
            <div className='card'>
                <div className='card-body'>
                    <TableView option={tableOption} />
                </div>
                <div className='d-none'>
                    <PrintEachKandooraExpReport data={tableOption.data} filterData={filterData} printRef={printRef} />
                </div>
            </div>
        </>
    )
}
