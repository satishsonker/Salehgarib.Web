import React, { useState, useEffect, useRef } from 'react'
import { Api } from '../../apis/Api';
import { apiUrls } from '../../apis/ApiUrls';
import KandooraDeliveryTabPage from './KandooraDeliveryTabPage';
import NewAdvancePaymentTabPage from './NewAdvancePaymentTabPage';

export default function OrderDeliveryPopup({ order, searchHandler }) {

  
    const [paymentModeList, setPaymentModeList] = useState([])
    const [tabPageIndex, setTabPageIndex] = useState(0);

    useEffect(() => {
        Api.Get(apiUrls.masterDataController.getByMasterDataType + "?masterDataType=payment_mode")
            .then(res => {
                setPaymentModeList(res.data)
            })
    }, [order]);
    return (
        <>
            <div className="modal fade" id="kandoora-delivery-popup-model" tabIndex="-1" aria-labelledby="kandoora-delivery-popup-model-label" aria-hidden="true">
                <div className="modal-dialog modal-lg">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h5 className="modal-title" id="kandoora-delivery-popup-model-label">Kandoora Delivery Status</h5>
                            <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                        </div>
                        <div className="modal-body">
                            <div className='tab-header'>
                                <div className="d-flex flex-row justify-content-start" style={{ fontSize: 'var(--app-font-size)' }}>
                                    <div className={tabPageIndex === 0 ? "p-2 tab-header-button tab-header-button-active" : "p-2 tab-header-button"} onClick={e => setTabPageIndex(0)}>Kandoora Delivery</div>
                                    <div className={tabPageIndex > 0 ? "p-2 tab-header-button tab-header-button-active" : "p-2 tab-header-button"} onClick={e => setTabPageIndex(1)}>Advance Payment</div>
                                </div>
                            </div>
                            {
                                tabPageIndex === 0 && <>
                                    <KandooraDeliveryTabPage paymentModeData={paymentModeList} order={order} searchHandler={searchHandler} />
                                </>
                            }
                            {
                                (tabPageIndex > 0) && <>
                                    <NewAdvancePaymentTabPage order={order} paymentModeList={paymentModeList} tabPageIndex={tabPageIndex} setTabPageIndex={setTabPageIndex}></NewAdvancePaymentTabPage>
                                </>
                            }
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
