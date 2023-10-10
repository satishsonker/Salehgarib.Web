import React from 'react'
import { common } from '../../../utils/common'
import ReceiptFooter from '../ReceiptFooter'
import InvoiceHead from '../../common/InvoiceHead'
import OrderCommonHeaderComponent from './OrderCommonHeaderComponent'

export default function InvoicePrintLayout({ printRef, mainData, finalOrder }) {
    const vat = parseFloat(process.env.REACT_APP_VAT);
    let cancelledOrDeletedTotal = 0;
    let cancelledOrDeletedSubTotal = 0;
    let totalVat = common.calculatePercent(mainData?.subTotalAmount - cancelledOrDeletedSubTotal, vat);
    const getWorkOrderTypes = (workType) => {
        if (workType === undefined || workType === null || workType === '') {
            return '';
        }
        let types = ['', 'Designing', 'Cutting', 'M. Emb', 'Hot Fix', 'H. Emb', 'Apliq', 'Stitching']
        let str = '';
        workType.split('').forEach(ele => {
            str += types[parseInt(ele)] + ', '
        });
        return str.substring(0, str.length - 1);
    }
    const hasKeys = (obj) => {
        return Object.keys(obj).length > 0;
    }

    const getModel = (ele) => {
        var res = `${common.defaultIfEmpty(ele.designCategory, "")} - ${common.defaultIfEmpty(ele.designModel, '')}`;
        if (res?.trim() === '-')
            return "";
        return res;
    }

    const getClassName=(ele,index)=>{
        if(finalOrder?.length-1===index){
            return " onlyDownBorder";
        }
        else
        return !hasKeys(ele) ? " noUpDownBorder" : "";
    }
    return (
        <>
            <div ref={printRef} style={{ padding: '10px' }} className="row">

                <div className="col col-lg-12 mx-auto">
                    <div className="card border shadow-none">
                        <div className="card-header py-3">
                            <div className="row align-items-center g-3">
                                <InvoiceHead receiptType='Order Receipt'></InvoiceHead>
                            </div>
                        </div>
                        <OrderCommonHeaderComponent
                            orderNo={mainData?.orderNo}
                            customerName={mainData?.customerName}
                            orderDate={mainData?.orderDate}
                            contact={mainData?.contact1}
                            orderDeliveryDate={mainData?.orderDeliveryDate}
                            salesman={mainData?.salesman} />
                        <div className="card-body">
                            <div className="table-responsive1">
                                <table className="table table-invoice" style={{ fontSize: '12px' }}>
                                    <thead>
                                        <tr>
                                            <th className='text-center all-border'  width="5%" style={{ width: 'max-content !important' }}>S.No.</th>
                                            <th className="text-center all-border" width="40%">DESCRIPTION</th>
                                            <th className="text-center all-border" width="10%">Model No.</th>
                                            <th className="text-center all-border" width="5%">Qty.</th>
                                            <th className="text-center all-border" width="10%">Item Price</th>
                                            <th className="text-center all-border" width="5%">Unit Price</th>
                                            <th className="text-center all-border" width="5%">Vat {vat}%</th>
                                            <th className="text-center all-border" width="5%">Total Dhs.</th>
                                        </tr>
                                    </thead>
                                    <tbody>

                                        {
                                            finalOrder?.map((ele, index) => {
                                                return <tr key={ele.id} className='print-table-height'>
                                                    <td className={"text-center border border-secondary" + getClassName(ele,index)} width="5%" style={{ width: 'max-content !important' }}>{hasKeys(ele) ? (index + 1) + "." : ""}</td>
                                                    <td className={"text-center border border-secondary text-wrap" + getClassName(ele,index)} width="40%">{getWorkOrderTypes(ele.workType)}</td>
                                                    <td className={"text-center border border-secondary" + getClassName(ele,index)} width="5%">{getModel(ele)}</td>
                                                    <td className={"text-center border border-secondary" + getClassName(ele,index)} width="10%">{common.printDecimal(ele.qty, true)}</td>
                                                    <td className={"text-center border border-secondary" + getClassName(ele,index)} width="10%">{common.printDecimal((ele.subTotalAmount / ele.qty), true)}</td>
                                                    <td className={"text-center border border-secondary" + getClassName(ele,index)} width="5%">{common.printDecimal(ele.subTotalAmount, true)}</td>
                                                    <td className={"text-center border border-secondary" + getClassName(ele,index)} width="5%">{common.printDecimal(ele.vatAmount, true)}</td>
                                                    <td className={"text-center border border-secondary" + getClassName(ele,index)} width="5%">{common.printDecimal(ele.totalAmount, true)}</td>
                                                </tr>
                                            })
                                        }

                                    </tbody>
                                </table>
                                <table className='table table-bordered'>
                                    <tbody>
                                        <tr>
                                            <td colSpan={3} className="text-start"><i className='bi bi-call' />{process.env.REACT_APP_COMPANY_MOBILE} <i className='bi bi-whatsapp text-success'></i></td>
                                            <td colSpan={1} className="text-end" >Total Quantity</td>
                                            <td colSpan={2} className="text-center">VAT {vat}%</td>
                                            <td colSpan={1} className="fs-6 fw-bold text-center">Total Amount</td>
                                            <td colSpan={1} className="text-end">{common.printDecimal(mainData?.subTotalAmount)}</td>
                                        </tr>
                                        <tr>
                                            <td colSpan={3} className="text-start"><i className='bi bi-mail' /> {process.env.REACT_APP_COMPANY_EMAIL}<i className='bi bi-envelope text-success'></i></td>
                                            <td colSpan={1} className="text-center" >{mainData?.orderDetails?.filter(x => !x.isDeleted && !x.isCancelled)?.length}</td>
                                            <td className="fs-6 fw-bold text-center">Total VAT</td>
                                            <td className="text-end">{common.printDecimal(totalVat)}</td>
                                            <td className="fs-6 fw-bold text-center">Gross Amount</td>
                                            <td className="text-end">{common.printDecimal((mainData?.totalAmount - cancelledOrDeletedTotal))}</td>
                                        </tr>
                                        <tr>
                                            <td colSpan={6} className="text-start">Received by.................................</td>
                                            <td className="fs-6 fw-bold text-center">Total Advance</td>
                                            <td className="text-end">{common.printDecimal(mainData?.accountStatements?.find(x => x.isFirstAdvance)?.credit ?? 0)}</td>
                                        </tr>
                                        <tr>
                                            <td colSpan={6} className="text-start"></td>
                                            <td className="fs-6 fw-bold text-center">Total Balance</td>
                                            <td className="text-end">{common.printDecimal(mainData?.totalAmount - cancelledOrDeletedTotal - (mainData?.accountStatements?.find(x => x.isFirstAdvance)?.credit ?? 0))}</td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                        </div>
                        <ReceiptFooter />
                    </div>
                </div>
            </div>
        </>
    )
}
