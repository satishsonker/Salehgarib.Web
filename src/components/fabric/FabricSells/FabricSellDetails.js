import React,{useState,useEffect} from 'react'
import Breadcrumb from '../../common/Breadcrumb'
import { common } from '../../../utils/common';
import TableView from '../../tables/TableView';
import Inputbox from '../../common/Inputbox';
import ButtonBox from '../../common/ButtonBox';
import { headerFormat } from '../../../utils/tableHeaderFormat';
import { Api } from '../../../apis/Api';
import { apiUrls } from '../../../apis/ApiUrls';
import { toast } from 'react-toastify';
import { toastMessage } from '../../../constants/ConstantValues';

export default function FabricSellDetails({ userData, accessLogin }) {
    const [viewOrderDetailId, setViewOrderDetailId] = useState(0);    
    const [viewOrderId, setViewOrderId] = useState(0);
    const [pageNo, setPageNo] = useState(1);
    const [pageSize, setPageSize] = useState(20);
    const [fetchData, setFetchData] = useState(0);     
    const [orderDataToPrint, setOrderDataToPrint] = useState({});
    const [filter, setFilter] = useState({
        fromDate: common.getHtmlDate(common.addYearInCurrDate(-3)),
        toDate: common.getHtmlDate(new Date())
    });
    const hasAdminLogin = () => {
        return accessLogin?.roleName?.toLowerCase() === "superadmin" || accessLogin?.roleName?.toLowerCase() === "admin";
    }
    const filterDataChangeHandler = (e) => {
        var { name, value } = e.target;
        setFilter({ ...filter, [name]: value });
    }
    const resetOrderDetailsTable = () => {
        tableOptionOrderDetailsTemplet.data = [];
        tableOptionOrderDetailsTemplet.totalRecords = 0;
        setTableOptionOrderDetails({ ...tableOptionOrderDetailsTemplet });
    }
    const handleCancelOrder = (orderId, data) => {
        if (data?.isCancelled) {
            toast.warn(toastMessage.alreadyCancelled);
            return;
        }
        var ele = document.getElementById('cancelOrderOpener');
        ele.click();
        var note = "";
        if (data?.advanceAmount > 0) {
            note = `Customer has paid ${common.printDecimal(data?.advanceAmount)} advance amount. System will not adjust this amount. So please make sure you have return the same amount to the customer.`
        }
        let state = {
            orderId,
            handler: (id, note) => {
                Api.Get(apiUrls.orderController.cancelOrder + `?orderId=${id}&note=${note}`).then(res => {
                    if (res.data > 0) {
                        handleSearch('');
                        setViewOrderDetailId(0);
                        toast.success("Order cancelled successfully!");
                    }
                }).catch(err => {
                    toast.error(toastMessage.getError);
                })
            },
            note: note
        }
       // setCancelOrderState({ ...state })

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
                        toast.success("Kandoora cancelled successfully!");
                    }
                }).catch(err => {
                    toast.error(toastMessage.getError);
                })
            }
        }
      //  setCancelOrderState({ ...state })

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
      //  setDeleteOrderState({ ...state })

    }
    const handleView = (orderId) => {

        setViewOrderDetailId(orderId);
    }
    const printOrderReceiptHandlerMain = (id, data) => {
        setOrderDataToPrint({ ...data });
    }
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
        if (!hasAdminLogin() && searchTerm?.trim()?.length === 0){
            setViewOrderDetailId(0);
            tableOptionTemplet.data = [];
            tableOptionTemplet.totalRecords = 0;
            setTableOption({ ...tableOptionTemplet });
            resetOrderDetailsTable();
            return;
        }
        if (searchTerm.length > 0 && searchTerm.length < 3)
            return;
        Api.Get(apiUrls.orderController.search + `?isAdmin=${hasAdminLogin()}&PageNo=${pageNo}&PageSize=${pageSize}&SearchTerm=${searchTerm.replace('+', '')}&fromDate=1988-01-01&toDate=${common.getHtmlDate(new Date())}`, {})
        .then(res => {
            setViewOrderDetailId(0);
            // tableOptionTemplet.data = orders;
            // tableOptionTemplet.totalRecords = res.data.totalRecords;
            setTableOption({ ...tableOptionTemplet });
            resetOrderDetailsTable();
        }).catch(err => {

        });
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
                modelId: 'printOrderReceiptPopupModal'
            }
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
            }
        }
    }

    const [tableOption, setTableOption] = useState(tableOptionTemplet);
    const [tableOptionOrderDetails, setTableOptionOrderDetails] = useState(tableOptionOrderDetailsTemplet);
    
    const breadcrumbOption = {
        title: 'Fabric Sell',
        items: [
            {
                isActive:false,
                title: "Fabric",
                icon: "bi bi-view-list"
            },
            {
                isActive: false,
                title: "Fabric Sell",
                icon: "bi bi-cart4"
            }
        ],
        buttons: [
            // {
            //     text: "Find Orders",
            //     icon: 'bx bx-search',
            //     modelId: 'find-customer-order',
            //     handler: saveButtonHandler
            // },
            {
                text: "Add Fabric Sell",
                icon: 'bi bi-cart-plus',
                modelId: 'add-fabric-sell',
               // handler: saveButtonHandler
            },
            // {
            //     text: "Update Date",
            //     icon: 'bi bi-cart-check',
            //     modelId: 'update-order-date-model',
            //     handler: () => { }
            // }
        ]
    }
    return (
        <>
            <Breadcrumb option={breadcrumbOption}></Breadcrumb>
            <div className="d-flex justify-content-between">
                <div>
                    <h6 className="mb-0 text-uppercase">Fabric Sell</h6>
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
        </>
    )
}
