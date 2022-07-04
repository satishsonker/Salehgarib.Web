import React, { useState, useEffect } from 'react'
import { toast } from 'react-toastify';
import { Api } from '../../apis/Api';
import { apiUrls } from '../../apis/ApiUrls';
import { toastMessage } from '../../constants/ConstantValues';
import { validationMessage } from '../../constants/validationMessage';
import { common } from '../../utils/common';
import Breadcrumb from '../common/Breadcrumb'
import ErrorLabel from '../common/ErrorLabel';
import Label from '../common/Label';
import TableView from '../tables/TableView'

export default function EmployeeAttendence() {
    const employeeAttendenceModelTemplate = {
        "id": 0,
        "employeeId": 0,
        "employeeName": "",
        "month_Salary": 0,
        "month": new Date().getMonth() + 1,
        "year": new Date().getFullYear(),
        "day1": false,
        "day2": false,
        "day3": false,
        "day4": false,
        "day5": false,
        "day6": false,
        "day7": false,
        "day8": false,
        "day9": false,
        "day10": false,
        "day11": false,
        "day12": false,
        "day13": false,
        "day14": false,
        "day15": false,
        "day16": false,
        "day17": false,
        "day18": false,
        "day19": false,
        "day20": false,
        "day21": false,
        "day22": false,
        "day23": false,
        "day24": false,
        "day25": false,
        "day26": false,
        "day27": false,
        "day28": false,
        "day29": false,
        "day30": false,
        "day31": false,
        "advance": 0,
        "totalNet": 0,
        "basicSalary": 0,
        "accomdation": 0,
        "totalSalary": 0
    };
    const [employeeAttendenceModel, setEmployeeAttendenceModel] = useState(employeeAttendenceModelTemplate);
    const [isRecordSaving, setIsRecordSaving] = useState(true);
    const [pageNo, setPageNo] = useState(1);
    const [pageSize, setPageSize] = useState(10);
    const [daysOfAttendence, setDaysOfAttendence] = useState([]);
    const [daysBlocks, setDaysBlocks] = useState([1, 2, 3, 4]);
    const [empList, setEmpList] = useState([]);
    const [errors, setErrors] = useState({});
    const selectionTypeEnum={all:0,none:1,invert:2};

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
            tableOptionTemplet.data = res.data.data;
            tableOptionTemplet.totalRecords = res.data.totalRecords;
            setTableOption({ ...tableOptionTemplet });
        }).catch(err => {

        });
    }
    const handleTextChange = (e) => {
        var { name, value, type,checked } = e.target;
        if (type === 'number' || type === 'select-one') {
            value = parseInt(value);
        }
        if (type === 'checkbox')
            value = checked;
        if (name === "month") {
            var currDate = new Date();
            var currMonth = currDate.getMonth() + 1;
            var currYear = currDate.getFullYear();
            if (name === "month" && currYear === employeeAttendenceModel.year && currMonth < value) {
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
                    setEmployeeAttendenceModel({ ...res.data });

                }).catch(err => {
                    let model = employeeAttendenceModel;
                    for (let day = 1; day < 32; day++) {
                        model[`day${day}`] = false;
                    }
                    model[name] = value;
                    setEmployeeAttendenceModel({ ...model });
                });
            return;
        }

        setEmployeeAttendenceModel({ ...employeeAttendenceModel, [name]: value });
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
            Api.Put(apiUrls.monthlyAttendenceController.add, data).then(res => {
                if (res.data.id > 0) {
                    toast.success(toastMessage.saveSuccess);
                    handleSearch('');
                    common.closePopup();
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
                    common.closePopup();
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
    const replaceAction = { replace: { "true": "Yes", "false": "No" } }
    const tableOptionTemplet = {
        headers: [
            { name: "Employee Name", prop: "employeeName" },
            { name: "Monthly Salary", prop: "month_Salary", action: { currency: 'د.إ' } },
            { name: "Basic Salary", prop: "basicSalary", action: { currency: 'د.إ' } },
            { name: "Accomdation", prop: "accomdation" },
            { name: "Advance", prop: "advance", action: { currency: 'د.إ' } },
            { name: "Total Net", prop: "totalNet", action: { currency: 'د.إ' } },
            { name: "Total Salary", prop: "totalSalary", action: { currency: 'د.إ' } },
            { name: "Month", prop: "month" },
            { name: "Year", prop: "year" },
            { name: "Day 1", prop: "day1", action: replaceAction },
            { name: "Day 2", prop: "day2", action: replaceAction },
            { name: "Day 3", prop: "day3", action: replaceAction },
            { name: "Day 4", prop: "day4", action: replaceAction },
            { name: "Day 5", prop: "day5", action: replaceAction },
            { name: "Day 6", prop: "day6", action: replaceAction },
            { name: "Day 7", prop: "day7", action: replaceAction },
            { name: "Day 8", prop: "day8", action: replaceAction },
            { name: "Day 9", prop: "day9", action: replaceAction },
            { name: "Day 10", prop: "day10", action: replaceAction },
            { name: "Day 11", prop: "day11", action: replaceAction },
            { name: "Day 12", prop: "day12", action: replaceAction },
            { name: "Day 13", prop: "day13", action: replaceAction },
            { name: "Day 14", prop: "day14", action: replaceAction },
            { name: "Day 15", prop: "day15", action: replaceAction },
            { name: "Day 16", prop: "day16", action: replaceAction },
            { name: "Day 17", prop: "day17", action: replaceAction },
            { name: "Day 18", prop: "day18", action: replaceAction },
            { name: "Day 19", prop: "day19", action: replaceAction },
            { name: "Day 20", prop: "day20", action: replaceAction },
            { name: "Day 21", prop: "day21", action: replaceAction },
            { name: "Day 22", prop: "day22", action: replaceAction },
            { name: "Day 23", prop: "day23", action: replaceAction },
            { name: "Day 24", prop: "day24", action: replaceAction },
            { name: "Day 25", prop: "day25", action: replaceAction },
            { name: "Day 26", prop: "day26", action: replaceAction },
            { name: "Day 27", prop: "day27", action: replaceAction },
            { name: "Day 28", prop: "day28", action: replaceAction },
            { name: "Day 29", prop: "day29", action: replaceAction },
            { name: "Day 30", prop: "day30", action: replaceAction },
            { name: "Day 31", prop: "day31", action: replaceAction },
        ],
        data: [],
        totalRecords: 0,
        pageSize: pageSize,
        pageNo: pageNo,
        setPageNo: setPageNo,
        setPageSize: setPageSize,
        searchHandler: handleSearch,
        actions: {
            showView: false,
            popupModelId: "employee-attendence",
            delete: {
                handler: handleDelete
            },
            edit: {
                handler: handleEdit
            }
        }
    }

    const [tableOption, setTableOption] = useState(tableOptionTemplet);
    const saveButtonHandler = () => {
        setEmployeeAttendenceModel({ ...employeeAttendenceModelTemplate });
        setIsRecordSaving(true);
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
                text: "Employee Attendence",
                icon: 'bx bx-plus',
                modelId: 'employee-attendence',
                handler: saveButtonHandler
            }
        ]
    }
    useEffect(() => {
        var days = [], blockNo = 0, blockArray = [];
        var startDate = new Date(`${employeeAttendenceModel.year}-${employeeAttendenceModel.month}-01`);
        var endDate = new Date(common.getLastDateOfMonth(employeeAttendenceModel.month, employeeAttendenceModel.year));
        for (var d = startDate; d <= endDate; d.setDate(d.getDate() + 1)) {
            days.push(common.getHtmlDate(new Date(d)));
            setDaysOfAttendence(days);
        }
        blockNo = days.length / 10;
        blockNo = blockNo > parseInt(blockNo) ? parseInt(blockNo) + 1 : parseInt(blockNo);
        for (let i = 0; i < blockNo; i++) {
            blockArray.push(i);
        }
        setDaysBlocks(blockArray);
    }, [employeeAttendenceModel.month, employeeAttendenceModel.year]);

    useEffect(() => {
        let apiCalls = [];
        apiCalls.push(Api.Get(apiUrls.dropdownController.employee));
        apiCalls.push(Api.Get(apiUrls.monthlyAttendenceController.getAll + `?PageNo=${pageNo}&PageSize=${pageSize}`))
        Api.MultiCall(apiCalls).then(res => {
            if (res[0].data.length > 0)
                setEmpList([...res[0].data]);
            tableOptionTemplet.data = res[1].data.data;
            tableOptionTemplet.totalRecords = res[1].data.totalRecords;
            setTableOption({ ...tableOptionTemplet });
        });
    }, []);

    const validateError = () => {
        const { employeeId, basicSalary, month_Salary, totalNet, totalSalary } = employeeAttendenceModel;
        const newError = {};
        if (!employeeId || employeeId === 0) newError.employeeId = validationMessage.employeeRequired;
        if (!basicSalary || basicSalary === 0) newError.basicSalary = validationMessage.basicSalaryRequired;
        if (!month_Salary || month_Salary === 0) newError.month_Salary = validationMessage.monthlySalaryRequired;
        if (!totalNet || totalNet === 0) newError.totalNet = validationMessage.netSalaryRequired;
        if (!totalSalary || totalSalary === 0) newError.totalSalary = validationMessage.totalSalaryRequired;

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
        setEmployeeAttendenceModel({...model});
    }
    return (
        <>
            <Breadcrumb option={breadcrumbOption}></Breadcrumb>
            <h6 className="mb-0 text-uppercase">Employee Attendence Details</h6>
            <hr />
            <TableView option={tableOption}></TableView>
            <div id="employee-attendence" className="modal fade in" tabIndex="-1" role="dialog" aria-labelledby="myModalLabel"
                aria-hidden="true">
                <div className="modal-dialog modal-lg">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h5 className="modal-title">Employee Attendence Details</h5>
                            <button type="button" className="btn-close" data-bs-dismiss="modal" aria-hidden="true"></button>
                            <h4 className="modal-title" id="myModalLabel"></h4>
                        </div>
                        <div className="modal-body">
                            <from className="form-horizontal form-material">
                                <div className="card">
                                    <div className="card-body">


                                        <form className="row g-3">
                                            <div className="col-12 col-md-6">
                                                <label className="form-label">Select Month</label>
                                                <select className="form-control" name="month" onChange={e => handleTextChange(e)} value={employeeAttendenceModel.month}>
                                                    <option value="0">Select Month</option>
                                                    {
                                                        common.monthList.map((ele, index) => {
                                                            return <option value={index + 1}>{ele}</option>
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
                                                                return <option value={ele}>{ele}</option>
                                                            })
                                                    }
                                                </select>
                                            </div>
                                            <div className="col-12 col-md-12">
                                                <Label text="Employee Name" isRequired={true} />
                                                <select className="form-select" name='employeeId' value={employeeAttendenceModel.employeeId} onChange={e => handleTextChange(e)}>
                                                    <option value="0">Select employee...</option>
                                                    {
                                                        empList.map((ele, index) => {
                                                            return <option key={index} value={ele.id}>{ele.value}</option>
                                                        })
                                                    }
                                                </select>
                                                <ErrorLabel message={errors?.employeeId}></ErrorLabel>
                                            </div>
                                            <div className="col-12 col-md-12">
                                                <div className='row'>
                                                    <div className='col-2'>  <h6 className="mb-0 text-uppercase">Days</h6></div>
                                                    <div className='col-10' style={{ textAlign: 'right' }}>
                                                        <div className="form-check form-check-inline">
                                                            <input className="form-check-input" name='chkSelection' onChange={e=>handleCheckSelection(e.target.checked?selectionTypeEnum.all:selectionTypeEnum.none)} type="checkbox" id="gridCheck2" />
                                                            <label className="form-check-label" htmlFor="gridCheck2">Select All</label>
                                                        </div>
                                                        <div className="form-check form-check-inline">
                                                            <input className="form-check-input" onChange={e=>handleCheckSelection(selectionTypeEnum.invert)} type="checkbox" id="gridCheck2" />
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
                                                                        <input className="form-check-input" name={'day' + parseInt(ele.substr(8, 2)).toString()} onChange={e => handleTextChange(e)} checked={employeeAttendenceModel['day' + parseInt(ele.substr(8, 2)).toString()] ? 'checked' : ''} type="checkbox" id="gridCheck2" />
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

                                            </div>
                                            <div className="col-12 col-md-6">
                                                <Label text="Monthly Salary" isRequired={true} />
                                                <input onChange={e => handleTextChange(e)} name="month_Salary" value={employeeAttendenceModel.month_Salary} type="number" className="form-control" />
                                                <ErrorLabel message={errors?.month_Salary} />
                                            </div>
                                            <div className="col-12 col-md-6">
                                                <Label text="Basic Salary" isRequired={true} />
                                                <input onChange={e => handleTextChange(e)} name="basicSalary" value={employeeAttendenceModel.basicSalary} type="number" className="form-control" />
                                                <ErrorLabel message={errors?.basicSalary} />
                                            </div>
                                            <div className="col-12 col-md-6">
                                                <label className="form-label">Advance</label>
                                                <input onChange={e => handleTextChange(e)} name="advance" value={employeeAttendenceModel.advance} type="number" className="form-control" />
                                            </div>
                                            <div className="col-12 col-md-6">
                                                <label className="form-label">Allow./Accom.</label>
                                                <input type="number" onChange={e => handleTextChange(e)} value={employeeAttendenceModel.accomdation} name="accomdation" className="form-control" />
                                            </div>
                                            <div className="col-12 col-md-6">
                                                <Label text="Total Salary" isRequired={true} />
                                                <input type="number" onChange={e => handleTextChange(e)} value={employeeAttendenceModel.totalSalary} name='totalSalary' className="form-control" />
                                                <ErrorLabel message={errors?.totalSalary} />
                                            </div>
                                            <div className="col-12 col-md-6">
                                                <Label text="Net Salary" isRequired={true} />
                                                <input type="number" onChange={e => handleTextChange(e)} value={employeeAttendenceModel.totalNet} name='totalNet' className="form-control" />
                                                <ErrorLabel message={errors?.totalNet} />
                                            </div>

                                        </form>

                                    </div>
                                </div>
                            </from>
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
