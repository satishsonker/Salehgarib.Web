import React from 'react'
import Breadcrumb from '../common/Breadcrumb'
import TableView from '../tables/TableView'

export default function EmployeeDetails() {
    const breadcrumbOption = {
        title: 'Employees',
        buttons: [
            {
                text: "Add Employee Deatils",
                icon: 'bx bx-plus',
                modelId: 'add-employee'
            }
        ]
    }

    const tableOption={
        headers:[ "Name","Position","Office","Age","Start date","action"]
    }
    return (
        <>
            <Breadcrumb option={breadcrumbOption}></Breadcrumb>
            <h6 className="mb-0 text-uppercase">Employee Deatils</h6>
            <hr />
            <TableView option={tableOption}></TableView>

            {/* <!-- Add Contact Popup Model --> */}
            <div id="add-employee" class="modal fade in" tabindex="-1" role="dialog" aria-labelledby="myModalLabel" aria-hidden="true">
                <div class="modal-dialog">
                    <div class="modal-content">
                        <div class="modal-header">
                            <h5 class="modal-title">New Employees</h5>
                            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-hidden="true"></button>
                            <h4 class="modal-title" id="myModalLabel"></h4>
                        </div>
                        <div class="modal-body">
                            <from class="form-horizontal form-material">
                                <div class="card">
                                    <div class="card-body">
                                        <form class="row g-3">
                                            <div class="col-6">
                                                <label class="form-label">First Name</label>
                                                <input type="text" class="form-control" />
                                            </div>
                                            <div class="col-6">
                                                <label class="form-label">Joining Date</label>
                                                <input type="date" class="form-control" />
                                            </div>
                                            <div class="col-6">
                                                <label class="form-label">Nationality </label>
                                                <input type="text" class="form-control" />
                                            </div>
                                            <div class="col-6">
                                                <label class="form-label">Passport No.</label>
                                                <input type="text" class="form-control" />
                                            </div>
                                            <div class="col-6">
                                                <label class="form-label">Contact</label>
                                                <input type="text" class="form-control" />
                                            </div>

                                            <div class="col-6">
                                                <label class="form-label">Expiry Date</label>
                                                <input type="date" class="form-control" />
                                            </div>
                                            <div class="col-6">
                                                <label class="form-label">Job Title</label>
                                                <input type="text" class="form-control" />
                                            </div>

                                            <div class="col-6">
                                                <label class="form-label">Labour Card</label>
                                                <input type="text" class="form-control" />
                                            </div>

                                            <div class="col-6">
                                                <label class="form-label">Salary</label>
                                                <input type="text" class="form-control" />
                                            </div>

                                            <div class="col-6">
                                                <label class="form-label">Expiry Date</label>
                                                <input type="date" class="form-control" />
                                            </div>

                                            <div class="col-6">
                                                <label class="form-label">Basic Salary</label>
                                                <input type="text" class="form-control" />
                                            </div>

                                            <div class="col-6">
                                                <label class="form-label">Visa Expiry Date</label>
                                                <input type="date" class="form-control" />
                                            </div>

                                            <div class="col-6">
                                                <label class="form-label">Accom </label>
                                                <input type="text" class="form-control" />
                                            </div>

                                            <div class="col-6">
                                                <label class="form-label">Medical Expiry </label>
                                                <input type="date" class="form-control" />
                                            </div>
                                            <div class="col-12">
                                                <label class="form-label">Address </label>
                                                <input type="text" class="form-control" />
                                            </div>
                                        </form>

                                    </div>
                                </div>
                            </from>
                        </div>
                        <div class="modal-footer">
                            <button type="button" class="btn btn-info text-white waves-effect" data-bs-dismiss="modal">Save</button>
                            <button type="button" class="btn btn-danger waves-effect" data-bs-dismiss="modal">Cancel</button>
                        </div>
                    </div>
                    {/* <!-- /.modal-content --> */}
                </div>
            </div>
            {/* <!-- /.modal-dialog --> */}
        </>
    )
}
