import React, { useState, useEffect } from 'react'
import { toast } from 'react-toastify';
import { Api } from '../../apis/Api';
import { apiUrls } from '../../apis/ApiUrls';
import Breadcrumb from '../common/Breadcrumb'
import TableView from '../tables/TableView'

export default function CustomerDetails() {
  const [customerModel, setCustomerModel] = useState({id:0});
  const [pageNo, setPageNo] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const handleDelete = (id) => {
    Api.Delete(apiUrls.customerController.delete + id).then(res => {
      if (res.data === 1) {
        handleSearch('');
        toast.success('Deleted successfully');
      }
    }).catch(err => {
      toast.error('Error while Deleting the record. Please try after sometime!');
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
    var value=e.target.value;
    if(e.target.name==='orderNo')
    {
      value=parseInt(e.target.value);
    }
    setCustomerModel({ ...customerModel, [e.target.name]: value });
  }
  const handleSave=()=>{
    Api.Put(apiUrls.customerController.add,customerModel).then(res=>{
      if(res.data.id>0)
      {
        toast.success('Added successfully');
        handleSearch('');
      }
    }).catch(err=>{
      toast.error('Error while adding record. Please try after sometime!');
    })
  }
  const tableOptionTemplet = {
    headers: [
      { name: "FirstName", prop: "firstname" },
      { name: "Lastname", prop: "lastname" },
      { name: "Contact1", prop: "contact1" },
      { name: "Contact2", prop: "contact2" },
      { name: "OrderNo", prop: "orderNo" },
      { name: "Account Id", prop: "accountId" },
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
      delete: {
        handler: handleDelete
      }
    }
  }
  const [tableOption, setTableOption] = useState(tableOptionTemplet);
  const breadcrumbOption = {
    title: 'Customers',
    buttons: [
      {
        text: "Add Customer Deatils",
        icon: 'bx bx-plus',
        modelId: 'add-customer'
      }
    ]
  }

  useEffect(() => {
    Api.Get(apiUrls.customerController.getAll + `?PageNo=${pageNo}&PageSize=${pageSize}`).then(res => {
      tableOptionTemplet.data = res.data.data;
      tableOptionTemplet.totalRecords = res.data.totalRecords;
      setTableOption({ ...tableOptionTemplet });
    })
      .catch(err => {

      });
  }, [pageNo, pageSize]);

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
              <button type="button" className="btn-close" data-bs-dismiss="modal" aria-hidden="true"></button>
              <h4 className="modal-title" id="myModalLabel"></h4>
            </div>
            <div className="modal-body">
              <from className="form-horizontal form-material">
                <div className="card">
                  <div className="card-body">
                    <form className="row g-3">
                      <div className="col-12">
                        <label className="form-label">Account No.-</label>
                        <input type="text" className="form-control" name='accountId' onChange={e=>handleTextChange(e)}/>
                      </div>
                      <div className="col-12 col-md-6">
                        <label className="form-label">First Name</label>
                        <input type="text" className="form-control" name='firstname' onChange={e=>handleTextChange(e)}/>
                      </div>
                      <div className="col-12 col-md-6">
                        <label className="form-label">Last Name </label>
                        <input type="text" className="form-control" name='lastname' onChange={e=>handleTextChange(e)}/>
                      </div>
                      <div className="col-12">
                        <label className="form-label">Contact 1</label>
                        <input type="text" className="form-control" name='contact1' onChange={e=>handleTextChange(e)}/>
                      </div>
                      <div className="col-12">
                        <label className="form-label">Contact 2</label>
                        <input type="text" className="form-control" name='contact2' onChange={e=>handleTextChange(e)}/>
                      </div>

                      <div className="col-12 col-md-6">
                        <label className="form-label">Order No.</label>
                        <input type="text" className="form-control" name='orderNo' onChange={e=>handleTextChange(e)}/>
                      </div>
                      <div className="col-12 col-md-6">
                        <label className="form-label">Branch</label>
                        <input type="text" className="form-control" name='branch' onChange={e=>handleTextChange(e)}/>
                      </div>

                      <div className="col-12 col-md-6">
                        <label className="form-label">PO Box</label>
                        <input type="text" className="form-control" name='poBox' onChange={e=>handleTextChange(e)}/>
                      </div>
                    </form>

                  </div>
                </div>
              </from>
            </div>
            <div className="modal-footer">
              <button type="button" onClick={e=>handleSave()} className="btn btn-info text-white waves-effect" data-bs-dismiss="modal">Save</button>
              <button type="button" className="btn btn-danger waves-effect" data-bs-dismiss="modal">Cancel</button>
            </div>
          </div>
        </div></div>
    </>
  )
}
