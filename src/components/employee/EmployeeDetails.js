import React, { useState, useEffect } from 'react'
import { toast } from 'react-toastify';
import { Api } from '../../apis/Api';
import { apiUrls } from '../../apis/ApiUrls';
import { toastMessage } from '../../constants/ConstantValues';
import { common } from '../../utils/common';
import Breadcrumb from '../common/Breadcrumb'
import TableView from '../tables/TableView'

export default function EmployeeDetails() {
    const employeeModelTemplate = {
        "id": 0,
        "firstName": '',
        "lastName": '',
        "salary": 0,
        "hireDate": undefined,
        "country": '',
        "contact": '',
        "expertId": 0,
        "expert": "string",
        "passportNumber": '',
        "passportExpiryDate": undefined,
        "workPermitID": '',
        "workPEDate": undefined,
        "residentPDExpire": undefined,
        "address": '',
        "leval": 0,
        "accountId": 0,
        "accountAdvanceId": 0,
        "jobTitleId": 0,
        "jobTitle": "",
        "basicSalry": 0,
        "accom": 0,
        "medicalExpiryDate": undefined,
        "status": '',
        "location": '',
    }
    const [employeeModel, setEmployeeModel] = useState(employeeModelTemplate);
    const [isRecordSaving, setIsRecordSaving] = useState(true);
    const [pageNo, setPageNo] = useState(1);
    const [pageSize, setPageSize] = useState(10);
    const [jobTitles, setJobTitles] = useState([]);
    const [experties, setExperties] = useState([])
    const handleDelete = (id) => {
        Api.Delete(apiUrls.employeeController.delete + id).then(res => {
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
        Api.Get(apiUrls.employeeController.search + `?PageNo=${pageNo}&PageSize=${pageSize}&SearchTerm=${searchTerm}`).then(res => {
            tableOptionTemplet.data = res.data.data;
            tableOptionTemplet.totalRecords = res.data.totalRecords;
            setTableOption({ ...tableOptionTemplet });
        }).catch(err => {

        });
    }

    const handleTextChange = (e) => {
        var value = e.target.value;
        if (e.target.type === 'number' || e.target.type === 'select-one') {
            value = parseInt(e.target.value);
        }
        setEmployeeModel({ ...employeeModel, [e.target.name]: value });
    }
    const handleSave = () => {
        let data = common.assignDefaultValue(employeeModelTemplate, employeeModel);
        if (isRecordSaving) {
            Api.Put(apiUrls.employeeController.add, data).then(res => {
                if (res.data.id > 0) {
                    toast.success(toastMessage.saveSuccess);
                    handleSearch('');
                }
            }).catch(err => {
                toast.error(toastMessage.saveError);
            });
        }
        else {
            Api.Post(apiUrls.employeeController.update, employeeModel).then(res => {
                if (res.data.id > 0) {
                    toast.success(toastMessage.updateSuccess);
                    handleSearch('');
                }
            }).catch(err => {
                toast.error(toastMessage.updateError);
            });
        }
    }
    const handleEdit = (employeeId) => {
        setIsRecordSaving(false);
        Api.Get(apiUrls.employeeController.get + employeeId).then(res => {
            if (res.data.id > 0) {
                setEmployeeModel(res.data);
            }
        }).catch(err => {
            toast.error(toastMessage.getError);
        })
    };

    const tableOptionTemplet = {
        headers: [
            { name: 'First Name', prop: 'firstName' },
            { name: 'Last Name', prop: 'lastName' },
            { name: 'Salary', prop: 'salary' },
            { name: 'Hire Date', prop: 'hireDate' },
            { name: 'Country', prop: 'country' },
            { name: 'Contact', prop: 'contact' },
            { name: 'Experties', prop: 'expert' },
            { name: 'Passport Number', prop: 'passportNumber' },
            { name: 'Passport Expiry Date', prop: 'passportExpiryDate' },
            { name: 'WorkPermit ID', prop: 'workPermitID' },
            { name: 'Work Permit Expire', prop: 'workPEDate' },
            { name: 'Resident Permit Expire', prop: 'residentPDExpire' },
            { name: 'Address', prop: 'address' },
            { name: 'Leval', prop: 'leval' },
            { name: 'Job Name', prop: 'jobTitle' },
            { name: 'Basic Salary', prop: 'basicSalry' },
            { name: 'Accom', prop: 'accom' },
            { name: 'Medical Expire', prop: 'medicalExpiryDate' },
            { name: 'Status', prop: 'status' },
            { name: 'Location', prop: 'location' }
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
            popupModelId: "add-employee",
            delete: {
                handler: handleDelete
            },
            edit: {
                handler: handleEdit
            }
        }
    };

    const saveButtonHandler = () => {

        setEmployeeModel({ ...employeeModelTemplate });
        setIsRecordSaving(true);
    }
    const [tableOption, setTableOption] = useState(tableOptionTemplet);
    const breadcrumbOption = {
        title: 'Employees',
        buttons: [
            {
                text: "EmployeeDeatils",
                icon: 'bx bx-plus',
                modelId: 'add-employee',
                handler: saveButtonHandler
            }
        ]
    }

    useEffect(() => {
        setIsRecordSaving(true);
        Api.Get(apiUrls.employeeController.getAll + `?PageNo=${pageNo}&PageSize=${pageSize}`).then(res => {
            tableOptionTemplet.data = res.data.data;
            tableOptionTemplet.totalRecords = res.data.totalRecords;
            setTableOption({ ...tableOptionTemplet });
        })
            .catch(err => {

            });
    }, [pageNo, pageSize]);

    useEffect(() => {
        if (isRecordSaving) {
            setEmployeeModel({ ...employeeModelTemplate });
        }
    }, [isRecordSaving])

    useEffect(() => {
        let apiCalls = [];
        apiCalls.push(Api.Get(apiUrls.dropdownController.jobTitle));
        apiCalls.push(Api.Get(apiUrls.dropdownController.experies));
        Api.MultiCall(apiCalls).then(res => {
            if (res[0].data.length > 0)
                setJobTitles([...res[0].data]);
            if (res[1].data.length > 0)
                setExperties([...res[1].data]);
        })
    }, [])


    return (
        <>
            <Breadcrumb option={breadcrumbOption}></Breadcrumb>
            <h6 className="mb-0 text-uppercase">Employee Deatils</h6>
            <hr />
            <TableView option={tableOption}></TableView>

            {/* <!-- Add Contact Popup Model --> */}
            <div id="add-employee" className="modal fade in" tabIndex="-1" role="dialog" aria-labelledby="myModalLabel" aria-hidden="true">
                <div className="modal-dialog modal-xl">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h5 className="modal-title">New Employees</h5>
                            <button type="button" className="btn-close" data-bs-dismiss="modal" aria-hidden="true"></button>
                        </div>
                        <div className="modal-body">
                            <div className="form-horizontal form-material">
                                <div className="card">
                                    <div className="card-body">
                                        <form className="row g-3">
                                            <div className="col-md-6">

                                                <label className="form-label">First Name</label>
                                                <input onChange={e => handleTextChange(e)} name="firstName" value={employeeModel.firstName} type="text" id='firstName' className="form-control" />
                                            </div>
                                            <div className="col-md-6">
                                                <label className="form-label">Last Name</label>
                                                <input onChange={e => handleTextChange(e)} name="lastName" value={employeeModel.lastName} type="text" className="form-control" />
                                            </div>
                                            <div className="col-md-6">
                                                <label className="form-label">Contact</label>
                                                <input onChange={e => handleTextChange(e)} type="text" name="contact" value={employeeModel.contact} className="form-control" />
                                            </div>
                                            <div className="col-md-6">
                                                <label className="form-label">Nationality </label>
                                                <input onChange={e => handleTextChange(e)} name="country" value={employeeModel.country} type="text" className="form-control" />
                                            </div>
                                            <div className="col-md-6">
                                                <label className="form-label">Location</label>
                                                <input onChange={e => handleTextChange(e)} type="text" name="location" value={employeeModel.location} className="form-control" />
                                            </div>
                                            <div className="col-md-6">
                                                <label className="form-label">Work Permit ID</label>
                                                <input onChange={e => handleTextChange(e)} name="workPermitID" value={employeeModel.workPermitID} type="text" className="form-control" />
                                            </div>
                                            <div className="col-md-6">
                                                <label className="form-label">Work Permit Expiry Date</label>
                                                <input onChange={e => handleTextChange(e)} name="workPEDate" value={common.formatTableData(employeeModel.workPEDate)} type="date" className="form-control" />
                                            </div>
                                            <div className="col-md-6">
                                                <label className="form-label">Passport No.</label>
                                                <input onChange={e => handleTextChange(e)} type="text" name="passportNumber" value={employeeModel.passportNumber} className="form-control" />
                                            </div>
                                            <div className="col-md-6">
                                                <label className="form-label">Passport Expiry Date</label>
                                                <input onChange={e => handleTextChange(e)} type="date" name="passportExpiryDate" value={common.formatTableData(employeeModel.passportExpiryDate)} className="form-control" />
                                            </div>
                                            <div className="col-md-6">
                                                <label className="form-label">Joining Date</label>
                                                <input onChange={e => handleTextChange(e)} name="hireDate" value={common.formatTableData(employeeModel.hireDate)} type="date" className="form-control" />
                                            </div>
                                            <div className="col-md-6">
                                                <label className="form-label">Job Title</label>
                                                <select className='form-control' onChange={e => handleTextChange(e)} type="number" name="jobTitleId" value={employeeModel.jobTitleId}>
                                                    <option value="0">Select job title</option>
                                                    {
                                                        jobTitles.map((ele, index) => {
                                                            return <option key={index} value={ele.id}>{ele.value}</option>
                                                        })
                                                    }
                                                </select>
                                            </div>
                                            <div className="col-md-6">
                                                <label className="form-label">Status</label>
                                                <input onChange={e => handleTextChange(e)} type="text" name="status" value={employeeModel.status} className="form-control" />
                                            </div>

                                            <div className="col-md-6">
                                                <label className="form-label">Level</label>
                                                <input onChange={e => handleTextChange(e)} type="number" name="leval" value={employeeModel.leval} className="form-control" />
                                            </div>
                                            <div className="col-md-6">
                                                <label className="form-label">Experties</label>
                                                <select className='form-control' onChange={e => handleTextChange(e)} type="number" name="expertId" value={employeeModel.expertId}>
                                                    <option value="0">Select experties</option>
                                                    {
                                                        experties.map((ele, index) => {
                                                            return <option key={index} value={ele.id}>{ele.value}</option>
                                                        })
                                                    }
                                                </select>
                                            </div>

                                            <div className="col-md-6">
                                                <label className="form-label">Salary</label>
                                                <input onChange={e => handleTextChange(e)} name="salary" value={employeeModel.salary} type="number" className="form-control" />
                                            </div>
                                            <div className="col-md-6">
                                                <label className="form-label">Account Id</label>
                                                <input onChange={e => handleTextChange(e)} name="accountId" value={employeeModel.accountId} type="text" className="form-control" />
                                            </div>
                                            <div className="col-md-6">
                                                <label className="form-label">Account Advance Id</label>
                                                <input onChange={e => handleTextChange(e)} name="accountAdvanceId" value={employeeModel.accountAdvanceId} type="text" className="form-control" />
                                            </div>

                                            <div className="col-md-6">
                                                <label className="form-label">Resident Permit Expiry Date</label>
                                                <input onChange={e => handleTextChange(e)} name="residentPDExpire" value={common.formatTableData(employeeModel.residentPDExpire)} type="date" className="form-control" />
                                            </div>
                                            <div className="col-md-6">
                                                <label className="form-label">Basic Salary</label>
                                                <input onChange={e => handleTextChange(e)} type="number" name="basicSalry" value={employeeModel.basicSalry} className="form-control" />
                                            </div>
                                            <div className="col-md-6">
                                                <label className="form-label">Accom </label>
                                                <input onChange={e => handleTextChange(e)} type="number" name="accom" value={employeeModel.accom} className="form-control" />
                                            </div>

                                            <div className="col-md-6">
                                                <label className="form-label">Medical Expiry </label>
                                                <input onChange={e => handleTextChange(e)} name="medicalExpiryDate" value={common.formatTableData(employeeModel.medicalExpiryDate)} type="date" className="form-control" />
                                            </div>
                                            <div className="col-12">
                                                <label className="form-label">Address </label>
                                                <textarea rows={3} style={{ resize: 'none' }} onChange={e => handleTextChange(e)} type="text" name="address" value={employeeModel.address} className="form-control" />
                                            </div>
                                        </form>

                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="modal-footer">
                            <button type="button" onClick={e => handleSave()} className="btn btn-info text-white waves-effect" data-bs-dismiss="modal">{isRecordSaving ? 'Save' : 'Update'}</button>
                            <button type="button" className="btn btn-danger waves-effect" data-bs-dismiss="modal">Cancel</button>
                        </div>
                    </div>
                    {/* <!-- /.modal-content --> */}
                </div>
            </div>
            {/* <!-- /.modal-dialog --> */}
        </>
    )
}
