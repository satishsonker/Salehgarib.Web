import React, { useState, useRef } from 'react'
import { Api } from '../../apis/Api';
import { apiUrls } from '../../apis/ApiUrls';
import { common } from '../../utils/common'
import Breadcrumb from '../common/Breadcrumb'
import ButtonBox from '../common/ButtonBox';
import Inputbox from '../common/Inputbox';
import { useReactToPrint } from 'react-to-print';
import { PrintDailyStatusReport } from '../print/admin/account/PrintDailyStatusReport';

export default function DailyStatusReport() {
    const [statusDate, setStatusDate] = useState(common.getHtmlDate(new Date()));
    const [statusData, setStatusData] = useState([]);
    const VAT = parseFloat(process.env.REACT_APP_VAT);
    const getStatusData = () => {
        Api.Get(apiUrls.reportController.getDailyStatusReport + statusDate)
            .then(res => {
                setStatusData(res.data);
            })
    }
    const printStatusReportRef = useRef();
    const printStatusHandler = useReactToPrint({
        content: () => printStatusReportRef.current,
    });

    const breadcrumbOption = {
        title: 'Daily Status Report',
        items: [
            {
                title: "Report",
                icon: "bi bi-journal-bookmark-fill",
                isActive: false,
            },
            {
                title: "Daily Status Report",
                icon: "bi bi-file-bar-graph",
                isActive: false,
            }
        ]
    }
    const btnList = [
        {
            type: 'Go',
            onClickHandler: getStatusData,
            className: 'btn-sm'
        },
        {
            type: 'Print',
            onClickHandler: printStatusHandler,
            className: 'btn-sm'
        }
    ]
    const getTotalSalesAmount = () => {
        return statusData?.customerAccountStatements?.reduce((sum, ele) => {
            return sum + ele.credit;
        }, 0)
    }
    const headers = ["Sr.", "Order No.", "Amount","Delivered Qty", "Paymant", "Balance", "Payment Mode", "Paid For"];
    return (
        <>
            <Breadcrumb option={breadcrumbOption}></Breadcrumb>
            <div className="d-flex justify-content-between">
                <h6 className="mb-0 text-uppercase">Daily Status Report</h6>
                <div>
                    <div className='d-flex'>
                        <div><Inputbox title="From Date" max={common.getHtmlDate(new Date())} onChangeHandler={(e) => { setStatusDate(e.target.value) }} name="fromDate" value={statusDate} className="form-control-sm" showLabel={false} type="date"></Inputbox></div>
                        <div>
                            <ButtonBox btnList={btnList} />
                        </div>
                    </div>
                </div>
            </div>
            <hr />
            <div className='card'>
                <div className='card-body'>
                    <div className="table-responsive">
                        <table className='table table-bordered table-striped'>
                            <thead>
                                <tr>
                                    {headers?.map((ele, index) => {
                                      return  <th key={index} className='text-center'>{ele}</th>
                                    })}
                                </tr>
                            </thead>
                            <tbody>
                                {statusData?.customerAccountStatements?.map((res, index) => {
                                    return <tr style={{ fontSize: '12px' }}>
                                        <td className='text-center' style={{ padding: '5px' }}>{index + 1}</td>
                                        <td className='text-center' style={{ padding: '5px' }}>{res.order.orderNo}</td>
                                        <td className='text-center' style={{ padding: '5px' }}>{common.printDecimal(res.isFirstAdvance?res.order.totalAmount:((res.balance??0)+(res.credit??0)))}</td>
                                        <td className='text-center' style={{ padding: '5px' }}>{res.deliveredQty}</td>
                                        <td className='text-center' style={{ padding: '5px' }}>{common.printDecimal(res.credit)}</td>
                                        <td className='text-center' style={{ padding: '5px' }}>{common.printDecimal(res.balance)}</td>
                                        <td className='text-center' style={{ padding: '5px' }}>{res.paymentMode}</td>
                                        <td className='text-center' style={{ padding: '5px' }}>{res?.reason?.toLowerCase()==="advancedpaid" ?"Advance":"Delivery"}</td>
                                    </tr>
                                })}
                                  <tr style={{ fontSize: '12px' }}>
                                    <td colSpan={headers.length-1} className='text-end'>Total Booking Qty</td>
                                    <td className='text-end'>{statusData?.orders?.reduce((sum, ele) => {
                                        return sum + ele?.qty;
                                    }, 0)}</td>
                                </tr>
                                <tr style={{ fontSize: '12px' }}>
                                    <td colSpan={headers.length-1} className='text-end'>Total Booking Amount</td>
                                    <td className='text-end'>{common.printDecimal(statusData?.orders?.reduce((sum, ele) => {
                                        return sum + ele.totalAmount;
                                    }, 0))}</td>
                                </tr>
                                <tr style={{ fontSize: '12px' }}>
                                    <td colSpan={headers.length-1} className='text-end'>Total Booking Advance Cash</td>
                                    <td className='text-end'>{common.printDecimal(statusData?.customerAccountStatements?.reduce((sum, ele) => {
                                        if (ele.paymentMode?.toLowerCase() === 'cash' && ele.reason === "AdvancedPaid")
                                            return sum + ele.credit;
                                        else
                                            return sum;
                                    }, 0))}</td>
                                </tr>
                                <tr style={{ fontSize: '12px' }}>
                                    <td colSpan={headers.length-1} className='text-end'>Total Booking Advance VISA</td>
                                    <td className='text-end'>{common.printDecimal(statusData?.customerAccountStatements?.reduce((sum, ele) => {
                                        if (ele.paymentMode?.toLowerCase() === 'visa' && ele.reason === "AdvancedPaid")
                                            return sum + ele?.credit;
                                        else
                                            return sum;
                                    }, 0))}</td>
                                </tr>
                                <tr style={{ fontSize: '12px' }}>
                                    <td colSpan={headers.length-1} className='text-end'>Total Delivered Qty</td>
                                    <td className='text-end'>{statusData?.customerAccountStatements?.reduce((sum, ele) => {
                                        return sum + ele?.deliveredQty;
                                    }, 0)}</td>
                                </tr>
                                <tr style={{ fontSize: '12px' }}>
                                    <td colSpan={headers.length-1} className='text-end'>Total Delivery Cash</td>
                                    <td className='text-end'>{common.printDecimal(statusData?.customerAccountStatements?.reduce((sum, ele) => {
                                        if (ele.paymentMode?.toLowerCase() === 'cash' && ele.reason?.toLowerCase() === 'paymentreceived')
                                            return sum + ele.credit;
                                        else
                                            return sum;
                                    }, 0))}</td>
                                </tr>
                                <tr style={{ fontSize: '12px' }}>
                                    <td colSpan={headers.length-1} className='text-end'>Total Delivery VISA</td>
                                    <td className='text-end'>{common.printDecimal(statusData?.customerAccountStatements?.reduce((sum, ele) => {
                                        if (ele.paymentMode?.toLowerCase() === 'visa' && ele.reason?.toLowerCase() === 'paymentreceived')
                                            return sum + ele.credit;
                                        else
                                            return sum;
                                    }, 0))}</td>
                                </tr>
                                <tr style={{ fontSize: '12px' }}>
                                    <td colSpan={headers.length-1} className='text-end'>Total Net Sale Amount</td>
                                    <td className='text-end'>
                                        {
                                            common.printDecimal(getTotalSalesAmount())
                                        }
                                    </td>
                                </tr>
                                <tr style={{ fontSize: '12px' }}>
                                    <td colSpan={headers.length-1} className='text-end'>Total Vat Tax {VAT}%</td>
                                    <td className='text-end'>
                                        {
                                            common.printDecimal(getTotalSalesAmount() - common.calculatePercent(getTotalSalesAmount(), 95))
                                        }
                                    </td>
                                </tr>
                                <tr style={{ fontSize: '12px' }}>
                                    <td colSpan={headers.length-1} className='text-end'>Total Expenses</td>
                                    <td className='text-end'>
                                        {
                                            common.printDecimal(statusData.expenseAmount)
                                        }
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
            <div className='d-none'>
                <PrintDailyStatusReport ref={printStatusReportRef} props={statusData} />
            </div>
        </>
    )
}
