import React,{useEffect} from 'react'
import { common } from '../../../utils/common';
import InvoiceHead from '../../common/InvoiceHead'

export const PrintExpenseVoucher = React.forwardRef((props, ref) => {
    let data = props.props;
    console.log('Printed');    
    if (data === undefined)
        return;
    return (
        <div className='card' ref={ref}>
            <div className='card-body'>
                <div style={{ padding: '10px' }} className="row">
                    <div className="col col-lg-12 mx-auto">
                        <div className="card border shadow-none"></div>
                        <InvoiceHead receiptType='Expense Voucher'></InvoiceHead>
                        <hr />
                        <div className='rounded border border-dark p-2'>
                            <div className="d-flex justify-content-between">
                                <div className='rounded border border-dark p-1 fw-bold'>{data?.amount} AED</div>
                                <div className='text-upper rounded border border-dark p-1 fw-bold'>Payment Voucher</div>
                                <div className='fw-bold'>Voucher No.: {data?.expenseNo}</div>
                            </div>
                            <hr />
                            <p className="border-bottom border-dark">
                                <div className='row'>
                                    <div className='col-3'>Receipt to Mr/Mrs</div>
                                    <div className='col-6 fw-bold'>{data?.expenseShopCompany}</div>
                                    <div className='col-3 text-end'>paid amount against</div>
                                </div>
                            </p>
                            <p className="border-bottom border-dark">
                                <div className='row'>
                                    <div className='col-3'>The sum of Dhs</div>
                                    <div className='col-9 fw-bold'>{common.inWords(data?.amount)} AED</div>
                                </div>
                            </p>
                            <p className="border-bottom border-dark">
                                <div className='row'>
                                    <div className='col-3'>Being for</div>
                                    <div className='col-9 fw-bold'>{data?.name}</div>
                                </div>
                            </p>
                            <p className="">
                                <div className='row'>
                                    <div className='col-12'>Dated : {common.getHtmlDate(data?.expenseDate)}</div>
                                </div>
                            </p>
                            <p className="">
                                <div className='row'>
                                    <div className='col-12  p-2 text-end mx-1'>Sign........................................</div>
                                </div>
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
})
