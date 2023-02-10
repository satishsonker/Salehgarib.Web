import React, { useEffect, useState, useRef } from 'react'
import { toast } from 'react-toastify';
import { Api } from '../../apis/Api';
import { apiUrls } from '../../apis/ApiUrls';
import { common } from '../../utils/common';
import Breadcrumb from '../common/Breadcrumb';
import ButtonBox from '../common/ButtonBox';
import Dropdown from '../common/Dropdown';
import { useReactToPrint } from 'react-to-print';
import { PrintEmployeeSalarySlip } from '../print/admin/account/PrintEmployeeSalarySlip';

export default function EmployeeSalarySlip() {
    const CURR_DATE = new Date();
    const [empSalaryData, setEmpSalaryData] = useState([]);
    const [employeeData, setEmployeeData] = useState([])
    const [jobTitles, setJobTitles] = useState([])
    const [filterData, setFilterData] = useState({
        empId: 0,
        month: CURR_DATE.getMonth() + 1,
        year: CURR_DATE.getFullYear(),
        isEmployee: true,
        jobTitle:""
    });
    const printSalarySlipRef = useRef();
    const printSalarySlipHandler = useReactToPrint({
        content: () => printSalarySlipRef.current,
    });
    const printSalarySlipHandlerMain = () => {
        if (empSalaryData.length < 1) {
            toast.warn('Please get the salary data first!');
            return;
        }
        printSalarySlipHandler();
    }
    const getSalaryData = () => {
        if (filterData.empId < 1) {
            toast.warn("Please select Employee/Staff!");
            return;
        }
        if (filterData.month < 1) {
            toast.warn("Please select month!");
            return;
        }
        if (filterData.year < 1) {
            toast.warn("Please select year!");
            return;
        }
        Api.Get(apiUrls.employeeController.getEmployeeSalarySlip + `?empId=${filterData.empId}&month=${filterData.month}&year=${filterData.year}`)
            .then(res => {
                setEmpSalaryData(res.data);
            });
    }

    useEffect(() => {
        let apiCalls = [];
        apiCalls.push(Api.Get(apiUrls.dropdownController.employee));
        apiCalls.push(Api.Get(apiUrls.dropdownController.jobTitle));
        Api.MultiCall(apiCalls).then(res => {
            if (res[0].data.length > 0)
                setEmployeeData([...res[0].data]);
            setJobTitles(res[1].data);
        })
    }, []);

    const handleTextChange = (e) => {
        var { name, value, type } = e.target;
        if (type === 'select-one') {
            value = parseInt(value);

        }
        if (type === "radio") {
            setFilterData({ ...filterData, "isEmployee": value === "Employee" ? true : false });
        }
        else {
            setFilterData({ ...filterData, [name]: value });
        }
    }

    const filterEmployee = () => {
        debugger;
        var data = employeeData.filter(x => x.data.isFixedEmployee !== filterData.isEmployee);
        if(filterData.isEmployee)
        return data.filter(x=>x.data.jobTitleId==filterData.jobTitle);
        return data;
    }
    const breadcrumbOption = {
        title: 'Employee/Staff Salary Slip',
        items: [
            {
                title: "Report",
                icon: "bi bi-journal-bookmark-fill",
                isActive: false,
            },
            {
                title: 'Employee/Staff' + " Salary Slip",
                icon: "bi bi-card-list",
                isActive: false,
            }
        ]
    }
    const btnList = [
        {
            type: 'Go',
            onClickHandler: getSalaryData,
            className: 'btn-sm'
        },
        {
            type: 'Print',
            onClickHandler: printSalarySlipHandlerMain,
            className: 'btn-sm'
        }
    ]
    return (
        <>
            <Breadcrumb option={breadcrumbOption}></Breadcrumb>
            <div className='d-flex justify-content-end'>
                <div className='p-2'>
                    <div className="form-check form-check-inline">
                        <input onClick={e => handleTextChange(e)} className="form-check-input" type="radio" name="inlineRadioOptions" id="inlineRadio1" value="Staff" checked={!filterData.isEmployee} />
                        <label className="form-check-label" for="inlineRadio1">Staff</label>
                    </div>
                    <div className="form-check form-check-inline">
                        <input onClick={e => handleTextChange(e)} className="form-check-input" type="radio" name="inlineRadioOptions" id="inlineRadio2" value="Employee" checked={filterData.isEmployee} />
                        <label className="form-check-label" for="inlineRadio2">Employee</label>
                    </div>
                </div>
                {filterData.isEmployee && <div className='p-2'>
                    <Dropdown defaultValue='' className="form-control-sm" data={jobTitles} name="jobTitle" searchable={true} onChange={handleTextChange} value={filterData.jobTitle} defaultText="Select employee"></Dropdown>
                </div>
                }
                <div className='p-2'>
                    <Dropdown defaultValue='' className="form-control-sm" data={filterEmployee()} name="empId" searchable={true} onChange={handleTextChange} value={filterData.empId} defaultText="Select employee"></Dropdown>
                </div>
                <div className='p-2'>
                    <Dropdown defaultValue='' className="form-control-sm" data={common.numberRangerForDropDown(1, 12)} name="month" onChange={handleTextChange} value={filterData.month} defaultText="Month"></Dropdown>
                </div>
                <div className='p-2'>
                    <Dropdown defaultValue='' className="form-control-sm" data={common.numberRangerForDropDown(CURR_DATE.getFullYear() - 30, CURR_DATE.getFullYear())} name="year" onChange={handleTextChange} value={filterData.year} defaultText="Year"></Dropdown>
                </div>
                <div className='p-2'>
                    <ButtonBox btnList={btnList} />
                </div>
            </div>
            <hr />
            <div className='card'>
                <div className='card-body'>
                    <table className='table table-bordered table-stripe' style={{ fontSize: 'var(--app-font-size)' }}>
                        <thead>
                            <tr>
                                <th className='text-center'>Sr.</th>
                                <th className='text-center'>Voucher No.</th>
                                <th className='text-center'>Date</th>
                                <th className='text-center'>Order No.</th>
                                <th className='text-center'>Price+Grade</th>
                                <th className='text-center'>Qty</th>
                                <th className='text-center'>Note</th>
                                <th className='text-end'>Amount</th>
                                <th className='text-end'>Alter Amount</th>
                            </tr>
                        </thead>
                        <tbody>
                            {empSalaryData.length == 0 && <tr><td colSpan={8} className="text-center text-danger">No Data Found</td></tr>}
                            {empSalaryData?.map((res, index) => {
                                return <tr key={index}>
                                    <td className='text-center'>{index + 1}</td>
                                    <td className='text-center'>{"000" + res.voucherNo.slice(-7)}</td>
                                    <td className='text-center'>{common.getHtmlDate(res.date, 'ddmmyyyy')}</td>
                                    <td className='text-center'>{res.kandooraNo}</td>
                                    <td className='text-center'>{res.orderPrice + ' - ' + common.getGrade(res.orderPrice)}</td>
                                    <td className='text-center'>{res.qty}</td>
                                    <td className='text-center'>{res.note}</td>
                                    <td className='text-end'>{common.printDecimal(res.amount)}</td>
                                    <td className='text-end'>{common.printDecimal(res.extra)}</td>
                                </tr>
                            })}
                            <tr>
                                <td colSpan={4}></td>
                                <td className='fw-bold text-center'>Total Qty</td>
                                <td className='fw-bold text-center'>{empSalaryData.reduce((sum, ele) => {
                                    return sum += ele.qty ?? 0;
                                }, 0)}</td>
                                <td className='fw-bold text-center'>Total Amount</td>
                                <td className='fw-bold text-end'>{common.printDecimal(empSalaryData.reduce((sum, ele) => {
                                    return sum += ele.amount ?? 0;
                                }, 0))}</td>
                                <td className='fw-bold text-end'>{common.printDecimal(empSalaryData.reduce((sum, ele) => {
                                    return sum += ele.extra ?? 0;
                                }, 0))}</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
            <div className='d-none'>
                <PrintEmployeeSalarySlip ref={printSalarySlipRef} props={{ filter: filterData, data: empSalaryData }} />
            </div>
        </>
    )
}
