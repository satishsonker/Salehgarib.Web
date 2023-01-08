import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom';
import { Api } from '../../apis/Api';
import { apiUrls } from '../../apis/ApiUrls';
import SalehPieChart from '../../components/common/SalehPieChart'
import DashboardCard from './DashboardCard';

export default function ExpenseDashboard() {
    const [dashboardData, setDashboardData] = useState({
        suppliers: 0,
        stocks: 0,
        purchases: 0,
        rent: 0,
        expCash: 0,
        expVisa: 0,
        expCheque: 0,
        expenses: 0
      })
    useEffect(() => {
        Api.Get(apiUrls.dashboardController.getExpenseDashboard)
          .then(res => {
            setDashboardData(res.data);
          })
      }, [])
  return (
    <>
       <div className="row row-cols-1 row-cols-md-2 row-cols-lg-2 row-cols-xl-4">
       <Link to="/employee-details?title=sticher"><DashboardCard title="Total Expenses" subtitle="Amount" value={dashboardData?.expenses} colorClass="bg-gradient-cr2" icon="bi-people-tools"></DashboardCard></Link>
        <Link to="/employee-details?type=employee"><DashboardCard title="Total Suppliers" subtitle="Count" value={dashboardData?.suppliers} colorClass="bg-gradient-purple" icon="bi-person-badge-fill"></DashboardCard></Link>
        <Link to="/employee-details?type=staff"><DashboardCard title="Total Stocks" subtitle="Count" value={dashboardData?.stocks} colorClass="bg-gradient-success" icon="bi-file-earmark-person"></DashboardCard></Link>
        <DashboardCard title="Total Purchases" subtitle="Amount" value={dashboardData?.purchases} colorClass="bg-gradient-danger" icon="bi-people-fill"></DashboardCard>
        <Link to="/employee-details?title=hot_fixer"><DashboardCard title="Total Rent" subtitle="Amount" value={dashboardData?.rent} colorClass="bg-gradient-info" icon="bi-people-bucket"></DashboardCard></Link>
        <Link to="/employee-details?title=hand_emb"><DashboardCard title="Total Cash Exp." subtitle="Amount" value={dashboardData?.expCash} colorClass="bg-gradient-cr1" icon="bi-hand-index-thumb"></DashboardCard></Link>
        <Link to="/employee-details?title=machine_emb"><DashboardCard title="Total VISA Exp" subtitle="Amount" value={dashboardData?.expVisa} colorClass="bg-gradient-cr1" icon="bi-hand-index-thumb"></DashboardCard></Link>
        <Link to="/employee-details?title=aplik_cutter"><DashboardCard title="Total Cheque Exp" subtitle="Amount" value={dashboardData?.expCheque} colorClass="bg-gradient-cr2" icon="bi-people-tools"></DashboardCard></Link>
      </div>
    </>
  )
}
