import React, { useState, useEffect } from 'react'
import { Api } from '../../apis/Api';
import { apiUrls } from '../../apis/ApiUrls';
import { common } from '../../utils/common';
import { headerFormat } from '../../utils/tableHeaderFormat';
import Breadcrumb from '../common/Breadcrumb'
import ButtonBox from '../common/ButtonBox';
import Dropdown from '../common/Dropdown';
import Inputbox from '../common/Inputbox';
import TableView from '../tables/TableView'

export default function CancelOrders() {
    const [pageNo, setPageNo] = useState(1);
    const [pageSize, setPageSize] = useState(20);
    const [viewOrderDetailId, setViewOrderDetailId] = useState(0);
    const [fetchData, setFetchData] = useState(0);
    const [salesmanList, setSalesmanList] = useState([])
    const VAT = parseFloat(process.env.REACT_APP_VAT);
    const [filter, setFilter] = useState({
        fromDate: common.getHtmlDate(common.addYearInCurrDate(-10)),
        toDate: common.getHtmlDate(new Date()),
        salesmanId:0
    })
    const handleSearch = (searchTerm) => {
        if (searchTerm.length > 0 && searchTerm.length < 3)
            return;
        Api.Get(apiUrls.orderController.searchCancelledOrders + `?PageNo=${pageNo}&PageSize=${pageSize}&SearchTerm=${searchTerm}&fromDate=${filter.fromDate}&toDate=${filter.toDate}`, {}).then(res => {
            var orders = res.data.data
            orders.forEach(element => {
                var cancelledQty = element.orderDetails.filter(x => x.isCancelled).length;
                if (cancelledQty === element.qty)
                    element.status = "Cancelled"
                else
                    element.status = "Partially Cancelled"
                element.totalAmount = element.orderDetails.reduce((sum, ele) => { return sum += ele.totalAmount }, 0);
                let vatAmount = ((element.totalAmount / (100 + VAT)) * VAT);
                element.subTotalAmount = element.totalAmount - vatAmount;
                element.vatAmount = vatAmount;
                element.qty = element.orderDetails.length + " Of " + element.qty;
            });
            tableOptionTemplet.data = orders;
            tableOptionTemplet.totalRecords = res.data.totalRecords;
            setTableOption({ ...tableOptionTemplet });
            resetOrderDetailsTable();

        })
    }
    const resetOrderDetailsTable = () => {
        tableOptionOrderDetailsTemplet.data = [];
        tableOptionOrderDetailsTemplet.totalRecords = 0;
        setTableOptionOrderDetails({ ...tableOptionOrderDetailsTemplet });
    }
    const handleView = (orderId) => {

        setViewOrderDetailId(orderId);
    }
    const tableOptionTemplet = {
        headers: headerFormat.orderCancelled,
        showTableTop: true,
        showFooter: false,
        data: [],
        totalRecords: 0,
        pageSize: pageSize,
        pageNo: pageNo,
        setPageNo: setPageNo,
        setPageSize: setPageSize,
        searchHandler: handleSearch,
        changeRowClassHandler: (data) => {
            if (data?.orderDetails?.filter(x => x.isCancelled).length !== parseInt(data?.qty?.split('Of')[1]))
                return "cancelOrder"
        },
        actions: {
            showEdit: false,
            showDelete: false,
            view: {
                handler: handleView
            }
        }
    }
    const filterDataChangeHandler = (e) => {
        var { name, value } = e.target;
        setFilter({ ...filter, [name]: value });
    }
    const tableOptionOrderDetailsTemplet = {
        headers: headerFormat.orderDetailCancelled,
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
        title: 'Cancel Orders',
        items: [
            {
                link: "/customers",
                title: "Customers",
                icon: "bi bi-person-bounding-box"
            },
            {
                isActive: false,
                title: "Cancel Orders",
                icon: "bi bi-x-octagon-fill"
            }
        ]
    }

    //Initial data loading 
    useEffect(() => {
        Api.Get(apiUrls.orderController.getCancelledOrder + `?pageNo=${pageNo}&pageSize=${pageSize}&fromDate=${filter.fromDate}&toDate=${filter.toDate}&salesmanId=${filter.salesmanId}`)
            .then(res => {
                var orders = res.data.data
                orders.forEach(element => {
                    var cancelledQty = element.orderDetails.filter(x => x.isCancelled).length;
                    if (cancelledQty === element.qty)
                        element.status = "Cancelled"
                    else
                        element.status = "Partially Cancelled"
                    element.totalAmount = element.orderDetails.reduce((sum, ele) => { return sum += ele.totalAmount }, 0);
                    let vatAmount = ((element.totalAmount / (100 + VAT)) * VAT);
                    element.subTotalAmount = element.totalAmount - vatAmount;
                    element.vatAmount = vatAmount;
                    element.qty = element.orderDetails.length + " Of " + element.qty;
                });

                tableOptionTemplet.data = orders;
                tableOptionTemplet.totalRecords = res.data.totalRecords;
                setTableOption({ ...tableOptionTemplet });
                resetOrderDetailsTable();
            })
    }, [pageNo, pageSize, fetchData]);

    useEffect(() => {
        let orders = tableOption.data.find(x => x.id === viewOrderDetailId);
        if (orders) {
            orders.orderDetails.forEach(element => {
                if (element.isCancelled)
                    element.status = "Cancelled"
                let vatAmount = element.totalAmount - element.subTotalAmount;
                element.vatAmount = vatAmount;
                element.vat = orders.vat;
            })

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
            <div className="d-flex justify-content-end">
            <div className='mx-2'>
                    <span> Salesman</span>
                    <Dropdown title="Salesman Filter" defaultText="All" data={salesmanList} value={filter.salesmanId} onChange={filterDataChangeHandler} name="salesmanId" className="form-control-sm"></Dropdown>
                </div>
                <div className='mx-2'>
                    <span> From Date</span>
                    <Inputbox type="date" name="fromDate" value={filter.fromDate} max={filter.toDate} onChangeHandler={filterDataChangeHandler} className="form-control-sm" showLabel={false} />
                </div>
                <div className='mx-2'>
                    <span> To Date</span>
                    <Inputbox type="date" name="toDate" min={filter.fromDate} value={filter.toDate} onChangeHandler={filterDataChangeHandler} className="form-control-sm" showLabel={false} />
                </div>
                <div className='mx-2 my-3 py-1'>
                    <ButtonBox type="go" onClickHandler={e => { setFetchData(x => x + 1) }} className="btn-sm"></ButtonBox>
                </div>
            </div>
            <hr />
            <TableView option={tableOption}></TableView>
            {
                tableOptionOrderDetails.data.length > 0 &&
                <TableView option={tableOptionOrderDetails}></TableView>
            }
        </>
    )
}
