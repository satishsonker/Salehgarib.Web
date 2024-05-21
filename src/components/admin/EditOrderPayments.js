import React, { useEffect, useState } from 'react'
import Breadcrumb from '../common/Breadcrumb'
import ButtonBox from '../common/ButtonBox'
import Inputbox from '../common/Inputbox'
import TableView from '../tables/TableView';
import { Api } from '../../apis/Api'
import { apiUrls } from '../../apis/ApiUrls'
import { headerFormat } from '../../utils/tableHeaderFormat';
import Label from '../common/Label';
import { common } from '../../utils/common';

export default function EditOrderPayments() {
    const modelTemplete = {
        orderNo: "",
    }
    const [orderAndPaymentDetails, setOrderAndPaymentDetails] = useState({});
    const [model, setModel] = useState(modelTemplete);
    const [selectedPaymentForEdit, setSelectedPaymentForEdit] = useState({});
    const [errors, setErrors] = useState();
    const textChangeHandler = (e) => {
        var { value, name } = e.target;
        if (name === "orderNo") {
            setErrors({ ...errors, ["noDataFound"]: undefined })
        }
        setModel({ ...model, [name]: value })
    }
    const onOrderSearchHandler = () => {
        if (model.orderNo === "" || model.orderNo === "0" || parseInt(model.orderNo) < 1) {
            setErrors({ ...errors, ["orderNo"]: "Please enter valid order number." })
            return
        }

        Api.Get(`${apiUrls.orderController.getOrderAndPaymentDetailByOrderNo}?orderNo=${model.orderNo}`)
            .then(res => {
                if (res.data?.id > 0) {
                    setOrderAndPaymentDetails({ ...res.data });
                    var orderData=[];
                    orderData.push(res.data);
                    orderTableOptionTemplet.data=orderData;
                    setOrderTableOption(orderTableOptionTemplet);
                    orderDetailTableOptionTemplet.data=res.data.orderDetails;
                    setOrderDetailTableOption(orderDetailTableOptionTemplet);
                    paymentTableOptionTemplet.data=res.data.accountStatements?.filter(x=>x.credit>0);
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
    const orderDetailTableOptionTemplet = {
        headers: headerFormat.order,
        data: [],
        totalRecords: 0,
        pageSize: 100,
        pageNo: 1,
        showTableTop:false,
        showAction:false
    };
    const [orderDetailTableOption, setOrderDetailTableOption] = useState(orderDetailTableOptionTemplet);
    const paymentTableOptionTemplet = {
        headers: headerFormat.editPayment,
        data: [],
        totalRecords: 0,
        pageSize: 100,
        pageNo: 1,
        showTableTop:false,
        actions: {
            showView: false,
            showEdit: true,
            showDelete: false,
            edit:{
                modelId:"editPaymentModel",
                handler:(id,data)=>{
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
        showTableTop:false,
        showAction:false
    };
    const [orderTableOption, setOrderTableOption] = useState(orderTableOptionTemplet);

    const updateHandler=()=>{

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
                                <TableView option={orderDetailTableOption}></TableView>
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
                <div className="modal-dialog modal-lg" role="document">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h5 className="modal-title">Edit Payment For Order No. : {orderTableOption.data[0]?.orderNo}</h5>
                            <button type="button" className="btn-close" id='closEeditPaymentModel' data-bs-dismiss="modal" aria-label="Close"></button>
                        </div>
                        <div className="modal-body">
                            <div className='row'>
                                <div className='col-12'>
                                    <div className='d-flex justify-content-between'>
                                        <Label text={`Payment Date : ${common.getHtmlDate(selectedPaymentForEdit?.paymentDate)}`}/>
                                        <Label text={`Reason : ${selectedPaymentForEdit?.reason}`}/>
                                        <Label text={`Payment MOde : ${selectedPaymentForEdit?.paymentMode}`}/>
                                    </div>
                                </div>
                                <div className='col-12'>

                                </div>
                                <div className='col-12 my-3'>
                                    <Inputbox name="cancelDate" errorMessage={errors?.cancelDate} value={model.cancelDate} labelText="Cancel Date" onChangeHandler={textChangeHandler} isRequired={true} type="date" />
                                </div>
                                <div className='col-12'>
                                    <div className='text-danger text-small text-center'>
                                        Once you cancel the Employee. you cant rollback this action.
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
