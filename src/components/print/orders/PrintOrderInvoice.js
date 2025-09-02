import React, { useRef, useEffect, useState, useImperativeHandle, forwardRef, useMemo } from 'react';
import { Api } from '../../../apis/Api';
import { useReactToPrint } from 'react-to-print';
import { apiUrls } from '../../../apis/ApiUrls';
import InvoiceHead from '../../common/InvoiceHead';
import OrderCommonHeaderComponent from './OrderCommonHeaderComponent';
import DirhamSymbol from '../../common/DirhamSymbol';
import { common } from '../../../utils/common';
import ReceiptFooter from '../ReceiptFooter';

const PrintOrderInvoice = React.forwardRef(({ invoiceNumber }, ref) => {
    const [data, setData] = useState({ order: {}, statements: [] });
    const VAT = parseFloat(process.env.REACT_APP_VAT);
    const componentRef = useRef();
    useEffect(() => {
        if (invoiceNumber) {
            Api.Get(`${apiUrls.taxInvoiceController.getByInvoiceNumber}${invoiceNumber}`)
                .then(res => {
                    setData(res.data);
                })
                .catch(() => {
                    setData({ order: {}, statement: [] });
                });
        }
    }, [invoiceNumber]);

    const handlePrint = useReactToPrint({
        content: () => componentRef.current,
        documentTitle: `OrderInvoice_${invoiceNumber}`,
    });

    useImperativeHandle(ref, () => ({
        print: handlePrint
    }));
    const totalPayment = () => {
        if (!data?.statements || data?.statements.length === 0)
            return 0;
        var sum = 0;
        data?.statements?.forEach(res => {
            sum += res.credit;
        });
        return sum;
    }
    const getData = useMemo(() => {
        var obj = {
            paymentMode: '',
            chequeNumber: null,
            totalAmount: 0,
            paymentDate: new Date(),
        }
        if (!data?.statements || data?.statements.length === 0)
            return obj;

        var statment = data?.statements[0] || {};
        var obj = {
            paymentMode: statment.paymentMode,
            chequeNumber: statment.chequeNumber,
            paymentDate: statment.paymentDate,
            totalAmount: totalPayment(),
        }

        return obj;
    }, [data?.statements]);
    const calQty = () => {
        var qty = parseInt(data?.statements?.advance?.remark.split('##')[0]);
        return isNaN(qty) ? 0 : qty;
    }
    const calTotalAmount = () => {
        var totalPaid = totalPayment();
        return data?.order?.totalAmount - totalPaid;
    }
    return (
        <div ref={componentRef} className="p-3">
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
                                taxInvoiceNo={invoiceNumber}
                            ></OrderCommonHeaderComponent>
                            <table className='table table-bordered' style={{ fontSize: '14px' }}>
                                <thead>
                                    <tr>
                                        <th colSpan={2} className='text-center'>Payment Date</th>
                                        <th colSpan={6} className='text-center'>Payment Mode</th>
                                        <th className='text-center'>Amount</th>
                                    </tr>
                                </thead>
                                <tbody style={{ fontSize: 'var(--app-font-size)' }}>
                                    <tr>
                                        <td colSpan={9}>
                                            <table>
                                                <tbody>
                                                    {
                                                        data?.statements?.map((ele, index) => {
                                                            return <React.Fragment key={index}>
                                                                <tr className={index < data?.statements?.length - 1 ? 'border-bottom' : ''}>
                                                                     <td colSpan={2} className='text-start fw-bold'>{common.getHtmlDate(ele?.paymentDate,'ddmmyyyy')}</td>
                                                                    <td className='text-center fw-bold' colSpan={6}>{ele.paymentMode} {(ele.chequeNumber === null || ele.chequeNumber === '' ? '' : `(${ele?.chequeNumber})`)}</td>
                                                                    <td className='text-end fw-bold'>{common.printDecimal(ele?.credit)}</td>
                                                                </tr>
                                                            </React.Fragment>
                                                        })
                                                    }
                                                </tbody>
                                            </table>
                                        </td>

                                       
                                    </tr>
                                    <tr>

                                        <td>Amount in words</td>
                                        <td colSpan={6} style={{ fontWeight: "bold" }}>{common.inWords(totalPayment())?.replace('Only', '')} Only</td>

                                        <td>Order Amount</td>
                                        <th className='text-end fw-bold'><DirhamSymbol amount={common.printDecimal(data?.order?.totalAmount)} /></th>
                                    </tr>
                                    <tr>
                                        <td>Paid By</td>
                                        <td colSpan={6}>............................................................................................................</td>
                                        <td>Paid Amount</td>
                                        <th className='text-end fw-bold'><DirhamSymbol amount={common.printDecimal(totalPayment())} /></th>
                                    </tr>
                                    <tr>
                                        <td>Received By</td>
                                        <td colSpan={6}>............................................................................................................</td>
                                        <td>VAT Received</td>
                                        <th className='text-end fw-bold'><DirhamSymbol amount={common.printDecimal(common.calculatePercent(totalPayment(), VAT))} /></th>
                                    </tr>
                                </tbody>
                            </table>
                            <ReceiptFooter></ReceiptFooter>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
});
export default PrintOrderInvoice;
