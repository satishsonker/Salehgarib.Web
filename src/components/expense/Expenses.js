import React, { useState, useEffect, useRef } from 'react'
import { toast } from 'react-toastify';
import { Api } from '../../apis/Api';
import { apiUrls } from '../../apis/ApiUrls';
import { toastMessage } from '../../constants/ConstantValues';
import { validationMessage } from '../../constants/validationMessage';
import { common } from '../../utils/common';
import { headerFormat } from '../../utils/tableHeaderFormat';
import Breadcrumb from '../common/Breadcrumb';
import Dropdown from '../common/Dropdown';
import ErrorLabel from '../common/ErrorLabel';
import Label from '../common/Label';
import TableView from '../tables/TableView';
import { useReactToPrint } from 'react-to-print';
import { PrintExpenseVoucher } from '../print/expense/PrintExpenseVoucher';
import Inputbox from '../common/Inputbox';
import ButtonBox from '../common/ButtonBox';
import { PrintExpenseReport } from '../print/expense/PrintExpenseReport';

export default function Expenses() {
  const expenseTemplate = {
    id: 0,
    expenseNo: 0,
    expenseTypeId: 0,
    expenseNameId: 0,
    companyId: 0,
    jobTitleId: 0,
    employeeId: 0,
    name: '',
    description: '',
    amount: 0,
    paymentMode:'Cash',
    expenseDate: common.getHtmlDate(new Date())
  }
  const filterModelTemplate = {
    fromDate: common.getHtmlDate(new Date(new Date().setFullYear(new Date().getFullYear() - 1))),
    toDate: common.getHtmlDate(new Date())
  }
  const [filterModel, setFilterModel] = useState(filterModelTemplate);
  const [expenseModel, setExpanseModel] = useState(expenseTemplate);
  const [isRecordSaving, setIsRecordSaving] = useState(true);
  const [pageNo, setPageNo] = useState(1);
  const [pageSize, setPageSize] = useState(20);
  const [errors, setErrors] = useState();
  const [expanseNameList, setExpanseNameList] = useState([]);
  const [expanseTypeList, setExpanseTypeList] = useState([]);
  const [expanseComapnyList, setExpanseComapnyList] = useState([]);
  const [jobTitleList, setJobTitleList] = useState([]);
  const [employeeList, setEmployeeList] = useState([]);
  const [paymentMode, setPaymentMode] = useState([]);
  const [expenseReceiptDataToPrint, setExpenseReceiptDataToPrint] = useState();
  const [expenseDataToPrint, setExpenseDataToPrint] = useState();
  const [isFilterClicked, setIsFilterClicked] = useState(1);
  const handleDelete = (id) => {
    Api.Delete(apiUrls.expenseController.deleteExpense + id).then(res => {
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
    Api.Get(apiUrls.expenseController.searchExpense + `?PageNo=${pageNo}&PageSize=${pageSize}&SearchTerm=${searchTerm}&fromDate=${filterModel.fromDate}&toDate=${filterModel.toDate}`).then(res => {
      tableOptionTemplet.data = res.data.data;
      tableOptionTemplet.totalRecords = res.data.totalRecords;
      setTableOption({ ...tableOptionTemplet });
    }).catch(err => {

    });
  }

  const handleTextChange = (e) => {
    var { value, name, type } = e.target;
    var data = expenseModel;
    if (type === 'select-one' && name!=='paymentMode') {
      value = parseInt(value);
    }
    if (name === 'expenseTypeId') {
      data.expenseNameId = 0
    }
    if (name === 'amount') {
      value = parseFloat(value);
    }
    data[name] = value;
    setExpanseModel({ ...data });

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

    let data = common.assignDefaultValue(expenseTemplate, expenseModel);
    if (isRecordSaving) {
      Api.MultiCall([Api.Put(apiUrls.expenseController.addExpense, data), Api.Get(apiUrls.expenseController.getExpenseNo)])
        .then(res => {
          if (res[0].data.id > 0) {
            common.closePopup('add-expense');
            toast.success(toastMessage.saveSuccess);
            handleSearch('');
            resetNewExpenseForm();
            let printVoucherData = expenseModel;
            printVoucherData.expenseShopCompany = expanseComapnyList.find(x => x.id === expenseModel.companyId).companyName;
            printVoucherData.createdAt = common.getHtmlDate(new Date());
            setExpenseReceiptDataToPrint(printVoucherData, () => { printExpenseReceiptHandler(); printExpenseReceiptHandler(); });
          }
        }).catch(err => {
          toast.error(toastMessage.saveError);
        });
    }
    else {
      Api.MultiCall([Api.Post(apiUrls.expenseController.updateExpense, expenseModel), Api.Get(apiUrls.expenseController.getExpenseNo)])
        .then(res => {
          if (res[0].data.id > 0) {
            common.closePopup('add-expense');
            toast.success(toastMessage.updateSuccess);
            handleSearch('');
            setExpanseModel({ ...expenseModel, ['expenseNo']: res[1].data });
            resetNewExpenseForm();
          }
        }).catch(err => {
          toast.error(toastMessage.updateError);
        });
    }
  }

  const handleEdit = (expenseId) => {
    setIsRecordSaving(false);
    setErrors({});
    Api.Get(apiUrls.expenseController.getExpense + expenseId).then(res => {
      if (res.data.id > 0) {
        setExpanseModel(res.data);
      }
    }).catch(err => {
      toast.error(toastMessage.getError);
    })
  };
  const printExpenseReceiptHandlerMain = (id, data) => {
    setExpenseReceiptDataToPrint(data, printExpenseReceiptHandler());
  }
  const printExpenseReceiptRef = useRef();
  const printExpenseRef = useRef();
  const printExpenseReceiptHandler = useReactToPrint({
    content: () => printExpenseReceiptRef.current,
    onAfterPrint: () => { setExpenseReceiptDataToPrint(undefined) }
  });
  const printExpenseHandler = useReactToPrint({
    content: () => printExpenseRef.current
  });
  const tableOptionTemplet = {
    headers: headerFormat.expenseDetail,
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
      popupModelId: "add-expense",
      delete: {
        handler: handleDelete
      },
      edit: {
        handler: handleEdit
      },
      print: {
        handler: printExpenseReceiptHandlerMain,
        title: "Print Expense Receipt",
      }
    }
  };

  const saveButtonHandler = () => {
    setErrors({});
    setIsRecordSaving(true);
  }
  const [tableOption, setTableOption] = useState(tableOptionTemplet);
  const breadcrumbOption = {
    title: 'Expanse',
    items: [
      {
        title: "Expanse '",
        icon: "bi bi-bank2",
        isActive: false,
      }
    ],
    buttons: [
      {
        text: "Exp Name",
        icon: 'bi bi-cash-coin',
        type: 'link',
        url: '/expense/name'
      },
      {
        text: "Exp Company",
        icon: 'bi bi-bank2',
        type: 'link',
        url: '/expense/company'
      },
      {
        text: "Expanse ",
        icon: 'bx bx-plus',
        modelId: 'add-expense',
        handler: saveButtonHandler
      }
    ]
  }

  useEffect(() => {
    setIsRecordSaving(true);
    Api.Get(apiUrls.expenseController.getAllExpense + `?PageNo=${pageNo}&PageSize=${pageSize}&fromDate=${filterModel.fromDate}&toDate=${filterModel.toDate}`).then(res => {
      tableOptionTemplet.data = res.data.data;
      tableOptionTemplet.totalRecords = res.data.totalRecords;
      setTableOption({ ...tableOptionTemplet });
      setExpenseDataToPrint({ ...res.data.data });
    }).catch(err => {

    });
  }, [pageNo, pageSize, isFilterClicked]);


  useEffect(() => {
    if (isRecordSaving) {
      setExpanseModel({ ...expenseTemplate });
    }
    Api.Get(apiUrls.expenseController.getExpenseNo).then(res => {
      expenseTemplate.expenseNo = res.data;
      expenseTemplate.amount=0;
      expenseTemplate.companyId=0;
      expenseTemplate.description="";
      expenseTemplate.employeeId=0;
      expenseTemplate.expenseDate=common.getHtmlDate(new Date());
      expenseTemplate.expenseNameId=0;
      expenseTemplate.expenseTypeId=0;
      expenseTemplate.id=0;
      expenseTemplate.jobTitleId=0;
      expenseTemplate.name="";
      expenseTemplate.paymentMode="Cash"
      setExpanseModel({ ...expenseTemplate });
    });
  }, [isRecordSaving]);

  useEffect(() => {
    var apiList = [];
    apiList.push(Api.Get(apiUrls.expenseController.getAllExpenseCompany));
    apiList.push(Api.Get(apiUrls.expenseController.getAllExpenseName));
    apiList.push(Api.Get(apiUrls.expenseController.getAllExpenseType));
    apiList.push(Api.Get(apiUrls.dropdownController.jobTitle));
    apiList.push(Api.Get(apiUrls.dropdownController.employee));
    apiList.push(Api.Get(apiUrls.expenseController.getExpenseNo));
    apiList.push(Api.Get(apiUrls.masterDataController.getByMasterDataType+'?masterDataType=payment_mode'));
    Api.MultiCall(apiList)
      .then(res => {
        setExpanseComapnyList(res[0].data.data);
        setExpanseNameList(res[1].data.data);
        setExpanseTypeList(res[2].data.data);
        setJobTitleList(res[3].data);
        setEmployeeList(res[4].data);
        setExpanseModel({ ...expenseModel, ['expenseNo']: res[5].data });
        setPaymentMode(res[6].data)
      });
  }, []);

  const filteredExpenceName = (typeId) => {
    return expanseNameList.filter(x => x.expenseTypeId === typeId);
  }

  const isEmpVisible = () => {
    var data = expanseNameList.find(x => x.id === expenseModel.expenseNameId);
    if (!data)
      return false;
    if (data.code.indexOf('worker') > -1 && (data.code.indexOf('salary') > -1 || data.code.indexOf('advance') > -1))
      return true
    return false;
  }

  const textChangeHandler = (e) => {
    var { name, value } = e.target;
    setFilterModel({ ...filterModel, [name]: value });
  }
  const validateError = () => {
    const {paymentMode, expenseDate, amount, name, expenseNameId, expenseTypeId, companyId, jobTitleId, employeeId } = expenseModel;
    const newError = {};
    if (!expenseNameId || expenseNameId === 0) newError.expenseNameId = validationMessage.expanseNameRequired;
    if (!expenseTypeId || expenseTypeId === 0) newError.expenseTypeId = validationMessage.expanseTypeRequired;
    if (!companyId || companyId === 0) newError.companyId = validationMessage.companyNameRequired;
    if (!amount || amount === 0) newError.amount = validationMessage.expanseAmountRequired;
    if (!name || name === '') newError.name = validationMessage.expanseNameRequired;
    if (!paymentMode || paymentMode === '') newError.paymentMode = validationMessage.paymentModeRequired;
    if (!expenseDate || expenseDate === '') newError.expenseDate = validationMessage.expanseDateRequired;
    if (isEmpVisible()) {
      if (!jobTitleId || jobTitleId === 0) newError.jobTitleId = validationMessage.jobTitleRequired;
      if (!employeeId || employeeId === 0) newError.employeeId = validationMessage.employeeRequired;
    }
    return newError;
  }

  const btnList = [
    {
      text: 'Go',
      onClickHandler: () => { setIsFilterClicked(data => data + 1) },
      className: 'btn-sm btn-success',
      icon: 'bi bi-arrow-left-circle'
    },
    {
      text: 'Print',
      onClickHandler: printExpenseHandler,
      className: 'btn-sm btn-warning',
      icon: 'bi bi-printer'
    }
  ]

  const resetNewExpenseForm=()=>{
    Api.Get(apiUrls.expenseController.getExpenseNo).then(res => {
      expenseTemplate.expenseNo = res.data;
      expenseTemplate.amount=0;
      expenseTemplate.companyId=0;
      expenseTemplate.description="";
      expenseTemplate.employeeId=0;
      expenseTemplate.expenseDate=common.getHtmlDate(new Date());
      expenseTemplate.expenseNameId=0;
      expenseTemplate.expenseTypeId=0;
      expenseTemplate.id=0;
      expenseTemplate.jobTitleId=0;
      expenseTemplate.name="";
      expenseTemplate.paymentMode='Cash';
      setExpanseModel({ ...expenseTemplate });
    });
  }
  return (
    <>
      <Breadcrumb option={breadcrumbOption}></Breadcrumb>
      <div className="d-flex justify-content-between">
        <h6 className="mb-0 text-uppercase">Expanse  Deatils</h6>
        <div>
          <div className='d-flex'>
            <div><Inputbox title="From Date" max={filterModel.toDate} onChangeHandler={textChangeHandler} name="fromDate" value={filterModel.fromDate} className="form-control-sm" showLabel={false} type="date"></Inputbox></div>
            <div><Inputbox title="To Date" min={filterModel.fromDate} max={common.getHtmlDate(new Date())} onChangeHandler={textChangeHandler} name="toDate" value={filterModel.toDate} className="form-control-sm" showLabel={false} type="date"></Inputbox></div>
            <div>
              <ButtonBox btnList={btnList} />
            </div>
          </div>
        </div>
      </div>

      <hr />
      <TableView option={tableOption}></TableView>
      {/* <!-- Add Contact Popup Model --> */}
      <div id="add-expense" className="modal fade in" tabIndex="-1" role="dialog" aria-labelledby="myModalLabel" aria-hidden="true">
        <div className="modal-dialog">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title">{isRecordSaving ? 'New ' : 'Update '}Expanse </h5>
              <button type="button" className="btn-close" data-bs-dismiss="modal" aria-hidden="true"></button>
            </div>
            <div className="modal-body">
              <div className="form-horizontal form-material">
                <div className="card">
                  <div className="card-body">
                    <form className="row g-3">
                      <div className="col-md-6">
                        <Label text="Expense Number"></Label>
                        <input value={expenseModel.expenseNo} disabled className="form-control form-control-sm" />
                      </div>
                      <div className="col-md-6">
                        <Inputbox isRequired={true} max={common.getHtmlDate(new Date())} errorMessage={errors?.expenseDate} labelText="Expense Date" maxLength={200} onChangeHandler={handleTextChange} name="expenseDate" value={expenseModel.expenseDate} type="date" className="form-control-sm" />
                      </div>
                      <div className={expenseModel.expenseTypeId > 0 ? "col-md-6" : "col-md-12"}>
                        <Label text="Expense Type" isRequired={true}></Label>
                        <Dropdown onChange={handleTextChange} data={expanseTypeList} name="expenseTypeId" value={expenseModel.expenseTypeId} className="form-control form-control-sm" />
                        <ErrorLabel message={errors?.expenseTypeId}></ErrorLabel>
                      </div>
                      {expenseModel.expenseTypeId > 0 && <div className="col-md-6">
                        <Label text="Expense Name" isRequired={true}></Label>
                        <Dropdown onChange={handleTextChange} data={filteredExpenceName(expenseModel.expenseTypeId)} name="expenseNameId" value={expenseModel.expenseNameId} className="form-control form-control-sm" />
                        <ErrorLabel message={errors?.expenseNameId}></ErrorLabel>
                      </div>
                      }
                      <div className="col-md-12">
                        <Label text="Comapy/Shop Name" isRequired={true}></Label>
                        <Dropdown onChange={handleTextChange} text="companyName" data={expanseComapnyList} name="companyId" value={expenseModel.companyId} className="form-control form-control-sm" />
                        <ErrorLabel message={errors?.companyId}></ErrorLabel>
                      </div>
                      {isEmpVisible() && <>
                        <div className="col-md-6">
                          <Label text="Employee Categoty" isRequired={true}></Label>
                          <Dropdown onChange={handleTextChange} data={jobTitleList} name="jobTitleId" value={expenseModel.jobTitleId} className="form-control form-control-sm" />
                          <ErrorLabel message={errors?.jobTitleId}></ErrorLabel>
                        </div>
                        <div className="col-md-6">
                          <Label text="Employee Name" isRequired={true}></Label>
                          <Dropdown onChange={handleTextChange} data={employeeList} name="employeeId" value={expenseModel.employeeId} className="form-control form-control-sm" />
                          <ErrorLabel message={errors?.employeeId}></ErrorLabel>
                        </div>
                      </>
                      }
                      <div className="col-md-6">
                        <Inputbox errorMessage={errors?.name} labelText="Name" isRequired={true} maxLength={100} onChangeHandler={handleTextChange} name="name" value={expenseModel.name} type="text" className="form-control-sm" />
                      </div>
                      <div className="col-md-3">
                          <Label text="Payment By" isRequired={true}></Label>
                          <Dropdown onChange={handleTextChange} data={paymentMode} name="paymentMode" elementKey="value" value={expenseModel.paymentMode} className="form-control form-control-sm" />
                          <ErrorLabel message={errors?.paymentMode}></ErrorLabel>
                        </div>
                      <div className="col-md-3">
                        <Inputbox min={0} max={1000000} errorMessage={errors?.amount} labelText="Amount" maxLength={200} onChangeHandler={handleTextChange} name="amount" value={expenseModel.amount} type="number" className="form-control-sm" />
                      </div>
                      <div className="col-md-12">
                        <Inputbox labelText="Description" maxLength={200} onChangeHandler={handleTextChange} name="description" value={expenseModel.description} type="text" className="form-control-sm" />
                      </div>
                    </form>
                  </div>
                </div>
              </div>
            </div>
            <div className="modal-footer">
              <ButtonBox className="btn-info text-white waves-effect" onClickHandler={handleSave} type={isRecordSaving ? 'save' : 'update'} />
              <ButtonBox id='closePopup' className="waves-effect" modelDismiss="modal" type="cancel" />
            </div>
          </div>
          {/* <!-- /.modal-content --> */}
        </div>
        <div className='d-none'>
          <PrintExpenseVoucher props={expenseReceiptDataToPrint} ref={printExpenseReceiptRef}></PrintExpenseVoucher>
          <PrintExpenseReport props={{ filter: filterModel, data: expenseDataToPrint }} ref={printExpenseRef} />
        </div>
      </div>
      {/* <!-- /.modal-dialog --> */}
    </>

  )
}
