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
import InputModelBox from '../../common/InputModelBox';
import Label from '../../common/Label';
import BalancePaymentPopup from './BalancePaymentPopup';
export default function FabricCancelSaleDetail({ userData, accessLogin }) {
    const [pageNo, setPageNo] = useState(1);
    const [cancelDeleteInvoiceState, setCancelDeleteInvoiceState] = useState({})
    const [pageSize, setPageSize] = useState(20);
    const [fetchData, setFetchData] = useState(0);
    const [invoiceDataToPrint, setInvoiceDataToPrint] = useState({});
    const [invoiceDataForViewStatement, setInvoiceDataForViewStatement] = useState({});
    const [filter, setFilter] = useState({
        fromDate: common.getHtmlDate(common.addYearInCurrDate(-3)),
        toDate: common.getHtmlDate(new Date())
    });

    const printRef = useRef();
    const printBillingReportHandler = useReactToPrint({
        content: () => printRef.current
    })

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

    const handleView = (id, data) => {
        var newData = [];
        data?.fabricSaleDetails?.forEach((ele, ind) => {
            var saleDetailId=ele?.id;
            newData[ind] = { ...ele, ...ele?.fabric };
            newData[ind].id = saleDetailId;
            newData[ind].fabricBrand = ele?.fabric?.brandName;
            newData[ind].fabricSize = ele?.fabric?.fabricSizeName;
            newData[ind].fabricType = ele?.fabric?.fabricTypeName;
        })
        tableOptionInvoiceDetailsTemplet.data = newData;
        tableOptionInvoiceDetailsTemplet.invoiceNo=data?.invoiceNo;
        tableOptionInvoiceDetailsTemplet.totalRecords = newData?.length;
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
        Api.Get(apiUrls.fabricSaleController.searchCancelOrDelete + `?isAdmin=${hasAdminLogin()}&PageNo=${pageNo}&PageSize=${pageSize}&SearchTerm=${searchTerm.replace('+', '')}&fromDate=1988-01-01&toDate=${common.getHtmlDate(new Date())}`, {})
            .then(res => {
                tableOptionTemplet.data = res.data?.data;
                tableOptionTemplet.totalRecords = res.data?.totalRecords;
                setTableOption({ ...tableOptionTemplet });
                resetInvoiceDetailsTable();
            })
    }

    const tableOptionTemplet = {
        headers: headerFormat.fabricCancelDeletedSaleDetails,
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
            if (!data?.isCancelled && data?.cancelledAmount>0)
                return "bg-warning text-white"
            return "";
        },
        actions: {
            showView: true,
            showPrint: true,
            showEdit:false,
            showDelete:false,
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
            if (data?.isCancelled)
                return "bg-danger text-white"
            return "";
        },
        showAction:false
    }

    const [tableOption, setTableOption] = useState(tableOptionTemplet);
    const [tableOptionInvoiceDetails, setTableOptionInvoiceDetails] = useState(tableOptionInvoiceDetailsTemplet);

    useEffect(() => {
        Api.Get(apiUrls.fabricSaleController.getAllCancelOrDelete + `?pageNo=${pageNo}&pageSize=${pageSize}&fromDate=${filter.fromDate}&toDate=${filter.toDate}`)
            .then(res => {
                tableOptionTemplet.data = res?.data?.data;
                tableOptionTemplet.totalRecords = res?.data?.totalRecords;
                setTableOption({ ...tableOptionTemplet });
            });
    }, [pageNo, pageSize, fetchData])

    const breadcrumbOption = {
        title: 'Cancel/Deleted Fabric Sales',
        items: [
            {
                isActive: false,
                title: "Fabric",
                icon: "bi bi-view-list"
            },
            {
                isActive: false,
                title: "Fabric Sales",
                icon: "bi bi-cart4"
            }
        ]
    }
    return (
        <>
            <Breadcrumb option={breadcrumbOption}></Breadcrumb>
            <div className="d-flex justify-content-between">
                <div>
                    <h6 className="mb-0 text-uppercase">Cancel/Deleted Fabric Sales</h6>
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
                tableOptionInvoiceDetails.data?.length > 0 &&<>
                <Label text={`Invoice No. : ${tableOptionInvoiceDetails?.invoiceNo??'0000'}`} bold={true} fontSize='15px' />
                <TableView option={tableOptionInvoiceDetails}></TableView>
                </>
            }
            <div className='d-none'>
                <PrintFabricSaleInvoice mainData={invoiceDataToPrint} printRef={printRef} />
            </div>
            <div id='cancelInvoiceOpener' data-bs-toggle="modal" data-bs-dismiss="modal" data-bs-target="#cancelInoviceConfirmModel" style={{ display: 'none' }} />
            <div id='deleteInoviceOpener' data-bs-toggle="modal" data-bs-dismiss="modal" data-bs-target="#deleteInvoiceConfirmModel" style={{ display: 'none' }} />
            <div id='cancelInvoiceDetailOpener' data-bs-toggle="modal" data-bs-dismiss="modal" data-bs-target="#cancelInoviceDetailConfirmModel" style={{ display: 'none' }} />
        </>
    )
}
