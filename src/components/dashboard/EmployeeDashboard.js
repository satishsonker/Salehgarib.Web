import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom';
import { Api } from '../../apis/Api';
import { apiUrls } from '../../apis/ApiUrls';
import SalehPieChart from '../../components/common/SalehPieChart'
import DashboardCard from './DashboardCard';

export default function EmployeeDashboard() {
  const [dashboardData, setDashboardData] = useState();
  const pieData = [
    { name: "Employees", value: dashboardData?.employees },
    { name: "Staffs", value: dashboardData?.staffs },
    { name: "Deactive", value: dashboardData?.deactives },
  ]
  const pieJobData = [
    { name: "Designers", value: dashboardData?.designers },
    { name: "Hot Fix", value: dashboardData?.hotFixers },
    { name: "Stitchers", value: dashboardData?.stitchers },
    { name: "Hand Emb", value: dashboardData?.handEmbs },
    { name: "M Emb", value: dashboardData?.mEmbs },
    { name: "Apliq", value: dashboardData?.apliqs }
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
        <Link to="/employee-details?type=employee"><DashboardCard title="Total Employees" subtitle="Count" value={dashboardData?.employees} colorClass="bg-gradient-purple" icon="bi-person-badge-fill"></DashboardCard></Link>
        <Link to="/employee-details?type=staff"><DashboardCard title="Total Staffs" subtitle="Count" value={dashboardData?.staffs} colorClass="bg-gradient-success" icon="bi-file-earmark-person"></DashboardCard></Link>
        <DashboardCard title="Total Members" subtitle="Count" value={dashboardData?.members} colorClass="bg-gradient-danger" icon="bi-people-fill"></DashboardCard>
        <Link to="/employee-details?title=hot_fixer"><DashboardCard title="Total Hot Fixers" subtitle="Count" value={dashboardData?.hotFixers} colorClass="bg-gradient-info" icon="bi-people-bucket"></DashboardCard></Link>
        <Link to="/employee-details?title=hand_emb"><DashboardCard title="Total H. Emb." subtitle="Count" value={dashboardData?.handEmbs} colorClass="bg-gradient-cr1" icon="bi-hand-index-thumb"></DashboardCard></Link>
        <Link to="/employee-details?title=machine_emb"><DashboardCard title="Total M. Emb." subtitle="Count" value={dashboardData?.mEmbs} colorClass="bg-gradient-cr1" icon="bi-hand-index-thumb"></DashboardCard></Link>
        <Link to="/employee-details?title=aplik_cutter"><DashboardCard title="Total Apliqs" subtitle="Count" value={dashboardData?.apliqs} colorClass="bg-gradient-cr2" icon="bi-people-tools"></DashboardCard></Link>
        <Link to="/employee-details?title=sticher"><DashboardCard title="Total Stitchers" subtitle="Count" value={dashboardData?.stitchers} colorClass="bg-gradient-cr2" icon="bi-people-tools"></DashboardCard></Link>
        <Link to="/employee-details?title=designer"><DashboardCard title="Total Designers" subtitle="Count" value={dashboardData?.designers} colorClass="bg-gradient-cr3" icon="bi-flower1"></DashboardCard></Link>
        <Link to="/employee-details?title=employee"><DashboardCard title="Total Deactive" subtitle="Deactivate" value={dashboardData?.deactives} colorClass="bg-gradient-cr4" icon="bi-people-trash"></DashboardCard></Link>
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
