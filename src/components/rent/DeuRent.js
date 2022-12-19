import { data, type } from 'jquery';
import React, { useState, useEffect } from 'react'
import { toast } from 'react-toastify';
import { Api } from '../../apis/Api';
import { apiUrls } from '../../apis/ApiUrls';
import { toastMessage } from '../../constants/ConstantValues';
import { validationMessage } from '../../constants/validationMessage';
import { common } from '../../utils/common';
import Breadcrumb from '../common/Breadcrumb';
import Dropdown from '../common/Dropdown';
import ErrorLabel from '../common/ErrorLabel';
import Inputbox from '../common/Inputbox';
import Label from '../common/Label';
import TableView from '../tables/TableView';

export default function DeuRent() {
    const paymentModelTemplate = {
        paymentMode: '',
        chequeNo: '',
        id: 0,
        companyId:0
    }
    const [paymentModel, setPaymentModel] = useState(paymentModelTemplate);
    const [companyShopList, setCompanyShopList] = useState([]);
    const [pageNo, setPageNo] = useState(1);
    const [pageSize, setPageSize] = useState(10);
    const [paymentMode, setPaymentMode] = useState([]);
    const [errors, setErrors] = useState({});
    const [transactionId, setTransactionId] = useState(0);
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
    const getRemainingDays=(data)=>{
        let curr_Date = new Date();
        let installment_Date = new Date(data.installmentDate);
        var diff = installment_Date.getTime() - curr_Date.getTime();

        return diff / (1000 * 60 * 60 * 24);
    }
    const customRemainingDaysColumn = (data) => {
        return <div className='text-center'>{parseInt(getRemainingDays(data))}</div>
    }
    const getCustomPayButton = (data) => {
        console.log(data);
        var color = 'success';
        var daydiff =parseInt(getRemainingDays(data));
        if(daydiff>=15)
        color="success";
        else if(daydiff>=0 && daydiff<=5)
        color="warning";
        else
        color="danger";
        return <button data-bs-toggle='modal' data-bs-target='#rent-pay-model' onClick={e => setTransactionId(data.id)} className={'btn btn-sm btn-'+color}>Pay</button>
    }
    useEffect(() => {
        var apiList=[];
        apiList.push(Api.Get(apiUrls.masterDataController.getByMasterDataType + `?masterdatatype=payment_mode`))
        apiList.push(Api.Get(apiUrls.expenseController.getAllExpenseCompany+'?pageNo=1&pageSize=10000'))
        Api.MultiCall(apiList)
            .then(res => {
                setPaymentMode(res[0].data);
                setCompanyShopList(res[1].data.data);
            });
    }, []);

    const tableOptionTransactionTemplet = {
        headers: [
            { name: 'Installment Name', prop: 'installmentName' },
            { name: 'Installment Date', prop: 'installmentDate' },
            { name: 'Installment Amount', prop: 'installmentAmount' },
            { name: 'Remaing Days', prop: 'isPaid', customColumn: customRemainingDaysColumn },
            { name: 'Pay', prop: 'isPaid', customColumn: getCustomPayButton },
        ],
        data: [],
        totalRecords: 0,
        pageSize: pageSize,
        pageNo: pageNo,
        showAction: false,
        showTop:false
    };
    const [tableOptionTransaction, setTableOptionTransaction] = useState(tableOptionTransactionTemplet);

    useEffect(() => {
        Api.Get(apiUrls.rentController.getDeuRents + `?isPaid=${false}&pageNo=${pageNo}&pageSize=${pageSize}`)
            .then(res => {
                tableOptionTransactionTemplet.data = res.data.data;
                tableOptionTransactionTemplet.totalRecords = res.data.totalRecords
                setTableOptionTransaction(tableOptionTransactionTemplet);
            });
    }, [pageNo, pageSize]);

    const breadcrumbOption = {
        title: 'Deu Rents',
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
        var { value, name, type } = e.target;
        var data = paymentModel;
        if (name === 'companyId') {
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
        const { chequeNo, paymentMode, companyId } = paymentModel;
        const newError = {};
        if (!paymentMode || paymentMode === 0) newError.paymentMode = validationMessage.paymentModeRequired;
        if (paymentModel.paymentMode.toLowerCase() === 'cheque') {
            if (!chequeNo || chequeNo === 0) newError.chequeNo = validationMessage.chequeNoRequired;
            if (!chequeNo || chequeNo.toString().length < 6) newError.chequeNo = validationMessage.invalidChequeNo;
        }
        if (!companyId || companyId === 0) newError.companyId = validationMessage.companyNameRequired;
        return newError;
    }
    return (
        <div>
            <Breadcrumb option={breadcrumbOption} />
            <TableView option={tableOptionTransaction} />
            <div id="rent-pay-model" className="modal fade in" tabIndex="-1" role="dialog" aria-labelledby="myModalLabel" aria-hidden="true">
                <div className="modal-dialog">
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
                                            <div className="col-md-12">
                                                <Label text="Payment Mode" isRequired={true}></Label>
                                                <Dropdown name="paymentMode" onChange={handleTextChange} elemenyKey="value" value={paymentModel.paymentMode} data={paymentMode}  ></Dropdown>
                                                <ErrorLabel message={errors?.paymentMode}></ErrorLabel>
                                            </div>
                                            {
                                                paymentModel.paymentMode.toLowerCase() === 'cheque' &&
                                                <div className="col-md-12">
                                                    <Inputbox isRequired={paymentModel.paymentMode.toLowerCase() === 'cheque'} labelText="Cheque Number" type="number" max={999999} onChangeHandler={handleTextChange} value={paymentModel.chequeNo} name="chequeNo" errorMessage={errors?.chequeNo} />
                                                </div>
                                            }
                                        </form>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="modal-footer">
                            <button type="button" className="btn btn-success waves-effect" onClick={e => payRentHandler(transactionId)}>Pay</button>
                            <button type="button" className="btn btn-danger waves-effect" id='closePopup' data-bs-dismiss="modal">Cancel</button>
                        </div>
                    </div>
                    {/* <!-- /.modal-content --> */}
                </div>
            </div>
        </div>
    )
}
