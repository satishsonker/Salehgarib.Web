import React, { useState, useEffect, useRef } from 'react'
import { Api } from '../../apis/Api';
import { apiUrls } from '../../apis/ApiUrls';
import Breadcrumb from '../common/Breadcrumb';
import ReactToPrint from 'react-to-print';
import Dropdown from '../common/Dropdown';
import ButtonBox from '../common/ButtonBox';
import { common } from '../../utils/common';
import Inputbox from '../common/Inputbox';
import TableView from '../tables/TableView';
import { headerFormat } from '../../utils/tableHeaderFormat';
import { PrintDailyWorkStatement } from '../print/admin/account/PrintDailyWorkStatement';

export default function DailyWorkStatement() {
    const curr_month = new Date().getMonth() + 1;
    const curr_year = new Date().getFullYear();
    const [workTypeList, setWorkTypeList] = useState([]);
    const [filterData, setFilterData] = useState({
        workTypeId: 0,
        fromDate: common.getHtmlDate(common.getFirstDateOfMonth(curr_month - 1, curr_year)),
        toDate: common.getHtmlDate(common.getLastDateOfMonth(curr_month, curr_year)),
        reportType: 0,
        workTypeCode: ""
    });
    const reportType = [{ id: 0, value: "Normal Work" }, { id: 1, value: "Alter Work" }];
    const printRef = useRef();
    const [fetchData, setFetchData] = useState(0)
    const breadcrumbOption = {
        title: 'Daily Work Statement',
        items: [
            {
                title: "Report",
                icon: "bi bi-journal-bookmark-fill",
                isActive: false,
            },
            {
                title: "Daily Work Statement",
                icon: "bi bi-file-bar-graph",
                isActive: false,
            }
        ]
    }

    useEffect(() => {
        Api.Get(apiUrls.dropdownController.workTypes)
            .then(res => {
                setWorkTypeList([...res.data]);
            });
    }, []);

    const textChangeHandler = (e) => {
        var { name, type, value } = e.target;
        var modal = filterData;
        if (type === 'select-one') {
            value = parseInt(value);
        }
        if (name === "workTypeId") {
            modal.workTypeCode = workTypeList.find(x => x.id === value)?.code ?? "";
            console.log(modal.workTypeCode);
        }
        setFilterData({ ...filterData, [name]: value });
    }
    const handleSearch = (searchTerm) => {

    }
    const tableOptionTemplet = {
        headers: filterData.workTypeCode !== "4" ? headerFormat.dailyWorkStatement : headerFormat.crystalDailyWorkStatement,
        data: [],
        totalRecords: 0,
        searchHandler: handleSearch,
        showAction: false,
        showSerialNo: true
    }

    const [tableOption, setTableOption] = useState(tableOptionTemplet);

    useEffect(() => {
        let fetchUrl = apiUrls.reportController.getDailyWorkStatement + `ReportType=${filterData.reportType}&WorkType=${filterData.workTypeId}&FromDate=${filterData.fromDate}&ToDate=${filterData.toDate}`;
        if (filterData.workTypeCode === "4") {
            fetchUrl = apiUrls.crytalTrackingController.getAllTrackingOut + `?fromDate=${filterData.fromDate}&toDate=${filterData.toDate}&pageNo=1&pageSize=10000000`;
        }
        Api.Get(fetchUrl)
            .then(res => {
                tableOptionTemplet.data = filterData.workTypeCode === "4" ? res.data.data : res.data;
                tableOptionTemplet.totalRecords = filterData.workTypeCode === "4" ? res.data.totalRecords : res.data.length;
                setTableOption({ ...tableOptionTemplet });
            });
    }, [fetchData]);

    useEffect(() => {
        tableOptionTemplet.headers = parseInt(filterData.workTypeCode) !== 4 ? headerFormat.dailyWorkStatement : headerFormat.crystalDailyWorkStatement;
        tableOptionTemplet.data = [];
        setTableOption({ ...tableOptionTemplet });
    }, [filterData.workTypeCode])


    const calculateSum = (prop) => {
        if (tableOption.data.length === 0)
            return 0;
        return tableOption.data?.reduce((sum, ele) => {
            return sum += ele[prop];
        }, 0);
    }
    return (
        <>
            <Breadcrumb option={breadcrumbOption} />
            <div className="d-flex justify-content-end">
                {/* <h6 className="mb-0 text-uppercase">Kandoora Expense</h6> */}

                <div className='mx-1'>
                    <Dropdown title="Report Type" displayDefaultText={false} data={reportType} value={filterData.reportType} name="reportType" onChange={textChangeHandler} className="form-control-sm"></Dropdown>
                </div>
                <div className='mx-1'>
                    <Inputbox title="From Date" max={common.getHtmlDate(new Date())} onChangeHandler={textChangeHandler} name="fromDate" value={filterData.fromDate} className="form-control-sm" showLabel={false} type="date"></Inputbox>
                </div>
                <div className='mx-1'>
                    <Inputbox title="To Date" max={common.getHtmlDate(common.getLastDateOfMonth(curr_month, curr_year))} onChangeHandler={textChangeHandler} name="toDate" value={filterData.toDate} className="form-control-sm" showLabel={false} type="date"></Inputbox>
                </div>
                <div className='mx-1'>
                    <Dropdown title="Work Type" defaultText="Work Type" data={workTypeList} value={filterData.workTypeId} name="workTypeId" onChange={textChangeHandler} className="form-control-sm"></Dropdown>
                </div>

                <div className='mx-1'>
                    <ButtonBox type="go" className="btn-sm" onClickHandler={() => { setFetchData(prev => prev + 1) }} />
                    <ReactToPrint
                        trigger={() => {
                            return <button className='btn btn-sm btn-warning mx-2'><i className='bi bi-printer'></i> Print</button>
                        }}
                        content={(el) => (printRef.current)}
                    />
                </div>
            </div>
            <hr />
            <div className='card'>
                <div className='card-body'>
                    <TableView option={tableOption} />
                    {filterData.workTypeCode !== "4" &&
                        <div className='row'>
                            <div className='col-3'>
                                <Inputbox labelText="Total Qty" disabled={true} value={tableOption.data.length} className="form-control-sm" />
                            </div>
                            <div className='col-3'>
                                <Inputbox labelText="Total Amount" disabled={true} value={calculateSum('amount')} className="form-control-sm" />
                            </div>
                            <div className='col-3'>
                                <Inputbox labelText="Avg. Amount" disabled={true} value={common.printDecimal(calculateSum('amount') / tableOption.data.length)} className="form-control-sm" />
                            </div>
                            <div className='col-3'>
                                <ReactToPrint
                                    trigger={() => {
                                        return <button className='btn btn-sm btn-warning' style={{ width: '100%', marginTop: '20px' }}><i className='bi bi-printer'></i> Print</button>
                                    }}
                                    content={(el) => (printRef.current)}
                                />
                            </div>
                        </div>
                    }
                     {filterData.workTypeCode === "4" &&
                        <div className='row'>
                            <div className='col-2'>
                                <Inputbox labelText="Total Qty" disabled={true} value={tableOption.data.length} className="form-control-sm" />
                            </div>
                            <div className='col-2'>
                                <Inputbox labelText="Crystal Used" disabled={true} value={tableOption.data.length} className="form-control-sm" />
                            </div>
                            <div className='col-2'>
                                <Inputbox labelText="Total Pkt" disabled={true} value={calculateSum('amount')} className="form-control-sm" />
                            </div>
                            <div className='col-2'>
                                <Inputbox labelText="Total Amount" disabled={true} value={common.printDecimal(calculateSum('amount') / tableOption.data.length)} className="form-control-sm" />
                            </div>
                            <div className='col-2'>
                                <Inputbox labelText="Avg. Amount" disabled={true} value={common.printDecimal(calculateSum('amount') / tableOption.data.length)} className="form-control-sm" />
                            </div>
                            <div className='col-3'>
                                <ReactToPrint
                                    trigger={() => {
                                        return <button className='btn btn-sm btn-warning' style={{ width: '100%', marginTop: '20px' }}><i className='bi bi-printer'></i> Print</button>
                                    }}
                                    content={(el) => (printRef.current)}
                                />
                            </div>
                        </div>
                    }
                </div>
            </div>
            <div className='d-none'>
                <PrintDailyWorkStatement ref={printRef} data={tableOption.data} workTypeCode={filterData.workTypeCode} />
            </div>
        </>
    )
}