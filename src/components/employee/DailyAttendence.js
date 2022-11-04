import React, { useEffect, useState } from 'react'
import Breadcrumb from '../common/Breadcrumb'
import { useNavigate } from 'react-router-dom'
import { Api } from '../../apis/Api';
import { apiUrls } from '../../apis/ApiUrls';
import { common } from '../../utils/common';
import { toast } from 'react-toastify';
import { toastMessage } from '../../constants/ConstantValues';
import TableTop from '../tables/TableTop';

export default function DailyAttendence() {
    const dailyAttendenceModel = {
        employeeId: 0,
        month: 0,
        year: 0,
        day: 0
    }
    const [currentDateHoliday, setCurrentDateHoliday] = useState();
    const [employeeList, setEmployeeList] = useState([]);
    const [employeeListBackUp, setEmployeeListBackUp] = useState([])
    const [dailyAttendenceData, setDailyAttendenceData] = useState([]);
    const selectionTypeEnum = { all: 0, none: 1, invert: 2 };
    const [attendenceDate, setAttendenceDate] = useState(common.getHtmlDate(new Date()))
    const navigate = useNavigate();
    const redirectHandler = () => {
        navigate('/employee-attendence');
    }

    const attendenceDateChangeHandler = (e) => {
        let date = e.target.value;
        updateAttendenceData(dailyAttendenceData, date);
        setAttendenceDate(date);
    }

    const getEmployeeAttendence = (employeeId) => {
        let selectedDate = new Date(attendenceDate);
        let attDate = getSelectedDate(selectedDate);
        let employeeData = dailyAttendenceData.find(x => x.employeeId === employeeId);
        return employeeData[`day${attDate.selectedDay}`];
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
        let selectedDate = new Date(attendenceDate);
        let attDate = getSelectedDate(selectedDate);
        let model = dailyAttendenceData;
        for (let i = 0; i < dailyAttendenceData.length; i++) {
            switch (selectionType) {
                case selectionTypeEnum.all:
                    model[i][`day${attDate.selectedDay}`] = true;
                    break;
                case selectionTypeEnum.none:
                    model[i][`day${attDate.selectedDay}`] = false;
                    break;
                case selectionTypeEnum.invert:
                    model[i][`day${attDate.selectedDay}`] = !model[i][`day${attDate.selectedDay}`];
                    break;
            }
        }
        setDailyAttendenceData(model);
        setEmployeeList(common.cloneObject(employeeList));
    }

    useEffect(() => {
        Api.Get(apiUrls.employeeController.getAll + `?PageNo=1&PageSize=10000`)
            .then(res => {
                let data = res.data.data;
                setEmployeeList(data);
                updateAttendenceData(data);
                setEmployeeListBackUp(data);
            })
    }, []);

    useEffect(() => {
       // if (attendenceDate != '') {
        let apiList=[]
        apiList.push(Api.Get(apiUrls.monthlyAttendenceController.getDailyAttendence + `?attendenceDate=${attendenceDate}`));
        apiList.push( Api.Get(apiUrls.holidayController.getHolidayByDate + `?holidayDate=${attendenceDate}`))   
        Api.MultiCall(apiList).then(res => {
                let selectedDate = new Date(attendenceDate);
                let attDate = getSelectedDate(selectedDate);
                let data = res[0].data;
                let attData = dailyAttendenceData;
                data.forEach(element => {
                    var record = attData.find(x => x.employeeId === element.employeeId);
                    record[`day${attDate.selectedDay}`] = element[`day${attDate.selectedDay}`];
                    record.day = selectedDate.getDate();
                });
                setDailyAttendenceData(attData);
                setEmployeeList(common.cloneObject(employeeList));
                setCurrentDateHoliday(res[1].data);
            })
       // }
    }, [attendenceDate]);

    const attendenceChangeHandler = (e, employeeId) => {

        let data = dailyAttendenceData;
        let selectedDate = new Date(attendenceDate);
        let attDate = getSelectedDate(selectedDate);
        let employeeData = data.find(x => x.employeeId === employeeId);
        employeeData[`day${attDate.selectedDay}`] = e.target.checked;
        setDailyAttendenceData(data);
        setEmployeeList(common.cloneObject(employeeList));
    }

    const updateAttendenceData = (data, date, dayValue) => {
        let attendenceData = [];
        let selectedDate = new Date(date === undefined ? attendenceDate : date);

        let attDate = getSelectedDate(selectedDate);
        data.forEach(element => {
            dailyAttendenceModel.employeeId = element.id === undefined ? element.employeeId : element.id;
            dailyAttendenceModel.month = attDate.selectedMonth;
            dailyAttendenceModel.year = attDate.selectedYear;
            dailyAttendenceModel.day = attDate.selectedDay;
            dailyAttendenceModel[`day${attDate.selectedDay}`] = dayValue === undefined ? true : dayValue;
            attendenceData.push(common.cloneObject(dailyAttendenceModel));
        });
        setDailyAttendenceData(attendenceData);
    }

    const getSelectedDate = (date) => {
        return {
            selectedMonth: date.getMonth() + 1,
            selectedYear: date.getFullYear(),
            selectedDay: date.getDate()
        }
    }

    const saveAttendence = () => {
        Api.Put(apiUrls.monthlyAttendenceController.addUpdateDailyAttendence, dailyAttendenceData)
            .then(res => {
                if (res.data >= 0) {
                    toast.success(toastMessage.saveSuccess);
                }
            })
    }

    const searchEmployee = (searchTerm) => {

        searchTerm = searchTerm.toUpperCase();
        let filteredEmployee = employeeListBackUp.filter(x => x.firstName.indexOf(searchTerm) > -1 || x.lastName.indexOf(searchTerm) > -1 || x.contact.indexOf(searchTerm) > -1 || x.contact2.indexOf(searchTerm) > -1);
        setEmployeeList(filteredEmployee);
    }

    return (
        <>
            <Breadcrumb option={breadcrumbOption} />
            <h6 className="mb-0 text-uppercase">Employee Daily Attendence</h6>
            <div className="col-12 col-md-12">
                <div className='row'>
                    <div className='col-2'>  <h6 className="mb-0 text-uppercase"></h6>
                        <div className="form-check">
                            <input className="form-check-input" name='chkSelection' onClick={e => handleCheckSelection(e.target.checked ? selectionTypeEnum.all : selectionTypeEnum.none)} type="radio" id="gridCheck2" />
                            <label className="form-check-label" htmlFor="gridCheck2">Select All</label>
                        </div>
                        <div className="form-check">
                            <input className="form-check-input" name='chkSelection' onClick={e => handleCheckSelection(selectionTypeEnum.none)} type="radio" id="gridCheck2" />
                            <label className="form-check-label" htmlFor="gridCheck2">Select None</label>
                        </div>
                        <div className="form-check">
                            <input className="form-check-input" name="chkSelection" onClick={e => handleCheckSelection(selectionTypeEnum.invert)} type="radio" id="gridCheck2" />
                            <label className="form-check-label" name="chkSelection" htmlFor="gridCheck2">Invert Selection</label>
                        </div>
                    </div>
                    <div className='col-10' style={{ textAlign: 'right' }}>

                        <div className="form-check form-check-inline">
                            <label className="form-check-label" htmlFor="attendenceDate">Attendence Date : </label>
                            <input className="form-control-sm" min={common.getHtmlDate(common.getFirstDateOfMonth())} max={common.getHtmlDate(new Date())} name='attendenceDate' value={attendenceDate} onChange={e => attendenceDateChangeHandler(e)} type="date" id="attendenceDate" />
                        </div>
                        <div className="form-check form-check-inline">
                            <button className='btn btn-sm btn-success' onClick={e => saveAttendence()} ><i className="bi bi-cloud-arrow-up"></i> Save</button>
                        </div>
                    </div>
                </div>
                {currentDateHoliday != '' && currentDateHoliday != undefined && <div style={{fontSize:'11px'}} className='text-danger text-center'>Selected date has holiday {currentDateHoliday.holidayName} ({currentDateHoliday.holidayType}). You do not need to mark attendence</div>}
                <hr />
            </div>
            <TableTop searchHandler={searchEmployee} showPaging={false}></TableTop>
            <hr />
            <table className="table table-striped table-bordered dataTable">
                <thead>
                    <tr>
                        <th>Sr#</th>
                        <th>Employee Name</th>
                        <th>Contact Number</th>
                        <th>Job Title</th>
                        <th>Attendence Of {attendenceDate}</th>
                    </tr>
                </thead>
                <tbody>
                    {
                        employeeList.length === 0 &&
                        <tr>
                            <td style={{ textAlign: 'center' }} colSpan={5}>No Record Found</td>
                        </tr>
                    }
                    {
                        employeeList?.map((ele, index) => {
                            return <tr key={ele.id}>
                                <td>{index + 1}</td>
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
