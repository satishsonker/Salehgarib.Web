import React from 'react'
import { common } from '../../../utils/common';
import InvoiceHead from '../../common/InvoiceHead';
import Label from '../../common/Label';
import ReceiptFooter from '../ReceiptFooter';

export const PrintMonthlySalaryReport = React.forwardRef((props, ref) => {
    if (props === undefined || props.props === undefined || props.props.employee === undefined)
        return <></>
    const countAttendence = (attedence, workingDays) => {
        let obj = {
            present: 0,
            absent: 0
        };
        for (let index = 1; index <= workingDays; index++) {
            if (attedence['day' + index] !== 0)
                obj.present += 1;
            if (attedence['day' + index] === 0)
                obj.absent += 1;
        }
        return obj
    }

    let totalWorkingDays = props.props.workingDays;
    let totalCount = countAttendence(props.props, totalWorkingDays);
    let perDaySalary = props.props.employee.salary / totalWorkingDays;
    let totalDeduction = props.props.advance + (perDaySalary * totalCount.absent);
    let netSalary = props.props.employee.salary - totalDeduction;

    return (
        <>
            <div ref={ref} style={{ padding: '10px' }} className="row">
                <div className="col col-lg-12 mx-auto">
                    <div className="card border shadow-none">
                        <InvoiceHead receiptType='Salary Slip' />
                        <div className="card-header py-2 bg-light">
                            <div className="row row-cols-12 row-cols-lg-12">
                                <div className="col-3">
                                    <Label fontSize='13px' bold={true} text="Emaployee Name"></Label>
                                    <div>{props.props.employeeName}</div>
                                </div>
                                <div className="col-3">
                                    <Label fontSize='13px' bold={true} text="Emaployee Id"></Label>
                                    <div>{props.props.employeeId}</div>
                                </div>
                                <div className="col-3">
                                    <Label fontSize='13px' bold={true} text="Month"></Label>
                                    <div>{props.props.month}</div>
                                </div>
                                <div className="col-3">
                                    <Label fontSize='13px' bold={true} text="Year"></Label>
                                    <div>{props.props.year}</div>
                                </div>
                                <div className="col-3">
                                    <Label fontSize='13px' bold={true} text="Total Working Days"></Label>
                                    <div>{totalWorkingDays}</div>
                                </div>
                                <div className="col-3">
                                    <Label fontSize='13px' bold={true} text="Total Present"></Label>
                                    <div>{totalCount.present}</div>
                                </div>
                                <div className="col-3">
                                    <Label fontSize='13px' bold={true} text="Total Absent"></Label>
                                    <div>{totalCount.absent}</div>
                                </div>
                            </div>
                        </div>
                        <div className="card-body">
                            <div className="table-responsive">
                                <table className="table table-invoice">
                                    <thead>
                                        <tr>
                                            <th className="text-center"></th>
                                            <th className="text-center">Basic Salary</th>
                                            <th className="text-center" width="10%">Accomodation</th>
                                            <th className="text-center" width="20%">Gross Salary</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        <tr>
                                            <td className="text-center"></td>
                                            <td className="text-center">{props.props.basicSalary}</td>
                                            <td className="text-center" width="10%">{props.props.employee.accomodation.toFixed(2)}</td>
                                            <td className="text-center" width="20%">{props.props.employee.salary.toFixed(2)}</td>
                                        </tr>
                                        <tr>
                                            <td></td>
                                            <td></td>
                                            <td className="text-right">(-)Advance</td>
                                            <td className="text-center">{props.props.advance.toFixed(2)}</td>
                                        </tr>
                                        <tr>
                                            <td></td>
                                            <td></td>
                                            <td className="text-right">{totalCount.absent} Absent</td>
                                            <td className="text-center">{(perDaySalary * totalCount.absent).toFixed(2)}</td>
                                        </tr>
                                        <tr>
                                            <td></td>
                                            <td></td>
                                            <td className="text-right text-bold"><strong>Total Payable Amount</strong></td>
                                            <td className="text-center text-bold"><strong>{netSalary.toFixed(2)}</strong></td>
                                        </tr>
                                    </tbody>
                                    <tfoot>
                                       
                                    </tfoot>
                                </table>
                            </div>
                        </div>
                        <ReceiptFooter message='Thanks for working with us' />
                    </div>
                </div>
            </div>
        </>
    )
})

