import React, { useState, useRef,useEffect } from 'react'
import { Api } from '../../apis/Api'
import { apiUrls } from '../../apis/ApiUrls'
import { common } from '../../utils/common'
import Breadcrumb from '../common/Breadcrumb'
import ButtonBox from '../common/ButtonBox'
import Inputbox from '../common/Inputbox'
import ReactToPrint from 'react-to-print';
import PrintDeliveryCashVisaReport from '../print/admin/account/PrintDeliveryCashVisaReport'
import Label from '../common/Label'
import Dropdown from '../common/Dropdown'
import ErrorLabel from '../common/ErrorLabel'
import { toast } from 'react-toastify'
import { toastMessage } from '../../constants/ConstantValues'
import { validationMessage } from '../../constants/validationMessage'
import { headerFormat } from '../../utils/tableHeaderFormat'

export default function DeliveryCashVisaReport() {
  const printRef = useRef();
  const [selectedPayment, setSelectedPayment] = useState({});
  const [paymentModeList, setPaymentModeList] = useState([]);
  const CURR_DATE = new Date();
  const [errors, setErrors] = useState({})
  const [billingData, setBillingData] = useState([])
  const [filterData, setFilterData] = useState({
    fromDate: common.getHtmlDate(common.getFirstDateOfMonth(CURR_DATE.getMonth(), CURR_DATE.getFullYear())),
    toDate: common.getHtmlDate(common.getLastDateOfMonth(CURR_DATE.getMonth() + 1, CURR_DATE.getFullYear())),
    paymentType: "Delivery",
    paymentMode: "cash"
  });
  const textChangeHandler = (e) => {
    var { name, type, value } = e.target;
    if (type === 'radio') {
      setFilterData({ ...filterData, ['paymentMode']: value });
    } else {
      setFilterData({ ...filterData, [name]: value });
    }
    setBillingData([])
  }
  const breadcrumbOption = {
    title: `Report`,
    items: [
      {
        title: "Report",
        icon: "bi bi-journal-bookmark-fill",
        isActive: false,
      },
      {
        title: `${filterData.paymentType} ${filterData.paymentMode} Report`,
        icon: "bi bi-file-bar-graph",
        isActive: false,
      }
    ]
  }

  const getBillingData = () => {
    Api.Get(apiUrls.reportController.getPaymentSummaryReport + `?fromDate=${filterData.fromDate}&toDate=${filterData.toDate}&paymentType=${filterData.paymentType}&paymentMode=${filterData.paymentMode}`)
      .then(res => {
        setBillingData(res.data);
      });
  }

  useEffect(() => {
    var apiList = [];
    apiList.push(Api.Get(apiUrls.masterDataController.getByMasterDataType + `?masterdatatype=payment_mode`));
    Api.MultiCall(apiList)
        .then(res => {
            setPaymentModeList(res[0].data);
        });
}, []);

  const grandTotal = billingData?.reduce((sum, ele) => {
    return sum += ele.balance+ele.credit
  }, 0);
  const grandAdvance = billingData?.reduce((sum, ele) => {
    return sum += ele.credit
  }, 0);
  const header =headerFormat.DeliveryCashVisaReport; 

  const selectedPaymentHandler = (ele) => {
    setSelectedPayment({ ...ele });
  }
  const handleOrderEdit = () => {
    const formError = validateEditData();
    if (Object.keys(formError).length > 0) {
      setErrors(formError);
      return
    }
    Api.Post(apiUrls.orderController.updateCustomerStatement, selectedPayment)
      .then(res => {
        if (res.data > 0) {
          common.closePopup('editOrderPopup');
          toast.success(toastMessage.updateSuccess);
        }
        else {
          toast.warn(toastMessage.updateError);
        }
      });
  }
  const handleEditChange = (e) => {
    var { name, value } = e.target;
    if(name==='credit')
    {
      value=parseFloat(value);
    }
    setSelectedPayment({ ...selectedPayment, [name]: value });
  }

  const validateEditData = () => {
    const { paymentDate,credit, paymentMode } = selectedPayment;
    const newError = {};
    if (!paymentDate || paymentDate === "") newError.paymentDate = validationMessage.paymentDateRequired;
    if (new Date(paymentDate)>new Date()) newError.paymentDate = validationMessage.futureDateIsNotAllowed;
    if (!paymentMode || paymentMode === "" || paymentMode === "0") newError.paymentMode = validationMessage.paymentModeRequired;
    if (!credit || credit<0) newError.contact1 = validationMessage.paidAmountRequired;
    return newError;
  }
  return (
    <>
      <Breadcrumb option={breadcrumbOption}></Breadcrumb>
      <div className="d-flex justify-content-between">
        <h6 className="mb-0 text-uppercase">{`${filterData.paymentType} ${filterData.paymentMode} Report`}</h6>
        <div>
          <div className='d-flex'>
            <div className='pt-2 mx-2'>
              <div className="form-check form-check-inline">
                <input className="form-check-input" onChange={e => textChangeHandler(e)} checked={filterData.paymentMode === "Cash" ? "checked" : ""} type="radio" name="inlineRadioOptions" id="inlineRadio1" value="Cash" />
                <label className="form-check-label" htmlFor="inlineRadio1">Cash</label>
              </div>
              <div className="form-check form-check-inline">
                <input className="form-check-input" type="radio" onChange={e => textChangeHandler(e)} name="inlineRadioOptions" id="inlineRadio2" value="Visa" checked={filterData.paymentMode === "Visa" ? "checked" : ""} />
                <label className="form-check-label" htmlFor="inlineRadio2">Visa</label>
              </div>
              <div className="form-check form-check-inline">
                <input className="form-check-input" onChange={e => textChangeHandler(e)} checked={filterData.paymentMode === "All" ? "checked" : ""} type="radio" name="inlineRadioOptions" id="inlineRadio1" value="All" />
                <label className="form-check-label" htmlFor="inlineRadio1">All</label>
              </div>
            </div>
            <div className='mx-2'><Inputbox title="From Date" max={common.getHtmlDate(new Date())} onChangeHandler={textChangeHandler} name="fromDate" value={filterData.fromDate} className="form-control-sm" showLabel={false} type="date"></Inputbox></div>
            <div><Inputbox title="To Date" max={common.getHtmlDate(common.getLastDateOfMonth(CURR_DATE.getMonth() + 1, CURR_DATE.getFullYear()))} onChangeHandler={textChangeHandler} name="toDate" value={filterData.toDate} className="form-control-sm" showLabel={false} type="date"></Inputbox></div>

            <div className='mx-2'>
              <ButtonBox type="go" className="btn-sm" onClickHandler={getBillingData} />
              <ReactToPrint
                trigger={() => {
                  return <button className='btn btn-sm btn-warning mx-2'><i className='bi bi-printer'></i> Print</button>
                }}
                content={(el) => (printRef.current)}
              />
            </div>
          </div>
        </div>
      </div>
      <hr />
      <div className='card'>
        <div className='card-body'>
          <div className="table-responsive">
            <table className='table table-bordered fixTableHead' style={{ fontSize: '12px' }}>
              <thead>
                <tr>
                  {
                    header?.map((res, index) => {
                      return <th key={index} className='text-center'>{res}</th>
                    })
                  }
                </tr>
              </thead>
              <tbody>
                {billingData.length === 0 && <tr><td colSpan={11} className="text-center">No Record Found</td> </tr>}
                {
                  billingData.length > 0 && billingData?.map((ele, index) => {
                    return <tr key={index}>
                      <td className='text-center'><div style={{ cursor: "pointer" }} onClick={e => selectedPaymentHandler(ele)} title="Edit Order" className="text-warning" data-bs-toggle="modal" data-bs-target={"#editOrderPopup"}><i className="bi bi-pencil-fill"></i></div></td>
                      <td className='text-center'>{index + 1}</td>   
                      <td className='text-center'>{ele.order?.orderNo}</td>
                      <td className='text-center'>{ele.deliveredQty}</td>
                      <td className='text-start text-uppercase'>{ele.order?.customerName}</td>
                      <td className='text-start text-uppercase'>{ele.order?.contact1}</td>
                   
                      <td className='text-center'>{common.getHtmlDate(ele.order?.orderDeliveryDate, 'ddmmyyyy')}</td>
                      <td className='text-end'>{common.printDecimal(ele.balance+ele.credit)}</td>
                      <td className='text-end' title={ele.reason}>{common.printDecimal(ele.credit)}</td>
                      <td className='text-end'>{common.getHtmlDate(ele.paymentDate, 'ddmmyyyy')}</td>
                      <td className='text-end'>{common.printDecimal(ele.balance)}</td>
                      <td className='text-uppercase text-center'>{ele.paymentMode}</td>
                    </tr>
                  })
                }
              </tbody>
              <tfoot>
                <tr>
                  <td className='text-end fw-bold' colSpan={header.length-5}>Total</td>
                  <td className='text-end fw-bold'>{common.printDecimal(grandTotal)}</td>
                  <td className='text-end fw-bold'>{common.printDecimal(grandAdvance)}</td>
                  <td></td>
                  <td className='text-end fw-bold'>{common.printDecimal(billingData?.reduce((sum, ele) => {
                    return sum += ele.balance
                  }, 0))}</td>
                </tr>
              </tfoot>
            </table>
          </div>
          <div className='row'>
            <div className="d-flex justify-content-end col-12 mt-2">
              <ul className="list-group" style={{ width: '300px' }}>
                <li className="list-group-item d-flex justify-content-between align-items-center pr-0">
                  Total Delivered Qty
                  <span className="badge badge-primary" style={{ color: 'black' }}>{billingData?.reduce((sum, ele) => {
                    return sum += ele?.deliveredQty;
                  }, 0)}</span>
                </li>
                <li className="list-group-item d-flex justify-content-between align-items-center">
                  Total Delivery Amount
                  <span className="badge badge-primary" style={{ color: 'black' }}>{common.printDecimal(billingData?.reduce((sum, ele) => {
                    return sum += ele?.credit;
                  }, 0))}</span>
                </li>
                <li className="list-group-item d-flex justify-content-between align-items-center">
                  Total Delivery In Cash
                  <span className="badge badge-primary" style={{ color: 'black' }}>{common.printDecimal(billingData?.reduce((sum, ele) => {
                    if (ele.paymentMode?.toLowerCase() === 'cash')
                      return sum += ele?.credit;
                    else
                      return sum;
                  }, 0))}</span>
                </li>
                <li className="list-group-item d-flex justify-content-between align-items-center">
                  Total Delivery In VISA
                  <span className="badge badge-primary" style={{ color: 'black' }}>{common.printDecimal(billingData?.reduce((sum, ele) => {
                    if (ele.paymentMode?.toLowerCase() === 'visa')
                      return sum += ele?.credit;
                    else
                      return sum;
                  }, 0))}</span>
                </li>
                <li className="list-group-item d-flex justify-content-between align-items-center">
                  Grand Total
                  <span className="badge badge-primary" style={{ color: 'black' }}>{common.printDecimal(billingData?.reduce((sum, ele) => {
                    return sum += ele?.credit;
                  }, 0))}</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
      <div className='d-none'>
        <PrintDeliveryCashVisaReport data={billingData} filterData={filterData} printRef={printRef} />
      </div>
      <div className="modal fade" id="editOrderPopup"  data-bs-keyboard="false" tabIndex="-1" aria-labelledby="editOrderPopupLabel" aria-hidden="true">
        <div className="modal-dialog">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title" id="editOrderPopupLabel">Edit Order No. {selectedPayment?.order?.orderNo}</h5>
              <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            <div className="modal-body">
              <div className='row'>
                <div className='col-12'>
                  <Inputbox errorMessage={errors.paymentDate} max={common.getHtmlDate(CURR_DATE)} isRequired={true} type="date" labelText="Payment Date" onChangeHandler={handleEditChange} value={common.getHtmlDate(selectedPayment.paymentDate)} name="paymentDate" className="form-control-sm"></Inputbox>
                </div>
                {/* <div className='col-12'>
                  <Inputbox errorMessage={errors.credit} isRequired={true} type="number" labelText="Payment Amount" onChangeHandler={handleEditChange} value={selectedPayment.credit} name="credit" className="form-control-sm"></Inputbox>
                </div> */}
                <div className='col-12'>
                  <Label text="Payment Mode" fontSize='12px' isRequired={true} />
                  <Dropdown data={paymentModeList} elementKey="value" name="paymentMode" value={selectedPayment.paymentMode} onChange={handleEditChange} />
                  <ErrorLabel message={errors.paymentMode} />
                </div>
              </div>
            </div>
            <div className="modal-footer">
              <ButtonBox type="save" onClickHandler={handleOrderEdit} className="btn-sm" />
              <ButtonBox type="cancel" modelDismiss={true} className="btn-sm" />
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
