import React, { useState,useRef } from 'react'
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
    const VAT = parseInt(process.env.REACT_APP_VAT);
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
    const getTotalSalesAmount=()=>{
    return    statusData?.orders?.reduce((sum, ele) => {
            return sum + ele.advanceAmount;
        }, 0) 
        + 
        statusData?.customerAccountStatements?.reduce((sum, ele) => {
            if (ele.reason?.toLowerCase() === 'paymentreceived')
                return sum + ele.credit;
            else
                return sum;
        }, 0)
    }
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
                    <table className='table table-bordered table-striped'>
                        <thead>
                            <tr>
                                <th className='text-center'>Sr.</th>
                                <th className='text-center'>Order No.</th>
                                <th className='text-center'>Amount</th>
                                <th className='text-center'>Advance</th>
                                <th className='text-center'>Vat Tax</th>
                                <th className='text-center'>Balance</th>
                                <th className='text-center'>Payment Mode</th>
                            </tr>
                        </thead>
                        <tbody>
                            {statusData?.orders?.map((res, index) => {
                                return <tr style={{ fontSize: '12px' }}>
                                    <td className='text-center' style={{ padding: '5px' }}>{index + 1}</td>
                                    <td className='text-center' style={{ padding: '5px' }}>{res.orderNo}</td>
                                    <td className='text-center' style={{ padding: '5px' }}>{common.printDecimal(res.totalAmount)}</td>
                                    <td className='text-center' style={{ padding: '5px' }}>{common.printDecimal(res.advanceAmount)}</td>
                                    <td className='text-center' style={{ padding: '5px' }}>{common.printDecimal(common.calculateVAT(res.advanceAmount, VAT).vatAmount)}</td>
                                    <td className='text-center' style={{ padding: '5px' }}>{common.printDecimal(res.balanceAmount)}</td>
                                    <td className='text-center' style={{ padding: '5px' }}>{res.paymentMode}</td>
                                </tr>
                            })}
                            <tr style={{ fontSize: '12px' }}>
                                <td colSpan={6}>Total Booking Amount</td>
                                <td className='text-end'>{common.printDecimal(statusData?.orders?.reduce((sum, ele) => {
                                    return sum + ele.totalAmount;
                                }, 0))}</td>
                            </tr>
                            <tr style={{ fontSize: '12px' }}>
                                <td colSpan={6}>Total Booking Advance Cash</td>
                                <td className='text-end'>{common.printDecimal(statusData?.orders?.reduce((sum, ele) => {
                                    if (ele.paymentMode?.toLowerCase() === 'cash')
                                        return sum + ele.advanceAmount;
                                    else
                                        return sum;
                                }, 0))}</td>
                            </tr>
                            <tr style={{ fontSize: '12px' }}>
                                <td colSpan={6}>Total Booking Advance VISA</td>
                                <td className='text-end'>{common.printDecimal(statusData?.orders?.reduce((sum, ele) => {
                                    if (ele.paymentMode?.toLowerCase() === 'visa')
                                        return sum + ele.advanceAmount;
                                    else
                                        return sum;
                                }, 0))}</td>
                            </tr>
                            <tr style={{ fontSize: '12px' }}>
                                <td colSpan={6}>Total Delivery Cash</td>
                                <td className='text-end'>{common.printDecimal(statusData?.customerAccountStatements?.reduce((sum, ele) => {
                                    if (ele.paymentMode?.toLowerCase() === 'cash' && ele.reason?.toLowerCase() === 'paymentreceived')
                                        return sum + ele.credit;
                                    else
                                        return sum;
                                }, 0))}</td>
                            </tr>
                            <tr style={{ fontSize: '12px' }}>
                                <td colSpan={6}>Total Delivery VISA</td>
                                <td className='text-end'>{common.printDecimal(statusData?.customerAccountStatements?.reduce((sum, ele) => {
                                    if (ele.paymentMode?.toLowerCase() === 'visa' && ele.reason?.toLowerCase() === 'paymentreceived')
                                        return sum + ele.credit;
                                    else
                                        return sum;
                                }, 0))}</td>
                            </tr>
                            <tr style={{ fontSize: '12px' }}>
                                <td colSpan={6}>Total Net Sale Amount</td>
                                <td className='text-end'>
                                    {
                                    common.printDecimal(getTotalSalesAmount())
                                    }
                                </td>
                            </tr>
                            <tr style={{ fontSize: '12px' }}>
                                <td colSpan={6}>Total Vat Tax {VAT}%</td>
                                <td className='text-end'>
                                    {
                                    common.printDecimal(getTotalSalesAmount()-common.calculatePercent(getTotalSalesAmount(),95))
                                    }
                                </td>
                            </tr>
                            <tr style={{ fontSize: '12px' }}>
                                <td colSpan={6}>Total Expenses</td>
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
            <div className='d-none'>
                <PrintDailyStatusReport ref={printStatusReportRef} props={statusData}/>
            </div>
        </>
    )
}
