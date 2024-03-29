import React, { useState, useEffect } from 'react'
import { common } from '../../../utils/common';
import InvoiceHead from '../../common/InvoiceHead';
import Label from '../../common/Label';
import ReceiptFooter from '../ReceiptFooter';

export const PrintMonthlyAttendenceReport = React.forwardRef((props, ref) => {
    const [data, setData] = useState({});
    const [dates, setDates] = useState([]);
    const appendBlankDays = (year, month) => {
        let days = [];
        for (let index = 0; index < new Date(`${year}-${month}-01`).getDay(); index++) {
            days.push(undefined);
        }
        return days;
    }
    useEffect(() => {
        setData(props.props);
        var month =common.monthList.indexOf(props.props.month)+1;
        var year = props.props.year;
        var d = appendBlankDays(year,month);
        const totalDaysOfMonth = common.daysInMonth(month, year);
        for (let index = 1; index <= totalDaysOfMonth; index++) {
            d.push(index);
        }
        setDates(d);
    }, [props.props])

    if (props === undefined || data === undefined || data?.employee === undefined)
        return <></>
    const countAttendence = (attedence, workingDays) => {
        let obj = {
            present: 0,
            absent: 0
        };
        for (let index = 1; index <= workingDays; index++) {
            if (attedence['day' + index] !== 0 )
                obj.present += 1;
            if (attedence['day' + index] === 0)
                obj.absent += 1;
        }
        return obj
    }

    let totalWorkingDays = data.workingDays;
    let totalCount = countAttendence(data, totalWorkingDays);
    let perDaySalary = data?.employee.salary / totalWorkingDays;
    let totalDeduction = data?.advance + (perDaySalary * totalCount.absent);
    let netSalary = data?.employee.salary - totalDeduction;
    const colorClass = (input) => {
        if (data['day' + input] === 0)
            return { class: 'text-center text-danger', text: 'Absent' };
        if (data['day' + input] === 1)
            return { class: 'text-center text-success', text: 'Present' };
        if (data['day' + input] > 1)
            return { class: 'text-center text-warning', text: 'Holiday' };
    }
    const isPresent = (input) => {
        return <div>
            <div className='text-center' style={{ fontSize: '12px' }}>{input}, {data.month}</div>

            <div className={colorClass(input).class} style={{ fontSize: '16px' }}>{colorClass(input).text}</div>
        </div>
    }
    return (
        <>
            <div ref={ref} style={{ padding: '10px' }} className="row">
                <div className="col col-lg-12 mx-auto">
                    <div className="card border shadow-none">
                        <InvoiceHead receiptType='Employee Attendence Report' />
                        <div className="card-header py-2 bg-light">
                            <div className="row row-cols-12 row-cols-lg-12">
                                <div className="col-3">
                                    <Label fontSize='13px' bold={true} text="Emaployee Name"></Label>
                                    <div>{data?.employeeName}</div>
                                </div>
                                <div className="col-3">
                                    <Label fontSize='13px' bold={true} text="Emaployee Id"></Label>
                                    <div>{data?.employeeId}</div>
                                </div>
                                <div className="col-3">
                                    <Label fontSize='13px' bold={true} text="Month"></Label>
                                    <div>{data?.month}</div>
                                </div>
                                <div className="col-3">
                                    <Label fontSize='13px' bold={true} text="Year"></Label>
                                    <div>{data?.year}</div>
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
                            <table>
                                <thead>
                                    <tr>
                                        <th>
                                            <div style={{ width: '700px' }} className="d-flex flex-wrap">
                                                <div style={{ width: '100px' }} className="text-center border border-secondary p-2">Sun</div>
                                                <div style={{ width: '100px' }} className="text-center border border-secondary p-2">Mon</div>
                                                <div style={{ width: '100px' }} className="text-center border border-secondary p-2">Tue</div>
                                                <div style={{ width: '100px' }} className="text-center border border-secondary p-2">Wed</div>
                                                <div style={{ width: '100px' }} className="text-center border border-secondary p-2">Thu</div>
                                                <div style={{ width: '100px' }} className="text-center border border-secondary p-2">Fri</div>
                                                <div style={{ width: '100px' }} className="text-center border border-secondary p-2">Sat</div>
                                            </div>
                                        </th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr>
                                        <td>
                                            <div style={{ width: '700px' }} className="d-flex flex-wrap">
                                                {
                                                    dates?.map((ele, index) => {
                                                        if (ele === undefined) {
                                                            return <div key={index} style={{ width: '100px' }} className="text-center border border-secondary"></div>
                                                        }
                                                        else {
                                                            return <div key={index} style={{ width: '100px', minHeight: '50px'}} className="text-center border border-secondary">
                                                               {isPresent(ele)}
                                                            </div>
                                                        }
                                                    })
                                                }
                                            </div>
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                            {/* <div className="table-responsive">

                                <table className="table table-invoice">
                                    <thead>
                                        <tr>
                                            <th className="text-center">Sun</th>
                                            <th className="text-center">Mon</th>
                                            <th className="text-center">Tue</th>
                                            <th className="text-center">Wed</th>
                                            <th className="text-center">Thu</th>
                                            <th className="text-center">Fri</th>
                                            <th className="text-center">Sat</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        <tr>
                                            <td className="text-center">{isPresent(1)}</td>
                                            <td>{isPresent(2)}</td>
                                            <td>{isPresent(3)}</td>
                                            <td>{isPresent(4)}</td>
                                            <td>{isPresent(5)}</td>
                                            <td>{isPresent(6)}</td>
                                            <td>{isPresent(7)}</td>
                                        </tr>
                                        <tr>
                                            <td>{isPresent(8)}</td>
                                            <td>{isPresent(9)}</td>
                                            <td>{isPresent(10)}</td>
                                            <td>{isPresent(11)}</td>
                                            <td>{isPresent(12)}</td>
                                            <td>{isPresent(13)}</td>
                                            <td>{isPresent(14)}</td>
                                        </tr>
                                        <tr>
                                            <td>{isPresent(15)}</td>
                                            <td>{isPresent(16)}</td>
                                            <td>{isPresent(17)}</td>
                                            <td>{isPresent(18)}</td>
                                            <td>{isPresent(19)}</td>
                                            <td>{isPresent(20)}</td>
                                            <td>{isPresent(21)}</td>
                                        </tr>
                                        <tr>
                                            <td>{isPresent(22)}</td>
                                            <td>{isPresent(23)}</td>
                                            <td>{isPresent(24)}</td>
                                            <td>{isPresent(25)}</td>
                                            <td>{isPresent(26)}</td>
                                            <td>{isPresent(27)}</td>
                                            <td>{isPresent(28)}</td>
                                        </tr>
                                        <tr>
                                            <td>{isPresent(29)}</td>
                                            <td>{isPresent(30)}</td>
                                            <td>{isPresent(31)}</td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div> */}
                        </div>
                        <ReceiptFooter message='Thanks for working with us' />
                    </div>
                </div>
            </div>
        </>
    )
})
