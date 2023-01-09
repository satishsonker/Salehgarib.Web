import React from 'react'
import { common } from '../../../../utils/common'
import InvoiceHead from '../../../common/InvoiceHead'

export default function PrintAdvanceCashVisaReport({data,filterData,printRef}) {
    const VAT = parseFloat(process.env.REACT_APP_VAT);
    const grandTotal = data?.reduce((sum, ele) => {
        return sum += ele.order.totalAmount
    }, 0);
    const grandAdvance= data?.reduce((sum, ele) => {
        return sum += ele.credit
    }, 0);
  return (
    <>
      <div className='card' ref={printRef}>
        <div className='card-body'>
            <InvoiceHead receiptType={filterData.paymentType+' '+filterData.paymentMode+" Report"}/>
            <hr/>
            <div className='row'>
                <div className='col-12 text-center fw-bold my-2'>
                    Report Date : {common.getHtmlDate(filterData.fromDate,'ddmmyyyy')} To {common.getHtmlDate(filterData.toDate,'ddmmyyyy')}
                </div>
                <div className='col-12'>
                <table className='table table-bordered' style={{ fontSize: '11px' }}>
                        <thead>
                            <tr>
                                <th className='text-center'>Sr.</th>
                                <th className='text-center'>C. Name</th>
                                <th className='text-center'>Contact</th>
                                <th className='text-center'>Or. No</th>
                                <th className='text-center'>Qty</th>
                                <th className='text-center'>Or. Date</th>
                                <th className='text-center'>Or. Amount</th>
                                <th className='text-center'>{filterData.paymentType}</th>
                                <th className='text-center'>Bal</th>
                                <th className='text-center'>Delivery on</th>
                                <th className='text-center'>Paid %</th>
                                <th className='text-center'>Paid By</th>
                            </tr>
                        </thead>
                        <tbody>
                            {
                                data?.map((ele, index) => {
                                    return <tr key={index}>
                                        <td className='text-center'>{index + 1}</td>
                                        <td className='text-start text-uppercase'>{ele.order?.customerName}</td>
                                        <td className='text-start text-uppercase'>{ele.order?.contact1}</td>
                                        <td className='text-center'>{ele.order?.orderNo}</td>
                                        <td className='text-center'>{ele.order?.qty}</td>
                                        <td className='text-center'>{common.getHtmlDate(ele.order?.orderDate, 'ddmmyyyy')}</td>
                                        <td className='text-center'>{common.printDecimal(ele.order.totalAmount)}</td>
                                        <td className='text-end'>{common.printDecimal(ele.credit)}</td>
                                        <td className='text-end'>{common.printDecimal(ele.order.balanceAmount)}</td>
                                        <td className='text-end'>{common.getHtmlDate(ele.order.orderDeliveryDate, 'ddmmyyyy')}</td>
                                        <td className='text-end'>{common.printDecimal((ele.credit / ele.order.totalAmount) * 100)}%</td>
                                        <td className='text-uppercase text-center'>{ele.paymentMode}</td>
                                    </tr>
                                })
                            }
                        </tbody>
                        <tfoot>
                            <tr>
                                <td className='text-end fw-bold' colSpan={6}>Total</td>
                                <td className='text-end fw-bold'>{common.printDecimal(grandTotal)}</td>
                                <td className='text-end fw-bold'>{common.printDecimal(grandAdvance)}</td>
                                <td className='text-end fw-bold'>{common.printDecimal(data?.reduce((sum, ele) => {
                                    return sum += ele.order.balanceAmount
                                }, 0))}</td>
                                <td colSpan={2} className='text-end fw-bold'>Received Payment : {common.printDecimal((grandAdvance/grandTotal)*100)}%</td>
                            </tr>
                        </tfoot>
                    </table>
                </div>
            </div>
        </div>
      </div>
    </>
  )
}
