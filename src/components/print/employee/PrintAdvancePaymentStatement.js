import React from 'react'
import { common } from '../../../utils/common';
import InvoiceHead from '../../common/InvoiceHead';
import Label from '../../common/Label';
import ReceiptFooter from '../ReceiptFooter';

export const PrintAdvancePaymentStatement = React.forwardRef((props, ref) => {
    if (props === undefined || props.prop === undefined)
        return <></>
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
                    <InvoiceHead receiptType='Advance Payment Statement'></InvoiceHead>
                    <div className="card-header py-2 bg-light">
                        <div className="row row-cols-12 row-cols-lg-12">
                            <div className="col-3">
                                <Label fontSize='13px' bold={true} text="Emaployee Name"></Label>
                                <div>{props.prop.emp.employee.firstName} {props.prop.emp.employee.lastName}</div>
                            </div>
                            <div className="col-2">
                                <Label fontSize='13px' bold={true} text="Emaployee Id"></Label>
                                <div>{props.prop.emp.employee.id}</div>
                            </div>
                            <div className="col-4">
                                <Label fontSize='13px' bold={true} text="Email"></Label>
                                <div>{props.prop.emp.employee.email}</div>
                            </div>
                            <div className="col-3">
                                <Label fontSize='13px' bold={true} text="Contact No"></Label>
                                <div>{props.prop.emp.employee.contact}</div>
                            </div>
                            <div className="col-3">
                                <Label fontSize='13px' bold={true} text="Job Title"></Label>
                                <div>{props.prop.emp.employee.jobTitle}</div>
                            </div>
                        </div>
                        <hr></hr>
                        <div className="card-body">
                            <div className="table">
                                <table className="table table-invoice">
                                    <thead>
                                        <tr>
                                        <th className="text-center">Date</th>
                                            <th className="text-center">Amount</th>
                                            <th className="text-center">EMI</th>
                                            <th className="text-center">EMI Start From</th>
                                            <th className="text-center">Reason</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {
                                            props?.prop?.statement?.map(res => {
                                                return <tr key={res.id}>
                                                      <td className="text-center" >{common.getHtmlDate(res.createdAt, "ddmmyyyy")}</td>
                                                    <td className="text-center" >{formatData(res.amount)}</td>
                                                    <td className="text-center">{res.emi}</td>
                                                    <td className="text-center">{common.monthList[res.emiStartMonth - 1]}-{res.emiStartYear}</td>
                                                    <td className="text-center">{res.reason}</td>
                                                </tr>
                                            })
                                        }

                                    </tbody>
                                </table>
                            </div>
                            <br />
                            <br />
                            <br />
                            <ReceiptFooter message='Thanks for working with us'></ReceiptFooter>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
});
