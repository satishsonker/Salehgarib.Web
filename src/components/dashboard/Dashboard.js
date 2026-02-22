import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Api } from '../../apis/Api'
import { apiUrls } from '../../apis/ApiUrls'
import DashboardCard from './DashboardCard';
import { BarChart, Bar, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, LineChart, Line, AreaChart, Area } from 'recharts';

export default function Dashboard() {
    const navigate = useNavigate();
    const [dashboardData, setDashboardData] = useState({});
    const [weeklySales, setWeeklySales] = useState([]);
    const [monthlySales, setMonthlySales] = useState([]);
    const [dailySales, setDailySales] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [refreshTime, setRefreshTime] = useState(new Date());

    useEffect(() => {
        loadDashboardData();
        // Auto-refresh every 5 minutes
        const interval = setInterval(() => {
            loadDashboardData();
        }, 300000);
        return () => clearInterval(interval);
    }, []);

    const loadDashboardData = () => {
        setIsLoading(true);
        let apiList = [];
        apiList.push(Api.Get(apiUrls.dashboardController.getDashboard));
        apiList.push(Api.Get(apiUrls.dashboardController.getWeeklySale));
        apiList.push(Api.Get(apiUrls.dashboardController.getMonthlySale));
        apiList.push(Api.Get(apiUrls.dashboardController.getDailySale));
        Api.MultiCall(apiList)
            .then(res => {
                setDashboardData(res[0].data || {});
                setWeeklySales(res[1].data || []);
                setMonthlySales(res[2].data || []);
                setDailySales(res[3].data || {});
                setIsLoading(false);
                setRefreshTime(new Date());
            })
            .catch(err => {
                setIsLoading(false);
            });
    };

    const [monthlyActiveItem, setMonthlyActiveItem] = useState({});
    const [monthlyActiveIndex, setMonthlyActiveIndex] = useState(0)
    const handleMonthlyClick = (data, index) => {
        setMonthlyActiveItem({ ...monthlySales[index] });
        setMonthlyActiveIndex(index);
    };
    
    const [weeklyActiveItem, setWeeklyActiveItem] = useState({});
    const [weeklyActiveIndex, setWeeklyActiveIndex] = useState(0)
    const handleWeeklyClick = (data, index) => {
        setWeeklyActiveItem({ ...weeklySales[index] });
        setWeeklyActiveIndex(index);
    };

    // Calculate statistics
    const totalWeeklyAmount = weeklySales.reduce((sum, item) => sum + (item.amount || 0), 0);
    const totalWeeklyOrders = weeklySales.reduce((sum, item) => sum + (item.count || 0), 0);
    const totalMonthlyAmount = monthlySales.reduce((sum, item) => sum + (item.amount || 0), 0);
    const totalMonthlyOrders = monthlySales.reduce((sum, item) => sum + (item.count || 0), 0);
    const avgOrderValue = totalWeeklyOrders > 0 ? (totalWeeklyAmount / totalWeeklyOrders).toFixed(2) : 0;

    // Format currency
    const formatCurrency = (amount) => {
        return new Intl.NumberFormat('en-US', {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2
        }).format(amount || 0);
    };

    // Get current date info
    const currentDate = new Date();
    const dayName = currentDate.toLocaleDateString('en-US', { weekday: 'long' });
    const dateStr = currentDate.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });

    return (
        <>
            {/* Welcome Header */}
            <div className="row mb-4">
                <div className="col-12">
                    <div className="card border-0 shadow-sm" style={{ 
                        background: 'linear-gradient(135deg, #015f95 0%, #0178b8 100%)',
                        borderRadius: '15px',
                        overflow: 'hidden'
                    }}>
                        <div className="card-body p-4">
                            <div className="row align-items-center">
                                <div className="col-md-8">
                                    <h3 className="text-white mb-2" style={{ fontWeight: '600' }}>
                                        <i className="bi bi-speedometer2 me-2"></i>Dashboard Overview
                                    </h3>
                                    <p className="text-white-50 mb-0">
                                        {dayName}, {dateStr} • Last updated: {refreshTime.toLocaleTimeString()}
                                    </p>
                                </div>
                                <div className="col-md-4 text-end">
                                    <button 
                                        onClick={loadDashboardData}
                                        className="btn btn-light btn-sm px-4"
                                        style={{ borderRadius: '10px' }}
                                        disabled={isLoading}
                                    >
                                        <i className={`bi ${isLoading ? 'bi-arrow-clockwise' : 'bi-arrow-clockwise'} me-2 ${isLoading ? 'spinner-border spinner-border-sm' : ''}`}></i>
                                        {isLoading ? 'Refreshing...' : 'Refresh'}
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Key Metrics Cards */}
            <div className="row row-cols-1 row-cols-md-2 row-cols-lg-2 row-cols-xl-4 g-3 mb-4">
                <DashboardCard 
                    colorClass="widget-icon-large bg-gradient-purple text-white ms-auto" 
                    icon="bi bi-people-fill" 
                    title="Total Customers" 
                    subtitle="Active customers" 
                    value={dashboardData.customers || 0} 
                />
                <DashboardCard 
                    value={dashboardData.orders || 0} 
                    subtitle="All time orders" 
                    title="Total Orders" 
                    colorClass="widget-icon-large bg-gradient-success text-white ms-auto" 
                    icon="bi bi-cart-check-fill" 
                />
                <DashboardCard 
                    colorClass="widget-icon-large bg-gradient-info text-white ms-auto" 
                    icon="bi bi-box-seam-fill" 
                    title="Total Products" 
                    subtitle="Available products" 
                    value={dashboardData.products || 0} 
                />
                <DashboardCard 
                    colorClass="widget-icon-large bg-gradient-warning text-white ms-auto" 
                    icon="bi bi-briefcase-fill" 
                    title="Total Employees" 
                    subtitle="Active staff" 
                    value={dashboardData.employees || 0} 
                />
            </div>

            <div className="row row-cols-1 row-cols-md-2 row-cols-lg-2 row-cols-xl-4 g-3 mb-4">
                <DashboardCard 
                    colorClass="bg-gradient-cr2" 
                    icon="bi bi-truck" 
                    title="Total Suppliers" 
                    subtitle="Vendor partners" 
                    value={dashboardData.suppliers || 0} 
                />
                <DashboardCard 
                    colorClass="bg-gradient-cr3" 
                    icon="bi bi-palette-fill" 
                    title="Total Designs" 
                    subtitle="Design catalog" 
                    value={dashboardData.designs || 0} 
                />
                <DashboardCard 
                    colorClass="bg-gradient-danger" 
                    icon="bi bi-scissors" 
                    title="Cutting Orders" 
                    subtitle="Pending cuts" 
                    value={0} 
                />
                <DashboardCard 
                    colorClass="bg-gradient-cr1" 
                    icon="bi bi-boxes" 
                    title="Total Stocks" 
                    subtitle="Inventory items" 
                    value={0} 
                />
            </div>

            {/* Sales Overview Section */}
            <div className="row g-4 mb-4">
                {/* Daily Sales Card */}
                <div className="col-12 col-lg-6">
                    <div className="card border-0 shadow-sm h-100" style={{ borderRadius: '15px' }}>
                        <div className="card-header bg-transparent border-0 pt-4 px-4 pb-0">
                            <div className="d-flex justify-content-between align-items-center">
                                <div>
                                    <h5 className="mb-1" style={{ color: '#293445', fontWeight: '600' }}>
                                        <i className="bi bi-calendar-day-fill text-primary me-2"></i>Today's Sales
                                    </h5>
                                    <p className="text-muted small mb-0">{dailySales?.name || 'Today'}</p>
                                </div>
                                <div className="text-end">
                                    <div className="badge bg-primary bg-opacity-10 text-primary px-3 py-2" style={{ borderRadius: '10px' }}>
                                        <i className="bi bi-currency-dollar me-1"></i>Daily
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="card-body p-4">
                            <div className="row g-3">
                                <div className="col-6">
                                    <div className="p-3 rounded" style={{ background: '#e7f3ff' }}>
                                        <div className="text-muted small mb-1">Orders Count</div>
                                        <h3 className="mb-0 text-primary" style={{ fontWeight: '700' }}>
                                            {dailySales?.count || 0}
                                        </h3>
                                    </div>
                                </div>
                                <div className="col-6">
                                    <div className="p-3 rounded" style={{ background: '#fff3cd' }}>
                                        <div className="text-muted small mb-1">Total Amount</div>
                                        <h3 className="mb-0 text-warning" style={{ fontWeight: '700' }}>
                                            {formatCurrency(dailySales?.amount)}
                                        </h3>
                                    </div>
                                </div>
                            </div>
                            {dailySales?.amount > 0 && (
                                <div className="mt-3 pt-3 border-top">
                                    <div className="d-flex justify-content-between align-items-center">
                                        <span className="text-muted small">Average Order Value</span>
                                        <strong className="text-success">
                                            {formatCurrency((dailySales.amount / dailySales.count) || 0)}
                                        </strong>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* Weekly Sales Chart */}
                <div className="col-12 col-lg-6">
                    <div className="card border-0 shadow-sm h-100" style={{ borderRadius: '15px' }}>
                        <div className="card-header bg-transparent border-0 pt-4 px-4 pb-0">
                            <div className="d-flex justify-content-between align-items-center">
                                <div>
                                    <h5 className="mb-1" style={{ color: '#293445', fontWeight: '600' }}>
                                        <i className="bi bi-graph-up-arrow text-success me-2"></i>Weekly Sales Trend
                                    </h5>
                                    <p className="text-muted small mb-0">Last 7 days performance</p>
                                </div>
                                <div className="text-end">
                                    <div className="badge bg-success bg-opacity-10 text-success px-3 py-2" style={{ borderRadius: '10px' }}>
                                        <i className="bi bi-calendar-week me-1"></i>Weekly
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="card-body p-4">
                            {weeklySales.length > 0 ? (
                                <>
                                    <ResponsiveContainer width="100%" height={200}>
                                        <AreaChart data={weeklySales}>
                                            <defs>
                                                <linearGradient id="colorWeekly" x1="0" y1="0" x2="0" y2="1">
                                                    <stop offset="5%" stopColor="#015f95" stopOpacity={0.3}/>
                                                    <stop offset="95%" stopColor="#015f95" stopOpacity={0}/>
                                                </linearGradient>
                                            </defs>
                                            <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
                                            <XAxis dataKey="name" tick={{ fontSize: 12 }} />
                                            <YAxis tick={{ fontSize: 12 }} />
                                            <Tooltip 
                                                contentStyle={{ 
                                                    borderRadius: '10px', 
                                                    border: 'none', 
                                                    boxShadow: '0 4px 12px rgba(0,0,0,0.15)' 
                                                }}
                                                formatter={(value) => formatCurrency(value)}
                                            />
                                            <Area 
                                                type="monotone" 
                                                dataKey="amount" 
                                                stroke="#015f95" 
                                                strokeWidth={3}
                                                fillOpacity={1} 
                                                fill="url(#colorWeekly)"
                                            />
                                        </AreaChart>
                                    </ResponsiveContainer>
                                    <div className="mt-3 pt-3 border-top">
                                        <div className="row g-2">
                                            <div className="col-6">
                                                <div className="text-muted small">Total Amount</div>
                                                <strong className="text-primary">{formatCurrency(totalWeeklyAmount)}</strong>
                                            </div>
                                            <div className="col-6">
                                                <div className="text-muted small">Total Orders</div>
                                                <strong className="text-success">{totalWeeklyOrders}</strong>
                                            </div>
                                        </div>
                                    </div>
                                    {weeklyActiveItem?.name && (
                                        <div className="mt-2 alert alert-info border-0 py-2 px-3" style={{ borderRadius: '10px', fontSize: '0.875rem' }}>
                                            <i className="bi bi-info-circle me-2"></i>
                                            <strong>{weeklyActiveItem.name}:</strong> {formatCurrency(weeklyActiveItem.amount)} ({weeklyActiveItem.count} orders)
                                        </div>
                                    )}
                                </>
                            ) : (
                                <div className="text-center py-5 text-muted">
                                    <i className="bi bi-graph-up" style={{ fontSize: '3rem', opacity: 0.3 }}></i>
                                    <p className="mt-2">No weekly sales data available</p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {/* Monthly Sales Chart */}
            <div className="row g-4 mb-4">
                <div className="col-12">
                    <div className="card border-0 shadow-sm" style={{ borderRadius: '15px' }}>
                        <div className="card-header bg-transparent border-0 pt-4 px-4 pb-0">
                            <div className="d-flex justify-content-between align-items-center flex-wrap">
                                <div>
                                    <h5 className="mb-1" style={{ color: '#293445', fontWeight: '600' }}>
                                        <i className="bi bi-bar-chart-fill text-info me-2"></i>Monthly Sales Analysis
                                    </h5>
                                    <p className="text-muted small mb-0">Click on bars to view details</p>
                                </div>
                                <div className="d-flex gap-2 mt-2 mt-md-0">
                                    <div className="badge bg-info bg-opacity-10 text-info px-3 py-2" style={{ borderRadius: '10px' }}>
                                        <i className="bi bi-calendar-month me-1"></i>Monthly
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="card-body p-4">
                            {monthlySales.length > 0 ? (
                                <>
                                    <ResponsiveContainer width="100%" height={300}>
                                        <BarChart data={monthlySales}>
                                            <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
                                            <XAxis dataKey="name" tick={{ fontSize: 12 }} />
                                            <YAxis yAxisId="left" tick={{ fontSize: 12 }} />
                                            <YAxis yAxisId="right" orientation="right" tick={{ fontSize: 12 }} />
                                            <Tooltip 
                                                contentStyle={{ 
                                                    borderRadius: '10px', 
                                                    border: 'none', 
                                                    boxShadow: '0 4px 12px rgba(0,0,0,0.15)' 
                                                }}
                                                formatter={(value, name) => {
                                                    if (name === 'amount') return formatCurrency(value);
                                                    return value;
                                                }}
                                            />
                                            <Legend />
                                            <Bar 
                                                yAxisId="left"
                                                dataKey="amount" 
                                                name="Sales Amount"
                                                onClick={handleMonthlyClick}
                                                radius={[8, 8, 0, 0]}
                                            >
                                                {monthlySales.map((entry, index) => (
                                                    <Cell 
                                                        cursor="pointer" 
                                                        fill={index === monthlyActiveIndex ? '#015f95' : '#8884d8'} 
                                                        key={`cell-${index}`}
                                                        style={{ transition: 'all 0.3s ease' }}
                                                    />
                                                ))}
                                            </Bar>
                                            <Bar 
                                                yAxisId="right"
                                                dataKey="count" 
                                                name="Order Count"
                                                fill="#ea6323"
                                                radius={[8, 8, 0, 0]}
                                            />
                                        </BarChart>
                                    </ResponsiveContainer>
                                    <div className="mt-4 pt-3 border-top">
                                        <div className="row g-3">
                                            <div className="col-md-3 col-6">
                                                <div className="p-3 rounded" style={{ background: '#e7f3ff' }}>
                                                    <div className="text-muted small mb-1">Total Sales</div>
                                                    <h5 className="mb-0 text-primary" style={{ fontWeight: '700' }}>
                                                        {formatCurrency(totalMonthlyAmount)}
                                                    </h5>
                                                </div>
                                            </div>
                                            <div className="col-md-3 col-6">
                                                <div className="p-3 rounded" style={{ background: '#fff3cd' }}>
                                                    <div className="text-muted small mb-1">Total Orders</div>
                                                    <h5 className="mb-0 text-warning" style={{ fontWeight: '700' }}>
                                                        {totalMonthlyOrders}
                                                    </h5>
                                                </div>
                                            </div>
                                            <div className="col-md-3 col-6">
                                                <div className="p-3 rounded" style={{ background: '#d1e7dd' }}>
                                                    <div className="text-muted small mb-1">Avg Order Value</div>
                                                    <h5 className="mb-0 text-success" style={{ fontWeight: '700' }}>
                                                        {formatCurrency(totalMonthlyOrders > 0 ? totalMonthlyAmount / totalMonthlyOrders : 0)}
                                                    </h5>
                                                </div>
                                            </div>
                                            <div className="col-md-3 col-6">
                                                <div className="p-3 rounded" style={{ background: '#f8d7da' }}>
                                                    <div className="text-muted small mb-1">Best Month</div>
                                                    <h5 className="mb-0 text-danger" style={{ fontWeight: '700', fontSize: '1rem' }}>
                                                        {monthlySales.length > 0 
                                                            ? monthlySales.reduce((max, item) => item.amount > max.amount ? item : max, monthlySales[0])?.name 
                                                            : 'N/A'}
                                                    </h5>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    {monthlyActiveItem?.name && (
                                        <div className="mt-3 alert alert-primary border-0" style={{ borderRadius: '10px' }}>
                                            <div className="d-flex align-items-center">
                                                <i className="bi bi-info-circle-fill me-2" style={{ fontSize: '1.2rem' }}></i>
                                                <div className="flex-grow-1">
                                                    <strong>{monthlyActiveItem.name}:</strong> Total sales of {formatCurrency(monthlyActiveItem.amount)} from {monthlyActiveItem.count} orders
                                                </div>
                                            </div>
                                        </div>
                                    )}
                                </>
                            ) : (
                                <div className="text-center py-5 text-muted">
                                    <i className="bi bi-bar-chart" style={{ fontSize: '3rem', opacity: 0.3 }}></i>
                                    <p className="mt-2">No monthly sales data available</p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {/* Quick Actions & Insights */}
            <div className="row g-4">
                <div className="col-12 col-lg-6">
                    <div className="card border-0 shadow-sm h-100" style={{ borderRadius: '15px' }}>
                        <div className="card-header bg-transparent border-0 pt-4 px-4 pb-0">
                            <h5 className="mb-0" style={{ color: '#293445', fontWeight: '600' }}>
                                <i className="bi bi-lightning-charge-fill text-warning me-2"></i>Quick Actions
                            </h5>
                        </div>
                        <div className="card-body p-4">
                            <div className="row g-2">
                                <div className="col-6">
                                    <button 
                                        onClick={() => navigate('/customer-orders')}
                                        className="btn btn-outline-primary w-100 p-3 text-start"
                                        style={{ borderRadius: '10px' }}
                                    >
                                        <i className="bi bi-cart-plus-fill me-2"></i>New Order
                                    </button>
                                </div>
                                <div className="col-6">
                                    <button 
                                        onClick={() => navigate('/customer-details')}
                                        className="btn btn-outline-success w-100 p-3 text-start"
                                        style={{ borderRadius: '10px' }}
                                    >
                                        <i className="bi bi-person-plus-fill me-2"></i>Add Customer
                                    </button>
                                </div>
                                <div className="col-6">
                                    <button 
                                        onClick={() => navigate('/products')}
                                        className="btn btn-outline-info w-100 p-3 text-start"
                                        style={{ borderRadius: '10px' }}
                                    >
                                        <i className="bi bi-box-seam-fill me-2"></i>Manage Products
                                    </button>
                                </div>
                                <div className="col-6">
                                    <button 
                                        onClick={() => navigate('/employee-details')}
                                        className="btn btn-outline-warning w-100 p-3 text-start"
                                        style={{ borderRadius: '10px' }}
                                    >
                                        <i className="bi bi-people-fill me-2"></i>Manage Employees
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="col-12 col-lg-6">
                    <div className="card border-0 shadow-sm h-100" style={{ borderRadius: '15px' }}>
                        <div className="card-header bg-transparent border-0 pt-4 px-4 pb-0">
                            <h5 className="mb-0" style={{ color: '#293445', fontWeight: '600' }}>
                                <i className="bi bi-graph-up-arrow text-success me-2"></i>Performance Insights
                            </h5>
                        </div>
                        <div className="card-body p-4">
                            <div className="d-flex flex-column gap-3">
                                <div className="d-flex align-items-start">
                                    <div className="flex-shrink-0">
                                        <div className="rounded-circle bg-primary bg-opacity-10 p-2">
                                            <i className="bi bi-trophy-fill text-primary"></i>
                                        </div>
                                    </div>
                                    <div className="flex-grow-1 ms-3">
                                        <h6 className="mb-1">Weekly Performance</h6>
                                        <p className="text-muted small mb-0">
                                            {totalWeeklyOrders} orders processed this week with total sales of {formatCurrency(totalWeeklyAmount)}
                                        </p>
                                    </div>
                                </div>
                                <div className="d-flex align-items-start">
                                    <div className="flex-shrink-0">
                                        <div className="rounded-circle bg-success bg-opacity-10 p-2">
                                            <i className="bi bi-calendar-check-fill text-success"></i>
                                        </div>
                                    </div>
                                    <div className="flex-grow-1 ms-3">
                                        <h6 className="mb-1">Today's Activity</h6>
                                        <p className="text-muted small mb-0">
                                            {dailySales?.count || 0} orders today generating {formatCurrency(dailySales?.amount)} in revenue
                                        </p>
                                    </div>
                                </div>
                                <div className="d-flex align-items-start">
                                    <div className="flex-shrink-0">
                                        <div className="rounded-circle bg-info bg-opacity-10 p-2">
                                            <i className="bi bi-calculator-fill text-info"></i>
                                        </div>
                                    </div>
                                    <div className="flex-grow-1 ms-3">
                                        <h6 className="mb-1">Average Metrics</h6>
                                        <p className="text-muted small mb-0">
                                            Average order value: {formatCurrency(avgOrderValue)} per order
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}
