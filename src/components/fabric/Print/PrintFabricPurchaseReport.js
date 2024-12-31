import React from 'react'
import { common } from '../../../utils/common';
import FabricInvoiceHead from './FabricInvoiceHead';

export default function PrintFabricPurchaseReport({ data, printRef,filter }) {
    const columns = [
        { name: 'Purchase No.', prop: 'purchaseNo', action: { hAlign: "center", dAlign: "center", footerText: "" } },
        { name: 'Invoice No.', prop: 'invoiceNo', action: { hAlign: "center", dAlign: "center", footerText: "" } },
        { name: 'Supplier', prop: '',customColumn:(data)=>{ return data?.supplier?.companyName}, action: { hAlign: "center", dAlign: "center", footerText: "" } },
        { name: 'Contant No.', prop: '',customColumn:(data)=>{ return data?.supplier?.contact}, action: { hAlign: "center", dAlign: "center", footerText: "" } },
        { name: 'TRN', prop: '',customColumn:(data)=>{ return data?.supplier?.trn}, action: { hAlign: "center", dAlign: "center", footerText: "" } },
        { name: 'Purchase Date',isDate:true, prop: 'purchaseDate', action: { hAlign: "center", dAlign: "center", footerText: "" } },
        { name: 'Qty', prop: 'qty', action: { hAlign: "center", dAlign: "center", footerSum: true, footerSumInDecimal: false } },
        { name: 'Sub Total', prop: 'subTotalAmount', action: { decimal: true, hAlign: "center", dAlign: "center", footerSum: true, footerSumInDecimal: true } },
        {
          name: 'VAT', prop: 'vatAmount',
          customColumn: (data) => { return common.printDecimal(data["totalAmount"] - data["subTotalAmount"]) },
          action: {
            hAlign: "center",
            dAlign: "center",
            footerSum: (data) => {
              return common.printDecimal(data?.reduce((sum, ele) => {
                return sum += (ele["totalAmount"] - ele["subTotalAmount"]);
              }, 0));
            },
            footerSumInDecimal: true
          }
        },
        { name: 'Total', prop: 'totalAmount', action: { decimal: true, hAlign: "center", dAlign: "center", footerSum: true, footerSumInDecimal: true } },
      ];

    const formatDate = (dateString) => {
        return common.getHtmlDate(new Date(dateString),'ddmmyyyy');
    };
    const renderCol=(col,row)=>{
        if(typeof col.customColumn==='function')
            return col.customColumn(row)
       return col.isDate
        ? formatDate(row[col.prop])
        : col.decimal
            ? row[col.prop]?.toFixed(2)
            : row[col.prop]
    }
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
                        {columns.map((col,colIndex) => (
                                <th key={colIndex} style={{ border: '1px solid black', padding: '8px' }}>
                                    {col.name}
                                </th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        {data.map((row, index) => (
                            <tr key={index}>
                                {columns.map((col,colIndex) => (
                                    <td key={colIndex} style={{ border: '1px solid black', padding: '8px' }}>
                                        {renderCol(col,row)
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

