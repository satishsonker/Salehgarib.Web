import React, { useState, useEffect } from 'react'
import { toast } from 'react-toastify';
import { Api } from '../../apis/Api';
import { apiUrls } from '../../apis/ApiUrls';
import { toastMessage } from '../../constants/ConstantValues';
import { common } from '../../utils/common';
import Breadcrumb from '../common/Breadcrumb'
import TableView from '../tables/TableView'

export default function CuttingOrders() {
  const customerCuttingOrderModelTemplate = {
    "id": 0,
    "firstname": "",
    "lastname": "",
    "contact1": "",
    "contact2": "",
    "orderNo": 0,
    "accountId": "",
    "branch": "",
    "poBox": ""
  };
  const [customerCuttingOrderModel, setCustomerOrderModel] = useState(customerCuttingOrderModelTemplate);
  const [isRecordSaving, setIsRecordSaving] = useState(true);
  const [pageNo, setPageNo] = useState(1);
  const [pageSize, setPageSize] = useState(20);
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
  const handleSave = () => {
    let data = common.assignDefaultValue(customerCuttingOrderModelTemplate, customerCuttingOrderModel);
    if (isRecordSaving) {
      Api.Put(apiUrls.customerController.add, data).then(res => {
        if (res.data.id > 0) {
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
        setCustomerOrderModel(res.data);
        setIsRecordSaving(false);
      }
    }).catch(err => {
      toast.error(toastMessage.getError);
    })
  }
  const tableOptionTemplet = {
    headers: [
      { name: "Lastname", prop: "lastname" },
      { name: "Contact1", prop: "contact1" },
      { name: "Contact2", prop: "contact2" },
      { name: "OrderNo", prop: "orderNo" },
      { name: "Customer", prop: "customer" }
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
      popupModelId: "customer-order-cutting",
      delete: {
        handler: handleDelete
      },
      edit: {
        handler: handleEdit
      }
    }
  }
  const [tableOption, setTableOption] = useState(tableOptionTemplet);
  const saveButtonHandler = () => {
    setCustomerOrderModel({ ...customerCuttingOrderModelTemplate });
    setIsRecordSaving(true);
  }
  const breadcrumbOption = {
    title: 'Cutting Orders',
    items: [
      {
        link: "/customers",
        title: "Customers",
        icon: "bi bi-person-bounding-box"
      },
      {
        isActive: false,
        title: "Cutting Orders",
        icon: "bi bi-scissors"
      }

    ],
    buttons: [
      {
        text: "Cutting Orders",
        icon: 'bx bx-plus',
        modelId: 'customer-order-cutting',
        handler: saveButtonHandler
      }
    ]
  }
  return (
    <>
      <Breadcrumb option={breadcrumbOption}></Breadcrumb>
      <h6 className="mb-0 text-uppercase">Cutting Orders Details</h6>
      <hr />
      <TableView option={tableOption}></TableView>
      <div id="customer-order-cutting" className="modal fade in" tabIndex="-1" role="dialog" aria-labelledby="myModalLabel"
        aria-hidden="true">
        <div className="modal-dialog">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title">Cutting Order Details</h5>
              <button type="button" className="btn-close" data-bs-dismiss="modal" aria-hidden="true"></button>
              <h4 className="modal-title" id="myModalLabel"></h4>
            </div>
            <div className="modal-body">
            <form className="row g-3">
                  <div className="col-12 col-md-6">
                    <label className="form-label">Selected Date</label>
                    <input type="date" className="form-control"/>
                  </div>
                  <div className="col-12 col-md-6">
                    <label className="form-label">Selected Between Date</label>
                    <input type="date" className="form-control"/>
                  </div>
                  <div className="col-12 col-md-12">
                    <label className="form-label">Select Job Status</label>
                    <select className="form-select" id="validationCustom04" required="">
                      <option selected="" disabled="" value="">Choose...</option>
                      <option>...</option>
                    </select>
                  </div>
                </form>
            </div>
            <div className="modal-footer">
              <button type="button" onClick={e => handleSave()} className="btn btn-info text-white waves-effect" data-bs-dismiss="modal"> {isRecordSaving ? "Save" : "Update"}</button>
              <button type="button" className="btn btn-danger waves-effect" data-bs-dismiss="modal">Cancel</button>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
