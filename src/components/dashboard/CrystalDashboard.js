import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom';
import { Api } from '../../apis/Api';
import { apiUrls } from '../../apis/ApiUrls';
import SalehPieChart from '../common/SalehPieChart';
import DashboardCard from './DashboardCard';

export default function CrystalDashboard() {
    const [dashboardData, setDashboardData] = useState([]);
    useEffect(() => {
        Api.Get(apiUrls.dashboardController.getCrystalDashboard)
            .then(res => {
                setDashboardData(res.data);
            })
    }, []);
    const pieCrystalDataPack = [
        { name: "Purchased Packet", value: dashboardData?.buyQty },
        { name: "Used Packet", value: dashboardData?.usedQty}
      ]
    return (
        <>
            <div className="row row-cols-1 row-cols-md-2 row-cols-lg-2 row-cols-xl-4">
                <Link to='/customer-orders'><DashboardCard title="Buy Packets" icon="bi-person-badge-fill" colorClass="bg-gradient-purple" value={dashboardData?.buyQty}></DashboardCard> </Link>
                <Link to='/customer-orders'><DashboardCard title="Buy Pieces" icon="bi-file-earmark-person" colorClass="bg-gradient-success" value={dashboardData?.buyPiece}></DashboardCard></Link>
                <Link to='/customer-orders'><DashboardCard title="Used Packets" icon="bi-people-fill" colorClass="bg-gradient-danger" value={dashboardData?.usedQty}></DashboardCard></Link>
                <Link to='/customer-orders'><DashboardCard title="Used Pieces" icon="bi-bucket" colorClass="bg-gradient-info" value={dashboardData?.usedPiece}></DashboardCard></Link>
                <Link to='/customer-orders'><DashboardCard title="Balance Packets" icon="bi-hand-index-thumb" colorClass="bg-gradient-cr1" value={dashboardData?.balanceQty}></DashboardCard></Link>
                <Link to='/customer-orders'><DashboardCard title="Balance Pieces" icon="bi-tools" colorClass="bg-gradient-cr2" value={dashboardData?.balancePiece}></DashboardCard></Link>

                <Link to='/customer-orders'><DashboardCard title="Low Stock" subtitle="Crystals" icon="bi-file-earmark-person" colorClass="bg-gradient-success" value={dashboardData?.lowCrystalStockCount}></DashboardCard></Link>
                <Link to='/customer-orders'><DashboardCard title="Today Used" subtitle="Packets" icon="bi-people-fill" colorClass="bg-gradient-danger" value={dashboardData?.todayUsedQty}></DashboardCard></Link>
                <Link to='/customer-orders'><DashboardCard title="Today Used" subtitle="Pieces" icon="bi-bucket" colorClass="bg-gradient-info" value={dashboardData?.todayUsedQty}></DashboardCard></Link>
                <Link to='/customer-orders'><DashboardCard title="Today Added" subtitle="Packets in Stock" icon="bi-hand-index-thumb" colorClass="bg-gradient-cr1" value={dashboardData?.todayUsedQty}></DashboardCard></Link>
                <Link to='/customer-orders'><DashboardCard title="Today Added" subtitle="Pieces in Stock" icon="bi-tools" colorClass="bg-gradient-cr2" value={dashboardData?.todayBuyPiece}></DashboardCard></Link>
            </div>

            <div className='row'>
        <div className='col-12'>
          <SalehPieChart data={pieCrystalDataPack} h={400} w={400} outerRadius={150}></SalehPieChart>
        </div>
      </div>
        </>
    )
}
