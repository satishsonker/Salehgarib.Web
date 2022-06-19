import React, { useState, useEffect } from 'react'
import { Api } from '../../apis/Api';
import { apiUrls } from '../../apis/ApiUrls';
import Breadcrumb from '../common/Breadcrumb'
import TableView from '../tables/TableView'

export default function CustomerDetails() {
  const [pageNo, setPageNo] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const tableOptionTemplet = {
    headers: [
      { name: "FirstName", prop: "firstname" },
      { name: "Lastname", prop: "lastname" },
      { name: "Contact1", prop: "contact1" },
      { name: "Contact2", prop: "contact2" },
      { name: "OrderNo", prop: "orderNo" },
      { name: "Account Id", prop: "accountId"},
      { name: "Branch", prop: "branch" },
      { name: "PO Box", prop: "poBox" }
    ],
    data: [],
    totalRecords:0,
    pageSize:pageSize,
    pageNo:pageNo,
    setPageNo:setPageNo,
    setPageSize:setPageSize
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
      tableOptionTemplet.totalRecords=res.data.totalRecords;
      setTableOption({...tableOptionTemplet});
    })
      .catch(err => {

      });
  }, [pageNo,pageSize]);

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
                      <div className="col-12 col-md-6">
                        <label className="form-label">Account No.-</label>
                        <input type="text" className="form-control" />
                      </div>
                      <div className="col-12 col-md-6">
                        <label className="form-label">Order Number</label>
                        <input type="text" className="form-control" />
                      </div>
                      <div className="col-12 col-md-6">
                        <label className="form-label">Nationality </label>
                        <input type="text" className="form-control" />
                      </div>
                      <div className="col-12 col-md-6">
                        <label className="form-label">Customer Name</label>
                        <input type="text" className="form-control" />
                      </div>



                      <div className="col-12 col-md-6">
                        <label className="form-label">Date</label>
                        <input type="date" className="form-control" />
                      </div>

                      <div className="col-12 col-md-6">
                        <label className="form-label">Contacts</label>
                        <input type="text" className="form-control" />
                      </div>
                      <div className="col-12 col-md-6">
                        <label className="form-label">Old Ref</label>
                        <input type="text" className="form-control" />
                      </div>

                      <div className="col-12 col-md-6">
                        <label className="form-label">Labour Card</label>
                        <input type="text" className="form-control" />
                      </div>
                    </form>

                  </div>
                </div>
              </from>
            </div>
            <div className="modal-footer">
              <button type="button" className="btn btn-info text-white waves-effect" data-bs-dismiss="modal">Save</button>
              <button type="button" className="btn btn-danger waves-effect" data-bs-dismiss="modal">Cancel</button>
            </div>
          </div>
        </div></div>
    </>
  )
}
