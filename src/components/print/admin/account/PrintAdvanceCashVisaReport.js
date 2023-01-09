import React from 'react'
import { common } from '../../../../utils/common'
import InvoiceHead from '../../../common/InvoiceHead'

export default function PrintAdvanceCashVisaReport({data,filterData,printRef}) {
    const VAT = parseFloat(process.env.REACT_APP_VAT);
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
                <table className='table table-bordered' style={{ fontSize: '12px' }}>
                        <thead>
                            <tr>
                                <th className='text-center'>Sr.</th>
                                <th className='text-center'>Order No</th>
                                <th className='text-center'>Payment Date</th>
                                <th className='text-center'>{filterData.paymentType} Amount</th>
                                <th className='text-center'>Vat {VAT}%</th>
                                <th className='text-center'>Total Amount</th>
                                <th className='text-center'>Payment Mode</th>
                            </tr>
                        </thead>
                        <tbody>
                            {
                                data?.map((ele, index) => {
                                    return <tr key={index}>
                                        <td className='text-center'>{index + 1}</td>
                                        <td className='text-center'>{ele.order?.orderNo}</td>
                                        <td className='text-center'>{common.getHtmlDate(ele.paymentDate, 'ddmmyyyy')}</td>
                                        <td className='text-end'>{common.printDecimal(common.calculatePercent(ele.credit, 95))}</td>
                                        <td className='text-end'>{common.printDecimal(common.calculatePercent(ele.credit, 5))}</td>
                                        <td className='text-end'>{common.printDecimal(ele.credit)}</td>
                                        <td className='text-uppercase text-center'>{ele.paymentMode}</td>
                                    </tr>
                                })
                            }
                        </tbody>
                        <tfoot>
                            <tr>
                                <td className='text-end fw-bold' colSpan={3}>Total</td>
                                <td className='text-end fw-bold'>{common.printDecimal(data?.reduce((sum, ele) => {
                                    return sum += common.calculatePercent(ele.credit, 95)
                                }, 0))}</td>
                                <td className='text-end fw-bold'>{common.printDecimal(data?.reduce((sum, ele) => {
                                    return sum += common.calculatePercent(ele.credit, 5)
                                }, 0))}</td>
                                <td className='text-end fw-bold'>{common.printDecimal(data?.reduce((sum, ele) => {
                                    return sum += ele.credit
                                }, 0))}</td>
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
