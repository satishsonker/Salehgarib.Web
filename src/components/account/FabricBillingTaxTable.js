import React, { useState } from 'react'
import { common } from '../../utils/common'
import { headerFormat } from '../../utils/tableHeaderFormat';
import PrintTaxInvoiceReceipt from '../print/orders/PrintTaxInvoiceReceipt';
export default function FabricBillingTaxTable({ billingData, showPrintOption = true, showBalanceVat = true, forReport = false, showBalanceAmount = true }) {
    
    const headers = headerFormat.FabricBillingTaxReport;
    const calculateHeaderLength = () => {
        let hLen = headers.length;
        if (!showPrintOption) {
            hLen -= 1;
        }
        if (!showBalanceVat) {
            hLen -= 1;
        }
        if (!showBalanceAmount) {
            hLen -= 1;
        }
        return hLen;
    }
    const [headerLen, setHeaderLen] = useState(calculateHeaderLength())
    const [selectedOrderId, setSelectedOrderId] = useState(0);
    
    const VAT = parseFloat(process.env.REACT_APP_VAT);
    const modelId = "printTaxInvoiceReceiptModel";
    debugger;
   

    const calculateSum = (date, withDateFilter = true) => {
        //Sorting billing data by Payment Date;
        let data = billingData.sort((a, b) => {
            return new Date(b.taxInvoiceDate) - new Date(a.taxInvoiceDate);
        });
        if (withDateFilter) {
            data = billingData?.filter(x => common.getHtmlDate(x.taxInvoiceDate) === common.getHtmlDate(date));
        }
        let obj = {
            paidAmount:data?.paidAmount,
            subTotalAmount: data?.subTotalAmount,
            totalAmount: data?.totalAmount,
            qty: data.qty,
            paidVat: data?.vatAmount
        }
        return obj;
    }
    const calBalVat = (res) => {
        return common.calculateVAT(res?.subTotalAmount, VAT).vatAmount - ((res?.paidAmount+res?.advanceAmount+res?.discountAmount) / (100 + VAT)) * VAT;
    }
    const calBalAmount = (res) => {
        return res?.BalanceAmount;
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
                                if (!showBalanceAmount && res?.prop === "balanceAmount")
                                    return "";
                                else
                                    return <th key={index} className='text-center'>{res?.name}</th>
                            })}
                        </tr>
                    </thead>
                    <tbody>
                        {billingData?.length > 0 && <tr>
                            <td className='text-center fw-bold fs-6' colSpan={headerLen}> Date : {common.getHtmlDate(billingData[0]?.taxInvoiceDate, 'ddmmyyyy')}</td>
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
                                            onClick={e => setSelectedOrderId(res?.id)}
                                            className="text-success"
                                            data-bs-placement="bottom"
                                            bs-toggle="tooltip"
                                            title={"Print Tax Invoice for Invoice No: "}
                                            data-bs-toggle="modal"
                                            data-bs-target={"#" + modelId}>
                                            <i className="bi bi-printer"></i>
                                        </div>
                                    </td>}
                                    <td className='text-center' style={{ padding: '5px' }}>{index + 1}</td>
                                    <td className='text-center' style={{ padding: '5px' }}>{common.getHtmlDate(res?.taxInvoiceDate, 'ddmmyyyy')}</td>
                                    <td className='text-center' style={{ padding: '5px' }}>{res?.taxInvoiceNo}</td>
                                    <td className='text-center' style={{ padding: '5px' }}>{res?.invoiceNo}</td>
                                    <td className='text-center' style={{ padding: '5px' }}>{res?.qty}</td>
                                    <td className='text-center' style={{ padding: '5px' }}>{common.printDecimal(res?.subTotalAmount)}</td>
                                    <td className='text-center' style={{ padding: '5px' }}>{common.printDecimal(common.calculateVAT(res?.subTotalAmount, VAT).vatAmount)}</td>
                                   
                                    <td className='text-center' style={{ padding: '5px' }}>{common.printDecimal(res?.totalAmount)}</td> 
                                    <td className='text-center' style={{ padding: '5px' }}>{common.printDecimal(res?.discountAmount)}</td>
                                    <td className='text-center' style={{ padding: '5px' }}>{common.printDecimal(res?.totalAfterDiscount)}</td>
                                    <td className='text-center' style={{ padding: '5px' }}>{common.printDecimal((res?.paidAmount+res?.advanceAmount))}</td>
                                    {showBalanceAmount && <td className={calBalAmount(res) < 0 ? 'bg-danger text-center' : 'text-center'} style={{ padding: '5px' }} data-toggle="tooltip" title={calBalAmount(res) < 0 ? "Customer has paid more than order amount" : ""}>{common.printDecimal(calBalAmount(res))}</td>}
                                    <td className='text-center' style={{ padding: '5px' }}>{common.printDecimal(((res?.paidAmount+res?.advanceAmount+res?.discountAmount) / (100 + VAT)) * VAT)}</td>
                                    {showBalanceVat && <td className={calBalVat(res) < 0 ? 'bg-danger text-center' : 'text-center'} style={{ padding: '5px' }} data-toggle="tooltip" title={calBalVat(res) < 0 ? "Customer has paid more than order VAT" : ""}>{common.printDecimal(calBalVat(res))}</td>}
                                </tr>
                                {common.getHtmlDate(res?.taxInvoiceDate) !== common.getHtmlDate(billingData[index + 1]?.taxInvoiceDate) &&
                                    <>
                                        <tr key={index + 1000}>
                                            <td colSpan={forReport ? (headerLen - 6) : (headerLen - 8)}>Total on : {common.getHtmlDate(res?.taxInvoiceDate, 'ddmmyyyy')}</td>
                                            <td className='text-center fw-bold'>{calculateSum(res?.taxInvoiceDate)?.qty??0}</td>
                                            <td className='text-center fw-bold'>{common.printDecimal(calculateSum(res?.taxInvoiceDate)?.subTotalAmount)}</td>
                                            <td className='text-center fw-bold'>{common.printDecimal(calculateSum(res?.taxInvoiceDate)?.totalAmount - calculateSum(res?.taxInvoiceDate)?.subTotalAmount)}</td>
                                            <td className='text-center fw-bold'>{common.printDecimal(calculateSum(res?.taxInvoiceDate)?.totalAmount)}</td>
                                            <td className='text-center fw-bold'>{common.printDecimal(calculateSum(res?.taxInvoiceDate)?.paidAmount)}</td>
                                           {showBalanceAmount && <td className='text-center fw-bold'>{common.printDecimal(calculateSum(res?.taxInvoiceDate)?.totalAmount - calculateSum(res?.taxInvoiceDate)?.paidAmount)}</td>}
                                            <td className='text-center fw-bold'>{common.printDecimal(calculateSum(res?.taxInvoiceDate)?.paidVat)}</td>
                                            {showBalanceVat &&
                                                <td className='text-center fw-bold'>{common.printDecimal(calculateSum(res?.taxInvoiceDate)?.totalAmount - calculateSum(res?.taxInvoiceDate)?.subTotalAmount - calculateSum(res?.taxInvoiceDate)?.paidVat)}</td>
                                            }
                                        </tr>
                                        <tr key={index + 2000}>
                                            <td colSpan={headerLen}>.</td>
                                        </tr>
                                        {billingData[index + 1]?.taxInvoiceDate !== undefined && common.getHtmlDate(billingData[index + 1]?.taxInvoiceDate) !== 'NaN-NaN-NaN' && <>
                                            <tr key={index + 3000}>
                                                <td className='text-center fw-bold fs-6' colSpan={headerLen}> Date : {common.getHtmlDate(billingData[index + 1]?.taxInvoiceDate, 'ddmmyyyy')}</td>
                                            </tr>
                                            <tr key={index + 4000}>
                                                {headers.map((res, index) => {
                                                    if (!showPrintOption && res?.prop === "print")
                                                        return "";
                                                    if (!showBalanceVat && res?.prop === "balanceVat")
                                                        return "";
                                                    if (!showBalanceAmount && res?.prop === "balanceAmount")
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
                        <div className='col-2 text-end fw-bold'>{calculateSum(null, false).qty}</div>
                        <div className='col-10 text-end'>Sub Total Order Amount</div>
                        <div className='col-2 text-end fw-bold'>{common.printDecimal(calculateSum(null, false).subTotalAmount)}</div>
                        <div className='col-10 text-end'>Total Order Amount</div>
                        <div className='col-2 text-end fw-bold'>{common.printDecimal(calculateSum(null, false).totalAmount)}</div>
                        <div className='col-10 text-end'>Total Paid Amount</div>
                        <div className='col-2 text-end fw-bold'>{common.printDecimal(calculateSum(null, false).paidAmount)}</div>
                        <div className='col-10 text-end'>Total Paid Vat ({VAT}%)</div>
                        <div className='col-2 text-end fw-bold'>{common.printDecimal(calculateSum(null, false).paidVat)}</div>
                    </div>
                }
            </div>
            <PrintTaxInvoiceReceipt orderId={selectedOrderId} />
        </>

    )
}
