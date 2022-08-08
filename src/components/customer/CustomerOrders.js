import React, { useState, useEffect } from 'react'
import { toast } from 'react-toastify';
import { Api } from '../../apis/Api';
import { apiUrls } from '../../apis/ApiUrls';
import { toastMessage } from '../../constants/ConstantValues';
import Breadcrumb from '../common/Breadcrumb'
import InputModelBox from '../common/InputModelBox';
import DeleteConfirmation from '../tables/DeleteConfirmation';
import TableView from '../tables/TableView';
import CustomerOrderForm from './CustomerOrderForm';

export default function CustomerOrders({ userData }) {
    const customerOrderModelTemplate = {
        id: 0,
        firstname: "",
        customerId: 0,
        lastname: "",
        contact1: "",
        contact2: "",
        orderNo: 0,
        branch: "",
        accountId: "",
        customerName: "",
        salesmanId: 0,
        designSampleId: 0,
        measurementStatusId: 0,
        orderStatusId: 0,
        categoryId: 0,
        cityId: 0,
        poBox: "",
        preAmount: 0,
        deliveryDate: "",
        chest: 0,
        sleevesLoose: 0,
        deep: 0,
        backDown: 0,
        bottom: 0,
        length: 0,
        hipps: 0,
        sleeves: 0,
        shoulder: 0,
        neck: 0,
        extra: 0

    };
    const [customerOrderModel, setCustomerOrderModel] = useState(customerOrderModelTemplate);
    const [isRecordSaving, setIsRecordSaving] = useState(true);
    const [viewOrderDetailId, setViewOrderDetailId] = useState(0);
    const [pageNo, setPageNo] = useState(1);
    const [pageSize, setPageSize] = useState(10);
    const [cancelOrderState, setCancelOrderState] = useState({ orderId: 0, handler: () => { } })
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
        if (searchTerm.length > 0 && searchTerm.length < 3)
            return;
        Api.Post(apiUrls.orderController.search + `?PageNo=${pageNo}&PageSize=${pageSize}&SearchTerm=${searchTerm}`, {}).then(res => {
            tableOptionTemplet.data = res.data.data;
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
    const handleView = (orderId) => {

        setViewOrderDetailId(orderId);
    }
    
  const resetOrderDetailsTable=()=>{
    tableOptionOrderDetailsTemplet.data = [];
    tableOptionOrderDetailsTemplet.totalRecords = 0;
    setTableOptionOrderDetails({ ...tableOptionOrderDetailsTemplet });
}
    const tableOptionTemplet = {
        headers: [
            { name: "Order No", prop: "orderNo" },
            { name: "Customer Name", prop: "customerName" },
            { name: "Salesname", prop: "salesman" },
            { name: "Order Date", prop: "orderDate" },
            { name: "Order Delivery Date", prop: "orderDeliveryDate" },
            { name: "City", prop: "city" },
            { name: "VAT", prop: "vat", action: { decimal: true } },
            { name: "Sub Total", prop: "subTotalAmount", action: { decimal: true } },
            { name: "VAT Amount", prop: "vatAmount", action: { decimal: true } },
            { name: "Total Amount", prop: "totalAmount", action: { decimal: true } },
            { name: "Advance Amount", prop: "advanceAmount", action: { decimal: true } },
            { name: "Balance Amount", prop: "balanceAmount", action: { decimal: true } },
            { name: "Payment Mode", prop: "paymentMode" },
            { name: "Customer Ref Name", prop: "customerRefName" },
            {name:"Cancel Note",prop:"note"},
            { name: "Order Status", prop: "status" },
            { name: "Created By", prop: "createdBy" }
        ],
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
            if (data.orderDetails.filter(x => x.isCancelled).length === data.orderDetails.length)
                return "cancelOrder"
            else if (data.orderDetails.filter(x => x.isCancelled).length > 0)
                return "partcancelOrder"
            else
                return "";
        },
        actions: {
            showView: true,
            popupModelId: "add-customer-order",
            delete: {
                handler: handleDelete
            },
            edit: {
                handler: handleCancelOrder,
                icon: "bi bi-eraser-fill",
                modelId: ""
            },
            view: {
                handler: handleView
            }
        }
    }

    const tableOptionOrderDetailsTemplet = {
        headers: [
            { name: "Order No", prop: "orderNo" },
            { name: "Order Delivery Date", prop: "orderDeliveryDate" },
            { name: "Category", prop: "designCategory" },
            { name: "Model", prop: "designModel" },
            { name: "Chest", prop: "chest" },
            { name: "Sleeve Loose", prop: "sleeveLoose" },
            { name: "Deep", prop: "deep" },
            { name: "BackDown", prop: "backDown" },
            { name: "Bottom", prop: "bottom" },
            { name: "Length", prop: "length" },
            { name: "Hipps", prop: "hipps" },
            { name: "Sleeve", prop: "sleeve" },
            { name: "Shoulder", prop: "shoulder" },
            { name: "Neck", prop: "neck" },
            { name: "Extra", prop: "extra" },
            { name: "Description", prop: "description" },
            { name: "Work Type", prop: "workType" },
            { name: "Order Status", prop: "orderStatus" },
            { name: "Measurement Status", prop: "measurementStatus" },
            { name: "Crystal", prop: "crystal" },
            { name: "Crystal Price", prop: "crystalPrice" },
            { name: "Price", prop: "price" },
            { name: "Sub Total Amount", prop: "subTotalAmount" },
            { name: "VAT", prop: "vat" },
            { name: "VAT Amount", prop: "vatAmount" },
            { name: "Total Amount", prop: "totalAmount" },
            { name: "Status", prop: "status" },
            { name: "Cancelled by", prop: "updatedBy" },
            { name: "Cancelled On", prop: "updatedAt" },
            { name: "Cancel Note", prop: "note" },
        ],
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
                icon: "bi bi-eraser-fill"
            }
        }
    }

    const [tableOption, setTableOption] = useState(tableOptionTemplet);
    const [tableOptionOrderDetails, setTableOptionOrderDetails] = useState(tableOptionOrderDetailsTemplet);
    const saveButtonHandler = () => {
        setCustomerOrderModel({ ...customerOrderModelTemplate });
        resetOrderDetailsTable();
        setIsRecordSaving(true);
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
                text: "Customer Orders",
                icon: 'bx bx-plus',
                modelId: 'add-customer-order',
                handler: saveButtonHandler
            }
        ]
    }
    //Initial data loading 
    useEffect(() => {
        Api.Get(apiUrls.orderController.getAll + `?pageNo=${pageNo}&pageSize=${pageSize}`)
            .then(res => {
                var orders = res.data.data
                orders.forEach(element => {
                    element.vatAmount = ((element.totalAmount / (100 + element.vat)) * element.vat);
                    element.subTotalAmount = parseFloat(element.totalAmount - element.vatAmount);
                    element.balanceAmount = parseFloat(element.balanceAmount);
                    element.totalAmount = parseFloat(element.totalAmount);
                    element.advanceAmount = parseFloat(element.advanceAmount);
                    element.vat = parseFloat(element.vat);
                    if (element.orderDetails.filter(x => x.isCancelled).length === element.orderDetails.length)
                        element.status = "Cancelled"
                    else if (element.orderDetails.filter(x => x.isCancelled).length > 0)
                        element.status = "Partially Cancelled"
                    else
                        element.status = "Active"
                });
                tableOptionTemplet.data = orders;
                tableOptionTemplet.totalRecords = res.data.totalRecords;
                setTableOption({ ...tableOptionTemplet });
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
                if (element.isCancelled === true) {
                    element.status = "Cancelled"
                } else {
                    element.status = "Active"
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
                            <button type="button" className="btn-close" id='closePopup' data-bs-dismiss="modal" aria-hidden="true"></button>
                            <h4 className="modal-title" id="myModalLabel"></h4>
                        </div>
                        <CustomerOrderForm userData={userData} orderSearch={handleSearch}></CustomerOrderForm>
                    </div>
                </div>
            </div>
            <div id='cancelOrderOpener' data-bs-toggle="modal" data-bs-dismiss="modal" data-bs-target="#cancelOrderConfirmModel" style={{ display: 'none' }} />
            {/* <DeleteConfirmation
                modelId="cancelOrderConfirmModel"
                title="Cancel Order Confirmation"
                message="Are you sure want to cancel the order!"
                dataId={cancelOrderState.orderId}
                deleteHandler={cancelOrderState.handler}
                buttonText="Cancel Order"
                cancelButtonText="Close"
            /> */}
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
        </>
    )
}
