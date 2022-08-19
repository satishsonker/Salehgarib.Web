import React, { useEffect, useState } from 'react'
import Breadcrumb from '../common/Breadcrumb'
import { useNavigate } from 'react-router-dom'
import { Api } from '../../apis/Api';
import { apiUrls } from '../../apis/ApiUrls';
import { common } from '../../utils/common';
import { toast } from 'react-toastify';
import { toastMessage } from '../../constants/ConstantValues';

export default function DailyAttendence() {
    const dailyAttendenceModel = {
        employeeId: 0,
        month: 0,
        year: 0
    }
    const [employeeList, setEmployeeList] = useState([]);
    const [dailyAttendenceData, setDailyAttendenceData] = useState([]);
    const selectionTypeEnum = { all: 0, none: 1, invert: 2 };
    const [attendenceDate, setAttendenceDate] = useState(common.getHtmlDate(new Date()))
    const navigate = useNavigate();
    const redirectHandler = () => {
        navigate('/employee-attendence');
    }

    const attendenceDateChangeHandler = (e) => {
        updateAttendenceData(dailyAttendenceData, e.target.value);
        setAttendenceDate(e.target.value);
    }

    const getEmployeeAttendence = (employeeId) => {
        let selectedDate = new Date(attendenceDate);
        let selectedDay = selectedDate.getDate();
        let employeeData = dailyAttendenceData.find(x => x.employeeId === employeeId);
        console.log(employeeData);
        return employeeData[`day${selectedDay}`];
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
                link: '/employee-attendence',
                title: "Monthly Attendence",
                icon: "bi bi-calendar-week"
            },
            {
                isActive: false,
                title: "Daily Attendence",
                icon: "bi bi-calendar-date"
            }
        ],
        buttons: [
            {
                text: "Monthly Attendence",
                icon: 'bx bx-plus',
                handler: redirectHandler
            }
        ]
    }

    const handleCheckSelection = (selectionType) => {
        if (typeof selectionType === undefined)
            return;

        // let model = employeeAttendenceModel;
        // for (let day = 1; day < 32; day++) {
        //     switch (selectionType) {
        //         case selectionTypeEnum.all:
        //             model[`day${day}`] = true;
        //             break;
        //         case selectionTypeEnum.none:
        //             model[`day${day}`] = false;
        //             break;
        //         case selectionTypeEnum.invert:
        //             model[`day${day}`] = !model[`day${day}`];
        //             break;
        //     }
        // }
        // model = calculateSalary(model);
        // setEmployeeAttendenceModel({ ...model });
    }
    useEffect(() => {
        Api.Get(apiUrls.employeeController.getAll + `?PageNo=1&PageSize=10000`)
            .then(res => {
                let data = res.data.data;
                setEmployeeList(data);
                updateAttendenceData(data);
            })
    }, []);
    const attendenceChangeHandler = (e, employeeId) => {
        debugger;
        let data = dailyAttendenceData;
        let selectedDate = new Date(attendenceDate);
        let selectedDay = selectedDate.getDate();
        let employeeData = data.find(x => x.employeeId === employeeId);
        employeeData[`day${selectedDay}`] = e.target.checked;
        console.log(employeeData);
        setDailyAttendenceData(data);
        setEmployeeList(common.cloneObject(employeeList));
    }
    const updateAttendenceData = (data, date) => {
        let attendenceData = [];
        let selectedDate = new Date(date === undefined ? attendenceDate : date);
        let selectedMonth = selectedDate.getMonth() + 1;
        let selectedYear = selectedDate.getFullYear();
        let selectedDay = selectedDate.getDate();
        data.forEach(element => {
            dailyAttendenceModel.employeeId = element.id===undefined?element.employeeId:element.id;
            dailyAttendenceModel.month = selectedMonth;
            dailyAttendenceModel.year = selectedYear;
            dailyAttendenceModel[`day${selectedDay}`] = true;
            attendenceData.push(common.cloneObject(dailyAttendenceModel));
        });
        setDailyAttendenceData(attendenceData);
    }
const saveAttendence=()=>{
    Api.Put(apiUrls.monthlyAttendenceController.addUpdateDailyAttendence,dailyAttendenceData)
    .then(res=>{
        if(res.data>=0)
        {
            toast.success(toastMessage.saveSuccess);
        }
    })
}
    return (<>
        <Breadcrumb option={breadcrumbOption} />
        <h6 className="mb-0 text-uppercase">Employee Daily Attendence</h6>
        <div className="col-12 col-md-12">
            <div className='row'>
                <div className='col-2'>  <h6 className="mb-0 text-uppercase"></h6></div>
                <div className='col-10' style={{ textAlign: 'right' }}>
                    <div className="form-check form-check-inline">
                        <input className="form-check-input" name='chkSelection' onChange={e => handleCheckSelection(e.target.checked ? selectionTypeEnum.all : selectionTypeEnum.none)} type="checkbox" id="gridCheck2" />
                        <label className="form-check-label" htmlFor="gridCheck2">Select All</label>
                    </div>
                    <div className="form-check form-check-inline">
                        <input className="form-check-input" onChange={e => handleCheckSelection(selectionTypeEnum.invert)} type="checkbox" id="gridCheck2" />
                        <label className="form-check-label" name="chkSelection" htmlFor="gridCheck2">Invert Selection</label>
                    </div>
                    <div className="form-check form-check-inline">
                        <label className="form-check-label" htmlFor="attendenceDate">Attendence Date</label>
                        <input className="form-control-sm" min={common.getHtmlDate(common.getFirstDateOfMonth())} max={common.getHtmlDate(new Date())} name='attendenceDate' value={attendenceDate} onChange={e => attendenceDateChangeHandler(e)} type="date" id="attendenceDate" />
                    </div>
                    <div className="form-check form-check-inline">
                        <button className='btn btn-sm btn-success' onClick={e=>saveAttendence()} ><i className="bi bi-cloud-arrow-up"></i> Save</button>
                    </div>
                </div>
            </div>

            <hr />
        </div>
        <table className="table table-striped table-bordered dataTable">
            <tbody>
                {
                    employeeList?.map((ele, index) => {
                        return <tr key={ele.id}>
                            <td>{ele.firstName + "  " + ele.lastName}</td>
                            <td>{ele.contact}</td>
                            <td>{ele.jobTitle}</td>
                            <td>
                                <div className="form-check form-switch">
                                    <input onChange={e => attendenceChangeHandler(e, ele.id)} checked={getEmployeeAttendence(ele.id) ? "checked" : ""} className="form-check-input" type="checkbox" id="flexSwitchCheckDefault" />
                                    <label className="form-check-label" htmlFor="flexSwitchCheckDefault">
                                    </label>
                                </div>
                            </td>
                        </tr>
                    })
                }
            </tbody>
        </table>
    </>
    )
}
