import React, { useState, useEffect, useRef } from 'react'
import { common } from '../../../utils/common';
import Label from '../../common/Label';
import InvoiceHead from '../../common/InvoiceHead';
import ReceiptFooter from '../ReceiptFooter';
import OrderCommonHeaderComponent from './OrderCommonHeaderComponent';
import { Api } from '../../../apis/Api';
import { apiUrls } from '../../../apis/ApiUrls';
import ReactToPrint, { useReactToPrint } from 'react-to-print';
import ButtonBox from '../../common/ButtonBox';

export default function PrintOrderReceiptPopup({ orderId,modelId }) {
    modelId="printOrderReceiptPopupModal"+common.defaultIfEmpty(modelId,"");
    var printRef = useRef();
    const [finalOrder, setFinalOrder] = useState([]);
    const [mainData, setMainData] = useState({id:orderId,orderNo:'000'});
    const vat = parseFloat(process.env.REACT_APP_VAT);
    let cancelledOrDeletedSubTotal = 0;
    let cancelledOrDeletedVatTotal = 0;
    let cancelledOrDeletedTotal = 0;
    let advanceVat = ((mainData?.advanceAmount / 100) * 5);
    let balanceVat = ((mainData?.balanceAmount / 100) * 5);
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
        if (orderId === undefined || orderId < 1)
            return;

        Api.Get(apiUrls.orderController.get + orderId)
            .then(res => {
                setMainData(res.data);
                let activeOrderDetails = mainData?.orderDetails?.filter(x => !x.isCancelled && !x.isDeleted);
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
                setFinalOrder(orders);
                console.log("Ren....", orderId)
            });


    }, [orderId])
    if (orderId === undefined || mainData === undefined)
        return <></>
    const getWorkOrderTypes = (workType) => {
        if (workType === undefined || workType === null || workType === '') {
            return '';
        }
        let types = ['', 'Designing', 'Cutting', 'M. Emb', 'Hot Fix', 'H. Emb', 'Apliq', 'Stitching']
        let str = '';
        workType.split('').forEach(ele => {
            str += types[parseInt(ele)] + ', '
        });
        return str.substring(0, str.length - 1);
    }


    return (
        <>
            <div className="modal fade" id={modelId} tabIndex="-1" aria-labelledby={modelId+"Label"} aria-hidden="true">
                <div className="modal-dialog modal-lg">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h5 className="modal-title" id={modelId+"Label"}>Print Order Receipt</h5>
                            <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                        </div>
                        <div className="modal-body">
                            <div ref={printRef} style={{ padding: '10px' }} className="row">

                                <div className="col col-lg-12 mx-auto">
                                    <div className="card border shadow-none">
                                        <div className="card-header py-3">
                                            <div className="row align-items-center g-3">
                                                <InvoiceHead></InvoiceHead>
                                            </div>
                                        </div>
                                        <OrderCommonHeaderComponent
                                            orderNo={mainData?.orderNo}
                                            customerName={mainData?.customerName}
                                            orderDate={mainData?.orderDate}
                                            contact={mainData?.contact1}
                                            orderDeliveryDate={mainData?.orderDeliveryDate}
                                            salesman={mainData?.salesman} />
                                        <div className="card-body">
                                            <div className="table-responsive">
                                                <table className="table table-invoice" style={{ fontSize: '12px' }}>
                                                    <thead>
                                                        <tr>
                                                            <th className='text-center all-border' style={{ width: 'max-content !important' }}>S.No.</th>
                                                            <th className="text-center all-border" width="30%">DESCRIPTION</th>
                                                            <th className="text-center all-border" width="10%">Model No.</th>
                                                            <th className="text-center all-border" width="10%">Qty.</th>
                                                            <th className="text-center all-border" width="10%">Item Price</th>
                                                            <th className="text-center all-border" width="8%">Unit Price</th>
                                                            <th className="text-center all-border" width="8%">Vat {vat}%</th>
                                                            <th className="text-center all-border" width="8%">Total Dhs.</th>
                                                        </tr>
                                                    </thead>
                                                    <tbody>

                                                        {
                                                            finalOrder?.map((ele, index) => {
                                                                return <tr key={ele.id}>
                                                                    <td className="text-center border border-secondary" style={{ width: 'max-content !important' }}>{index + 1}.</td>
                                                                    <td className="text-center border border-secondary text-wrap" width="30%">{getWorkOrderTypes(ele.workType)}</td>
                                                                    <td className="text-center border border-secondary" width="10%">{`${common.defaultIfEmpty(ele.designCategory, "")} - ${common.defaultIfEmpty(ele.designModel, '')}`}</td>
                                                                    <td className="text-center border border-secondary" width="10%">{common.printDecimal(ele.qty)}</td>
                                                                    <td className="text-center border border-secondary" width="10%">{common.printDecimal((ele.subTotalAmount / ele.qty))}</td>
                                                                    <td className="text-center border border-secondary" width="8%">{common.printDecimal(ele.subTotalAmount)}</td>
                                                                    <td className="text-center border border-secondary" width="8%">{common.printDecimal(ele.vatAmount)}</td>
                                                                    <td className="text-center border border-secondary" width="8%">{common.printDecimal(ele.totalAmount)}</td>
                                                                </tr>
                                                            })
                                                        }

                                                    </tbody>
                                                </table>
                                                <table className='table table-bordered'>
                                                    <tbody>
                                                        <tr>
                                                            <td colSpan={3} className="text-start"><i className='bi bi-call' />{process.env.REACT_APP_COMPANY_NUMBER} <i className='bi bi-whatsapp text-success'></i></td>
                                                            <td colSpan={1} className="text-end" >Total Quantity</td>
                                                            <td colSpan={2} className="text-center">VAT {vat}%</td>
                                                            <td colSpan={1} className="fs-6 fw-bold text-center">Gross Amount</td>
                                                            <td colSpan={1} className="text-end">{common.printDecimal(mainData?.subTotalAmount)}</td>
                                                        </tr>
                                                        <tr>
                                                            <td colSpan={3} className="text-start"><i className='bi bi-mail' /> {process.env.REACT_APP_COMPANY_EMAIL}<i className='bi bi-envelope text-success'></i></td>
                                                            <td colSpan={1} className="text-end" >{mainData?.qty}</td>
                                                            <td className="fs-6 fw-bold text-center">Total VAT</td>
                                                            <td className="text-end">{common.printDecimal(common.calculatePercent((mainData?.subTotalAmount - cancelledOrDeletedSubTotal), 5))}</td>
                                                            <td className="fs-6 fw-bold text-center">Total Amount</td>
                                                            <td className="text-end">{common.printDecimal((mainData?.totalAmount - cancelledOrDeletedTotal))}</td>
                                                        </tr>
                                                        <tr>
                                                            <td colSpan={4} className="text-start">Received by.................................</td>
                                                            <td className="fs-6 fw-bold text-center">Adv VAT</td>
                                                            <td className="text-end">{common.printDecimal(advanceVat)}</td>
                                                            <td className="fs-6 fw-bold text-center">Total Advance</td>
                                                            <td className="text-end">{common.printDecimal(mainData?.advanceAmount)}</td>
                                                        </tr>
                                                        <tr>
                                                            <td colSpan={4} className="text-start"></td>
                                                            <td className="fs-6 fw-bold text-center">Bal VAT</td>
                                                            <td className="text-end">{common.printDecimal(balanceVat)}</td>
                                                            <td className="fs-6 fw-bold text-center">Total Balance</td>
                                                            <td className="text-end">{common.printDecimal(mainData?.totalAmount - cancelledOrDeletedTotal - mainData?.advanceAmount)}</td>
                                                        </tr>
                                                    </tbody>
                                                </table>
                                            </div>
                                        </div>
                                        <ReceiptFooter />
                                    </div>
                                </div>
                            </div>
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

        </>
    )
}
