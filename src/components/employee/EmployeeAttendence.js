import React, { useState, useEffect, useRef } from 'react'
import { toast } from 'react-toastify';
import { Api } from '../../apis/Api';
import { apiUrls } from '../../apis/ApiUrls';
import { toastMessage } from '../../constants/ConstantValues';
import { validationMessage } from '../../constants/validationMessage';
import { common } from '../../utils/common';
import Breadcrumb from '../common/Breadcrumb'
import Dropdown from '../common/Dropdown';
import ButtonBox from '../common/ButtonBox';
import ErrorLabel from '../common/ErrorLabel';
import Label from '../common/Label';
import TableView from '../tables/TableView'
import { useNavigate } from 'react-router-dom';
import { useReactToPrint } from 'react-to-print';
import { PrintMonthlySalaryReport } from '../print/employee/PrintMonthlySalaryReport';
import { headerFormat } from '../../utils/tableHeaderFormat';
import { PrintMonthlyAttendenceReport } from '../print/employee/PrintMonthlyAttendenceReport';
import InputModelBox from '../common/InputModelBox';
import AlertMessage from '../common/AlertMessage';
import Inputbox from '../common/Inputbox';

export default function EmployeeAttendence() {
    const employeeAttendenceModelTemplate = {
        id: 0,
        employeeId: 0,
        jobTitleId: 0,
        employeeName: "",
        month: new Date().getMonth() + 1,
        year: new Date().getFullYear(),
        day1: 1,
        day2: 1,
        day3: 1,
        day4: 1,
        day5: 1,
        day6: 1,
        day7: 1,
        day8: 1,
        day9: 1,
        day10: 1,
        day11: 1,
        day12: 1,
        day13: 1,
        day14: 1,
        day15: 1,
        day16: 1,
        day17: 1,
        day18: 1,
        day19: 1,
        day20: 1,
        day21: 1,
        day22: 1,
        day23: 1,
        day24: 1,
        day25: 1,
        day26: 1,
        day27: 1,
        day28: 1,
        day29: 1,
        day30: 1,
        day31: 1,
        overTime: 0,
        paidOn: common.getHtmlDate(new Date())
    };
    let navigate = useNavigate();
    const [employeeAttendenceModel, setEmployeeAttendenceModel] = useState(employeeAttendenceModelTemplate);
    const [isRecordSaving, setIsRecordSaving] = useState(true);
    const [pageNo, setPageNo] = useState(1);
    const [pageSize, setPageSize] = useState(20);
    const [daysOfAttendence, setDaysOfAttendence] = useState([]);
    const [daysBlocks, setDaysBlocks] = useState([1, 2, 3, 4]);
    const [workingDays, setWorkingDays] = useState(common.getDaysInMonth(employeeAttendenceModel.year, employeeAttendenceModel.month));
    const [empList, setEmpList] = useState([]);
    const [errors, setErrors] = useState({});
    const selectionTypeEnum = { all: 0, none: 1, invert: 2 };
    const [absentDays, setAbsentDays] = useState(0);
    const [monthlyAttendenceDataToPrint, setMonthlyAttendenceDataToPrint] = useState({});
    const [monthlySalaryDataToPrint, setMonthlySalaryDataToPrint] = useState({});
    const [holidayList, setHolidayList] = useState([]);
    const [selectedId, setSelectedId] = useState(0);
    const [jobTitleList, setJobTitleList] = useState([]);
    const [filter, setFilter] = useState({
        month: 0,
        year: 0,
    });
    const [fetchData, setFetchData] = useState(0);
    const [fetchAttData, setFetchAttData] = useState(0);
    const yearList = common.numberRanger(new Date().getFullYear(), new Date().getFullYear() - 10);
    const WEEKLY_OFF_DAY = JSON.parse(process.env.REACT_APP_WEEKLY_OFF_DAY);

    const handleDelete = (id) => {
        Api.Delete(apiUrls.monthlyAttendenceController.delete + id).then(res => {
            if (res.data === 1) {
                handleSearch('');
                toast.success(toastMessage.deleteSuccess);
            }
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
        if (type === 'checkbox') {
            value = checked ? 1 : 0;
        }
        if (name === "month") {
            var currDate = new Date();
            var currMonth = currDate.getMonth() + 1;
            var currYear = currDate.getFullYear();
            if (name === "month" && currYear === employeeModel.year && currMonth < value) {
                toast.warn(toastMessage.invalidMonthSelection);
                return
            }
        }
        // if (name === "month" || name === "year" || name === "employeeId") {
        //     var empId = name === "employeeId" ? value : employeeAttendenceModel.employeeId;
        //     var month = name === "month" ? value : employeeAttendenceModel.month;
        //     var year = name === "year" ? value : employeeAttendenceModel.year;

        //     return;
        // }


        employeeModel[name] = value;
        employeeModel = calculateSalary(employeeModel);
        setEmployeeAttendenceModel({ ...employeeModel });
        if (!!errors[e.target.name]) {
            setErrors({ ...errors, [e.target.name]: null })
        }
    }

    const getEmpAttendance = () => {
        var employeeModel = employeeAttendenceModel;
        Api.Get(apiUrls.monthlyAttendenceController.getByEmpIdMonthYear + `${employeeAttendenceModel.employeeId}/${employeeAttendenceModel.month}/${employeeAttendenceModel.year}`)
            .then(res => {
                employeeModel = calculateSalary(res.data);
                employeeModel = setDefaultAttendence(employeeModel);
                setEmployeeAttendenceModel({ ...employeeModel });
                setErrors({});
            }).catch(err => {
                for (let day = 1; day < 32; day++) {
                    employeeModel[`day${day}`] = false;
                }
                // employeeModel[name] = value;
                employeeModel.advance = 0;
                employeeModel = calculateSalary(employeeModel);
                setEmployeeAttendenceModel({ ...employeeModel });
            });
    }
    const handleSave = () => {
        const formError = validateError();
        if (Object.keys(formError).length > 0) {
            setErrors(formError);
            return
        }
        let data = employeeAttendenceModel;
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
                setEmployeeAttendenceModel({ ...res.data });
                setIsRecordSaving(false);
            }
        });
    }

    const printMonthlySalaryRef = useRef();
    const printMonthlyAttendenceRef = useRef();

    const PrintMonthlySalaryHandlerMain = (id, data) => {
        data.workingDays = data?.workingDays;
        data.holidayList = holidayList;
        setMonthlySalaryDataToPrint(data, PrintMonthlySalaryHandler());
    }

    const PrintMonthlyAttendenceHandlerMain = (id, data) => {
        data.workingDays = data?.workingDays;
        data.holidayList = holidayList;
        setMonthlyAttendenceDataToPrint(data, PrintMonthlyAttendenceHandler());
    }

    const setSelectedPaymentId = (id, data) => {
        if (data?.isPaid === true) {
            toast.warn("Salary is already paid!");
            return;
        }
        setSelectedId({ id: id, netSalary: data?.netSalary });
    }

    const payMonthlySalary = (data, paidOn) => {
        if (!data?.id) {
            toast.warn("Please select the attendeance record!");
            return;
        }
        Api.Post(apiUrls.employeeController.payMonthlySalary + `${paidOn}/${data?.id}/${data?.netSalary}`, {})
            .then(res => {
                if (res.data > 0)
                    toast.success(toastMessage.updateSuccess);
                else
                    toast.warn(toastMessage.updateError);
            })
    }

    const PrintMonthlySalaryHandler = useReactToPrint({
        content: () => printMonthlySalaryRef.current,
    });

    const PrintMonthlyAttendenceHandler = useReactToPrint({
        content: () => printMonthlyAttendenceRef.current,
    });

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
                },
                {
                    title: 'Pay Monthly Salary',
                    handler: setSelectedPaymentId,
                    icon: 'bi bi-coin',
                    className: 'text-danger',
                    modelId: "confirm-salary-payment",
                    showModel: true
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
                text: "Daily",
                icon: 'bx bx-plus',
                handler: redirectHandler
            },
            {
                text: "Monthly",
                icon: 'bx bx-plus',
                modelId: 'employee-attendence',
                handler: saveButtonHandler
            }
        ]
    }

    const appendBlankDays = (year, month) => {
        let days = [];
        for (let index = 0; index < new Date(`${year}-${month}-01`).getDay(); index++) {
            days.push(undefined);
        }
        return days;
    }

    useEffect(() => {
        if (fetchAttData === 0)
            return
        var formErrors = validateError();
        if (Object.keys(formErrors).length > 0) {
            setErrors(formErrors);
            return;
        }
        setErrors({});
        var days = appendBlankDays(employeeAttendenceModel.year, employeeAttendenceModel.month);
        var totalWeeklyOff = 0;
        var daysInMonth = common.getDaysInMonth(employeeAttendenceModel.year, employeeAttendenceModel.month);
        for (var d = 1; d <= daysInMonth; d++) {
            var monthDate = new Date(`${employeeAttendenceModel.year}-${employeeAttendenceModel.month}-${d}`);
            if (WEEKLY_OFF_DAY.indexOf(monthDate.getDay()) > -1) {
                // totalWeeklyOff += 1;
            }
            days.push(common.getHtmlDate(monthDate));
        }
        setDaysOfAttendence(days);

        Api.Get(apiUrls.holidayController.getHolidayByMonthYear + `${employeeAttendenceModel.month}/${employeeAttendenceModel.year}`)
            .then(res => {
                setHolidayList(res.data);
                setWorkingDays(daysInMonth - totalWeeklyOff - holidayList.length);
            });
        getEmpAttendance();
    }, [fetchAttData]);

    useEffect(() => {
        let url = apiUrls.monthlyAttendenceController.getAll + `?PageNo=${pageNo}&PageSize=${pageSize}`;
        if (filter.month > 0 && filter.year > 0 && fetchData > 0) {
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
                    element.transportation = element.employee.transportation;
                    element.otherAllowance = element.employee.otherAllowance;
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
    }, [pageNo, pageSize, fetchData]);

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
        let workingDays = common.daysInMonth(attedence.month, attedence.year);
        let totalAbsents = 0
        for (let day = 1; day <= workingDays; day++) {
            totalAbsents += (attedence['day' + day] === 0 || attedence['day' + day] === 2) ? 1 : 0; // Remove condition for 2 to enable weekly off
        }
        let obj = {
            present: workingDays - totalAbsents,
            absent: totalAbsents,
            perDaySalary: 0,
            totalDeduction: 0,
            netSalary: 0,
            workingDays: workingDays
        };
        if (workingDays > 0) {
            obj.perDaySalary = common.defaultIfIsNaN(attedence.employee.salary / workingDays, 0);
            obj.totalDeduction = attedence.advance + (obj.perDaySalary * obj.absent);
            obj.netSalary = attedence.employee.salary - obj.totalDeduction;
            obj.workingDays = workingDays;
        }
        return obj
    }

    const validateError = () => {
        const { employeeId, month, year } = employeeAttendenceModel;
        const newError = {};
        if (!employeeId || employeeId === 0) newError.employeeId = validationMessage.employeeRequired;
        if (!month || month === 0) newError.month = validationMessage.monthRequired;
        if (!year || year === 0) newError.year = validationMessage.monthRequired;
        return newError;
    }

    const handleCheckSelection = (selectionType) => {
        if (typeof selectionType === undefined)
            return;

        let model = employeeAttendenceModel;

        for (let day = 1; day < 32; day++) {
            var hday = isHoliday(`${employeeAttendenceModel.year}-${employeeAttendenceModel.month}-${day}`);
            if (hday.has) {
                model[`day${day}`] = hday.name === 'Weekly Off' ? 2 : 3;
            }
            else {
                switch (selectionType) {
                    case selectionTypeEnum.all:
                        model[`day${day}`] = 1;
                        break;
                    case selectionTypeEnum.none:
                        model[`day${day}`] = 0;
                        break;
                    case selectionTypeEnum.invert:
                        model[`day${day}`] = model[`day${day}`] === 0 ? 1 : 0;
                        break;
                }
            }
        }
        model = calculateSalary(model);
        setEmployeeAttendenceModel({ ...model });
    }

    const calculateSalary = (model) => {
        var data = model;
        var salary=data?.month_Salary===undefined?data?.employee?.salary:data?.month_Salary;
        var perDaySalary = salary / workingDays
        var netSalary = 0, totalSalary = 0, totalAbsents = 0;
        for (let day = 1; day <= workingDays; day++) {
            totalAbsents += (data['day' + day] === 0 || data['day' + day] === 2) ? 1 : 0; // Remove condition for 2 to enable weekly off
        }
        totalAbsents = totalAbsents > workingDays ? workingDays : totalAbsents;
        setAbsentDays(totalAbsents)
        netSalary = (salary - data.advance)
        totalSalary = netSalary - (totalAbsents * perDaySalary);
        data.totalNet = netSalary;
        data.totalSalary = totalSalary;
        return data;
    }

    useEffect(() => {
        let apiCalls = [];
        apiCalls.push(Api.Get(apiUrls.dropdownController.jobTitle));
        apiCalls.push(Api.Get(apiUrls.dropdownController.employee+'?onlyFixed=true'));
        Api.MultiCall(apiCalls)
            .then(res => {
                setEmpList([...res[1].data]);
                setJobTitleList([...res[0].data]);
            })
    }, []);

    const isHoliday = (date) => {
        var flag = {
            has: false,
            name: 'Weekly Off',
            value: 2,
        };
        // if (WEEKLY_OFF_DAY.indexOf(new Date(date).getDay()) > -1)
        //  flag.has = true; //remove to add weekly holiday in Calander
        if (holidayList) {
            var holiday = holidayList.find(x => x.holidayDate?.indexOf(date) > -1);
            if (holiday !== undefined) {
                flag.has = true;
                flag.name = holiday.holidayName;
                flag.value = 3;
            }
        }
        if (flag.has)
            setWorkingDays(workingDays - 1);
        return flag;
    }

    const setDefaultAttendence = (model) => {
        for (let index = 1; index <= 31; index++) {
            var date = new Date(`${employeeAttendenceModel.year}-${employeeAttendenceModel.month}-${index}`);
            if (WEEKLY_OFF_DAY.indexOf(date.getDay()) > -1)
                model['day' + index] = 2;
            if (holidayList.length > 0) {
                if (holidayList.find(x => common.getHtmlDate(x.holidayDate) === common.getHtmlDate(date)) !== undefined)
                    model['day' + index] = 3;
            }
        }
        return model;
    }

    const disableCheckbox = (ele) => {
        let hday = isHoliday(ele);
        if (employeeAttendenceModel?.isPaid)
            return true;
        else if (hday?.has)
            return true;
        return false;
    }

    return (
        <>
            <div style={{ display: 'none' }}>
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
                        <Dropdown data={common.dropdownArray(common.monthList, true)} className="form-control-sm" name="month" defaultText="Select Month" onChange={e => setFilter({ ...filter, ['month']: parseInt(e.target.value) })} value={filter.month} />
                    </div>
                    <div className="p-2 bd-highlight">
                        <Dropdown data={common.dropdownArray(yearList, true)} className="form-control-sm" name="year" defaultText="Select Year" onChange={e => setFilter({ ...filter, ['year']: (e.target.value) })} value={filter.year} />
                    </div>
                    <div className="p-2 bd-highlight">
                        <ButtonBox type="go" className="btn-sm" onClickHandler={() => { setFetchData(ele => ele + 1) }} />
                    </div>
                </div>
                <div style={{ margin: '0px' }}>
                    <i style={{ fontSize: '13px', marginRight: '9px' }} className='bi bi-person-x-fill text-warning'> Holiday</i>
                    <i style={{ fontSize: '13px', marginRight: '9px' }} className='bi bi-person-x-fill text-success'> Present</i>
                    <i style={{ fontSize: '13px', marginRight: '9px' }} className='bi bi-person-x-fill text-danger'> Absent</i>
                </div>
            </div>
            <hr />
            <TableView option={tableOption}></TableView>
            <div id="employee-attendence" className="modal fade in" tabIndex="-1" role="dialog" aria-labelledby="myModalLabel"
                aria-hidden="true">
                <div className="modal-dialog modal-lg">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h5 className="modal-title">Employee Attendence</h5>
                            <button type="button" className="btn-close" id='closePopupMonthlyAttendence' data-bs-dismiss="modal" aria-hidden="true"></button>
                            <h4 className="modal-title" id="myModalLabel"></h4>
                        </div>
                        <div className="modal-body">
                            <div className="form-horizontal form-material">
                                <div className="card">
                                    <div className="card-body">
                                        <div className="row g-3">
                                            {/* <div className="col-3">
                                                <Label text="Job Title" isRequired={true} />
                                                <Dropdown defaultValue='' className="form-control-sm" data={jobTitleList} name="jobTitleId" searchable={true} onChange={handleTextChange} value={employeeAttendenceModel.jobTitleId} defaultText="Select Job Title"></Dropdown>
                                                <ErrorLabel message={errors?.jobTitleId}></ErrorLabel>
                                            </div> */}
                                            <div className="col-6">
                                                <Label text="Employee Name" isRequired={true} />
                                                {/* <Dropdown defaultValue='0' data={empList.filter(x => x.data.jobTitleId === employeeAttendenceModel.jobTitleId)} name="employeeId" className="form-control-sm" searchable={true} onChange={handleTextChange} value={employeeAttendenceModel.employeeId} defaultText="Select employee"></Dropdown> */}
                                                <Dropdown defaultValue='0' data={empList??[]} name="employeeId" className="form-control-sm" searchable={true} onChange={handleTextChange} value={employeeAttendenceModel.employeeId} defaultText="Select employee"></Dropdown>
                                                <ErrorLabel message={errors?.employeeId}></ErrorLabel>
                                            </div>
                                            <div className="col-2">
                                                <Label text="Select Year" isRequired={true} />
                                                <Dropdown data={common.dropdownArray(yearList, true)} className="form-control-sm" name="year" defaultText="Select Year" onChange={e => handleTextChange(e)} value={employeeAttendenceModel.year} />
                                                <ErrorLabel message={errors?.year}></ErrorLabel>
                                            </div>
                                            <div className="col-2">
                                                <Label text="Select Month" isRequired={true} />
                                                <Dropdown data={common.dropdownArray(common.monthList, true)} className="form-control-sm" name="month" defaultText="Select Month" onChange={e => handleTextChange(e)} value={employeeAttendenceModel.month} />
                                                <ErrorLabel message={errors?.month}></ErrorLabel>
                                            </div>
                                            <div className="col-2 py-3" style={{marginTop: '20px'}}>
                                                <ButtonBox type="go" style={{width:'100%'}} className="btn-sm" onClickHandler={() => { setFetchAttData(ele => ele + 1) }} />
                                            </div>
                                            <div className="col-12 col-md-12">
                                                <div className='row'>
                                                    <div className='col-2'>
                                                        <h6 className="mb-0 text-uppercase">Days</h6>
                                                    </div>
                                                    <div className='col-10' style={{ textAlign: 'right' }}>
                                                        <div className="form-check form-check-inline">
                                                            <input disabled={disableCheckbox(employeeAttendenceModel) ? "disabled" : ""} className="form-check-input" name='chkSelection' onChange={e => handleCheckSelection(e.target.checked ? selectionTypeEnum.all : selectionTypeEnum.none)} type="checkbox" id="gridCheck2" />
                                                            <label className="form-check-label" htmlFor="gridCheck2">Select All</label>
                                                        </div>
                                                        <div className="form-check form-check-inline">
                                                            <input disabled={disableCheckbox(employeeAttendenceModel) ? "disabled" : ""} className="form-check-input" onChange={e => handleCheckSelection(selectionTypeEnum.invert)} type="checkbox" id="gridCheck2" />
                                                            <label className="form-check-label" name="chkSelection" htmlFor="gridCheck2">Invert Selection</label>
                                                        </div>
                                                    </div>
                                                </div>

                                                <hr />
                                                {employeeAttendenceModel?.isPaid && <AlertMessage type="info" message="Employee/Staff salary is already paid. You can't modify the attendance of selected period." />}
                                            </div>
                                            {daysOfAttendence?.length > 0 && <table>
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
                                                                    daysOfAttendence.map((ele, index) => {
                                                                        if (ele === undefined) {
                                                                            return <div key={index} style={{ width: '100px' }} className="text-center border border-secondary"></div>
                                                                        }
                                                                        else {
                                                                            let hday = isHoliday(ele);
                                                                            return <div key={index} style={{ width: '100px', minHeight: '50px', cursor: hday?.has ? 'not-allowed' : 'pointer' }} className={hday?.has ? "text-center border border-secondary bg-warning" : "text-center border border-secondary"}>
                                                                                {!hday.has && <input disabled={disableCheckbox(ele) ? "disabled" : ""} className="form-check-input" name={'day' + parseInt(ele.substr(8, 2)).toString()} onChange={e => handleTextChange(e)} checked={employeeAttendenceModel['day' + parseInt(ele.substr(8, 2)).toString()] === 1 || hday?.has ? 'checked' : ''} type="checkbox" id="gridCheck2" />}
                                                                                <span className='mx-1 fs-5 fw-bold'>{ele.substr(8, 2)}</span>
                                                                                {
                                                                                    hday?.has &&
                                                                                    <div style={{ fontSize: '11px' }}>
                                                                                        {hday.name}
                                                                                    </div>
                                                                                }
                                                                            </div>
                                                                        }
                                                                    })
                                                                }
                                                            </div>
                                                        </td>
                                                    </tr>

                                                </tbody>
                                            </table>
                                            }
                                            {daysOfAttendence?.length === 0 && <>
                                                <AlertMessage type="warn" message="Please fetch the employee/staff attendance." />
                                            </>}
                                            {/* {
                                                daysBlocks.map((bEle, bIndex) => {
                                                    return <div key={bIndex} className="col-3">
                                                        {
                                                            daysOfAttendence.map((ele, index) => {
                                                                if (index >= (bIndex * 10) && index <= (bIndex * 10) + 9)
                                                                    return <div key={index} className="form-check">
                                                                        <input disabled={disableBySelectedMonth(employeeAttendenceModel.month)? "disabled" : ""} className="form-check-input" name={'day' + parseInt(ele.substr(8, 2)).toString()} onChange={e => handleTextChange(e)} checked={employeeAttendenceModel['day' + parseInt(ele.substr(8, 2)).toString()] ? 'checked' : ''} type="checkbox" id="gridCheck2" />
                                                                        <label className="form-check-label" htmlFor="gridCheck2">
                                                                            {ele.substr(0, 4)}-{common.monthList[parseInt(ele.substr(5, 2)) - 1].substring(0, 3)}-{ele.substr(8, 2)}
                                                                        </label>
                                                                    </div>
                                                            })
                                                        }
                                                    </div>
                                                })
                                            } */}
                                            <div className='col-12'>
                                                <div className='row'>
                                                    <div className='col-6'>
                                                        <i className="bi bi-person-x fs-5 text-danger"></i>  Total Absents : <strong className='text-danger'> {absentDays}</strong>
                                                    </div>
                                                    <div className='col-6' style={{ textAlign: 'right' }}>
                                                        <i className="bi bi-person-check fs-5 text-success"></i> Total Present : <strong className='text-success'> {workingDays - absentDays}</strong>
                                                    </div>
                                                </div>
                                                <hr />
                                                
                                            <div className="col-4 text-end">
                                                <Inputbox type="number" min={0} max={1000000} labelText="Over Time" name="overTime" value={employeeAttendenceModel.overTime} onChangeHandler={handleTextChange} className="form-control-sm" />
                                            </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="modal-footer">
                            {!employeeAttendenceModel?.isPaid && <ButtonBox type={employeeAttendenceModel?.id === 0 ? "save" : "update"} onClickHandler={handleSave} className="btn-sm" />}
                            <ButtonBox type="cancel" modelDismiss={true} className="btn-sm" />
                        </div>
                    </div>
                </div>
            </div>
            <InputModelBox
                buttonText="Pay Salary"
                handler={payMonthlySalary}
                dataId={selectedId}
                message="Are you want to pay salary?"
                labelText="Salary Payemnt Date"
                modelId="confirm-salary-payment"
                buttonType="save"
                note="You will not able to modify Employee/Staff attendance for this month."
                title="Salary Payment Confirmation!"
                textboxType="date"
            />
        </>
    )
}
