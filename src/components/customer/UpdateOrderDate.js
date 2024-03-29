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
    const [orderDate, setOrderDate] = useState(common.getHtmlDate(new Date()));
    useEffect(() => {
        Api.Get(apiUrls.orderController.getByOrderNumber)
            .then(res => {
                setorderList(res.data);
            })
    }, []);

    const updateOrderDate = () => {
        if(orderId<1)
        {
            toast.warn(validationMessage.orderNoRequired);
            return;
        }
        if(orderDate==="" || orderDate===undefined)
        {
            toast.warn(validationMessage.orderDateRequired);
            return;
        }
        Api.Post(apiUrls.orderController.updateOrderDate + `${orderId}?orderDate=${orderDate}`, {})
            .then(res => {
                if (res.data > 0) {
                    toast.success(toastMessage.updateSuccess);
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
    const orderDateChangeHandler=(e)=>{
        setOrderDate(e.target.value);
    }
    const orderNoSelectHandler = (data) => {
        setOrderId(data.orderId);
    }
    return (
        <div className="modal fade" id="update-order-date-model" tabIndex="-1" aria-labelledby="update-order-date-model-label" aria-hidden="true">
            <div className="modal-dialog modal-lg">
                <div className="modal-content">
                    <div className="modal-header">
                        <h5 className="modal-title" id="update-order-date-model-label">Update Order Date</h5>
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
                                    {
                                        orderList.length > 0 && <>    <div className='col-6'>
                                            <Label text="Order No" />
                                            <Dropdown data={orderList} onChange={orderNoChangeHandler} className='form-control-sm' elementKey="orderId" itemOnClick={orderNoSelectHandler} searchable={true} text="orderNo" value={orderId} defaultText="Select Order No" />
                                        </div>
                                            <div className='col-6'>
                                                <Inputbox labelText="Order Date" type="date" onChangeHandler={orderDateChangeHandler} className='form-control form-control-sm' value={orderDate} max={common.getHtmlDate(new Date())}/>
                                            </div>
                                        </>
                                    }
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="modal-footer">
                        {orderList.length > 0 && <ButtonBox type="update" className="btn-sm" onClickHandler={updateOrderDate}/>}
                        <ButtonBox type="cancel" modelDismiss={true} className="btn-sm"/>
                    </div>
                </div>
            </div>
        </div>
    )
}
