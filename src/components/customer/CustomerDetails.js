import React from 'react'
import Breadcrumb from '../common/Breadcrumb'
import TableView from '../tables/TableView'

export default function CustomerDetails() {
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
  const tableOption={
    headers:[ {name:"Name",prop:"name"},{name:"Position",prop:"position"},{name:"Office",prop:"office"},{name:"Age",prop:"age"},{name:"Start date",prop:"startDate"}],
    data:[
        {name:"Tiger Nixon",position:"System Architect",office:"Edinburgh",age:"42",startDate:"2011/04/25"},
        {name:"Tiger Nixon 1",position:"System Architect",office:"Edinburgh",age:"42",startDate:"2011/04/25"},
        {name:"Tiger Nixon 2",position:"System Architect",office:"Edinburgh",age:"42",startDate:"2011/04/25"},
        {name:"Tiger Nixon 3",position:"System Architect",office:"Edinburgh",age:"42",startDate:"2011/04/25"},
        {name:"Tiger Nixon",position:"System Architect",office:"Edinburgh",age:"42",startDate:"2011/04/25"},
        {name:"Tiger Nixon 1",position:"System Architect",office:"Edinburgh",age:"42",startDate:"2011/04/25"},
        {name:"Tiger Nixon 2",position:"System Architect",office:"Edinburgh",age:"42",startDate:"2011/04/25"},
        {name:"Tiger Nixon 3",position:"System Architect",office:"Edinburgh",age:"42",startDate:"2011/04/25"},
        {name:"Tiger Nixon",position:"System Architect",office:"Edinburgh",age:"42",startDate:"2011/04/25"},
        {name:"Tiger Nixon 1",position:"System Architect",office:"Edinburgh",age:"42",startDate:"2011/04/25"},
        {name:"Tiger Nixon 2",position:"System Architect",office:"Edinburgh",age:"42",startDate:"2011/04/25"},
        {name:"Tiger Nixon 3",position:"System Architect",office:"Edinburgh",age:"42",startDate:"2011/04/25"},
        {name:"Tiger Nixon 1",position:"System Architect",office:"Edinburgh",age:"42",startDate:"2011/04/25"},
        {name:"Tiger Nixon 2",position:"System Architect",office:"Edinburgh",age:"42",startDate:"2011/04/25"},
        {name:"Tiger Nixon 3",position:"System Architect",office:"Edinburgh",age:"42",startDate:"2011/04/25"},
        {name:"Tiger Nixon 1",position:"System Architect",office:"Edinburgh",age:"42",startDate:"2011/04/25"},
        {name:"Tiger Nixon 2",position:"System Architect",office:"Edinburgh",age:"42",startDate:"2011/04/25"},
        {name:"Tiger Nixon 3",position:"System Architect",office:"Edinburgh",age:"42",startDate:"2011/04/25"},
        {name:"Tiger Nixon 1",position:"System Architect",office:"Edinburgh",age:"42",startDate:"2011/04/25"},
        {name:"Tiger Nixon 2",position:"System Architect",office:"Edinburgh",age:"42",startDate:"2011/04/25"},
        {name:"Tiger Nixon 3",position:"System Architect",office:"Edinburgh",age:"42",startDate:"2011/04/25"},
        {name:"Tiger Nixon 1",position:"System Architect",office:"Edinburgh",age:"42",startDate:"2011/04/25"},
        {name:"Tiger Nixon 2",position:"System Architect",office:"Edinburgh",age:"42",startDate:"2011/04/25"},
        {name:"Tiger Nixon 3",position:"System Architect",office:"Edinburgh",age:"42",startDate:"2011/04/25"},
        {name:"Tiger Nixon 1",position:"System Architect",office:"Edinburgh",age:"42",startDate:"2011/04/25"},
        {name:"Tiger Nixon 2",position:"System Architect",office:"Edinburgh",age:"42",startDate:"2011/04/25"},
        {name:"Tiger Nixon 3",position:"System Architect",office:"Edinburgh",age:"42",startDate:"2011/04/25"}]
}
  return (
    <>
      <Breadcrumb option={breadcrumbOption}></Breadcrumb>
      <h6 className="mb-0 text-uppercase">Customer Deatils</h6>
      <hr />
      <TableView option={tableOption}></TableView>

      <div id="add-customer" className="modal fade in" tabindex="-1" role="dialog" aria-labelledby="myModalLabel"
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
