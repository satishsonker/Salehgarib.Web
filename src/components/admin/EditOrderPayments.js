import React, { useEffect, useState } from 'react'
import Breadcrumb from '../common/Breadcrumb'
import ButtonBox from '../common/ButtonBox'
import Inputbox from '../common/Inputbox'
import TableView from '../tables/TableView';
import { Api } from '../../apis/Api'
import { apiUrls } from '../../apis/ApiUrls'
import { headerFormat } from '../../utils/tableHeaderFormat';
import Label from '../common/Label';
import Dropdown from '../common/Dropdown';
import { common } from '../../utils/common';
import ErrorLabel from '../common/ErrorLabel';
import { toast } from 'react-toastify';
import {toastMessage} from '../../constants/ConstantValues';
import {validationMessage} from '../../constants/validationMessage'

export default function EditOrderPayments() {
    const modelTemplete = {
        accountStatementId: 0,
        reason: '',
        creditAmount: 0,
        paymentMode: 'Cash',
        paymentDate: common.getHtmlDate(new Date())
    }

    const [model, setModel] = useState(modelTemplete);
    const [selectedPaymentForEdit, setSelectedPaymentForEdit] = useState({});
    const [errors, setErrors] = useState();
    const [paymentMode, setPaymentMode] = useState([]);

    const textChangeHandler = (e) => {
        var { value, name,type } = e.target;
        if(type==='number')
            value=parseFloat(value);
        if (name === "orderNo") {
            setErrors({ ...errors, ["noDataFound"]: undefined })
        }
        setModel({ ...model, [name]: value })
    }

    useEffect(() => {
        Api.Get(apiUrls.masterDataController.getByMasterDataType + `?masterdatatype=payment_mode`)
            .then(res => {
                setPaymentMode(res.data);
            })
    }, [])

    const onOrderSearchHandler = () => {
        if (model.orderNo === "" || model.orderNo === "0" || parseInt(model.orderNo) < 1) {
            setErrors({ ...errors, ["orderNo"]: "Please enter valid order number." })
            return
        }

        Api.Get(`${apiUrls.orderController.getOrderAndPaymentDetailByOrderNo}?orderNo=${model.orderNo}`)
            .then(res => {
                if (res.data?.id > 0) {
                    var orderData = [];
                    orderData.push(res.data);
                    orderTableOptionTemplet.data = orderData;
                    setOrderTableOption(orderTableOptionTemplet);
                    paymentTableOptionTemplet.data = res.data.accountStatements?.filter(x => x.credit > 0);
                    setPaymentTableOption(paymentTableOptionTemplet);
                }
                else {
                    setErrors({ ...model, ["noDataFound"]: `No Record found for order No: ${model.orderNo}` })
                }
            })
    }

    const breadcrumbOption = {
        title: 'Edit Order Payments',
        items: [
            {
                title: "Admin",
                icon: "bi bi-person-square",
                isActive: false,
            },
            {
                title: "Edit Payments",
                icon: "bi bi-pen-fill",
                isActive: false,
            }
        ]
    }

    const paymentTableOptionTemplet = {
        headers: headerFormat.editPayment,
        data: [],
        totalRecords: 0,
        pageSize: 100,
        pageNo: 1,
        showTableTop: false,
        actions: {
            showView: false,
            showEdit: true,
            showDelete: false,
            edit: {
                modelId: "editPaymentModel",
                handler: (id, data) => {
                    modelTemplete.accountStatementId=data?.id;
                    modelTemplete.creditAmount=data?.credit;
                    setModel({...modelTemplete});
                    setSelectedPaymentForEdit(data);

                }
            }
        }
    };

    const [paymentTableOption, setPaymentTableOption] = useState(paymentTableOptionTemplet);

    const orderTableOptionTemplet = {
        headers: headerFormat.orderDetails,
        data: [],
        totalRecords: 0,
        pageSize: 100,
        pageNo: 1,
        showTableTop: false,
        showAction: false
    };

    const [orderTableOption, setOrderTableOption] = useState(orderTableOptionTemplet);

    const updateHandler = () => {
        var formError={};
        if(!model.paymentMode || model.paymentMode==='')
            formError.paymentMode=validationMessage.paymentModeRequired;
        if(!model.reason || model.reason==='')
            formError.reason=validationMessage.reasonRequired;
        if(!model.paymentDate || model.paymentDate==='')
            formError.paymentDate=validationMessage.paymentDateRequired
        if(!model.creditAmount || model.creditAmount<=0)
            formError.creditAmount=validationMessage.paymentAmountRequired;
        if(Object.keys(formError).length>0){
            setErrors(formError);
            return
        }

        Api.Post(apiUrls.adminController.updateOrderPaymentAmount,model)
        .then(res=>{
            if(res===true)
            {
                toast.success(toastMessage.updateSuccess);
                common.closePopup('closEeditPaymentModel')
            }
        })

    }
    
    return (
        <>
            <Breadcrumb option={breadcrumbOption}></Breadcrumb>
            <h6 className="mb-0 text-uppercase">Edit Payments</h6>
            <hr />
            <div className="form-horizontal form-material">
                <div className="card">
                    <div className="card-body">
                        <div className='row'>
                            <div className="col-10">
                                <Inputbox labelText="Order Number" errorMessage={errors?.orderNo} labelFontSize="15px" bold={true} type="number" name="orderNo" value={model.orderNo} onChangeHandler={textChangeHandler} className="form-control-sm form-control" />
                                {errors?.noDataFound && <>
                                    <div className='text-danger'>{errors?.noDataFound}</div>
                                </>}
                            </div>
                            <div className="col-2 py-4">
                                <ButtonBox type="save" icon="bi-search" onClickHandler={onOrderSearchHandler} className="btn-sm" text="Search Order"></ButtonBox>
                            </div>
                        </div>
                        <div className='row'>
                            <div className='col-12'>
                                <TableView option={orderTableOption}></TableView>
                            </div>
                        </div>
                        <div className='row'>
                            <div className='col-12'>
                                <TableView option={paymentTableOption}></TableView>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div className="modal fade" id="editPaymentModel" data-bs-backdrop="static" data-bs-keyboard="false" tabIndex="-1" role="dialog">
                <div className="modal-dialog" role="document">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h5 className="modal-title">Edit Payment For Order No. : {orderTableOption.data[0]?.orderNo}</h5>
                            <button type="button" className="btn-close" id='closEeditPaymentModel' data-bs-dismiss="modal" aria-label="Close"></button>
                        </div>
                        <div className="modal-body">
                            <div className='row'>
                                <div className='col-12'>
                                    <div className='d-flex justify-content-between'>
                                        <Label text={`Payment Date : ${common.getHtmlDate(selectedPaymentForEdit?.paymentDate)}`} />
                                        <Label text={`Reason : ${selectedPaymentForEdit?.reason}`} />
                                        <Label text={`Payment Mode : ${selectedPaymentForEdit?.paymentMode}`} />
                                    </div>
                                </div>
                                <div className='col-12'>

                                </div>
                                <div className='col-12 my-3'>
                                    <Inputbox name="paymentDate" errorMessage={errors?.paymentDate} value={model.paymentDate} labelText="Payment Date" onChangeHandler={textChangeHandler} isRequired={true} type="date" />
                                </div>
                                <div className='col-12 my-3'>
                                    <Label text="Payment Mode" fontSize='12px' isRequired={true} />
                                   <Dropdown data={paymentMode} elementKey="value" name="paymentMode" value={model.paymentMode} onChange={textChangeHandler} />
                                    <ErrorLabel message={errors?.paymentMode} />
                                </div>
                                <div className='col-12 my-3'>
                                    <Inputbox name="creditAmount" errorMessage={errors?.creditAmount} value={model.creditAmount} labelText="Payment Amount" onChangeHandler={textChangeHandler} isRequired={true} type="number" min={0.00} />
                                </div>
                                <div className='col-12 my-3'>
                                    <Inputbox name="reason" errorMessage={errors?.reason} value={model.reason} labelText="Update Reason" onChangeHandler={textChangeHandler} isRequired={true} />
                                </div>
                                <div className='col-12'>
                                    <div className='text-danger text-small text-center'>
                                        Once you update/delete the payment. you cant rollback/undo this action.
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className='modal-footer'>
                            <ButtonBox type="update" onClickHandler={updateHandler} className="btn btn-sm"></ButtonBox>
                            <ButtonBox type="cancel" modelDismiss={true} className="btn btn-sm"></ButtonBox>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}
