import React, { useState, useEffect, useRef } from 'react'
import { toast } from 'react-toastify';
import { Api } from '../../apis/Api';
import { apiUrls } from '../../apis/ApiUrls';
import { toastMessage } from '../../constants/ConstantValues';
import Breadcrumb from '../common/Breadcrumb'
import InputModelBox from '../common/InputModelBox';
import TableImageViewer from '../tables/TableImageViewer';
import TableView from '../tables/TableView';
import CustomerOrderForm from './CustomerOrderForm';
import KandooraStatusPopup from './KandooraStatusPopup';
import KandooraPicturePopup from './KandooraPicturePopup';
import { headerFormat } from '../../utils/tableHeaderFormat';
import MeasurementUpdatePopop from './MeasurementUpdatePopop';
import OrderDeliveryPopup from './OrderDeliveryPopup';
import { common } from '../../utils/common';
import UpdateOrderDate from './UpdateOrderDate';
import PrintOrderReceiptPopup from '../print/orders/PrintOrderReceiptPopup';

export default function CustomerOrders({ userData }) {
    const [selectedOrderForDelivery, setSelectedOrderForDelivery] = useState({});
    const [viewSampleImagePath, setViewSampleImagePath] = useState("");
    const [viewOrderDetailId, setViewOrderDetailId] = useState(0);
    const [kandooraDetailId, setKandooraDetailId] = useState(0);
    const [viewOrderId, setViewOrderId] = useState(0);
    const [pageNo, setPageNo] = useState(1);
    const [pageSize, setPageSize] = useState(20);
    const [cancelOrderState, setCancelOrderState] = useState({ orderId: 0, handler: () => { } });
    const [deleteOrderState, setDeleteOrderState] = useState({ orderId: 0, handler: () => { } });
    const [orderDataToPrint, setOrderDataToPrint] = useState({});
    const [searchWithFilter, setSearchWithFilter] = useState({
        fromDate: common.getHtmlDate(new Date().setFullYear(new Date().getFullYear() - 10)),
        toDate: common.getHtmlDate(new Date()),
        searchTerm: ''
    });
    const vat = parseFloat(process.env.REACT_APP_VAT);
    const handleDelete = (id) => {
        Api.Delete(apiUrls.orderController.delete + id).then(res => {
            if (res.data > 0) {
                handleSearch('');
                toast.success(toastMessage.deleteSuccess);
            }
        }).catch(err => {
            if (err?.response.status !== 400)
                toast.error(toastMessage.deleteError);
        });
    }
    const handleSearch = (searchTerm) => {
        setKandooraDetailId({ ...{} });
        if (searchTerm.length > 0 && searchTerm.length < 3)
            return;
        Api.Get(apiUrls.orderController.search + `?PageNo=${pageNo}&PageSize=${pageSize}&SearchTerm=${searchTerm}`, {}).then(res => {

            var orders = res.data.data
            orders.forEach(element => {
                var vatObj = common.calculateVAT(element.subTotalAmount, vat);
                element.vatAmount = vatObj.vatAmount
                element.subTotalAmount = parseFloat(element.totalAmount - vatObj.vatAmount);
                element.balanceAmount = parseFloat(element.balanceAmount);
                element.totalAmount = parseFloat(element.totalAmount);
                element.advanceAmount = parseFloat(element.advanceAmount);
                element.qty = element.orderDetails.filter(x => !x.isCancelled).length;
                element.vat = vat;
            });
                setViewOrderDetailId(0);
            tableOptionTemplet.data = orders;
            tableOptionTemplet.totalRecords = res.data.totalRecords;
            setTableOption({ ...tableOptionTemplet });
            resetOrderDetailsTable();
        }).catch(err => {

        });
    }
    const handleCancelOrder = (orderId, data) => {
        if (data?.isCancelled) {
            toast.warn(toastMessage.alreadyCancelled);
            return;
        }
        var ele = document.getElementById('cancelOrderOpener');
        ele.click()
        let state = {
            orderId,
            handler: (id, note) => {
                Api.Get(apiUrls.orderController.cancelOrder + `?orderId=${id}&note=${note}`).then(res => {
                    if (res.data > 0) {
                        handleSearch('');
                        setViewOrderDetailId(0);
                    }
                }).catch(err => {
                    toast.error(toastMessage.getError);
                })
            }
        }
        setCancelOrderState({ ...state })

    }
    const handleCancelOrderDetails = (orderId, data) => {
        if (data?.isCancelled) {
            toast.warn(toastMessage.alreadyCancelled);
            return;
        }
        var ele = document.getElementById('cancelOrderOpener');
        ele.click()
        let state = {
            orderId,
            handler: (id, note) => {
                Api.Get(apiUrls.orderController.cancelOrderDetail + `?orderDetailId=${id}&note=${note}`).then(res => {
                    if (res.data > 0) {
                        handleSearch('');
                        setViewOrderDetailId(0);
                        setViewOrderDetailId(viewOrderDetailId);
                    }
                }).catch(err => {
                    toast.error(toastMessage.getError);
                })
            }
        }
        setCancelOrderState({ ...state })

    }
    const handleDeleteOrder = (orderId, data) => {
        if (data?.isDeleted) {
            toast.warn(toastMessage.alreadyDeleted);
            return;
        }
        var ele = document.getElementById('deleteOrderOpener');
        ele.click()
        let state = {
            orderId,
            handler: (id, note) => {
                Api.Delete(apiUrls.orderController.delete + `${id}?note=${note}`).then(res => {
                    if (res.data > 0) {
                        handleSearch('');
                        setViewOrderDetailId(0);
                        common.closePopup('deleteOrderConfirmModel');
                    }
                }).catch(err => {
                    toast.error(toastMessage.getError);
                })
            }
        }
        setDeleteOrderState({ ...state })

    }
    const handleView = (orderId) => {

        setViewOrderDetailId(orderId);
    }

    const resetOrderDetailsTable = () => {
        tableOptionOrderDetailsTemplet.data = [];
        tableOptionOrderDetailsTemplet.totalRecords = 0;
        setTableOptionOrderDetails({ ...tableOptionOrderDetailsTemplet });
    }

    const printOrderReceiptHandlerMain = (id, data) => {
        setOrderDataToPrint({...data});
    }

    const kandooraStatusHandler = (id, data) => {
        setViewOrderId(data);
    }
    const orderDeliveryHandler = (id, data) => {
        setSelectedOrderForDelivery(data);
    }
    const kandooraPhotoHandler = (id, data) => {
        setKandooraDetailId(data);
    }
    const updateMeasurementHandler = (id, data) => {
        var selectedOrder = tableOption.data.find(order => order.id === id);
        setKandooraDetailId(selectedOrder);
    }
    const tableOptionTemplet = {
        headers: headerFormat.order,
        showTableTop: true,
        showFooter: false,
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
            showPrint: true,
            popupModelId: "add-customer-order",
            delete: {
                handler: handleDeleteOrder,
                showModel: false,
                title: "Delete Order"
            },
            edit: {
                handler: handleCancelOrder,
                icon: "bi bi-x-circle",
                modelId: "",
                title: "Cancel Order"
            },
            view: {
                handler: handleView,
                title: "View Order Details"
            },
            print: {
                handler: printOrderReceiptHandlerMain,
                title: "Print Order Receipt",
                modelId:'printOrderReceiptPopupModal'
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
                    modelId: "kandoora-delivery-popup-model",
                    icon: "bi bi-cash-coin",
                    title: 'Order Delivery',
                    handler: orderDeliveryHandler,
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
            popupModelId: "",
            delete: {
                handler: handleDelete
            },
            edit: {
                handler: handleCancelOrderDetails,
                icon: "bi bi-x-circle",
                title: "Cancel Kandoora"
            },
            buttons: [
                {
                    modelId: "kandoora-photo-popup-model",
                    icon: "bi bi-camera",
                    title: 'Update Kandoora Picture',
                    handler: kandooraPhotoHandler,
                    showModel: true
                }
            ]
        }
    }

    const [tableOption, setTableOption] = useState(tableOptionTemplet);
    const [tableOptionOrderDetails, setTableOptionOrderDetails] = useState(tableOptionOrderDetailsTemplet);
    const saveButtonHandler = () => {
        resetOrderDetailsTable();
    }
    const breadcrumbOption = {
        title: 'Customers',
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
        ],
        buttons: [
            {
                text: "Find Orders",
                icon: 'bx bx-search',
                modelId: 'find-customer-order',
                handler: saveButtonHandler
            },
            {
                text: "Add Order",
                icon: 'bi bi-cart-plus',
                modelId: 'add-customer-order',
                handler: saveButtonHandler
            },
            {
                text: "Update Date",
                icon: 'bi bi-cart-check',
                modelId: 'update-order-date-model',
                handler: () => { }
            }
        ]
    }
    //Initial data loading 
    useEffect(() => {
        Api.Get(apiUrls.orderController.getAll + `?pageNo=${pageNo}&pageSize=${pageSize}`)
            .then(res => {
                var orders = res.data.data
                orders.forEach(element => {
                    var vatObj = common.calculateVAT(element.subTotalAmount, vat);
                    element.vatAmount = vatObj.vatAmount
                    element.subTotalAmount = parseFloat(element.totalAmount - vatObj.vatAmount);
                    element.balanceAmount = parseFloat(element.balanceAmount);
                    element.totalAmount = parseFloat(element.totalAmount);
                    element.advanceAmount = parseFloat(element.advanceAmount);
                    element.qty = element.orderDetails.filter(x => !x.isCancelled).length;
                    element.vat = vat;
                });
                tableOptionTemplet.data = orders;
                tableOptionTemplet.totalRecords = res.data.totalRecords;
                setTableOption({ ...tableOptionTemplet });
                resetOrderDetailsTable();
            }).catch(err => {
            })
    }, [pageNo, pageSize]);

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
                // if (element.isCancelled === true) {
                //     element.status = "Cancelled"
                // } else {
                //     element.status = "Active"
                // }
            });
            tableOptionOrderDetailsTemplet.data = orders.orderDetails;
            tableOptionOrderDetailsTemplet.totalRecords = orders.orderDetails.length;
            setTableOptionOrderDetails(tableOptionOrderDetailsTemplet);
        }
    }, [viewOrderDetailId])

    const searchWithFilterTextChange = (e) => {
        let { name, value } = e.target;
        setSearchWithFilter({ ...searchWithFilter, [name]: value });
    }

    const tableOptionSearchFilterTemplet = {
        headers: headerFormat.searchFilterOrder,
        showTableTop: true,
        showFooter: false,
        data: [],
        totalRecords: 0,
        showAction: false,
        showTableTop: false
    }
    const [tableOptionSearchFilter, setTableOptionSearchFilter] = useState(tableOptionSearchFilterTemplet);
    const searchFilterButtonHandler = () => {
        Api.Get(apiUrls.orderController.searchWithFilterOrders + `?fromDate=${searchWithFilter.fromDate}&toDate=${searchWithFilter.toDate}&searchTerm=${searchWithFilter.searchTerm.replace('+',"")}`)
            .then(res => {
                tableOptionSearchFilterTemplet.data = res.data.data;
                tableOptionSearchFilterTemplet.data.forEach(ele => {
                    ele.vatAmount = common.calculateVAT(ele.subTotalAmount, vat).vatAmount;
                })
                tableOptionSearchFilterTemplet.totalRecords = res.data.totalRecords;
                setTableOptionSearchFilter(tableOptionSearchFilterTemplet);
            })
    }
    return (
        <>
            <Breadcrumb option={breadcrumbOption}></Breadcrumb>
            <h6 className="mb-0 text-uppercase">Customer Orders</h6>
            <hr />
            <TableView option={tableOption}></TableView>
           
            {
                tableOptionOrderDetails.data.length > 0 &&
                <TableView option={tableOptionOrderDetails}></TableView>
            }
            <div id="add-customer-order" className="modal fade" data-bs-backdrop="static" data-bs-keyboard="false" tabIndex="-1" role="dialog" aria-labelledby="myModalLabel"
                aria-hidden="true">
                <div className="modal-dialog modal-xl">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h5 className="modal-title">Customer Order Details</h5>
                            <button type="button" className="btn-close" id='closePopupCustomerOrderCreate' data-bs-dismiss="modal" aria-hidden="true"></button>
                            <h4 className="modal-title" id="myModalLabel"></h4>
                        </div>
                        <CustomerOrderForm userData={userData} orderSearch={handleSearch} setViewSampleImagePath={setViewSampleImagePath}></CustomerOrderForm>
                    </div>
                </div>
            </div>
            <TableImageViewer modelId="table-image-viewer-sample-design" imagePath={viewSampleImagePath} previousModelId="add-customer-order"></TableImageViewer>
            <div id='cancelOrderOpener' data-bs-toggle="modal" data-bs-dismiss="modal" data-bs-target="#cancelOrderConfirmModel" style={{ display: 'none' }} />
            <div id='deleteOrderOpener' data-bs-toggle="modal" data-bs-dismiss="modal" data-bs-target="#deleteOrderConfirmModel" style={{ display: 'none' }} />

            <InputModelBox
                modelId="cancelOrderConfirmModel"
                title="Cancel Order Confirmation"
                message="Are you sure want to cancel the order!"
                dataId={cancelOrderState.orderId}
                labelText="Cancel Reason"
                handler={cancelOrderState.handler}
                buttonText="Cancel Order"
                cancelButtonText="Close"
                isInputRequired={true}
            ></InputModelBox>
            <InputModelBox
                modelId="deleteOrderConfirmModel"
                title="Cancel Order Confirmation"
                message="Are you sure want to delete the order!"
                dataId={deleteOrderState.orderId}
                labelText="Delete Reason"
                handler={deleteOrderState.handler}
                buttonText="Delete Order"
                cancelButtonText="Close"
                isInputRequired={true}
            ></InputModelBox>
            <KandooraStatusPopup orderData={viewOrderId} />
            <KandooraPicturePopup orderDetail={kandooraDetailId} />
            {
                Object.keys(kandooraDetailId).length > 0 && <MeasurementUpdatePopop orderData={kandooraDetailId} searchHandler={handleSearch} />
            }

            <OrderDeliveryPopup order={selectedOrderForDelivery} searchHandler={handleSearch} />
            <UpdateOrderDate></UpdateOrderDate>

            <div id="find-customer-order" className="modal fade" data-bs-backdrop="static" data-bs-keyboard="false" tabIndex="-1" role="dialog" aria-labelledby="myModalLabel"
                aria-hidden="true">
                <div className="modal-dialog modal-xl">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h5 className="modal-title">Search Orders</h5>
                            <button type="button" className="btn-close" id='closePopupCustomerOrderCreate' data-bs-dismiss="modal" aria-hidden="true"></button>
                            <h4 className="modal-title" id="myModalLabel"></h4>
                        </div>
                        <div className='model-body m-2'>
                            <div className='card mb-0'>
                                <div className='card-body py-1'>
                                    <div className='row'>
                                        <div className='col-11'>
                                            <input type="text" className="form-control form-control-sm" placeholder='Search by contact,order no., name, status etc.' onChange={e => searchWithFilterTextChange(e)} name="searchTerm" value={searchWithFilter.searchTerm} />
                                            <span style={{ fontSize: '9px' }} className="text-danger">Do not include + sign while search from contact number</span>
                                        </div>
                                        {/* <div className='col-2'>
                                            <input type="date" className="form-control form-control-sm" name='fromDate' max={searchWithFilter.toDate} value={searchWithFilter.fromDate} onChange={e => searchWithFilterTextChange(e)} />
                                        </div>
                                        <div className='col-2'>
                                            <input type="date" className="form-control form-control-sm" min={searchWithFilter.fromDate} value={searchWithFilter.toDate} onChange={e => searchWithFilterTextChange(e)} name="toDate" />
                                        </div> */}
                                        <div className='col-1 text-end'>
                                            <button type="submit" className="btn btn-sm btn-success mb-2" onClick={e => searchFilterButtonHandler()}><i className='bi bi-search'></i> Go</button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className='card py-1'>

                                <div className='card-body py-1'>
                                    <div className='row'>
                                        <div className='col-12 text-end' style={{ fontSize: '11px' }}>
                                            <i className={common.orderStatusIcon.processing}> Processing </i>
                                            <i className={common.orderStatusIcon.completed}> Completed </i>
                                            <i className={common.orderStatusIcon.partiallyDelivered}> Partial Delivered </i>
                                            <i className={common.orderStatusIcon.delivered}> Delivered </i> 
                                        </div>
                                        <div className='col-12 py-1'>
                                            <TableView option={tableOptionSearchFilter}></TableView>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <PrintOrderReceiptPopup orderId={orderDataToPrint?.id}/>
        </>
    )
}
