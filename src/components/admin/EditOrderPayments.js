<<<<<<< HEAD
import React, { useEffect, useState } from 'react'
import Breadcrumb from '../common/Breadcrumb'
import ButtonBox from '../common/ButtonBox'
import Inputbox from '../common/Inputbox'
import TableView from '../tables/TableView';
import { Api } from '../../apis/Api'
import { apiUrls } from '../../apis/ApiUrls'
import { headerFormat } from '../../utils/tableHeaderFormat';

export default function EditOrderPayments() {
    const modelTemplete = {
        orderNo: "",
    }
    const [orderAndPaymentDetails, setOrderAndPaymentDetails] = useState({});
    const [model, setModel] = useState(modelTemplete);
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
                debugger;
                if (res.data?.id > 0) {
                    setOrderAndPaymentDetails({ ...res.data });
                    var orderData=[];
                    orderData.push(res.data);
                    orderTableOptionTemplet.data=orderData;
                    setOrderTableOption(orderTableOptionTemplet);
                    orderDetailTableOptionTemplet.data=res.data.orderDetails;
                    setOrderDetailTableOption(orderDetailTableOptionTemplet);
                    paymentTableOptionTemplet.data=res.data.accountStatements;
                    setPaymentTableOption(paymentTableOptionTemplet);
                }
                else {
                    setErrors({ ...model, ["noDataFound"]: `No Record found for order No: ${model.orderNo}` })
                }
            })
    }
=======
import React from 'react'
import Breadcrumb from '../common/Breadcrumb'

export default function EditOrderPayments() {
>>>>>>> 8fda3b757c4de1e31e021baac8dbaf7fd166f769
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
<<<<<<< HEAD
                icon: "bi bi-pen-fill",
=======
                icon: "bi bi-person-check-fill",
>>>>>>> 8fda3b757c4de1e31e021baac8dbaf7fd166f769
                isActive: false,
            }
        ]
    }
<<<<<<< HEAD
    const orderDetailTableOptionTemplet = {
        headers: headerFormat.order,
        data: [],
        totalRecords: 0,
        pageSize: 100,
        pageNo: 1,
        showTableTop:false,
        actions: {
            showView: false,
            showEdit: true,
            showDelete: false
        }
    };
    const [orderDetailTableOption, setOrderDetailTableOption] = useState(orderDetailTableOptionTemplet);
    const paymentTableOptionTemplet = {
        headers: headerFormat.order,
        data: [],
        totalRecords: 0,
        pageSize: 100,
        pageNo: 1,
        showTableTop:false,
        actions: {
            showView: false,
            showEdit: true,
            showDelete: false
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
        actions: {
            showView: false,
            showEdit: true,
            showDelete: false
        }
    };
    const [orderTableOption, setOrderTableOption] = useState(orderTableOptionTemplet);

=======
>>>>>>> 8fda3b757c4de1e31e021baac8dbaf7fd166f769
    return (
        <>
            <Breadcrumb option={breadcrumbOption}></Breadcrumb>
            <h6 className="mb-0 text-uppercase">Edit Payments</h6>
            <hr />
<<<<<<< HEAD
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
=======
>>>>>>> 8fda3b757c4de1e31e021baac8dbaf7fd166f769
        </>
    )
}
