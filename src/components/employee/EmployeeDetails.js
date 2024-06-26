import React, { useState, useEffect, useRef } from 'react'
import { toast } from 'react-toastify';
import { Api } from '../../apis/Api';
import { apiUrls } from '../../apis/ApiUrls';
import { toastMessage } from '../../constants/ConstantValues';
import { validationMessage } from '../../constants/validationMessage';
import { common } from '../../utils/common';
import Breadcrumb from '../common/Breadcrumb';
import Dropdown from '../common/Dropdown';
import ErrorLabel from '../common/ErrorLabel';
import Label from '../common/Label';
import TableView from '../tables/TableView';
import { headerFormat } from '../../utils/tableHeaderFormat';
import { useSearchParams } from 'react-router-dom';
import Inputbox from '../common/Inputbox';
import ButtonBox from '../common/ButtonBox';
import PrintEmployeeDetails from '../print/employee/PrintEmployeeDetails';

export default function EmployeeDetails() {
    const employeeModelTemplate = {
        id: 0,
        firstName: '',
        lastName: '',
        cancelDate: null,
        email: '',
        accountAdvanceId: 0,
        accountId: 0,
        salary: 0,
        hireDate: common.getHtmlDate(new Date()),
        country: '',
        contact: '+971',
        contact2: '+971',
        emiratesId: '',
        role: '',
        damanNo: '',
        otherAllowance: 0,
        transportation: 0,
        damanNoExpire: common.getHtmlDate(new Date()),
        userRoleId: 0,
        emiratesIdExpire: common.getHtmlDate(new Date()),
        otherAllowance: 0,
        passportNumber: '',
        passportExpiryDate: common.getHtmlDate(new Date()),
        workPermitID: '',
        workPEDate: common.getHtmlDate(new Date()),
        residentPDExpire: common.getHtmlDate(new Date()),
        address: '',
        jobTitleId: 0,
        jobTitle: "",
        empStatusId: 0,
        companyId: 0,
        basicSalary: 0,
        accomodation: 0,
        isFixedEmployee: false,
        medicalExpiryDate: common.getHtmlDate(new Date())
    }
    const filterTemplete = {
        companyId: 0,
        empStatusId: 0,
        jobTitleId: 0
    }
    const [searchParams, setSearchParams] = useSearchParams();
    const REQUESTEDEMPTITLE = searchParams.get("title");
    const REQUESTEDEMPTYPE = searchParams.get("type");
    const [employeeModel, setEmployeeModel] = useState(employeeModelTemplate);
    const [isRecordSaving, setIsRecordSaving] = useState(true);
    const [pageNo, setPageNo] = useState(1);
    const [pageSize, setPageSize] = useState(20);
    const [jobTitles, setJobTitles] = useState([]);
    const [countryList, setCountryList] = useState([]);
    const [empStatusList, setEmpStatusList] = useState([]);
    const [salehCompanyList, setSalehCompanyList] = useState([]);
    const [roleList, setRoleList] = useState([])
    const [errors, setErrors] = useState();
    const [filter, setFilter] = useState(filterTemplete);
    const [empDetailDataToPrint, setEmpDetailDataToPrint] = useState({});
    const handleDelete = (id) => {
        Api.Delete(apiUrls.employeeController.delete + id).then(res => {
            if (res.data === 1) {
                handleSearch('');
                toast.success(toastMessage.deleteSuccess);
            }
        });
    }
    const handleSearch = (searchTerm) => {
        if (searchTerm.length > 0 && searchTerm.length < 3)
            return;
        Api.Get(apiUrls.employeeController.search + `?PageNo=${pageNo}&PageSize=${pageSize}&SearchTerm=${searchTerm}&title=${REQUESTEDEMPTITLE}&type=${REQUESTEDEMPTYPE}`).then(res => {
            tableOptionTemplet.data = res.data.data;
            tableOptionTemplet.totalRecords = res.data.totalRecords;
            setTableOption({ ...tableOptionTemplet });
        }).catch(err => {

        });
    }

    const handleTextChange = (e) => {
        var { value, type, name, checked } = e.target;
        let data = employeeModel;
        if (type === 'select-one' && name !== 'country') {
            value = parseInt(value);

            if (name === 'userRoleId') {
                data.role = roleList.find(x => x.userRoleId === value).name;
            }
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
    const handleFilterChange = (e) => {
        var { value, type, name, checked } = e.target;
        let data = filter;
        if (type === 'select-one' && name !== 'country') {
            value = parseInt(value);
        }
        setPageNo(1);

        data[name] = value;
        setFilter({ ...data });
    }
    const handleSave = (e) => {
        const formError = validateError();
        if (Object.keys(formError).length > 0) {
            setErrors({...formError});
            return
        }
        e.preventDefault();

        let data = common.assignDefaultValue(employeeModelTemplate, employeeModel);
        if (isRecordSaving) {
            Api.Put(apiUrls.employeeController.add, data).then(res => {
                if (res.data.id > 0) {
                    common.closePopup('closePopupEmpDetails');
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
                    common.closePopup('closePopupEmpDetails');
                    toast.success(toastMessage.updateSuccess);
                    handleSearch('');
                }
            }).catch(err => {
                toast.error(toastMessage.updateError);
            });
        }
    }
    const handleEdit = (employeeId) => {

        Api.Get(apiUrls.employeeController.get + employeeId).then(res => {
            if (res.data.id > 0) {
                setIsRecordSaving(false);
                setErrors({});
                var data = res.data;
                Object.keys(data).forEach(x => {
                    if (typeof data[x] === "string")
                        data[x] = data[x].replace("0001-01-01T00:00:00", "").replace("T00:00:00", "");
                });
                setEmployeeModel({ ...res.data });
            }
        });
    };
    const printEmpDetailHandlerMain = (id, data) => {
        setEmpDetailDataToPrint({ ...data });
    }
    const tableOptionTemplet = {
        headers: headerFormat.employeeDetails,
        data: [],
        totalRecords: 0,
        pageSize: pageSize,
        pageNo: pageNo,
        setPageNo: setPageNo,
        setPageSize: setPageSize,
        searchHandler: handleSearch,
        actions: {
            showView: false,
            showPrint: true,
            popupModelId: "add-employee",
            delete: {
                handler: handleDelete
            },
            edit: {
                handler: handleEdit
            },
            print: {
                handler: printEmpDetailHandlerMain,
                modelId:"printEmpDetailModel"
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
        title: REQUESTEDEMPTYPE === 'staff' ? "Staff" : 'Employee',
        items: [
            {
                title: REQUESTEDEMPTYPE === 'staff' ? "Staff" : 'Employee' + " Details",
                icon: "bi bi-person-badge-fill",
                isActive: false,
            }
        ],
        buttons: [
            {
                text: "Add Employee",
                icon: 'bi bi-people',
                modelId: 'add-employee',
                handler: saveButtonHandler
            }
        ]
    }

    useEffect(() => {
        setIsRecordSaving(true);
        Api.Get(apiUrls.employeeController.getAll + `?PageNo=${pageNo}&PageSize=${pageSize}&title=${REQUESTEDEMPTITLE}&type=${REQUESTEDEMPTYPE}&companyId=${filter.companyId ?? 0}&EmpStatusId=${filter.empStatusId}&jobTitleId=${filter.jobTitleId}`).then(res => {
            tableOptionTemplet.data = res.data.data;
            tableOptionTemplet.totalRecords = res.data.totalRecords;
            setTableOption({ ...tableOptionTemplet });
        });
    }, [pageNo, pageSize, REQUESTEDEMPTITLE, REQUESTEDEMPTYPE, filter]);

    useEffect(() => {
        if (isRecordSaving) {
            setEmployeeModel({ ...employeeModelTemplate });
        }
    }, [isRecordSaving])

    useEffect(() => {
        let apiCalls = [];
        apiCalls.push(Api.Get(apiUrls.dropdownController.jobTitle));
        apiCalls.push(Api.Get(apiUrls.masterDataController.getByMasterDataTypes + `?masterDatatypes=country&masterDatatypes=employee_status&masterDatatypes=saleh_company`));
        apiCalls.push(Api.Get(apiUrls.permissionController.getRole));
        Api.MultiCall(apiCalls).then(res => {

            if (res[1].data.length > 0) {
                var country = res[1].data.filter(x => x.masterDataTypeCode === "country");
                var empStatus = res[1].data.filter(x => x.masterDataTypeCode === "employee_status");
                var company = res[1].data.filter(x => x.masterDataTypeCode === "saleh_company");
                company.unshift({ id: 0, value: 'All Company' });
                empStatus.unshift({ id: 0, value: 'All Status' });
                res[0].data?.unshift({ id: 0, value: 'All Job Title' });
                setCountryList(country);
                setEmpStatusList(empStatus);
                setSalehCompanyList(company);
                if (res[0].data.length > 0)
                    setJobTitles([...res[0].data]);
            }
            if (res[2].data.length > 0)
                setRoleList([...res[2].data]);
        })
    }, []);

    const validateError = () => {
        const { email, firstName, lastName, salary, userRoleId, jobTitleId, emiratesId, emiratesIdExpire, contact,
            workPermitID, passportNumber, passportExpiryDate, workPEDate, basicSalary, isFixedEmployee, empStatusId, companyId } = employeeModel;
        const newError = {};
        if (!firstName || firstName === "") newError.firstName = validationMessage.firstNameRequired;
        if (!lastName || lastName === "") newError.lastName = validationMessage.lastNameRequired;
        if (!emiratesId || emiratesId === "") newError.emiratesId = validationMessage.emirateIdRequired;
        if (!emiratesIdExpire || emiratesIdExpire === common.defaultDate) newError.emiratesIdExpire = validationMessage.emiratesIDExpireDateRequired;
        if (jobTitleId <=0 || isNaN(jobTitleId)) newError.jobTitleId = validationMessage.jobTitleRequired;
        if (empStatusId <=0 || isNaN(empStatusId)) newError.empStatusId = validationMessage.empStatusRequired;
        if (companyId <=0 || isNaN(companyId)) newError.companyId = validationMessage.empCompanyRequired;
        if (userRoleId === 0) newError.userRoleId = validationMessage.userRoleRequired;
        if (isFixedEmployee && (!email || email.indexOf('.') === -1 || email.indexOf('@') === -1)) newError.email = 'Please enter valid email!';
        if (isFixedEmployee && basicSalary === 0) newError.basicSalary = validationMessage.salaryRequired;
        if (isFixedEmployee && salary === 0) newError.salary = validationMessage.sa;
        //if (contact?.length > 0 && !RegexFormat.mobile.test(contact)) newError.contact = validationMessage.invalidContact;
        if (!contact || contact?.length === 0) newError.contact = validationMessage.contactRequired;
        if (!workPermitID || workPermitID === "") newError.workPermitID = validationMessage.workPermitIdRequired;
        if (!passportNumber || passportNumber === "") newError.passportNumber = validationMessage.passportNumberRequired;
        if (!workPEDate || workPEDate === "") newError.workPEDate = validationMessage.workPermitExpireDateRequired;
        if (!passportExpiryDate || passportExpiryDate === common.defaultDate) newError.passportExpiryDate = validationMessage.passportExpireDateRequired;

        //  if (!workPEDate || (isRecordSaving && new Date(workPEDate) < new Date())) newError.workPEDate = validationMessage.workPermitExpiryDateInvalid;
        // if (!passportExpiryDate || (isRecordSaving && new Date(passportExpiryDate) < new Date())) newError.passportExpiryDate = validationMessage.passportExpiryDateInvalid;
        return newError;
    }
    return (
        <>
            <Breadcrumb option={breadcrumbOption}></Breadcrumb>
            <div className='d-flex justify-content-between'>
                <div>
                    <h6 className="mb-0 text-uppercase">{REQUESTEDEMPTITLE?.replace('_', '. ').toLowerCase()} {REQUESTEDEMPTYPE === 'staff' ? "Staff" : 'Employee'} Details</h6>
                </div>
                <div className='d-flex justify-content-between'>
                    <div className='mx-1'>
                        <Label text="Company" />
                        <Dropdown className="form-control-sm form-control" data={salehCompanyList} name="companyId" searchable={true} onChange={handleFilterChange} value={filter.companyId} displayDefaultText={false}></Dropdown>
                    </div>
                    <div className='mx-1'>
                        <Label text="Status" />
                        <Dropdown className="form-control-sm form-control" data={empStatusList} name="empStatusId" searchable={true} onChange={handleFilterChange} value={filter.empStatusId} displayDefaultText={false}></Dropdown>
                    </div>
                    <div className='mx-1'>
                        <Label text="Job Title" />
                        <Dropdown className="form-control-sm form-control" data={jobTitles} name="jobTitleId" searchable={true} onChange={handleFilterChange} value={filter.jobTitleId} displayDefaultText={false}></Dropdown>
                    </div>
                </div>
            </div>
            <hr />
            <TableView option={tableOption}></TableView>

            {/* <!-- Add Contact Popup Model --> */}
            <div id="add-employee" className="modal fade in" data-bs-backdrop="static" data-bs-keyboard="false" tabIndex="-1" role="dialog" aria-labelledby="myModalLabel" aria-hidden="true">
                <div className="modal-dialog modal-xl">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h5 className="modal-title">New Employees</h5>
                            <button type="button" id='closePopupEmpDetails' className="btn-close" data-bs-dismiss="modal" aria-hidden="true"></button>
                        </div>
                        <div className="modal-body">
                            <div className="form-horizontal form-material">
                                <div className="card">
                                    <div className="card-body">
                                        <fieldset>
                                            <legend>Employee Type</legend>
                                            <div className='row'>
                                                <div className="col-12">
                                                    <Label text="Fixed Employee" />
                                                    <div className="form-check form-switch">
                                                        <input onChange={e => handleTextChange(e)} checked={employeeModel.isFixedEmployee ? "checked" : ""} name="isFixedEmployee" className="form-check-input" type="checkbox" id="isFixedEmployee" />
                                                        <label className="form-check-label" htmlFor="isFixedEmployee">
                                                        </label>
                                                    </div>
                                                </div>
                                            </div>
                                        </fieldset>
                                        <fieldset>
                                            <legend>Personal Details</legend>
                                            <div className='row'>
                                                <div className="col-md-6 col-lg-3">
                                                    <Inputbox className="form-control-sm form-control" labelFontSize="13px" labelText="First Name" onChangeHandler={handleTextChange} name="firstName" value={employeeModel.firstName} errorMessage={errors?.firstName} isRequired={true} />
                                                </div>
                                                <div className="col-md-6 col-lg-3">
                                                    <Inputbox className="form-control-sm form-control" labelFontSize="13px" labelText="Last Name" onChangeHandler={handleTextChange} name="lastName" value={employeeModel.lastName} errorMessage={errors?.lastName} />
                                                </div>
                                                <div className="col-md-6 col-lg-3">
                                                    <Inputbox className="form-control-sm form-control" labelFontSize="13px" labelText="Contact" onChangeHandler={handleTextChange} name="contact" value={employeeModel.contact} errorMessage={errors?.contact} isRequired={true} />
                                                </div>
                                                <div className="col-md-6 col-lg-3">
                                                    <Inputbox className="form-control-sm form-control" labelFontSize="13px" labelText="Contact 2" onChangeHandler={handleTextChange} name="contact2" value={employeeModel.contact2} errorMessage={errors?.contact2} />
                                                </div>
                                                <div className="col-md-6 col-lg-3">
                                                    <Inputbox className="form-control-sm form-control" labelFontSize="13px" labelText="Email" isRequired={employeeModel?.isFixedEmployee} onChangeHandler={handleTextChange} name="email" type="email" value={employeeModel.email} errorMessage={errors?.email} />
                                                </div>
                                                <div className="col-md-6 col-lg-3">
                                                    <Label text="Nationality" />
                                                    <Dropdown className="form-control-sm form-control" defaultValue='' data={countryList} name="country" elementKey='value' searchable={true} onChange={handleTextChange} value={employeeModel.country} defaultText="Select country"></Dropdown>
                                                </div>
                                            </div>
                                        </fieldset>
                                        <fieldset>
                                            <legend>Douments</legend>
                                            <div className='row'>
                                                <div className="col-md-6 col-lg-3">
                                                    <Inputbox className="form-control-sm form-control" labelFontSize="13px" labelText="Passport No." onChangeHandler={handleTextChange} name="passportNumber" value={employeeModel.passportNumber} errorMessage={errors?.passportNumber} isRequired={true} />
                                                </div>
                                                <div className="col-md-6 col-lg-3">
                                                    <Inputbox className="form-control-sm form-control" labelFontSize="13px" labelText="Passport Expiry" onChangeHandler={handleTextChange} type="date" name="passportExpiryDate" value={employeeModel.passportExpiryDate} isRequired={true} errorMessage={errors?.passportExpiryDate} />
                                                </div>
                                                <div className="col-md-6 col-lg-3">
                                                    <Inputbox className="form-control-sm form-control" labelFontSize="13px" labelText="Work Permit Id" onChangeHandler={handleTextChange} name="workPermitID" value={employeeModel.workPermitID} isRequired={true} errorMessage={errors?.workPermitID} />
                                                </div>
                                                <div className="col-md-6 col-lg-3">
                                                    <Inputbox className="form-control-sm form-control" labelFontSize="13px" labelText="Work Permit Expiry" onChangeHandler={handleTextChange} type="date" name="workPEDate" value={employeeModel.workPEDate} isRequired={true} errorMessage={errors?.workPEDate} />
                                                </div>
                                                <div className="col-md-6 col-lg-3">
                                                    <Inputbox className="form-control-sm form-control" labelFontSize="13px" isRequired={true} labelText="Emirates Id" onChangeHandler={handleTextChange} name="emiratesId" value={employeeModel.emiratesId} errorMessage={errors?.emiratesId} />
                                                </div>
                                                <div className="col-md-6 col-lg-3">
                                                    <Inputbox className="form-control-sm form-control" labelFontSize="13px" labelText="Emirates ID Expiry" onChangeHandler={handleTextChange} type="date" name="emiratesIdExpire" value={employeeModel.emiratesIdExpire} errorMessage={errors?.emiratesIdExpire} />
                                                </div>
                                                <div className="col-md-6 col-lg-3">
                                                    <Inputbox className="form-control-sm form-control" labelFontSize="13px" labelText="Daman Number" onChangeHandler={handleTextChange} name="damanNo" value={employeeModel.damanNo} errorMessage={errors?.damanNo} />
                                                </div>
                                                <div className="col-md-6 col-lg-3">
                                                    <Inputbox className="form-control-sm form-control" labelFontSize="13px" labelText="Daman Number Expiry" onChangeHandler={handleTextChange} type="date" name="damanNoExpire" value={employeeModel.damanNoExpire} errorMessage={errors?.damanNoExpire} />
                                                </div>
                                            </div>
                                        </fieldset>
                                        <fieldset>
                                            <legend>Role And Salary</legend>
                                            <div className="row">
                                                <div className="col-md-6 col-lg-3">
                                                    <Label text="Job Title" isRequired={true}></Label>
                                                    <Dropdown className="form-control-sm form-control" defaultValue='0' data={jobTitles} name="jobTitleId" searchable={true} onChange={handleTextChange} value={employeeModel.jobTitleId} defaultText="Select job title"></Dropdown>
                                                    <ErrorLabel message={errors?.jobTitleId}></ErrorLabel>
                                                </div>
                                                <div className="col-md-6 col-lg-3">
                                                    <Inputbox className="form-control-sm form-control" labelFontSize="13px" labelText="Joining Date" isRequired={true} onChangeHandler={handleTextChange} type="date" max={common.getHtmlDate(new Date())} name="hireDate" value={employeeModel.hireDate} errorMessage={errors?.hireDate} />
                                                </div>
                                                <div className="col-md-6 col-lg-3">
                                                    <Label text="Employee Status" isRequired={true} />
                                                    <Dropdown className="form-control-sm form-control" defaultValue='' data={empStatusList} name="empStatusId" elementKey='id' searchable={true} onChange={handleTextChange} value={employeeModel.empStatusId} defaultText="Select Employee Status"></Dropdown>
                                                    <ErrorLabel message={errors?.empStatusId} />
                                                </div>
                                                <div className="col-md-6 col-lg-3">
                                                    <Inputbox className="form-control-sm form-control" labelFontSize="13px" labelText="Cancel Date" type="date" max={common.getHtmlDate(new Date())} onChangeHandler={handleTextChange} name="cancelDate" value={employeeModel.cancelDate} />
                                                </div>
                                                <div className="col-md-6 col-lg-3">
                                                    <Label text="Company" isRequired={true} />
                                                    <Dropdown className="form-control-sm form-control" defaultValue='' data={salehCompanyList} name="companyId" elementKey='id' searchable={true} onChange={handleTextChange} value={employeeModel.companyId} defaultText="Select Company"></Dropdown>
                                                    <ErrorLabel message={errors?.companyId} />
                                                </div>
                                                <div className="col-md-6 col-lg-3">
                                                    <Inputbox className="form-control-sm form-control" labelFontSize="13px" labelText="Basic Salary" type="number" min={0.00} max={1000000.00} onChangeHandler={handleTextChange} name="basicSalary" value={employeeModel.basicSalary} errorMessage={errors?.basicSalary} />
                                                </div>
                                                <div className="col-md-6 col-lg-3">
                                                    <Inputbox className="form-control-sm form-control" labelFontSize="13px" labelText="Accomodation" type="number" min={0.00} max={1000000.00} onChangeHandler={handleTextChange} name="accomodation" value={employeeModel.accomodation} errorMessage={errors?.accomodation} />
                                                </div>
                                                <div className="col-md-6 col-lg-3">
                                                    <Inputbox className="form-control-sm form-control" labelFontSize="13px" labelText="Transportation" type="number" min={0.00} max={1000000.00} onChangeHandler={handleTextChange} name="transportation" value={employeeModel.transportation} errorMessage={errors?.transportation} />
                                                </div>
                                                <div className="col-md-6 col-lg-3">
                                                    <Inputbox className="form-control-sm form-control" labelFontSize="13px" labelText="Other Allowance" type="number" min={0.00} max={1000000.00} onChangeHandler={handleTextChange} name="otherAllowance" value={employeeModel.otherAllowance} errorMessage={errors?.otherAllowance} />
                                                </div>
                                                <div className="col-md-6 col-lg-3">
                                                    <Label text="Role" isRequired={true}></Label>
                                                    <Dropdown className="form-control-sm form-control" defaultValue={0} data={roleList} name="userRoleId" elementKey='userRoleId' text="name" onChange={handleTextChange} value={employeeModel.userRoleId} defaultText="Select role"></Dropdown>
                                                    <ErrorLabel message={errors?.userRoleId}></ErrorLabel>
                                                </div>
                                                {employeeModel.isFixedEmployee &&
                                                    <>

                                                        <div className="col-md-6 col-lg-3">
                                                            <Inputbox className="form-control-sm form-control" labelFontSize="13px" labelText="Net Salary" type="number" min={0.00} max={1000000.00} onChangeHandler={handleTextChange} name="salary" value={employeeModel.salary} errorMessage={errors?.salary} />
                                                        </div>
                                                    </>
                                                }
                                                <div className="col-12">
                                                    <Label text="Address" />
                                                    <textarea rows={3} style={{ resize: 'none' }} onChange={e => handleTextChange(e)} type="text" name="address" value={employeeModel.address} className="form-control" />
                                                </div>
                                            </div>
                                        </fieldset>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="modal-footer">
                            <ButtonBox onClickHandler={handleSave} className="btn-sm" type={isRecordSaving ? 'save' : 'update'} text={isRecordSaving ? 'Save' : 'Update'} />
                            <ButtonBox type="cancel" modelDismiss={true} className="btn-sm"></ButtonBox>
                        </div>
                    </div>
                    {/* <!-- /.modal-content --> */}
                </div>
            </div>
            {/* <!-- /.modal-dialog --> */}
                <PrintEmployeeDetails empData={empDetailDataToPrint} />
        </>
    )
}
