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
import { PrintShortEmployeeSalarySlip } from '../print/admin/account/PrintShortEmployeeSalarySlip';
import { headerFormat } from '../../utils/tableHeaderFormat';
import TableView from '../tables/TableView';

export default function EmployeeSalarySlip() {
    const CURR_DATE = new Date();
    const [employeeData, setEmployeeData] = useState([])
    const [jobTitles, setJobTitles] = useState([]);
    const [salaryLedgerData, setSalaryLedgerData] = useState([]);
    const [selectedEmpFromLedger, setSelectedEmpFromLedger] = useState(0);
    const [filterData, setFilterData] = useState({
        empId: 0,
        month: CURR_DATE.getMonth() + 1,
        year: CURR_DATE.getFullYear(),
        isEmployee: true,
        jobTitle: ""
    });

    const viewLedgerData = (id, data) => {
        setSelectedEmpFromLedger(data.employeeId);

    }

    useEffect(() => {
        if (selectedEmpFromLedger === 0)
            return;
        getSalaryData(selectedEmpFromLedger);
    }, [selectedEmpFromLedger])


    const printSalarySlipRef = useRef();
    const printSortSalarySlipRef = useRef();
    const tableOptionTemplet = {
        headers: headerFormat.employeeSalarySlip,
        data: [],
        totalRecords: 0,
        showPagination: false,
        actions: {
            showView: true,
            showEdit: false,
            showDelete: false,
            view: {
                handler: viewLedgerData
            }
        },
        showSerialNo: true,
        showTableTop: false,
    }
    const [tableOption, setTableOption] = useState(tableOptionTemplet);

    const printSalarySlipHandler = useReactToPrint({
        content: () => printSalarySlipRef.current,
    });

    const printSortSalarySlipHandler = useReactToPrint({
        content: () => printSortSalarySlipRef.current,
    });

    const printSalarySlipHandlerMain = () => {
        if (tableOption.data.length < 1) {
            toast.warn('Please get the salary data first!');
            return;
        }
        printSalarySlipHandler();
    }
    const printSortSalarySlipHandlerMain = () => {
        if (tableOption.data.length < 1) {
            toast.warn('Please get the salary data first!');
            return;
        }
        printSortSalarySlipHandler();
    }
    const getSalaryData = (empId) => {
        let url = apiUrls.employeeController.getEmployeeSalarySlip + `?empId=${typeof empId === 'number' ? empId : filterData.empId}&month=${filterData.month}&year=${filterData.year}`;
        if (filterData.empId < 1 && typeof empId !== 'number') {
            url = apiUrls.employeeController.getEmployeeSalaryLedger + `?jobTitleId=${filterData.jobTitle}&month=${filterData.month}&year=${filterData.year}`
        }
        if (filterData.jobTitle < 1 && filterData.isEmployee) {
            toast.warn("Please select job title!");
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
        Api.Get(url)
            .then(res => {
                if (filterData.empId < 1 && typeof empId !== 'number') {
                    setSalaryLedgerData([...res.data]);
                }
                if (selectedEmpFromLedger === 0 && filterData.empId===0) {
                    tableOptionTemplet.headers = headerFormat.employeeSalaryLedger;
                    tableOptionTemplet.showAction=true;
                }
                else
                {
                    tableOptionTemplet.headers=headerFormat.employeeSalarySlip;
                    tableOptionTemplet.showAction=false;
                }
                tableOptionTemplet.data = res.data;
                tableOptionTemplet.totalRecords = res.data?.length;
                setTableOption({ ...tableOptionTemplet });

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
        var model = filterData;
        if (type === 'select-one') {
            value = parseInt(value);
        }
        if (name === 'jobTitle') {
            model.empId = 0;
        }
        if (name === 'jobTitle' || name === "empId") {
            setSalaryLedgerData([]);
        }
        if (name === "empId") {
           setSelectedEmpFromLedger(value)
        }
        if (type === "radio") {
            setFilterData({ ...model, "isEmployee": value === "Employee" ? true : false });
        }
        else {
            setFilterData({ ...model, [name]: value });
        }
    }

    const filterEmployee = () => {
        var data = employeeData.filter(x => x.data.isFixedEmployee !== filterData.isEmployee);
        if (filterData.isEmployee)
            return data.filter(x => x.data.jobTitleId === filterData.jobTitle);
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
                title: 'Employee/Staff Salary Slip',
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
            className: 'btn-sm',
            disabled:selectedEmpFromLedger===0
        },
        {
            type: 'Print',
            text: "Salary Slip",
            onClickHandler: printSortSalarySlipHandlerMain,
            className: 'btn-sm',
            disabled:selectedEmpFromLedger===0
        }
    ]

    const backToLedger = () => {
        setSelectedEmpFromLedger(0);
        tableOptionTemplet.data = salaryLedgerData;
        tableOptionTemplet.totalRecords = salaryLedgerData.length;
        tableOptionTemplet.headers = headerFormat.employeeSalaryLedger;
        tableOptionTemplet.showAction = true;
        setTableOption({ ...tableOptionTemplet });
    }
    return (
        <>
            <Breadcrumb option={breadcrumbOption}></Breadcrumb>
            <div className='d-flex justify-content-end' style={{flexWrap:'wrap'}}>
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
                    <div className='text-end'>
                        {selectedEmpFromLedger > 0 && salaryLedgerData?.length>0 && <ButtonBox type="back" text="Back To Ledger" onClickHandler={backToLedger} className="btn-sm"></ButtonBox>}
                    </div>
                    <TableView option={tableOption} />
                    {selectedEmpFromLedger === 0 &&
                      <div className='mb-3' style={{width: '100%',textAlign: 'right',display: 'flex', justifyContent: 'flex-end'}}>
                      <ul className="list-group"  style={{width: '23%'}}>
                          <li className="list-group-item d-flex justify-content-between align-items-center">
                             Total Qty
                              <span className="badge text-danger badge-pill">
                                  {
                                  common.printDecimal(common.calculateSum(tableOption?.data??[],"qty"))
                                  }
                              </span>
                          </li>
                          <li className="list-group-item d-flex justify-content-between align-items-center">
                             Total Amount
                              <span className="badge text-danger badge-pill">
                              {
                                  common.printDecimal(common.calculateSum(tableOption?.data??[],"amount"))
                                  }
                              </span>
                          </li>
                          <li className="list-group-item d-flex justify-content-between align-items-center">
                             Avg. Amount
                              <span className="badge text-danger badge-pill">
                              {
                                  common.printDecimal(common.calculateSum(tableOption?.data??[],"amount")/common.calculateSum(tableOption?.data??[],"qty"))
                                  }
                              </span>
                          </li>
                      </ul>
                  </div>
                    }
                </div>
            </div>
            <div className='d-none'>
                <PrintEmployeeSalarySlip ref={printSalarySlipRef} props={{ filter: filterData, data: tableOption.data }} />
            </div>
            <div className='d-none'>
                <PrintShortEmployeeSalarySlip ref={printSortSalarySlipRef} props={{ filter: filterData, data: tableOption.data }} />
            </div>
        </>
    )
}
