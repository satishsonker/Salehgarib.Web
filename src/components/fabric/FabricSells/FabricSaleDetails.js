import React, { useState, useEffect, useRef } from 'react'
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
import FabricSaleForm from './FabricSaleForm';
import { useReactToPrint } from 'react-to-print';
import PrintFabricSaleInvoice from '../Print/PrintFabricSaleInvoice';

export default function FabricSaleDetails({ userData, accessLogin }) {
    const [pageNo, setPageNo] = useState(1);
    const [pageSize, setPageSize] = useState(20);
    const [fetchData, setFetchData] = useState(0);
    const [invoiceDataToPrint, setInvoiceDataToPrint] = useState({});
    const [filter, setFilter] = useState({
        fromDate: common.getHtmlDate(common.addYearInCurrDate(-3)),
        toDate: common.getHtmlDate(new Date())
    });
    const [isFormOpen, setIsFormOpen] = useState(false);

    const printRef = useRef();
    const printBillingReportHandler = useReactToPrint({
        content: () => printRef.current
    })

    // Function to open the SaleForm modal
    const openForm = () => {
        setIsFormOpen(!isFormOpen);
    };

    // Function to close the SaleForm modal
    const closeForm = () => {
        setIsFormOpen(false);
    };

    const hasAdminLogin = () => {
        return accessLogin?.roleName?.toLowerCase() === "superadmin" || accessLogin?.roleName?.toLowerCase() === "admin";
    }
    const filterDataChangeHandler = (e) => {
        var { name, value } = e.target;
        setFilter({ ...filter, [name]: value });
    }
    const resetInvoiceDetailsTable = () => {
        tableOptionInvoiceDetailsTemplet.data = [];
        tableOptionInvoiceDetailsTemplet.totalRecords = 0;
        setTableOptionInvoiceDetails({ ...tableOptionInvoiceDetailsTemplet });
    }
    const handleCancelInvoice = (orderId, data) => {
        if (data?.isCancelled) {
            toast.warn(toastMessage.alreadyCancelled);
            return;
        }
        var ele = document.getElementById('cancelInvoiceOpener');
        ele.click();
        var note = "";
        if (data?.advanceAmount > 0) {
            note = `Customer has paid ${common.printDecimal(data?.advanceAmount)} advance amount. System will not adjust this amount. So please make sure you have return the same amount to the customer.`
        }
        let state = {
            orderId,
            handler: (id, note) => {
                Api.Get(apiUrls.orderController.cancelInvoice + `?orderId=${id}&note=${note}`).then(res => {
                    if (res.data > 0) {
                        handleSearch('');
                        toast.success("Invoice cancelled successfully!");
                    }
                }).catch(err => {
                    toast.error(toastMessage.getError);
                })
            },
            note: note
        }
        // setCancelInvoiceState({ ...state })

    }
    const handleCancelInvoiceDetails = (orderId, data) => {
        if (data?.isCancelled) {
            toast.warn(toastMessage.alreadyCancelled);
            return;
        }
        var ele = document.getElementById('cancelInvoiceOpener');
        ele.click()
        let state = {
            orderId,
            handler: (id, note) => {
                Api.Get(apiUrls.orderController.cancelInvoiceDetail + `?orderDetailId=${id}&note=${note}`).then(res => {
                    if (res.data > 0) {
                        handleSearch('');
                        toast.success("Kandoora cancelled successfully!");
                    }
                }).catch(err => {
                    toast.error(toastMessage.getError);
                })
            }
        }
        //  setCancelInvoiceState({ ...state })

    }
    const handleDeleteInvoice = (orderId, data) => {
        if (data?.isDeleted) {
            toast.warn(toastMessage.alreadyDeleted);
            return;
        }
        var ele = document.getElementById('deleteInvoiceOpener');
        ele.click()
        let state = {
            orderId,
            handler: (id, note) => {
                Api.Delete(apiUrls.orderController.delete + `${id}?note=${note}`).then(res => {
                    if (res.data > 0) {
                        handleSearch('');
                        common.closePopup('deleteInvoiceConfirmModel');
                    }
                }).catch(err => {
                    toast.error(toastMessage.getError);
                })
            }
        }
        //  setDeleteInvoiceState({ ...state })

    }
    const handleView = (id, data) => {
        debugger;
        var newData=[];
        data?.fabricSaleDetails?.forEach((ele,ind)=>{
            newData[ind]={...ele,...ele?.fabric};
            newData[ind].fabricBrand=ele?.fabric?.brandName;
            newData[ind].fabricSize=ele?.fabric?.fabricSizeName;
            newData[ind].fabricType=ele?.fabric?.fabricTypeName;
        })
        tableOptionInvoiceDetailsTemplet.data =newData;
        tableOptionInvoiceDetailsTemplet.totalRecords =newData?.length;
        setTableOptionInvoiceDetails({ ...tableOptionInvoiceDetailsTemplet });
    }
    const printInvoiceReceiptHandlerMain = (id, data) => {
        setInvoiceDataToPrint({ ...data });
    }

    useEffect(() => {
        if (invoiceDataToPrint?.id === undefined || invoiceDataToPrint?.id <= 0)
            return;
        printBillingReportHandler();
    }, [invoiceDataToPrint?.id])

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
        if (!hasAdminLogin() && searchTerm?.trim()?.length === 0) {
            tableOptionTemplet.data = [];
            tableOptionTemplet.totalRecords = 0;
            setTableOption({ ...tableOptionTemplet });
            resetInvoiceDetailsTable();
            return;
        }
        if (searchTerm.length > 0 && searchTerm.length < 3)
            return;
        Api.Get(apiUrls.orderController.search + `?isAdmin=${hasAdminLogin()}&PageNo=${pageNo}&PageSize=${pageSize}&SearchTerm=${searchTerm.replace('+', '')}&fromDate=1988-01-01&toDate=${common.getHtmlDate(new Date())}`, {})
            .then(res => {
                setTableOption({ ...tableOptionTemplet });
                resetInvoiceDetailsTable();
            }).catch(err => {

            });
    }
    const tableOptionTemplet = {
        headers: headerFormat.fabricSaleDetails,
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
            if (data?.isCancelled)
                return "bg-danger text-white"
            else if(data?.balanceAmount>0)
                return "bg-warning "
            return "";
        },
        actions: {
            showView: true,
            showPrint: true,
            popupModelId: "add-customer-order",
            delete: {
                handler: handleDeleteInvoice,
                showModel: false,
                title: "Delete Invoice"
            },
            edit: {
                handler: handleCancelInvoice,
                icon: "bi bi-x-circle",
                modelId: "",
                title: "Cancel Invoice"
            },
            view: {
                handler: handleView,
                title: "View Sale Details"
            },
            print: {
                handler: printInvoiceReceiptHandlerMain,
                title: "Print Invoice Receipt",
                showModel: false
            }
        }
    }
    const tableOptionInvoiceDetailsTemplet = {
        headers: headerFormat.fabricSaleAddTableFormat,
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
            debugger;
            if (data?.isCancelled)
                return "bg-danger text-white"
            else if(data?.balanceAmount>0)
                return "bg-warn"
            return "";
        },
        actions: {
            showView: false,
            showDelete: false,
            popupModelId: "",
            delete: {
                handler: handleDelete
            },
            edit: {
                handler: handleCancelInvoiceDetails,
                icon: "bi bi-x-circle",
                title: "Cancel fabric"
            }
        }
    }

    const [tableOption, setTableOption] = useState(tableOptionTemplet);
    const [tableOptionInvoiceDetails, setTableOptionInvoiceDetails] = useState(tableOptionInvoiceDetailsTemplet);

    useEffect(() => {
        Api.Get(apiUrls.fabricSaleController.getAll + `?pageNo=${pageNo}&pageSize=${pageSize}&fromDate=${filter.fromDate}&toDate=${filter.toDate}`)
            .then(res => {
                tableOptionTemplet.data = res?.data?.data;
                tableOptionTemplet.totalRecords = res?.data?.totalRecords;
                setTableOption({ ...tableOptionTemplet });
            });
    }, [pageNo, pageSize, fetchData])

    const breadcrumbOption = {
        title: 'Fabric Sell',
        items: [
            {
                isActive: false,
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
            //     text: "Find Invoices",
            //     icon: 'bx bx-search',
            //     modelId: 'find-customer-order',
            //     handler: saveButtonHandler
            // },
            {
                text: "Add Fabric Sell",
                icon: 'bi bi-cart-plus',
                modelId: 'add-fabric-sell',
                handler: openForm
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
                tableOptionInvoiceDetails.data?.length > 0 &&
                <TableView option={tableOptionInvoiceDetails}></TableView>
            }
            <FabricSaleForm isOpen={isFormOpen} onClose={closeForm}></FabricSaleForm>
            <div className='d-none'>
                <PrintFabricSaleInvoice mainData={invoiceDataToPrint} printRef={printRef} />
            </div>
        </>
    )
}
