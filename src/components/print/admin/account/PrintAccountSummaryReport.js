import React from 'react'
import { common } from '../../../../utils/common';

export const PrintAccountSummaryReport = React.forwardRef((props, ref) => {
    if (props == undefined || props.props === undefined || props.props.account === undefined)
        return;
    let accountData = props.props.account;
    let orderQty = props.props.order;
    let workTypeSumAmount = props.props.workType;
    let expenseHeadWiseSum = props.props?.expenseHeadWiseSum;
    return (
        <div ref={ref} className='row'>
            <div className='col-12'>
                <div className='card'>
                    <div className='card-body'>
                        <div className='row'>
                            <div className='col-12'>
                                <div className='fw-bold fs-4 text-uppercase text-center'>
                                    Account Summary Report
                                </div>
                            </div>
                            <hr />
                            <div className='col-12'>
                                <div className='fw-bold fs-6 text-uppercase text-center bg-warning'>
                                    Booking Amount
                                </div>
                                <div className='card'>
                                    <div className='card-body'>
                                        <div className="d-flex justify-content-between">
                                            <div className="p-2 text-uppercase">total booking amount</div>
                                            <div className="p-2 fw-bold">{common.printDecimal(accountData?.totalBookingAmount)}</div>
                                            <div className="p-2 text-uppercase">total booking cash amount</div>
                                            <div className="p-2 fw-bold">{common.printDecimal(accountData?.totalBookingCashAmount)}</div>
                                            <div className="p-2 text-uppercase">total booking visa amount</div>
                                            <div className="p-2 fw-bold">{common.printDecimal(accountData?.totalBookingVisaAmount)}</div>
                                            <div className="p-2 text-uppercase">total booking qty</div>
                                            <div className="p-2 fw-bold">{common.printDecimal(orderQty?.bookingQty)}</div>
                                            <div className="p-2 text-uppercase">total Order qty</div>
                                            <div className="p-2 fw-bold">{common.printDecimal(orderQty?.orderQty)}</div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className='col-6'>
                                <div className='fw-bold fs-6 text-uppercase text-center bg-warning'>
                                    cancelled/refund Amount
                                </div>
                                <div className='card'>
                                    <div className='card-body'>
                                        <div className="d-flex justify-content-between">
                                            <div className="p-2 text-uppercase fw-bold">total Cancelled amount</div>
                                            <div className="p-2">{common.printDecimal(accountData?.totalCancelledAmount)}</div>
                                        </div>
                                        <div className="d-flex justify-content-between">
                                            <div className="p-2 text-uppercase fw-bold">total Deleted amount</div>
                                            <div className="p-2">{common.printDecimal(accountData?.totalDeletedAmount)}</div>
                                        </div>
                                        <div className="d-flex justify-content-between">
                                            <div className="p-2 text-uppercase fw-bold">total refund amount</div>
                                            <div className="p-2">{common.printDecimal(accountData?.totalRefundAmount)}</div>
                                        </div>
                                        <div className="d-flex justify-content-between">
                                            <div className="p-2 text-uppercase fw-bold">total cancelled QTY</div>
                                            <div className="p-2">{orderQty?.cancelledQty}</div>
                                        </div>
                                        <div className="d-flex justify-content-between">
                                            <div className="p-2 text-uppercase fw-bold">total deleted QTY</div>
                                            <div className="p-2">{orderQty?.deletedQty}</div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className='col-6'>
                                <div className='fw-bold fs-6 text-uppercase text-center bg-warning'>
                                    Delivery Amount
                                </div>
                                <div className='card'>
                                    <div className='card-body'>
                                        <div className="d-flex justify-content-between">
                                            <div className="p-2 text-uppercase fw-bold">total Delivery cash amount</div>
                                            <div className="p-2">{common.printDecimal(accountData?.totalDeliveryCashAmount)}</div>
                                        </div>
                                        <div className="d-flex justify-content-between">
                                            <div className="p-2 text-uppercase fw-bold">total Delivery visa amount</div>
                                            <div className="p-2">{common.printDecimal(accountData?.totalDeliveryVisaAmount)}</div>
                                        </div>
                                        <div className="d-flex justify-content-between">
                                            <div className="p-2 text-uppercase fw-bold">total Delivery amount</div>
                                            <div className="p-2">{common.printDecimal(accountData?.totalDeliveryAmount)}</div>
                                        </div>
                                        <div className="d-flex justify-content-between">
                                            <div className="p-2 text-uppercase fw-bold">total Delivery QTY</div>
                                            <div className="p-2">{orderQty?.deliveredQty}</div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className='col-6'>
                                <div className='fw-bold fs-6 text-uppercase text-center bg-warning'>
                                    Advance Amount
                                </div>
                                <div className='card'>
                                    <div className='card-body'>
                                        <div className="d-flex justify-content-between">
                                            <div className="p-2 text-uppercase fw-bold">Advance cash amount</div>
                                            <div className="p-2">{common.printDecimal(accountData?.totalAdvanceCashAmount)}</div>
                                        </div>
                                        <div className="d-flex justify-content-between">
                                            <div className="p-2 text-uppercase fw-bold">advance visa amount</div>
                                            <div className="p-2">{common.printDecimal(accountData?.totalAdvanceVisaAmount)}</div>
                                        </div>
                                        <div className="d-flex justify-content-between">
                                            <div className="p-2 text-uppercase fw-bold">total advance amount</div>
                                            <div className="p-2">{common.printDecimal(accountData?.totalAdvanceAmount)}</div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className='col-6'>
                                <div className='fw-bold fs-6 text-uppercase text-center bg-warning'>
                                    VAT Amount
                                </div>
                                <div className='card'>
                                    <div className='card-body'>
                                        <div className="d-flex justify-content-between">
                                            <div className="p-2 text-uppercase fw-bold">total Booking vat %5</div>
                                            <div className="p-2">{common.printDecimal(accountData?.totalBookingVatAmount)}</div>
                                        </div>
                                        <div className="d-flex justify-content-between">
                                            <div className="p-2 text-uppercase fw-bold">total Advance vat %5</div>
                                            <div className="p-2">{common.printDecimal(accountData?.totalAdvanceVatAmount)}</div>
                                        </div>
                                        <div className="d-flex justify-content-between">
                                            <div className="p-2 text-uppercase fw-bold">total Balance vat %5</div>
                                            <div className="p-2">{common.printDecimal(accountData?.totalBalanceVatAmount)}</div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className='col-12'>
                                <div className='fw-bold fs-6 text-uppercase text-center bg-warning'>
                                    Expense Amount
                                </div>
                                <div className='card'>
                                    <div className='card-body'>
                                     <div className='row'>
                                     <div className='col-6'>
                                            <div className="d-flex justify-content-between">
                                                <div className="exp-header p-2 text-uppercase fw-bold">Expense Name</div>
                                                <div className="amt-header p-2 text-uppercase fw-bold">Amount</div>
                                            </div>
                                            {
                                                expenseHeadWiseSum?.map((res, index) => {
                                                    if(index<parseInt(expenseHeadWiseSum?.length/2))
                                                    return <div key={index} className="d-flex justify-content-between">
                                                        <div className="exp-header p-2 text-uppercase">{res.expenseName}</div>
                                                        <div className="amt-header p-2">{common.printDecimal(res.amount)}</div>
                                                    </div>
                                                })
                                            }
                                        </div>
                                        <div className='col-6'>
                                            <div className="d-flex justify-content-between">
                                                <div className="exp-header p-2 text-uppercase fw-bold">Expense Name</div>
                                                <div className="amt-header p-2 text-uppercase fw-bold">Amount</div>
                                            </div>
                                            {
                                                expenseHeadWiseSum?.map((res, index) => {
                                                    if(index>=parseInt(expenseHeadWiseSum?.length/2))
                                                    return <div key={index} className="d-flex justify-content-between">
                                                        <div className="exp-header p-2 text-uppercase">{res.expenseName}</div>
                                                        <div className="amt-header p-2">{common.printDecimal(res.amount)}</div>
                                                    </div>
                                                })
                                            }
                                        </div>
                                     </div>
                                    </div>
                                </div>
                            </div>
                            <div className='col-6'>
                                <div className='fw-bold fs-6 text-uppercase text-center bg-warning'>
                                    work type Amount
                                </div>
                                <div className='card'>
                                    <div className='card-body'>
                                        <div className="d-flex justify-content-between">
                                            <div className="exp-header p-2 text-uppercase fw-bold">work type</div>
                                            <div className="p-2 text-uppercase fw-bold">Qty</div>
                                            <div className="amt-header p-2 text-uppercase fw-bold">Amount</div>
                                        </div>
                                        {
                                            workTypeSumAmount?.map((res, index) => {
                                                return <div key={index} className="d-flex justify-content-between">
                                                    <div className="exp-header p-2 text-uppercase">{res.workType}</div>
                                                    <div className="p-2">{res.qty}</div>
                                                    <div className="amt-header p-2">{common.printDecimal(res.amount)}</div>
                                                </div>
                                            })
                                        }
                                    </div>
                                </div>
                            </div>
                            <div className='col-6'>
                                <div className='fw-bold fs-6 text-uppercase text-center bg-warning'>
                                    Grand Amount
                                </div>
                                <div className='card'>
                                    <div className='card-body'>
                                        <div className="d-flex justify-content-between">
                                            <div className="p-2 text-uppercase fw-bold">grand cash amount</div>
                                            <div className="p-2">{common.printDecimal(accountData?.totalAdvanceCashAmount + accountData?.totalDeliveryCashAmount)}</div>
                                        </div>
                                        <div className="d-flex justify-content-between">
                                            <div className="p-2 text-uppercase fw-bold">grand visa amount</div>
                                            <div className="p-2">{common.printDecimal(accountData?.totalAdvanceVisaAmount + accountData?.totalDeliveryVisaAmount)}</div>
                                        </div>
                                        <div className="d-flex justify-content-between">
                                            <div className="p-2 text-uppercase fw-bold">grand amount</div>
                                            <div className="p-2">{common.printDecimal(accountData?.totalAdvanceAmount + accountData?.totalDeliveryAmount)}</div>
                                        </div>
                                    </div>
                                </div>
                                <div className='fw-bold fs-6 text-uppercase text-center bg-warning'>
                                    Grand Expense Amount
                                </div>
                                <div className='card'>
                                    <div className='card-body'>
                                        <div className="d-flex justify-content-between">
                                            <div className="p-2 text-uppercase fw-bold">grand salary amount</div>
                                            <div className="p-2">0.00</div>
                                        </div>
                                        <div className="d-flex justify-content-between">
                                            <div className="p-2 text-uppercase fw-bold">grand cash expense</div>
                                            <div className="p-2">0.00</div>
                                        </div>
                                        <div className="d-flex justify-content-between">
                                            <div className="p-2 text-uppercase fw-bold">grand cheque expense</div>
                                            <div className="p-2">0.00</div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
})
