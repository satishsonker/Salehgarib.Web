import React, { useState, useEffect } from 'react'
import { Api } from '../../apis/Api'
import { apiUrls } from '../../apis/ApiUrls'
export default function Dashboard() {
    const [dashboardData, setDashboardData] = useState({});
    const [weeklySales, setWeeklySales] = useState([]);
    const [monthlySales, setMonthlySales] = useState([]);
    const [dailySales, setDailySales] = useState([]);

    useEffect(() => {
        let apiList = [];
        apiList.push(Api.Get(apiUrls.dashboardController.getDashboard));
        apiList.push(Api.Get(apiUrls.dashboardController.getWeeklySale));
        apiList.push(Api.Get(apiUrls.dashboardController.getMonthlySale));
        apiList.push(Api.Get(apiUrls.dashboardController.getDailySale));
        Api.MultiCall(apiList)
            .then(res => {
                setDashboardData(res[0].data);
                setWeeklySales(res[1].data);
                setMonthlySales(res[2].data);
                setDailySales(res[3].data);
            });
    }, []);

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
                                    <h4 className="my-1">{dashboardData.customers}</h4>
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
                                    <p className="mb-3 text-secondary">Total Orders</p>
                                    <h4 className="my-1">{dashboardData.orders}</h4>
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
                                    <h4 className="my-1">0</h4>
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
                                    <h4 className="my-1">{dashboardData.products}</h4>
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
                                    <h4 className="my-1">0</h4>
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
                                    <h4 className="my-1">{dashboardData.suppliers}</h4>
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
                                    <h4 className="my-1">{dashboardData.designs}</h4>
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
                                    <h4 className="my-1">{dashboardData.employees}</h4>
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
                            <div className="row row-cols-1 row-cols-lg-2 g-3 align-items-center mt-2">
                                <div className="col">
                                    <h5 className="mb-0">Daily Sales</h5>
                                </div>
                                <table className="table table-bordered mb-0">
                                    <thead>
                                        <tr>
                                            <th scope="col">#</th>
                                            <th scope="col">Name</th>
                                            <th scope="col">Count</th>
                                            <th scope="col">Amount</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        <tr>
                                            <th scope="row">{1}</th>
                                            <td>{dailySales?.name}</td>
                                            <td>{dailySales?.count}</td>
                                            <td>{dailySales?.amount?.toFixed(2)}</td>
                                        </tr>
                                        <tr className='bg-warning'>
                                            <th scope="row">Total</th>
                                            <td></td>
                                            <td></td>
                                            <td>{weeklySales[0]?.amount?.toFixed(2)}</td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                            <div className="row row-cols-1 row-cols-lg-2 g-3 align-items-center mt-2">
                                <div className="col">
                                    <h5 className="mb-0">Weekly Sales </h5>
                                </div>
                                <table className="table table-bordered mb-0">
                                    <thead>
                                        <tr>
                                            <th scope="col">#</th>
                                            <th scope="col">Name</th>
                                            <th scope="col">Count</th>
                                            <th scope="col">Amount</th>

                                        </tr>
                                    </thead>
                                    <tbody>
                                        {
                                            weeklySales?.map((ele, index) => {
                                                return <tr key={index}>
                                                    <th scope="row">{index + 1}</th>
                                                    <td>{ele.name}</td>
                                                    <td>{ele.count}</td>
                                                    <td>{ele.amount?.toFixed(2)}</td>
                                                </tr>
                                            })
                                        }
                                        <tr className='bg-success'>
                                            <th scope="row">Total</th>
                                            <td></td>
                                            <td></td>
                                            <td>{weeklySales[0]?.amount?.toFixed(2)}</td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                            <div className="row row-cols-1 row-cols-lg-2 g-3 align-items-center mt-2">
                                <div className="col">
                                    <h5 className="mb-0">Monthly Sales</h5>
                                </div>
                                <table className="table table-bordered mb-0">
                                    <thead>
                                        <tr>
                                            <th scope="col">#</th>
                                            <th scope="col">Name</th>
                                            <th scope="col">Count</th>
                                            <th scope="col">Amount</th>

                                        </tr>
                                    </thead>
                                    <tbody>
                                        {
                                            monthlySales?.map((ele, index) => {
                                                return <tr key={index}>
                                                    <th scope="row">{index + 1}</th>
                                                    <td>{ele.name}</td>
                                                    <td>{ele.count}</td>
                                                    <td>{ele.amount?.toFixed(2)}</td>
                                                </tr>
                                            })
                                        }
                                        <tr style={{ backgroundColor: '#fdd55f' }}>
                                            <th scope="row">Total</th>
                                            <td></td>
                                            <td></td>
                                            <td>{monthlySales[0]?.amount?.toFixed(2)}</td>
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
