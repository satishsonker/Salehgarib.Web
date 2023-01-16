import React, { useState, useEffect, PureComponent } from 'react'
import { Api } from '../../apis/Api'
import { apiUrls } from '../../apis/ApiUrls'
import DashboardCard from './DashboardCard';
import { BarChart, Bar, Cell, XAxis, YAxis, CartesianGrid, Label, Tooltip, Legend, ResponsiveContainer } from 'recharts';

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
    const [monthlyActiveItem, setMonthlyActiveItem] = useState({});
    const [monthlyActiveIndex, setMonthlyActiveIndex] = useState(0)
    const handleMonthlyClick = (data, index) => {
        debugger;
        setMonthlyActiveItem({ ...monthlySales[index] });
        setMonthlyActiveIndex(index);
    };
    const [weeklyActiveItem, setWeeklyActiveItem] = useState({});
    const [weeklyActiveIndex, setWeeklyActiveIndex] = useState(0)
    const handleWeeklyClick = (data, index) => {
        setWeeklyActiveItem({ ...weeklySales[index] });
        setWeeklyActiveIndex(index);
    };
    return (
        <>
            <div className="row row-cols-1 row-cols-md-2 row-cols-lg-2 row-cols-xl-4">
                <DashboardCard colorClass="widget-icon-large bg-gradient-purple text-white ms-auto" icon="bi bi-basket2-fill" title="Total Customer" subtitle="Count" value={dashboardData.customers} />
                <DashboardCard value={dashboardData.orders} subtitle="Count" title="Total Orders" colorClass="widget-icon-large bg-gradient-success text-white ms-auto" icon="bi bi-currency-exchange" />
                <DashboardCard colorClass="widget-icon-large bg-gradient-danger text-white ms-auto" icon="bi bi-people-fill" title="Total Cutting Order" subtitle="Count" value={0} />
                <DashboardCard colorClass="widget-icon-large bg-gradient-info text-white ms-auto" icon="bi bi-bar-chart-line-fill" title="Total Products" subtitle="Count" value={dashboardData.products} />
                <DashboardCard colorClass="bg-gradient-cr1" icon="bi bi-bar-chart-line-fill" title="Total Stocks" subtitle="Count" value={0} />
                <DashboardCard colorClass="bg-gradient-cr2" icon="bi bi-bar-chart-line-fill" title="Total Suppliers" subtitle="Count" value={dashboardData.suppliers} />
                <DashboardCard colorClass="bg-gradient-cr3" icon="bi bi-bar-chart-line-fill" title="Total Designs" subtitle="Count" value={dashboardData.designs} />
                <DashboardCard colorClass="bg-gradient-cr4" icon="bi bi-bar-chart-line-fill" title="Total Employees" subtitle="Count" value={dashboardData.employees} />
            </div>
            <div className="row">
                <div className="col-12 d-flex">
                    <div className="card radius-10 w-100">
                        <div className="card-body">
                            <div className='row'>
                                <div className='col-6 col-xs-12'>
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
                                                    <td>{dailySales?.amount?.toFixed(2)}</td>
                                                </tr>
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                                <div className='col-6 col-xs-12'>
                                    <div className="row row-cols-1 row-cols-lg-2 g-3 align-items-center mt-2">
                                        <div className="col">
                                            <h5 className="mb-0">Weekly Sales </h5>
                                        </div>
                                        <div style={{ width: '100%' }}>
                                            <p>Click each rectangle </p>
                                            <ResponsiveContainer width="100%" height={100}>
                                                <BarChart width={150} height={40} data={weeklySales}>

                                                    <YAxis />
                                                    <XAxis dataKey="name" />
                                                    <Bar dataKey="amount" label={{ position: 'top' }} onClick={handleWeeklyClick}>
                                                        {weeklySales.map((entry, index) => (
                                                            <Cell cursor="pointer" fill={index === weeklyActiveIndex ? '#82ca9d' : '#8884d8'} key={`cell-${index}`} />
                                                        ))}
                                                    </Bar>
                                                </BarChart>
                                            </ResponsiveContainer>
                                            <p className="content">{`Total Amount: ${weeklyActiveItem?.amount ?? 0} and ${weeklyActiveItem?.count ?? 0} orders received on ${weeklyActiveItem.name ?? ""}`}</p>
                                        </div>
                                    </div>
                                </div>
                                <div className='col-12'>
                                    <div className="row row-cols-1 row-cols-lg-2 g-3 align-items-center mt-2">
                                        <div className="col">
                                            <h5 className="mb-0">Monthly Sales</h5>
                                        </div>
                                        <div style={{ width: '100%', height: '200px' }}>
                                            <p>Click each rectangle </p>
                                            <ResponsiveContainer width="100%" height={150}>

                                                <BarChart data={monthlySales}>
                                                    <YAxis />
                                                    <XAxis dataKey="name" />
                                                    <Tooltip />
                                                    <Legend />
                                                    <CartesianGrid strokeDasharray="2 2" />
                                                    <Bar dataKey="amount"  label={{ position: 'top' }} onClick={handleMonthlyClick}>
                                                        {monthlySales.map((entry, index) => (
                                                            <Cell cursor="pointer" fill={index === monthlyActiveIndex ? '#82ca9d' : '#8884d8'} key={`cell-${index}`} />
                                                        ))}
                                                    </Bar>
                                                    <Bar dataKey="count" stackId="a" fill="#ea6323" />
                                                </BarChart>
                                            </ResponsiveContainer>
                                            <p className="content">{`Total Amount: ${monthlyActiveItem?.amount ?? 0} and ${monthlyActiveItem?.count ?? 0} orders received on ${monthlyActiveItem.name ?? ""}`}</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                {/* <div className="col-12 col-lg-4 col-xl-4 d-flex">
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
                </div> */}
            </div>
        </>
    )
}
