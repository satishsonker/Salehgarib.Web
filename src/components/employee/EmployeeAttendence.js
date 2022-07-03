import React, { useState, useEffect } from 'react'
import { toast } from 'react-toastify';
import { Api } from '../../apis/Api';
import { apiUrls } from '../../apis/ApiUrls';
import { toastMessage } from '../../constants/ConstantValues';
import { common } from '../../utils/common';
import Breadcrumb from '../common/Breadcrumb'
import TableView from '../tables/TableView'

export default function EmployeeAttendence() {
    const employeeAttendenceModelTemplate = {
        "id": 0,
        "firstname": "",
        "lastname": "",
        "contact1": "",
        "contact2": "",
        "orderNo": 0,
        "accountId": "",
        "branch": "",
        "poBox": ""
    };
    const [employeeAttendenceModel, setEmployeeAttendenceModel] = useState(employeeAttendenceModelTemplate);
    const [isRecordSaving, setIsRecordSaving] = useState(true);
    const [pageNo, setPageNo] = useState(1);
    const [pageSize, setPageSize] = useState(10);
    const [filterRange, setFilterRange] = useState({
        fromDate: common.getHtmlDate(common.getFirstDateOfMonth()),
        toDate: common.getHtmlDate(common.getLastDateOfMonth())
    });
    const [daysOfAttendence, setDaysOfAttendence] = useState([]);
    const [daysBlocks, setDaysBlocks] = useState([1, 2, 3, 4]);
    const [empList, setEmpList] = useState([]);

    const handleDelete = (id) => {
        Api.Delete(apiUrls.customerController.delete + id).then(res => {
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
        Api.Get(apiUrls.customerController.search + `?PageNo=${pageNo}&PageSize=${pageSize}&SearchTerm=${searchTerm}`).then(res => {
            tableOptionTemplet.data = res.data.data;
            tableOptionTemplet.totalRecords = res.data.totalRecords;
            setTableOption({ ...tableOptionTemplet });
        }).catch(err => {

        });
    }

    const handleTextChange = (e) => {
        debugger;
        let targetName = e.target.name;
        var value = e.target.value;
        if (targetName === "fromDate" || targetName === "toDate") {
            var selectedDate = new Date(value);
            if (targetName === "fromDate" && new Date(filterRange.toDate) < selectedDate) {
                toast.warn(toastMessage.invalidFromDate);
                return
            }
            if (targetName === "toDate" && new Date(filterRange.fromDate) > selectedDate) {
                toast.warn(toastMessage.invalidToDate);
                return
            }
            setFilterRange({ ...filterRange, [targetName]: value });
            return;
        }
        if (e.target.type === 'number') {
            value = parseInt(e.target.value);
        }
        setEmployeeAttendenceModel({ ...employeeAttendenceModel, [targetName]: value });
    }
    const handleSave = () => {
        let data = common.assignDefaultValue(employeeAttendenceModelTemplate, employeeAttendenceModel);
        if (isRecordSaving) {
            Api.Put(apiUrls.customerController.add, data).then(res => {
                if (res.data.id > 0) {
                    toast.success(toastMessage.saveSuccess);
                    handleSearch('');
                }
            }).catch(err => {
                toast.error(toastMessage.saveError);
            });
        }
        else {
            Api.Post(apiUrls.customerController.update, data).then(res => {
                if (res.data.id > 0) {
                    toast.success(toastMessage.updateSuccess);
                    handleSearch('');
                }
            }).catch(err => {
                toast.error(toastMessage.updateError);
            });
        }
    }
    const handleEdit = (customerId) => {

        Api.Get(apiUrls.customerController.get + customerId).then(res => {
            if (res.data.id > 0) {
                setEmployeeAttendenceModel(res.data);
                setIsRecordSaving(false);
            }
        }).catch(err => {
            toast.error(toastMessage.getError);
        })
    }
    const tableOptionTemplet = {
        headers: [
            { name: "Lastname", prop: "lastname" },
            { name: "Contact1", prop: "contact1" },
            { name: "Contact2", prop: "contact2" },
            { name: "OrderNo", prop: "orderNo" },
            { name: "Customer", prop: "customer" }
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
        for (var d = new Date(filterRange.fromDate); d <= new Date(filterRange.toDate); d.setDate(d.getDate() + 1)) {
            days.push(common.getHtmlDate(new Date(d)));
            setDaysOfAttendence(days);
        }
        blockNo = days.length / 10;
        blockNo = blockNo > parseInt(blockNo) ? parseInt(blockNo) + 1 : parseInt(blockNo);
        for (let i = 0; i < blockNo; i++) {
            blockArray.push(i);
        }
        setDaysBlocks(blockArray);
    }, [filterRange.fromDate, filterRange.toDate]);

    useEffect(() => {
        let apiCalls = [];
        apiCalls.push(Api.Get(apiUrls.dropdownController.employee));
        Api.MultiCall(apiCalls).then(res => {
            if (res[0].data.length > 0)
                setEmpList([...res[0].data]);
        });
    }, [])

    return (
        <>
            <Breadcrumb option={breadcrumbOption}></Breadcrumb>
            <h6 className="mb-0 text-uppercase">Employee Attendence Details</h6>
            <hr />
            <TableView option={tableOption}></TableView>
            <div id="employee-attendence" className="modal fade in" tabIndex="-1" role="dialog" aria-labelledby="myModalLabel"
                aria-hidden="true">
               <div className="modal-dialog modal-xl">
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
                                                <label className="form-label">Select Date</label>
                                                <input type="date" className="form-control" name="fromDate" onChange={e => handleTextChange(e)} value={filterRange.fromDate} />
                                            </div>
                                            <div className="col-12 col-md-6">
                                                <label className="form-label">Select Date the between </label>
                                                <input type="date" className="form-control" name="toDate" onChange={e => handleTextChange(e)} value={filterRange.toDate} />
                                            </div>
                                            <div className="col-12 col-md-12">
                                                <label className="form-label">Employee Name</label>
                                                <select className="form-select" id="validationCustom04" required="">
                                                    <option value="0">Select employee</option>
                                                    {
                                                        empList.map((ele, index) => {
                                                            return <option key={index} value={ele.id}>{ele.value}</option>
                                                        })
                                                    }
                                                </select>
                                            </div>
                                            <div className="col-12 col-md-12">

                                                <h6 className="mb-0 text-uppercase">Days</h6>
                                                <hr />

                                            </div>
                                            {
                                                daysBlocks.map((bEle, bIndex) => {
                                                    return <div key={bIndex} className="col-3">
                                                        {
                                                            daysOfAttendence.map((ele, index) => {
                                                                    if(index>=(bIndex*10) && index<=(bIndex*10)+9)
                                                                return <div key={index} className="form-check">
                                                                    <input className="form-check-input" type="checkbox" id="gridCheck2" />
                                                                    <label className="form-check-label" for="gridCheck2">
                                                                        {ele}
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
                                                <label className="form-label">Basic Salary</label>
                                                <input type="number" className="form-control" />
                                            </div>

                                            <div className="col-12 col-md-6">
                                                <label className="form-label">Total Current</label>
                                                <input type="number" className="form-control" />
                                            </div>

                                            <div className="col-12 col-md-6">
                                                <label className="form-label">Allow./Accom.</label>
                                                <input type="number" className="form-control" />
                                            </div>
                                            <div className="col-12 col-md-6">
                                                <label className="form-label">Total Salary</label>
                                                <input type="number" className="form-control" />
                                            </div>
                                            <div className="col-12 col-md-6">
                                                <label className="form-label">Net Total</label>
                                                <input type="number" className="form-control" />
                                            </div>

                                        </form>

                                    </div>
                                </div>
                            </from>
                        </div>
                        <div className="modal-footer">
                            <button type="button" onClick={e => handleSave()} className="btn btn-info text-white waves-effect" data-bs-dismiss="modal"> {isRecordSaving ? "Save" : "Update"}</button>
                            <button type="button" className="btn btn-danger waves-effect" data-bs-dismiss="modal">Cancel</button>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}
