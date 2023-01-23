import React, { useEffect,useState, useRef } from 'react'
import { common } from '../../../utils/common';
import ButtonBox from '../../common/ButtonBox';
import InvoiceHead from '../../common/InvoiceHead';
import ReactToPrint from 'react-to-print';
import ReceiptFooter from '../ReceiptFooter';
import OrderCommonHeaderComponent from './OrderCommonHeaderComponent';
import { Api } from '../../../apis/Api';
import { apiUrls } from '../../../apis/ApiUrls';

export default function PrintOrderAdvanceReceipt({ data, setTabPageIndex }) {
    const [orderData, setOrderData] = useState({})
    useEffect(() => {
        Api.Get(apiUrls.orderController.get + data?.order?.id)
            .then(res => {
                setOrderData(res.data);
            });
    }, [data])

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
                <InvoiceHead receiptType='Advance Paymant Receipt'></InvoiceHead>
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
                                ></OrderCommonHeaderComponent>
                                <table className='table table-bordered' style={{ fontSize: '14px' }}>
                                    <thead>
                                        <tr>
                                            <th className='text-center'>Total</th>
                                            <th className='text-center'>{data?.advance?.reason === 'AdvancedPaid' ? 'Advance' : "Paid"}</th>
                                            <th className='text-center'>Total Advance</th>
                                            <th className='text-center'>Total Balance</th>
                                            <th className='text-center'>Payment Date</th>
                                            <th className='text-center'>Payment Mode</th>
                                        </tr>
                                    </thead>
                                    <tbody style={{ fontSize: 'var(--app-font-size)' }}>
                                        <tr>
                                            <th className='text-end'>{common.printDecimal(data?.order?.totalAmount)}</th>
                                            <td className='text-end'>{data?.advance?.credit.toFixed(2)}</td>
                                            <th className='text-end'>{common.printDecimal(orderData?.advanceAmount)}</th>
                                            <th className='text-end'>{common.printDecimal(orderData?.balanceAmount)}</th>
                                            <td className='text-center'>{common.getHtmlDate(data?.advance?.paymentDate, 'ddmmyyyy')}</td>
                                            <td className='text-center'>{data?.advance?.paymentMode}</td>
                                        </tr>
                                        <tr>
                                            <td colSpan={6}></td>
                                        </tr>
                                    </tbody>
                                    <tfoot>
                                        <tr>
                                            <td colSpan={3}>Paid By............................................</td>
                                            <td colSpan={3}>Received By.............................................</td>
                                        </tr>
                                    </tfoot>
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
