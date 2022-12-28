import React from 'react'
import { common } from '../../utils/common';

export default function CancelTaxTable({billingData}) { 
    const VAT = parseInt(process.env.REACT_APP_VAT);
    const calculateSum = (date) => {
        var data = billingData?.filter(x => common.getHtmlDate(x.paymentDate) === common.getHtmlDate(date));
        return {
            returnAmount: data.reduce((sum, ele) => { return sum + ele.order.advanceAmount }, 0),
            qty: data.reduce((sum, ele) => { return sum + ele.order.qty }, 0),
            returnVat: data.reduce((sum, ele) => { return sum + common.calculatePercent(ele.order.advanceAmount,VAT) }, 0)
        }
    }
  return (
    <table className='table table-bordered table-striped' style={{fontSize:'12px'}}>
    <thead>
        <tr>
            <th className='text-center'>Sr.</th>
            <th className='text-center'>Date</th>
            <th className='text-center'>Order No.</th>
            <th className='text-center'>Qty</th>
            <th className='text-center'>Return Amount</th>
            <th className='text-center'>Return Vat {VAT}%</th>
        </tr>
    </thead>
    <tbody>
        {billingData?.length > 0 && <tr>
            <td className='text-center' colSpan={6}> Date : {common.getHtmlDate(billingData[0]?.paymentDate)}</td>
        </tr>
        }
        {billingData?.length === 0 && <tr>
            <td className='text-center text-danger' colSpan={6}> No Data Found</td>
        </tr>
        }
        {billingData?.map((res, index) => {
            return <> <tr style={{ fontSize: '12px' }}>
                <td className='text-center' style={{ padding: '5px' }}>{index + 1}</td>
                <td className='text-center' style={{ padding: '5px' }}>{common.getHtmlDate(res.paymentDate)}</td>
                <td className='text-center' style={{ padding: '5px' }}>{res.order.orderNo}</td>
                <td className='text-center' style={{ padding: '5px' }}>{res.order.qty}</td>
                <td className='text-center' style={{ padding: '5px' }}>{common.printDecimal(res.order.advanceAmount)}</td>
                <td className='text-center' style={{ padding: '5px' }}>{common.printDecimal(common.calculatePercent(res.order.advanceAmount,VAT))}</td>
            </tr>
                {common.getHtmlDate(res.paymentDate) !== common.getHtmlDate(billingData[index + 1]?.paymentDate) && common.getHtmlDate(billingData[index + 1]?.paymentDate) !== 'NaN-NaN-NaN' &&
                    <>
                        <tr>
                            <td colSpan={3}>Total on : {common.getHtmlDate(res.paymentDate)}</td>
                            <td className='text-center'>{common.printDecimal(calculateSum(res.paymentDate).qty)}</td>
                            <td className='text-center'>{common.printDecimal(calculateSum(res.paymentDate).returnAmount)}</td>
                            <td className='text-center'>{common.printDecimal(calculateSum(res.paymentDate).returnVat)}</td>
                        </tr>
                        <tr><td colSpan={6}>.</td></tr>
                        <tr>
                            <td className='text-center fw-bold fs-6' colSpan={6}> Date : {common.getHtmlDate(billingData[index + 1]?.paymentDate)}</td>
                        </tr>
                        <tr>
                            <td className='text-center fw-bold'>Sr.</td>
                            <td className='text-center fw-bold'>Date</td>
                            <td className='text-center fw-bold'>Order No.</td>
                            <td className='text-center fw-bold'>Qty</td>
                            <td className='text-center fw-bold'>Return Amount</td>
                            <td className='text-center fw-bold'>Return Vat {VAT}%</td>
                        </tr>
                    </>
                }
            </>
        })}
    </tbody>
</table>
  )
}

