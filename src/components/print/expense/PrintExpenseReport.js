import React from 'react'
import { common } from '../../../utils/common';
import InvoiceHead from '../../common/InvoiceHead'

export const PrintExpenseReport = React.forwardRef((props, ref) => {
    let data = [];
    if (props.props.data === undefined)
        return;
    Object.keys(props.props.data).forEach(ele => {
        data.push(props.props.data[ele]);
    })
    return (
        <div className='card' ref={ref}>
            <div className='card-body'>
                <div style={{ padding: '10px' }} className="row">
                    <div className="col col-lg-12 mx-auto">
                        <div className="card border shadow-none"></div>
                        <InvoiceHead receiptType='Expense Report for All'></InvoiceHead>
                        <hr />
                        <div className='text-center'>Report From {common.getHtmlDate(props.props.filter.fromDate)} to {common.getHtmlDate(props.props.filter.toDate)}</div>
                        <table className='table table-border'>
                            <thead>
                                <tr>
                                    <th>Sr.No.</th>
                                    <th>Voucher No.</th>
                                    <th>Name</th>
                                    <th>Description</th>
                                    <th>V Date</th>
                                    <th>Amount</th>
                                </tr>
                            </thead>
                            <tbody>
                                {
                                    data?.map((ele, index) => {
                                        return <tr key={index}>
                                            <td>{index + 1}</td>
                                            <td>{ele?.expenseNo}</td>
                                            <td>{ele?.name}</td>
                                            <td>{ele?.description}</td>
                                            <td>{common.getHtmlDate(ele?.expenseDate)}</td>
                                            <td className='text-end'>{common.printDecimal(ele?.amount)}</td>
                                        </tr>
                                    })
                                }
                                <tr>
                                    <td colSpan={4}></td>
                                    <td className='fw-bold fs-5'>Total</td>
                                    <td className='fw-bold text-end fs-5'>{common.printDecimal(data.reduce((sum,ele)=>sum+ele.amount,0))}</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    )
})
