import React, { useState, useEffect } from 'react'
import { toast } from 'react-toastify';
import { Api } from '../../apis/Api';
import { apiUrls } from '../../apis/ApiUrls';
import { toastMessage } from '../../constants/ConstantValues';
import { common } from '../../utils/common';
import Breadcrumb from '../common/Breadcrumb'
import TableView from '../tables/TableView';
import { validationMessage } from '../../constants/validationMessage';
import { headerFormat } from '../../utils/tableHeaderFormat';
import ButtonBox from '../common/ButtonBox';
import Inputbox from '../common/Inputbox';

export default function CustomerDetails() {
  const customerModelTemplate = {
    id: 0,
    firstname: "",
    lastname: "",
    contact1: "+970",
    contact2: "",
    orderNo: 0,
    branch: "",
    poBox: "",
    trn: ""
  };
  const [customerModel, setCustomerModel] = useState(customerModelTemplate);
  const [isRecordSaving, setIsRecordSaving] = useState(true);
  const [pageNo, setPageNo] = useState(1);
  const [pageSize, setPageSize] = useState(20);
  const [errors, setErrors] = useState({});
  const VAT = parseFloat(process.env.REACT_APP_VAT);
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
    Api.Get(apiUrls.customerController.search + `?PageNo=${pageNo}&PageSize=${pageSize}&SearchTerm=${searchTerm.replace('+', "")}`).then(res => {
      tableOptionTemplet.data = res.data.data;
      tableOptionTemplet.totalRecords = res.data.totalRecords;
      setTableOption({ ...tableOptionTemplet });
    }).catch(err => {

    });
  }

  const handleTextChange = (e) => {
    var { value, name, type } = e.target;
    if (type === 'number') {
      value = parseInt(value);
    }
    if (value !== undefined && (name === 'firstname' || name === 'lastname' || name === 'trn')) {
      value = value.toUpperCase();
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
  const viewCustomerOrders = (id, data) => {
    if (data?.contact1 !== undefined && data?.contact1 !== "") {
      Api.Get(apiUrls.orderController.getByOrderNoByContact + data?.contact1.replace('+', ""))
        .then(res => {
          var orderData = res.data;
          res.data.forEach(item => {
            item.vatAmount = common.calculatePercent(item.subTotalAmount, VAT);
            item.paymentReceived = (((item.totalAmount - item.balanceAmount) / item.totalAmount) * 100).toFixed(2);
          });
          tableOrderOptionTemplet.data = orderData;
          tableOrderOptionTemplet.totalRecords = orderData.length;
          setTableOrderOption({ ...tableOrderOptionTemplet });
          tableOptionOrderDetailsTemplet.data = [];
          tableOptionOrderDetailsTemplet.totalRecords = 0;
          setTableOrderDetailOption({ ...tableOptionOrderDetailsTemplet });
          document.getElementById('openViewCustomerOrdersModalOpener').click();
        });
    }
  }
  const tableOptionTemplet = {
    headers: headerFormat.customerDetail,
    data: [],
    totalRecords: 0,
    pageSize: pageSize,
    pageNo: pageNo,
    setPageNo: setPageNo,
    setPageSize: setPageSize,
    searchHandler: handleSearch,
    actions: {
      view: {
        handler: viewCustomerOrders,
        title: "View Customer Orders"
      },
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
    const { firstname, contact1, contact2 } = customerModel;
    const newError = {};
    if (!firstname || firstname === "") newError.firstname = validationMessage.firstNameRequired;
    if (contact1?.length === 0 || contact1?.length < 8) newError.contact1 = validationMessage.invalidContact;
    return newError;
  }
  const handleViewOrderDetails = (id, data) => {
    tableOptionOrderDetailsTemplet.data = data?.orderDetails;
    tableOptionOrderDetailsTemplet.totalRecords = data?.orderDetails?.length;
    setTableOrderDetailOption({ ...tableOptionOrderDetailsTemplet });
  }
  const tableOrderOptionTemplet = {
    headers: headerFormat.orderShort,
    showPagination: false,
    showTableTop: false,
    showFooter: true,
    data: [],
    totalRecords: 0,
    pageSize: pageSize,
    pageNo: pageNo,
    setPageNo: setPageNo,
    setPageSize: setPageSize,
    changeRowClassHandler: (data) => {
      if (data.orderDetails.filter(x => x.isCancelled).length === data.orderDetails.length)
        return "cancelOrder"
      else if (data.orderDetails.filter(x => x.isCancelled).length > 0)
        return "partcancelOrder"
      else if (data.status === 'delivered')
        return "deliveredOrder"
      else
        return "";
    },
    actions: {
      showView: true,
      showPrint: false,
      showDelete: false,
      showEdit: false,
      view: {
        handler: handleViewOrderDetails,
        title: "View Order Details"
      }
    }
  }
  const tableOptionOrderDetailsTemplet = {
    headers: headerFormat.orderDetailShort,
    showTableTop: false,
    showFooter: false,
    data: [],
    totalRecords: 0,
    pageSize: pageSize,
    pageNo: pageNo,
    setPageNo: setPageNo,
    setPageSize: setPageSize,
    searchHandler: handleSearch,
    changeRowClassHandler: (data) => {
      return data?.isCancelled ? "bg-danger text-white" : "";
    },
    showaction: false,
    showPagination: false,
    showTableTop: false
  }

  const [tableOrderOption, setTableOrderOption] = useState(tableOrderOptionTemplet);
  const [tableOrderDetailOption, setTableOrderDetailOption] = useState(tableOptionOrderDetailsTemplet);

  return (
    <>
      <Breadcrumb option={breadcrumbOption}></Breadcrumb>
      <h6 className="mb-0 text-uppercase">Customer Details</h6>
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
                        <Inputbox labelText="First name" isRequired={true} errorMessage={errors?.firstname} name="firstname" value={customerModel.firstname} type="text" className="form-control" onChangeHandler={handleTextChange} />

                      </div>
                      <div className="col-12 col-md-6">
                        <Inputbox labelText="Last name" isRequired={true} errorMessage={errors?.lastname} name="lastname" value={customerModel.lastname} type="text" className="form-control" onChangeHandler={handleTextChange} />

                      </div>
                      <div className="col-12">
                        <Inputbox labelText="Contact No" isRequired={true} errorMessage={errors?.contact1} name="contact1" value={customerModel.contact1} type="text" className="form-control" onChangeHandler={handleTextChange} />
                      </div>
                      <div className="col-12">
                        <Inputbox labelText="Contact No 2" errorMessage={errors?.contact2} name="contact2" value={customerModel.contact2} type="text" className="form-control" onChangeHandler={handleTextChange} />
                      </div>
                      <div className="col-12 col-md-6">
                        <Inputbox labelText="TRN" name="trn" value={customerModel.trn} type="text" className="form-control" onChangeHandler={handleTextChange} />
                      </div>
                      <div className="col-12 col-md-6">
                        <Inputbox labelText="Branch" name="branch" value={customerModel.branch} type="text" className="form-control" onChangeHandler={handleTextChange} />
                      </div>

                      <div className="col-12 col-md-6">
                        <Inputbox labelText="Po Box" name="poBox" value={customerModel.poBox} type="text" className="form-control" onChangeHandler={handleTextChange} /></div>
                    </form>

                  </div>
                </div>
              </form>
            </div>
            <div className="modal-footer">
              <ButtonBox text={isRecordSaving ? "Save" : "Update"} type="save" onClickHandler={handleSave} className="btn-sm"/>
              <ButtonBox type="cancel" className="btn-sm" modelDismiss={true}/>
            </div>
          </div>
        </div>
      </div>
      <button data-bs-toggle="modal" data-bs-target="#viewCustomerOrdersModal" id="openViewCustomerOrdersModalOpener" className='d-none' />
      <div className="modal fade" id="viewCustomerOrdersModal" tabIndex="-1" aria-labelledby="viewCustomerOrdersModalLabel" aria-hidden="true">
        <div className="modal-dialog modal-xl">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title" id="viewCustomerOrdersModalLabel">Customer Orders</h5>
              <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            <div className="modal-body">
              <TableView option={tableOrderOption} />
              {tableOrderDetailOption.totalRecords > 0 &&
                <TableView option={tableOrderDetailOption} />
              }
            </div>
            <div className="modal-footer">
              <ButtonBox type="cancel" />
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
