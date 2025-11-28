import React, { useEffect, useState, useRef } from 'react'
import { common } from '../../../utils/common';
import ButtonBox from '../../common/ButtonBox';
import InvoiceHead from '../../common/InvoiceHead';
import ReactToPrint from 'react-to-print';
import ReceiptFooter from '../ReceiptFooter';
import OrderCommonHeaderComponent from './OrderCommonHeaderComponent';
import { Api } from '../../../apis/Api';
import { apiUrls } from '../../../apis/ApiUrls';
import DirhamSymbol from '../../common/DirhamSymbol';

export default function PrintOrderAdvanceReceipt({ data, setTabPageIndex, statement }) {
    const [orderData, setOrderData] = useState({})
    const VAT = parseFloat(process.env.REACT_APP_VAT);
    useEffect(() => {
        if (!data)
            return;
        Api.Get(apiUrls.orderController.get + data?.order?.id)
            .then(res => {
                setOrderData(res.data);
            });
    }, [data])
    const totalPaidBeforeThisPayment = () => {
        if (!statement || statement.length === 0)
            return 0;
        var sum = 0;
        var didFindEle = false;
        statement?.forEach(res => {
            if (res.id === data?.advance?.id) {
                didFindEle = true;
            }
            if (didFindEle)
                sum += res.credit;
            else
                sum = 0
        });
        return sum - data?.advance?.credit;
    }
    const calQty = () => {
        var qty = parseInt(data?.advance?.remark.split('##')[0]);
        return isNaN(qty) ? 0 : qty;
    }
    const calTotalAmount = () => {
        var totalPaid = totalPaidBeforeThisPayment();
        return data?.order?.totalAmount - totalPaid;
    }
    const printRef = useRef();
    return (
        <>
            <div className='row m-1'>
                <div className='col-12'>
                    <div className='d-flex justify-content-between'>
                        <ButtonBox className="btn-sm" type="back" onClickHandler={() => { setTabPageIndex(1) }} />
                        <ReactToPrint
                            trigger={() => {
                                return <button className='btn btn-sm btn-warning' data-bs-dismiss="modal"><i className='bi bi-printer'></i> Print Advance Receipt</button>
                            }}
                            content={(el) => (printRef.current)}
                        />
                    </div>
                </div>
            </div>
            <div ref={printRef} className="p-3">
                <InvoiceHead receiptType='Tax Invoice'></InvoiceHead>
                <div className='row'>
                    <div className='col-12'>
                        <div className='card'>
                            <div className='card-body'>
                                <OrderCommonHeaderComponent
                                    contact={data?.order?.contact1}
                                    customerName={data?.order?.customerName}
                                    orderDate={data?.order?.orderDate}
                                    orderDeliveryDate={data?.order?.orderDeliveryDate}
                                    orderNo={data?.order?.orderNo}
                                    salesman={data?.order?.salesman}
                                    taxInvoiceNo={data?.advance?.taxInvoiceNumber}
                                ></OrderCommonHeaderComponent>
                                <table className='table table-bordered' style={{ fontSize: '14px' }}>
                                    <thead>
                                        <tr>
                                            <th colSpan={6} className='text-center'>Description</th>
                                            <th className='text-center'>Qty</th>
                                            <th colSpan={2} className='text-center'>Total Amount</th>
                                        </tr>
                                    </thead>
                                    <tbody style={{ fontSize: 'var(--app-font-size)' }}>
                                        <tr>
                                            <td className='text-center fw-bold' colSpan={6}>{data?.advance?.reason === 'AdvancedPaid' ? 'Advance Payment' : "Delivered"}</td>
                                            <td className='text-center fw-bold'>{calQty()}</td>
                                            <td>Order Amount</td>
                                            <td className='text-end fw-bold'><DirhamSymbol amount={common.printDecimal(data?.order?.totalAmount)} /></td>
                                        </tr>
                                        <tr>
                                            <td>Payment Mode</td>
                                            <td colSpan={2}>{data?.advance?.paymentMode} {(data?.advance?.chequeNumber === null || data?.advance?.chequeNumber === undefined || data?.advance?.chequeNumber?.trim() === ''? '' : `(${data?.advance?.chequeNumber})`)}</td>
                                            <td>Payment Date</td>
                                            <td colSpan={3}><strong>{common.getHtmlDate(data?.advance?.paymentDate, "ddmmyyyy")}</strong> </td>
                                            <td>Already Paid</td>
                                            <td className='text-end fw-bold'><DirhamSymbol amount={common.printDecimal(totalPaidBeforeThisPayment())} /></td>
                                        </tr>
                                        <tr>

                                            <td>Amount in words</td>
                                            <td colSpan={6} style={{ fontWeight: "bold" }}>{common.inWords(data?.advance?.credit)?.replace('Only', '')} Only</td>
                                            <td>Paid Amount</td>
                                            <th className='text-end fw-bold'><DirhamSymbol amount={common.printDecimal(data?.advance?.credit)} /></th>
                                        </tr>
                                        <tr>
                                            <td>Paid By</td>
                                            <td colSpan={6}>............................................................................................................</td>
                                            <td>VAT Received</td>
                                            <th className='text-end fw-bold'><DirhamSymbol amount={common.printDecimal(((data?.advance?.credit/(100+VAT))*VAT))} /></th>
                                        </tr>
                                        <tr>
                                            <td>Received By</td>
                                            <td colSpan={6}>............................................................................................................</td>
                                            <td>Balance Amount</td>
                                            <th className='text-end fw-bold'><DirhamSymbol amount={common.printDecimal(calTotalAmount()-data?.advance?.credit)} /></th>
                                        </tr>
                                    </tbody>
                                </table>
                                <ReceiptFooter></ReceiptFooter>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}
