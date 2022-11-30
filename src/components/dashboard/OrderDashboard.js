import React, { useState, useEffect } from 'react'
import { Api } from '../../apis/Api';
import { apiUrls } from '../../apis/ApiUrls';
import SalehPieChart from '../common/SalehPieChart'

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
      <div className="col">
        <div className="card radius-10">
          <div className="card-body">
            <div className="d-flex align-items-center">
              <div>
                <p className="mb-3 text-secondary">
                  <span>Total Orders</span>
                </p>
                <h4 className="my-1">{dashboardData?.orders}</h4>
              </div>
              <div className="widget-icon-large bg-gradient-purple text-white ms-auto">
                <i className="bi bi-person-badge-fill"></i>
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
                <p className="mb-3 text-secondary">Total Pieces</p>
                <h4 className="my-1">{dashboardData?.kandoors}</h4>
              </div>
              <div className="widget-icon-large bg-gradient-success text-white ms-auto">
                <i className="bi bi-file-earmark-person"></i>
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
                <p className="mb-3 text-secondary">Cutting Orders</p>
                <h4 className="my-1">{dashboardData?.cuttings}</h4>
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
                <p className="mb-3 text-secondary">Machine Emb. Orders</p>
                <h4 className="my-1">{dashboardData?.mEmbs}</h4>
              </div>
              <div className="widget-icon-large bg-gradient-info text-white ms-auto">
                <i className="bi bi-bucket"></i>
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
                <p className="mb-3 text-secondary">Hand Emb. Orders</p>
                <h4 className="my-1">{dashboardData?.hEmbs}</h4>
              </div>
              <div className="widget-icon-large bg-gradient-cr1 text-white ms-auto"><i className="bi bi-hand-index-thumb"></i>
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
                <p className="mb-3 text-secondary">Hot fix Orders</p>
                <h4 className="my-1">{dashboardData?.hFixs}</h4>
              </div>
              <div className="widget-icon-large bg-gradient-cr2 text-white ms-auto"><i className="bi bi-tools"></i>
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
                <p className="mb-3 text-secondary">Designing Orders</p>
                <h4 className="my-1">{dashboardData?.designs}</h4>
              </div>
              <div className="widget-icon-large bg-gradient-cr3 text-white ms-auto"><i className="bi bi-flower1"></i>
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
                <p className="mb-3 text-secondary">Apliq Orders</p>
                <h4 className="my-1">{dashboardData?.apliqs}</h4>
              </div>
              <div className="widget-icon-large bg-gradient-cr4 text-white ms-auto"><i className="bi bi-trash"></i>
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
                <p className="mb-3 text-secondary">Stitching Orders</p>
                <h4 className="my-1">{dashboardData?.stitches}</h4>
              </div>
              <div className="widget-icon-large bg-gradient-cr4 text-white ms-auto"><i className="bi bi-trash"></i>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div className='row'>
      <div className='col-12'>
      <SalehPieChart data={pieWorkTypeData} h={400} w={400} outerRadius={180}></SalehPieChart>
      </div>
    </div>
    
  </>
  )
}
