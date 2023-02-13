import React from 'react'
import { common } from '../../../../utils/common';
import InvoiceHead from '../../../common/InvoiceHead'

export const PrintDailyStatusReport = React.forwardRef((props, ref) => {
    if (props == undefined || props.props === undefined)
        return;
    let statusData = props.props;
    const VAT = parseFloat(process.env.REACT_APP_VAT);
    const getTotalSalesAmount = () => {
        return statusData?.orders?.reduce((sum, ele) => {
            return sum + ele.advanceAmount;
        }, 0)
            +
            statusData?.customerAccountStatements?.reduce((sum, ele) => {
                if (ele.reason?.toLowerCase() === 'paymentreceived')
                    return sum + ele.credit;
                else
                    return sum;
            }, 0)
    }
    const headers = ["Sr.", "Order No.", "Amount", "Paid Amount", "Balance", "Payment Mode","Paid For"];
    return (
        <div ref={ref} className="p-3">
            <InvoiceHead receiptType='Daily Status Report'></InvoiceHead>
            <div className='card'>
                <div className='card-body'>
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
                                        <td className='text-center' style={{ padding: '5px' }}>{common.printDecimal(res.order.totalAmount)}</td>
                                        <td className='text-center' style={{ padding: '5px' }}>{common.printDecimal(res.credit)}</td>
                                        <td className='text-center' style={{ padding: '5px' }}>{common.printDecimal(res.balance)}</td>
                                        <td className='text-center' style={{ padding: '5px' }}>{res.paymentMode}</td>
                                        <td className='text-center' style={{ padding: '5px' }}>{res?.reason?.toLowerCase()==="advancedpaid" ?"Advance":"Delivery"}</td>
                                    </tr>
                                })}
                            <tr style={{ fontSize: '12px' }}>
                                <td colSpan={headers.length-1}>Total Booking Amount</td>
                                <td className='text-end'>{common.printDecimal(statusData?.orders?.reduce((sum, ele) => {
                                    return sum + ele.totalAmount;
                                }, 0))}</td>
                            </tr>
                            <tr style={{ fontSize: '12px' }}>
                                <td colSpan={headers.length-1}>Total Booking Advance Cash</td>
                                <td className='text-end'>{common.printDecimal(statusData?.orders?.reduce((sum, ele) => {
                                    if (ele.paymentMode?.toLowerCase() === 'cash')
                                        return sum + ele.advanceAmount;
                                    else
                                        return sum;
                                }, 0))}</td>
                            </tr>
                            <tr style={{ fontSize: '12px' }}>
                                <td colSpan={headers.length-1}>Total Booking Advance VISA</td>
                                <td className='text-end'>{common.printDecimal(statusData?.orders?.reduce((sum, ele) => {
                                    if (ele.paymentMode?.toLowerCase() === 'visa')
                                        return sum + ele.advanceAmount;
                                    else
                                        return sum;
                                }, 0))}</td>
                            </tr>
                            <tr style={{ fontSize: '12px' }}>
                                <td colSpan={headers.length-1}>Total Delivery Cash</td>
                                <td className='text-end'>{common.printDecimal(statusData?.customerAccountStatements?.reduce((sum, ele) => {
                                    if (ele.paymentMode?.toLowerCase() === 'cash' && ele.reason?.toLowerCase() === 'paymentreceived')
                                        return sum + ele.credit;
                                    else
                                        return sum;
                                }, 0))}</td>
                            </tr>
                            <tr style={{ fontSize: '12px' }}>
                                <td colSpan={headers.length-1}>Total Delivery VISA</td>
                                <td className='text-end'>{common.printDecimal(statusData?.customerAccountStatements?.reduce((sum, ele) => {
                                    if (ele.paymentMode?.toLowerCase() === 'visa' && ele.reason?.toLowerCase() === 'paymentreceived')
                                        return sum + ele.credit;
                                    else
                                        return sum;
                                }, 0))}</td>
                            </tr>
                            <tr style={{ fontSize: '12px' }}>
                                <td colSpan={headers.length-1}>Total Net Sale Amount</td>
                                <td className='text-end'>
                                    {
                                        common.printDecimal(getTotalSalesAmount())
                                    }
                                </td>
                            </tr>
                            <tr style={{ fontSize: '12px' }}>
                                <td colSpan={headers.length-1}>Total Vat Tax {VAT}%</td>
                                <td className='text-end'>
                                    {
                                        common.printDecimal(getTotalSalesAmount() - common.calculatePercent(getTotalSalesAmount(), 95))
                                    }
                                </td>
                            </tr>
                            <tr style={{ fontSize: '12px' }}>
                                <td colSpan={headers.length-1}>Total Expenses</td>
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
