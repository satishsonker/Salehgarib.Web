import React, { useState, useEffect } from 'react'
import { Api } from '../../apis/Api';
import { apiUrls } from '../../apis/ApiUrls';
import SalehPieChart from '../../components/common/SalehPieChart'

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
        <div className="col">
          <div className="card radius-10">
            <div className="card-body">
              <div className="d-flex align-items-center">
                <div>
                  <p className="mb-3 text-secondary">
                    <span>Total Employees</span>
                  </p>
                  <h4 className="my-1">{dashboardData?.employees}</h4>
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
                  <p className="mb-3 text-secondary">Total Staffs</p>
                  <h4 className="my-1">{dashboardData?.staffs}</h4>
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
                  <p className="mb-3 text-secondary">Total Members</p>
                  <h4 className="my-1">{dashboardData?.members}</h4>
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
                  <p className="mb-3 text-secondary">Total Hot Fixers</p>
                  <h4 className="my-1">{dashboardData?.hotFixers}</h4>
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
                  <p className="mb-3 text-secondary">Hand Emb</p>
                  <h4 className="my-1">{dashboardData?.handEmbs}</h4>
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
                  <p className="mb-3 text-secondary">Total Stitchers</p>
                  <h4 className="my-1">{dashboardData?.stitchers}</h4>
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
                  <p className="mb-3 text-secondary">Total Designers</p>
                  <h4 className="my-1">{dashboardData?.designers}</h4>
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
                  <p className="mb-3 text-secondary">Cancelled</p>
                  <h4 className="my-1">{dashboardData?.deactives}</h4>
                </div>
                <div className="widget-icon-large bg-gradient-cr4 text-white ms-auto"><i className="bi bi-trash"></i>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className='row'>
        <div className='col-6'>
        <SalehPieChart data={pieData} h={300} w={300}></SalehPieChart>
        </div>
        <div className='col-6'>
        <SalehPieChart data={pieJobData} h={300} w={300}></SalehPieChart>
        </div>
      </div>
      
    </>
  )
}
