import React, { memo, useMemo, useCallback } from 'react';
import { common } from '../../../utils/common';
import ReceiptFooter from '../ReceiptFooter';
import InvoiceHead from '../../common/InvoiceHead';
import OrderCommonHeaderComponent from './OrderCommonHeaderComponent';
import DirhamSymbol from '../../common/DirhamSymbol';

const InvoicePrintLayout = memo(({ printRef, mainData, finalOrder }) => {
    const vat = parseFloat(process.env.REACT_APP_VAT);
    
    const totals = useMemo(() => {
        const cancelledOrDeletedTotal = 0;
        const cancelledOrDeletedSubTotal = 0;
        const totalVat = common.calculatePercent(mainData?.subTotalAmount - cancelledOrDeletedSubTotal, vat);
        const firstAdvanceCredit = mainData?.accountStatements?.find(x => x.isFirstAdvance)?.credit ?? 0;
        const totalBalance = mainData?.totalAmount - cancelledOrDeletedTotal - firstAdvanceCredit;
        
        return {
            cancelledOrDeletedTotal,
            totalVat,
            firstAdvanceCredit,
            totalBalance,
            activeOrderCount: mainData?.orderDetails?.filter(x => !x.isDeleted && !x.isCancelled)?.length || 0
        };
    }, [mainData, vat]);

    const getWorkOrderTypes = useCallback((workType) => {
        if (!workType) return '';
        
        const types = ['', 'Designing', 'Cutting', 'M. Emb', 'Hot Fix', 'H. Emb', 'Apliq', 'Stitching'];
        return workType.split('')
            .map(ele => types[parseInt(ele)])
            .filter(Boolean)
            .join(', ');
    }, []);

    const getModel = useCallback((ele) => {
        const res = `${common.defaultIfEmpty(ele.designCategory, "")} - ${common.defaultIfEmpty(ele.designModel, '')}`;
        return res?.trim() === '-' ? "" : res;
    }, []);

    const hasKeys = useCallback((obj) => {
        return Object.keys(obj).length > 0;
    }, []);

    const getClassName = useCallback((ele, index) => {
        if (finalOrder?.length - 1 === index) {
            return " onlyDownBorder";
        }
        return !hasKeys(ele) ? " noUpDownBorder" : "";
    }, [finalOrder?.length, hasKeys]);

    const renderOrderRows = useMemo(() => (
        finalOrder?.map((ele, index) => (
            <tr key={ele.id} className='print-table-height'>
                <td className={"text-center border border-secondary" + getClassName(ele, index)} width="1%" style={{ width: 'max-content !important' }}>
                    {hasKeys(ele) ? `${index + 1}.` : ""}
                </td>
                <td style={{paddingRight:'0',paddingLeft:'1px'}} className={"text-center border border-secondary text-wrap" + getClassName(ele, index)} width="25%">
                    {getWorkOrderTypes(ele.workType)}
                </td>
                <td className={"text-center border border-secondary" + getClassName(ele, index)} width="1%">
                    {getModel(ele)}
                </td>
                <td className={"text-center border border-secondary" + getClassName(ele, index)} width="5%">
                    {common.printDecimal(ele.qty, true)}
                </td>
                <td className={"text-center border border-secondary" + getClassName(ele, index)} width="10%">
                    <DirhamSymbol amount={common.printDecimal((ele.subTotalAmount / ele.qty), true)} />
                </td>
                <td className={"text-center border border-secondary" + getClassName(ele, index)} width="10%">
                    <DirhamSymbol amount={common.printDecimal(ele.subTotalAmount, true)} />
                </td>
                <td className={"text-center border border-secondary" + getClassName(ele, index)} width="10%">
                    <DirhamSymbol amount={common.printDecimal(ele.vatAmount, true)} />
                </td>
                <td className={"text-center border border-secondary" + getClassName(ele, index)} width="10%">
                    <DirhamSymbol amount={common.printDecimal(ele.totalAmount, true)} />
                </td>
            </tr>
        ))
    ), [finalOrder, getClassName, getModel, getWorkOrderTypes, hasKeys]);

    return (
        <div ref={printRef} style={{paddingTop:'10px'}} className="row px-3">
            <div className="col col-lg-12 mx-auto">
                <div className="card border shadow-none">
                    <div className="card-header py-3">
                        <div className="row align-items-center g-3">
                            <InvoiceHead receiptType='TAX INVOICE' />
                        </div>
                    </div>
                    <OrderCommonHeaderComponent
                        orderNo={mainData?.orderNo}
                        customerName={mainData?.customerName}
                        orderDate={mainData?.orderDate}
                        contact={mainData?.contact1}
                        orderDeliveryDate={mainData?.orderDeliveryDate}
                        salesman={mainData?.salesman}
                    />
                    <div className="card-body pb-0">
                        <div className="table-responsive1">
                            <table className="table table-invoice" style={{ fontSize: '12px' }}>
                                <thead>
                                    <tr>
                                        <th className='text-center all-border' width="1%" style={{ width: 'max-content !important' }}>S.</th>
                                        <th className="text-center all-border" style={{paddingRight:'0',paddingLeft:'1px'}} width="25%">DESCRIPTION</th>
                                        <th className="text-center all-border" width="1%">Model</th>
                                        <th className="text-center all-border" width="5%">Qty.</th>
                                        <th className="text-center all-border" width="10%">Item Price</th>
                                        <th className="text-center all-border" width="10%">Unit Price</th>
                                        <th className="text-center all-border" width="10%">Vat {vat}%</th>
                                        <th className="text-center all-border" width="10%">Total Dhs.</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {renderOrderRows}
                                </tbody>
                            </table>
                            <table className='table table-bordered'>
                                <tbody>
                                    <tr>
                                        <td colSpan={3} className="text-start">
                                            <i className='bi bi-call' />{process.env.REACT_APP_COMPANY_MOBILE} <i className='bi bi-whatsapp text-success' />
                                        </td>
                                        <td colSpan={1} className="text-end">Total Quantity</td>
                                        <td colSpan={2} className="text-center">VAT {vat}%</td>
                                        <td colSpan={1} className="fs-6 fw-bold text-center">Total Amount</td>
                                        <td colSpan={1} className="text-end">
                                            <DirhamSymbol amount={common.printDecimal(mainData?.subTotalAmount)} />
                                        </td>
                                    </tr>
                                    <tr>
                                        <td colSpan={3} className="text-start">
                                            <i className='bi bi-mail' /> {process.env.REACT_APP_COMPANY_EMAIL}<i className='bi bi-envelope text-success' />
                                        </td>
                                        <td colSpan={1} className="text-center">{totals.activeOrderCount}</td>
                                        <td className="fs-6 fw-bold text-center">Total VAT</td>
                                        <td className="text-end">
                                            <DirhamSymbol amount={common.printDecimal(totals.totalVat)} />
                                        </td>
                                        <td className="fs-6 fw-bold text-center">Gross Amount</td>
                                        <td className="text-end">
                                            <DirhamSymbol amount={common.printDecimal((mainData?.totalAmount - totals.cancelledOrDeletedTotal))} />
                                        </td>
                                    </tr>
                                    <tr>
                                        <td colSpan={6} className="text-start">Received by.................................</td>
                                        <td className="fs-6 fw-bold text-center">Total Advance</td>
                                        <td className="text-end">
                                            <DirhamSymbol amount={common.printDecimal(totals.firstAdvanceCredit)} />
                                        </td>
                                    </tr>
                                    <tr>
                                        <td colSpan={6} className="text-start"></td>
                                        <td className="fs-6 fw-bold text-center">Total Balance</td>
                                        <td className="text-end">
                                            <DirhamSymbol amount={common.printDecimal(totals.totalBalance)} />
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </div>
                    <ReceiptFooter />
                </div>
            </div>
        </div>
    );
});

InvoicePrintLayout.displayName = 'InvoicePrintLayout';

export default InvoicePrintLayout;
