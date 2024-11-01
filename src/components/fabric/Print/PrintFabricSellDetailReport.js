import React, { useState } from 'react'
import { headerFormat } from '../../../utils/tableHeaderFormat';
import TableView from '../../tables/TableView';
import FabricInvoiceHead from './FabricInvoiceHead';
import { common } from '../../../utils/common';

export default function PrintFabricSellDetailReport({ data, printRef,filter }) {
    const columns = [
        { name: 'Invoice No.', prop: 'invoiceNo', action: { hAlign: "center", dAlign: "center", footerText: "" } },
        { name: 'Sale Date', prop: 'saleDate',isDate:true, action: { hAlign: "center", dAlign: "center", footerText: "" } },
        { name: 'Customer', prop: 'customerName', action: { hAlign: "center", dAlign: "center", footerText: "" } },
        { name: 'Contact', prop: 'contact', action: { hAlign: "center", dAlign: "center", footerText: "" } },
        { name: 'Salesman', prop: 'salesmanName', action: { hAlign: "center", dAlign: "center", footerText: "" } },
        { name: 'Qty', prop: 'qty', action: { hAlign: "center", dAlign: "center", footerSum: true } },
        { name: 'Sub Total', prop: 'subTotalAmount', action: { hAlign: "center", dAlign: "center", footerSum: true, decimal: true, footerSumInDecimal: true } },
        { name: 'VAT', prop: 'vatAmount', action: { hAlign: "center", dAlign: "center", footerSum: true, decimal: true, footerSumInDecimal: true } },
        { name: 'Total', prop: 'totalAmount', action: { hAlign: "center", dAlign: "center", footerSum: true, decimal: true, footerSumInDecimal: true } },
        { name: 'Dis.', prop: 'discount', action: { decimal: true, hAlign: "center", dAlign: "center", footerText: '' } },
        { name: 'Total Aft Dis.', prop: 'totalAfterDiscount', action: { decimal: true, hAlign: "center", dAlign: "center", footerSum: true, footerSumInDecimal: true } },
        { name: 'Advance', prop: 'advanceAmount', action: { hAlign: "center", dAlign: "center", footerSum: true, decimal: true, footerSumInDecimal: true } },
        { name: 'Paid', prop: 'paidAmount', action: { decimal: true, hAlign: "center", dAlign: "center", footerSum: true, footerSumInDecimal: true } },
        { name: 'Bal.', prop: 'balanceAmount', action: { decimal: true, hAlign: "center", dAlign: "center", footerSum: true, footerSumInDecimal: true } },
        { name: 'Pay Date', prop: 'paymentDate',isDate:true, action: { decimal: true, hAlign: "center", dAlign: "center", footerText: '' } },
        { name: 'Pay Mode', prop: 'paymentMode', action: { decimal: true, hAlign: "center", dAlign: "center", footerText: '' } },
    ];

    const formatDate = (dateString) => {
        return common.getHtmlDate(new Date(dateString),'ddmmyyyy');
    };
    return (
        <React.Fragment >
            <div ref={printRef} style={{ padding: '10px' }} className="row">
                <FabricInvoiceHead></FabricInvoiceHead>
                <hr/>
                <div className='d-flex justify-content-between'>
                 <div>   Print On : {new Date().toLocaleDateString()}  {new Date().toLocaleTimeString()}</div>
                 <div>   Date Range : {common.getHtmlDate(new Date(filter?.fromDate),'ddmmyyyy') }-{common.getHtmlDate(new Date(filter?.toDate),'ddmmyyyy') }</div>
                </div>
                <hr/>
                <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'center' }}>
                    <thead>
                        <tr>
                            {columns.map((col) => (
                                <th key={col.prop} style={{ border: '1px solid black', padding: '8px' }}>
                                    {col.name}
                                </th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        {data.map((row, index) => (
                            <tr key={index}>
                                {columns.map((col) => (
                                    <td key={col.prop} style={{ border: '1px solid black', padding: '8px' }}>
                                        {col.isDate
                                            ? formatDate(row[col.prop])
                                            : col.decimal
                                                ? row[col.prop]?.toFixed(2)
                                                : row[col.prop]
                                        }
                                    </td>
                                ))}
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </React.Fragment>
    )
}
