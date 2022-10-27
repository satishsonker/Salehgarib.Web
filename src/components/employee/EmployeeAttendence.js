import React, { useState, useEffect, useRef } from 'react'
import { toast } from 'react-toastify';
import { Api } from '../../apis/Api';
import { apiUrls } from '../../apis/ApiUrls';
import { toastMessage } from '../../constants/ConstantValues';
import { validationMessage } from '../../constants/validationMessage';
import { common } from '../../utils/common';
import Breadcrumb from '../common/Breadcrumb'
import Dropdown from '../common/Dropdown';
import ErrorLabel from '../common/ErrorLabel';
import Label from '../common/Label';
import TableView from '../tables/TableView'
import { useNavigate } from 'react-router-dom';
import { useReactToPrint } from 'react-to-print';
import { PrintMonthlySalaryReport } from '../print/employee/PrintMonthlySalaryReport';
import { headerFormat } from '../../utils/tableHeaderFormat';
import { PrintMonthlyAttendenceReport } from '../print/employee/PrintMonthlyAttendenceReport';

export default function EmployeeAttendence() {
    const employeeAttendenceModelTemplate = {
        id: 0,
        employeeId: 0,
        employeeName: "",
        month: new Date().getMonth() + 1,
        year: new Date().getFullYear(),
        day1: true,
        day2: true,
        day3: true,
        day4: true,
        day5: true,
        day6: true,
        day7: true,
        day8: true,
        day9: true,
        day10: true,
        day11: true,
        day12: true,
        day13: true,
        day14: true,
        day15: true,
        day16: true,
        day17: true,
        day18: true,
        day19: true,
        day20: true,
        day21: true,
        day22: true,
        day23: true,
        day24: true,
        day25: true,
        day26: true,
        day27: true,
        day28: true,
        day29: true,
        day30: true,
        day31: true
    };
    let navigate = useNavigate();
    const [employeeAttendenceModel, setEmployeeAttendenceModel] = useState(employeeAttendenceModelTemplate);
    const [isRecordSaving, setIsRecordSaving] = useState(true);
    const [pageNo, setPageNo] = useState(1);
    const [pageSize, setPageSize] = useState(10);
    const [daysOfAttendence, setDaysOfAttendence] = useState([]);
    const [daysBlocks, setDaysBlocks] = useState([1, 2, 3, 4]);
    const [empList, setEmpList] = useState([]);
    const [errors, setErrors] = useState({});
    const selectionTypeEnum = { all: 0, none: 1, invert: 2 };
    const [absentDays, setAbsentDays] = useState(0);
    const [monthlyAttendenceDataToPrint, setMonthlyAttendenceDataToPrint] = useState({});
    const [monthlySalaryDataToPrint, setMonthlySalaryDataToPrint] = useState({});
    const [filter, setFilter] = useState({
        month: 0,
        year: 0,
    });

    const handleDelete = (id) => {
        Api.Delete(apiUrls.monthlyAttendenceController.delete + id).then(res => {
            if (res.data === 1) {
                handleSearch('');
                toast.success(toastMessage.deleteSuccess);
            }
        }).catch(err => {
            toast.error(toastMessage.deleteError);
        });
    }
    const handleSearch = (searchTerm) => {
        if (searchTerm.length > 0 && searchTerm.length < 3)
            return;
        Api.Get(apiUrls.monthlyAttendenceController.search + `?PageNo=${pageNo}&PageSize=${pageSize}&SearchTerm=${searchTerm}`).then(res => {
            let attendenceData = res.data.data;
            attendenceData.forEach(element => {
                let countTotal = countAttendence(element);
                element.month = common.monthList[parseInt(element.month) - 1];
                element.basicSalary = element.employee.basicSalary;
                element.accomodation = element.employee.accomodation;
                element.advance = calculateAdvance(element.employee.employeeAdvancePayments, element.month, element.year);
                element.monthly_Salary = element.employee.accomodation + element.employee.basicSalary;
                element.netSalary = countTotal.netSalary;
                element.present = countTotal.present;
                element.absent = countTotal.absent;
                element.perDaySalary = countTotal.perDaySalary;
                element.totalDeduction = countTotal.totalDeduction;
                element.workingDays = countTotal.workingDays;
            })
            tableOptionTemplet.data = attendenceData;
            tableOptionTemplet.totalRecords = res.data.totalRecords;
            setTableOption({ ...tableOptionTemplet });
        }).catch(err => {

        });
    }
    const handleTextChange = (e) => {
        var employeeModel = employeeAttendenceModel;
        let selectedEmployeeData;
        var { name, value, type, checked } = e.target;
        if (type === 'number' || type === 'select-one') {
            value = parseInt(value);
            if (name === 'employeeId') {
                selectedEmployeeData = empList.find(x => x.id === value).data;

                employeeModel.basicSalary = selectedEmployeeData.basicSalary;
                employeeModel.accomodation = selectedEmployeeData.accomodation;
                employeeModel.month_Salary = selectedEmployeeData.salary;
            }
        }
        if (type === 'checkbox')
            value = checked;
        if (name === "month") {
            var currDate = new Date();
            var currMonth = currDate.getMonth() + 1;
            var currYear = currDate.getFullYear();
            if (name === "month" && currYear === employeeModel.year && currMonth < value) {
                toast.warn(toastMessage.invalidMonthSelection);
                return
            }
        }
        if (name === "month" || name === "year" || name === "employeeId") {
            var empId = name === "employeeId" ? value : employeeAttendenceModel.employeeId;
            var month = name === "month" ? value : employeeAttendenceModel.month;
            var year = name === "year" ? value : employeeAttendenceModel.year;
            Api.Get(apiUrls.monthlyAttendenceController.getByEmpIdMonthYear + `${empId}/${month}/${year}`)
                .then(res => {
                    employeeModel = calculateSalary(res.data);
                    setEmployeeAttendenceModel({ ...employeeModel });
                    setErrors({});
                }).catch(err => {
                    for (let day = 1; day < 32; day++) {
                        employeeModel[`day${day}`] = false;
                    }
                    employeeModel[name] = value;
                    employeeModel.advance = 0;
                    employeeModel = calculateSalary(employeeModel);
                    setEmployeeAttendenceModel({ ...employeeModel });
                });
            return;
        }


        employeeModel[name] = value;
        employeeModel = calculateSalary(employeeModel);
        setEmployeeAttendenceModel({ ...employeeModel });
        if (!!errors[e.target.name]) {
            setErrors({ ...errors, [e.target.name]: null })
        }
    }

    const handleSave = () => {
        const formError = validateError();
        if (Object.keys(formError).length > 0) {
            setErrors(formError);
            return
        }
        let data = common.assignDefaultValue(employeeAttendenceModelTemplate, employeeAttendenceModel);
        if (isRecordSaving) {
            data.id = 0;
            Api.Put(apiUrls.monthlyAttendenceController.add, data).then(res => {
                if (res.data.id > 0) {
                    toast.success(toastMessage.saveSuccess);
                    handleSearch('');
                    common.closePopup('closePopupMonthlyAttendence');
                }
            }).catch(err => {
                toast.error(toastMessage.saveError);
            });
        }
        else {
            Api.Post(apiUrls.monthlyAttendenceController.update, data).then(res => {
                if (res.data.id > 0) {
                    toast.success(toastMessage.updateSuccess);
                    handleSearch('');
                    common.closePopup('closePopupMonthlyAttendence');
                }
            }).catch(err => {
                toast.error(toastMessage.updateError);
            });
        }
    }
    const handleEdit = (id) => {

        Api.Get(apiUrls.monthlyAttendenceController.get + id).then(res => {
            if (res.data.id > 0) {
                setEmployeeAttendenceModel(res.data);
                setIsRecordSaving(false);
            }
        }).catch(err => {
            toast.error(toastMessage.getError);
        })
    }

    const printMonthlySalaryRef = useRef();
    const printMonthlyAttendenceRef = useRef();

    const PrintMonthlySalaryHandlerMain = (id, data) => {
        setMonthlySalaryDataToPrint(data);
        PrintMonthlySalaryHandler();
    }
    const PrintMonthlyAttendenceHandlerMain = (id, data) => {
        setMonthlyAttendenceDataToPrint({...data});
        PrintMonthlyAttendenceHandler();
    }
    const PrintMonthlySalaryHandler = useReactToPrint({
        content: () => printMonthlySalaryRef.current,
    });
    const PrintMonthlyAttendenceHandler = useReactToPrint({
        content: () => printMonthlyAttendenceRef.current,
    });
    //{ name: "Monthly Salary", prop: "month_Salary", action: { currency: 'د.إ', decimal: true } },
    const tableOptionTemplet = {
        headers: headerFormat.monthlyAttendence,
        data: [],
        totalRecords: 0,
        pageSize: pageSize,
        pageNo: pageNo,
        setPageNo: setPageNo,
        setPageSize: setPageSize,
        searchHandler: handleSearch,
        actions: {
            showView: false,
            showDelete: false,
            showEdit: false,
            showPrint: true,
            popupModelId: "employee-attendence",
            delete: {
                handler: handleDelete
            },
            edit: {
                handler: handleEdit
            },
            print: {
                handler: PrintMonthlySalaryHandlerMain,
                title: 'Print Monthly Salary'
            },
            buttons: [
                {
                    title: 'Print Employee Attendence',
                    handler: PrintMonthlyAttendenceHandlerMain,
                    icon: 'bi bi-printer',
                    className: 'text-warning'
                }
            ]
        }
    }

    const [tableOption, setTableOption] = useState(tableOptionTemplet);
    const saveButtonHandler = () => {
        setEmployeeAttendenceModel({ ...employeeAttendenceModelTemplate });
        setIsRecordSaving(true);
        setErrors({})
    }
    const redirectHandler = () => {
        navigate('/daily-attendence');
    }
    const breadcrumbOption = {
        title: 'Employee Attendence',
        items: [
            {
                link: "/employee-details",
                title: "Employee Details",
                icon: "bi bi-person-badge-fill"
            },
            {
                isActive: false,
                title: "Employee Attendence",
                icon: "bi bi-calendar-week"
            }
        ],
        buttons: [
            {
                text: "Daily Attendence",
                icon: 'bx bx-plus',
                handler: redirectHandler
            },
            {
                text: "Monthly Attendence",
                icon: 'bx bx-plus',
                modelId: 'employee-attendence',
                handler: saveButtonHandler
            }
        ]
    }
    useEffect(() => {
        var days = [], blockNo = 0, blockArray = [];
        for (var d = 1; d <= common.getDaysInMonth(employeeAttendenceModel.year, employeeAttendenceModel.month); d++) {
            days.push(common.getHtmlDate(new Date(`${employeeAttendenceModel.year}-${employeeAttendenceModel.month}-${d}`)));
        }
        setDaysOfAttendence(days);
        blockNo = days.length / 10;
        blockNo = blockNo > parseInt(blockNo) ? parseInt(blockNo) + 1 : parseInt(blockNo);
        for (let i = 0; i < blockNo; i++) {
            blockArray.push(i);
        }
        setDaysBlocks(blockArray);
    }, [employeeAttendenceModel.month, employeeAttendenceModel.year]);

    useEffect(() => {
        let url = apiUrls.monthlyAttendenceController.getAll + `?PageNo=${pageNo}&PageSize=${pageSize}`;
        if (filter.month > 0 && filter.year > 0) {
            url = apiUrls.monthlyAttendenceController.getByMonthYear + `${filter.month}/${filter.year}?PageNo=${pageNo}&PageSize=${pageSize}`
        }
        Api.Get(url)
            .then(res => {

                let attendenceData = res.data.data;
                attendenceData.forEach(element => {
                    let countTotal = countAttendence(element);
                    element.month = common.monthList[parseInt(element.month) - 1];
                    element.basicSalary = element.employee.basicSalary;
                    element.accomodation = element.employee.accomodation;
                    element.advance = calculateAdvance(element.employee.employeeAdvancePayments, element.month, element.year);
                    element.monthly_Salary = element.employee.accomodation + element.employee.basicSalary;
                    element.netSalary = countTotal.netSalary;
                    element.present = countTotal.present;
                    element.absent = countTotal.absent;
                    element.perDaySalary = countTotal.perDaySalary;
                    element.totalDeduction = countTotal.totalDeduction;
                    element.workingDays = countTotal.workingDays;
                })
                tableOptionTemplet.data = attendenceData;
                tableOptionTemplet.totalRecords = res.data.totalRecords;
                setTableOption({ ...tableOptionTemplet });
            });
    }, [pageNo, pageSize, filter]);

    const calculateAdvance = (advancePayments, month, year) => {
        if (!advancePayments || advancePayments.length === 0)
            return advancePayments.length;
        let emis = [];
        advancePayments.forEach(ele => {
            emis = emis.concat(ele.employeeEMIPayments)
        });
        if (emis.length === 0)
            return emis.length;

        let totalEmis = emis.filter(x => x.deductionMonth === common.monthList.indexOf(month) + 1 && x.deductionYear === year);
        if (totalEmis.length === 0)
            return totalEmis.length;
        let sum = 0;
        totalEmis.forEach(element => {
            sum += element.amount;
        });
        return sum;
    }
    const countAttendence = (attedence) => {
        let workingDays = common.getDaysInMonth(attedence.year, attedence.month);
        let obj = {
            present: 0,
            absent: 0,
            perDaySalary: 0,
            totalDeduction: 0,
            netSalary: 0,
            workingDays: 0
        };
        for (let index = 1; index <= workingDays; index++) {
            if (attedence['day' + index] === true) {
                obj.present += 1;
            }
            else
                obj.absent += 1;
        }
        obj.perDaySalary = attedence.employee.salary / workingDays;
        obj.totalDeduction = attedence.advance + (obj.perDaySalary * obj.absent);
        obj.netSalary = attedence.employee.salary - obj.totalDeduction;
        obj.workingDays = workingDays;

        return obj
    }

    const validateError = () => {
        const { employeeId } = employeeAttendenceModel;
        const newError = {};
        if (!employeeId || employeeId === 0) newError.employeeId = validationMessage.employeeRequired;
        return newError;
    }

    const handleCheckSelection = (selectionType) => {
        if (typeof selectionType === undefined)
            return;

        let model = employeeAttendenceModel;
        for (let day = 1; day < 32; day++) {
            switch (selectionType) {
                case selectionTypeEnum.all:
                    model[`day${day}`] = true;
                    break;
                case selectionTypeEnum.none:
                    model[`day${day}`] = false;
                    break;
                case selectionTypeEnum.invert:
                    model[`day${day}`] = !model[`day${day}`];
                    break;
            }
        }
        model = calculateSalary(model);
        setEmployeeAttendenceModel({ ...model });
    }

    const calculateSalary = (model) => {
        var data = model, daysInMonth = common.getDaysInMonth(data.year, data.month);
        var perDaySalary = data.month_Salary / daysInMonth
        var netSalary = 0, totalSalary = 0, totalAbsents = 0;
        for (let day = 1; day <= daysInMonth; day++) {
            totalAbsents += data['day' + day] ? 0 : 1;
        }
        totalAbsents = totalAbsents > daysInMonth ? daysInMonth : totalAbsents;
        setAbsentDays(totalAbsents)
        netSalary = (data.month_Salary - data.advance)
        totalSalary = netSalary - (totalAbsents * perDaySalary);
        data.totalNet = netSalary;
        data.totalSalary = totalSalary;
        return data;
    }

    useEffect(() => {
        Api.Get(apiUrls.dropdownController.employee)
            .then(res => {
                setEmpList([...res.data]);
            })
    }, []);


    return (
        <>
            <div style={{ display: 'block' }}>
                <PrintMonthlySalaryReport props={monthlySalaryDataToPrint} ref={printMonthlySalaryRef}></PrintMonthlySalaryReport>
            </div>
            <div style={{ display: 'none' }}>
                <PrintMonthlyAttendenceReport props={monthlyAttendenceDataToPrint} ref={printMonthlyAttendenceRef}></PrintMonthlyAttendenceReport>
            </div>
            <Breadcrumb option={breadcrumbOption}></Breadcrumb>

            <div className="row g-3">
                <div className="d-flex bd-highlight">
                    <div className="p-2 bd-highlight flex-grow-1">
                        <h6 className="mb-0 text-uppercase">Employee Attendence Details</h6>
                    </div>
                    <div className="p-2 bd-highlight">
                        <select className="form-control form-control-sm" name="month" onChange={e => setFilter({ ...filter, ['month']: e.target.value })} value={filter.month}>
                            <option value="0">Select Month</option>
                            {
                                common.monthList.map((ele, index) => {
                                    return <option key={ele} value={index + 1}>{ele}</option>
                                })
                            }
                        </select>
                    </div>
                    <div className="p-2 bd-highlight">
                        <select className="form-control form-control-sm" name="year" onChange={e => setFilter({ ...filter, ['year']: e.target.value })} value={filter.year}>
                            <option value="0">Select Year</option>
                            {
                                common
                                    .numberRanger(new Date().getFullYear() - 15, new Date().getFullYear())
                                    .map((ele, index) => {
                                        return <option key={ele} value={ele}>{ele}</option>
                                    })
                            }
                        </select>
                    </div>
                    <div className="p-2 bd-highlight">
                        <button className='btn-sm btn btn-danger' onClick={e => setFilter({ month: 0, year: 0 })}>Clear</button>
                    </div>
                </div>
            </div>
            <hr />
            <TableView option={tableOption}></TableView>
            <div id="employee-attendence" className="modal fade in" tabIndex="-1" role="dialog" aria-labelledby="myModalLabel"
                aria-hidden="true">
                <div className="modal-dialog modal-lg">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h5 className="modal-title">Employee Attendence Details</h5>
                            <button type="button" className="btn-close" id='closePopupMonthlyAttendence' data-bs-dismiss="modal" aria-hidden="true"></button>
                            <h4 className="modal-title" id="myModalLabel"></h4>
                        </div>
                        <div className="modal-body">
                            <form className="form-horizontal form-material">
                                <div className="card">
                                    <div className="card-body">
                                        <div className="row g-3">
                                            <div className="col-12 col-md-6">
                                                <label className="form-label">Select Month</label>
                                                <select className="form-control" name="month" onChange={e => handleTextChange(e)} value={employeeAttendenceModel.month}>
                                                    <option value="0">Select Month</option>
                                                    {
                                                        common.monthList.map((ele, index) => {
                                                            return <option key={ele} value={index + 1}>{ele}</option>
                                                        })
                                                    }
                                                </select>
                                            </div>
                                            <div className="col-12 col-md-6">
                                                <label className="form-label">Select Year</label>
                                                <select className="form-control" name="year" onChange={e => handleTextChange(e)} value={employeeAttendenceModel.year}>
                                                    <option value="0">Select Year</option>
                                                    {
                                                        common
                                                            .numberRanger(new Date().getFullYear() - 15, new Date().getFullYear())
                                                            .map((ele, index) => {
                                                                return <option key={ele} value={ele}>{ele}</option>
                                                            })
                                                    }
                                                </select>
                                            </div>
                                            <div className="col-12 col-md-12">
                                                <Label text="Employee Name" isRequired={true} />
                                                <Dropdown defaultValue='0' data={empList} name="employeeId" searchable={true} onChange={handleTextChange} value={employeeAttendenceModel.employeeId} defaultText="Select employee"></Dropdown>
                                                <ErrorLabel message={errors?.employeeId}></ErrorLabel>
                                            </div>
                                            <div className="col-12 col-md-12">
                                                <div className='row'>
                                                    <div className='col-2'>
                                                        <h6 className="mb-0 text-uppercase">Days</h6>
                                                    </div>
                                                    <div className='col-10' style={{ textAlign: 'right' }}>
                                                        <div className="form-check form-check-inline">
                                                            <input disabled={employeeAttendenceModel.month < new Date().getMonth() + 1 ? "disabled" : ""} className="form-check-input" name='chkSelection' onChange={e => handleCheckSelection(e.target.checked ? selectionTypeEnum.all : selectionTypeEnum.none)} type="checkbox" id="gridCheck2" />
                                                            <label className="form-check-label" htmlFor="gridCheck2">Select All</label>
                                                        </div>
                                                        <div className="form-check form-check-inline">
                                                            <input disabled={employeeAttendenceModel.month < new Date().getMonth() + 1 ? "disabled" : ""} className="form-check-input" onChange={e => handleCheckSelection(selectionTypeEnum.invert)} type="checkbox" id="gridCheck2" />
                                                            <label className="form-check-label" name="chkSelection" htmlFor="gridCheck2">Invert Selection</label>
                                                        </div>
                                                    </div>
                                                </div>

                                                <hr />
                                            </div>
                                            {
                                                daysBlocks.map((bEle, bIndex) => {
                                                    return <div key={bIndex} className="col-3">
                                                        {
                                                            daysOfAttendence.map((ele, index) => {
                                                                if (index >= (bIndex * 10) && index <= (bIndex * 10) + 9)
                                                                    return <div key={index} className="form-check">
                                                                        <input disabled={employeeAttendenceModel.month < new Date().getMonth() + 1 ? "disabled" : ""} className="form-check-input" name={'day' + parseInt(ele.substr(8, 2)).toString()} onChange={e => handleTextChange(e)} checked={employeeAttendenceModel['day' + parseInt(ele.substr(8, 2)).toString()] ? 'checked' : ''} type="checkbox" id="gridCheck2" />
                                                                        <label className="form-check-label" htmlFor="gridCheck2">
                                                                            {ele.substr(0, 4)}-{common.monthList[parseInt(ele.substr(5, 2)) - 1].substring(0, 3)}-{ele.substr(8, 2)}
                                                                        </label>
                                                                    </div>
                                                            })
                                                        }
                                                    </div>
                                                })
                                            }
                                            <div className='col-12'>
                                                <div className='row'>
                                                    <div className='col-6'>
                                                        <i className="bi bi-person-x fs-5 text-danger"></i>  Total Absents : <strong className='text-danger'> {absentDays}</strong>
                                                    </div>
                                                    <div className='col-6' style={{ textAlign: 'right' }}>
                                                        <i className="bi bi-person-check fs-5 text-success"></i> Total Present : <strong className='text-success'> {common.getDaysInMonth(employeeAttendenceModel.year, employeeAttendenceModel.month) - absentDays}</strong>
                                                    </div>
                                                </div>
                                                <hr />
                                            </div>
                                        </div>

                                    </div>
                                </div>
                            </form>
                        </div>
                        <div className="modal-footer">
                            <button type="button" onClick={e => handleSave()} className="btn btn-info text-white waves-effect"> {isRecordSaving ? "Save" : "Update"}</button>
                            <button type="button" className="btn btn-danger waves-effect" id="closePopup" data-bs-dismiss="modal">Cancel</button>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}
