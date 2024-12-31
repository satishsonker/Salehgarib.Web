import React from 'react'
import FabricInvoiceHead from './FabricInvoiceHead'
import DisplayLabel from '../../common/DisplayLabel'
import { common } from '../../../utils/common';

export default function PrintFabricPurchaseDetails({ printRef, data }) {
    console.log(data);
    const columns = [
        {
            name: 'Brand', prop: 'brandName', customColumn: (data) => {
                return `${data?.brandName}-${data?.fabricSizeName}-${data?.fabricTypeName}-${data?.fabricPrintType}`;
            }, action: { hAlign: "center", dAlign: "center", footerText: "" }
        },
        { name: 'F. Code', prop: 'fabricCode', action: { hAlign: "center", dAlign: "center", footerText: "" } },
        { name: 'Desc', prop: 'description', action: { hAlign: "center", dAlign: "center", footerText: "" } },
        { name: 'Qty', prop: 'qty', action: { hAlign: "center", dAlign: "center", footerSum: true, footerSumInDecimal: false } },
        { name: 'Pur Price', prop: 'purchasePrice', action: { decimal: true, hAlign: "center", dAlign: "center", footerSum: true, footerSumInDecimal: true } },
        // { name: 'Sale Price', prop: 'sellPrice', action: { decimal: true, hAlign: "center", dAlign: "center", footerSum: true, footerSumInDecimal: true } },
        { name: 'Sub Total', prop: 'subTotalAmount', action: { decimal: true, hAlign: "center", dAlign: "center", footerSum: true, footerSumInDecimal: true } },
        { name: 'VAT', prop: 'vatAmount', action: { decimal: true, hAlign: "center", dAlign: "center", footerSum: true, footerSumInDecimal: true } },
        { name: 'Total', prop: 'totalAmount', action: { decimal: true, hAlign: "center", dAlign: "center", footerSum: true, footerSumInDecimal: true } },
    ];

    const formatDate = (dateString) => {
        return common.getHtmlDate(new Date(dateString), 'ddmmyyyy');
    };
    const renderCol = (col, row) => {
        if (typeof col.customColumn === 'function')
            return col.customColumn(row)
        return col.isDate
            ? formatDate(row[col.prop])
            : col.action.decimal
                ? common.printDecimal(row[col.prop])
                : row[col.prop]
    }
    return (
        <>
            <div ref={printRef} style={{ padding: '10px' }} className="row">
                <FabricInvoiceHead></FabricInvoiceHead>
                <hr />
                <div className='row'>
                    <div className='col-3'> <DisplayLabel headingfontSize='14px' headingBold={true} headingText="Purchase No." contentText={data?.purchaseNo} /></div>
                    <div className='col-3'> <DisplayLabel headingfontSize='14px' headingBold={true} headingText="Purchase Date" contentText={common.getHtmlDate(data?.purchaseDate, 'ddmmyyyy')} /></div>
                    <div className='col-3'> <DisplayLabel headingfontSize='14px' headingBold={true} headingText="Invoice No." contentText={data?.invoiceNo} /></div>
                    <div className='col-3'> <DisplayLabel headingfontSize='14px' headingBold={true} headingText="Fabric Qty" contentText={data?.qty} /></div>
                </div>
                <div className='row'>
                    <div className='col-3'> <DisplayLabel headingfontSize='14px' headingBold={true} headingText="Supplier" contentText={data?.supplier?.companyName} /></div>
                    <div className='col-3'> <DisplayLabel headingfontSize='14px' headingBold={true} headingText="Contact No." contentText={data?.supplier?.contact} /></div>
                    <div className='col-3'> <DisplayLabel headingfontSize='14px' headingBold={true} headingText="TRN" contentText={data?.supplier?.trn} /></div>
                    <div className='col-3'> <DisplayLabel headingfontSize='14px' headingBold={true} headingText="Address" contentText={data?.supplier?.address} /></div>
                </div>
                <hr />
                <table style={{ width: '97%', borderCollapse: 'collapse', margin: '10px', textAlign: 'center' }}>
                    <thead>
                        <tr>
                            {columns.map((col, colIndex) => (
                                <th key={colIndex} style={{ border: '1px solid black', padding: '8px' }}>
                                    {col.name}
                                </th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        {data?.fabricPurchaseDetails?.map((row, index) => (
                            <tr key={index}>
                                {columns.map((col, colIndex) => (
                                    <td key={colIndex} style={{ border: '1px solid black', padding: '8px',textAlign:(col?.action?.decimal?"end":"") }}>
                                        {renderCol(col, row)
                                        }
                                    </td>
                                ))}
                            </tr>
                        ))}
                    </tbody>
                    <tfoot className='table-footer' style={{border:'1px solid'}}>
                        <tr>
                            <td colSpan={3}></td>
                            <td style={{border:'1px solid'}}>
                                {common.calculateSum(data?.fabricPurchaseDetails,"qty")}
                            </td>
                            <td colSpan={2} style={{textAlign:'end',border:'1px solid'}}>
                                {common.printDecimal(common.calculateSum(data?.fabricPurchaseDetails,"subTotalAmount"))}
                            </td>
                            <td style={{textAlign:'end',border:'1px solid'}}>
                                {common.printDecimal(common.calculateSum(data?.fabricPurchaseDetails,"vatAmount"))}
                            </td>
                            <td style={{textAlign:'end',border:'1px solid'}}>
                                {common.printDecimal(common.calculateSum(data?.fabricPurchaseDetails,"totalAmount"))}
                            </td>
                        </tr>
                    </tfoot>
                </table>
            </div>
        </>
    )
}
