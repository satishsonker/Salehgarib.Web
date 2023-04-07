import React, { useState } from 'react'
import { common } from '../../utils/common'
import { headerFormat } from '../../utils/tableHeaderFormat';
import PrintTaxInvoiceReceipt from '../print/orders/PrintTaxInvoiceReceipt';
export default function BillingTaxTable({ billingData, showPrintOption = true, showBalanceVat = true, forReport = false }) {

    const VAT = parseFloat(process.env.REACT_APP_VAT);
    const [selectedOrderId, setSelectedOrderId] = useState(0);
    const modelId = "printTaxInvoiceReceiptModel";
    const headers = headerFormat.billingTaxReport;
    const calculateHeaderLength = () => {
        let hLen = headers.length;
        if (!showPrintOption) {
            hLen -= 1;
        }
        if (!showBalanceVat) {
            hLen -= 1;
        }
        return hLen;
    }
    const [headerLen, setHeaderLen] = useState(calculateHeaderLength())

    const calculateSum = (date, withDateFilter = true) => {
        //Sorting billing data by Payment Date;
        let data = billingData.sort((a, b) => {
            return new Date(b.paymentDate) - new Date(a.paymentDate);
        });
        if (withDateFilter) {
            data = billingData?.filter(x => common.getHtmlDate(x.paymentDate) === common.getHtmlDate(date));
        }
        let obj = {
            paidAmount: data.reduce((sum, ele) => { return sum + ele.credit }, 0),
            subTotalAmount: data?.reduce((sum, ele) => { return sum + ele?.order.subTotalAmount }, 0),
            totalAmount: data?.reduce((sum, ele) => { return sum + ele?.order.totalAmount }, 0),
            qty: data.reduce((sum, ele) => { return sum + ele.order.qty }, 0),
            paidVat: data.reduce((sum, ele) => { return sum + ((ele.credit / (100 + VAT)) * VAT) }, 0)
        }
        return obj;
    }
    const calBalVat = (res) => {
        return common.calculateVAT(res.order.subTotalAmount, VAT).vatAmount - (res.credit / (100 + VAT)) * VAT;
    }
    const calBalAmount = (res) => {
        return res.order.totalAmount - res.credit
    }
    return (
        <>
            <div className={!forReport ? "table-responsive" : ""}>
                <table className={(!forReport ? "table-striped fixTableHead " : "") + 'table table-bordered'} style={{ fontSize: '12px' }}>
                    <thead>
                        <tr>
                            {headers.map((res, index) => {
                                if (!showPrintOption && res?.prop === "print")
                                    return "";
                                if (!showBalanceVat && res?.prop === "balanceVat")
                                    return "";
                                else
                                    return <th key={index} className='text-center'>{res?.name}</th>
                            })}
                        </tr>
                    </thead>
                    <tbody>
                        {billingData?.length > 0 && <tr>
                            <td className='text-center fw-bold fs-6' colSpan={headerLen}> Date : {common.getHtmlDate(billingData[0]?.paymentDate, 'ddmmyyyy')}</td>
                        </tr>
                        }
                        {billingData?.length === 0 && <tr>
                            <td className='text-center text-danger' colSpan={headerLen}> No Data Found</td>
                        </tr>
                        }
                        {billingData?.map((res, index) => {
                            return <>
                                <tr key={index} style={{ fontSize: '12px' }}>
                                    {showPrintOption && <td className='text-center' style={{ padding: '5px' }}>
                                        <div style={{ cursor: "pointer", fontSize: '16px' }}
                                            onClick={e => setSelectedOrderId(res?.order?.id)}
                                            className="text-success"
                                            data-bs-placement="bottom"
                                            bs-toggle="tooltip"
                                            title={"Print Tax Invoice for Invoice No: " + common.invoiceNoPadding(res.order.taxInvoiceNo).padStart(7, '0')}
                                            data-bs-toggle="modal"
                                            data-bs-target={"#" + modelId}>
                                            <i className="bi bi-printer"></i>
                                        </div>
                                    </td>}
                                    <td className='text-center' style={{ padding: '5px' }}>{index + 1}</td>
                                    <td className='text-center' style={{ padding: '5px' }}>{common.getHtmlDate(res.paymentDate, 'ddmmyyyy')}</td>
                                    <td className='text-center' style={{ padding: '5px' }}>{common.invoiceNoPadding(res.order.taxInvoiceNo).padStart(7, '0')}</td>
                                    <td className='text-center' style={{ padding: '5px' }}>{res.order.orderNo}</td>
                                    <td className='text-center' style={{ padding: '5px' }}>{res.order.qty}</td>
                                    <td className='text-center' style={{ padding: '5px' }}>{common.printDecimal(res.order.subTotalAmount)}</td>
                                    <td className='text-center' style={{ padding: '5px' }}>{common.printDecimal(common.calculateVAT(res.order.subTotalAmount, VAT).vatAmount)}</td>
                                    <td className='text-center' style={{ padding: '5px' }}>{common.printDecimal(res.order.totalAmount)}</td>
                                    <td className='text-center' style={{ padding: '5px' }}>{common.printDecimal(res.credit)}</td>
                                    <td className={calBalAmount(res) < 0 ? 'bg-danger text-center' : 'text-center'} style={{ padding: '5px' }} title={calBalAmount(res) < 0 ? "Customer has paid more than order amount" : ""}>{common.printDecimal(calBalAmount(res))}</td>
                                    <td className='text-center' style={{ padding: '5px' }}>{common.printDecimal((res.credit / (100 + VAT)) * VAT)}</td>
                                    {showBalanceVat && <td className={calBalVat(res) < 0 ? 'bg-danger text-center' : 'text-center'} style={{ padding: '5px' }} title={calBalVat(res) < 0 ? "Customer has paid more than order VAT" : ""}>{common.printDecimal(calBalVat(res))}</td>}
                                </tr>
                                {common.getHtmlDate(res.paymentDate) !== common.getHtmlDate(billingData[index + 1]?.paymentDate) &&
                                    <>
                                        <tr key={index + 1000}>
                                            <td colSpan={forReport?(headerLen - 7):(headerLen-8)}>Total on : {common.getHtmlDate(res.paymentDate, 'ddmmyyyy')}</td>
                                            <td className='text-center fw-bold'>{calculateSum(res.paymentDate).qty}</td>
                                            <td className='text-center fw-bold'>{common.printDecimal(calculateSum(res.paymentDate).subTotalAmount)}</td>
                                            <td className='text-center fw-bold'>{common.printDecimal(calculateSum(res.paymentDate).totalAmount - calculateSum(res.paymentDate).subTotalAmount)}</td>
                                            <td className='text-center fw-bold'>{common.printDecimal(calculateSum(res.paymentDate).totalAmount)}</td>
                                            <td className='text-center fw-bold'>{common.printDecimal(calculateSum(res.paymentDate).paidAmount)}</td>
                                            <td className='text-center fw-bold'>{common.printDecimal(calculateSum(res.paymentDate).totalAmount - calculateSum(res.paymentDate).paidAmount)}</td>
                                            <td className='text-center fw-bold'>{common.printDecimal(calculateSum(res.paymentDate).paidVat)}</td>
                                            {showBalanceVat &&
                                                <td className='text-center fw-bold'>{common.printDecimal(calculateSum(res.paymentDate).totalAmount - calculateSum(res.paymentDate).subTotalAmount - calculateSum(res.paymentDate).paidVat)}</td>
                                            }
                                        </tr>
                                        <tr key={index + 2000}>
                                            <td colSpan={headerLen}>.</td>
                                        </tr>
                                        {billingData[index + 1]?.paymentDate !== undefined && common.getHtmlDate(billingData[index + 1]?.paymentDate) !== 'NaN-NaN-NaN' && <>
                                            <tr key={index + 3000}>
                                                <td className='text-center fw-bold fs-6' colSpan={headerLen}> Date : {common.getHtmlDate(billingData[index + 1]?.paymentDate, 'ddmmyyyy')}</td>
                                            </tr>
                                            <tr key={index + 4000}>
                                                {headers.map((res, index) => {
                                                    if (!showPrintOption && res?.prop === "print")
                                                        return "";
                                                    if (!showBalanceVat && res?.prop === "balanceVat")
                                                        return "";
                                                    else
                                                        return <th key={index} className='text-center'>{res?.name}</th>
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
                {forReport &&
                    <div className='row'>
                        <div className='col-10 text-end'>Total Order Qty</div>
                        <div className='col-2 text-end fw-bold'>{calculateSum(null,false).qty}</div>
                        <div className='col-10 text-end'>Sub Total Order Amount</div>
                        <div className='col-2 text-end fw-bold'>{common.printDecimal(calculateSum(null,false).subTotalAmount)}</div>
                        <div className='col-10 text-end'>Total Order Amount</div>
                        <div className='col-2 text-end fw-bold'>{common.printDecimal(calculateSum(null,false).totalAmount)}</div>
                        <div className='col-10 text-end'>Total Paid Amount</div>
                        <div className='col-2 text-end fw-bold'>{common.printDecimal(calculateSum(null,false).paidAmount)}</div>
                        <div className='col-10 text-end'>Total Paid Vat ({VAT}%)</div>
                        <div className='col-2 text-end fw-bold'>{common.printDecimal(calculateSum(null,false).paidVat)}</div>
                    </div>
                }
            </div>
            <PrintTaxInvoiceReceipt orderId={selectedOrderId} />
        </>

    )
}
