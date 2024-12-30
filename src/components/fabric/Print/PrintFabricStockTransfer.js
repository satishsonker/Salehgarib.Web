import React from 'react'
import { headerFormat } from '../../../utils/tableHeaderFormat';
import FabricInvoiceHead from './FabricInvoiceHead';
import { common } from '../../../utils/common';

export default function PrintFabricStockTransfer({ printRef, data, filter }) {
    const columns = headerFormat.fabricStockTransfer;
    return (
        <>
            <div ref={printRef} className='row' style={{ padding: '15px' }}>
                <FabricInvoiceHead hideTrnNo={true} receiptType='Fabric Stock Transfer'></FabricInvoiceHead>
                <hr />
                <div className='d-flex justify-content-between'>
                    <div>   Print On : {new Date().toLocaleDateString()}  {new Date().toLocaleTimeString()}</div>
                    <div>   Date Range : {common.getHtmlDate(new Date(filter?.fromDate), 'ddmmyyyy')}-{common.getHtmlDate(new Date(filter?.toDate), 'ddmmyyyy')}</div>
                </div>
                <hr />
                <div className='col-12'>
                    <table className='table'>
                        <thead>
                            <tr>
                                <th>Sr.</th>
                                {
                                    columns?.map((ele, index) => {
                                        if (ele?.name === 'F. Image')
                                            return <></>
                                        return <th key={index}>{ele?.name}</th>
                                    })
                                }
                            </tr>
                        </thead>
                        <tbody>
                            {
                                data?.map((ele, index) => {
                                    return <tr key={index}>
                                        <td>{(index + 1)}</td>
                                        <td>{ele?.receiptNo}</td>
                                        <td>{common.getHtmlDate(ele?.receiptDate, 'ddmmyyyy')}</td>
                                        <td>{ele?.companyName}</td>
                                        <td>{ele?.fabricTypeCount}</td>
                                        <td>{ele?.totalFabric}</td>
                                    </tr>
                                })
                            }
                            <tr>
                                <td colSpan={5} className='text-end fw-bold'>Total Fabric Quantities : </td>
                                <td>{data?.reduce((sum, ele) => {
                                    return sum + ele?.totalFabric;
                                }, 0)}</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        </>
    )
}

