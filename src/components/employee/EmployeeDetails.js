import React, { useState, useEffect } from 'react'
import { toast } from 'react-toastify';
import { Api } from '../../apis/Api';
import { apiUrls } from '../../apis/ApiUrls';
import { toastMessage } from '../../constants/ConstantValues';
import { validationMessage } from '../../constants/validationMessage';
import { common } from '../../utils/common';
import RegexFormat from '../../utils/RegexFormat';
import Breadcrumb from '../common/Breadcrumb';
import Dropdown from '../common/Dropdown';
import ErrorLabel from '../common/ErrorLabel';
import Label from '../common/Label';
import TableView from '../tables/TableView';

export default function EmployeeDetails() {
    const employeeModelTemplate = {
        id: 0,
        firstName: '',
        lastName: '',
        accountAdvanceId: 0,
        accountId: 0,
        salary: 0,
        hireDate: common.getHtmlDate(new Date()),
        country: '',
        contact: '+970',
        contact2: '+970',
        labourId: '',
        labourIdExpire: common.getHtmlDate(new Date()),
        passportNumber: '',
        passportExpiryDate: common.getHtmlDate(new Date()),
        workPermitID: '',
        workPEDate: common.getHtmlDate(new Date()),
        residentPDExpire: common.getHtmlDate(new Date()),
        address: '',
        jobTitleId: 0,
        jobTitle: "",
        basicSalary: 0,
        accomodation: 0,
        isFixedEmployee: false,
        medicalExpiryDate: common.getHtmlDate(new Date())
    }
    const [employeeModel, setEmployeeModel] = useState(employeeModelTemplate);
    const [isRecordSaving, setIsRecordSaving] = useState(true);
    const [pageNo, setPageNo] = useState(1);
    const [pageSize, setPageSize] = useState(10);
    const [jobTitles, setJobTitles] = useState([]);
    const [countryList, setCountryList] = useState([])
    const [errors, setErrors] = useState();
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
        var { value, type, name, checked } = e.target;
        let data = employeeModel;
        debugger;
        if (type === 'select-one' && name !== 'country') {
            value = parseInt(value);
        }
        else if (type === 'number')
            value = parseFloat(value);
        else if (name === "firstName" || name === "lastName")
            value = value.toUpperCase();
        else if (type === "checkbox")
            value = checked;

        data[name] = value;
        data.salary = common.defaultIfIsNaN(data.basicSalary) + common.defaultIfIsNaN(data.accomodation);
        setEmployeeModel({ ...data });

        if (!!errors[name]) {
            setErrors({ ...errors, [name]: null })
        }
    }
    const handleSave = (e) => {
        e.preventDefault();
        const formError = validateError();
        if (Object.keys(formError).length > 0) {
            setErrors(formError);
            return
        }

        let data = common.assignDefaultValue(employeeModelTemplate, employeeModel);
        if (isRecordSaving) {
            Api.Put(apiUrls.employeeController.add, data).then(res => {
                if (res.data.id > 0) {
                    common.closePopup();
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
                    common.closePopup();
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
        setErrors({});
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
            { name: 'Contact', prop: 'contact' },
            { name: 'Contact 2', prop: 'contact2' },
            { name: 'Job Name', prop: 'jobTitle' },
            { name: 'Fixed Employee', prop: 'isFixedEmployee', action: { replace: { true: "Yes", false: "No" } } },
            { name: 'Hire Date', prop: 'hireDate' },
            { name: 'Labour ID', prop: 'labourId' },
            { name: 'Labour ID Expire', prop: 'labourIdExpire' },
            { name: 'Passport Number', prop: 'passportNumber' },
            { name: 'Passport Expiry Date', prop: 'passportExpiryDate' },
            { name: 'WorkPermit ID', prop: 'workPermitID' },
            { name: 'Work Permit Expire', prop: 'workPEDate' },
            { name: 'Resident Permit Expire', prop: 'residentPDExpire' },
            { name: 'Basic Salary', prop: 'basicSalary', action: { decimal: true } },
            { name: 'Accomodation', prop: 'accomodation', action: { decimal: true } },
            { name: 'Salary', prop: 'salary', action: { decimal: true } },
            { name: 'Medical Expire', prop: 'medicalExpiryDate' },
            { name: 'Address', prop: 'address' },
            { name: 'Country', prop: 'country' }
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
        setErrors({});
        setIsRecordSaving(true);
    }
    const [tableOption, setTableOption] = useState(tableOptionTemplet);
    const breadcrumbOption = {
        title: 'Employees',
        items: [
            {
                title: "Employee Details",
                icon: "bi bi-person-badge-fill",
                isActive: false,
            }
        ],
        buttons: [
            {
                text: "Employee Deatils",
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
        apiCalls.push(Api.Get(apiUrls.masterDataController.getByMasterDataType + `?masterDatatype=country`));
        Api.MultiCall(apiCalls).then(res => {
            debugger;
            if (res[0].data.length > 0)
                setJobTitles([...res[0].data]);
            if (res[1].data.length > 0)
                setCountryList([...res[1].data]);
        })
    }, []);

    const validateError = () => {
        const { firstName, lastName, jobTitleId, labourId,labourIdExpire, contact, workPermitID, passportNumber, passportExpiryDate, workPEDate, basicSalary, isFixedEmployee } = employeeModel;
        const newError = {};
        if (!firstName || firstName === "") newError.firstName = validationMessage.firstNameRequired;
        if (!lastName || lastName === "") newError.lastName = validationMessage.lastNameRequired;
        if (!labourId || labourId === "") newError.labourId = validationMessage.labourIdRequired;
        if (!labourIdExpire || labourIdExpire === "") newError.labourIdExpire = validationMessage.labourIdExpireDateRequired;
        if (jobTitleId === 0) newError.jobTitleId = validationMessage.jobTitleRequired;
        if (isFixedEmployee && basicSalary === 0) newError.basicSalary = validationMessage.basicSalaryRequired;
        if (contact?.length > 0 && !RegexFormat.mobile.test(contact)) newError.contact = validationMessage.invalidContact;
        if (!contact || contact?.length === 0) newError.contact = validationMessage.contactRequired;
        if (!workPermitID || workPermitID === "") newError.workPermitID = validationMessage.workPermitIdRequired;
        if (!passportNumber || passportNumber === "") newError.passportNumber = validationMessage.passportNumberRequired;
        if (!workPEDate || workPEDate==="") newError.workPEDate = validationMessage.workPermitExpireDateRequired;
        if (!passportExpiryDate || passportExpiryDate==="") newError.passportExpiryDate = validationMessage.passportExpireDateRequired;
        
        if (!workPEDate || (isRecordSaving && new Date(workPEDate) < new Date())) newError.workPEDate = validationMessage.workPermitExpiryDateInvalid;
        if (!passportExpiryDate || (isRecordSaving && new Date(passportExpiryDate) < new Date())) newError.passportExpiryDate = validationMessage.passportExpiryDateInvalid;
        return newError;
    }

    return (
        <>
            <Breadcrumb option={breadcrumbOption}></Breadcrumb>
            <h6 className="mb-0 text-uppercase">Employee Deatils</h6>
            <hr />
            <TableView option={tableOption}></TableView>

            {/* <!-- Add Contact Popup Model --> */}
            <div id="add-employee" className="modal fade in" data-bs-backdrop="static" data-bs-keyboard="false" tabIndex="-1" role="dialog" aria-labelledby="myModalLabel" aria-hidden="true">
                <div className="modal-dialog modal-lg">
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
                                                <Label text="First Name" isRequired={true}></Label>
                                                <input required onChange={e => handleTextChange(e)} name="firstName" value={employeeModel.firstName} type="text" id='firstName' className="form-control" />
                                                <ErrorLabel message={errors?.firstName}></ErrorLabel>
                                            </div>
                                            <div className="col-md-6">
                                                <Label text="Last Name" isRequired={true}></Label>
                                                <input onChange={e => handleTextChange(e)} name="lastName" value={employeeModel.lastName} type="text" className="form-control" />
                                                <ErrorLabel message={errors?.lastName}></ErrorLabel>
                                            </div>
                                            <div className="col-md-6">
                                                <Label text="Contact" isRequired={true}></Label>
                                                <input onChange={e => handleTextChange(e)} type="text" name="contact" value={employeeModel.contact} className="form-control" />
                                                <ErrorLabel message={errors?.contact}></ErrorLabel>
                                            </div>
                                            <div className="col-md-6">
                                                <Label text="Contact 2" isRequired={true}></Label>
                                                <input onChange={e => handleTextChange(e)} type="text" name="contact2" value={employeeModel.contact2} className="form-control" />
                                                <ErrorLabel message={errors?.contact2}></ErrorLabel>
                                            </div>
                                            <div className="col-md-6">
                                                <Label text="Nationality" />
                                                <Dropdown defaultValue='' data={countryList} name="country" elemenyKey='value' searchable={true} onChange={handleTextChange} value={employeeModel.country} defaultText="Select country"></Dropdown>
                                            </div>
                                            <div className="col-md-6">
                                                <Label text="Fixed Employee" />
                                                <div className="form-check form-switch">
                                                    <input onChange={e => handleTextChange(e)} checked={employeeModel.isFixedEmployee ? "checked" : ""} name="isFixedEmployee" className="form-check-input" type="checkbox" id="isFixedEmployee" />
                                                    <label className="form-check-label" htmlFor="isFixedEmployee">
                                                    </label>
                                                </div>
                                            </div>
                                            <div className="col-md-6">
                                                <Label text="Work Permit Id" isRequired={true}></Label>
                                                <input onKeyUp={e => common.toUpperCase(e)} onChange={e => handleTextChange(e)} name="workPermitID" value={employeeModel.workPermitID} type="text" className="form-control" />
                                                <ErrorLabel message={errors?.workPermitID}></ErrorLabel>
                                            </div>
                                            <div className="col-md-6">
                                                <Label text="Work Permit Expiry Date" isRequired={true}></Label>
                                                <input onChange={e => handleTextChange(e)} name="workPEDate" min={common.getHtmlDate(new Date())} value={common.formatTableData(employeeModel.workPEDate)} type="date" className="form-control" />
                                                <ErrorLabel message={errors?.workPEDate}></ErrorLabel>
                                            </div>
                                            <div className="col-md-6">
                                                <Label text="Labour ID" isRequired={true}></Label>
                                                <input onKeyUp={e => common.toUpperCase(e)} onChange={e => handleTextChange(e)} type="text" name="labourId" value={employeeModel.labourId} className="form-control" />
                                                <ErrorLabel message={errors?.labourId}></ErrorLabel>
                                            </div>
                                            <div className="col-md-6">
                                                <Label text="Labour ID Expire Date" isRequired={true}></Label>
                                                <input onKeyUp={e => common.toUpperCase(e)} min={common.getHtmlDate(new Date())} onChange={e => handleTextChange(e)} type="date" name="labourIdExpire" value={employeeModel.labourIdExpire} className="form-control" />
                                                <ErrorLabel message={errors?.labourIdExpire}></ErrorLabel>
                                            </div>
                                            <div className="col-md-6">
                                                <Label text="Passport No." isRequired={true}></Label>
                                                <input onKeyUp={e => common.toUpperCase(e)} onChange={e => handleTextChange(e)} type="date" name="passportNumber" value={employeeModel.passportNumber} className="form-control" />
                                                <ErrorLabel message={errors?.passportNumber}></ErrorLabel>
                                            </div>
                                            <div className="col-md-6">
                                                <Label text="Passport Expiry Date" isRequired={true}></Label>
                                                <input onChange={e => handleTextChange(e)} type="date" min={common.getHtmlDate(new Date())} name="passportExpiryDate" value={common.formatTableData(employeeModel.passportExpiryDate)} className="form-control" />
                                                <ErrorLabel message={errors?.passportExpiryDate}></ErrorLabel>
                                            </div>
                                            <div className="col-md-6">
                                                <Label text="Joining Date" />
                                                <input onChange={e => handleTextChange(e)} name="hireDate" value={common.formatTableData(employeeModel.hireDate)} type="date" className="form-control" />
                                            </div>
                                            <div className="col-md-6">
                                                <Label text="Job Title" isRequired={true}></Label>
                                                <Dropdown defaultValue='0' data={jobTitles} name="jobTitleId" searchable={true} onChange={handleTextChange} value={employeeModel.jobTitleId} defaultText="Select job title"></Dropdown>
                                                <ErrorLabel message={errors?.jobTitleId}></ErrorLabel>
                                            </div>
                                            <div className="col-md-6">
                                                <Label text="Medical Expiry" />
                                                <input onChange={e => handleTextChange(e)} name="medicalExpiryDate" value={common.formatTableData(employeeModel.medicalExpiryDate)} type="date" className="form-control" />
                                            </div>
                                            <div className="col-md-6">
                                                <Label text="Resident Permit Expiry Date" />
                                                <input onChange={e => handleTextChange(e)} name="residentPDExpire" value={common.formatTableData(employeeModel.residentPDExpire)} type="date" className="form-control" />
                                            </div>
                                            {employeeModel.isFixedEmployee &&
                                                <>
                                                    <div className="col-md-6">
                                                        <Label text="Basic Salary" isRequired={true}></Label>
                                                        <input min={0} onChange={e => handleTextChange(e)} type="number" name="basicSalary" value={employeeModel.basicSalary} className="form-control" />
                                                        <ErrorLabel message={errors?.basicSalary}></ErrorLabel>
                                                    </div>
                                                    <div className="col-md-6">
                                                        <Label text="Accomodation" />
                                                        <input min={0} max={1000000} onChange={e => handleTextChange(e)} type="number" name="accomodation" value={employeeModel.accomodation} className="form-control" />
                                                    </div>
                                                    <div className="col-md-6">
                                                        <Label text="Salary" />
                                                        <input disabled onChange={e => handleTextChange(e)} name="salary" value={employeeModel.salary.toFixed(2)} type="number" className="form-control" />
                                                    </div>
                                                </>
                                            }
                                            <div className="col-12">
                                                <Label text="Address" />
                                                <textarea rows={3} style={{ resize: 'none' }} onChange={e => handleTextChange(e)} type="text" name="address" value={employeeModel.address} className="form-control" />
                                            </div>
                                        </form>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="modal-footer">
                            <button type="submit" onClick={e => handleSave(e)} className="btn btn-info text-white waves-effect" >{isRecordSaving ? 'Save' : 'Update'}</button>
                            <button type="button" className="btn btn-danger waves-effect" id='closePopup' data-bs-dismiss="modal">Cancel</button>
                        </div>
                    </div>
                    {/* <!-- /.modal-content --> */}
                </div>
            </div>
            {/* <!-- /.modal-dialog --> */}
        </>
    )
}
