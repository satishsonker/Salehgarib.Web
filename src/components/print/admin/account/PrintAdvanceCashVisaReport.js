import React from 'react'
import { common } from '../../../../utils/common'
import InvoiceHead from '../../../common/InvoiceHead'

export default function PrintAdvanceCashVisaReport({ data, filterData, printRef, paymentModeList, duplicateCounts, uniqueQty, uniqueBookingSum }) {
    const VAT = parseFloat(process.env.REACT_APP_VAT);
    const grandTotal = data?.reduce((sum, ele) => {
        return sum += ele.order.totalAmount
    }, 0);
    const grandAdvance = data?.reduce((sum, ele) => {
        return sum += ele.credit
    }, 0);
    return (
        <>
            <div className='card' ref={printRef}>
                <div className='card-body'>
                    <InvoiceHead receiptType={filterData.paymentType + ' ' + filterData.paymentMode + " Report"} />
                    <hr />
                    <div className='row'>
                        <div className='col-12 text-center fw-bold my-2'>
                            Report Date : {common.getHtmlDate(filterData.fromDate, 'ddmmyyyy')} To {common.getHtmlDate(filterData.toDate, 'ddmmyyyy')}
                        </div>
                        <div className='col-12'>
                            <table className='table table-bordered' style={{ fontSize: '11px' }}>
                                <thead>
                                    <tr>
                                        <th className='text-center'>Sr.</th>
                                        <th className='text-center'>Order. No</th>
                                        <th className='text-center'>Qty</th>
                                        <th className='text-center'>Order. Date</th>
                                        <th className='text-center'>Order. Amount</th>
                                        <th className='text-center'>{filterData.paymentType}</th>
                                        <th className='text-center'>Balance</th>
                                        <th className='text-center'>Delivery on</th>
                                        <th className='text-center'>Paid Mode</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {
                                        data?.map((ele, index) => {
                                            const rowSpan = duplicateCounts[ele.order?.orderNo].count || 1;
                                            const balance = duplicateCounts[ele.order?.orderNo].balance || 0;
                                            const isFirstOccurrence =
                                                index === data.findIndex(o => o.order?.orderNo === ele.order?.orderNo);
                                            return <tr key={index}>
                                                <td className='text-center'>{index + 1}</td>
                                                {isFirstOccurrence && (
                                                    <>
                                                        <td className='text-center' rowSpan={rowSpan}>{ele.order?.orderNo}</td>
                                                        <td className='text-center' rowSpan={rowSpan}>{filterData.paymentType === "Delivery" ? ele.deliveredQty : ele.order?.qty}</td>
                                                        <td className='text-center' rowSpan={rowSpan}>{common.getHtmlDate(ele.order?.orderDate, 'ddmmyyyy')}</td>
                                                        <td className='text-center' rowSpan={rowSpan}>{common.printDecimal(ele.order.totalAmount)}</td>
                                                    </>)
                                                }
                                                <td className='text-end'>{common.printDecimal(ele.credit)}</td>
                                                {isFirstOccurrence && (
                                                    <>
                                                        <td className='text-end' rowSpan={rowSpan}>{common.printDecimal(balance)}</td>
                                                    </>
                                                )}
                                                <td className='text-end'>{common.getHtmlDate(ele.order.orderDeliveryDate, 'ddmmyyyy')}</td>
                                                <td className='text-uppercase text-center'>{ele.paymentMode}</td>
                                            </tr>
                                        })
                                    }
                                </tbody>
                            </table>
                        </div>
                        <div className="d-flex justify-content-end col-12 mt-2">
                            <ul className="list-group" style={{ width: '300px' }}>
                                <li className="list-group-item d-flex justify-content-between align-items-center pr-0">
                                    Total {filterData.paymentType === "Delivery" ? "Delivered " : "Booking "} Qty
                                    <span className="badge badge-primary" style={{ color: 'black' }}>{uniqueQty}</span>
                                </li>
                                <li className="list-group-item d-flex justify-content-between align-items-center">
                                    Total Booking Amount
                                    <span className="badge badge-primary" style={{ color: 'black' }}>{common.printDecimal(uniqueBookingSum)}</span>
                                </li>
                                {
                                    filterData.paymentMode === "All" &&
                                    paymentModeList.map((payEle, index) => {
                                        const color = common.colors[index % common.colors.length];
                                        return <li key={index} className="list-group-item d-flex justify-content-between align-items-center">
                                            <div className='text-end'>
                                                Total Advance {""}
                                                <span style={{ color }}> {payEle.value}</span>
                                            </div>

                                            <span className="badge badge-primary" style={{ color: 'black' }}>{common.printDecimal(data?.reduce((sum, ele) => {
                                                if (ele?.paymentMode?.toLowerCase() === payEle.value?.toLowerCase())
                                                    return sum += ele?.credit;
                                                else
                                                    return sum;
                                            }, 0))}</span>
                                        </li>
                                    })

                                }
                                {
                                    filterData.paymentMode !== "All" &&
                                    (
                                        <li className="list-group-item d-flex justify-content-between align-items-center">
                                            <div className='text-end'>
                                                Total Advance {""}
                                                <span style={{ color: 'black' }}> {filterData.paymentMode}</span>
                                            </div>

                                            <span className="badge badge-primary" style={{ color: 'black' }}>{common.printDecimal(data?.reduce((sum, ele) => {
                                                if (ele?.paymentMode?.toLowerCase() === filterData.paymentMode?.toLowerCase())
                                                    return sum += ele?.credit;
                                                else
                                                    return sum;
                                            }, 0))}</span>
                                        </li>
                                    )

                                }
                                <li className="list-group-item d-flex justify-content-between align-items-center">
                                    Grand Total
                                    <span className="badge badge-primary" style={{ color: 'black' }}>{common.printDecimal(data?.reduce((sum, ele) => {
                                        return sum += ele?.credit;
                                    }, 0))}</span>
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}
