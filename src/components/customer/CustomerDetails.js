import React, { useState, useEffect } from 'react'
import { toast } from 'react-toastify';
import { Api } from '../../apis/Api';
import { apiUrls } from '../../apis/ApiUrls';
import { toastMessage } from '../../constants/ConstantValues';
import { common } from '../../utils/common';
import RegexFormat from '../../utils/RegexFormat';
import Breadcrumb from '../common/Breadcrumb'
import ErrorLabel from '../common/ErrorLabel';
import Label from '../common/Label';
import TableView from '../tables/TableView';
import { validationMessage } from '../../constants/validationMessage';

export default function CustomerDetails() {
  const customerModelTemplate = {
    id: 0,
    firstname: "",
    lastname: "",
    contact1: "+970",
    contact2: "",
    orderNo: 0,
    branch: "",
    poBox: ""
  };
  const [customerModel, setCustomerModel] = useState(customerModelTemplate);
  const [isRecordSaving, setIsRecordSaving] = useState(true);
  const [pageNo, setPageNo] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [errors, setErrors] = useState({})
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
    var {value,name,type} = e.target;
    if (type === 'number') {
      value = parseInt(value);
    }
    if(value!==undefined && (name==='firstname' || name==='lastname'))
    {
      value=value.toUpperCase();
    }
    setCustomerModel({ ...customerModel, [name]: value });
    if (!!errors[name]) {
      setErrors({ ...errors, [name]: null })
    }
  }
  const handleSave = () => {
    const formError = validateError();
    if (Object.keys(formError).length > 0) {
      setErrors(formError);
      return
    }
    let data = common.assignDefaultValue(customerModelTemplate, customerModel);
    if (isRecordSaving) {
      Api.Put(apiUrls.customerController.add, data).then(res => {
        if (res.data.id > 0) {
          common.closePopup('closePopupCustomerDetails');
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
          common.closePopup('closePopupCustomerDetails');
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
        setCustomerModel(res.data);
        setIsRecordSaving(false);
      }
    }).catch(err => {
      toast.error(toastMessage.getError);
    })
  }
  const tableOptionTemplet = {
    headers: [
      { name: "FirstName", prop: "firstname" },
      { name: "Lastname", prop: "lastname" },
      { name: "Contact1", prop: "contact1" },
      { name: "Contact2", prop: "contact2" },
      { name: "Branch", prop: "branch" },
      { name: "PO Box", prop: "poBox" }
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
      popupModelId: "add-customer",
      delete: {
        handler: handleDelete
      },
      edit: {
        handler: handleEdit
      }
    }
  }
  const saveButtonHandler = () => {
    setCustomerModel({ ...customerModelTemplate });
    setIsRecordSaving(true);
  }
  const [tableOption, setTableOption] = useState(tableOptionTemplet);
  
  const breadcrumbOption = {
    title: 'Customers',
    items: [
      ,
      {
        isActive: false,
        title: "Customer Details",
        icon: "bi bi-person-bounding-box"
      }
    ],
    buttons: [
      {
        text: "Customer Deatils",
        icon: 'bx bx-plus',
        modelId: 'add-customer',
        handler: saveButtonHandler
      }
    ]
  }

  useEffect(() => {
    setIsRecordSaving(true);
    Api.Get(apiUrls.customerController.getAll + `?PageNo=${pageNo}&PageSize=${pageSize}`).then(res => {
      tableOptionTemplet.data = res.data.data;
      tableOptionTemplet.totalRecords = res.data.totalRecords;
      setTableOption({ ...tableOptionTemplet });
    })
      .catch(err => {

      });
  }, [pageNo, pageSize]);

  useEffect(() => {
    if (isRecordSaving) {
      setCustomerModel({ ...customerModelTemplate });
    }
  }, [isRecordSaving])

  const validateError = () => {
    const { firstname, lastname, contact1, contact2 } = customerModel;
    const newError = {};
    if (!firstname || firstname === "") newError.firstname = validationMessage.firstNameRequired;
    if (!lastname || lastname === "") newError.lastname = validationMessage.lastNameRequired;
    if (contact1?.length === 0 || !RegexFormat.mobile.test(contact1)) newError.contact1 = validationMessage.invalidContact;
    if (contact2?.length > 0 && !RegexFormat.mobile.test(contact2)) newError.contact2 = validationMessage.invalidContact;
    return newError;
  }

  return (
    <>
      <Breadcrumb option={breadcrumbOption}></Breadcrumb>
      <h6 className="mb-0 text-uppercase">Customer Deatils</h6>
      <hr />
      <TableView option={tableOption}></TableView>

      <div id="add-customer" className="modal fade in" tabIndex="-1" role="dialog" aria-labelledby="myModalLabel"
        aria-hidden="true">
        <div className="modal-dialog">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title">Customer Details</h5>
              <button type="button" className="btn-close" id='closePopupCustomerDetails' data-bs-dismiss="modal" aria-hidden="true"></button>
              <h4 className="modal-title" id="myModalLabel"></h4>
            </div>
            <div className="modal-body">
              <form className="form-horizontal form-material">
                <div className="card">
                  <div className="card-body">
                    <form className="row g-3">
                      <div className="col-12 col-md-6">
                        <Label text="First Name" isRequired={true}></Label>
                        <input type="text" className="form-control" value={customerModel.firstname} name='firstname' onChange={e => handleTextChange(e)} />
                        <ErrorLabel message={errors?.firstname}></ErrorLabel>
                      </div>
                      <div className="col-12 col-md-6">
                        <Label text="Last Name" isRequired={true}></Label>
                        <input type="text" className="form-control" value={customerModel.lastname} name='lastname' onChange={e => handleTextChange(e)} />
                        <ErrorLabel message={errors?.lastname}></ErrorLabel>
                      </div>
                      <div className="col-12">
                        <label className="form-label">Contact 1</label>
                        <input type="text" className="form-control" value={customerModel.contact1} name='contact1' onChange={e => handleTextChange(e)} />
                        <ErrorLabel message={errors?.contact1}></ErrorLabel>
                      </div>
                      <div className="col-12">
                        <label className="form-label">Contact 2</label>
                        <input type="text" className="form-control" value={customerModel.contact2} name='contact2' onChange={e => handleTextChange(e)} />
                        <ErrorLabel message={errors?.contact2}></ErrorLabel>
                      </div>
                      <div className="col-12 col-md-6">
                        <label className="form-label">Branch</label>
                        <input type="text" className="form-control" value={customerModel.branch} name='branch' onChange={e => handleTextChange(e)} />
                      </div>

                      <div className="col-12 col-md-6">
                        <label className="form-label">PO Box</label>
                        <input type="text" className="form-control" value={customerModel.poBox} name='poBox' onChange={e => handleTextChange(e)} />
                      </div>
                    </form>

                  </div>
                </div>
              </form>
            </div>
            <div className="modal-footer">
              <button type="button" onClick={e => handleSave()} className="btn btn-info text-white waves-effect"> {isRecordSaving ? "Save" : "Update"}</button>
              <button type="button" className="btn btn-danger waves-effect" data-bs-dismiss="modal">Cancel</button>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
