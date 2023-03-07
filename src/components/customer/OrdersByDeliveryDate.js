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

export default function OrdersByDeliveryDate() {
    const [pageNo, setPageNo] = useState(1);
    const [pageSize, setPageSize] = useState(20);
    const [fetchData, setFetchData] = useState(0);
    const [searchModel, setSearchModel] = useState({ fromDate: common.getHtmlDate(new Date()), toDate: common.getHtmlDate(new Date()) });
    const [viewOrderDetailId, setViewOrderDetailId] = useState(0);
    const handleTextChange = (e) => {
        let model = searchModel;
        let { type, name, value } = e.target;
        model.customerId = value;
        model.salesmanId = 0;
        if (type === 'select-one')
            value = parseInt(value);
        model[name] = value;
        setSearchModel({ ...model });
    }
    const handleSearch = (searchTerm) => {
        if (searchTerm.length > 0 && searchTerm.length < 3)
            return;
        Api.Get(apiUrls.orderController.searchOrderByDeliveryDate + `?PageNo=${pageNo}&PageSize=${pageSize}&SearchTerm=${searchTerm}`).then(res => {
            var orders = res.data.data
            orders.forEach(element => {
                element.vatAmount = ((element.totalAmount / (100 + element.vat)) * element.vat);
                element.subTotalAmount = parseFloat(element.totalAmount - element.vatAmount);
                element.balanceAmount = parseFloat(element.balanceAmount);
                element.totalAmount = parseFloat(element.totalAmount);
                element.advanceAmount = parseFloat(element.advanceAmount);
                element.vat = parseFloat(element.vat);
                element.updatedAt = element.updatedAt === "0001-01-01T00:00:00" ? "" : element.updatedAt;
                element.paymentReceived = (((element.totalAmount - element.balanceAmount) / element.totalAmount) * 100).toFixed(2);

            });
            tableOptionTemplet.data = orders;
            tableOptionTemplet.totalRecords = res.data.totalRecords;
            setTableOption({ ...tableOptionTemplet });
            tableOptionOrderDetailsTemplet.data = [];
            tableOptionOrderDetailsTemplet.totalRecords = 0;
            setTableOptionOrderDetails({ ...tableOptionOrderDetailsTemplet });
        }).catch(err => {

        });
    }
    const handleView = (orderId) => {

        setViewOrderDetailId(orderId);
    }
    const tableOptionTemplet = {
        headers: headerFormat.order,
        showTableTop: true,
        showFooter: true,
        data: [],
        totalRecords: 0,
        pageSize: pageSize,
        pageNo: pageNo,
        setPageNo: setPageNo,
        setPageSize: setPageSize,
        searchHandler: handleSearch,
        changeRowClassHandler: (data) => {
            if (data.orderDetails.filter(x => x.isCancelled).length === data.orderDetails.length)
                return "cancelOrder"
            else if (data.orderDetails.filter(x => x.isCancelled).length > 0)
                return "partcancelOrder"
            else if (data.isDeleted)
                return "cancelOrder"
            else
                return "";
        },
        actions: {
            showEdit: false,
            showDelete: false,
            view: {
                handler: handleView
            }
        }
    }

    const tableOptionOrderDetailsTemplet = {
        headers: headerFormat.orderDetails,
        changeRowClassHandler: (data) => {
            return data?.isCancelled ? "bg-danger text-white" : "";
        },
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
        title: 'Orders by Delivery Date',
        items: [
            {
                link: "/customers",
                title: "Customers",
                icon: "bi bi-person-bounding-box"
            },
            {
                isActive: false,
                title: "Orders by Delivery Date",
                icon: "bi bi-calendar-week"
            }
        ]
    }

    useEffect(() => {
        if (searchModel.fromDate === '')
            return;
        Api.Get(apiUrls.orderController.getByDeliveryDate + `${searchModel.fromDate}/${searchModel.toDate}?pageNo=${pageNo}&pageSize=${pageSize}`).then(res => {
            var orders = res.data.data
            orders.forEach(element => {
                element.vatAmount = ((element.totalAmount / (100 + element.vat)) * element.vat);
                element.subTotalAmount = parseFloat(element.totalAmount - element.vatAmount);
                element.balanceAmount = parseFloat(element.balanceAmount);
                element.totalAmount = parseFloat(element.totalAmount);
                element.advanceAmount = parseFloat(element.advanceAmount);
                element.vat = parseFloat(element.vat);
                element.updatedAt = element.updatedAt === "0001-01-01T00:00:00" ? "" : element.updatedAt;
                element.paymentReceived = (((element.totalAmount - element.balanceAmount) / element.totalAmount) * 100).toFixed(2);
            });
            tableOptionTemplet.data = orders;
            tableOptionTemplet.totalRecords = res.data.totalRecords;
            setTableOption({ ...tableOptionTemplet });
            resetOrderDetailsTable();
        })
    }, [pageNo, pageSize, fetchData]);
    const resetOrderDetailsTable = () => {
        tableOptionOrderDetailsTemplet.data = [];
        tableOptionOrderDetailsTemplet.totalRecords = 0;
        setTableOptionOrderDetails({ ...tableOptionOrderDetailsTemplet });
    }
    useEffect(() => {
        let orders = tableOption.data.find(x => x.id === viewOrderDetailId);
        if (orders) {
            orders.orderDetails.forEach(element => {
                element.subTotalAmount = parseFloat(element.subTotalAmount).toFixed(2);
                element.price = parseFloat(element.price).toFixed(2);
                element.crystalPrice = parseFloat(element.crystalPrice).toFixed(2);
                element.vatAmount = parseFloat(element.totalAmount - element.subTotalAmount).toFixed(2);
                element.crystal = element.crystal ? element.crystal : '0.0';
                element.updatedAt = element.updatedAt === '0001-01-01T00:00:00' || !element.updatedAt ? '' : element.updatedAt
                if (!element.vat) {
                    element.vat = parseFloat(orders.vat).toFixed(2);;
                }
                if (element.isCancelled === true)
                    element.status = "Cancelled";
                else if (element.isDeleted === true)
                    element.status = "Deleted";
                else
                    element.status = "Active";
            });
            tableOptionOrderDetailsTemplet.data = orders.orderDetails;
            tableOptionOrderDetailsTemplet.totalRecords = orders.orderDetails.length;
            setTableOptionOrderDetails(tableOptionOrderDetailsTemplet);
        }
    }, [viewOrderDetailId])
    return (
        <>
            <Breadcrumb option={breadcrumbOption}></Breadcrumb>
            <hr />
            <div className="d-flex justify-content-end my-2">
                <div className='mx-2'>
                    <span> From Date</span>
                    <Inputbox className="form-control-sm" showLabel={false} type="date" max={searchModel.fromDate} onChangeHandler={e => handleTextChange(e)} name="fromDate" value={searchModel.fromDate} />
                </div>
                <div className='mx-2'>
                    <span> To Date</span>
                    <Inputbox className="form-control-sm" showLabel={false} type="date" max={searchModel.toDate} onChangeHandler={e => handleTextChange(e)} name="toDate" value={searchModel.toDate} />
                </div>
                <div className='my-3'>
                    <ButtonBox type="go" className="btn-sm" onClickHandler={() => { setFetchData(ele => ele + 1) }} />
                </div>
            </div>
            <TableView option={tableOption}></TableView>
            {
                tableOptionOrderDetails.data.length > 0 &&
                <TableView option={tableOptionOrderDetails}></TableView>
            }
        </>
    )
}

