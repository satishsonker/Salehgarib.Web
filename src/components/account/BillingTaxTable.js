import React, { useState } from 'react'
import { common } from '../../utils/common'
import PrintTaxInvoiceReceipt from '../print/orders/PrintTaxInvoiceReceipt';
export default function BillingTaxTable({ billingData }) {
    const VAT = parseFloat(process.env.REACT_APP_VAT);
    const [selectedOrderId, setSelectedOrderId] = useState(0);
    const modelId = "printTaxInvoiceReceiptModel";
    const headers = ["Print", "Sr", "Date", "Invoice No", "Order No.", "Qty", "Total Amount", "Paid Amount", "Balance Amount", "Total VAT", "Paid VAT", "Balance VAT"];
    const calculateSum = (date) => {
        var data = billingData?.filter(x => common.getHtmlDate(x.paymentDate) === common.getHtmlDate(date));
        return {
            paidAmount: data.reduce((sum, ele) => { return sum + ele.credit }, 0),
            totalAmount: data?.reduce((sum, ele) => { return sum + ele?.order.totalAmount }, 0),
            qty: data.reduce((sum, ele) => { return sum + ele.order.qty }, 0),
            paidVat: data.reduce((sum, ele) => { return sum + ((ele.credit / (100 + VAT)) * VAT) }, 0)
        }
    }
    const calBalVat = (res) => {
        var balVat = common.calculateVAT(res.order.subTotalAmount, VAT).vatAmount - (res.credit / (100 + VAT)) * VAT;
        return balVat < 0 ? 0 : balVat;
    }
    const calBalAmount = (res) => {
        var balAmt = res.order.totalAmount - res.credit
        return balAmt < 0 ? 0 : balAmt;
    }
    return (
        <>
            <div className="table-responsive">
                <table className='table table-bordered table-striped fixTableHead' style={{ fontSize: '12px' }}>
                    <thead>
                        <tr>
                            {headers.map((res, index) => {
                                return <th key={index} className='text-center'>{res}</th>
                            })}
                        </tr>
                    </thead>
                    <tbody>
                        {billingData?.length > 0 && <tr>
                            <td className='text-center fw-bold fs-6' colSpan={headers.length}> Date : {common.getHtmlDate(billingData[0]?.paymentDate, 'ddmmyyyy')}</td>
                        </tr>
                        }
                        {billingData?.length === 0 && <tr>
                            <td className='text-center text-danger' colSpan={headers.length}> No Data Found</td>
                        </tr>
                        }
                        {billingData?.map((res, index) => {
                            return <>
                                <tr key={index} style={{ fontSize: '12px' }}>
                                    <td className='text-center' style={{ padding: '5px' }}><div style={{ cursor: "pointer", fontSize: '16px' }} onClick={e => setSelectedOrderId(res?.order?.id)} className="text-success" data-bs-placement="bottom" title={"Print Tax Invoice for Invoice No: " + common.invoiceNoPadding(res.order.taxInvoiceNo).padStart(7, '0')} data-bs-toggle="modal" data-bs-target={"#" + modelId}><i className="bi bi-printer"></i></div></td>
                                    <td className='text-center' style={{ padding: '5px' }}>{index + 1}</td>
                                    <td className='text-center' style={{ padding: '5px' }}>{common.getHtmlDate(res.paymentDate, 'ddmmyyyy')}</td>
                                    <td className='text-center' style={{ padding: '5px' }}>{common.invoiceNoPadding(res.order.taxInvoiceNo).padStart(7, '0')}</td>
                                    <td className='text-center' style={{ padding: '5px' }}>{res.order.orderNo}</td>
                                    <td className='text-center' style={{ padding: '5px' }}>{res.order.qty}</td>
                                    <td className='text-center' style={{ padding: '5px' }}>{common.printDecimal(res.order.totalAmount)}</td>
                                    <td className='text-center' style={{ padding: '5px' }}>{common.printDecimal(res.credit)}</td>
                                    <td className='text-center' style={{ padding: '5px' }}>{common.printDecimal(calBalAmount(res))}</td>
                                    <td className='text-center' style={{ padding: '5px' }}>{common.printDecimal(common.calculateVAT(res.order.subTotalAmount, VAT).vatAmount)}</td>
                                    <td className='text-center' style={{ padding: '5px' }}>{common.printDecimal((res.credit / (100 + VAT)) * VAT)}</td>
                                    <td className='text-center' style={{ padding: '5px' }}>{common.printDecimal(calBalVat(res))}</td>
                                </tr>
                                {common.getHtmlDate(res.paymentDate) !== common.getHtmlDate(billingData[index + 1]?.paymentDate) &&
                                    <>
                                        <tr key={index+1000}>
                                            <td colSpan={5}>Total on : {common.getHtmlDate(res.paymentDate, 'ddmmyyyy')}</td>
                                            <td className='text-center fw-bold'>{common.printDecimal(calculateSum(res.paymentDate).qty)}</td>
                                            <td className='text-center fw-bold'>{common.printDecimal(calculateSum(res.paymentDate).totalAmount)}</td>
                                            <td className='text-center fw-bold'>{common.printDecimal(calculateSum(res.paymentDate).paidAmount)}</td>
                                            <td colSpan={2}></td>
                                            <td className='text-center fw-bold'>{common.printDecimal(calculateSum(res.paymentDate).paidVat)}</td>
                                            <td></td>
                                        </tr>
                                        <tr key={index+2000}>
                                            <td colSpan={headers.length}>.</td>
                                        </tr>
                                        {common.getHtmlDate(billingData[index + 1]?.paymentDate) !== 'NaN-NaN-NaN' && <>
                                            <tr key={index+3000}>
                                                <td className='text-center fw-bold fs-6' colSpan={headers.length}> Date : {common.getHtmlDate(billingData[index + 1]?.paymentDate, 'ddmmyyyy')}</td>
                                            </tr>
                                            <tr key={index+4000}>
                                                {headers.map((head, indexHead) => {
                                                    return <th key={indexHead} className='text-center'>{head}</th>
                                                })}
                                            </tr>
                                        </>
                                        }
                                    </>
                                }
                            </>
                        })}
                    </tbody>
                </table>
            </div>
            <PrintTaxInvoiceReceipt orderId={selectedOrderId} />
        </>

    )
}
