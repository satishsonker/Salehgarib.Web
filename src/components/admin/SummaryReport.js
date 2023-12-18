import React, { useState, useEffect, useRef } from 'react';
import Breadcrumb from '../common/Breadcrumb'
import { Api } from '../../apis/Api';
import { apiUrls } from '../../apis/ApiUrls';
import { common } from '../../utils/common';
import SalehPieChart from '../common/SalehPieChart';
import { useReactToPrint } from 'react-to-print';
import { PrintAccountSummaryReport } from '../print/admin/account/PrintAccountSummaryReport';
import Inputbox from '../common/Inputbox';
import ButtonBox from '../common/ButtonBox';

export default function SummaryReport() {
  const VAT = parseFloat(process.env.REACT_APP_VAT);
  const [accountData, setAccountData] = useState();
  const [orderQty, setOrderQty] = useState();
  const [workTypeSumAmount, setWorkTypeSumAmount] = useState([]);
  const [expenseHeadWiseSum, setExpenseHeadWiseSum] = useState([])
  const [filterModel, setFilterModel] = useState({
    fromDate: common.getHtmlDate(new Date()),
    toDate: common.getHtmlDate(new Date())
  });
  const [fetchData, setFetchData] = useState(0);
  const [printData, setPrintData] = useState()
  const printAccountSummaryReportRef = useRef();
  const printAccountSummaryReportHandler = useReactToPrint({
    content: () => printAccountSummaryReportRef.current,
  });

  const textChangeHandler = (e) => {
    var { name, value } = e.target;
    setFilterModel({ ...filterModel, [name]: value });
  }
  useEffect(() => {
    var apis = [];
    apis.push(Api.Get(apiUrls.accountController.getSummarReport + `?fromDate=${filterModel.fromDate}&toDate=${filterModel.toDate}`))
    apis.push(Api.Get(apiUrls.orderController.getOrdersQty + `?fromDate=${filterModel.fromDate}&toDate=${filterModel.toDate}`));
    apis.push(Api.Get(apiUrls.workTypeStatusController.getSumAmount + `?fromDate=${filterModel.fromDate}&toDate=${filterModel.toDate}`));
    apis.push(Api.Get(apiUrls.expenseController.getExpenseHeadWiseSum + `fromDate=${filterModel.fromDate}&toDate=${filterModel.toDate}`))
    Api.MultiCall(apis)
      .then(res => {
        setAccountData(res[0].data);
        setOrderQty(res[1].data);
        setWorkTypeSumAmount(res[2].data);
        setExpenseHeadWiseSum(res[3].data);
        setPrintData({
          account: res[0].data,
          order: res[1].data,
          workType: res[2].data,
          expenseHeadWiseSum:res[3].data
        })
      });
  }, [fetchData]);

  const breadcrumbOption = {
    title: 'Summary Report',
    items: [
      {
        title: "Admin",
        icon: "bi bi-person-square",
        isActive: false,
      },
      {
        title: "Summary Report",
        icon: "bi bi-journals",
        isActive: false,
      }
    ]
  }

  const pieAdvance = [
    { name: 'Cash', value: accountData?.totalAdvanceCashAmount },
    { name: 'Visa', value: accountData?.totalAdvanceVisaAmount }
  ]
  const pieDelivery = [
    { name: 'Cash', value: accountData?.totalDeliveryCashAmount },
    { name: 'Visa', value: accountData?.totalDeliveryVisaAmount }
  ]
  const pieCancelRefund = [
    { name: 'Cancel', value: accountData?.totalCancelledAmount },
    { name: 'Delete', value: accountData?.totalDeletedAmount },
    { name: 'Refund', value: accountData?.totalRefundAmount }
  ]

  const pieVat = [
    { name: 'Booking', value: accountData?.totalBookingVatAmount },
    { name: 'Advance', value: accountData?.totalAdvanceVatAmount },
    { name: 'Balance', value: accountData?.totalBalanceVatAmount }
  ]
  const pieGrandAmount = [
    { name: 'Cash', value: accountData?.totalAdvanceCashAmount + accountData?.totalDeliveryCashAmount },
    { name: 'Visa', value: accountData?.totalAdvanceVisaAmount + accountData?.totalDeliveryVisaAmount }
  ]

  const pieGrandExpense = [
    { name: 'Cash', value: 0 },
    { name: 'Visa', value: 0 }
  ]

  const getExpensePieData = () => {
    var data = [];
    workTypeSumAmount?.forEach(res => {
      data.push({ name: res.workType, value: res.amount });
    });
    return data;
  }
  const getExpenseHeadWiseSumPieData = () => {
    var data = [];
    expenseHeadWiseSum?.forEach(res => {
      data.push({ name: res.expenseName, value: res.amount });
    });
    return data;
  }
  return (
    <>
      <Breadcrumb option={breadcrumbOption}></Breadcrumb>
      <div className='row'>
        <div className='col-12 text-end'>
          <div className="d-flex justify-content-end">
            <div className="p-2">From</div>
            <div className="p-2">
              <Inputbox showLabel={false} className='form-control-sm' max={filterModel.toDate} type="date" name='fromDate' value={filterModel.fromDate} onChangeHandler={textChangeHandler} />
            </div>
            <div className="p-2">To</div>
            <div className="p-2">
              <Inputbox showLabel={false} className='form-control-sm' min={filterModel.fromDate} type="date" name='toDate' value={filterModel.toDate} onChangeHandler={textChangeHandler} />
            </div>
            <div className='p-2'>
              <ButtonBox className="btn-sm" onClickHandler={() => { setFetchData(fetchData + 1) }} type="go" />
            </div>
            <div className='p-2'>
              <ButtonBox className="btn-sm" text="Show Summary" modalId="#summaryReportModel" type="go" />
            </div>
            <div className='p-2'>
              <ButtonBox className="btn-sm" onClickHandler={printAccountSummaryReportHandler} type="print" />
            </div>
          </div>
        </div>
      </div>
      <div className='card'>
        <div className='card-header text-uppercase fw-bold'>Account Summary Report</div>
        <div className='card-body'>
          <div className="accordion" id="accordionExample">
            <div className="accordion-item">
              <h2 className="accordion-header" id="headingOne">
                <button className="accordion-button  text-uppercase fw-bold" type="button" data-bs-toggle="collapse" data-bs-target="#collapseOne" aria-expanded="true" aria-controls="collapseOne">
                  Bookings
                </button>
              </h2>
              <div id="collapseOne" className="accordion-collapse collapse show" aria-labelledby="headingOne" data-bs-parent="#accordionExample">
                <div className="accordion-body">
                  <div className='card'>
                    <div className='card-body'>
                      <div className='row'>
                        <div className='col-12'>
                          <div className="d-flex justify-content-between">
                            <div className="p-2 text-uppercase fw-bold">total booking amount</div>
                            <div className="p-2">{common.printDecimal(accountData?.totalBookingAmount)}</div>
                            <div className="p-2 text-uppercase fw-bold">
                              <div className='text-muted'>total booking qty</div>
                              <div style={{ fontSize: '10px' }} className='text-muted'>Kandoora QTY</div>
                            </div>
                            <div className="p-2">{orderQty?.bookingQty}</div>
                            <div className="p-2 text-uppercase fw-bold">total order qty</div>
                            <div className="p-2">{orderQty?.orderQty}</div>
                          </div>
                        </div>
                        <div className='col-12'>
                          <div className="d-flex justify-content-between">
                            <div className="p-2 text-uppercase fw-bold">total booking Cash amount</div>
                            <div className="p-2">{common.printDecimal(accountData?.totalBookingCashAmount)}</div>
                            <div className="p-2 text-uppercase fw-bold">total booking Visa amount</div>
                            <div className="p-2">{common.printDecimal(accountData?.totalBookingVisaAmount)}</div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="accordion-item">
              <h2 className="accordion-header" id="headingTwo">
                <button className="accordion-button  text-uppercase fw-bold" type="button" data-bs-toggle="collapse" data-bs-target="#collapseTwo" aria-expanded="false" aria-controls="collapseTwo">
                  Advance Amount
                </button>
              </h2>
              <div id="collapseTwo" className="accordion-collapse collapse show" aria-labelledby="headingTwo" data-bs-parent="#accordionExample">
                <div className="accordion-body">
                  <div className='card'>
                    <div className='card-body'>
                      <div className='row'>
                        <div className='col-6'>
                          <div className="d-flex justify-content-between">
                            <div className="p-2 text-uppercase fw-bold">Advance cash amount</div>
                            <div className="p-2">{common.printDecimal(accountData?.totalAdvanceCashAmount)}</div>
                          </div>
                          <div className="d-flex justify-content-between">
                            <div className="p-2 text-uppercase fw-bold">advance visa amount</div>
                            <div className="p-2">{common.printDecimal(accountData?.totalAdvanceVisaAmount)}</div>
                          </div>
                          <div className="d-flex justify-content-between">
                            <div className="p-2 text-uppercase fw-bold">total advance amount</div>
                            <div className="p-2">{common.printDecimal(accountData?.totalAdvanceAmount)}</div>
                          </div>
                        </div>
                        <div className='col-6'>
                          <SalehPieChart h={250} w={300} data={pieAdvance}></SalehPieChart>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="accordion-item">
              <h2 className="accordion-header" id="headingThree">
                <button className="accordion-button  text-uppercase fw-bold collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#collapseThree" aria-expanded="false" aria-controls="collapseThree">
                  Delivery Amount
                </button>
              </h2>
              <div id="collapseThree" className="accordion-collapse collapse show" aria-labelledby="headingThree" data-bs-parent="#accordionExample">
                <div className="accordion-body">
                  <div className='card'>
                    <div className='card-body'>
                      <div className='row'>
                        <div className='col-6'>
                          <div className="d-flex justify-content-between">
                            <div className="p-2 text-uppercase fw-bold">total Delivery cash amount</div>
                            <div className="p-2">{common.printDecimal(accountData?.totalDeliveryCashAmount)}</div>
                          </div>
                          <div className="d-flex justify-content-between">
                            <div className="p-2 text-uppercase fw-bold">total Delivery visa amount</div>
                            <div className="p-2">{common.printDecimal(accountData?.totalDeliveryVisaAmount)}</div>
                          </div>
                          <div className="d-flex justify-content-between">
                            <div className="p-2 text-uppercase fw-bold">total Delivery amount</div>
                            <div className="p-2">{common.printDecimal(accountData?.totalDeliveryAmount)}</div>
                          </div>
                          <div className="d-flex justify-content-between">
                            <div className="p-2 text-uppercase fw-bold">total Delivery QTY</div>
                            <div className="p-2">{orderQty?.deliveredQty}</div>
                          </div>
                        </div>
                        <div className='col-6'>
                          <SalehPieChart h={250} w={300} data={pieDelivery}></SalehPieChart>
                        </div>
                      </div>
                    </div>
                  </div></div>
              </div>
            </div>
            <div className="accordion-item">
              <h2 className="accordion-header" id="headingFour">
                <button className="accordion-button  text-uppercase fw-bold collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#collapseFour" aria-expanded="false" aria-controls="collapseFour">
                  Cancel/Refund Amount
                </button>
              </h2>
              <div id="collapseFour" className="accordion-collapse collapse show" aria-labelledby="headingFour" data-bs-parent="#accordionExample">
                <div className="accordion-body">
                  <div className='card'>
                    <div className='card-body'>
                      <div className='row'>
                        <div className='col-6'>
                          <div className="d-flex justify-content-between">
                            <div className="p-2 text-uppercase fw-bold">total Cancelled amount</div>
                            <div className="p-2">{common.printDecimal(accountData?.totalCancelledAmount)}</div>
                          </div>
                          <div className="d-flex justify-content-between">
                            <div className="p-2 text-uppercase fw-bold">total Deleted amount</div>
                            <div className="p-2">{common.printDecimal(accountData?.totalDeletedAmount)}</div>
                          </div>
                          <div className="d-flex justify-content-between">
                            <div className="p-2 text-uppercase fw-bold">total refund amount</div>
                            <div className="p-2">{common.printDecimal(accountData?.totalRefundAmount)}</div>
                          </div>
                          <div className="d-flex justify-content-between">
                            <div className="p-2 text-uppercase fw-bold">total cancelled QTY</div>
                            <div className="p-2">{orderQty?.cancelledQty}</div>
                          </div>
                          <div className="d-flex justify-content-between">
                            <div className="p-2 text-uppercase fw-bold">total deleted QTY</div>
                            <div className="p-2">{orderQty?.deletedQty}</div>
                          </div>
                        </div>
                        <div className='col-6'>
                          <SalehPieChart h={250} w={300} data={pieCancelRefund}></SalehPieChart>
                        </div>
                      </div>
                    </div>
                  </div></div>
              </div>
            </div>
            <div className="accordion-item">
              <h2 className="accordion-header" id="headingFive">
                <button className="accordion-button  text-uppercase fw-bold collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#collapseFive" aria-expanded="false" aria-controls="collapseFive">
                  VAT Amount
                </button>
              </h2>
              <div id="collapseFive" className="accordion-collapse collapse show" aria-labelledby="headingFive" data-bs-parent="#accordionExample">
                <div className="accordion-body">
                  <div className='card'>
                    <div className='card-body'>
                      <div className='row'>
                        <div className='col-6'>
                          <div className="d-flex justify-content-between">
                            <div className="p-2 text-uppercase fw-bold">Total Booking vat {VAT}%</div>
                            <div className="p-2">{common.printDecimal(accountData?.totalBookingVatAmount)}</div>
                          </div>
                          <div className="d-flex justify-content-between">
                            <div className="p-2 text-uppercase fw-bold">total Advance vat {VAT}%</div>
                            <div className="p-2">{common.printDecimal(accountData?.totalAdvanceVatAmount)}</div>
                          </div>
                          <div className="d-flex justify-content-between">
                            <div className="p-2 text-uppercase fw-bold">total Balance vat {VAT}%</div>
                            <div className="p-2">{common.printDecimal(accountData?.totalBalanceVatAmount)}</div>
                          </div>
                        </div>
                        <div className='col-6'>
                          <SalehPieChart h={250} w={300} data={pieVat}></SalehPieChart>
                        </div>
                      </div>
                    </div>
                  </div></div>
              </div>
            </div>
            <div className="accordion-item">
              <h2 className="accordion-header" id="headingSix">
                <button className="accordion-button  text-uppercase fw-bold collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#collapseSix" aria-expanded="false" aria-controls="collapseSix">
                  Work Type wise Employee Salary
                </button>
              </h2>
              <div id="collapseSix" className="accordion-collapse collapse show" aria-labelledby="headingSix" data-bs-parent="#accordionExample">
                <div className="accordion-body">
                  <div className='card'>
                    <div className='card-body'>
                      <div className='row'>
                        <div className='col-6'>
                          <div className="d-flex justify-content-between">
                            <div className="exp-header p-2 text-uppercase fw-bold">work type</div>
                            <div className="p-2 text-uppercase fw-bold">Qty</div>
                            <div className="amt-header p-2 text-uppercase fw-bold">Amount</div>
                          </div>
                          {
                            workTypeSumAmount?.map((res, index) => {
                              return <div key={index} className="d-flex justify-content-between">
                                <div className="exp-header p-2 text-uppercase">{res.workType}</div>
                                <div className="p-2">{res.qty}</div>
                                <div className="amt-header p-2">{common.printDecimal(res.amount)}</div>
                              </div>
                            })
                          }

                        </div>
                        <div className='col-6'>
                          <SalehPieChart h={250} w={300} data={getExpensePieData()}></SalehPieChart>
                        </div>
                      </div>
                    </div>
                  </div></div>
              </div>
            </div>
            <div className="accordion-item">
              <h2 className="accordion-header" id="headingTen">
                <button className="accordion-button  text-uppercase fw-bold collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#collapseTen" aria-expanded="false" aria-controls="collapseTen">
                  Expense Wise Sum
                </button>
              </h2>
              <div id="collapseTen" className="accordion-collapse collapse show" aria-labelledby="headingSix" data-bs-parent="#accordionExample">
                <div className="accordion-body">
                  <div className='card'>
                    <div className='card-body'>
                      <div className='row'>
                        <div className='col-6'>
                          <div className="d-flex justify-content-between">
                            {/* <div className="exp-header p-2 text-uppercase fw-bold">Expense Type</div> */}
                            <div className="p-2 text-uppercase fw-bold">Expense Name</div>
                            <div className="amt-header p-2 text-uppercase fw-bold">Amount</div>
                          </div>
                          {
                            expenseHeadWiseSum?.map((res, index) => {
                              return <div key={index} className="d-flex justify-content-between">
                                {/* <div className="exp-header p-2 text-uppercase">{res.expenseType}</div> */}
                                <div className="p-2">{res.expenseName}</div>
                                <div className="amt-header p-2">{common.printDecimal(res.amount)}</div>
                              </div>
                            })
                          }

                        </div>
                        <div className='col-6'>
                          <SalehPieChart h={250} w={300} data={getExpenseHeadWiseSumPieData()}></SalehPieChart>
                        </div>
                      </div>
                    </div>
                  </div></div>
              </div>
            </div>
            <div className="accordion-item">
              <h2 className="accordion-header" id="headingSeven">
                <button className="accordion-button  text-uppercase fw-bold collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#collapseSeven" aria-expanded="false" aria-controls="collapseSeven">
                  Grand Amount
                </button>
              </h2>
              <div id="collapseSeven" className="accordion-collapse collapse show" aria-labelledby="headingSeven" data-bs-parent="#accordionExample">
                <div className="accordion-body">
                  <div className='card'>
                    <div className='card-body'>
                      <div className='row'>
                        <div className='col-6'>
                          <div className="d-flex justify-content-between">
                            <div className="p-2 text-uppercase fw-bold">grand cash amount</div>
                            <div className="p-2">{common.printDecimal(accountData?.totalAdvanceCashAmount + accountData?.totalDeliveryCashAmount + accountData?.totalBookingCashAmount)}</div>
                          </div>
                          <div className="d-flex justify-content-between">
                            <div className="p-2 text-uppercase fw-bold">grand visa amount</div>
                            <div className="p-2">{common.printDecimal(accountData?.totalAdvanceVisaAmount + accountData?.totalDeliveryVisaAmount + accountData?.totalBookingVisaAmount)}</div>
                          </div>
                          <div className="d-flex justify-content-between">
                            <div className="p-2 text-uppercase fw-bold">grand amount</div>
                            <div className="p-2">{common.printDecimal(accountData?.totalAdvanceAmount + accountData?.totalDeliveryAmount + accountData?.totalBookingAmount)}</div>
                          </div>
                        </div>
                        <div className='col-6'>
                          <SalehPieChart h={250} w={300} data={pieGrandAmount}></SalehPieChart>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="accordion-item">
              <h2 className="accordion-header" id="headingEight">
                <button className="accordion-button  text-uppercase fw-bold collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#collapseEight" aria-expanded="false" aria-controls="collapseEight">
                  Grand Expense Amount
                </button>
              </h2>
              <div id="collapseEight" className="accordion-collapse collapse show" aria-labelledby="headingEight" data-bs-parent="#accordionExample">
                <div className="accordion-body">
                  <div className='card'>
                    <div className='card-body'>
                      <div className='row'>
                        <div className='col-6'>
                          <div className="d-flex justify-content-between">
                            <div className="p-2 text-uppercase fw-bold">grand salary amount</div>
                            <div className="p-2">0.00</div>
                          </div>
                          <div className="d-flex justify-content-between">
                            <div className="p-2 text-uppercase fw-bold">grand cash expense</div>
                            <div className="p-2">0.00</div>
                          </div>
                          <div className="d-flex justify-content-between">
                            <div className="p-2 text-uppercase fw-bold">grand cheque expense</div>
                            <div className="p-2">0.00</div>
                          </div>
                        </div>
                        <div className='col-6'>
                          <SalehPieChart h={250} w={300} data={pieGrandExpense}></SalehPieChart>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className='card-footer'>
          <div className='row'>
            <div className='col-12 text-end'>
              <div className="d-flex justify-content-end">
                <div className="p-2">
                  <div className='d-none'>
                    <PrintAccountSummaryReport ref={printAccountSummaryReportRef} props={printData}></PrintAccountSummaryReport>
                  </div>
                  <ButtonBox className="btn-sm" onClickHandler={printAccountSummaryReportHandler} type="print" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div id="summaryReportModel" className="modal fade in" tabIndex="-1" role="dialog" aria-labelledby="myModalLabel" aria-hidden="true">
        <div className="modal-dialog modal-xl">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title">Summary Report</h5>
              <button type="button" className="btn-close" data-bs-dismiss="modal" aria-hidden="true"></button>
            </div>
            <div className="modal-body">
              <PrintAccountSummaryReport ref={printAccountSummaryReportRef} props={printData}></PrintAccountSummaryReport>
            </div>
            <div className="modal-footer">
              <ButtonBox type="close" modelDismiss={true}/>
              <ButtonBox className="btn-sm" onClickHandler={printAccountSummaryReportHandler} type="print" />
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
