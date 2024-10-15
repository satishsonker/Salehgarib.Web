import React from 'react'
import { common } from '../../../utils/common';
import ReceiptFooter from '../../print/ReceiptFooter';
import FabricInvoiceHead from './FabricInvoiceHead';
import FabricInvoiceCommonHeader from './FabricInvoiceCommonHeader';

export default function PrintFabricSaleInvoice({ printRef, mainData, finalOrder }) {
    const vat = parseFloat(process.env.REACT_APP_VAT);
    let cancelledOrDeletedSubTotal = 0;
    let totalVat = common.calculatePercent(mainData?.subTotalAmount - cancelledOrDeletedSubTotal, vat);

    const hasKeys = (obj) => {
        return Object.keys(obj).length > 0;
    }

    const getClassName = (ele, index) => {
        if (mainData?.fabricSaleDetails?.length - 1 === index) {
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
                                <FabricInvoiceHead receiptType='Invoice Receipt'></FabricInvoiceHead>
                            </div>
                        </div>
                        <FabricInvoiceCommonHeader
                            invoiceNo={mainData?.invoiceNo}
                            customerName={mainData.firstName===undefined?mainData?.customerName: mainData?.firstName + "  " + mainData?.lastName}
                            saleDate={mainData?.saleDate}
                            contact={mainData?.primaryContact}
                            deleiverDate={mainData?.deliveryDate}
                            salesman={mainData?.salesman??mainData?.salesmanName} taxInvoiceNo={mainData?.taxInvoiceNo} />
                        <div className="card-body">
                            <div className="table-responsive1">
                                <table className="table table-invoice" style={{ fontSize: '12px' }}>
                                    <thead>
                                        <tr>
                                            <th className='text-center all-border' width="5%" style={{ width: 'max-content !important' }}>S.No.</th>
                                            <th className="text-center all-border" width="40%">DESCRIPTION</th>
                                            <th className="text-center all-border" width="10%">Model No.</th>
                                            <th className="text-center all-border" width="5%">Qty.</th>
                                            <th className="text-center all-border" width="10%">Price/Peice</th>
                                            <th className="text-center all-border" width="5%">Price</th>
                                            <th className="text-center all-border" width="5%">Vat {vat}%</th>
                                            <th className="text-center all-border" width="5%">Total Dhs.</th>
                                        </tr>
                                    </thead>
                                    <tbody>

                                        {
                                            mainData?.fabricSaleDetails?.map((ele, index) => {
                                                return <tr key={ele.id} className='print-table-height'>
                                                    <td className={"text-center border border-secondary" + getClassName(ele, index)} width="5%" style={{ width: 'max-content !important' }}>{hasKeys(ele) ? (index + 1) + "." : ""}</td>
                                                    <td className={"text-center border border-secondary text-wrap" + getClassName(ele, index)} width="40%">{`${ele?.fabricCode??ele?.fabric?.fabricCode} - ${ele?.fabricBrand??ele?.fabric?.brandName} - ${ele?.fabricType??ele?.fabric?.fabricTypeName} - ${ele?.fabricPrintType??ele?.fabric?.fabricPrintType} - ${ele?.fabricColor??ele?.fabric?.fabricColorName} - ${ele?.description ?? ""}`} </td>
                                                    <td className={"text-center border border-secondary" + getClassName(ele, index)} width="5%">{ele?.fabricSize}</td>
                                                    <td className={"text-center border border-secondary" + getClassName(ele, index)} width="10%">{common.printDecimal(ele.qty, true)}</td>
                                                    <td className={"text-center border border-secondary" + getClassName(ele, index)} width="10%">{common.printDecimal((ele.subTotalAmount / ele.qty), true)}</td>
                                                    <td className={"text-center border border-secondary" + getClassName(ele, index)} width="5%">{common.printDecimal(ele.subTotalAmount, true)}</td>
                                                    <td className={"text-center border border-secondary" + getClassName(ele, index)} width="5%">{common.printDecimal(ele.vatAmount, true)}</td>
                                                    <td className={"text-center border border-secondary" + getClassName(ele, index)} width="5%">{common.printDecimal(ele.totalAmount, true)}</td>
                                                </tr>
                                            })
                                        }

                                    </tbody>
                                </table>
                                <table className='table table-bordered'>
                                    <tbody>
                                        <tr>
                                            <td colSpan={3} className="text-start"><i className='bi bi-call' />{process.env.REACT_APP_COMPANY_MOBILE} <i className='bi bi-whatsapp text-success'></i></td>
                                            <td colSpan={1} className="text-center">
                                                <strong>Total Quantity </strong>
                                            </td>
                                            <td colSpan={2} className="text-center"><strong>VAT</strong> {vat}%</td>
                                            <td colSpan={2} rowSpan={4} className="fs-6 fw-bold text-center">
                                                <ul>
                                                    <li style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between' }}>
                                                        <span style={{ fontWeight: 'normal' }}>Sub Total</span>
                                                        <span>{common.printDecimal(mainData?.subTotalAmount)}</span>
                                                    </li>
                                                    <li style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between' }}>
                                                        <span style={{ fontWeight: 'normal' }}>Amount with VAT</span>
                                                        <span>{common.printDecimal((mainData?.subTotalAmount + totalVat))}</span>
                                                    </li>
                                                    {mainData?.advanceAmount > 0 && <li style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between' }}>
                                                        <span style={{ fontWeight: 'normal' }}>Advance</span>
                                                        <span>{common.printDecimal((mainData?.advanceAmount))}</span>
                                                    </li>
                                                    }
                                                    <li style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between' }}>
                                                        <span style={{ fontWeight: 'normal' }}>Discount</span>
                                                        <span>-{common.printDecimal(mainData?.discountAmount)}</span>
                                                    </li>
                                                    <li style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between' }}>
                                                        <span style={{ fontWeight: 'normal' }}>Payable</span>
                                                        <span>{common.printDecimal((mainData?.subTotalAmount + totalVat - mainData?.discountAmount))}</span>
                                                    </li>
                                                    {mainData?.paidAmount !== 0 && <li style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between' }}>
                                                        <span style={{ fontWeight: 'normal' }}>Paid</span>
                                                        <span>{common.printDecimal((mainData?.paidAmount))}</span>
                                                    </li>
                                                    }
                                                    {mainData?.balanceAmount !== 0 && <li style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between' }}>
                                                        <span style={{ fontWeight: 'normal' }}>Balance</span>
                                                        <span>{common.printDecimal((mainData?.balanceAmount))}</span>
                                                    </li>
                                                    }
                                                </ul>
                                            </td>
                                        </tr>
                                        <tr>
                                            <td colSpan={3} className="text-start"><i className='bi bi-mail' /> {process.env.REACT_APP_COMPANY_EMAIL}<i className='bi bi-envelope text-success'></i></td>
                                            <td colSpan={1} className="text-center" >{mainData?.fabricSaleDetails?.filter(x => !x.isDeleted && !x.isCancelled)?.length}</td>
                                            <td className="text-center">
                                                <div>
                                                    <strong>Total VAT</strong>
                                                </div>
                                                <div>
                                                    {common.printDecimal(totalVat)}
                                                </div>
                                            </td>
                                            <td className="text-center">
                                                <div>
                                                    <strong>Payment Mode</strong>
                                                </div>
                                                <div>
                                                    {mainData?.paymentMode}
                                                </div>
                                            </td>
                                        </tr>
                                        <tr>
                                            <td colSpan={6} rowSpan={5} className="text-start">Received by.................................</td>
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
