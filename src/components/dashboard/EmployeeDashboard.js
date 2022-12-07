import React, { useState, useEffect } from 'react'
import { Api } from '../../apis/Api';
import { apiUrls } from '../../apis/ApiUrls';
import SalehPieChart from '../../components/common/SalehPieChart'
import DashboardCard from './DashboardCard';

export default function EmployeeDashboard() {
  const [dashboardData, setDashboardData] = useState();
  const pieData = [
    { name: "Employees", value: dashboardData?.employees },
    { name: "Staffs", value: dashboardData?.staffs },
    { name: "Cancelled", value: dashboardData?.deactives },
  ]
  const pieJobData = [
    { name: "Designers", value: dashboardData?.designers },
    { name: "Hot Fix", value: dashboardData?.hotFixers },
    { name: "Stitchers", value: dashboardData?.stitchers },
    { name: "Hand Emb", value: dashboardData?.handEmbs }
  ]
  useEffect(() => {
    Api.Get(apiUrls.dashboardController.getEmpDashboard)
      .then(res => {
        setDashboardData(res.data);
      })
  }, [])

  return (
    <>
      <div className="row row-cols-1 row-cols-md-2 row-cols-lg-2 row-cols-xl-4">
        <DashboardCard title="Total Employees" subtitle="Count" value={dashboardData?.employees} colorClass="bg-gradient-purple" icon="bi-person-badge-fill"></DashboardCard>
        <DashboardCard title="Total Staffs" subtitle="Count" value={dashboardData?.staffs} colorClass="bg-gradient-success" icon="bi-file-earmark-person"></DashboardCard>
        <DashboardCard title="Total M. Emb." subtitle="Count" value={dashboardData?.members} colorClass="bg-gradient-danger" icon="bi-people-fill"></DashboardCard>
        <DashboardCard title="Total Hot Fixers" subtitle="Count" value={dashboardData?.hotFixers} colorClass="bg-gradient-info" icon="bi-people-bucket"></DashboardCard>
        <DashboardCard title="Total H. Emb." subtitle="Count" value={dashboardData?.hotFixers} colorClass="bg-gradient-cr1" icon="bi-hand-index-thumb"></DashboardCard>
        <DashboardCard title="Total Stitchers" subtitle="Count" value={dashboardData?.stitchers} colorClass="bg-gradient-cr2" icon="bi-people-tools"></DashboardCard>
        <DashboardCard title="Total Designers" subtitle="Count" value={dashboardData?.designers} colorClass="bg-gradient-cr3" icon="bi-flower1"></DashboardCard>
        <DashboardCard title="Total Cancelled" subtitle="Deactivate" value={dashboardData?.deactives} colorClass="bg-gradient-cr4" icon="bi-people-trash"></DashboardCard>
      </div>
      <div className='row'>
        <div className='col-6'>
          <SalehPieChart data={pieData} h={300} w={300} outerRadius={100}></SalehPieChart>
        </div>
        <div className='col-6'>
          <SalehPieChart data={pieJobData} h={300} w={300} outerRadius={100}></SalehPieChart>
        </div>
      </div>
    </>
  )
}
