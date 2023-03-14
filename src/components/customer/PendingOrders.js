import React, { useState, useEffect, useRef } from 'react'
import ReactToPrint from 'react-to-print';
import { Api } from '../../apis/Api';
import { apiUrls } from '../../apis/ApiUrls';
import { common } from '../../utils/common';
import { headerFormat } from '../../utils/tableHeaderFormat';
import Breadcrumb from '../common/Breadcrumb'
import ButtonBox from '../common/ButtonBox';
import Dropdown from '../common/Dropdown';
import Inputbox from '../common/Inputbox';
import PrintPendingOrdersReport from '../print/orders/PrintPendingOrdersReport';
import TableView from '../tables/TableView'
import KandooraStatusPopup from './KandooraStatusPopup';

export default function PendingOrders() {
    const [pageNo, setPageNo] = useState(1);
    const [pageSize, setPageSize] = useState(20);
    const [viewOrderDetailId, setViewOrderDetailId] = useState(0);
    const [viewOrderId, setViewOrderId] = useState(0);
    const [salesmanList, setSalesmanList] = useState([])
    const handleSearch = (searchTerm) => {
        if (searchTerm.length > 0 && searchTerm.length < 3)
            return;
        Api.Get(apiUrls.orderController.searchPendingOrders + `?PageNo=${pageNo}&PageSize=${pageSize}&SearchTerm=${common.contactNoEncoder(searchTerm)}&fromDate=${filterData.fromDate}&toDate=${filterData.toDate}`, {}).then(res => {
            var orders = res.data.data
            orders.forEach(element => {
                element.vatAmount = common.calculatePercent(element.subTotalAmount, VAT);
                element.paymentReceived = (((element.totalAmount - element.balanceAmount) / element.totalAmount) * 100).toFixed(2);
            });
            tableOptionTemplet.data = orders;
            tableOptionTemplet.totalRecords = res.data.totalRecords;
            setTableOption({ ...tableOptionTemplet });
            resetOrderDetailsTable();
        }).catch(err => {

        });
    }
    const handleView = (orderId) => {

        setViewOrderDetailId(orderId);
    }
    const printRef = useRef();
    const VAT = parseFloat(process.env.REACT_APP_VAT);
    const CURR_DATE = new Date();
    const [filterData, setFilterData] = useState({
        fromDate: common.getHtmlDate(common.getFirstDateOfMonth(CURR_DATE.getMonth(), CURR_DATE.getFullYear())),
        toDate: common.getHtmlDate(common.getLastDateOfMonth(CURR_DATE.getMonth() + 1, CURR_DATE.getFullYear())),
        paymentType: "Delivery",
        paymentMode: "cash",
        salesmanId:0
    });
    const textChangeHandler = (e) => {
        var { name, type, value } = e.target;
        if (type === 'radio') {
            setFilterData({ ...filterData, ['paymentMode']: value });
        } else {
            setFilterData({ ...filterData, [name]: value });
        }
    }
    const kandooraStatusHandler = (id, data) => {
        setViewOrderId(data);
    }
    const resetOrderDetailsTable = () => {
        tableOptionOrderDetailsTemplet.data = [];
        tableOptionOrderDetailsTemplet.totalRecords = 0;
        setTableOptionOrderDetails({ ...tableOptionOrderDetailsTemplet });
    }
    const tableOptionTemplet = {
        headers: headerFormat.pendingOrder,
        showTableTop: true,
        showFooter: true,
        data: [],
        totalRecords: 0,
        pageSize: pageSize,
        pageNo: pageNo,
        setPageNo: setPageNo,
        setPageSize: setPageSize,
        searchHandler: handleSearch,
        actions: {
            showEdit: false,
            showDelete: false,
            view: {
                handler: handleView
            },
            buttons: [
                {
                    modelId: "kandoora-status-popup-model",
                    icon: "bi bi-bar-chart",
                    title: 'View Kandoora Status',
                    handler: kandooraStatusHandler,
                    showModel: true
                }
            ]
        }
    }

    const tableOptionOrderDetailsTemplet = {
        headers: headerFormat.orderDetails,
        showTableTop: false,
        showFooter: false,
        data: [],
        totalRecords: 0,
        pageSize: pageSize,
        pageNo: pageNo,
        setPageNo: setPageNo,
        setPageSize: setPageSize,
        showAction: false
    }

    const [tableOption, setTableOption] = useState(tableOptionTemplet);
    const [tableOptionOrderDetails, setTableOptionOrderDetails] = useState(tableOptionOrderDetailsTemplet);
    const breadcrumbOption = {
        title: 'Pending Orders',
        items: [
            {
                link: "/customers",
                title: "Customers",
                icon: "bi bi-person-bounding-box"
            },
            {
                isActive: false,
                title: "Pending Orders",
                icon: "bi bi-hourglass-split"
            }
        ]
    }

    //Initial data loading 
    useEffect(() => {
        getBillingData();
    }, [pageNo, pageSize]);

    const getBillingData = () => {
        Api.Get(apiUrls.orderController.getPendingOrder + `?pageNo=${pageNo}&pageSize=${pageSize}&fromDate=${filterData.fromDate}&toDate=${filterData.toDate}&salesmanID=${filterData.salesmanId}`)
            .then(res => {
                debugger;
                var orders = res.data.data
                orders.forEach(element => {
                    element.paymentReceived = (((element.totalAmount - element.balanceAmount) / element.totalAmount) * 100).toFixed(2);
                    element.vatAmount = common.calculatePercent(element.subTotalAmount, VAT);
                    element.qty = element.orderDetails.length;
                    element.advanceAmount = parseFloat(element.advanceAmount + element.paidAmount);
                });
                tableOptionTemplet.data = orders;
                tableOptionTemplet.totalRecords = res.data.totalRecords;
                setTableOption({ ...tableOptionTemplet });
                resetOrderDetailsTable();
            })
    }

    useEffect(() => {
        let orders = tableOption.data.find(x => x.id === viewOrderDetailId);
        if (orders) {
            tableOptionOrderDetailsTemplet.data = orders.orderDetails;
            tableOptionOrderDetailsTemplet.totalRecords = orders.orderDetails.length;
            setTableOptionOrderDetails(tableOptionOrderDetailsTemplet);
        }
    }, [viewOrderDetailId]);

    useEffect(() => {
        Api.Get(apiUrls.dropdownController.employee + `?SearchTerm=salesman`)
            .then(res => {
                setSalesmanList(res.data);
            })
    }, [])

    return (
        <>
            <Breadcrumb option={breadcrumbOption}></Breadcrumb>
            <div>
                <div className='d-flex justify-content-end'>
                <div className='mx-2'>
                    <span> Salesman</span>
                    <Dropdown title="Salesman Filter" defaultText="All" data={salesmanList} value={filterData.salesmanId} onChange={textChangeHandler} name="salesmanId" className="form-control-sm"></Dropdown>
                </div>
                    <div className='mx-2'>
                    <span> From Date</span>
                        <Inputbox title="From Date" max={common.getHtmlDate(new Date())} onChangeHandler={textChangeHandler} name="fromDate" value={filterData.fromDate} className="form-control-sm" showLabel={false} type="date"></Inputbox>
                    </div>
                    <div  className='mx-2'>
                    <span> To Date</span>
                        <Inputbox title="To Date" max={common.getHtmlDate(common.getLastDateOfMonth(CURR_DATE.getMonth() + 1, CURR_DATE.getFullYear()))} onChangeHandler={textChangeHandler} name="toDate" value={filterData.toDate} className="form-control-sm" showLabel={false} type="date"></Inputbox>
                    </div>

                    <div className='mx-2' style={{marginTop:'20px'}}>
                        <ButtonBox type="go" className="btn-sm" onClickHandler={getBillingData} />
                        <ReactToPrint
                            trigger={() => {
                                return <button className='btn btn-sm btn-warning mx-2'><i className='bi bi-printer'></i> Print</button>
                            }}
                            content={(el) => (printRef.current)}
                        />
                    </div>
                </div>
            </div>
            <hr />
            <TableView option={tableOption}></TableView>
            {
                tableOptionOrderDetails.data.length > 0 &&
                <TableView option={tableOptionOrderDetails}></TableView>
            }
            <div className='d-none'>
                <PrintPendingOrdersReport printRef={printRef} data={tableOption.data} filterData={filterData}></PrintPendingOrdersReport>
            </div>
            <KandooraStatusPopup orderData={viewOrderId} />
        </>
    )
}
