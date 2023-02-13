import React from 'react'
import { common } from '../../../../utils/common'
import InvoiceHead from '../../../common/InvoiceHead'

export default function PrintAdvanceCashVisaReport({ data, filterData, printRef }) {
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
                                        <th className='text-center'>Paid By</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {
                                        data?.map((ele, index) => {
                                            return <tr key={index}>
                                                <td className='text-center'>{index + 1}</td>
                                                <td className='text-center'>{ele.order?.orderNo}</td>
                                                <td className='text-center'>{ele.order?.qty}</td>
                                                <td className='text-center'>{common.getHtmlDate(ele.order?.orderDate, 'ddmmyyyy')}</td>
                                                <td className='text-center'>{common.printDecimal(ele.order.totalAmount)}</td>
                                                <td className='text-end'>{common.printDecimal(ele.credit)}</td>
                                                <td className='text-end'>{common.printDecimal(ele.order.balanceAmount)}</td>
                                                <td className='text-end'>{common.getHtmlDate(ele.order.orderDeliveryDate, 'ddmmyyyy')}</td>
                                                <td className='text-uppercase text-center'>{ele.paymentMode}</td>
                                            </tr>
                                        })
                                    }
                                </tbody>
                            </table>
                        </div>
                        <div className="d-flex justify-content-end col-12 mt-2">
                            <ul className="list-group" style={{width:'300px'}}>
                                <li className="list-group-item d-flex justify-content-between align-items-center pr-0">
                                    Total Booking Qty
                                    <span className="badge badge-primary" style={{color:'black'}}>{data?.reduce((sum, ele) => {
                                        return sum += ele?.order?.qty;
                                    }, 0)}</span>
                                </li>
                                <li className="list-group-item d-flex justify-content-between align-items-center">
                                    Total Booking Amount
                                    <span className="badge badge-primary" style={{color:'black'}}>{common.printDecimal(data?.reduce((sum, ele) => {
                                        return sum += ele?.order?.totalAmount;
                                    }, 0))}</span>
                                </li>
                                <li className="list-group-item d-flex justify-content-between align-items-center">
                                    Total Advance Cash
                                    <span className="badge badge-primary" style={{color:'black'}}>{common.printDecimal(data?.reduce((sum, ele) => {
                                        if (ele.paymentMode?.toLowerCase() == 'cash')
                                            return sum += ele?.credit;
                                        else
                                            return sum;
                                    }, 0))}</span>
                                </li>
                                <li className="list-group-item d-flex justify-content-between align-items-center">
                                    Total Advance VISA
                                    <span className="badge badge-primary" style={{color:'black'}}>{common.printDecimal(data?.reduce((sum, ele) => {
                                        if (ele.paymentMode?.toLowerCase() == 'visa')
                                            return sum += ele?.credit;
                                        else
                                            return sum;
                                    }, 0))}</span>
                                </li>
                                <li className="list-group-item d-flex justify-content-between align-items-center">
                                    Grand Total
                                    <span className="badge badge-primary" style={{color:'black'}}>{common.printDecimal(data?.reduce((sum, ele) => {
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
