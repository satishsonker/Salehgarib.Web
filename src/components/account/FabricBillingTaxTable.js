import React, { useEffect, useState, useRef } from 'react'
import { common } from '../../utils/common'
import { headerFormat } from '../../utils/tableHeaderFormat';
import PrintFabricSaleInvoice from '../fabric/Print/PrintFabricSaleInvoice';
import { Api } from '../../apis/Api';
import { apiUrls } from '../../apis/ApiUrls';
import { useReactToPrint } from 'react-to-print';
export default function FabricBillingTaxTable({ billingData, showPrintOption = true, showBalanceVat = true, forReport = false, showBalanceAmount = true }) {
    const headers = headerFormat.FabricBillingTaxReport;
    const printInvoiceRef = useRef();
    const printInvoiceHandler = useReactToPrint({
        content: () => printInvoiceRef.current
    })
    
    const [selectedInvoiceId, setSelectedInvoiceId] = useState(0);
    const [selectedInvoiceData, setSelectedInvoiceData] = useState({});

    const VAT = parseFloat(process.env.REACT_APP_VAT);
    const modelId = "printTaxInvoiceReceiptModel";
    useEffect(() => {
        if (selectedInvoiceId <= 0)
            return
        Api.Get(apiUrls.fabricSaleController.getInvoiceByInvoiceId + selectedInvoiceId)
            .then(res => {
                setSelectedInvoiceData({ ...res.data });
            });
    }, [selectedInvoiceId])

    useEffect(() => {
        if (selectedInvoiceData?.id > 0) {
            printInvoiceHandler();
        }
    }, [selectedInvoiceData])

    const calBalVat = (res) => {
        return res?.BalanceAmount / (100 + VAT) * VAT;
    }
    const calBalAmount = (res) => {
        return res?.BalanceAmount;
    }

    //-----------------------
    const sortedData = [...billingData].sort((a, b) => {
        const dateA = new Date(a.taxInvoiceDate);
        const dateB = new Date(b.taxInvoiceDate);
        return dateA - dateB; // Ascending order
    });

    // Step 2: Group data by taxInvoiceDate
    const groupedData = sortedData.reduce((acc, item) => {
        const date = common.getHtmlDate(item.taxInvoiceDate);
        if (!acc[date]) {
            acc[date] = [];
        }
        acc[date].push(item);
        return acc;
    }, {});
    const getHeaders = () => {
        return headers
            .filter(res => {
                if (!showPrintOption && res?.prop === "print") return false;
                if (!showBalanceVat && res?.prop === "balanceVat") return false;
                if (!showBalanceAmount && res?.prop === "balanceAmount") return false;
                return true;
            })
            .map((res, index) => (
                <th style={{ width: 'auto' }} key={index} className='text-center'>{res?.name}</th>
            ))
    }

    const tablePortion = (date) => {
        return <table className={"table-striped fixTableHead  table table-bordered"} style={{ fontSize: '12px', minWidth: '130%' }}>
            <thead>
                <tr>
                    {getHeaders()}
                </tr>
            </thead>
            <tbody>
                {groupedData[date]?.map((entry, index) => (
                    <>
                        <tr key={index} style={{ fontSize: '12px' }}>
                            {showPrintOption && <td className='text-center' style={{ padding: '5px', width: 'auto' }}>
                                <div style={{ cursor: "pointer", fontSize: '16px' }}
                                    onClick={e => setSelectedInvoiceId(entry?.id)}
                                    className="text-success"
                                    data-bs-placement="bottom"
                                    bs-toggle="tooltip"
                                    title={`Print Tax Invoice for Invoice No: ${entry?.taxInvoiceNo}`}
                                    data-bs-toggle="modal"
                                    data-bs-target={"#" + modelId}>
                                    <i className="bi bi-printer"></i>
                                </div>
                            </td>}
                            <td className='text-center' style={{ padding: '5px', width: 'auto' }}>{index + 1}</td>
                            <td className='text-center' style={{ padding: '5px', width: 'auto' }}>{common.getHtmlDate(entry?.taxInvoiceDate, 'ddmmyyyy')}</td>
                            <td className='text-center' style={{ padding: '5px', width: 'auto' }}>{entry?.taxInvoiceNo}</td>
                            <td className='text-center' style={{ padding: '5px', width: 'auto' }}>{entry?.invoiceNo}</td>
                            <td className='text-center' style={{ padding: '5px', width: 'auto' }}>{entry?.qty}</td>
                            <td className='text-center' style={{ padding: '5px', width: 'auto' }}>{common.printDecimal(entry?.subTotalAmount)}</td>
                            <td className='text-center' style={{ padding: '5px', width: 'auto' }}>{common.printDecimal(entry?.discountAmount)}</td>
                            <td className='text-center' style={{ padding: '5px', width: 'auto' }}>{common.printDecimal(entry?.vatAmount)}</td>

                            <td className='text-center' style={{ padding: '5px', width: 'auto' }}>{common.printDecimal(entry?.totalAmount)}</td>
                            <td className='text-center' style={{ padding: '5px', width: 'auto' }}>{common.printDecimal((entry?.paidAmount + entry?.advanceAmount))}</td>
                            {showBalanceAmount && <td className={calBalAmount(entry) < 0 ? 'bg-danger text-center' : 'text-center'} style={{ padding: '5px', width: 'auto' }} data-toggle="tooltip" title={calBalAmount(entry) < 0 ? "Customer has paid more than order amount" : ""}>{common.printDecimal(calBalAmount(entry))}</td>}
                            <td className='text-center' style={{ padding: '5px', width: 'auto' }}>{common.printDecimal(entry?.vatAmount)}</td>
                            {showBalanceVat && <td className={calBalVat(entry) < 0 ? 'bg-danger text-center' : 'text-center'} style={{ padding: '5px', width: 'auto' }} data-toggle="tooltip" title={calBalVat(entry) < 0 ? "Customer has paid more than order VAT" : ""}>{common.printDecimal(calBalVat(entry))}</td>}
                        </tr>
                    </>
                ))}
                <tr>
                    <td colSpan={5}></td>
                    <td className='text-center fw-bold'>{common.calculateSum(groupedData[date], "qty")}</td>
                    <td className='text-center fw-bold'>{common.printDecimal(common.calculateSum(groupedData[date], "subTotalAmount"))}</td>
                    <td className='text-center fw-bold'>{common.printDecimal(common.calculateSum(groupedData[date], "discountAmount"))}</td>
                    <td className='text-center fw-bold'>{common.printDecimal(common.calculateSum(groupedData[date], "vatAmount"))}</td>
                    <td className='text-center fw-bold'>{common.printDecimal(common.calculateSum(groupedData[date], "totalAmount"))}</td>
                    <td className='text-center fw-bold'>{common.printDecimal(common.calculateSum(groupedData[date], "paidAmount"))}</td>
                    <td className='text-center fw-bold'>{common.printDecimal(common.calculateSum(groupedData[date], "balanceAmount"))}</td>
                    <td className='text-center fw-bold'>{common.printDecimal((((common.calculateSum(groupedData[date], "paidAmount") + common.calculateSum(groupedData[date], "advanceAmount")) / (100 + VAT)) * VAT))}</td>
                    {showBalanceVat && <td className={'text-center'} style={{ padding: '5px', width: 'auto' }} data-toggle="tooltip">{common.printDecimal(common.calculateSum(groupedData[date], "balanceAmount"))}</td>}
                </tr>
            </tbody>
        </table>
    }
    //-----------------------
    return (
        <div style={{ overflow: 'auto' }}>
            {!forReport && Object.keys(groupedData).map((date) => (
                <React.Fragment key={date}>
                    <div style={{ fontWeight: 'bold', textAlign: 'center', padding: '10px 0', backgroundColor: '#f8f9fa', marginTop: '10px' }}>
                        {date}
                    </div>
                    {tablePortion(date)}
                </React.Fragment>
            ))}
            {forReport && <div>
                <table className='table-striped fixTableHead table table-bordered'>
                    <thead>
                        <tr>
                            {getHeaders()}
                        </tr>
                    </thead>
                    <tbody>
                        {
                            (() => {
                                let rowCounter = 0;
                                return Object.keys(groupedData).map((date) => (
                                    <React.Fragment key={date}>
                                        {groupedData[date]?.map((entry) => (
                                            <tr key={entry.id || rowCounter} style={{ fontSize: '12px' }}>
                                                {showPrintOption && (
                                                    <td className='text-center' style={{ padding: '5px', width: 'auto' }}>
                                                        <div style={{ cursor: "pointer", fontSize: '16px' }}
                                                            onClick={() => setSelectedInvoiceId(entry?.id)}
                                                            className="text-success"
                                                            data-bs-placement="bottom"
                                                            data-bs-toggle="tooltip"
                                                            title={`Print Tax Invoice for Invoice No: ${entry?.taxInvoiceNo}`}
                                                            data-bs-target={"#" + modelId}>
                                                            <i className="bi bi-printer"></i>
                                                        </div>
                                                    </td>
                                                )}
                                                <td className='text-center' style={{ padding: '5px', width: 'auto' }}>{++rowCounter}</td>
                                                <td className='text-center' style={{ padding: '5px', width: 'auto' }}>{common.getHtmlDate(entry?.taxInvoiceDate, 'ddmmyyyy')}</td>
                                                <td className='text-center' style={{ padding: '5px', width: 'auto' }}>{entry?.taxInvoiceNo}</td>
                                                <td className='text-center' style={{ padding: '5px', width: 'auto' }}>{entry?.invoiceNo}</td>
                                                <td className='text-center' style={{ padding: '5px', width: 'auto' }}>{entry?.qty}</td>
                                                <td className='text-center' style={{ padding: '5px', width: 'auto' }}>{common.printDecimal(entry?.subTotalAmount)}</td>
                                                <td className='text-center' style={{ padding: '5px', width: 'auto' }}>{common.printDecimal(entry?.discountAmount)}</td>
                                                <td className='text-center' style={{ padding: '5px', width: 'auto' }}>{common.printDecimal(entry?.vatAmount)}</td>
                                                <td className='text-center' style={{ padding: '5px', width: 'auto' }}>{common.printDecimal(entry?.totalAmount)}</td>
                                                <td className='text-center' style={{ padding: '5px', width: 'auto' }}>{common.printDecimal((entry?.paidAmount + entry?.advanceAmount))}</td>
                                                {showBalanceAmount && (
                                                    <td className={calBalAmount(entry) < 0 ? 'bg-danger text-center' : 'text-center'} style={{ padding: '5px', width: 'auto' }} data-toggle="tooltip" title={calBalAmount(entry) < 0 ? "Customer has paid more than order amount" : ""}>{common.printDecimal(calBalAmount(entry))}</td>
                                                )}
                                                <td className='text-center' style={{ padding: '5px', width: 'auto' }}>{common.printDecimal(entry?.vatAmount)}</td>
                                                {showBalanceVat && (
                                                    <td className={calBalVat(entry) < 0 ? 'bg-danger text-center' : 'text-center'} style={{ padding: '5px', width: 'auto' }} data-toggle="tooltip" title={calBalVat(entry) < 0 ? "Customer has paid more than order VAT" : ""}>{common.printDecimal(calBalVat(entry))}</td>
                                                )}
                                            </tr>
                                        ))}
                                    </React.Fragment>
                                ));
                            })()
                        }
                        <tr>
                            <td colSpan={4}></td>
                            <td className='text-center fw-bold'>{common.calculateSum(sortedData, "qty")}</td>
                            <td className='text-center fw-bold'>{common.printDecimal(common.calculateSum(sortedData, "subTotalAmount"))}</td>
                            <td className='text-center fw-bold'>{common.printDecimal(common.calculateSum(sortedData, "discountAmount"))}</td>
                            <td className='text-center fw-bold'>{common.printDecimal(common.calculateSum(sortedData, "vatAmount"))}</td>
                            <td className='text-center fw-bold'>{common.printDecimal(common.calculateSum(sortedData, "totalAmount"))}</td>
                            <td className='text-center fw-bold'>{common.printDecimal(common.calculateSum(sortedData, "paidAmount"))}</td>
                            <td className='text-center fw-bold'>{common.printDecimal(common.calculateSum(sortedData, "vatAmount"))}</td>
                            {showBalanceVat && (
                                <td className='text-center' style={{ padding: '5px', width: 'auto' }} data-toggle="tooltip">{common.printDecimal(((common.calculateSum(sortedData, "balanceAmount") / (100 + VAT)) * VAT))}</td>
                            )}
                        </tr>
                    </tbody>
                </table>
            </div>
            }
            <div className='d-none'>
                <PrintFabricSaleInvoice mainData={selectedInvoiceData} printRef={printInvoiceRef} />
            </div>

        </div>
    )
}

