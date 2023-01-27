import React from 'react'
import { common } from '../../utils/common'

export default function BillingTaxTable({ billingData }) {
    const VAT = parseFloat(process.env.REACT_APP_VAT);
    const calculateSum = (date) => {
        var data = billingData?.filter(x => common.getHtmlDate(x.paymentDate) === common.getHtmlDate(date));
        return {
            paidAmount: data.reduce((sum, ele) => { return sum + ele.credit }, 0),
            totalAmount: data?.reduce((sum, ele) => { return sum + ele?.order.totalAmount }, 0),
            qty: data.reduce((sum, ele) => { return sum + ele.order.qty }, 0),
            paidVat: data.reduce((sum, ele) => { return sum + common.calculatePercent(ele.credit, VAT) }, 0)
        }
    }
    return (
        <div className="table-responsive">
            <table className='table table-bordered table-striped fixTableHead' style={{ fontSize: '12px' }}>
                <thead>
                    <tr>
                        <th className='text-center'>Sr.</th>
                        <th className='text-center'>Date</th>
                        <th className='text-center'>Order No.</th>
                        <th className='text-center'>Qty</th>
                        <th className='text-center'>Total Amount</th>
                        <th className='text-center'>Paid Amount</th>
                        <th className='text-center'>Bal Amount</th>
                        <th className='text-center'>Total Vat</th>
                        <th className='text-center'>Paid Vat</th>
                        <th className='text-center'>Bal Vat</th>
                    </tr>
                </thead>
                <tbody>
                    {billingData?.length > 0 && <tr>
                        <td className='text-center' colSpan={10}> Date : {common.getHtmlDate(billingData[0]?.paymentDate, 'ddmmyyyy')}</td>
                    </tr>
                    }
                    {billingData?.length === 0 && <tr>
                        <td className='text-center text-danger' colSpan={10}> No Data Found</td>
                    </tr>
                    }
                    {billingData?.map((res, index) => {
                        return <> <tr style={{ fontSize: '12px' }}>
                            <td className='text-center' style={{ padding: '5px' }}>{index + 1}</td>
                            <td className='text-center' style={{ padding: '5px' }}>{common.getHtmlDate(res.paymentDate, 'ddmmyyyy')}</td>
                            <td className='text-center' style={{ padding: '5px' }}>{res.order.orderNo}</td>
                            <td className='text-center' style={{ padding: '5px' }}>{res.order.qty}</td>
                            <td className='text-center' style={{ padding: '5px' }}>{common.printDecimal(res.order.totalAmount)}</td>
                            <td className='text-center' style={{ padding: '5px' }}>{common.printDecimal(res.credit)}</td>
                            <td className='text-center' style={{ padding: '5px' }}>{common.printDecimal(res.order.totalAmount - res.credit)}</td>
                            <td className='text-center' style={{ padding: '5px' }}>{common.printDecimal(common.calculateVAT(res.order.subTotalAmount, VAT).vatAmount)}</td>
                            <td className='text-center' style={{ padding: '5px' }}>{common.printDecimal((res.credit / (100 + VAT)) * VAT)}</td>
                            <td className='text-center' style={{ padding: '5px' }}>{common.printDecimal(common.calculateVAT(res.order.subTotalAmount, VAT).vatAmount - (res.credit / (100 + VAT)) * VAT)}</td>
                        </tr>
                            {common.getHtmlDate(res.paymentDate) !== common.getHtmlDate(billingData[index + 1]?.paymentDate) &&
                                <>
                                    <tr>
                                        <td colSpan={3}>Total Amount on : {common.getHtmlDate(res.paymentDate, 'ddmmyyyy')}</td>
                                        <td className='text-center fw-bold'>{common.printDecimal(calculateSum(res.paymentDate).qty)}</td>
                                        <td  className='text-center fw-bold'>{common.printDecimal(calculateSum(res.paymentDate).totalAmount)}</td>
                                        <td className='text-center fw-bold'>{common.printDecimal(calculateSum(res.paymentDate).paidAmount)}</td>
                                        <td colSpan={2}></td>
                                        <td className='text-center fw-bold'>{common.printDecimal(calculateSum(res.paymentDate).paidVat)}</td>
                                        <td></td>
                                    </tr>
                                    <tr><td colSpan={10}>.</td></tr>
                                    {common.getHtmlDate(billingData[index + 1]?.paymentDate) !== 'NaN-NaN-NaN' && <> <tr>
                                        <td className='text-center fw-bold fs-6' colSpan={10}> Date : {common.getHtmlDate(billingData[index + 1]?.paymentDate, 'ddmmyyyy')}</td>
                                    </tr>
                                        <tr>
                                            <td className='text-center fw-bold'>Sr.</td>
                                            <td className='text-center fw-bold'>Date</td>
                                            <td className='text-center fw-bold'>Order No.</td>
                                            <td className='text-center fw-bold'>Qty</td>
                                            <td className='text-center fw-bold'>Total Amount</td>
                                            <td className='text-center fw-bold'>Paid Amount</td>
                                            <td className='text-center fw-bold'>Bal Amount</td>
                                            <td className='text-center fw-bold'>Total Vat</td>
                                            <td className='text-center fw-bold'>Paid Vat</td>
                                            <td className='text-center fw-bold'>Bal Vat</td>
                                        </tr>
                                    </>
                                    }
                                </>
                            }
                        </>
                    })}
                </tbody>
            </table>
        </div>
    )
}
