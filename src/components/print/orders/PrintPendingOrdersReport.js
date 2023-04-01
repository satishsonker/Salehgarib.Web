import React from 'react'
import { common } from '../../../utils/common'
import InvoiceHead from '../../common/InvoiceHead'

export default function PrintPendingOrdersReport({printRef,data,filterData}) {
    const VAT = parseFloat(process.env.REACT_APP_VAT);
    const grandTotal = data?.reduce((sum, ele) => {
        return sum += ele.totalAmount
    }, 0);
    const grandAdvance= data?.reduce((sum, ele) => {
        return sum += ele.advanceAmount
    }, 0);
    const grandQty= data?.reduce((sum, ele) => {
        return sum += parseInt(ele.qty.toString().split(" Of ")[0])
    }, 0);
    const grandTotalQty= data?.reduce((sum, ele) => {
        return sum += parseInt(ele.qty.toString().split(" Of ")[1])
    }, 0);
    const tdPadding={
        padding:'2px',
        width:'max-content'
    }
  return (
    <>
      <div className='card' ref={printRef}>
        <div className='card-body'>
            <InvoiceHead receiptType={"Pending Report"}/>
            <hr/>
            <div className='row'>
                <div className='col-12 text-center fw-bold my-2'>
                    Report Date : {common.getHtmlDate(filterData?.fromDate,'ddmmyyyy')} To {common.getHtmlDate(filterData?.toDate,'ddmmyyyy')}
                </div>
                <div className='col-12'>
                <table className='table table-bordered fixTableHead' style={{ fontSize: '11px' }}>
                        <thead>
                            <tr>
                                <th style={{padding:'0.5rem 2px'}} className='text-center'>Sr.</th>
                                <th style={{padding:'0.5rem 2px'}} className='text-center'>C. Name</th>
                                <th style={{padding:'0.5rem 2px'}} className='text-center'>Contact</th>
                                <th style={{padding:'0.5rem 2px'}} className='text-center'>Or. No</th>
                                <th style={{padding:'0.5rem 2px'}} className='text-center'>Qty</th>
                                <th style={{padding:'0.5rem 2px'}} className='text-center'>DEL. Date</th>
                                <th style={{padding:'0.5rem 2px'}} className='text-center'>Or. Amount</th>
                                <th style={{padding:'0.5rem 2px'}} className='text-center'>Advance</th>
                                <th style={{padding:'0.5rem 2px'}} className='text-center'>Bal</th>
                                {/* style={{padding:'0.5rem 2px'}} <th className='text-center'>Delivery on</th> */}
                                <th style={{padding:'0.5rem 2px'}} className='text-center'>Paid %</th>
                                {/* style={{padding:'0.5rem 2px'}} <th className='text-center'>Paid By</th> */}
                            </tr>
                        </thead>
                        <tbody>
                            {
                                data?.map((ele, index) => {
                                    return <tr key={index}>
                                        <td style={tdPadding} className='text-center'>{index + 1}</td>
                                        <td style={tdPadding} className='text-start text-uppercase'>{ele.customerName}</td>
                                        <td style={tdPadding} className='text-start text-uppercase'>{ele.contact1}</td>
                                        <td style={tdPadding} className='text-center'>{ele.orderNo}</td>
                                        <td style={tdPadding} className='text-center'>{ele.qty}</td>
                                        <td style={tdPadding} className='text-center'>{common.getHtmlDate(ele.orderDeliveryDate, 'ddmmyyyy')}</td>
                                        <td style={tdPadding} className='text-end'>{common.printDecimal(ele.totalAmount)}</td>
                                        <td style={tdPadding} className='text-end'>{common.printDecimal(ele?.advanceAmount)}</td>
                                        <td style={tdPadding} className='text-end'>{common.printDecimal(ele.balanceAmount)}</td>
                                        {/* style={tdPadding} <td className='text-end'>{common.getHtmlDate(ele.orderDeliveryDate, 'ddmmyyyy')}</td> */}
                                        <td style={tdPadding} className='text-end'>{common.printDecimal(((ele.totalAmount-ele?.balanceAmount) / ele?.totalAmount) * 100)}%</td>
                                        {/* style={tdPadding} <td className='text-uppercase text-center'>{ele.paymentMode}</td> */}
                                    </tr>
                                })
                            }
                        </tbody>
                        <tfoot>
                            <tr>
                                <td className='text-end fw-bold' colSpan={4}>Total</td>
                                <td className='text-center fw-bold'>{grandQty}</td>
                                <td className='text-end fw-bold'></td>
                                <td className='text-end fw-bold'>{common.printDecimal(grandTotal)}</td>
                                <td className='text-end fw-bold'>{common.printDecimal(grandAdvance)}</td>
                                <td className='text-end fw-bold'>{common.printDecimal(data?.reduce((sum, ele) => {
                                    return sum += ele?.balanceAmount
                                }, 0))}</td>
                                <td colSpan={2} className='text-end fw-bold'>{common.printDecimal((grandAdvance/grandTotal)*100)}%</td>
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
