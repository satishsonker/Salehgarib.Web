import React, { useState, useEffect } from 'react'
import { Api } from '../../../apis/Api';
import { apiUrls } from '../../../apis/ApiUrls';
import { common } from '../../../utils/common';
import InvoiceHead from '../../common/InvoiceHead'

export const PrintOrderDelivery = React.forwardRef((props, ref) => {
    const [orderData, setOrderData] = useState({});
    const [paidAmount, setPaidAmount] = useState({lastPaidAmount:0,totalPaidAmount:0})
    const vat = parseFloat(process.env.REACT_APP_VAT);
    useEffect(() => {
        
        let apiList = [];
        apiList.push(Api.Get(apiUrls.orderController.getCustomerPaymentForOrder + props.props));
        apiList.push(Api.Get(apiUrls.orderController.get + props.props));
        Api.MultiCall(apiList)
            .then(res => {
                let calVat = common.calculateVAT(res[1].data.subTotalAmount, vat)
                if(typeof res[1].data==='object')
                res[1].data.vatAmount = calVat.vatAmount;
                setOrderData(res[1].data);
                setPaidAmount(res[0].data);
            })
    }, [props.props])
if(orderData?.orderId===undefined )
    return (
        <div ref={ref} className="p-3">
            <InvoiceHead receiptType='Tax Invoice'></InvoiceHead>
            <div className='row'>
                <div className='col-12'>
                    <div className='card'>
                        <div className='card-body'>
                            <table className='table table-bordered' style={{ fontSize: 'var(--app-font-size)' }}>
                                <tbody>
                                    <tr>
                                        <td style={{ width: '25%' }}>Invoice No.</td>
                                        <td style={{ width: '75%' }}  className="text-bold fs-4">{new Date().setSeconds(1).toString().substring(5)}</td>
                                    </tr>
                                    <tr>
                                        <td style={{ width: '25%' }}>Customer Name</td>
                                        <td style={{ width: '75%' }}>{orderData?.customerName}</td>
                                    </tr>
                                    <tr>
                                        <td style={{ width: '25%' }}>Contact</td>
                                        <td style={{ width: '75%' }}>{orderData?.contact1}</td>
                                    </tr>
                                    <tr>
                                        <td style={{ width: '25%' }}>Address</td>
                                        <td style={{ width: '75%' }}>{orderData?.address}</td>
                                    </tr>
                                </tbody>
                            </table>

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
                                        <td>{orderData?.subTotalAmount?.toFixed(2)}</td>
                                        <td>Total VAT</td>
                                        <td>{orderData?.vatAmount?.toFixed(2)}</td>
                                        <td>Total Amount</td>
                                        <td>{orderData?.totalAmount?.toFixed(2)}</td>
                                    </tr>
                                    <tr>
                                        <td colSpan={2}>Received By : </td>
                                        <td>Advance</td>
                                        <td>{common.calculatePercent(orderData?.advanceAmount, 95)?.toFixed(2)}</td>
                                        <td>Adv VAT</td>
                                        <td>{common.calculatePercent(orderData?.advanceAmount, 5)?.toFixed(2)}</td>
                                        <td>Total Advance</td>
                                        <td>{orderData?.advanceAmount?.toFixed(2)}</td>
                                    </tr>
                                    <tr>
                                        <td colSpan={2}></td>
                                        <td>Paid</td>
                                        <td>{common.calculatePercent(paidAmount.totalPaidAmount, 95)?.toFixed(2)}</td>
                                        <td>Paid VAT</td>
                                        <td>{common.calculatePercent(paidAmount?.totalPaidAmount, 5)?.toFixed(2)}</td>
                                        <td>Total Paid</td>
                                        <td>{paidAmount?.totalPaidAmount?.toFixed(2)}</td>
                                    </tr>
                                    <tr>
                                        <td colSpan={2}>Pre. Bal : {props.prebalance}</td>
                                        <td>Balance</td>
                                        <td>{common.calculatePercent(orderData?.balanceAmount, 95)?.toFixed(2)}</td>
                                        <td>Bal VAT</td>
                                        <td>{common.calculatePercent(orderData?.balanceAmount, 5)?.toFixed(2)}</td>
                                        <td>Total Balance</td>
                                        <td>{orderData?.balanceAmount?.toFixed(2)}</td>
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
