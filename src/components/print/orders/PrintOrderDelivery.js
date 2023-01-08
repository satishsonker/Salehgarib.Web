import React, { useState, useEffect, useRef } from 'react'
import { Api } from '../../../apis/Api';
import { apiUrls } from '../../../apis/ApiUrls';
import { common } from '../../../utils/common';
import ButtonBox from '../../common/ButtonBox';
import InvoiceHead from '../../common/InvoiceHead'
import ReceiptFooter from '../ReceiptFooter';
import OrderCommonHeaderComponent from './OrderCommonHeaderComponent';
import ReactToPrint from 'react-to-print';

export default function PrintOrderDelivery({ order, setTabPageIndex }) {
    const [paidAmount, setPaidAmount] = useState({ lastPaidAmount: 0, totalPaidAmount: 0 })
    const [preAmount, setPreAmount] = useState(0);
    const [finalOrder, setFinalOrder] = useState({});
    const vat = parseFloat(process.env.REACT_APP_VAT);
    const printRef = useRef();
    useEffect(() => {
        if (order?.id === undefined)
            return;
        let apiList = [];
        apiList.push(Api.Get(apiUrls.orderController.getCustomerPaymentForOrder + order?.id));
        apiList.push(Api.Get(apiUrls.orderController.get + order?.id));
        apiList.push(Api.Get(apiUrls.orderController.getPreviousAmount + `?customerId=${order?.customerId}&excludeOrderId=${order?.id}`))
        Api.MultiCall(apiList)
            .then(res => {
                let calVat = common.calculateVAT(order?.subTotalAmount, vat);
                if (typeof order === 'object') {
                    order.vatAmount = calVat.vatAmount;
                }
                setPaidAmount(res[0].data);
                setFinalOrder(res[1].data);
                setPreAmount(res[2].data);
            })
    }, [order]);
    const setInvoiceNo = () => {
        var orderId = order?.id;
        if (orderId === undefined || orderId.length < 1)
            return '0000000';
        else {
            return ("0000" + orderId).slice(-7);
        }
    }

    const calculateAmount = () => {
        var vatAdvance = common.calculatePercent(finalOrder?.advanceAmount, vat);
        var vatPaid = common.calculatePercent(paidAmount.totalPaidAmount, vat);
        return {
            totalAdvance: finalOrder?.advanceAmount,
            advance: finalOrder?.advanceAmount - vatAdvance,
            vatAdvance: vatAdvance,
            paid: paidAmount.totalPaidAmount - vatPaid,
            vatPaid: vatPaid

        }
    }
    if (order?.id === undefined)
        return ''
    return (
        <>
            <div className='row'>
                <div className='col-12'>
                    <div className='d-flex justify-content-between'>
                        <ButtonBox className="btn-sm" type="back" onClickHandler={() => { setTabPageIndex(0) }} />
                        <ReactToPrint
                            trigger={() => {
                                return <button className='btn btn-sm btn-warning' data-bs-dismiss="modal"><i className='bi bi-printer'></i> Print Delivery Receipt</button>
                            }}
                            content={(el) => (printRef.current)}
                        />
                    </div>
                </div>
            </div>
            <div ref={printRef} className="p-3">
                <InvoiceHead receiptType='Tax Invoice'></InvoiceHead>
                <div className='row'>
                    <div className='col-12'>
                        <div className='card'>
                            <OrderCommonHeaderComponent
                                orderNo={order.orderNo}
                                customerName={order.customerName}
                                orderDate={order.orderDate}
                                orderDeliveryDate={order.orderDeliveryDate}
                                contact={order.contact1}
                                salesman={order.salesman}
                                invoiceNo={setInvoiceNo()}
                            />

                            <div className='card-body'>
                                <table className='table table-bordered' style={{ fontSize: '12px', padding: '4px' }}>
                                    <thead>
                                        <tr>
                                            <th className='text-center' colSpan={2}>Total Quantity</th>
                                            <th className='text-center' colSpan={2}>Bill Amount</th>
                                            <th className='text-center' colSpan={2}>VAT 5%</th>
                                            <th className='text-center' colSpan={2}>Total Amount</th>
                                        </tr>
                                    </thead>
                                    <tbody style={{ fontSize: 'var(--app-font-size)' }}>
                                        <tr>
                                            <td colSpan={2}>Date of Advance</td>
                                            <td>Total</td>
                                            <td className='text-end'>{common.printDecimal(order?.subTotalAmount)}</td>
                                            <td>Total VAT</td>
                                            <td className='text-end'>{common.printDecimal(order?.vatAmount)}</td>
                                            <td>Total Amount</td>
                                            <td className='text-end'>{common.printDecimal(order?.totalAmount)}</td>
                                        </tr>
                                        <tr>
                                            <td colSpan={2}>Received By : </td>
                                            <td>Advance</td>
                                            <td className='text-end'>{common.printDecimal(calculateAmount().advance)}</td>
                                            <td>Adv VAT</td>
                                            <td className='text-end'>{common.printDecimal(calculateAmount().vatAdvance)}</td>
                                            <td>Total Advance</td>
                                            <td className='text-end'>{common.printDecimal(calculateAmount().totalAdvance)}</td>
                                        </tr>
                                        <tr>
                                            <td colSpan={2}></td>
                                            <td>Paid</td>
                                            <td className='text-end'>{common.printDecimal(calculateAmount().paid)}</td>
                                            <td>Paid VAT</td>
                                            <td className='text-end'>{common.printDecimal(calculateAmount().vatPaid)}</td>
                                            <td>Total Paid</td>
                                            <td className='text-end'>{common.printDecimal(paidAmount?.totalPaidAmount)}</td>
                                        </tr>
                                        <tr>
                                            <td className='fw-bold' colSpan={2}>Previous. Bal : {common.printDecimal(preAmount)}</td>
                                            <td>Balance</td>
                                            <td className='text-end'>{common.printDecimal(order?.subTotalAmount - common.calculatePercent(paidAmount?.totalPaidAmount, 95) - common.calculatePercent(finalOrder?.advanceAmount, 95))}</td>
                                            <td>Bal VAT</td>
                                            <td className='text-end'>{common.printDecimal(common.calculatePercent(order?.subTotalAmount - paidAmount?.totalPaidAmount - finalOrder?.advanceAmount, 5))}</td>
                                            <td>Total Balance</td>
                                            <td className='text-end fw-bold'>{common.printDecimal(finalOrder?.balanceAmount - paidAmount?.totalPaidAmount + preAmount)}</td>
                                        </tr>
                                    </tbody>
                                </table>
                                <ReceiptFooter></ReceiptFooter>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}
