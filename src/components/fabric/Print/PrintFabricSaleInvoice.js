import React, { useCallback } from 'react'
import { common } from '../../../utils/common';
import ReceiptFooter from '../../print/ReceiptFooter';
import FabricInvoiceHead from './FabricInvoiceHead';
import FabricInvoiceCommonHeader from './FabricInvoiceCommonHeader';

export default function PrintFabricSaleInvoice({ printRef, mainData }) {
    const vat = parseFloat(process.env.REACT_APP_VAT);
    let subTotal=0;
    let total=0;
    let vatAmount=0;
    const hasKeys = (obj) => {
        return Object.keys(obj).length > 0;
    }

    const calculate= useCallback(() => {
        var vatAmount=common.calculatePercent(subTotal-mainData?.discountAmount,vat);
        var total=subTotal-mainData?.discountAmount+vatAmount;
        return{vatAmount:vatAmount,total:total}

    },[subTotal,mainData?.discountAmount,mainData])

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
                            customerName={mainData.firstName === undefined ? mainData?.customerName : mainData?.firstName + "  " + mainData?.lastName}
                            saleDate={mainData?.saleDate}
                            contact={mainData?.primaryContact ?? mainData?.contact}
                            deleiverDate={mainData?.deliveryDate}
                            salesman={mainData?.salesman ?? mainData?.salesmanName} taxInvoiceNo={mainData?.taxInvoiceNo} />
                        <div className="card-body">
                            <div className="table-responsive1">
                                <table className="table table-invoice" style={{ fontSize: '12px' }}>
                                    <thead>
                                        <tr>
                                            <th className='text-center all-border' width="5%" style={{ width: 'max-content !important' }}>S.No.</th>
                                            <th className="text-center all-border" width="40%">DESCRIPTION</th>
                                            <th className="text-center all-border" width="10%">Size</th>
                                            <th className="text-center all-border" width="5%">Qty.</th>
                                            <th className="text-center all-border" width="10%">Price/Peice</th>
                                            <th className="text-center all-border" width="5%">Price</th>
                                            <th className="text-center all-border" width="5%">Vat</th>
                                            <th className="text-center all-border" width="5%">Total</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {
                                            // Ensure fabricSaleDetails is defined
                                            mainData?.fabricSaleDetails ? (
                                                // Step 1: Group by fabricCode
                                                Object.entries(
                                                    mainData.fabricSaleDetails.reduce((acc, ele) => {
                                                        const fabricCode = ele?.fabricCode ?? ele?.fabric?.fabricCode;
                                                        // If this fabricCode is already in the accumulator, update the values
                                                        if (acc[fabricCode]) {
                                                            acc[fabricCode].qty += ele.qty;
                                                            acc[fabricCode].subTotalAmount += ele.subTotalAmount;
                                                            acc[fabricCode].vatAmount += ele.vatAmount;
                                                            acc[fabricCode].totalAmount += ele.totalAmount;
                                                        } else {
                                                            // Otherwise, initialize it with the first occurrence
                                                            acc[fabricCode] = { ...ele };
                                                            acc[fabricCode].fabricSize = ele?.fabric?.fabricSizeName;
                                                           
                                                        }
                                                        total+=ele.totalAmount;
                                                        subTotal+=ele.subTotalAmount;
                                                        vatAmount+=ele.vatAmount;

                                                        return acc;
                                                    }, {})                                                  
                                                ).map(([fabricCode, item], index) => {
                                                    return (
                                                        <tr key={item.id || index} className='print-table-height'>
                                                            <td className={"text-center border border-secondary" + getClassName(item, index)} width="5%" style={{ width: 'max-content !important' }}>
                                                                {index + 1}.
                                                            </td>
                                                            <td className={"text-center border border-secondary text-wrap" + getClassName(item, index)} width="40%">
                                                                {`${fabricCode} - ${item?.fabricBrand ?? item?.fabric?.brandName} - ${item?.fabricType ?? item?.fabric?.fabricTypeName} - ${item?.fabricPrintType ?? item?.fabric?.fabricPrintType} - ${item?.fabricColor ?? item?.fabric?.fabricColorName} - ${item?.description ?? ""}`}
                                                            </td>
                                                            <td className={"text-center border border-secondary" + getClassName(item, index)} width="5%">
                                                                {item.fabricSize}
                                                            </td>
                                                            <td className={"text-center border border-secondary" + getClassName(item, index)} width="10%">
                                                                {item.qty}
                                                            </td>
                                                            <td className={"text-center border border-secondary" + getClassName(item, index)} width="10%">
                                                                {common.printDecimal(item.subTotalAmount / item.qty, true)} {/* Calculate per unit price */}
                                                            </td>
                                                            <td className={"text-center border border-secondary" + getClassName(item, index)} width="5%">
                                                                {common.printDecimal(item.subTotalAmount, true)}
                                                            </td>
                                                            <td className={"text-center border border-secondary" + getClassName(item, index)} width="5%">
                                                                {common.printDecimal(item.vatAmount, true)}
                                                            </td>
                                                            <td className={"text-center border border-secondary" + getClassName(item, index)} width="5%">
                                                                {common.printDecimal(item.totalAmount, true)}
                                                            </td>
                                                        </tr>
                                                    );
                                                })
                                            ) : null // Render nothing if fabricSaleDetails is undefined
                                        }
                                    </tbody>


                                </table>
                                <table className='table table-bordered'>
                                    <tbody>
                                        <tr>
                                            <td colSpan={3} className="text-start"><i className='bi bi-call' />{process.env.REACT_APP_COMPANY_MOBILE} <i className='bi bi-whatsapp text-success'></i></td>
                                            <td colSpan={1} className="text-center">
                                                <strong>Quantity(s) </strong>
                                            </td>
                                            <td colSpan={2} className="text-center"><strong>VAT</strong> {vat}%</td>
                                            <td colSpan={2} rowSpan={4} className="fs-6 fw-bold text-center">
                                                <ul>
                                                    <li style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between' }}>
                                                        <span style={{ fontWeight: 'normal' }}>Sub Total</span>
                                                        <span>{common.printDecimal(subTotal)}</span>
                                                    </li>
                                                    {mainData?.discountAmount > 0 &&
                                                        <li style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between' }}>
                                                            <span style={{ fontWeight: 'normal' }}>Discount</span>
                                                            <span>(-) {common.printDecimal(mainData?.discountAmount)}</span>
                                                        </li>
                                                    }
                                                    <li style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between' }}>
                                                        <span style={{ fontWeight: 'normal' }}>VAT</span>
                                                        <span>{common.printDecimal(calculate().vatAmount)}</span>
                                                    </li>
                                                    <li style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between' }}>
                                                        <span style={{ fontWeight: 'normal' }}>Payable</span>
                                                        <span>{common.printDecimal(calculate().total)}</span>
                                                    </li>
                                                    {mainData?.advanceAmount > 0 && <li style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between' }}>
                                                        <span style={{ fontWeight: 'normal' }}>Advance</span>
                                                        <span>{common.printDecimal((mainData?.advanceAmount))}</span>
                                                    </li>
                                                    }

                                                    {mainData?.cancelledAmount > 0 &&
                                                        <li style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between' }}>
                                                            <span style={{ fontWeight: 'normal' }}>Cancelled</span>
                                                            <span>(-) {common.printDecimal(mainData?.cancelledAmount)}</span>
                                                        </li>
                                                    }
                                                    {mainData?.paidAmount !== 0 && <li style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between' }}>
                                                        <span style={{ fontWeight: 'normal' }}>Paid</span>
                                                        <span>{common.printDecimal((mainData?.paidAmount))}</span>
                                                    </li>
                                                    }
                                                    {mainData?.refundAmount !== 0 && <li style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between' }}>
                                                        <span style={{ fontWeight: 'normal' }}>Refund</span>
                                                        <span>{common.printDecimal((mainData?.refundAmount))}</span>
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
                                            <td colSpan={1} className="text-center" >
                                                <div>
                                                    <strong>Total Qty</strong>
                                                </div>
                                                <div>
                                                    {mainData?.fabricSaleDetails?.filter(x => !x.isDeleted && !x.isCancelled)?.length}
                                                </div>
                                                {mainData?.fabricSaleDetails?.filter(x => x.isCancelled)?.length > 0 && <>   <div>
                                                    <strong>Cancelled Qty</strong>
                                                </div>
                                                    <div>
                                                        {mainData?.fabricSaleDetails?.filter(x => x.isCancelled)?.length}
                                                    </div></>
                                                }
                                            </td>
                                            <td className="text-center">
                                                <div>
                                                    <strong>Total VAT</strong>
                                                </div>
                                                <div>
                                                    {common.printDecimal(calculate().vatAmount)}
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
