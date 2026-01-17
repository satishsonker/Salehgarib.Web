import React, { useState, useEffect } from 'react'
import { toast } from 'react-toastify';
import { Api } from '../../apis/Api';
import { apiUrls } from '../../apis/ApiUrls';
import { toastMessage } from '../../constants/ConstantValues';
import { validationMessage } from '../../constants/validationMessage';
import { common } from '../../utils/common';
import ButtonBox from '../common/ButtonBox';
import Dropdown from '../common/Dropdown';
import Inputbox from '../common/Inputbox';
import Label from '../common/Label';

export default function UpdateOrderDate() {
    const [orderList, setorderList] = useState([]);
    const [orderId, setOrderId] = useState(0);
    const [selectedOrderData, setSelectedOrderData] = useState({});
    const [orderDate, setOrderDate] = useState(common.getHtmlDate(new Date()));
    const [deliveryDate, setDeliveryDate] = useState(common.getHtmlDate(new Date()));
    const [deliveryDateChangeReason, setDeliveryDateChangeReason] = useState('');
    useEffect(() => {
        Api.Get(apiUrls.orderController.getByOrderNumber)
            .then(res => {
                setorderList(res.data);
            })
            .catch(err => console.error('Error fetching orders:', err));
    }, []);

    const updateOrderDate = () => {
        if (orderId < 1) {
            toast.warn(validationMessage.orderNoRequired);
            return;
        }
        if (orderDate === "" || orderDate === undefined) {
            toast.warn(validationMessage.orderDateRequired);
            return;
        }
        Api.Post(apiUrls.orderController.updateOrderDate + `${orderId}?orderDate=${orderDate}`, {})
            .then(res => {
                if (res.data > 0) {
                    toast.success(toastMessage.updateSuccess);
                    setOrderDate(common.getHtmlDate(new Date()));
                    setOrderId(0);
                }
                else {
                    toast.warn(toastMessage.updateError);
                }
            }).catch(err => {
                toast.error(err.message);
            })
    }

    const updateDeliveryDate = () => {
        if (orderId < 1) {
            toast.warn(validationMessage.orderNoRequired);
            return;
        }
        if (deliveryDate === "" || deliveryDate === undefined) {
            toast.warn('Delivery date is required');
            return;
        }
        if (deliveryDateChangeReason === "" || deliveryDateChangeReason === undefined || deliveryDateChangeReason.trim().length < 3) {
            toast.warn('Delivery date change reason is required');
            return;
        }
        Api.Post(apiUrls.orderController.updateOrderDeliveryDate, {
            orderId: orderId,
            newDeliveryDate: deliveryDate,
            reason: deliveryDateChangeReason
        })
            .then(res => {
                if (res.data > 0) {
                    toast.success(toastMessage.updateSuccess);
                    setDeliveryDate(common.getHtmlDate(new Date()));
                    setOrderId(0);
                }
                else {
                    toast.warn(toastMessage.updateError);
                }
            }).catch(err => {
                toast.error(err.message);
            })
    }

    const orderNoChangeHandler = (e) => {
        setOrderId(parseInt(e.target.value));
    }

    const orderDateChangeHandler = (e) => {
        setOrderDate(e.target.value);
    }

    const deliveryDateChangeHandler = (e) => {
        setDeliveryDate(e.target.value);
    }

    const deliveryDateChangeReasonChangeHandler = (e) => {
        setDeliveryDateChangeReason(e.target.value);
    }

    const orderNoSelectHandler = (data) => {
        if (data?.orderId > 0) {
            setOrderId(data.orderId);
            fetchOrderData(data.orderId);
        }
    }

    const fetchOrderData = (id) => {
        Api.Get(apiUrls.orderController.get + id)
            .then(res => {
                if (res.data) {
                    setSelectedOrderData(res.data);
                }
            })
            .catch(err => console.error('Error fetching order data:', err));
    }

    return (
        <div className="modal fade" id="update-order-date-model" tabIndex="-1" aria-labelledby="update-order-date-model-label" aria-hidden="true">
            <div className="modal-dialog modal-lg">
                <div className="modal-content">
                    <div className="modal-header">
                        <h5 className="modal-title" id="update-order-date-model-label">Update Order Date : {selectedOrderData?.orderNo}</h5>
                        <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                    </div>
                    <div className="modal-body">
                        <div className='card'>
                            <div className='card-body'>

                                <div className='row'>
                                    {
                                        orderList.length === 0 && <div className='col-12 text-center text-danger fs-6'>
                                            You do not have any active order(s). Please create atleast one order then visit again here.
                                        </div>
                                    }
                                    {selectedOrderData?.id > 0 && <>
                                        <div className='col-6'>
                                            <Label bold={true} fontSize={14} text={`Current Order Date : ${common.getHtmlDate(selectedOrderData.orderDate, 'ddmmyyyy')}`} />
                                        </div>
                                        <div className='col-6 text-end mb-2'>
                                            <Label bold={true} fontSize={14} text={`Current Delivery Date : ${common.getHtmlDate(selectedOrderData.orderDeliveryDate, 'ddmmyyyy')}`} />
                                        </div>
                                    </>
                                    }
                                    {
                                        orderList.length > 0 && <>
                                            <div className='col-12'>
                                                <Label isRequired={true} text="Order No" />
                                                <Dropdown data={orderList} onChange={orderNoChangeHandler} className='form-control-sm' elementKey="orderId" itemOnClick={orderNoSelectHandler} searchable={true} text="orderNo" value={orderId} defaultText="Select Order No" />
                                            </div>
                                            <hr className='my-3' />
                                            <div className='col-12'>
                                                <Inputbox isRequired={true} labelText="New Order Date" type="date" onChangeHandler={orderDateChangeHandler} className='form-control form-control-sm' value={orderDate} max={common.getHtmlDate(new Date())} />
                                            </div>
                                            <div className='col-12 mt-2 text-end'>
                                                <ButtonBox text="Update Order Date" type="update" onClickHandler={updateOrderDate} className='btn-sm' />
                                            </div>
                                            <hr className='my-3' />
                                            <div className='col-4'>
                                                <Inputbox isRequired={true} labelText="New Delivery Date" type="date" onChangeHandler={deliveryDateChangeHandler} className='form-control form-control-sm' value={deliveryDate} min={common.getHtmlDate(new Date())} />
                                            </div>
                                            <div className='col-8'>
                                                <Inputbox isRequired={true} labelText="Reason for Delivery Date Change" type="text" onChangeHandler={deliveryDateChangeReasonChangeHandler} className='form-control form-control-sm' value={deliveryDateChangeReason} />
                                            </div>


                                            <div className='col-12 mt-2 text-end'>
                                                <ButtonBox style={{ padding: '5px 4px' }} text="Update Delivery Date" type="update" onClickHandler={updateDeliveryDate} className='btn-sm' />
                                            </div>
                                             <div className='col-12 mt-2 text-end text-muted'>
                                                <small>Note: Whatsapp message will be sent automatically. When you change the delivery date, a message will be sent to the customer.</small>
                                                </div>
                                        </>
                                    }
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="modal-footer">
                        <ButtonBox type="cancel" modelDismiss={true} className="btn-sm" />
                    </div>
                </div>
            </div>
        </div>
    )
}
