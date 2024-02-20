import React, { useEffect, useState } from 'react'
import { Api } from '../../apis/Api';
import { apiUrls } from '../../apis/ApiUrls';
import Breadcrumb from '../common/Breadcrumb';
import ButtonBox from '../common/ButtonBox';
import Dropdown from '../common/Dropdown';
import SearchableDropdown from '../common/SearchableDropdown/SearchableDropdown';
import { common } from '../../utils/common';
import TableView from '../tables/TableView';
import { headerFormat } from '../../utils/tableHeaderFormat';
import Inputbox from '../common/Inputbox';
import Label from '../common/Label';
import ErrorLabel from '../common/ErrorLabel';
import { validationMessage } from '../../constants/validationMessage';
import { toast } from 'react-toastify';
import { toastMessage } from '../../constants/ConstantValues';

export default function EmployeeSalaryPayment() {
    const salaryPayModelTemplate = {
        employeeId: 0,
        employeeName: '',
        month: 0,
        year: 0,
        amount: 0,
        paymentDate: common.getHtmlDate(new Date()),
        paymentMode: 'Cash',
        note: '',
        paidBy: 0,
    }
    const CURR_DATE = new Date();
    const [employeeData, setEmployeeData] = useState([]);
    const [salaryPayModel, setSalaryPayModel] = useState(salaryPayModelTemplate);
    const [paymodeList, setPaymodeList] = useState([])
    const [jobTitles, setJobTitles] = useState([]);
    const [filterData, setFilterData] = useState({
        empId: 0,
        month: CURR_DATE.getMonth() + 1,
        year: CURR_DATE.getFullYear(),
        isEmployee: true,
        jobTitle: ""
    });
    const [errors, setErrors] = useState();

    useEffect(() => {
        let apiCalls = [];
        apiCalls.push(Api.Get(apiUrls.dropdownController.employee));
        apiCalls.push(Api.Get(apiUrls.dropdownController.jobTitle));
        apiCalls.push(Api.Get(apiUrls.masterDataController.getByMasterDataType + '?masterDataType=payment_mode'));
        Api.MultiCall(apiCalls).then(res => {
            if (res[0].data.length > 0)
                setEmployeeData([...res[0].data]);
            setJobTitles(res[1].data);
            setPaymodeList(res[2].data);
        });
    }, []);

    const breadcrumbOption = {
        title: 'Employee Salary Payment Details',
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

    const getSalaryData = () => {
        if(filterData.empId===0)
        {
            toast.warn("Please select employee.");
            return;
        }
        if(filterData.year===0)
        {
            toast.warn("Please select year.");
            return;
        }
        var apiList = [];
        apiList.push(Api.Get(`${apiUrls.accountController.getEmpSalaryPayList}${filterData.empId}/${filterData.year}`));
        apiList.push(Api.Get(`${apiUrls.employeeController.getEmployeeSalaryOfYear}${filterData.empId}/${filterData.year}`))
        Api.MultiCall(apiList)
            .then(res => {
                var payStatus = res[0].data;
                var salary = res[1].data;
                //var finalData=[];
                salary?.forEach(element => {
                    var payData = payStatus?.find(x => x.month === element?.month && x.year === filterData.year);
                    element.employeeName=getEmpDataById(element.employeeId);
                    if (payData !== undefined) {
                        element.isPaid = true;
                        element.paymentDate = payData?.paymentDate;
                        element.paymentMode = payData?.paymentMode;
                        element.paidBy = payData?.paidBy;
                        element.paidByEmployee = payData?.paidByEmployee;
                        element.note=payData?.note;
                    } else
                        element.isPaid = false;
                });
                tableOptionTemplet.data = salary;
                tableOptionTemplet.totalRecords = salary?.length;
                setTableOptions({ ...tableOptionTemplet });
            });
    }

    const btnList = [
        {
            type: 'Go',
            onClickHandler: getSalaryData,
            className: 'btn-sm'
        }
    ];

    const handleTextChange = (e) => {
        var { name, value, type } = e.target;
        var model = filterData;
        var salaryPay = salaryPayModel;
        if (name !== 'paymentMode') {
            if (type === 'select-one' || name === 'employeeId' || name === 'month' || name === 'year' || name === 'amount') {
                value = parseInt(value);
                if (name === 'empId') {
                    salaryPay.employeeName = getEmpDataById(value);
                }
            }
            if (name === 'amount') {
                salaryPay.amount = isNaN(value) ? '' : value;
            }
        }
        if (name === 'jobTitle') {
            model.empId = 0;
        }
        if (type === "radio") {
            setFilterData({ ...model, "isEmployee": value === "Employee" ? true : false });
        }
        else {
            setFilterData({ ...model, [name]: value });
        }
        setSalaryPayModel({ ...salaryPay, [name]: value });
    }
    const getEmpDataById = (id) => {
        var emp = employeeData.find(x => x.id === id);
        if (emp !== undefined)
            return emp.value;
        return "";
    }
    const filterEmployee = () => {
        var data = employeeData.filter(x => x.data.isFixedEmployee !== filterData.isEmployee);
        if (filterData.isEmployee)
            return data.filter(x => x.data.jobTitleId === filterData.jobTitle);
        return data;
    }
    const handleSearch = () => {

    }
    const setSelectedData = (data) => {
        var model = salaryPayModel;
        model.amount = data?.amount - data?.emiAmount;
        model.month = data?.month;
        model.year=data?.year;
        model.employeeId=data?.employeeId;
        setSalaryPayModel({ ...model });
    }
    var header = headerFormat.empSalaryPayment;
    header[6].customColumn = (data) => {
        return data?.isPaid ? 'Yes' : <ButtonBox type="save" className="btn-sm" onClickHandler={e => setSelectedData(data)} text="Pay" modalId="#payEmpSalaryPaymentModel" />
    }
    const tableOptionTemplet = {
        headers: header,
        data: [],
        totalRecords: 0,
        searchHandler: handleSearch,
        showAction: false,
        showPagination: false
    }

    const validateError = () => {
        const {paymentDate,paidBy,paymentMode} = salaryPayModel;
        const newError = {};
        if (!paymentDate || paymentDate === "") newError.paymentDate = validationMessage.paymentDateRequired;
        if (!paidBy || paidBy === 0) newError.paidBy = validationMessage.paidByRequired;
        if (!paymentMode || paymentMode === "") newError.paymentMode = validationMessage.paymentModeRequired;
        return newError;
    }

    const savePaymentHandler = () => {
        const formError = validateError();
        if (Object.keys(formError).length > 0) {
            setErrors({...formError});
            return
          }

          Api.Post(apiUrls.accountController.addEmpSalaryPay,salaryPayModel)
          .then(res=>{
            if(res.data.id>0)
            toast.success(toastMessage.saveSuccess);
            common.closePopup('payEmpSalaryPaymentModelClose');
            var model=salaryPayModel;
            model.note="";
            model.paidBy='0';
            model.paymentDate=common.getHtmlDate(new Date());
            model.paymentMode="Cash";
            setSalaryPayModel({...model});
            setErrors({});
            getSalaryData();
          });
    }
    const [tableOptions, setTableOptions] = useState(tableOptionTemplet);
    return (
        <>
            <Breadcrumb option={breadcrumbOption}></Breadcrumb>
            <div className='d-flex justify-content-end' style={{ flexWrap: 'wrap' }}>
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
                    <SearchableDropdown defaultValue='' className="form-control-sm" data={jobTitles} name="jobTitle" searchable={true} onChange={handleTextChange} value={filterData.jobTitle} defaultText="Select employee"></SearchableDropdown>
                </div>
                }
                <div className='p-2'>
                    <SearchableDropdown defaultValue='' className="form-control-sm" data={filterEmployee()} name="empId" searchable={true} onChange={handleTextChange} value={filterData.empId} defaultText="Select employee"></SearchableDropdown>
                </div>
                <div className='p-2'>
                    <Dropdown defaultValue='' className="form-control-sm" data={common.numberRangerForDropDown(CURR_DATE.getFullYear() - 10, CURR_DATE.getFullYear())} name="year" onChange={handleTextChange} value={filterData.year} defaultText="Year"></Dropdown>
                </div>
                <div className='p-2'>
                    <ButtonBox btnList={btnList} />
                </div>
            </div>
            <hr />
            <TableView option={tableOptions}></TableView>

            <div className="modal fade" id="payEmpSalaryPaymentModel" tabIndex="-1" aria-labelledby="payEmpSalaryPaymentModelLabel" aria-hidden="true">
                <div className="modal-dialog modal-lg">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h5 className="modal-title" id="payEmpSalaryPaymentModelLabel">Employee/Staff Salary Payment</h5>
                            <button type="button" className="btn-close" id="payEmpSalaryPaymentModelClose" data-bs-dismiss="modal" aria-label="Close"></button>
                        </div>
                        <div className="modal-body">
                            <div className="form-horizontal form-material">
                                <div className="card">
                                    <div className="card-body">
                                        <div className="row g-3">
                                            <div className="col-12">
                                                <Inputbox className="form-control-sm" labelText="Employee name" isRequired={true} errorMessage={errors?.employeeId} name="employeeId" disabled={true} value={salaryPayModel.employeeName} type="text" onChangeHandler={handleTextChange} />
                                            </div>
                                            <div className="col-12 col-md-4 col-lg-4">
                                                <Inputbox labelText="Month" className="form-control-sm" disabled={true} isRequired={true} errorMessage={errors?.month} name="month" value={salaryPayModel.month} type="text" onChangeHandler={handleTextChange} />
                                            </div>
                                            <div className="col-12 col-md-4 col-lg-4">
                                                <Inputbox labelText="Year" className="form-control-sm" disabled={true} isRequired={true} errorMessage={errors?.year} name="year" value={salaryPayModel.year} type="text" onChangeHandler={handleTextChange} />
                                            </div>
                                            <div className="col-12 col-md-4 col-lg-4">
                                                <Inputbox labelText="Amount" disabled={true} className="form-control-sm" errorMessage={errors?.amount} name="amount" value={salaryPayModel.amount} type="text" onChangeHandler={handleTextChange} />
                                            </div>
                                            <div className="col-12 col-md-6 col-lg-6">
                                                <Label text="Payment Mode" isRequired={true} />
                                                <SearchableDropdown defaultValue='' className="form-control-sm" data={paymodeList} elementKey="value" errorMessage={errors?.paymentMode} name="paymentMode" searchable={true} onChange={handleTextChange} value={salaryPayModel.paymentMode} defaultText="Select Payment Mode"></SearchableDropdown>
                                                <ErrorLabel message={errors?.paymentMode} />
                                            </div>
                                            <div className="col-12 col-md-6 col-lg-6">
                                                <Label text="Paid By" isRequired={true} />
                                                <SearchableDropdown defaultValue='' className="form-control-sm" data={employeeData.filter(x => x.data.isFixedEmployee)} errorMessage={errors?.paidBy} name="paidBy" searchable={true} onChange={handleTextChange} value={filterData.paidBy} defaultText="Select Employee"></SearchableDropdown>
                                                <ErrorLabel message={errors?.paidBy} />
                                            </div>
                                            <div className="col-12 col-md-6">
                                                <Inputbox labelText="Payment Date" isRequired={true} className="form-control form-control-sm" name="paymentDate" errorMessage={errors?.paymentDate} value={salaryPayModel.paymentDate} type="date" onChangeHandler={handleTextChange} />
                                            </div>
                                            <div className="col-12 col-md-6">
                                                <Inputbox labelText="Note" className="form-control-sm" name="note" value={salaryPayModel.note} type="text" onChangeHandler={handleTextChange} /></div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="modal-footer">
                            <ButtonBox type="save" onClickHandler={savePaymentHandler} className="btn-sm" />
                            <ButtonBox type="cancel" modelDismiss={true} className="btn-sm" />
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}
