import React from 'react'
import FabricInvoiceHead from './FabricInvoiceHead'
import DisplayLabel from '../../common/DisplayLabel'
import { headerFormat } from '../../../utils/tableHeaderFormat'
import { common } from '../../../utils/common';

export default function PrintFabricStockTransferReceipt({ printRef, data }) {
    const columns = headerFormat.fabricStockTransferDetail;
    return (
        <>

            <div ref={printRef} className='row' style={{ padding: '15px' }}>
                <FabricInvoiceHead hideTrnNo={true} receiptType='Fabric Stock Transfer Receipt'></FabricInvoiceHead>
              
                <div className='d-flex justify-content-center'>
                Print On : {common.getHtmlDate(new Date(),'ddmmyyyy')}  {new Date().toLocaleTimeString()}
                </div>
                <hr />
                <div className='col-4'><DisplayLabel headingBold={true} contentBold={true} conentfontSize='20px' headingText="Receipt No." contentText={data?.receiptNo}></DisplayLabel></div>
                <div className='col-4'><DisplayLabel headingBold={true} headingText="Receipt Date" contentText={common.getHtmlDate(data?.receiptDate, 'ddmmyyyy')}></DisplayLabel></div>
                <div className='col-4'><DisplayLabel headingBold={true} headingText="Transfer To" contentText={data?.companyName}></DisplayLabel></div>
                <div className='col-12 my-4'>
                    <table className='table'>
                        <thead>
                            <tr>
                                <th>Sr.</th>
                                {
                                    columns?.map((ele, index) => {
                                        if(ele?.name==='F. Image')
                                            return<></>
                                        return <th key={index}>{ele?.name}</th>
                                    })
                                }
                            </tr>
                        </thead>
                        <tbody>
                            {
                                data?.fabricStockTransferDetails?.map((ele, index) => {
                                    return <tr key={index}>
                                        <td>{(index + 1)}</td>
                                        <td>{ele?.fabricCode}</td>
                                        <td>{ele?.brandName}</td>
                                        <td>{ele?.fabricSizeName}</td>
                                        <td>{ele?.fabricTypeName}</td>
                                        <td>{ele?.fabricPrintType}</td>
                                        <td>{ele?.fabricColorName}</td>
                                        <td>{ele?.qty}</td>
                                    </tr>
                                })
                            }
                            <tr>
                                <td colSpan={7} className='text-end fw-bold'>Total Fabric Quantities : </td>
                                <td>{data?.fabricStockTransferDetails?.reduce((sum,ele)=>{
                                    return sum+ele?.qty;
                                },0)}</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
                <div className='d-flex justify-content-between'>
                    <div className='text-end fw-bold'>Issued By..................................................</div>
                    <div className='text-end fw-bold'>Verified By..................................................</div>
                </div>
                <div className='d-flex justify-content-between mt-2'>
                    <div className='text-end fw-bold'>Remark..................................................</div>
                    <div className='text-end fw-bold'>Date ...../...../{new Date().getFullYear()}</div>
                </div>
            </div>
        </>
    )
}
