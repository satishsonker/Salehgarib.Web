import React from 'react'
import { common } from '../../../../utils/common';
import InvoiceHead from '../../../common/InvoiceHead'

export const PrintDailyStatusReport = React.forwardRef((props, ref) => {
    if (props == undefined || props.props === undefined)
        return;
    let statusData = props.props;
    const VAT = parseFloat(process.env.REACT_APP_VAT);
    const getTotalSalesAmount=()=>{
        return    statusData?.orders?.reduce((sum, ele) => {
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
    return (
        <div ref={ref} className="p-3">
        <InvoiceHead receiptType='Daily Status Report'></InvoiceHead>
        <div className='card'>
            <div className='card-body'>
                <table className='table table-bordered table-striped'>
                    <thead>
                        <tr>
                            <th className='text-center'>Sr.</th>
                            <th className='text-center'>Order No.</th>
                            <th className='text-center'>Amount</th>
                            <th className='text-center'>Advance</th>
                            <th className='text-center'>Vat Tax</th>
                            <th className='text-center'>Balance</th>
                            <th className='text-center'>Payment Mode</th>
                        </tr>
                    </thead>
                    <tbody>
                        {statusData?.orders?.map((res, index) => {
                            return <tr style={{ fontSize: '12px' }}>
                                <td className='text-center' style={{ padding: '5px' }}>{index + 1}</td>
                                <td className='text-center' style={{ padding: '5px' }}>{res.orderNo}</td>
                                <td className='text-center' style={{ padding: '5px' }}>{common.printDecimal(res.totalAmount)}</td>
                                <td className='text-center' style={{ padding: '5px' }}>{common.printDecimal(res.advanceAmount)}</td>
                                <td className='text-center' style={{ padding: '5px' }}>{common.printDecimal(common.calculateVAT(res.advanceAmount, VAT).vatAmount)}</td>
                                <td className='text-center' style={{ padding: '5px' }}>{common.printDecimal(res.balanceAmount)}</td>
                                <td className='text-center' style={{ padding: '5px' }}>{res.paymentMode}</td>
                            </tr>
                        })}
                        <tr style={{ fontSize: '12px' }}>
                            <td colSpan={6}>Total Booking Amount</td>
                            <td className='text-end'>{common.printDecimal(statusData?.orders?.reduce((sum, ele) => {
                                return sum + ele.totalAmount;
                            }, 0))}</td>
                        </tr>
                        <tr style={{ fontSize: '12px' }}>
                            <td colSpan={6}>Total Booking Advance Cash</td>
                            <td className='text-end'>{common.printDecimal(statusData?.orders?.reduce((sum, ele) => {
                                if (ele.paymentMode?.toLowerCase() === 'cash')
                                    return sum + ele.advanceAmount;
                                else
                                    return sum;
                            }, 0))}</td>
                        </tr>
                        <tr style={{ fontSize: '12px' }}>
                            <td colSpan={6}>Total Booking Advance VISA</td>
                            <td className='text-end'>{common.printDecimal(statusData?.orders?.reduce((sum, ele) => {
                                if (ele.paymentMode?.toLowerCase() === 'visa')
                                    return sum + ele.advanceAmount;
                                else
                                    return sum;
                            }, 0))}</td>
                        </tr>
                        <tr style={{ fontSize: '12px' }}>
                            <td colSpan={6}>Total Delivery Cash</td>
                            <td className='text-end'>{common.printDecimal(statusData?.customerAccountStatements?.reduce((sum, ele) => {
                                if (ele.paymentMode?.toLowerCase() === 'cash' && ele.reason?.toLowerCase() === 'paymentreceived')
                                    return sum + ele.credit;
                                else
                                    return sum;
                            }, 0))}</td>
                        </tr>
                        <tr style={{ fontSize: '12px' }}>
                            <td colSpan={6}>Total Delivery VISA</td>
                            <td className='text-end'>{common.printDecimal(statusData?.customerAccountStatements?.reduce((sum, ele) => {
                                if (ele.paymentMode?.toLowerCase() === 'visa' && ele.reason?.toLowerCase() === 'paymentreceived')
                                    return sum + ele.credit;
                                else
                                    return sum;
                            }, 0))}</td>
                        </tr>
                        <tr style={{ fontSize: '12px' }}>
                            <td colSpan={6}>Total Net Sale Amount</td>
                            <td className='text-end'>
                                {
                                    common.printDecimal(getTotalSalesAmount())
                                }
                            </td>
                        </tr>
                        <tr style={{ fontSize: '12px' }}>
                            <td colSpan={6}>Total Vat Tax {VAT}%</td>
                            <td className='text-end'>
                                {
                                    common.printDecimal(getTotalSalesAmount() - common.calculatePercent(getTotalSalesAmount(), 95))
                                }
                            </td>
                        </tr>
                        <tr style={{ fontSize: '12px' }}>
                            <td colSpan={6}>Total Expenses</td>
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
