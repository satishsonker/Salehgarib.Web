import React, { useState, useEffect, useRef } from 'react'
import { Api } from '../../apis/Api';
import { apiUrls } from '../../apis/ApiUrls';
import ButtonBox from '../common/ButtonBox';
import PrintOrderDelivery from '../print/orders/PrintOrderDelivery';
import KandooraDeliveryTabPage from './KandooraDeliveryTabPage';
import NewAdvancePaymentTabPage from './NewAdvancePaymentTabPage';

export default function OrderDeliveryPopup({ order, searchHandler }) {
    const [selectedImageToZoom, setSelectedImageToZoom] = useState("");
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
                                    <div className={tabPageIndex === 1 ? "p-2 tab-header-button tab-header-button-active" : "p-2 tab-header-button"} onClick={e => setTabPageIndex(1)}>Advance Payment</div>
                                </div>
                            </div>
                            {
                                tabPageIndex === 0 && <>
                                    <KandooraDeliveryTabPage paymentModeData={paymentModeList} order={order} searchHandler={searchHandler} setTabPageIndex={setTabPageIndex} setSelectedImageToZoom={setSelectedImageToZoom} />
                                </>
                            }
                            {
                                (tabPageIndex === 1) && <>
                                    <NewAdvancePaymentTabPage order={order} paymentModeList={paymentModeList} tabPageIndex={tabPageIndex} setTabPageIndex={setTabPageIndex}></NewAdvancePaymentTabPage>
                                </>
                            }
                            {
                                tabPageIndex === 2 && <>
                                    <div className='tab-page'>
                                        <div className="card">
                                            <div className="card-body">
                                                <div className='row'>
                                                    <div className='col-12 mb-2'>
                                                        <ButtonBox type="back" onClickHandler={() => { setTabPageIndex(0) }} className="btn-sm" />
                                                    </div>
                                                    <div className='col-12'>
                                                        <img src={selectedImageToZoom?.replace("thumb_", "")} style={{ width: '57vw', maxHeight: '400px', border: '3px solid', borderRadius: '5px' }} />
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </>
                            }
                            {
                                tabPageIndex === 3 && <>
                                    <div className='tab-page'>
                                        <div className="card">
                                            <div className="card-body">
                                            <PrintOrderDelivery order={order} setTabPageIndex={setTabPageIndex}></PrintOrderDelivery>
                                               
                                            </div>
                                        </div>
                                    </div>
                                </>
                            }
                        </div>
                        <div className="modal-footer">
                            <ButtonBox type="cancel" className="btn-sm" text="Close" modelDismiss={true} />
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}
