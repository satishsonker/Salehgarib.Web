import React, { useState, useEffect } from 'react'
import { Api } from '../../../apis/Api';
import { apiUrls } from '../../../apis/ApiUrls';
import { common } from '../../../utils/common';
import InvoiceHead from '../../common/InvoiceHead'
import OrderCommonHeaderComponent from './OrderCommonHeaderComponent';

export const PrintOrderDelivery = React.forwardRef((props, ref) => {
    let order=props.props
    const [paidAmount, setPaidAmount] = useState({ lastPaidAmount: 0, totalPaidAmount: 0 })
    const vat = parseFloat(process.env.REACT_APP_VAT);
    useEffect(() => {
        let apiList = [];
        apiList.push(Api.Get(apiUrls.orderController.getCustomerPaymentForOrder + order?.id));
        apiList.push(Api.Get(apiUrls.orderController.get + order?.id));
        Api.MultiCall(apiList)
            .then(res => {
                let calVat = common.calculateVAT(order?.subTotalAmount, vat);
                if (typeof order === 'object'){
                order.vatAmount = calVat.vatAmount;
                }
                setPaidAmount(res[0].data);
            })
    }, [order]);
    const setInvoiceNo = () => {
        var orderId = order?.id;
        if (orderId === undefined || orderId.length<1)
            return '0000000';
        else {
            return ("0000" + orderId).slice(-7);
        }
    }
    if (order?.id === undefined)
    return ''
        return (
            <div ref={ref} className="p-3">
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
                                ivnvoiceNo={setInvoiceNo()}
                            />

                            <div className='card-body'>
                                <table className='table table-bordered' style={{ fontSize: '14px' }}>
                                    <thead>
                                        <tr>
                                            <th colSpan={2}>Total Quantity</th>
                                            <th colSpan={2}>Bill Amount</th>
                                            <th colSpan={2}>VAT 5%</th>
                                            <th colSpan={2}>Total Amount</th>
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
                                            <td className='text-end'>{common.printDecimal(common.calculatePercent(order?.advanceAmount, 95))}</td>
                                            <td>Adv VAT</td>
                                            <td className='text-end'>{common.printDecimal(common.calculatePercent(order?.advanceAmount, 5))}</td>
                                            <td>Total Advance</td>
                                            <td className='text-end'>{common.printDecimal(order?.advanceAmount)}</td>
                                        </tr>
                                        <tr>
                                            <td colSpan={2}></td>
                                            <td>Paid</td>
                                            <td className='text-end'>{common.printDecimal(common.calculatePercent(paidAmount.totalPaidAmount, 95))}</td>
                                            <td>Paid VAT</td>
                                            <td className='text-end'>{common.printDecimal(common.calculatePercent(paidAmount?.totalPaidAmount, 5))}</td>
                                            <td>Total Paid</td>
                                            <td className='text-end'>{common.printDecimal(paidAmount?.totalPaidAmount)}</td>
                                        </tr>
                                        <tr>
                                            <td colSpan={2}>Pre. Bal : {props.prebalance}</td>
                                            <td>Balance</td>
                                            <td className='text-end'>{common.printDecimal(order?.subTotalAmount-common.calculatePercent(paidAmount?.totalPaidAmount, 95)-common.calculatePercent(order?.advanceAmount, 95))}</td>
                                            <td>Bal VAT</td>
                                            <td className='text-end'>{common.printDecimal(common.calculatePercent(order?.balanceAmount-paidAmount?.totalPaidAmount-order?.advanceAmount, 5))}</td>
                                            <td>Total Balance</td>
                                            <td className='text-end fw-bold'>{common.printDecimal(order?.balanceAmount-paidAmount?.totalPaidAmount)}</td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        )
})
