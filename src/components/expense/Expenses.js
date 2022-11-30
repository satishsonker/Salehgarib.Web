import React, { useState, useEffect } from 'react'
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

export default function Expenses() {
  const expenseTemplate = {
    id: 0,
    expenseNo:0,
    expenseTypeId: 0,
    expenseNameId: 0,
    companyId: 0,
    jobTitleId: 0,
    employeeId: 0,
    name:'',
    description:'',
    amount:0
  }
  const [expenseModel, setExpanseModel] = useState(expenseTemplate);
  const [isRecordSaving, setIsRecordSaving] = useState(true);
  const [pageNo, setPageNo] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [errors, setErrors] = useState();
  const [expanseNameList, setExpanseNameList] = useState([]);
  const [expanseTypeList, setExpanseTypeList] = useState([]);
  const [expanseComapnyList, setExpanseComapnyList] = useState([]);
  const [jobTitleList, setJobTitleList] = useState([]);
  const [employeeList, setEmployeeList] = useState([]);
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
    Api.Get(apiUrls.expenseController.searchExpense + `?PageNo=${pageNo}&PageSize=${pageSize}&SearchTerm=${searchTerm}`).then(res => {
      tableOptionTemplet.data = res.data.data;
      tableOptionTemplet.totalRecords = res.data.totalRecords;
      setTableOption({ ...tableOptionTemplet });
    }).catch(err => {

    });
  }

  const handleTextChange = (e) => {
    var { value, name, type } = e.target;
    var data = expenseModel;
    if (type === 'select-one') {
      value = parseInt(value);
    }
    if (name === 'expenseTypeId') {
      data.expenseNameId = 0
    }
    if(name==='amount')
    {
      value=parseFloat(value);
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
          setExpanseModel({...expenseModel,['expenseNo']:res[1].data});
        }
      }).catch(err => {
        toast.error(toastMessage.saveError);
      });
    }
    else {
    Api.MultiCall([ Api.Post(apiUrls.expenseController.updateExpense, expenseModel),Api.Get(apiUrls.expenseController.getExpenseNo)]) 
      .then(res => {
        if (res[0].data.id > 0) {
          common.closePopup('add-expense');
          toast.success(toastMessage.updateSuccess);
          handleSearch('');
          setExpanseModel({...expenseModel,['expenseNo']:res[1].data});
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

  const tableOptionTemplet = {
    headers: [
      { name: 'Expense No', prop: 'expenseNo' },
      { name: 'Expense Name', prop: 'expenseName' },
      { name: 'Expense Type', prop: 'expenseType' },
      { name: 'Emp Categoty', prop: 'jobTitle' },
      { name: 'Emp Name', prop: 'employeeName' },
      { name: 'Name', prop: 'name' },
      { name: 'Company/Shop', prop: 'expenseShopCompany' },
      { name: 'Description', prop: 'description' },
      { name: 'Amount', prop: 'amount' },
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
      popupModelId: "add-expense",
      delete: {
        handler: handleDelete
      },
      edit: {
        handler: handleEdit
      }
    }
  };

  const saveButtonHandler = () => {

    setExpanseModel({ ...expenseTemplate });
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
        text: "Expanse ",
        icon: 'bx bx-plus',
        modelId: 'add-expense',
        handler: saveButtonHandler
      }
    ]
  }

  useEffect(() => {
    setIsRecordSaving(true);
    Api.Get(apiUrls.expenseController.getAllExpense + `?PageNo=${pageNo}&PageSize=${pageSize}`).then(res => {
      tableOptionTemplet.data = res.data.data;
      tableOptionTemplet.totalRecords = res.data.totalRecords;
      setTableOption({ ...tableOptionTemplet });
    })
      .catch(err => {

      });
  }, [pageNo, pageSize]);


  useEffect(() => {
    if (isRecordSaving) {
      setExpanseModel({ ...expenseTemplate });
    }
    
  }, [isRecordSaving]);

  useEffect(() => {
    var apiList = [];
    apiList.push(Api.Get(apiUrls.expenseController.getAllExpenseCompany));
    apiList.push(Api.Get(apiUrls.expenseController.getAllExpenseName));
    apiList.push(Api.Get(apiUrls.expenseController.getAllExpenseType));
    apiList.push(Api.Get(apiUrls.dropdownController.jobTitle));
    apiList.push(Api.Get(apiUrls.dropdownController.employee));
    apiList.push(Api.Get(apiUrls.expenseController.getExpenseNo));
    Api.MultiCall(apiList)
      .then(res => {
        setExpanseComapnyList(res[0].data.data);
        setExpanseNameList(res[1].data.data);
        setExpanseTypeList(res[2].data.data);
        setJobTitleList(res[3].data);
        setEmployeeList(res[4].data);
        setExpanseModel({...expenseModel,['expenseNo']:res[5].data});
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

  const validateError = () => {
    const {amount,name, expenseNameId, expenseTypeId, companyId, jobTitleId, employeeId } = expenseModel;
    const newError = {};
    if (!expenseNameId || expenseNameId === 0) newError.expenseNameId = validationMessage.expanseNameRequired;
    if (!expenseTypeId || expenseTypeId === 0) newError.expenseTypeId = validationMessage.expanseTypeRequired;
    if (!companyId || companyId === 0) newError.companyId = validationMessage.companyNameRequired;
    if (!amount || amount === 0) newError.amount = validationMessage.expanseAmountRequired;
    if (!name || name === 0) newError.name = validationMessage.expanseNameRequired;
    if (isEmpVisible()) {
      if (!jobTitleId || jobTitleId === 0) newError.jobTitleId = validationMessage.jobTitleRequired;
      if (!employeeId || employeeId === 0) newError.employeeId = validationMessage.employeeRequired;
    }
    return newError;
  }
  return (
    <>
      <Breadcrumb option={breadcrumbOption}></Breadcrumb>
      <h6 className="mb-0 text-uppercase">Expanse  Deatils</h6>
      <hr />
      <TableView option={tableOption}></TableView>

      {/* <!-- Add Contact Popup Model --> */}
      <div id="add-expense" className="modal fade in" tabIndex="-1" role="dialog" aria-labelledby="myModalLabel" aria-hidden="true">
        <div className="modal-dialog">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title">{isRecordSaving?'New ':'Update '}Expanse </h5>
              <button type="button" className="btn-close" data-bs-dismiss="modal" aria-hidden="true"></button>
            </div>
            <div className="modal-body">
              <div className="form-horizontal form-material">
                <div className="card">
                  <div className="card-body">
                    <form className="row g-3">
                    <div className="col-md-12">
                        <Label text="Expense Number"></Label>
                        <input value={expenseModel.expenseNo} disabled className="form-control form-control-sm" />
                      </div>
                      <div className="col-md-12">
                        <Label text="Expense Type" isRequired={true}></Label>
                        <Dropdown onChange={handleTextChange} data={expanseTypeList} name="expenseTypeId" value={expenseModel.expenseTypeId} className="form-control form-control-sm" />
                        <ErrorLabel message={errors?.expenseTypeId}></ErrorLabel>
                      </div>
                      {expenseModel.expenseTypeId > 0 && <div className="col-md-12">
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
                        <div className="col-md-12">
                          <Label text="Employee Categoty" isRequired={true}></Label>
                          <Dropdown onChange={handleTextChange} data={jobTitleList} name="jobTitleId" value={expenseModel.jobTitleId} className="form-control form-control-sm" />
                          <ErrorLabel message={errors?.jobTitleId}></ErrorLabel>
                        </div>
                        <div className="col-md-12">
                          <Label text="Employee Name" isRequired={true}></Label>
                          <Dropdown onChange={handleTextChange} data={employeeList} name="employeeId" value={expenseModel.employeeId} className="form-control form-control-sm" />
                          <ErrorLabel message={errors?.employeeId}></ErrorLabel>
                        </div>
                      </>
                      }
                      <div className="col-md-12">
                        <Label text="Name" isRequired={true}></Label>
                        <input required maxLength={100} onChange={e => handleTextChange(e)} name="name" value={expenseModel.name} type="text" className="form-control form-control-sm" />
                        <ErrorLabel message={errors?.name}></ErrorLabel>
                      </div>
                      <div className="col-md-12">
                        <Label text="Description"></Label>
                        <input required maxLength={200} onChange={e => handleTextChange(e)} name="description" value={expenseModel.description} type="text" className="form-control form-control-sm" />
                      </div>
                      <div className="col-md-12">
                        <Label text="Amount" isRequired={true}></Label>
                        <input min={0} max={1000000} required onChange={e => handleTextChange(e)} name="amount" value={expenseModel.amount} type="number" className="form-control form-control-sm" />
                        <ErrorLabel message={errors?.amount}></ErrorLabel>
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
