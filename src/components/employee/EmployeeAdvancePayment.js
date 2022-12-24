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
import EMIDetailPopup from './EMIDetailPopup';
import { useReactToPrint } from 'react-to-print';
import { PrintAdvancePaymentReceipt } from '../print/employee/PrintAdvancePaymentReceipt';
import { PrintAdvancePaymentStatement } from '../print/employee/PrintAdvancePaymentStatement';

export default function EmployeeAdvancePayment() {
    const [viewEmiData, setViewEmiData] = useState([]);
    const employeeModelTemplate = {
        id: 0,
        employeeId: 0,
        amount: 0,
        reason: '',
        emi: 0,
        emiStartMonth: 0,
        emiStartYear: 0,
    }
    const emiOption = [
        { id: 0, value: 'No EMI' },
        { id: 1, value: '1' },
        { id: 2, value: '2' },
        { id: 3, value: '3' },
        { id: 6, value: '6' },
        { id: 9, value: '9' },
        { id: 12, value: '12' },
        { id: 24, value: '24' },
        { id: 36, value: '36' },
    ]
    const [employeeModel, setEmployeeModel] = useState(employeeModelTemplate);
    const [isRecordSaving, setIsRecordSaving] = useState(true);
    const [pageNo, setPageNo] = useState(1);
    const [pageSize, setPageSize] = useState(10);
    const [employeeList, setEmployeeList] = useState([]);
    const [errors, setErrors] = useState();
    const [empAdvanceReceiptDataToPrint, setEmpAdvanceReceiptDataToPrint] = useState();
    const [empAdvanceStatementDataToPrint, setEmpAdvanceStatementDataToPrint] = useState();
    const handleDelete = (id) => {
        Api.Delete(apiUrls.employeeAdvancePaymentController.delete + id).then(res => {
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
                setEmployeeModel(res.data);
            }
        }).catch(err => {
            toast.error(toastMessage.getError);
        })
    };
    const printEmpAdvanceReceiptRef = useRef();
    const printEmpAdvanceStatementRef = useRef();
    const PrintEmpAdvanceReceiptHandler = useReactToPrint({
        content: () => printEmpAdvanceReceiptRef.current,
    });
    const PrintEmpAdvanceStatementHandler = useReactToPrint({
        content: () => printEmpAdvanceStatementRef.current,
    });
    const PrintEmpAdvanceReceipt = (id, data) => {
        setEmpAdvanceReceiptDataToPrint(data,PrintEmpAdvanceReceiptHandler());
    }
    const PrintEmpAdvanceStatement = (id, data) => {
        Api.Get(apiUrls.employeeAdvancePaymentController.getStatement+id)
        .then(res=>{
            var obj={emp:data,statement:res.data};
            setEmpAdvanceStatementDataToPrint(obj,PrintEmpAdvanceReceiptHandler());
        })
        //setEmpAdvanceStatementDataToPrint(data);
        PrintEmpAdvanceStatementHandler();
    }
    const tableOptionTemplet = {
        headers: [
            { name: 'First Name', prop: 'firstName', customColumn: (dataRow, headerRow) => { return dataRow.employee[headerRow.prop] } },
            { name: 'Last Name', prop: 'lastName', customColumn: (dataRow, headerRow) => { return dataRow.employee[headerRow.prop] } },
            { name: 'Job Title', prop: 'jobTitle', customColumn: (dataRow, headerRow) => { return dataRow.employee[headerRow.prop] } },
            { name: 'Amount', prop: 'amount' },
            { name: 'EMI', prop: 'emi', customColumn: (dataRow, headerRow) => { return dataRow[headerRow.prop] + ' Months' } },
            { name: 'Reason', prop: 'reason' },
            { name: 'Date', prop: 'createdAt' },

        ],
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
        apiCalls.push(Api.Get(apiUrls.dropdownController.employee));
        Api.MultiCall(apiCalls).then(res => {
            if (res[0].data.length > 0)
                setEmployeeList([...res[0].data]);
        })
    }, []);

    const getEmiStartYear = () => {
        let startYear = new Date().getFullYear();
        let endYear = startYear + 10;
        return common.numberRangerForDropDown(startYear, endYear);
    }
    const getEmiStartMonth = () => {
        let months = [];
        common.monthList.forEach((ele, index) => {
            months.push({ id: index + 1, value: ele });
        });
        return months;
    }

    const validateError = () => {
        const { employeeId, reason, amount, emiStartMonth, emiStartYear, emi } = employeeModel;
        const newError = {};
        if (!amount || amount === 0) newError.amount = validationMessage.advanceAmountRequired;
        if (!reason || reason === "") newError.reason = validationMessage.reasonRequired;
        if (!employeeId || employeeId === 0) newError.employeeId = validationMessage.employeeRequired;
        if (emi > 0) {
            if (!emiStartMonth || emiStartMonth === 0) newError.emiStartMonth = validationMessage.emiStartMonthRequired;
            if (!emiStartYear || emiStartYear === "") newError.emiStartYear = validationMessage.emiStartYearRequired;
            if (new Date(`${emiStartYear}-${emiStartMonth}-1`) <= new Date()) {
                newError.emiStartMonth = validationMessage.emiStartMonthError;
            }
        }
        return newError;
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
                                        <form className="row g-3">
                                            <div className="col-md-12">
                                                <Label text="Employee" isRequired={true} />
                                                <Dropdown defaultValue='' data={employeeList} name="employeeId" searchable={true} onChange={handleTextChange} value={employeeModel.employeeId} defaultText="Select employee"></Dropdown>
                                                <ErrorLabel message={errors?.employeeId}></ErrorLabel>
                                            </div>
                                            <div className="col-md-6">
                                                <Label text="Amount" isRequired={true}></Label>
                                                <input required onChange={e => handleTextChange(e)} name="amount" value={employeeModel.amount} type="number" min={0} id='amount' className="form-control" />
                                                <ErrorLabel message={errors?.amount}></ErrorLabel>
                                            </div>
                                            <div className="col-md-6">
                                                <Label text="EMI (In Months)" />
                                                <Dropdown defaultValue="" data={emiOption} name="emi" searchable={true} onChange={handleTextChange} elementKey="id" value={employeeModel.emi} defaultText="Select EMI"></Dropdown>
                                            </div>
                                            {employeeModel.emi > 0 &&
                                                <>
                                                    <div className="col-md-6">
                                                        <Label text="EMI Start Month" isRequired={true} />
                                                        <Dropdown defaultValue="" data={getEmiStartMonth()} name="emiStartMonth" onChange={handleTextChange} elementKey="id" value={employeeModel.emiStartMonth} defaultText="Select EMI Start Month"></Dropdown>
                                                        <ErrorLabel message={errors?.emiStartMonth}></ErrorLabel>
                                                    </div>
                                                    <div className="col-md-6">
                                                        <Label text="EMI Start Year" isRequired={true} />
                                                        <Dropdown defaultValue="" data={getEmiStartYear()} name="emiStartYear" onChange={handleTextChange} elementKey="id" value={employeeModel.emiStartYear} defaultText="Select EMI Start Year"></Dropdown>
                                                        <ErrorLabel message={errors?.emiStartYear}></ErrorLabel>
                                                    </div>
                                                </>
                                            }
                                            <div className="col-12">
                                                <Label text="Reason" />
                                                <textarea rows={3} style={{ resize: 'none' }} onChange={e => handleTextChange(e)} type="text" name="reason" value={employeeModel.reason} className="form-control" />
                                                <ErrorLabel message={errors?.reason}></ErrorLabel>
                                            </div>
                                        </form>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="modal-footer">
                            <button type="submit" onClick={e => handleSave(e)} className="btn btn-info text-white waves-effect" >{isRecordSaving ? 'Save' : 'Update'}</button>
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
