import React from 'react'
import { common } from '../../../../utils/common';
import { headerFormat } from '../../../../utils/tableHeaderFormat';
import InvoiceHead from '../../../common/InvoiceHead'

export const PrintDailyStatusReport = React.forwardRef((props, ref) => {
    if (props == undefined || props.props === undefined || props.props?.data===undefined)
        return;
    let statusData = props.props?.data;
    const VAT = parseFloat(process.env.REACT_APP_VAT);
    const getTotalSalesAmount = () => {
        // return statusData?.orders?.reduce((sum, ele) => {
        //     return sum + ele.advanceAmount;
        // }, 0)
        //     +
           return statusData?.customerAccountStatements?.reduce((sum, ele) => {
               // if (ele.reason?.toLowerCase() === 'paymentreceived')
                    return sum + ele.credit;
                // else
                //     return sum;
            }, 0)
    }
    const headers = headerFormat.printDailyStatusReport;
    return (
        <div ref={ref} className="p-3">
            <InvoiceHead receiptType='Daily Status Report'></InvoiceHead>
            <div className='card'>
                <div className='card-body'>
                    <div className='row my-2 fw-bold'>
                        <div className='col-6'>Status Report Date : {props.props?.date}</div>
                        <div className='col-6 text-end  fw-bold'>Printed On {new Date().toDateString()} {common.formatAMPM(new Date())}</div>
                    </div>
                    <table className='table table-bordered table-striped'>
                        <thead>
                            <tr>
                                {headers?.map((ele, index) => {
                                    return <th key={index} className='text-center'>{ele}</th>
                                })}
                            </tr>
                        </thead>
                        <tbody>
                            {statusData?.customerAccountStatements?.map((res, index) => {
                                return <tr style={{ fontSize: '12px' }}>
                                    <td className='text-center' style={{ padding: '5px' }}>{index + 1}</td>
                                    <td className='text-center' style={{ padding: '5px' }}>{res.order.orderNo}</td>
                                    <td className='text-end' style={{ padding: '5px' }}>{common.printDecimal(res.isFirstAdvance ? res.order.totalAmount : ((res.balance ?? 0) + (res.credit ?? 0)))}</td>
                                    <td className='text-center' style={{ padding: '5px' }}>{(res.deliveredQty?res?.order?.qty:res.deliveredQty)+"/"+(res?.order?.qty)}</td>
                                    <td className='text-end' style={{ padding: '5px' }}>{common.printDecimal(res.credit)}</td>
                                    <td className='text-end' style={{ padding: '5px' }}>{common.printDecimal(res.balance)}</td>
                                    <td className='text-center' style={{ padding: '5px' }}>{res.paymentMode}</td>
                                    <td className='text-center' style={{ padding: '5px' }}>{res?.reason?.toLowerCase() === "advancedpaid" ? "Advance" : "Delivery"}</td>
                                </tr>
                            })}
                            <tr style={{ fontSize: '12px' }}>
                                <td colSpan={headers.length - 1} className='text-end'>Total Booking Qty</td>
                                <td className='text-end'>{statusData?.orders?.reduce((sum, ele) => {
                                    return sum + ele?.qty;
                                }, 0)}</td>
                            </tr>
                            <tr style={{ fontSize: '12px' }}>
                                <td colSpan={headers.length - 1} className='text-end'>Total Booking Amount</td>
                                <td className='text-end'>{common.printDecimal(statusData?.orders?.reduce((sum, ele) => {
                                    return sum + ele.totalAmount;
                                }, 0))}</td>
                            </tr>
                            <tr style={{ fontSize: '12px' }}>
                                <td colSpan={headers.length - 1} className='text-end'>Total Booking Advance Cash</td>
                                <td className='text-end'>{common.printDecimal(statusData?.customerAccountStatements?.reduce((sum, ele) => {
                                    if (ele.paymentMode?.toLowerCase() === 'cash' && ele.reason === "AdvancedPaid")
                                        return sum + ele.credit;
                                    else
                                        return sum;
                                }, 0))}</td>
                            </tr>
                            <tr style={{ fontSize: '12px' }}>
                                <td colSpan={headers.length - 1} className='text-end'>Total Booking Advance VISA</td>
                                <td className='text-end'>{common.printDecimal(statusData?.customerAccountStatements?.reduce((sum, ele) => {
                                    if (ele.paymentMode?.toLowerCase() === 'visa' && ele.reason === "AdvancedPaid")
                                        return sum + ele.credit;
                                    else
                                        return sum;
                                }, 0))}</td>
                            </tr>
                            <tr style={{ fontSize: '12px' }}>
                                <td colSpan={headers.length - 1} className='text-end'>Total Delivered Qty</td>
                                <td className='text-end'>{statusData?.customerAccountStatements?.reduce((sum, ele) => {
                                    return sum + ele?.deliveredQty;
                                }, 0)}</td>
                            </tr>
                            <tr style={{ fontSize: '12px' }}>
                                <td colSpan={headers.length - 1} className='text-end'>Total Delivery Cash</td>
                                <td className='text-end'>{common.printDecimal(statusData?.customerAccountStatements?.reduce((sum, ele) => {
                                    if (ele.paymentMode?.toLowerCase() === 'cash' && ele.reason?.toLowerCase() === 'paymentreceived')
                                        return sum + ele.credit;
                                    else
                                        return sum;
                                }, 0))}</td>
                            </tr>
                            <tr style={{ fontSize: '12px' }}>
                                <td colSpan={headers.length - 1} className='text-end'>Total Delivery VISA</td>
                                <td className='text-end'>{common.printDecimal(statusData?.customerAccountStatements?.reduce((sum, ele) => {
                                    if (ele.paymentMode?.toLowerCase() === 'visa' && ele.reason?.toLowerCase() === 'paymentreceived')
                                        return sum + ele.credit;
                                    else
                                        return sum;
                                }, 0))}</td>
                            </tr>
                            <tr style={{ fontSize: '12px' }}>
                                <td colSpan={headers.length - 1} className='text-end'>Total Net Sale Amount</td>
                                <td className='text-end'>
                                    {
                                        common.printDecimal(getTotalSalesAmount())
                                    }
                                </td>
                            </tr>
                            <tr style={{ fontSize: '12px' }}>
                                <td colSpan={headers.length - 1} className='text-end'>Total Vat Tax {VAT}%</td>
                                <td className='text-end'>
                                    {
                                        common.printDecimal(getTotalSalesAmount() - common.calculatePercent(getTotalSalesAmount(), 95))
                                    }
                                </td>
                            </tr>
                            <tr style={{ fontSize: '12px' }}>
                                <td colSpan={headers.length - 1} className='text-end'>Total Expenses</td>
                                <td className='text-end'>
                                    {
                                        common.printDecimal(statusData.expenseAmount)
                                    }
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    )
})
