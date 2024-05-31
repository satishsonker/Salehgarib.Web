import React, { useState, useEffect, useRef } from 'react'
import { toast } from 'react-toastify';
import { Api } from '../../apis/Api';
import { apiUrls } from '../../apis/ApiUrls';
import { toastMessage } from '../../constants/ConstantValues';
import { validationMessage } from '../../constants/validationMessage';
import { common } from '../../utils/common';
import Breadcrumb from '../common/Breadcrumb';
import ErrorLabel from '../common/ErrorLabel';
import Label from '../common/Label';
import TableView from '../tables/TableView';
import EMIDetailPopup from './EMIDetailPopup';
import { useReactToPrint } from 'react-to-print';
import { PrintAdvancePaymentReceipt } from '../print/employee/PrintAdvancePaymentReceipt';
import { PrintAdvancePaymentStatement } from '../print/employee/PrintAdvancePaymentStatement';
import ButtonBox from '../common/ButtonBox';
import Inputbox from '../common/Inputbox';
import { headerFormat } from '../../utils/tableHeaderFormat';
import SearchableDropdown from '../common/SearchableDropdown/SearchableDropdown';

export default function EmployeeAdvancePayment() {
    const [viewEmiData, setViewEmiData] = useState([]);
    const employeeModelTemplate = {
        id: 0,
        employeeId: 0,
        jobTitleId: 0,
        amount: 0,
        reason: '',
        emi: 0,
        emiStartMonth: 0,
        emiStartYear: 0,
        advanceDate: common.getCurrDate(true)
    }
    const emiOption = common.emiOptions;
    const [employeeModel, setEmployeeModel] = useState(employeeModelTemplate);
    const [isRecordSaving, setIsRecordSaving] = useState(true);
    const [pageNo, setPageNo] = useState(1);
    const [pageSize, setPageSize] = useState(20);
    const [employeeList, setEmployeeList] = useState([]);
    const [jobTitleList, setJobTitleList] = useState([]);
    const [errors, setErrors] = useState();
    const [empAdvanceReceiptDataToPrint, setEmpAdvanceReceiptDataToPrint] = useState();
    const [empAdvanceStatementDataToPrint, setEmpAdvanceStatementDataToPrint] = useState();
    const [emiBreakupDetail, setEmiBreakupDetail] = useState([]);
    const printEmpAdvanceReceiptRef = useRef();
    const printEmpAdvanceStatementRef = useRef();

    const handleDelete = (id) => {
        Api.Delete(apiUrls.employeeAdvancePaymentController.delete + id).then(res => {
            if (res.data > 0) {
                handleSearch('');
                toast.success(toastMessage.deleteSuccess);
            }
        });
    }

    const handleSearch = (searchTerm) => {
        if (searchTerm.length > 0 && searchTerm.length < 3)
            return;
        Api.Get(apiUrls.employeeAdvancePaymentController.search + `?PageNo=${pageNo}&PageSize=${pageSize}&SearchTerm=${searchTerm}`).then(res => {
            tableOptionTemplet.data = res.data.data;
            tableOptionTemplet.totalRecords = res.data.totalRecords;
            setTableOption({ ...tableOptionTemplet });
        }).catch(err => {

        });
    }

    const handleView = (id, data) => {
        setViewEmiData(data.employeeEMIPayments);
    }

    const handleTextChange = (e) => {
        var { value, type, name } = e.target;

        if (type === 'select-one' || type === 'number') {
            value = parseInt(value);
            if (name === "emiStartMonth" || name === 'emiStartYear') {
                setEmiBreakupDetail(getEmiBreakupDetails());
            }
        }

        setEmployeeModel({ ...employeeModel, [name]: value });

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
            Api.Put(apiUrls.employeeAdvancePaymentController.add, data).then(res => {
                if (res.data.id > 0) {
                    common.closePopup('closePopupAdvancePayment');
                    toast.success(toastMessage.saveSuccess);
                    handleSearch('');
                }
            }).catch(err => {
                toast.error(toastMessage.saveError);
            });
        }
        else {
            Api.Post(apiUrls.employeeAdvancePaymentController.update, employeeModel).then(res => {
                if (res.data.id > 0) {
                    common.closePopup('closePopupAdvancePayment');
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
        Api.Get(apiUrls.employeeAdvancePaymentController.get + employeeId).then(res => {
            if (res.data.id > 0) {
                var newData = res.data;
                newData.jobTitleId = newData?.employee?.jobTitleId ?? 0
                setEmployeeModel(res.data);

            }
        });
    };

    const PrintEmpAdvanceReceiptHandler = useReactToPrint({
        content: () => printEmpAdvanceReceiptRef.current,
    });

    const PrintEmpAdvanceStatementHandler = useReactToPrint({
        content: () => printEmpAdvanceStatementRef.current,
    });

    const PrintEmpAdvanceReceipt = (id, data) => {
        setEmpAdvanceReceiptDataToPrint(data, PrintEmpAdvanceReceiptHandler());
    }

    const PrintEmpAdvanceStatement = (id, data) => {
        Api.Get(apiUrls.employeeAdvancePaymentController.getStatement + id)
            .then(res => {
                var obj = { emp: data, statement: res.data };
                setEmpAdvanceStatementDataToPrint(obj, PrintEmpAdvanceReceiptHandler());
            })
        //setEmpAdvanceStatementDataToPrint(data);
        PrintEmpAdvanceStatementHandler();
    }

    const tableOptionTemplet = {
        headers: headerFormat.employeeAdvancePayment,
        data: [],
        totalRecords: 0,
        pageSize: pageSize,
        pageNo: pageNo,
        setPageNo: setPageNo,
        setPageSize: setPageSize,
        searchHandler: handleSearch,
        actions: {
            showPrint: true,
            view: {
                handler: handleView,
                modelId: "emi-details-popup-model"
            },
            popupModelId: "add-employee-advance",
            delete: {
                handler: handleDelete
            },
            edit: {
                handler: handleEdit
            },
            print: {
                handler: PrintEmpAdvanceReceipt,
                title: 'Print Advance Receipt'
            },
            buttons: [
                {
                    icon: 'bi bi-printer',
                    modelId: 'add-employee-advance',
                    title: "Advance Payment Statement",
                    className: "text-warning",
                    handler: PrintEmpAdvanceStatement
                }
            ]
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
                title: "Employee advance payment Details",
                icon: "bi bi-person-badge-fill",
                isActive: false,
            }
        ],
        buttons: [
            {
                text: "Advance Payment",
                icon: 'bx bx-plus',
                modelId: 'add-employee-advance',
                handler: saveButtonHandler
            }
        ]
    }

    useEffect(() => {
        setIsRecordSaving(true);
        Api.Get(apiUrls.employeeAdvancePaymentController.getAll + `?PageNo=${pageNo}&PageSize=${pageSize}`).then(res => {
            tableOptionTemplet.data = res.data.data;
            tableOptionTemplet.totalRecords = res.data.totalRecords;
            setTableOption({ ...tableOptionTemplet });
        })
            ;
    }, [pageNo, pageSize]);

    useEffect(() => {
        if (isRecordSaving) {
            setEmployeeModel({ ...employeeModelTemplate });
        }
    }, [isRecordSaving])

    useEffect(() => {
        let apiCalls = [];
        apiCalls.push(Api.Get(apiUrls.dropdownController.employee));
        apiCalls.push(Api.Get(apiUrls.dropdownController.jobTitle));
        Api.MultiCall(apiCalls).then(res => {
            if (res[0].data.length > 0)
                setEmployeeList([...res[0].data]);
            setJobTitleList(res[1].data);
        });
    }, []);

    const getEmiStartYear = () => {
        let startYear = new Date().getFullYear();
        let endYear = startYear + 2;
        return common.numberRangerForDropDown(startYear - 5, endYear);
    }

    const getEmiStartMonth = () => {
        let months = [];
        common.monthList.forEach((ele, index) => {
            months.push({ id: index + 1, value: ele });
        });
        return months;
    }

    const validateError = () => {
        const { employeeId, reason, amount, emiStartMonth, emiStartYear, emi, advanceDate } = employeeModel;
        const newError = {};
        if (!amount || amount === 0) newError.amount = validationMessage.advanceAmountRequired;
        if (!advanceDate || advanceDate === 0) newError.advanceDate = validationMessage.advanceDateRequired;
        if (!reason || reason === "") newError.reason = validationMessage.reasonRequired;
        if (!employeeId || employeeId === 0) newError.employeeId = validationMessage.employeeRequired;
        if (emi > 0) {
            var advDate = new Date(advanceDate);
            if (!emiStartMonth || emiStartMonth === 0) newError.emiStartMonth = validationMessage.emiStartMonthRequired;
            if (!emiStartYear || emiStartYear === "") newError.emiStartYear = validationMessage.emiStartYearRequired;
            if (new Date(`${emiStartYear}-${emiStartMonth}-1`) < common.getFirstDateOfMonth(advDate.getMonth(), advDate.getFullYear())) {
                newError.emiStartMonth = validationMessage.emiStartMonthError;
            }
        }
        return newError;
    }

    const getEmiBreakupDetails = () => {
        debugger;
        var emiDetails = [];
        var emiDate = new Date(`${employeeModel.emiStartYear}-${employeeModel.emiStartMonth}-01`);
        for (let index = 0; index < employeeModel.emi; index++) {
            emiDate.setMonth(emiDate.getMonth()+1);
            emiDetails.push({
                amount: employeeModel.amount / employeeModel.emi,
                deductionMonth: emiDate.getMonth()===0?12:emiDate.getMonth(),
                deductionYear: emiDate.getFullYear(),
                remark: `${(index + 1)} month EMI`
            });
        }
        return emiDetails;
    }

    return (
        <>
            <div style={{ display: 'none' }}>
                <PrintAdvancePaymentReceipt props={empAdvanceReceiptDataToPrint} ref={printEmpAdvanceReceiptRef}></PrintAdvancePaymentReceipt>
                <PrintAdvancePaymentStatement prop={empAdvanceStatementDataToPrint} ref={printEmpAdvanceStatementRef}></PrintAdvancePaymentStatement>
            </div>
            <EMIDetailPopup data={viewEmiData} />
            <Breadcrumb option={breadcrumbOption}></Breadcrumb>
            <h6 className="mb-0 text-uppercase">Advance Payment Details</h6>
            <hr />
            <TableView option={tableOption}></TableView>

            {/* <!-- Add Contact Popup Model --> */}
            <div id="add-employee-advance" className="modal fade in" data-bs-backdrop="static" data-bs-keyboard="false" tabIndex="-1" role="dialog" aria-labelledby="myModalLabel" aria-hidden="true">
                <div className="modal-dialog modal-lg">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h5 className="modal-title">New Advance Payment</h5>
                            <button type="button" className="btn-close" id='closePopupAdvancePayment' data-bs-dismiss="modal" aria-hidden="true"></button>
                        </div>
                        <div className="modal-body">
                            <div className="form-horizontal form-material">
                                <div className="card">
                                    <div className="card-body">
                                        <div className="row g-3">
                                            <div className="col-md-6">
                                                <Label text="Job Title" isRequired={true} />
                                                <SearchableDropdown defaultValue='' data={jobTitleList} name="jobTitleId" searchable={true} onChange={handleTextChange} value={employeeModel.jobTitleId} defaultText="Select Job Title"></SearchableDropdown>
                                                <ErrorLabel message={errors?.jobTitleId}></ErrorLabel>
                                            </div>
                                            <div className="col-md-6">
                                                <Label text="Employee" isRequired={true} />
                                                <SearchableDropdown defaultValue='' data={employeeList.filter(x => x.data.jobTitleId === employeeModel.jobTitleId)} name="employeeId" searchable={true} onChange={handleTextChange} value={employeeModel.employeeId} defaultText="Select employee"></SearchableDropdown>
                                                <ErrorLabel message={errors?.employeeId}></ErrorLabel>
                                            </div>
                                            <div className="col-md-4">
                                                <Inputbox className="form-control-sm" name="advanceDate" errorMessage={errors?.advanceDate} value={common.getHtmlDate(employeeModel.advanceDate)} type="date" onChangeHandler={handleTextChange} labelText="Advance Date" isRequired={true} />
                                            </div>
                                            <div className="col-md-4">
                                                <Inputbox className="form-control-sm" name="amount" errorMessage={errors?.amount} value={employeeModel.amount} type="number" onChangeHandler={handleTextChange} labelText="Amount" isRequired={true} />
                                            </div>
                                            <div className="col-md-4">
                                                <Label text="EMI (In Months)" />
                                                <SearchableDropdown disabled={employeeModel.amount <= 0} defaultValue="" data={emiOption} name="emi" searchable={true} onChange={handleTextChange} elementKey="id" value={employeeModel.emi} defaultText="Select EMI"></SearchableDropdown>
                                            </div>
                                            {employeeModel.emi > 0 &&
                                                <>
                                                    <div className="col-md-6">
                                                        <Label text="EMI Start Month" isRequired={true} />
                                                        <SearchableDropdown defaultValue="" data={getEmiStartMonth()} name="emiStartMonth" onChange={handleTextChange} elementKey="id" value={employeeModel.emiStartMonth} defaultText="Select EMI Start Month"></SearchableDropdown>
                                                        <ErrorLabel message={errors?.emiStartMonth}></ErrorLabel>
                                                    </div>
                                                    <div className="col-md-6">
                                                        <Label text="EMI Start Year" isRequired={true} />
                                                        <SearchableDropdown defaultValue="" data={getEmiStartYear()} name="emiStartYear" onChange={handleTextChange} elementKey="id" value={employeeModel.emiStartYear} defaultText="Select EMI Start Year"></SearchableDropdown>
                                                        <ErrorLabel message={errors?.emiStartYear}></ErrorLabel>
                                                    </div>
                                                </>
                                            }
                                            <div className="col-12">
                                                <Label text="Reason" isRequired={true} />
                                                <textarea rows={3} style={{ resize: 'none' }} onChange={e => handleTextChange(e)} type="text" name="reason" value={employeeModel.reason} className="form-control" />
                                                <ErrorLabel message={errors?.reason}></ErrorLabel>
                                            </div>
                                        </div>
                                        {employeeModel.emi > 0 && employeeModel.amount > 0 && employeeModel.emiStartMonth > 0 && employeeModel.emiStartYear > 0 && <div className='row my-2'>
                                            <div className='col-12' style={{ maxHeight: '300px' }}>
                                                <table className="table table-striped table-bordered">
                                                    <thead>
                                                        <tr>
                                                            <th className='text-center'>#</th>
                                                            <th className='text-center'>Amount</th>
                                                            <th className='text-center'>Deducted On</th>
                                                            <th className='text-center'>Remark</th>
                                                        </tr>
                                                    </thead>
                                                    <tbody>
                                                        <>
                                                            {
                                                                getEmiBreakupDetails()?.map((ele, index) => {
                                                                    return <tr key={index}>
                                                                        <td className='text-center'>{index + 1}</td>
                                                                        <td className='text-center'>{common.printDecimal(ele.amount)}</td>
                                                                        <td className='text-center'>{common.monthList[ele.deductionMonth - 1]}, {ele.deductionYear}</td>
                                                                        <td className='text-center'>{ele.remark}</td>
                                                                    </tr>
                                                                })
                                                            }
                                                        </>
                                                    </tbody>
                                                </table>
                                            </div>
                                        </div>
                                        }
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="modal-footer">
                            <ButtonBox text={isRecordSaving ? 'Save' : 'Update'} type={isRecordSaving ? 'save' : 'update'} onClickHandler={handleSave} className="btn-sm" />
                            <ButtonBox type="cancel" className="btn-sm" modelDismiss={true} />
                        </div>
                    </div>
                    {/* <!-- /.modal-content --> */}
                </div>
            </div>
            {/* <!-- /.modal-dialog --> */}
        </>
    )
}
