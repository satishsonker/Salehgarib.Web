import React, { useState, useEffect } from 'react'
import { Api } from '../../apis/Api';
import { apiUrls } from '../../apis/ApiUrls';
import SalehPieChart from '../../components/common/SalehPieChart'
import { common } from '../../utils/common';

export default function ShopDashboard() {
    const [dashboardData, setDashboardData] = useState();
    const [accountData, setAccountData] = useState();
    const [orderQty, setOrderQty] = useState();
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
    }, []);
    useEffect(() => {
        var apis = [];
        apis.push(Api.Get(apiUrls.accountController.getSummarReport + `?fromDate=${common.getHtmlDate(new Date('2000-01-01'))}&toDate=${common.getHtmlDate(new Date())}`))
        apis.push(Api.Get(apiUrls.orderController.getOrdersQty + `?fromDate=${common.getHtmlDate(new Date('2000-01-01'))}&toDate=${common.getHtmlDate(new Date())}`));
        Api.MultiCall(apis)
          .then(res => {
            setAccountData(res[0].data);
            setOrderQty(res[1].data);
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
                  <span>Customers</span>
                </p>
                <h4 className="my-1">{0}</h4>
              </div>
              <div className="widget-icon-large bg-gradient-purple text-white ms-auto">
                <i className="bi bi-person-badge-fill"></i>
              </div>
            </div>
          </div>
        </div>
      
      </div>
      <div className='col'>
      <div className="card radius-10">
          <div className="card-body">
            <div className="d-flex align-items-center">
              <div>
                <p className="mb-3 text-secondary">
                  <span>Orders</span>
                </p>
                <h4 className="my-1">{orderQty?.orderQty}</h4>
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
                <p className="mb-3 text-secondary">Advance Cash</p>
                <h4 className="my-1">{common.printDecimal(accountData?.totalAdvanceCashAmount)}</h4>
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
                <p className="mb-3 text-secondary">Advance VISA</p>
                <h4 className="my-1">{common.printDecimal(accountData?.totalAdvanceVisaAmount)}</h4>
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
                <p className="mb-3 text-secondary">Delivery Cash</p>
                <h4 className="my-1">{common.printDecimal(accountData?.totalDeliveryCashAmount)}</h4>
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
                <p className="mb-3 text-secondary">Delivery VISA</p>
                <h4 className="my-1">{common.printDecimal(accountData?.totalDeliveryVisaAmount)}</h4>
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
                <div className="text-secondary">Cancelled/Deleted</div>
                <div className="text-secondary" style={{fontSize:'10px'}}>Orders</div>
                <h4 className="">{orderQty?.cancelledQty}/{orderQty.deletedQty}</h4>
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
                <div className="text-secondary">Pending</div>
                <div className="text-secondary" style={{fontSize:'10px'}}>Orders</div>
                <h4 className="">{orderQty?.activeQty}</h4>
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
              <div className="text-secondary">Processing</div>
                <div className="text-secondary" style={{fontSize:'10px'}}>Orders</div>
                <h4 className="">{orderQty?.processingQty}</h4>
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
              <div className="text-secondary">Delivered</div>
                <div className="text-secondary" style={{fontSize:'10px'}}>Orders</div>
                <h4 className="">{orderQty?.deliveredQty}</h4>
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
              <div className="text-secondary">Ready</div>
                <div className="text-secondary" style={{fontSize:'10px'}}>For Delivery</div>
                <h4 className="">{orderQty?.completedQty}</h4>
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
              <div className="text-secondary">Expiry Date</div>
                <div className="text-secondary" style={{fontSize:'10px'}}>Orders</div>
                <h4 className="">{orderQty?.expireQty}</h4>
              </div>
              <div className="widget-icon-large bg-gradient-cr4 text-white ms-auto"><i className="bi bi-trash"></i>
              </div>
            </div>
          </div>
        </div>
      </div> <div className="col">
        <div className="card radius-10">
          <div className="card-body">
            <div className="d-flex align-items-center">
              <div>
              <div className="text-secondary">Expense</div>
                <div className="text-secondary" style={{fontSize:'10px'}}>Shop</div>
                <h4 className="">{0}</h4>
              </div>
              <div className="widget-icon-large bg-gradient-cr4 text-white ms-auto"><i className="bi bi-trash"></i>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    
  </>)
}
