import React, { useState, useEffect } from 'react'
import { toast } from 'react-toastify';
import { Api } from '../../apis/Api';
import { apiUrls } from '../../apis/ApiUrls';
import { toastMessage } from '../../constants/ConstantValues';
import { validationMessage } from '../../constants/validationMessage';
import { common } from '../../utils/common';
import { headerFormat } from '../../utils/tableHeaderFormat';
import Dropdown from '../common/Dropdown';
import ErrorLabel from '../common/ErrorLabel';
import Label from '../common/Label';
import TableView from '../tables/TableView';

export default function OrderDeliveryPopup({ order,searchHandler }) {
    const deliveryPaymentModelTemplete = {
        preBalance: 0,
        currentOrderAmount: 0,
        advanceAmount: 0,
        balanceAmount: 0,
        lastPaidAmount: 0,
        totalPaidAmount: 0,
        deliveredKandoorId: 0,
        paidAmount: 0,
        dueAfterPayment: 0
    };
    const [deliveryPaymentModel, setDeliveryPaymentModel] = useState(deliveryPaymentModelTemplete);
    const tableOptionOrderDetailsTemplet = {
        headers: [
            { name: "Order No", prop: "orderNo" },
            { name: "Order Delivery Date", prop: "orderDeliveryDate" },
            { name: "Category", prop: "designCategory" },
            { name: "Model", prop: "designModel" },
            { name: "Description", prop: "description" },
            { name: "Order Status", prop: "orderStatus" },
            { name: "Measurement Status", prop: "measurementStatus" },
            { name: "Crystal", prop: "crystal" },
            { name: "Price", prop: "price" },
            { name: "Sub Total Amount", prop: "subTotalAmount" },
            { name: "VAT", prop: "vat" },
            { name: "VAT Amount", prop: "vatAmount" },
            { name: "Total Amount", prop: "totalAmount" },
            { name: "Status", prop: "status" }
        ],
        changeRowClassHandler: (data) => {
            return data?.isCancelled ? "bg-danger text-white" : "";
        },
        showTableTop: false,
        showFooter: false,
        data: [],
        totalRecords: 0,
        showAction: false
    }
    const [errors, setErrors] = useState({});
    const [tableOptionOrderDetails, setTableOptionOrderDetails] = useState(tableOptionOrderDetailsTemplet);
    const [kandooraList, setKandooraList] = useState([]);

    useEffect(() => {
        setErrors({});
        if (order === undefined || Object.keys(order).length === 0) {
            return;
        }

        let kandooraNos = [];

        order.orderDetails.forEach(element => {
            kandooraNos.push({ id: element.id, value: element.orderNo });
        });

        setKandooraList(kandooraNos);
        let apiList = [];
        apiList.push(Api.Get(apiUrls.orderController.getPreviousAmount + `?customerId=${order.customerId}&excludeOrderId=${order.id}`));
        apiList.push(Api.Get(apiUrls.orderController.getCustomerPaymentForOrder + order.id));
        Api.MultiCall(apiList)
            .then(res => {
                let mainData = deliveryPaymentModel;
                mainData.orderId = order.id
                mainData.customerId=order.customerId;
                mainData.orderNo=order.orderNo;
                mainData.currentOrderAmount = order.totalAmount;
                mainData.advanceAmount = order.advanceAmount;
                mainData.preBalance = res[0].data;
                mainData.lastPaidAmount = res[1].data.lastPaidAmount === null ? 0 : res[1].data.lastPaidAmount;
                mainData.totalPaidAmount = res[1].data.totalPaidAmount === null ? 0 : res[1].data.totalPaidAmount;
                mainData.paidAmount = 0;
                mainData.deliveredKandoorId = 0;
                mainData.balanceAmount = order.balanceAmount - mainData.totalPaidAmount + mainData.preBalance;
                mainData.dueAfterPayment = mainData.balanceAmount - mainData.paidAmount;
                order.orderDetails.forEach(element => {
                    debugger;
                    element.vat=5;
                    element.vatAmount=common.calculateVAT(element.subTotalAmount,5).vatAmount;
                });
                tableOptionOrderDetailsTemplet.data = order.orderDetails;
                tableOptionOrderDetailsTemplet.totalRecords = order?.orderDetails?.length;
                setTableOptionOrderDetails(tableOptionOrderDetailsTemplet);
                setDeliveryPaymentModel({ ...mainData });
            })
    }, [order]);

    const handleTextChange = (e) => {
        let { type, name, value } = e.target;
        if (type === 'select-one') {
            value = parseInt(value);
        }
        if (type === 'number') {
            value = parseFloat(value);
        }
        let mainData = deliveryPaymentModel;
        mainData[name] = value;
        mainData.dueAfterPayment = mainData.balanceAmount - (isNaN(mainData.paidAmount)?0:mainData.paidAmount);
        setDeliveryPaymentModel({ ...deliveryPaymentModel, [name]: value });
    }

    const validateSavePayment = () => {
        var { paidAmount, dueAfterPayment } = deliveryPaymentModel;
        const newError = {};
        if (!paidAmount || paidAmount <= 0) newError.paidAmount = validationMessage.paidAmountRequired;
        if (dueAfterPayment <=-1) newError.dueAfterPayment = validationMessage.dueAmountError;
        return newError;
    }
    const savePayment = () => {
        let formError = validateSavePayment();
        if (Object.keys(formError).length > 0) {
            setErrors(formError);
            return;
        }
        else
            setErrors({});

        Api.Post(apiUrls.orderController.updateDeliveryPayment, deliveryPaymentModel)
            .then(res => {
                if (res.data > 0) {
                    toast.success(toastMessage.saveSuccess);
                    common.closePopup('kandoora-delivery-popup-model');
                    searchHandler('');
                }
                else {
                    toast.warn(toastMessage.saveError);
                }
            })
    }
    return (
        <>
            <div className="modal fade" id="kandoora-delivery-popup-model" tabIndex="-1" aria-labelledby="kandoora-delivery-popup-model-label" aria-hidden="true">
                <div className="modal-dialog modal-lg">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h5 className="modal-title" id="kandoora-delivery-popup-model-label">Kandoora Status</h5>
                            <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                        </div>
                        <div className="modal-body">
                            <div className="card">
                                <div className="card-body">
                                    <div className='row'>
                                        <div className='col-4'>Order No. {order?.orderNo}</div>
                                        <div className='col-4'>Customer Name : {order?.customerName?.split('-')[0]}</div>
                                        <div className='col-4'>Contact : {order?.customerName?.split('-')[1]}</div>
                                        <div className='col-4'>Delivery Date : {common.getHtmlDate(order?.orderDeliveryDate)}</div>
                                        <div className='col-4'>Order Date : {common.getHtmlDate(order?.orderDate)}</div>
                                    </div>
                                </div>
                            </div>
                            <TableView option={tableOptionOrderDetails} />
                            <div className="card">
                                <div className="card-body">
                                    <div className='row g-1'>
                                        <div className="col-md-3">
                                            <Label fontSize='13px' text="Previouse Balance"></Label>
                                            <input type="text" className="form-control form-control-sm" value={deliveryPaymentModel.preBalance} placeholder="0" disabled />
                                        </div>
                                        <div className="col-md-3">
                                            <Label fontSize='13px' text="Current Order Amount"></Label>
                                            <input type="text" className="form-control form-control-sm" value={deliveryPaymentModel.currentOrderAmount} placeholder="0" disabled />
                                        </div>
                                        <div className="col-md-3">
                                            <Label fontSize='13px' text="Advance Amount"></Label>
                                            <input type="text" className="form-control form-control-sm" value={deliveryPaymentModel.advanceAmount} placeholder="0" disabled />
                                        </div>
                                        <div className="col-md-3">
                                            <Label fontSize='13px' text="Last Paid Amount"></Label>
                                            <input type="text" className="form-control form-control-sm" value={deliveryPaymentModel.lastPaidAmount} placeholder="0" disabled />
                                        </div>
                                        <div className="col-md-3">
                                            <Label fontSize='13px' text="Total Paid Amount"></Label>
                                            <input type="text" className="form-control form-control-sm" value={deliveryPaymentModel.totalPaidAmount} placeholder="0" disabled />
                                        </div> <div className="col-md-9">
                                            <Label fontSize='13px' text="Kandoora Delivered"></Label>
                                            <Dropdown className='form-control-sm' onChange={handleTextChange} data={kandooraList} elemenyKey="id" text="value" defaultValue='0' name="deliveredKandoorId" value={deliveryPaymentModel.deliveredKandoorId} defaultText="All" />
                                        </div>
                                        <div className="col-md-3">
                                            <Label fontSize='13px' text="Total Due Amount"></Label>
                                            <input type="text" className="form-control form-control-sm" value={deliveryPaymentModel.balanceAmount} placeholder="0" disabled />
                                        </div>

                                        <div className="col-md-3">
                                            <Label fontSize='13px' text="Paid Amount" helpText="Amount paying by customer"></Label>
                                            <input type="number" onChange={e => handleTextChange(e)} min={0} className="form-control form-control-sm" value={deliveryPaymentModel.paidAmount} name="paidAmount" placeholder="0" />
                                            <ErrorLabel message={errors.paidAmount} />
                                        </div>
                                        <div className="col-md-3">
                                            <Label fontSize='13px' text="Balance Amount"></Label>
                                            <input type="text" className="form-control form-control-sm" value={deliveryPaymentModel.dueAfterPayment} placeholder="0" disabled />
                                            <ErrorLabel message={errors.dueAfterPayment} />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="modal-footer">
                            <button type="button" className="btn btn-success" onClick={e => savePayment()} >Save</button>
                            <button type="button" className="btn btn-danger" data-bs-dismiss="modal">Close</button>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}
