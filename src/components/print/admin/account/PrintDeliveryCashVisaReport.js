import React from 'react'
import { common } from '../../../../utils/common'
import { headerFormat } from '../../../../utils/tableHeaderFormat';
import InvoiceHead from '../../../common/InvoiceHead'

export default function PrintDeliveryCashVisaReport({ data, filterData, printRef, duplicateCounts, uniqueBookingSum, uniqueQty,paymentModeList }) {
    const VAT = parseFloat(process.env.REACT_APP_VAT);
    const grandTotal = data?.reduce((sum, ele) => {
        return sum += ele.order.totalAmount
    }, 0);
    const grandAdvance = data?.reduce((sum, ele) => {
        return sum += ele.credit
    }, 0);
    const header = headerFormat.DeliveryCashVisaReportPrint;
    return (
        <>
            <div className='card' ref={printRef}>
                <div className='card-body'>
                    <InvoiceHead receiptType={filterData.paymentType + ' ' + filterData.paymentMode + " Report"} />
                    <hr />
                    <div className='row'>
                        <div className='col-12 text-center fw-bold my-2'>
                            Report Date : {common.getHtmlDate(filterData.fromDate, 'ddmmyyyy')} To {common.getHtmlDate(filterData.toDate, 'ddmmyyyy')}
                        </div>
                        <div className='col-12'>
                            <table className='table table-bordered' style={{ fontSize: '11px' }}>
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
                                    {data.length === 0 && <tr><td colSpan={11} className="text-center">No Record Found</td> </tr>}
                                    {
                                        data.length > 0 && data?.map((ele, index) => {
                                            const rowSpan = duplicateCounts[ele.order?.orderNo].count || 1;
                                             const balance = duplicateCounts[ele.order?.orderNo].balance || 1;
                                            const isFirstOccurrence =
                                                index === data.findIndex(o => o.order?.orderNo === ele.order?.orderNo);
                                            return <tr key={index}>
                                                <td className='text-center'>{index + 1}</td>
                                                {isFirstOccurrence && (
                                                    <>
                                                        <td className='text-center' rowSpan={rowSpan}>{ele.order?.orderNo}</td>
                                                    </>
                                                )}
                                                <td className='text-center'>{ele.deliveredQty}</td>
                                                <td className='text-center'>{common.getHtmlDate(ele.order?.orderDeliveryDate, 'ddmmyyyy')}</td>
                                                 <td className='text-end'>{common.printDecimal(ele?.balance+ ele.credit)}</td>
                                                
                                                <td className='text-end' title={ele.reason}>{common.printDecimal(ele.credit)}</td>
                                                <td className='text-end'>{common.getHtmlDate(ele.paymentDate, 'ddmmyyyy')}</td>
                                                 {isFirstOccurrence && (
                                                    <>
                                                        <td className='text-end'rowSpan={rowSpan}>{common.printDecimal(balance)}</td>
                                                    </>
                                                )}
                                                <td className='text-uppercase text-center'>{ele.paymentMode}</td>
                                            </tr>
                                        })
                                    }
                                </tbody>
                            </table>
                        </div>
                        <div className='row'>
                            <div className="d-flex justify-content-end col-12 mt-2">
                                <ul className="list-group" style={{ width: '300px' }}>
                                    <li className="list-group-item d-flex justify-content-between align-items-center pr-0">
                                        Total Delivered Qty
                                        <span className="badge badge-primary" style={{ color: 'black' }}>{uniqueQty}</span>
                                    </li>
                                    <li className="list-group-item d-flex justify-content-between align-items-center">
                                        Total Delivery Amount
                                        <span className="badge badge-primary" style={{ color: 'black' }}>{common.printDecimal(uniqueBookingSum)}</span>
                                    </li>
                                      {
                                                                        filterData.paymentMode === "All" &&
                                                                        paymentModeList.map((payEle, index) => {
                                                                            const color = common.colors[index % common.colors.length];
                                                                            return <li key={index} className="list-group-item d-flex justify-content-between align-items-center">
                                                                                <div className='text-end'>
                                                                                    Total Delivery {""}
                                                                                    <span style={{ color }}> {payEle.value}</span>
                                                                                </div>
                                    
                                                                                <span className="badge badge-primary" style={{ color: 'black' }}>{common.printDecimal(data?.reduce((sum, ele) => {
                                                                                    if (ele?.paymentMode?.toLowerCase() === payEle.value?.toLowerCase())
                                                                                        return sum += ele?.credit;
                                                                                    else
                                                                                        return sum;
                                                                                }, 0))}</span>
                                                                            </li>
                                                                        })
                                    
                                                                    }
                                                                    {
                                                                        filterData.paymentMode !== "All" &&
                                                                        (
                                                                            <li className="list-group-item d-flex justify-content-between align-items-center">
                                                                                <div className='text-end'>
                                                                                    Total Delivery {""}
                                                                                    <span style={{ color: 'black' }}> {filterData.paymentMode}</span>
                                                                                </div>
                                    
                                                                                <span className="badge badge-primary" style={{ color: 'black' }}>{common.printDecimal(data?.reduce((sum, ele) => {
                                                                                    if (ele?.paymentMode?.toLowerCase() === filterData.paymentMode?.toLowerCase())
                                                                                        return sum += ele?.credit;
                                                                                    else
                                                                                        return sum;
                                                                                }, 0))}</span>
                                                                            </li>
                                                                        )
                                    
                                                                    }
                                    {/* <li className="list-group-item d-flex justify-content-between align-items-center">
                                        Total Delivery In Cash
                                        <span className="badge badge-primary" style={{ color: 'black' }}>{common.printDecimal(data?.reduce((sum, ele) => {
                                            if (ele.paymentMode?.toLowerCase() === 'cash')
                                                return sum += ele?.credit;
                                            else
                                                return sum;
                                        }, 0))}</span>
                                    </li>
                                    <li className="list-group-item d-flex justify-content-between align-items-center">
                                        Total Delivery In VISA
                                        <span className="badge badge-primary" style={{ color: 'black' }}>{common.printDecimal(data?.reduce((sum, ele) => {
                                            if (ele.paymentMode?.toLowerCase() === 'visa')
                                                return sum += ele?.credit;
                                            else
                                                return sum;
                                        }, 0))}</span>
                                    </li> */}
                                    <li className="list-group-item d-flex justify-content-between align-items-center">
                                        Grand Total
                                        <span className="badge badge-primary" style={{ color: 'black' }}>{common.printDecimal(data?.reduce((sum, ele) => {
                                            return sum += ele?.credit;
                                        }, 0))}</span>
                                    </li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}
