import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom';
import { Api } from '../../apis/Api';
import { apiUrls } from '../../apis/ApiUrls';
import SalehPieChart from '../common/SalehPieChart'
import DashboardCard from './DashboardCard';

export default function OrderDashboard() {
    const [dashboardData, setDashboardData] = useState({
        orders: 0,
        kandoors: 10,
        cuttings: 0,
        mEmbs: 0,
        hEmbs: 0,
        hFixs: 0,
        designs: 10,
        apliqs: 0,
        stitches: 0
      });
  const pieWorkTypeData = [
    { name: "Apliqs", value: dashboardData?.apliqs },
    { name: "Cutting", value: dashboardData?.cuttings },
    { name: "Designings", value: dashboardData?.designs },
    { name: "Hand Emb", value: dashboardData?.hEmbs },
    { name: "Machine Emb", value: dashboardData?.mEmbs },
    { name: "Stitching", value: dashboardData?.stitches },
    { name: "Hot Fixes", value: dashboardData?.hFixs }
  ]
  useEffect(() => {
    Api.Get(apiUrls.dashboardController.getOrderDashboard)
      .then(res => {
        setDashboardData(res.data);
      })
  }, [])

  return (
    <>
    <div className="row row-cols-1 row-cols-md-2 row-cols-lg-2 row-cols-xl-4">
     
    <Link to='/customer-orders'><DashboardCard title="Total Orders" icon="bi-person-badge-fill" colorClass="bg-gradient-purple" value={dashboardData?.orders}></DashboardCard> </Link>
<Link to='/customer-orders'><DashboardCard title="Total Pieces" icon="bi-file-earmark-person" colorClass="bg-gradient-success" value={dashboardData?.kandoors}></DashboardCard></Link>
<Link to='/customer-orders'><DashboardCard title="Cutting Orders" icon="bi-people-fill" colorClass="bg-gradient-danger" value={dashboardData?.cuttings}></DashboardCard></Link>
<Link to='/customer-orders'><DashboardCard title="M. Emb. Orders" icon="bi-bucket" colorClass="bg-gradient-info" value={dashboardData?.mEmbs}></DashboardCard></Link>
<Link to='/customer-orders'><DashboardCard title="H. Emb. Orders" icon="bi-hand-index-thumb" colorClass="bg-gradient-cr1" value={dashboardData?.hEmbs}></DashboardCard></Link>
<Link to='/customer-orders'><DashboardCard title="Hot Fix Orders" icon="bi-tools" colorClass="bg-gradient-cr2" value={dashboardData?.hFixs}></DashboardCard></Link>
<Link to='/customer-orders'><DashboardCard title="Designing Orders" icon="bi-flower1" colorClass="bg-gradient-cr3" value={dashboardData?.designs}></DashboardCard></Link>
<Link to='/customer-orders'><DashboardCard title="Apliq Orders" icon="bi-trash" colorClass="bg-gradient-cr4" value={dashboardData?.apliqs}></DashboardCard></Link>
<Link to='/customer-orders'><DashboardCard title="Stitching Orders" icon="bi-trash" colorClass="bg-gradient-cr4" value={dashboardData?.stitches}></DashboardCard></Link>
    </div>
    <div className='row'>
      <div className='col-12'>
      <SalehPieChart data={pieWorkTypeData} h={400} w={400} outerRadius={150}></SalehPieChart>
      </div>
    </div>
    
  </>
  )
}
