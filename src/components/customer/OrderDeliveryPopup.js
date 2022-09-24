import React, { useState, useEffect } from 'react'
import { Api } from '../../apis/Api';
import { apiUrls } from '../../apis/ApiUrls';
import { common } from '../../utils/common';
import { headerFormat } from '../../utils/tableHeaderFormat';
import Label from '../common/Label';
import TableView from '../tables/TableView';

export default function OrderDeliveryPopup({ order }) {
    if (order !== undefined) {
        debugger;
    }
    const deliveryPaymentModelTemplete = {
        preBalance: 0,
        currentOrderAmount: 0,
        advanceAmount: 0,
        balanceAmount:0,
        lastPaidAmount:0,
    };
    const [deliveryPaymentModel, setDeliveryPaymentModel] = useState(deliveryPaymentModelTemplete);
    const tableOptionOrderDetailsTemplet = {
        headers: headerFormat.orderDetails,
        changeRowClassHandler: (data) => {
            return data?.isCancelled ? "bg-danger text-white" : "";
        },
        showTableTop: false,
        showFooter: false,
        data: [],
        totalRecords: 0,
        showAction: false
    }
    const [tableOptionOrderDetails, setTableOptionOrderDetails] = useState(tableOptionOrderDetailsTemplet);

    useEffect(() => {
        if (order === undefined) {
            return;
        }
        tableOptionOrderDetailsTemplet.data = order.orderDetails;
        tableOptionOrderDetailsTemplet.totalRecords = order?.orderDetails?.length;
        setTableOptionOrderDetails(tableOptionOrderDetailsTemplet);
       

        Api.Get(apiUrls.orderController.getPreviousAmount + `?customerId=${order.customerId}`)
        .then(res=>{
            let mainData = deliveryPaymentModel;
            mainData.currentOrderAmount = order.totalAmount;
            mainData.advanceAmount = order.advanceAmount;
            mainData.balanceAmount=order.balanceAmount;
            mainData.preBalance=res.data;
            setDeliveryPaymentModel({ ...mainData });
        })
    }, [order])

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
                                        <div className="col-md-4">
                                            <Label fontSize='13px' text="Previouse Balance"></Label>
                                            <input type="text" className="form-control form-control-sm" value={deliveryPaymentModel.preBalance} placeholder="0" disabled />
                                        </div>
                                        <div className="col-md-4">
                                            <Label fontSize='13px' text="Current Order Amount"></Label>
                                            <input type="text" className="form-control form-control-sm" value={deliveryPaymentModel.currentOrderAmount} placeholder="0" disabled />
                                        </div>
                                        <div className="col-md-4">
                                            <Label fontSize='13px' text="Advance Amount"></Label>
                                            <input type="text" className="form-control form-control-sm" value={deliveryPaymentModel.advanceAmount} placeholder="0" disabled />
                                        </div>
                                        <div className="col-md-4">
                                            <Label fontSize='13px' text="Total Due Amount"></Label>
                                            <input type="text" className="form-control form-control-sm" value={deliveryPaymentModel.balanceAmount} placeholder="0" disabled />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="modal-footer">
                            <button type="button" className="btn btn-danger" data-bs-dismiss="modal">Close</button>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}
