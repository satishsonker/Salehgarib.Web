import React, { useState, useEffect } from 'react'
import { Api } from '../../apis/Api';
import { apiUrls } from '../../apis/ApiUrls';
import Breadcrumb from '../common/Breadcrumb'
import TableView from '../tables/TableView';
import KandooraStatusPopup from './KandooraStatusPopup';
import { headerFormat } from '../../utils/tableHeaderFormat';
import MeasurementUpdatePopop from './MeasurementUpdatePopop';
import { common } from '../../utils/common';
import Inputbox from '../common/Inputbox';
import ButtonBox from '../common/ButtonBox';
import KandooraPicturePopup from './KandooraPicturePopup';

export default function OrderPieceDetails() {
    const [selectedOrderForDelivery, setSelectedOrderForDelivery] = useState({});
    const [viewOrderDetailId, setViewOrderDetailId] = useState(0);
    const [viewOrderId, setViewOrderId] = useState(0);
    const [pageNo, setPageNo] = useState(1);
    const [pageSize, setPageSize] = useState(20);
    const vat = parseFloat(process.env.REACT_APP_VAT);
    const [kandooraDetailId, setKandooraDetailId] = useState(0);
    const [fetchData, setFetchData] = useState(0);
    const [filter, setFilter] = useState({
        fromDate: common.getHtmlDate(common.addYearInCurrDate(-3)),
        toDate: common.getHtmlDate(new Date())
    });

    const handleSearch = (searchTerm) => {
        setKandooraDetailId({ ...{} });
        if (searchTerm.length > 0 && searchTerm.length < 3)
            return;
        Api.Get(apiUrls.orderController.search + `?PageNo=${pageNo}&PageSize=${pageSize}&SearchTerm=${searchTerm.replace('+', '')}&fromDate=1988-01-01&toDate=${common.getHtmlDate(new Date())}`, {}).then(res => {

            var orders = res.data.data
            orders.forEach(element => {
                var vatObj = common.calculateVAT(element.subTotalAmount, vat);
                element.vatAmount = vatObj.vatAmount
                element.subTotalAmount = parseFloat(element.totalAmount - vatObj.vatAmount);
                element.balanceAmount = parseFloat(element.balanceAmount);
                element.totalAmount = parseFloat(element.totalAmount);
                element.advanceAmount = parseFloat(element.advanceAmount);
                element.qty = element.orderDetails.filter(x => !x.isCancelled).length;
                element.paymentReceived = (((element.totalAmount - element.balanceAmount) / element.totalAmount) * 100).toFixed(2);
                element.vat = vat;
            });
            setViewOrderDetailId(0);
            tableOptionTemplet.data = orders;
            tableOptionTemplet.totalRecords = res.data.totalRecords;
            setTableOption({ ...tableOptionTemplet });
            resetOrderDetailsTable();
        }).catch(err => {

        });
        const handleView = (orderId) => {

            setViewOrderDetailId(orderId);
        }
    }
    const updateMeasurementHandler = (id, data) => {
        //var selectedOrder = tableOption.data.find(order => order.id === id);
        setKandooraDetailId(data);
    }
    const handleView = (orderId) => {

        setViewOrderDetailId(orderId);
    }
    const kandooraStatusHandler = (id, data) => {
        setViewOrderId(data);
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
        searchPlaceHolderText: "Search by Contact No, Name, Salesman etc.",
        searchBoxWidth: '74%',
        changeRowClassHandler: (data) => {
            if (data.orderDetails.filter(x => x.isCancelled).length === data.orderDetails.length)
                return "cancelOrder"
            else if (data.orderDetails.filter(x => x.isCancelled).length > 0)
                return "partcancelOrder"
            else if (data.status === 'delivered')
                return "deliveredOrder"
            else
                return "";
        },
        actions: {
            showView: true,
            showPrint: false,
            showDelete: false,
            showEdit: false,
            popupModelId: "",
            view: {
                handler: handleView,
                title: "View Order Details"
            },
            buttons: [
                {
                    modelId: "kandoora-status-popup-model",
                    icon: "bi bi-bar-chart",
                    title: 'View Kandoora Status',
                    handler: kandooraStatusHandler,
                    showModel: true
                },
                {
                    modelId: "measurement-update-popup-model",
                    icon: "bi bi-fullscreen-exit",
                    title: 'Update Measument and Design Model',
                    handler: updateMeasurementHandler,
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
        searchHandler: handleSearch,
        changeRowClassHandler: (data) => {
            return data?.isCancelled ? "bg-danger text-white" : "";
        },
        actions: {
            showView: false,
            showDelete: false,
            showEdit: false,
            popupModelId: "",
            buttons: [
                {
                    modelId: "kandoora-photo-popup-model",
                    icon: "bi bi-camera",
                    title: 'Update Kandoora Picture',
                    showModel: true
                }
            ]
        }
    }
    const [tableOption, setTableOption] = useState(tableOptionTemplet);
    const [tableOptionOrderDetails, setTableOptionOrderDetails] = useState(tableOptionOrderDetailsTemplet);
    const resetOrderDetailsTable = () => {
        tableOptionOrderDetailsTemplet.data = [];
        tableOptionOrderDetailsTemplet.totalRecords = 0;
        setTableOptionOrderDetails({ ...tableOptionOrderDetailsTemplet });
    }

    const breadcrumbOption = {
        title: 'Orders',
        items: [
            {
                link: "/customers",
                title: "Customers",
                icon: "bi bi-person-bounding-box"
            },
            {
                isActive: false,
                title: "Customers Orders",
                icon: "bi bi-cart3"
            }
        ]
    }
    useEffect(() => {
        Api.Get(apiUrls.orderController.getAll + `?pageNo=${pageNo}&pageSize=${pageSize}&fromDate=${filter.fromDate}&toDate=${filter.toDate}`)
            .then(res => {
                var orders = res.data.data
                orders.forEach(element => {
                    var vatObj = common.calculateVAT(element.subTotalAmount, vat);
                    element.vatAmount = vatObj.vatAmount
                    element.subTotalAmount = parseFloat(element.totalAmount - vatObj.vatAmount);
                    element.balanceAmount = parseFloat(element.balanceAmount);
                    element.totalAmount = parseFloat(element.totalAmount);
                    debugger;
                    element.advanceAmount = parseFloat(element.advanceAmount + element.paidAmount);
                    element.qty = element.orderDetails.filter(x => !x.isCancelled).length;
                    element.paymentReceived = (((element.totalAmount - element.balanceAmount) / element.totalAmount) * 100).toFixed(2);
                    element.vat = vat;
                });
                tableOptionTemplet.data = orders;
                tableOptionTemplet.totalRecords = res.data.totalRecords;
                setTableOption({ ...tableOptionTemplet });
                resetOrderDetailsTable();
            }).catch(err => {
            })
    }, [pageNo, pageSize, fetchData]);

    const filterDataChangeHandler = (e) => {
        var { name, value } = e.target;
        setFilter({ ...filter, [name]: value });
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
            });
            tableOptionOrderDetailsTemplet.data = orders.orderDetails;
            tableOptionOrderDetailsTemplet.totalRecords = orders.orderDetails.length;
            setTableOptionOrderDetails(tableOptionOrderDetailsTemplet);
        }
    }, [viewOrderDetailId])
    return (
        <>
            <Breadcrumb option={breadcrumbOption}></Breadcrumb>

            <div className="d-flex justify-content-between">
                <div>
                    <h6 className="mb-0 text-uppercase">Piece Details</h6>
                </div>
                <div className="d-flex justify-content-end">
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
            </div>
            <hr style={{ margin: "0 0 16px 0" }} />
            <TableView option={tableOption}></TableView>
            {
                tableOptionOrderDetails.data.length > 0 &&
                <TableView option={tableOptionOrderDetails}></TableView>
            }
            <KandooraPicturePopup orderData={viewOrderId} />
            {
              kandooraDetailId!==undefined &&  Object.keys(kandooraDetailId).length > 0 && <MeasurementUpdatePopop orderData={kandooraDetailId} searchHandler={handleSearch} />
            }
              <KandooraPicturePopup orderDetail={kandooraDetailId} />
        </>
    )
}
