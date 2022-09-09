import React from 'react'
export default function Dashboard() {
    return (
        <>
            <div className="row row-cols-1 row-cols-md-2 row-cols-lg-2 row-cols-xl-4">
                <div className="col">
                    <div className="card radius-10">
                        <div className="card-body">
                            <div className="d-flex align-items-center">
                                <div>
                                    <p className="mb-3 text-secondary">
                                        <span>Total Customer</span>
                                        </p>
                                    <h4 className="my-1">65</h4>
                                </div>
                                <div className="widget-icon-large bg-gradient-purple text-white ms-auto">
                                    <i className="bi bi-basket2-fill"></i>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="col">
                    <div className="card radius-10">
                        <div className="card-body">
                            <div className="d-flex align-items-center">
                                <div>
                                    <p className="mb-3 text-secondary">Total Purchase Order</p>
                                    <h4 className="my-1">805</h4>
                                </div>
                                <div className="widget-icon-large bg-gradient-success text-white ms-auto">
                                    <i className="bi bi-currency-exchange"></i>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="col">
                    <div className="card radius-10">
                        <div className="card-body">
                            <div className="d-flex align-items-center">
                                <div>
                                    <p className="mb-3 text-secondary">Total Cutting Order</p>
                                    <h4 className="my-1">1105</h4>
                                </div>
                                <div className="widget-icon-large bg-gradient-danger text-white ms-auto">
                                    <i className="bi bi-people-fill"></i>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="col">
                    <div className="card radius-10">
                        <div className="card-body">
                            <div className="d-flex align-items-center">
                                <div>
                                    <p className="mb-3 text-secondary">Total Products</p>
                                    <h4 className="my-1">3851</h4>
                                </div>
                                <div className="widget-icon-large bg-gradient-info text-white ms-auto">
                                    <i className="bi bi-bar-chart-line-fill"></i>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="col">
                    <div className="card radius-10">
                        <div className="card-body">
                            <div className="d-flex align-items-center">
                                <div>
                                    <p className="mb-3 text-secondary">Total Stocks</p>
                                    <h4 className="my-1">4152</h4>
                                </div>
                                <div className="widget-icon-large bg-gradient-cr1 text-white ms-auto"><i className="bi bi-bar-chart-line-fill"></i>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="col">
                    <div className="card radius-10">
                        <div className="card-body">
                            <div className="d-flex align-items-center">
                                <div>
                                    <p className="mb-3 text-secondary">Total Suppliers</p>
                                    <h4 className="my-1">9852</h4>
                                </div>
                                <div className="widget-icon-large bg-gradient-cr2 text-white ms-auto"><i className="bi bi-bar-chart-line-fill"></i>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="col">
                    <div className="card radius-10">
                        <div className="card-body">
                            <div className="d-flex align-items-center">
                                <div>
                                    <p className="mb-3 text-secondary">Total Designs</p>
                                    <h4 className="my-1">8789</h4>
                                </div>
                                <div className="widget-icon-large bg-gradient-cr3 text-white ms-auto"><i className="bi bi-bar-chart-line-fill"></i>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="col">
                    <div className="card radius-10">
                        <div className="card-body">
                            <div className="d-flex align-items-center">
                                <div>
                                    <p className="mb-3 text-secondary">Total Employees</p>
                                    <h4 className="my-1">7845</h4>
                                </div>
                                <div className="widget-icon-large bg-gradient-cr4 text-white ms-auto"><i className="bi bi-bar-chart-line-fill"></i>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="col">
                    <div className="card radius-10">
                        <div className="card-body">
                            <div className="d-flex align-items-center">
                                <div>
                                    <p className="mb-3 text-secondary">Weekly Sales</p>
                                    <h4 className="my-1">7845</h4>
                                </div>
                                <div className="widget-icon-large bg-gradient-cr4 text-white ms-auto"><i className="bi bi-bar-chart-line-fill"></i>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="col">
                    <div className="card radius-10">
                        <div className="card-body">
                            <div className="d-flex align-items-center">
                                <div>
                                    <p className="mb-3 text-secondary">Monthly Sales</p>
                                    <h4 className="my-1">7845</h4>
                                </div>
                                <div className="widget-icon-large bg-gradient-cr4 text-white ms-auto"><i className="bi bi-bar-chart-line-fill"></i>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div className="row">
                <div className="col-12 col-lg-8 col-xl-8 d-flex">
                    <div className="card radius-10 w-100">
                        <div className="card-body">
                            <div className="row row-cols-1 row-cols-lg-2 g-3 align-items-center">
                                <div className="col">
                                    <h5 className="mb-0">Weekly Sales </h5>
                                </div>
                                <table className="table table-bordered mb-0">
                                    <thead>
                                        <tr>
                                            <th scope="col">#</th>
                                            <th scope="col">Product</th>
                                            <th scope="col">Purchase</th>
                                            <th scope="col">Total</th>

                                        </tr>
                                    </thead>
                                    <tbody>
                                        <tr>
                                            <th scope="row">Purchase</th>
                                            <td>44555</td>
                                            <td>58582</td>
                                            <td>95855</td>
                                        </tr>
                                        <tr>
                                            <th scope="row">Purchase</th>
                                            <td>44555</td>
                                            <td>58582</td>
                                            <td>95855</td>
                                        </tr>
                                        <tr style={{ backgroundColor: '#fdd55f' }}>
                                            <th scope="row">Total</th>
                                            <td>44555</td>
                                            <td>58582</td>
                                            <td>95855</td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                            <div className="row row-cols-1 row-cols-lg-2 g-3 align-items-center mt-2">
                                <div className="col">
                                    <h5 className="mb-0">Weekly Sales  </h5>
                                </div>
                                <table className="table table-bordered mb-0">
                                    <thead>
                                        <tr>
                                            <th scope="col">#</th>
                                            <th scope="col">Purchase</th>
                                            <th scope="col">Stock</th>
                                            <th scope="col">Total</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        <tr>
                                            <th scope="row">Demo</th>
                                            <td>44555</td>
                                            <td>58582</td>
                                            <td>95855</td>
                                        </tr>
                                        <tr>
                                            <th scope="row">Demo</th>
                                            <td>44555</td>
                                            <td>58582</td>
                                            <td>95855</td>
                                        </tr>
                                        <tr style={{ backgroundColor: '#7fef99' }}>
                                            <th scope="row">Total</th>
                                            <td>44555</td>
                                            <td>58582</td>
                                            <td>95855</td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="col-12 col-lg-4 col-xl-4 d-flex">
                    <div className="card radius-10 w-100">
                        <div className="card-header bg-transparent">
                            <div className="row g-3 align-items-center">
                                <div className="col">
                                    <h5 className="mb-0">Statistics</h5>
                                </div>
                                <div className="col">
                                    <div className="d-flex align-items-center justify-content-end gap-3 cursor-pointer">
                                        <div className="dropdown">
                                            <a className="dropdown-toggle dropdown-toggle-nocaret" href="#" data-bs-toggle="dropdown" aria-expanded="false">
                                                <i className="bx bx-dots-horizontal-rounded font-22 text-option"></i>
                                            </a>
                                            <ul className="dropdown-menu">
                                                <li>
                                                    <a className="dropdown-item" href="#">Action</a>
                                                </li>
                                                <li>
                                                    <a className="dropdown-item" href="#">Another action</a>
                                                </li>
                                                <li>
                                                    <hr className="dropdown-divider" />
                                                </li>
                                                <li>
                                                    <a className="dropdown-item" href="#">Something else here</a>
                                                </li>
                                            </ul>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="card-body">
                            <div id="chart2"></div>
                        </div>
                        <ul className="list-group list-group-flush mb-0">
                            <li className="list-group-item d-flex justify-content-between align-items-center bg-transparent">Total PHH<span className="badge bg-primary badge-pill">25%</span>
                            </li>
                            <li className="list-group-item d-flex justify-content-between align-items-center bg-transparent">Total AAY<span className="badge bg-orange badge-pill">65%</span>
                            </li>
                            <li className="list-group-item d-flex justify-content-between align-items-center bg-transparent">Total<span className="badge bg-success badge-pill">10%</span>
                            </li>
                        </ul>
                    </div>
                </div>
            </div>
        </>
    )
}
