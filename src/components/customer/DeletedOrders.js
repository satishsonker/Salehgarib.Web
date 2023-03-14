import React, { useState, useEffect } from 'react'
import { Api } from '../../apis/Api';
import { apiUrls } from '../../apis/ApiUrls';
import { orderStatus } from '../../constants/ConstantValues';
import { common } from '../../utils/common';
import { headerFormat } from '../../utils/tableHeaderFormat';
import Breadcrumb from '../common/Breadcrumb'
import ButtonBox from '../common/ButtonBox';
import Dropdown from '../common/Dropdown';
import Inputbox from '../common/Inputbox';
import TableView from '../tables/TableView'

export default function DeletedOrders() {
    const [pageNo, setPageNo] = useState(1);
    const [pageSize, setPageSize] = useState(20);
    const [viewOrderDetailId, setViewOrderDetailId] = useState(0);
    const [salesmanList, setSalesmanList] = useState([])
    const VAT = parseFloat(process.env.REACT_APP_VAT);
    const [fetchData, setFetchData] = useState(0);
    const [filter, setFilter] = useState({
        fromDate: common.getHtmlDate(common.addYearInCurrDate(-10)),
        toDate: common.getHtmlDate(new Date()),
        salesmanId: 0
    });
    const handleSearch = (searchTerm) => {
        if (searchTerm.length > 0 && searchTerm.length < 3)
            return;
        Api.Get(apiUrls.orderController.searchDeletedOrders + `?PageNo=${pageNo}&PageSize=${pageSize}&SearchTerm=${searchTerm}}&fromDate=${filter.fromDate}&toDate=${filter.toDate}`).then(res => {
            var orders = res.data.data
            orders.forEach(element => {
                element.status = orderStatus.deleted.value;
                let vatAmount = common.calculateVAT(element.totalAmount, VAT).vatAmount;
                element.subTotalAmount = element.totalAmount - vatAmount;
                element.vatAmount = vatAmount;
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

    const resetOrderDetailsTable = () => {
        tableOptionOrderDetailsTemplet.data = [];
        tableOptionOrderDetailsTemplet.totalRecords = 0;
        setTableOptionOrderDetails({ ...tableOptionOrderDetailsTemplet });
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
        actions: {
            showEdit: false,
            showDelete: false,
            view: {
                handler: handleView
            }
        }
    }

    const tableOptionOrderDetailsTemplet = {
        headers: headerFormat.orderDetailDeleted,
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
        title: 'Deleted Orders',
        items: [
            {
                link: "/customers",
                title: "Customers",
                icon: "bi bi-person-bounding-box"
            },
            {
                isActive: false,
                title: "Deleted Orders",
                icon: "bi bi-hourglass-split"
            }
        ]
    }
    const filterDataChangeHandler = (e) => {
        var { name, value } = e.target;
        setFilter({ ...filter, [name]: value });
    }
    //Initial data loading 
    useEffect(() => {
        Api.Get(apiUrls.orderController.getDeletedOrder + `?pageNo=${pageNo}&pageSize=${pageSize}&fromDate=${filter.fromDate}&toDate=${filter.toDate}&salesmanId=${filter.salesmanId}`)
            .then(res => {
                var orders = res.data.data
                orders.forEach(element => {
                    element.status = "Deleted"
                    let vatAmount = common.calculateVAT(element.subTotalAmount,VAT).vatAmount;
                    element.subTotalAmount = element.totalAmount - vatAmount;
                    element.vatAmount = vatAmount;
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
            tableOptionOrderDetailsTemplet.data = orders.orderDetails;
            tableOptionOrderDetailsTemplet.totalRecords = orders.orderDetails.length;
            setTableOptionOrderDetails(tableOptionOrderDetailsTemplet);
        }
    }, [viewOrderDetailId])

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
