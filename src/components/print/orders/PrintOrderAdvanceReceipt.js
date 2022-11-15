import React from 'react'
import { common } from '../../../utils/common';
import InvoiceHead from '../../common/InvoiceHead';
import Label from '../../common/Label';
import ReceiptFooter from '../ReceiptFooter';

export const PrintOrderAdvanceReceipt = React.forwardRef((props, ref) => {
    if (props === undefined)
        return;
    const data = props.props;

    return (
        <div ref={ref} className="p-3">
            <InvoiceHead receiptType='Advance Paymant Receipt'></InvoiceHead>
            <div className='row'>
                <div className='col-12'>
                    <div className='card'>
                        <div className="card-header py-2 bg-light">
                            <div className="row row-cols-12 row-cols-lg-12">
                                <div className="col-3">
                                    <Label fontSize='13px' bold={true} text="Order No."></Label>
                                    <div className='fs-6'>{data?.order?.orderNo}</div>
                                </div>
                                <div className="col-3">
                                    <Label fontSize='13px' bold={true} text="Customer Name"></Label>
                                    <div className='fs-6'>{data?.order?.customerName}</div>
                                </div>
                                <div className="col-3">
                                    <Label fontSize='13px' bold={true} text="Contact No."></Label>
                                    <div className='fs-6'>{data?.order?.contact1}</div>
                                </div>
                                <div className="col-3">
                                    <Label fontSize='13px' bold={true} text="Receipt Date"></Label>
                                    <div className='fs-6'>{common.getHtmlDate(new Date(), 'ddmmyyyy')}</div>
                                </div>
                            </div>
                        </div>
                        <div className='card-body'>
                            <table className='table table-bordered' style={{ fontSize: '14px' }}>
                                <thead>
                                    <tr>
                                        <th colSpan={2}>Avance Amount</th>
                                        <th colSpan={2}>Payment Date</th>
                                        <th colSpan={2}>Payment Mode</th>
                                    </tr>
                                </thead>
                                <tbody style={{ fontSize: 'var(--app-font-size)' }}>
                                    <tr>
                                        <td colSpan={2}>{data?.advance?.credit.toFixed(2)}</td>
                                        <td colSpan={2}>{data?.advance?.paymentMode}</td>
                                        <td colSpan={2}>{common.getHtmlDate(data?.advance?.createdAt, 'ddmmyyyy')}</td>
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
    )
});
