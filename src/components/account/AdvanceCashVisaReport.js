import React, { useState, useRef } from 'react'
import { Api } from '../../apis/Api'
import { apiUrls } from '../../apis/ApiUrls'
import { common } from '../../utils/common'
import Breadcrumb from '../common/Breadcrumb'
import ButtonBox from '../common/ButtonBox'
import Inputbox from '../common/Inputbox'
import ReactToPrint, { useReactToPrint } from 'react-to-print';
import PrintAdvanceCashVisaReport from '../print/admin/account/PrintAdvanceCashVisaReport'

export default function AdvanceCashVisaReport() {
    const printRef=useRef();
    const VAT = parseFloat(process.env.REACT_APP_VAT);
    const CURR_DATE = new Date();
    const [billingData, setBillingData] = useState([])
    const [filterData, setFilterData] = useState({
        fromDate: common.getHtmlDate(common.getFirstDateOfMonth(CURR_DATE.getMonth(), CURR_DATE.getFullYear())),
        toDate: common.getHtmlDate(common.getLastDateOfMonth(CURR_DATE.getMonth() + 1, CURR_DATE.getFullYear())),
        paymentType: "Advance",
        paymentMode: "cash"
    });
    const textChangeHandler = (e) => {
        var { name, type, value } = e.target;
        debugger;
        if (type === 'radio') {
            setFilterData({ ...filterData, ['paymentMode']: value });
        } else {
            setFilterData({ ...filterData, [name]: value });
        }
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
    return (
        <>
            <Breadcrumb option={breadcrumbOption}></Breadcrumb>
            <div className="d-flex justify-content-between">
                <h6 className="mb-0 text-uppercase">{`${filterData.paymentType} ${filterData.paymentMode} Report`}</h6>
                <div>
                    <div className='d-flex'>
                        <div className='pt-2 mx-2'>
                            <div className="form-check form-check-inline">
                                <input className="form-check-input" onClick={e => textChangeHandler(e)} checked={filterData.paymentMode === "Cash" ? "checked" : ""} type="radio" name="inlineRadioOptions" id="inlineRadio1" value="Cash" />
                                <label className="form-check-label" for="inlineRadio1">Cash</label>
                            </div>
                            <div className="form-check form-check-inline">
                                <input className="form-check-input" type="radio" onClick={e => textChangeHandler(e)} name="inlineRadioOptions" id="inlineRadio2" value="Visa" checked={filterData.paymentMode === "Visa" ? "checked" : ""} />
                                <label className="form-check-label" for="inlineRadio2">Visa</label>
                            </div>
                        </div>
                        <div className='mx-2'><Inputbox title="From Date" max={common.getHtmlDate(new Date())} onChangeHandler={textChangeHandler} name="fromDate" value={filterData.fromDate} className="form-control-sm" showLabel={false} type="date"></Inputbox></div>
                        <div><Inputbox title="To Date" max={common.getHtmlDate(common.getLastDateOfMonth(CURR_DATE.getMonth() + 1, CURR_DATE.getFullYear()))} onChangeHandler={textChangeHandler} name="toDate" value={filterData.toDate} className="form-control-sm" showLabel={false} type="date"></Inputbox></div>

                        <div className='mx-2'>
                            <ButtonBox type="go" className="btn-sm" onClickHandler={getBillingData} />
                            <ReactToPrint
                                trigger={() => {
                                    return <button className='btn btn-sm btn-success mx-2'><i className='bi bi-printer'></i> Print</button>
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
                    <table className='table table-bordered' style={{ fontSize: '12px' }}>
                        <thead>
                            <tr>
                                <th className='text-center'>Sr.</th>
                                <th className='text-center'>Order No</th>
                                <th className='text-center'>Payment Date</th>
                                <th className='text-center'>{filterData.paymentType} Amount</th>
                                <th className='text-center'>Vat {VAT}%</th>
                                <th className='text-center'>Total Amount</th>
                                <th className='text-center'>Payment Mode</th>
                            </tr>
                        </thead>
                        <tbody>
                            {
                                billingData?.map((ele, index) => {
                                    return <tr key={index}>
                                        <td className='text-center'>{index + 1}</td>
                                        <td className='text-center'>{ele.order?.orderNo}</td>
                                        <td className='text-center'>{common.getHtmlDate(ele.paymentDate, 'ddmmyyyy')}</td>
                                        <td className='text-end'>{common.printDecimal(common.calculatePercent(ele.credit, 95))}</td>
                                        <td className='text-end'>{common.printDecimal(common.calculatePercent(ele.credit, 5))}</td>
                                        <td className='text-end'>{common.printDecimal(ele.credit)}</td>
                                        <td className='text-uppercase text-center'>{ele.paymentMode}</td>
                                    </tr>
                                })
                            }
                        </tbody>
                        <tfoot>
                            <tr>
                                <td className='text-end fw-bold' colSpan={3}>Total</td>
                                <td className='text-end fw-bold'>{common.printDecimal(billingData?.reduce((sum, ele) => {
                                    return sum += common.calculatePercent(ele.credit, 95)
                                }, 0))}</td>
                                <td className='text-end fw-bold'>{common.printDecimal(billingData?.reduce((sum, ele) => {
                                    return sum += common.calculatePercent(ele.credit, 5)
                                }, 0))}</td>
                                <td className='text-end fw-bold'>{common.printDecimal(billingData?.reduce((sum, ele) => {
                                    return sum += ele.credit
                                }, 0))}</td>
                            </tr>
                        </tfoot>
                    </table>
                </div>
            </div>
            <div className='d-none'>
                <PrintAdvanceCashVisaReport data={billingData} filterData={filterData} printRef={printRef} />
            </div>
        </>
    )
}
