import React from 'react'
import { common } from '../../utils/common';

export default function CancelTaxTable({ billingData }) {
    const VAT = parseFloat(process.env.REACT_APP_VAT);
    const calculateSum = () => {
        return {
            returnAmount: billingData.reduce((sum, ele) => { return sum + ele?.credit }, 0),
            qty: billingData.reduce((sum, ele) => { return sum + ele?.qty }, 0),
            returnVat: billingData.reduce((sum, ele) => { return sum + ((ele?.credit / (100 + VAT)) * VAT) }, 0)
        }
    }
    return (
        <div className="table-responsive">
            <table className='table table-bordered table-striped fixTableHead' style={{ fontSize: '12px' }}>
                <thead>
                    <tr>
                        <th className='text-center'>Sr.</th>
                        <th className='text-center'>Invoice Number</th>
                        <th className='text-center'>Payment Date</th>
                        <th className='text-center'>Cancel Date</th>
                        <th className='text-center'>Order No.</th>
                        <th className='text-center'>Qty</th>
                        <th className='text-center'>Return Amount</th>
                        <th className='text-center'>Return Vat {VAT}%</th>
                    </tr>
                </thead>
                <tbody>
                    {billingData?.length === 0 && <tr>
                        <td className='text-center text-danger' colSpan={6}> No Data Found</td>
                    </tr>
                    }
                    {billingData?.map((res, index) => {
                        return <> <tr style={{ fontSize: '12px' }}>
                            <td className='text-center' style={{ padding: '5px' }}>{index + 1}</td>
                            <td className='text-center' style={{ padding: '5px' }}>{res?.taxInvoiceNumber}</td>
                            <td className='text-center' style={{ padding: '5px' }}>{common.getHtmlDate(res?.paymentDate, 'ddmmyyyy')}</td>
                            <td className='text-center' style={{ padding: '5px' }}>{res?.cancelDate === "0001-01-01T00:00:00" ? common.getHtmlDate(res?.paymentDate, 'ddmmyyyy') : common.getHtmlDate(res?.cancelDate, 'ddmmyyyy')}</td>
                            <td className='text-center' style={{ padding: '5px' }}>{res?.orderNo}</td>
                            <td className='text-center' style={{ padding: '5px' }}>{res?.qty}</td>
                            <td className='text-end' style={{ padding: '5px' }}>{common.printDecimal(res?.credit)}</td>
                            <td className='text-end' style={{ padding: '5px' }}>{common.printDecimal(((res?.credit ?? 0) / (100 + VAT)) * VAT)}</td>
                        </tr>
                        </>
                    })}
                </tbody>
                <tfoot>
                    <tr style={{ fontWeight: 'bold', fontSize: '13px' }}>
                        <td colSpan={5} className='text-end'>Total</td>
                        <td className='text-center'>{calculateSum().qty}</td>
                        <td className='text-end'>{common.printDecimal(calculateSum().returnAmount)}</td>
                        <td className='text-end'>{common.printDecimal(calculateSum().returnVat)}</td>
                    </tr>
                </tfoot>
            </table>
        </div>
    )
}

