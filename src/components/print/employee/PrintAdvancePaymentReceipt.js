import React from 'react'
import { common } from '../../../utils/common';
import InvoiceHead from '../../common/InvoiceHead';
import Label from '../../common/Label';
import ReceiptFooter from '../ReceiptFooter';

export const PrintAdvancePaymentReceipt = React.forwardRef((props, ref) => {
    if (props === undefined || props.props === undefined)
        return <></>
        debugger;
    const formatData = (input) => {
        if (input === undefined || input === null || isNaN(input))
            return '0.00';
        if (typeof input === 'string')
            return parseFloat(input).toFixed(2);
        if (typeof input === 'number')
            return input.toFixed(2);
        return input;
    }
    return (
        <>
            <div ref={ref} style={{ padding: '10px' }} className="row">
                <div className="col col-lg-12 mx-auto">
                    <div className="card border shadow-none"></div>
                    <InvoiceHead receiptType='Advance Payment Receipt'></InvoiceHead>
                    <div className="card-header py-2 bg-light">
                        <div className="row row-cols-12 row-cols-lg-12">
                            <div className="col-3">
                                <Label fontSize='13px' bold={true} text="Emaployee Name"></Label>
                                <div>{props.props.employee.firstName} {props.props.employee.lastName}</div>
                            </div>
                            <div className="col-2">
                                <Label fontSize='13px' bold={true} text="Emaployee Id"></Label>
                                <div>{props.props.employeeId}</div>
                            </div>
                            <div className="col-4">
                                <Label fontSize='13px' bold={true} text="Email"></Label>
                                <div>{props.props.employee.email}</div>
                            </div>
                            <div className="col-3">
                                <Label fontSize='13px' bold={true} text="Contact No"></Label>
                                <div>{props.props.employee.contact}</div>
                            </div>
                            <div className="col-3">
                                <Label fontSize='13px' bold={true} text="Job Title"></Label>
                                <div>{props.props.employee.jobTitle}</div>
                            </div>
                            <div className="col-3">
                                <Label fontSize='13px' bold={true} text="Advance Date"></Label>
                                <div>{common.getHtmlDate(props.props.createdAt,"ddmmyyyy")}</div>
                            </div>
                        </div>
                        <hr></hr>
                        <div className="card-body">
                            <div className="table">
                                <table className="table table-invoice">
                                    <thead>
                                        <tr>
                                            <th className="text-center">Amount</th>
                                            <th className="text-center">EMI</th>
                                            <th className="text-center">EMI Start From</th>
                                            <th className="text-center">Reason</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        <tr>
                                            <td className="text-center" >{formatData(props?.props?.amount)}</td>
                                            <td className="text-center">{props.props.emi}</td>
                                            <td className="text-center">{common.monthList[props.props.emiStartMonth - 1]}-{props.props.emiStartYear}</td>
                                            <td className="text-center">{props.props.reason}</td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                            <div className='fs-6 fw-bold'>EMI Details</div>
                            <div className="table">
                                <table className="table table-invoice">
                                    <thead>
                                        <tr>
                                            <th className="text-center">Amount Deducted</th>
                                            <th className="text-center">EMI Month</th>
                                            <th className="text-center">EMI Year</th>
                                            <th className="text-center">Reason</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {
                                            props?.props?.employeeEMIPayments?.map(res => {
                                                return <tr key={res.advancePaymentId}>
                                                    <td className="text-center" >{formatData(res.amount)}</td>
                                                    <td className="text-center">{common.monthList[res.deductionMonth - 1]}</td>
                                                    <td className="text-center">{res.deductionYear}</td>
                                                    <td className="text-center">{res.remark}</td>
                                                </tr>
                                            })
                                        }

                                    </tbody>
                                    <tfoot>
                                        <tr>
                                            <td className="text-bold pt-2" colSpan={2}>Paid By ....................................................................</td>
                                            <td className="text-bold pt-2" colSpan={2}>Received By....................................................................</td>
                                        </tr>
                                    </tfoot>
                                </table>
                            </div>
<br/>
<br/>
<br/>
                            <ReceiptFooter message='Thanks for working with us'></ReceiptFooter>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
});
