import { data, type } from 'jquery';
import React, { useState, useEffect } from 'react'
import { toast } from 'react-toastify';
import { Api } from '../../apis/Api';
import { apiUrls } from '../../apis/ApiUrls';
import { toastMessage } from '../../constants/ConstantValues';
import { validationMessage } from '../../constants/validationMessage';
import { common } from '../../utils/common';
import { headerFormat, remainingDaysBadge } from '../../utils/tableHeaderFormat';
import Breadcrumb from '../common/Breadcrumb';
import SearchableDropdown from '../common/SearchableDropdown/SearchableDropdown';
import Dropdown from '../common/Dropdown';
import ErrorLabel from '../common/ErrorLabel';
import Inputbox from '../common/Inputbox';
import Label from '../common/Label';
import TableView from '../tables/TableView';
import ButtonBox from '../common/ButtonBox';

export default function DeuRent() {
    const paymentModelTemplate = {
        paymentMode: '',
        chequeNo: '',
        id: 0,
        companyId: 0,
        paidOn:common.getHtmlDate(new Date()),
        isPaid: 2,
        fromDate: common.getHtmlDate(common.getFirstDateOfMonth()),
        toDate: common.getHtmlDate(common.getLastDateOfMonth())
    }
    const [paymentModel, setPaymentModel] = useState(paymentModelTemplate);
    const [companyShopList, setCompanyShopList] = useState([]);
    const [pageNo, setPageNo] = useState(1);
    const [pageSize, setPageSize] = useState(20);
    const [paymentMode, setPaymentMode] = useState([]);
    const [errors, setErrors] = useState({});
    const [transactionId, setTransactionId] = useState(0);
    const [rentDetailId, setRentDetailId] = useState(0);
    const payRentHandler = () => {
        const formError = validateError();
        if (Object.keys(formError).length > 0) {
            setErrors(formError);
            return
        }
        if (!paymentModel.id || paymentModel.id < 1) {
            toast.warn('Please select the installment again.');
            return;
        }
        Api.Post(apiUrls.rentController.payDeuRents, paymentModel)
            .then(res => {
                if (res.data > 0) {
                    toast.success(toastMessage.saveSuccess);
                    common.closePopup('rent-pay-model');

                }
                else
                    toast.success(toastMessage.saveError);
            });
    }
    const getRemainingDays = (data) => {
        let curr_Date = new Date();
        let installment_Date = new Date(data);
        var diff = installment_Date.getTime() - curr_Date.getTime();

        return diff / (1000 * 60 * 60 * 24);
    }

    const getCustomPayButton = (data) => {
        if (data?.isPaid)
            return <div className='text-success'>Rent Paid</div>
        var color = 'success';
        var daydiff = parseInt(getRemainingDays(data.installmentDate));
        if (daydiff >= 15)
            color = "success";
        else if (daydiff >= 0 && daydiff <= 5)
            color = "warning";
        else
            color = "danger";
        return <button data-bs-toggle='modal' data-bs-target='#rent-pay-model' onClick={e => { setTransactionId(data.id); setRentDetailId(data?.rentDetailId) }} className={'btn btn-sm btn-' + color}>Pay</button>
    }

    useEffect(() => {
        var apiList = [];
        apiList.push(Api.Get(apiUrls.masterDataController.getByMasterDataType + `?masterdatatype=payment_mode`))
        apiList.push(Api.Get(apiUrls.expenseController.getAllExpenseCompany + '?pageNo=1&pageSize=10000'))
        Api.MultiCall(apiList)
            .then(res => {
                setPaymentMode(res[0].data);
                setCompanyShopList(res[1].data.data);
            });
    }, []);

    useEffect(() => {
        if (rentDetailId > 0) {
            Api.Get(apiUrls.rentController.getRentTransaction + `?id=${rentDetailId}`)
                .then(res => {
                    tableOptionRentDetailsTemplet.data = res.data;
                    tableOptionRentDetailsTemplet.totalRecords = res.data?.length;
                    setTableOptionRentDetails(tableOptionRentDetailsTemplet);
                });
        }
    }, [rentDetailId]);


    const searchDueRent = (searchTerm) => {
        Api.Get(apiUrls.rentController.searchDeuRents + `?pageNo=${pageNo}&pageSize=${pageSize}&SearchTerm=${searchTerm}`)
            .then(res => {
                bindTableWithData(res);
            })
    }

    const tableOptionTransactionTemplet = {
        headers: [
            { name: 'Location', prop: 'rentLocation', action: { hAlign: "center", dAlign: "start", footerText: "" } },
            { name: 'Installment Name', prop: 'installmentName', action: { hAlign: "center", dAlign: "start", footerText: "" } },
            { name: 'Installment Date', prop: 'installmentDate', action: { hAlign: "center", footerText: "Total" } },
            { name: 'Installment Amount', prop: 'installmentAmount', action: { hAlign: "center", dAlign: "end", fAlign: "end", decimal: true, footerSum: true } },
            { name: 'Remaing Days', prop: 'remDays', customColumn: remainingDaysBadge, action: { hAlign: "center", dAlign: "start", footerText: "" } },
            { name: 'Paid On', prop: 'paidOn', action: { hAlign: "center", dAlign: "start", footerText: "" } },
            { name: 'Pay', prop: 'isPaid', customColumn: getCustomPayButton, action: { hAlign: "center", dAlign: "start", footerText: "" } },
        ],
        data: [],
        totalRecords: 0,
        pageSize: pageSize,
        pageNo: pageNo,
        showAction: false,
        showTop: false,
        pageNo: pageNo,
        pageSize: pageSize,
        setPageNo: setPageNo,
        setPageSize: setPageSize,
        searchHandler: searchDueRent
    };
    const [tableOptionTransaction, setTableOptionTransaction] = useState(tableOptionTransactionTemplet);
    const tableOptionRentDetailsTemplet = {
        headers: headerFormat.rentDetails,
        data: [],
        totalRecords: 0,
        showAction: false,
        showTableTop: false,
        showPagination: false
    };
    const [tableOptionRentDetails, setTableOptionRentDetails] = useState(tableOptionRentDetailsTemplet);

    useEffect(() => {
        Api.Get(apiUrls.rentController.getDueRents + `?isPaid=${false}&pageNo=${pageNo}&pageSize=${pageSize}`)
            .then(res => {
                bindTableWithData(res);
            });
    }, [pageNo, pageSize]);

    const breadcrumbOption = {
        title: 'Due Rents',
        items: [
            {
                title: "Rent Details",
                icon: "bi bi-bezier",
                link: '/account/rent-details'
            },
            {
                title: "Rent Due",
                icon: "bi bi-bezier",
                isActive: false,
            }
        ]
    }
    const handleTextChange = (e) => {
        var { value, name } = e.target;
        var data = paymentModel;
        if (name === 'companyId' || name === 'isPaid') {
            value = parseInt(value);
        }
        data[name] = value;
        data.id = transactionId;

        setPaymentModel({ ...data });

        if (!!errors[name]) {
            setErrors({ ...errors, [name]: null })
        }

    }
    const validateError = () => {
        const { chequeNo, paymentMode, companyId,paidOn } = paymentModel;
        const newError = {};
        if (!paymentMode || paymentMode === 0) newError.paymentMode = validationMessage.paymentModeRequired;
        if (paymentModel.paymentMode.toLowerCase() === 'cheque') {
            if (!chequeNo || chequeNo === 0) newError.chequeNo = validationMessage.chequeNoRequired;
            if (!chequeNo || chequeNo.toString().length < 6) newError.chequeNo = validationMessage.invalidChequeNo;
        }
        if (!paidOn || paidOn === '') newError.paidOn = validationMessage.paymentDateRequired;
        if (!companyId || companyId === 0) newError.companyId = validationMessage.companyNameRequired;
        return newError;
    }
    const bindTableWithData = (res) => {
        var rentDetail = res.data.data;
        rentDetail.forEach(element => {
            element.remDays = getRemainingDays(element.installmentDate);
        });
        tableOptionTransactionTemplet.data = res.data.data;
        tableOptionTransactionTemplet.totalRecords = res.data.totalRecords
        setTableOptionTransaction(tableOptionTransactionTemplet);
    }

    const filterHandler = () => {
        Api.Get(apiUrls.rentController.searchDeuRents + `?pageNo=${pageNo}&pageSize=${pageSize}&fromDate=${paymentModel.fromDate}&toDate=${paymentModel.toDate}&isPaid=${paymentModel.isPaid}`)
            .then(res => {
                bindTableWithData(res);
            })
    }
    return (
        <div>
            <div className='d-flex justify-content-between align-items-center'>
                <div>
                    <Breadcrumb option={breadcrumbOption} />
                </div>
                <div style={{ display: 'flex' }}>
                    <div className='mx-2'>
                        <span>Paid Status</span>
                        <SearchableDropdown style={{ marginLeft: '10px' }} onChange={handleTextChange} className="form-control-sm" data={[{ id: 2, value: "All" }, { id: 1, value: "Paid" }, { id: 3, value: "Unpaid" }]} name="isPaid" value={paymentModel.isPaid} />
                    </div>
                    <div className='mx-2'>
                        <span>From Date</span>
                        <Inputbox showLabel={false} type="date" style={{ marginLeft: '10px' }} onChangeHandler={handleTextChange} className="form-control-sm" name="fromDate" value={paymentModel.fromDate} />
                    </div>
                    <div className='mx-2'>
                        <span>To Date</span>
                        <Inputbox showLabel={false} type="date" onChangeHandler={handleTextChange} className="form-control-sm" name="toDate" value={paymentModel.toDate} />
                    </div>
                    <div className='mx-2 my-3 py-1'>
                        <span></span>
                        <ButtonBox type="go" onClickHandler={filterHandler} className="btn-sm btn"></ButtonBox>
                    </div>
                </div>
            </div>
            <TableView option={tableOptionTransaction} />
            <div id="rent-pay-model" className="modal fade in" tabIndex="-1" role="dialog" aria-labelledby="myModalLabel" aria-hidden="true">
                <div className="modal-dialog modal-lg">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h5 className="modal-title">Rent Payment Details</h5>
                            <button type="button" className="btn-close" data-bs-dismiss="modal" aria-hidden="true"></button>
                        </div>
                        <div className="modal-body">
                            <div className="form-horizontal form-material">
                                <div className="card">
                                    <div className="card-body">
                                        <form className="row g-3">
                                            <div className="col-md-12">
                                                <Label text="Company/Shop Name" isRequired={true}></Label>
                                                <Dropdown name="companyId" text="companyName" onChange={handleTextChange} value={paymentModel.companyId} data={companyShopList}  ></Dropdown>
                                                <ErrorLabel message={errors?.companyId}></ErrorLabel>
                                            </div>
                                            <div className='col-12'>
                                                <Inputbox labelText="Payment Date" isRequired={true} errorMessage={errors?.paidOn} type="date" name="paidOn" value={common.getHtmlDate(paymentModel.paidOn)} className="form-control-sm" onChangeHandler={handleTextChange}/>
                                            </div>
                                            <div className="col-md-12">
                                                <Label text="Payment Mode" isRequired={true}></Label>
                                                <Dropdown name="paymentMode" onChange={handleTextChange} elementKey="value" value={paymentModel.paymentMode} data={paymentMode}  ></Dropdown>
                                                <ErrorLabel message={errors?.paymentMode}></ErrorLabel>
                                            </div>
                                            {
                                                paymentModel.paymentMode.toLowerCase() === 'cheque' &&
                                                <div className="col-md-12">
                                                    <Inputbox isRequired={paymentModel.paymentMode.toLowerCase() === 'cheque'} labelText="Cheque Number" type="number" max={999999} onChangeHandler={handleTextChange} value={paymentModel.chequeNo} name="chequeNo" errorMessage={errors?.chequeNo} />
                                                </div>
                                            }
                                            <div className='col-12'>
                                                <TableView option={tableOptionRentDetails} />
                                            </div>
                                        </form>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="modal-footer">
                            <ButtonBox icon="bi bi-currency-dollar" type="go" className="btn-sm" text="Pay" onClickHandler={e => payRentHandler(transactionId)} />
                            <ButtonBox type="cancel"  className="btn-sm"  modalId="closePopup" modelDismiss={true} />
                        </div>
                    </div>
                    {/* <!-- /.modal-content --> */}
                </div>
            </div>
        </div>
    )
}
