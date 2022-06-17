import React from 'react'
import Breadcrumb from '../common/Breadcrumb'

export default function CustomerDetails() {
  return (
    <>
    <Breadcrumb></Breadcrumb>
    	<h6 class="mb-0 text-uppercase">DataTable Example</h6>
				<hr/>
				<div class="card">
					<div class="card-body">
						<div class="table-responsive">
							<table id="example" class="table table-striped table-bordered" style={{width:'100%'}}>
								<thead>
									<tr>
										<th>Name</th>
										<th>Position</th>
										<th>Office</th>
										<th>Age</th>
										<th>Start date</th>
										<th>action</th>
									</tr>
								</thead>
								<tbody>
									<tr>
										<td>Tiger Nixon</td>
										<td>System Architect</td>
										<td>Edinburgh</td>
										<td>61</td>
										<td>2011/04/25</td>
									 <td>
                             <div class="table-actions d-flex align-items-center gap-3 fs-6">
                               <a href="#" class="text-primary" data-bs-toggle="tooltip" data-bs-placement="bottom" title="" data-bs-original-title="Views" aria-label="Views"><i class="bi bi-eye-fill"></i></a>
                               <a href="#" class="text-warning" data-bs-toggle="tooltip" data-bs-placement="bottom" title="" data-bs-original-title="Edit" aria-label="Edit"><i class="bi bi-pencil-fill"></i></a>
                               <a href="#" class="text-danger" data-bs-toggle="tooltip" data-bs-placement="bottom" title="" data-bs-original-title="Delete" aria-label="Delete"><i class="bi bi-trash-fill"></i></a>
                             </div>
                           </td>
									</tr>
									<tr>
										<td>Garrett Winters</td>
										<td>Accountant</td>
										<td>Tokyo</td>
										<td>63</td>
										<td>2011/07/25</td>
									 <td>
                             <div class="table-actions d-flex align-items-center gap-3 fs-6">
                               <a href="#" class="text-primary" data-bs-toggle="tooltip" data-bs-placement="bottom" title="" data-bs-original-title="Views" aria-label="Views"><i class="bi bi-eye-fill"></i></a>
                               <a href="#" class="text-warning" data-bs-toggle="tooltip" data-bs-placement="bottom" title="" data-bs-original-title="Edit" aria-label="Edit"><i class="bi bi-pencil-fill"></i></a>
                               <a href="#" class="text-danger" data-bs-toggle="tooltip" data-bs-placement="bottom" title="" data-bs-original-title="Delete" aria-label="Delete"><i class="bi bi-trash-fill"></i></a>
                             </div>
                           </td>
									</tr>
									<tr>
										<td>Ashton Cox</td>
										<td>Junior Technical Author</td>
										<td>San Francisco</td>
										<td>66</td>
										<td>2009/01/12</td>
									 <td>
                             <div class="table-actions d-flex align-items-center gap-3 fs-6">
                               <a href="#" class="text-primary" data-bs-toggle="tooltip" data-bs-placement="bottom" title="" data-bs-original-title="Views" aria-label="Views"><i class="bi bi-eye-fill"></i></a>
                               <a href="#" class="text-warning" data-bs-toggle="tooltip" data-bs-placement="bottom" title="" data-bs-original-title="Edit" aria-label="Edit"><i class="bi bi-pencil-fill"></i></a>
                               <a href="#" class="text-danger" data-bs-toggle="tooltip" data-bs-placement="bottom" title="" data-bs-original-title="Delete" aria-label="Delete"><i class="bi bi-trash-fill"></i></a>
                             </div>
                           </td>
									</tr>
									<tr>
										<td>Cedric Kelly</td>
										<td>Senior Javascript Developer</td>
										<td>Edinburgh</td>
										<td>22</td>
										<td>2012/03/29</td>
										 <td>
                             <div class="table-actions d-flex align-items-center gap-3 fs-6">
                               <a href="#" class="text-primary" data-bs-toggle="tooltip" data-bs-placement="bottom" title="" data-bs-original-title="Views" aria-label="Views"><i class="bi bi-eye-fill"></i></a>
                               <a href="#" class="text-warning" data-bs-toggle="tooltip" data-bs-placement="bottom" title="" data-bs-original-title="Edit" aria-label="Edit"><i class="bi bi-pencil-fill"></i></a>
                               <a href="#" class="text-danger" data-bs-toggle="tooltip" data-bs-placement="bottom" title="" data-bs-original-title="Delete" aria-label="Delete"><i class="bi bi-trash-fill"></i></a>
                             </div>
                           </td>
									</tr>
									<tr>
										<td>Airi Satou</td>
										<td>Accountant</td>
										<td>Tokyo</td>
										<td>33</td>
										<td>2008/11/28</td>
										 <td>
                             <div class="table-actions d-flex align-items-center gap-3 fs-6">
                               <a href="#" class="text-primary" data-bs-toggle="tooltip" data-bs-placement="bottom" title="" data-bs-original-title="Views" aria-label="Views"><i class="bi bi-eye-fill"></i></a>
                               <a href="#" class="text-warning" data-bs-toggle="tooltip" data-bs-placement="bottom" title="" data-bs-original-title="Edit" aria-label="Edit"><i class="bi bi-pencil-fill"></i></a>
                               <a href="#" class="text-danger" data-bs-toggle="tooltip" data-bs-placement="bottom" title="" data-bs-original-title="Delete" aria-label="Delete"><i class="bi bi-trash-fill"></i></a>
                             </div>
                           </td>
									</tr>
									<tr>
										<td>Brielle Williamson</td>
										<td>Integration Specialist</td>
										<td>New York</td>
										<td>61</td>
										<td>2012/12/02</td>
										 <td>
                             <div class="table-actions d-flex align-items-center gap-3 fs-6">
                               <a href="#" class="text-primary" data-bs-toggle="tooltip" data-bs-placement="bottom" title="" data-bs-original-title="Views" aria-label="Views"><i class="bi bi-eye-fill"></i></a>
                               <a href="#" class="text-warning" data-bs-toggle="tooltip" data-bs-placement="bottom" title="" data-bs-original-title="Edit" aria-label="Edit"><i class="bi bi-pencil-fill"></i></a>
                               <a href="#" class="text-danger" data-bs-toggle="tooltip" data-bs-placement="bottom" title="" data-bs-original-title="Delete" aria-label="Delete"><i class="bi bi-trash-fill"></i></a>
                             </div>
                           </td>
									</tr>
									<tr>
										<td>Herrod Chandler</td>
										<td>Sales Assistant</td>
										<td>San Francisco</td>
										<td>59</td>
										<td>2012/08/06</td>
										 <td>
                             <div class="table-actions d-flex align-items-center gap-3 fs-6">
                               <a href="#" class="text-primary" data-bs-toggle="tooltip" data-bs-placement="bottom" title="" data-bs-original-title="Views" aria-label="Views"><i class="bi bi-eye-fill"></i></a>
                               <a href="#" class="text-warning" data-bs-toggle="tooltip" data-bs-placement="bottom" title="" data-bs-original-title="Edit" aria-label="Edit"><i class="bi bi-pencil-fill"></i></a>
                               <a href="#" class="text-danger" data-bs-toggle="tooltip" data-bs-placement="bottom" title="" data-bs-original-title="Delete" aria-label="Delete"><i class="bi bi-trash-fill"></i></a>
                             </div>
                           </td>
									</tr>
									
								</tbody>
								<tfoot>
									<tr>
										<th>Name</th>
										<th>Position</th>
										<th>Office</th>
										<th>Age</th>
										<th>Start date</th>
										<th>Salary</th>
									</tr>
								</tfoot>
							</table>
						</div>
					</div>
				</div>
                <div id="add-contact" class="modal fade in" tabindex="-1" role="dialog" aria-labelledby="myModalLabel"
    aria-hidden="true">
    <div class="modal-dialog">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title">Customer Details</h5>
          <button type="button" class="btn-close" data-bs-dismiss="modal" aria-hidden="true"></button>
          <h4 class="modal-title" id="myModalLabel"></h4>
        </div>
        <div class="modal-body">
          <from class="form-horizontal form-material">
            <div class="card">
              <div class="card-body">


                <form class="row g-3">
                  <div class="col-12 col-md-6">
                    <label class="form-label">Account No.-</label>
                    <input type="text" class="form-control"/>
                  </div>
                  <div class="col-12 col-md-6">
                    <label class="form-label">Order Number</label>
                    <input type="text" class="form-control"/>
                  </div>
                  <div class="col-12 col-md-6">
                    <label class="form-label">Nationality </label>
                    <input type="text" class="form-control"/>
                  </div>
                  <div class="col-12 col-md-6">
                    <label class="form-label">Customer Name</label>
                    <input type="text" class="form-control"/>
                  </div>



                  <div class="col-12 col-md-6">
                    <label class="form-label">Date</label>
                    <input type="date" class="form-control"/>
                  </div>

                  <div class="col-12 col-md-6">
                    <label class="form-label">Contacts</label>
                    <input type="text" class="form-control"/>
                  </div>
                  <div class="col-12 col-md-6">
                    <label class="form-label">Old Ref</label>
                    <input type="text" class="form-control"/>
                  </div>

                  <div class="col-12 col-md-6">
                    <label class="form-label">Labour Card</label>
                    <input type="text" class="form-control"/>
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
    </div></div>
    </>
  )
}
