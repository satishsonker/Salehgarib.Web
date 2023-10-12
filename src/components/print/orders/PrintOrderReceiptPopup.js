import React, { useState, useEffect, useRef } from 'react'
import { common } from '../../../utils/common';
import { Api } from '../../../apis/Api';
import { apiUrls } from '../../../apis/ApiUrls';
import ReactToPrint from 'react-to-print';
import ButtonBox from '../../common/ButtonBox';
import Dropdown from '../../common/Dropdown';
import InvoicePrintLayout from './InvoicePrintLayout';

export default function PrintOrderReceiptPopup({ orderId, modelId, setPrintReceiptHandler, showInPupop = true }) {
    modelId = "printOrderReceiptPopupModal" + common.defaultIfEmpty(modelId, "");
    var printRef = useRef();
    const [finalOrder, setFinalOrder] = useState([]);
    const [mainData, setMainData] = useState({ id: orderId, orderNo: '000' });
    const [orderNos, setOrderNos] = useState([]);
    const [selectOrderId, setSelectOrderId] = useState(0);
    if (typeof setPrintReceiptHandler === 'function') {
        setPrintReceiptHandler(printRef.current);
    }
    const vat = parseFloat(process.env.REACT_APP_VAT);
    let cancelledOrDeletedSubTotal = 0;
    let cancelledOrDeletedTotal = 0;
    let cancelledOrDeletedVatTotal = 0;
    let cancelledOrDeletedOrderDetails = mainData?.orderDetails?.filter(x => x.isCancelled || x.isDeleted);
    if (cancelledOrDeletedOrderDetails?.length > 0) {
        cancelledOrDeletedSubTotal = 0;
        cancelledOrDeletedVatTotal = 0;
        cancelledOrDeletedTotal = 0;
        cancelledOrDeletedOrderDetails?.forEach(element => {
            cancelledOrDeletedSubTotal += element.subTotalAmount;
            cancelledOrDeletedVatTotal += (element.totalAmount - element.subTotalAmount);
            cancelledOrDeletedTotal += element.totalAmount;
        });
    }

    useEffect(() => {
        if (mainData?.contact1 !== undefined && mainData?.contact1 !== "") {
            Api.Get(apiUrls.orderController.getByOrderNoByContact + mainData?.contact1?.replace('+', ""))
                .then(res => {
                    setOrderNos(res.data);
                })
        }
    }, [mainData]);


    useEffect(() => {
        debugger;
        if (orderId === undefined || orderId < 1)
            return;

        Api.Get(apiUrls.orderController.get + (selectOrderId > 0 ? selectOrderId : orderId))
            .then(res => {
                setMainData(res.data);
                let activeOrderDetails = res.data?.orderDetails?.filter(x => !x.isCancelled && !x.isDeleted);
                if (activeOrderDetails === undefined || activeOrderDetails.length === 0)
                    return;
                //Filter cancelled and deleted order details
                const orderChecker = [];
                const orders = [];
                activeOrderDetails?.forEach(res => {
                    var orderindex = orderChecker.indexOf(res.workType + res.totalAmount);
                    res.vatAmount = 0;
                    res.vatAmount += common.calculateVAT(res.subTotalAmount, vat).vatAmount;
                    if (orderindex === -1) {
                        res.qty = 1;
                        orders.push(res);
                        orderChecker.push(res.workType + res.totalAmount);
                    }
                    else {
                        orders[orderindex].qty += 1;
                        orders[orderindex].subTotalAmount += res.subTotalAmount;
                        orders[orderindex].totalAmount += res.totalAmount;
                        orders[orderindex].vatAmount += res.vatAmount;
                    }
                });
                for (let i = 0; i < 10; i++) {
                    if ((orders?.length % 8) !== 0)
                        orders.push({});
                }
                setFinalOrder(orders);
            });


    }, [orderId, selectOrderId])
    if (orderId === undefined || mainData === undefined)
        return <></>


    const SetSelectedOrderNo = (e) => {
        setSelectOrderId(e.target.value);
    }

    if (orderId < 1)
        return;
    return (
        <>
            {showInPupop &&
                <div className="modal fade" id={modelId} tabIndex="-1" aria-labelledby={modelId + "Label"} aria-hidden="true">
                    <div className="modal-dialog modal-lg">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h5 className="modal-title" id={modelId + "Label"}>Print Order Receipt</h5>
                                <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                            </div>
                            <div className="modal-body">
                                <div className='row'>
                                    <div className='col-3 fw-bold'>
                                        Print for another order
                                    </div>
                                    <div className='col-9'>
                                        <Dropdown className="form-control-sm" data={orderNos} onChange={SetSelectedOrderNo} text="orderNo" value={selectOrderId} elementKey="id" searchable={true} />
                                    </div>
                                </div>
                                <InvoicePrintLayout mainData={mainData} printRef={printRef} finalOrder={finalOrder}></InvoicePrintLayout>
                            </div>
                            <div className="modal-footer">
                                <ButtonBox type="cancel" modelDismiss={true} className="btn-sm"></ButtonBox>
                                <ReactToPrint
                                    trigger={() => {
                                        return <button className='btn btn-sm btn-success' data-bs-dismiss="modal"><i className='bi bi-printer'></i> Print</button>
                                    }}
                                    content={(el) => (printRef.current)}
                                />
                            </div>
                        </div>
                    </div>
                </div>
            }
            {!showInPupop &&
                <InvoicePrintLayout mainData={mainData} printRef={printRef} finalOrder={finalOrder}></InvoicePrintLayout>
            }
        </>
    )
}
