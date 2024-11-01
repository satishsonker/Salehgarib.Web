import React, { useState, useEffect, useRef, Suspense } from 'react'
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
import { useReactToPrint } from 'react-to-print';
import PrintFabricSaleInvoice from '../Print/PrintFabricSaleInvoice';
import InputModelBox from '../../common/InputModelBox';
import Label from '../../common/Label';
import BalancePaymentPopup from './BalancePaymentPopup';
import PrintFabricSellDetailReport from '../Print/PrintFabricSellDetailReport';

export default function FabricSaleDetails({ userData, accessLogin }) {
    const FabricSaleForm = React.lazy(() => import('./FabricSaleForm'));
    const [pageNo, setPageNo] = useState(1);
    const [cancelDeleteInvoiceState, setCancelDeleteInvoiceState] = useState({})
    const [pageSize, setPageSize] = useState(20);
    const [fetchData, setFetchData] = useState(0);
    const [invoiceDataToPrint, setInvoiceDataToPrint] = useState({});
    const [invoiceDataForViewStatement, setInvoiceDataForViewStatement] = useState({});
    const [filter, setFilter] = useState({
        fromDate: common.getHtmlDate(common.addMonthInCurrDate(-1)),
        toDate: common.getHtmlDate(new Date())
    });
    const [isFormOpen, setIsFormOpen] = useState(false);

    const printRef = useRef();
    const printSellDetailRef = useRef();
    const printInvoiceHandler = useReactToPrint({
        content: () => printRef.current
    })

    const printSellDetailHandler = useReactToPrint({
        content: () => printSellDetailRef.current,
        pageStyle: `
        @page {
            size: landscape; /* Change to portrait if needed */
            margin: 6mm; /* Adjust margins as needed */
        }
             body {
                font-family: Arial, sans-serif;
                font-size:12px
            }
    `,
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
    const handleCancelInvoice = (invoiceId, data) => {
        if (data?.isCancelled) {
            toast.warn(toastMessage.alreadyCancelled);
            return;
        }
        var ele = document.getElementById('cancelInvoiceOpener');
        ele.click();
        var note = "";
        if (data?.advanceAmount > 0) {
            note = `Customer has paid ${common.printDecimal(data?.advanceAmount + data?.paidAmount)} advance/paid amount. System will not adjust this amount. So please make sure you have return the same amount to the customer.`
        }
        let state = {
            invoiceId,
            handler: (id, note) => {
                debugger;
                var url = encodeURI(apiUrls.fabricSaleController.cancelOrDeleteSale + `${data?.invoiceNo}/true?note=${note}`);
                Api.Post(url, {}).then(res => {
                    if (res.data === true) {
                        handleSearch('');
                        toast.success("Invoice cancelled successfully!");
                    }
                })
            },
            note: note
        }
        setCancelDeleteInvoiceState({ ...state })

    }
    const handleCancelInvoiceDetails = (invoiceId, data) => {
        if (data?.isCancelled) {
            toast.warn(toastMessage.alreadyCancelled);
            return;
        }
        var ele = document.getElementById('cancelInvoiceDetailOpener');
        ele.click();
        var note = "";
        let state = {
            invoiceId,
            handler: (id, note) => {
                var url = encodeURI(apiUrls.fabricSaleController.cancelOrDeleteSaleDetail + `${data?.id}/true?note=${note}`);
                Api.Post(url, {}).then(res => {
                    if (res.data === true) {
                        handleSearch('');
                        toast.success("Invoice item cancelled successfully!");
                    }
                })
            },
            note: note
        }
        setCancelDeleteInvoiceState({ ...state })

    }


    const handleDeleteInvoice = (invoiceId, data) => {
        if (data?.isDeleted) {
            toast.warn(toastMessage.alreadyDeleted);
            return;
        }
        var ele = document.getElementById('deleteInoviceOpener');
        ele.click()
        let state = {
            invoiceId,
            handler: (id, note) => {
                var url = encodeURI(apiUrls.fabricSaleController.cancelOrDeleteSale + `${data?.invoiceNo}/false?note=${note}`);
                Api.Post(url, {}).then(res => {
                    if (res.data === true) {
                        handleSearch('');
                        common.closePopup('deleteInvoiceConfirmModel');
                    }
                }).catch(err => {
                    toast.error(toastMessage.getError);
                })
            }
        }
        setCancelDeleteInvoiceState({ ...state })

    }
    const handleView = (id, data) => {
        var newData = [];
        data?.fabricSaleDetails?.forEach((ele, ind) => {
            var saleDetailId = ele?.id;
            newData[ind] = { ...ele, ...ele?.fabric };
            newData[ind].id = saleDetailId;
            newData[ind].fabricBrand = ele?.fabric?.brandName;
            newData[ind].fabricSize = ele?.fabric?.fabricSizeName;
            newData[ind].fabricType = ele?.fabric?.fabricTypeName;
        })
        tableOptionInvoiceDetailsTemplet.data = newData;
        tableOptionInvoiceDetailsTemplet.invoiceNo = data?.invoiceNo;
        tableOptionInvoiceDetailsTemplet.totalRecords = newData?.length;
        setTableOptionInvoiceDetails({ ...tableOptionInvoiceDetailsTemplet });
    }
    const printInvoiceReceiptHandlerMain = (id, data) => {
        setInvoiceDataToPrint({ ...data });
    }

    useEffect(() => {
        if (invoiceDataToPrint?.id === undefined || invoiceDataToPrint?.id <= 0)
            return;
        printInvoiceHandler();
    }, [invoiceDataToPrint?.id])

    const handleDelete = (id) => {
        Api.Delete(apiUrls.invoiceController.delete + id).then(res => {
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
        Api.Get(apiUrls.fabricSaleController.searchSale + `?isAdmin=${hasAdminLogin()}&PageNo=${pageNo}&PageSize=${pageSize}&SearchTerm=${searchTerm.replace('+', '')}&fromDate=1988-01-01&toDate=${common.getHtmlDate(new Date())}`, {})
            .then(res => {
                tableOptionTemplet.data = res.data?.data;
                tableOptionTemplet.totalRecords = res.data?.totalRecords;
                setTableOption({ ...tableOptionTemplet });
                resetInvoiceDetailsTable();
            })
    }

    const viewStatementHandler = (id, data) => {
        setInvoiceDataForViewStatement({ ...data });
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
            else if (data?.balanceAmount > 0)
                return "bg-warning "
            return "";
        },
        actions: {
            showView: true,
            showPrint: true,
            popupModelId: "add-customer-invoice",
            delete: {
                handler: handleDeleteInvoice,
                showModel: false,
                modelId: "",
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
            },
            buttons: [
                {
                    modelId: "balancePaymentPopupModel",
                    icon: (id, data) => { return data?.balanceAmount > 0 ? "bi bi-cash-coin text-danger" : "bi bi-cash-coin text-success" },
                    title: (id, data) => { return data?.balanceAmount > 0 ? "This Invoice have some balance payment" : "Invoice Statement" },
                    handler: viewStatementHandler,
                    showModel: true
                }
            ]
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
            if (data?.isCancelled)
                return "bg-danger text-white"
            return "";
        },
        actions: {
            showView: false,
            showDelete: false,
            showEdit: (data, datalength) => {
                debugger;
                return (datalength ?? 0) > 1
            },
            popupModelId: "",
            delete: {
                handler: handleDelete,
                showModel: true
            },
            edit: {
                handler: handleCancelInvoiceDetails,
                icon: "bi bi-x-circle",
                title: "Cancel fabric item"
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
            //     modelId: 'find-customer-invoice',
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
            //     modelId: 'update-invoice-date-model',
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
                {hasAdminLogin() && <div className="d-flex justify-content-end">
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
                    <div className='mx-2 my-3 py-1'>
                        <ButtonBox type="Print" disabled={tableOption?.data?.length === 0} onClickHandler={printSellDetailHandler} className="btn-sm"></ButtonBox>
                    </div>
                </div>
                }
            </div>
            <hr style={{ margin: "0 0 16px 0" }} />
            <TableView option={tableOption}></TableView>
            {
                tableOptionInvoiceDetails.data?.length > 0 && <>
                    <Label text={`Invoice No. : ${tableOptionInvoiceDetails?.invoiceNo ?? '0000'}`} bold={true} fontSize='15px' />
                    <TableView option={tableOptionInvoiceDetails}></TableView>
                </>
            }
            {isFormOpen && <Suspense fallback={<div>Loading...</div>}>
                <FabricSaleForm isOpen={isFormOpen} onClose={closeForm} refreshParentGrid={setFetchData} />
            </Suspense>}
            {/* <FabricSaleForm isOpen={isFormOpen} onClose={closeForm} refreshParentGrid={setFetchData}></FabricSaleForm> */}
            <div className='d-none'>
                {invoiceDataToPrint !== undefined && invoiceDataToPrint !== null && <PrintFabricSaleInvoice mainData={invoiceDataToPrint} printRef={printRef} />}
            </div>
            <div id='cancelInvoiceOpener' data-bs-toggle="modal" data-bs-dismiss="modal" data-bs-target="#cancelInoviceConfirmModel" style={{ display: 'none' }} />
            <div id='deleteInoviceOpener' data-bs-toggle="modal" data-bs-dismiss="modal" data-bs-target="#deleteInvoiceConfirmModel" style={{ display: 'none' }} />
            <div id='cancelInvoiceDetailOpener' data-bs-toggle="modal" data-bs-dismiss="modal" data-bs-target="#cancelInoviceDetailConfirmModel" style={{ display: 'none' }} />
            <InputModelBox
                modelId="cancelInoviceConfirmModel"
                title="Cancel Inovice Confirmation"
                message="Are you sure want to cancel the invoice!"
                dataId={cancelDeleteInvoiceState.id}
                labelText="Cancel Reason"
                handler={cancelDeleteInvoiceState.handler}
                buttonText="Cancel Inovice"
                cancelButtonText="Close"
                note={cancelDeleteInvoiceState.note}
                isInputRequired={true}
            ></InputModelBox>
            <InputModelBox
                modelId="deleteInvoiceConfirmModel"
                title="Delete Inovice Confirmation"
                message="Are you sure want to delete the invoice!"
                dataId={cancelDeleteInvoiceState.id}
                labelText="Delete Reason"
                handler={cancelDeleteInvoiceState.handler}
                buttonText="Delete Inovice"
                cancelButtonText="Close"
                note={cancelDeleteInvoiceState.note}
                isInputRequired={true}
            ></InputModelBox>
            <InputModelBox
                modelId="cancelInoviceDetailConfirmModel"
                title="Cancel Inovice Item Confirmation"
                message="Are you sure want to cancel the invoice item!"
                dataId={cancelDeleteInvoiceState.id}
                labelText="Cancel Reason"
                handler={cancelDeleteInvoiceState.handler}
                buttonText="Cancel Inovice Item"
                cancelButtonText="Close"
                note={cancelDeleteInvoiceState.note}
                isInputRequired={true}
            ></InputModelBox>
            <BalancePaymentPopup invoiceData={invoiceDataForViewStatement} />
            {tableOption.data.length > 0 &&
                <PrintFabricSellDetailReport filter={filter} printRef={printSellDetailRef} data={tableOption.data} />
            }
        </>
    )
}
