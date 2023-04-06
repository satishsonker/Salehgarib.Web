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
import Dropdown from '../common/Dropdown';

export default function EachKandooraExpenseReport() {
    const printRef = useRef();
    const CURR_DATE = new Date();
    const [orderStatusList, setOrderStatusList] = useState([]);
    const [salesmanList, setSalesmanList] = useState([]);
    const [pageNo, setPageNo] = useState(1);
    const [pageSize, setPageSize] = useState(20);
    const [filterData, setFilterData] = useState({
        fromDate: common.getHtmlDate(common.getFirstDateOfMonth(CURR_DATE.getMonth(), CURR_DATE.getFullYear())),
        toDate: common.getHtmlDate(common.getLastDateOfMonth(CURR_DATE.getMonth() + 1, CURR_DATE.getFullYear())),
        orderStatus: "ALL",
        salesmanId: 0,
        profitPercentageFilter: 0
    });
    const PERCENT_FILTER = [
        { id: 1, value: "Less than 0%" },
        { id: 2, value: ">=0% And <=20%" },
        { id: 3, value: ">20% And <=40%" },
        { id: 4, value: ">40% And <=60%" },
        { id: 5, value: ">60% And <=80%" },
        { id: 6, value: "Greater than 80%" }
    ]

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

    const search = (searchTerm) => {
        Api.Get(apiUrls.reportController.searchKandooraExpReport + `?pageNo=${pageNo}&pageSize=${pageSize}&searchTerm=${searchTerm}`)
            .then(res => {
                tableOptionTemplet.data = res.data.data;
                tableOptionTemplet.totalRecords = res.data.totalRecords;
                setTableOption({ ...tableOptionTemplet });
            });
    }

    const changeRowColor = (data) => {
        if (data?.profitPercentage < 0)
            return "cancelOrder"
        else if (data?.profitPercentage >= 0 && data?.profitPercentage <= 20)
            return "partcancelOrder"
        else
            return ""
    }
    const tableOptionTemplet = {
        headers: headerFormat.eachKandooraExpReort,
        data: [],
        totalRecords: 0,
        pageSize: pageSize,
        pageNo: pageNo,
        setPageNo: setPageNo,
        setPageSize: setPageSize,
        searchHandler: search,
        showAction: false,
        changeRowClassHandler: changeRowColor
    }
    const [tableOption, setTableOption] = useState(tableOptionTemplet);
    const textChangeHandler = (e) => {
        var { name, type, value } = e.target;
        setFilterData({ ...filterData, [name]: value });
    }

    const getReportData = () => {
        Api.Get(apiUrls.reportController.getKandooraExpReport + `fromDate=${filterData.fromDate}&toDate=${filterData.toDate}&pageNo=${pageNo}&pageSize=${pageSize}&orderStatus=${filterData.orderStatus}&profitPercentageFilter=${filterData.profitPercentageFilter}&salesmanId=${filterData.salesmanId}`)
            .then(res => {
                tableOptionTemplet.data = res.data.data;
                tableOptionTemplet.totalRecords = res.data.totalRecords;
                setTableOption({ ...tableOptionTemplet });
            });
    }

    useEffect(() => {
        let apisList = [];
        apisList.push(Api.Get(apiUrls.dropdownController.employee + `?SearchTerm=salesman`));
        apisList.push(Api.Get(apiUrls.orderController.getOrderStatusList));
        Api.MultiCall(apisList)
            .then(res => {
                setOrderStatusList(res[1].data);
                setSalesmanList(res[0].data);
            });
    }, []);

    useEffect(() => {
        getReportData();
    }, [pageNo, pageSize])


    return (
        <>
            <Breadcrumb option={breadcrumbOption} />
            <div className="d-flex justify-content-end">
                {/* <h6 className="mb-0 text-uppercase">Kandoora Expense</h6> */}
                <div className='mx-1'>
                    <Dropdown title="Order Status" defaultText="All Status" defaultValue="ALL" data={common.dropdownArray(orderStatusList)} value={filterData.orderStatus} name="orderStatus" onChange={textChangeHandler} className="form-control-sm"></Dropdown>
                </div>
                <div className='mx-1'>
                    <Dropdown title="Salesman" defaultText="All Salaesman" defaultValue="0" data={salesmanList} value={filterData.salesmanId} onChange={textChangeHandler} name="salesmanId" className="form-control-sm"></Dropdown>
                </div>
                <div className='mx-1'>
                    <Dropdown title="Profit Percentage Filter" defaultText="All Percentage" defaultValue="0" data={PERCENT_FILTER} value={filterData.profitPercentageFilter} onChange={textChangeHandler} name="profitPercentageFilter" className="form-control-sm"></Dropdown>
                </div>
                <div className='mx-1'>
                    <Inputbox title="From Date" max={common.getHtmlDate(new Date())} onChangeHandler={textChangeHandler} name="fromDate" value={filterData.fromDate} className="form-control-sm" showLabel={false} type="date"></Inputbox>
                </div>
                <div className='mx-1'>
                    <Inputbox title="To Date" max={common.getHtmlDate(common.getLastDateOfMonth(CURR_DATE.getMonth() + 1, CURR_DATE.getFullYear()))} onChangeHandler={textChangeHandler} name="toDate" value={filterData.toDate} className="form-control-sm" showLabel={false} type="date"></Inputbox>
                </div>
                <div className='mx-1'>
                    <ButtonBox type="go" className="btn-sm" onClickHandler={getReportData} />
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
                </div>
                <div className='d-none'>
                    <PrintEachKandooraExpReport data={tableOption.data} filterData={filterData} printRef={printRef} />
                </div>
            </div>
        </>
    )
}
