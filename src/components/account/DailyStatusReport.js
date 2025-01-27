import React, { useState, useRef, useMemo, useCallback } from 'react';
import { Api } from '../../apis/Api';
import { apiUrls } from '../../apis/ApiUrls';
import { common } from '../../utils/common';
import Breadcrumb from '../common/Breadcrumb';
import ButtonBox from '../common/ButtonBox';
import Inputbox from '../common/Inputbox';
import { useReactToPrint } from 'react-to-print';
import { PrintDailyStatusReport } from '../print/admin/account/PrintDailyStatusReport';
import { headerFormat } from '../../utils/tableHeaderFormat';

export default function DailyStatusReport() {
    const [statusDate, setStatusDate] = useState(common.getHtmlDate(new Date()));
    const [statusData, setStatusData] = useState({});
    const [paymentModeFilter, setPaymentModeFilter] = useState('All');
    const VAT = parseFloat(process.env.REACT_APP_VAT);
    const printStatusReportRef = useRef();

    const getStatusData = useCallback(async () => {
        try {
            const res = await Api.Get(`${apiUrls.reportController.getDailyStatusReport}${statusDate}`);
            setStatusData(res.data);
        } catch (error) {
            console.error('Error fetching status data:', error);
        }
    }, [statusDate]);

    const printStatusHandler = useReactToPrint({
        content: () => printStatusReportRef.current,
    });

    const filteredAccountStatements = useMemo(() => (
        paymentModeFilter === 'All'
            ? statusData.customerAccountStatements
            : statusData.customerAccountStatements?.filter(item => item.paymentMode === paymentModeFilter)
    ), [statusData.customerAccountStatements, paymentModeFilter]);

    const paymentModes = useMemo(() => (
        ['All', ...new Set(statusData.customerAccountStatements?.map(item => item.paymentMode))].filter(Boolean)
    ), [statusData.customerAccountStatements]);

    const breadcrumbOption = useMemo(() => ({
        title: 'Daily Status Report',
        items: [
            { title: "Report", icon: "bi bi-journal-bookmark-fill", isActive: false },
            { title: "Daily Status Report", icon: "bi bi-file-bar-graph", isActive: false }
        ]
    }), []);

    const btnList = useMemo(() => [
        { type: 'Go', onClickHandler: getStatusData, className: 'btn-sm' },
        { type: 'Print', onClickHandler: printStatusHandler, className: 'btn-sm' }
    ], [getStatusData, printStatusHandler]);

    const calculateTotal = (data, filterCondition, key) => {
        var res = data?.filter(filterCondition).reduce((sum, item) => sum + item[key], 0) || 0
        return res;
    }
        ;

    const totalBookingQty = useMemo(() => (
        calculateTotal(statusData.orders, x => paymentModeFilter === 'All' || x.paymentMode === paymentModeFilter, 'qty')
    ), [statusData.orders, paymentModeFilter]);

    const totalBookingAmount = useMemo(() => (
        common.printDecimal(calculateTotal(statusData.orders, x => paymentModeFilter === 'All' || x.paymentMode === paymentModeFilter, 'totalAmount'))
    ), [statusData.orders, paymentModeFilter]);

    const totalAdvanceAmount = useCallback((mode) => (
        common.printDecimal(filteredAccountStatements?.reduce((sum, ele) =>
            (ele.paymentMode?.toLowerCase() ===mode && (paymentModeFilter?.toLowerCase()===mode || paymentModeFilter==='All')) && ele.reason === "AdvancedPaid" ? sum + ele.credit : sum
            , 0) || 0)
    ), [filteredAccountStatements, paymentModeFilter]);

    const totalDeliveredQty = useMemo(() => (
        calculateTotal(filteredAccountStatements, ele => paymentModeFilter === 'All' || ele.paymentMode?.toLowerCase() === paymentModeFilter?.toLowerCase(), 'deliveredQty')
    ), [filteredAccountStatements, paymentModeFilter]);

    const totalDeliveryAmount = useCallback((mode) => (
        common.printDecimal(filteredAccountStatements?.reduce((sum, ele) => {
            return ele.paymentMode?.toLowerCase() === mode && (paymentModeFilter?.toLowerCase() === mode || paymentModeFilter === 'All') && ele.reason?.toLowerCase() === 'paymentreceived' ? sum + ele.credit : sum
        }, 0) || 0)
    ), [filteredAccountStatements, paymentModeFilter]);

    const totalSalesAmount = useMemo(() => (
        calculateTotal(filteredAccountStatements, ele => paymentModeFilter === 'All' || paymentModeFilter?.toLowerCase() === ele.paymentMode?.toLowerCase(), 'credit')
    ), [filteredAccountStatements, paymentModeFilter]);

    const totalVatTax = useMemo(() => (
        common.printDecimal(totalSalesAmount - common.calculatePercent(totalSalesAmount, 95))
    ), [totalSalesAmount]);

    const totalExpenseAmount = useMemo(() => (
        common.printDecimal(statusData.expenseAmount || 0)
    ), [statusData.expenseAmount]);

    return (
        <>
            <Breadcrumb option={breadcrumbOption} />
            <div className="d-flex justify-content-between">
                <h6 className="mb-0 text-uppercase">Daily Status Report</h6>
                <div className="d-flex">
                    <Inputbox
                        title="From Date"
                        max={common.getHtmlDate(new Date())}
                        onChangeHandler={e => setStatusDate(e.target.value)}
                        name="fromDate"
                        value={statusDate}
                        className="form-control-sm"
                        showLabel={false}
                        type="date"
                    />
                    <ButtonBox btnList={btnList} />
                </div>
            </div>
            <hr />
            <div className="d-flex mb-3">
                {paymentModes.map((mode, index) => (
                    <div key={index} className="form-check form-check-inline">
                        <input
                            className="form-check-input"
                            type="radio"
                            name="paymentMode"
                            id={`paymentMode-${mode}`}
                            value={mode}
                            checked={paymentModeFilter === mode}
                            onChange={() => setPaymentModeFilter(mode)}
                        />
                        <label className="form-check-label" htmlFor={`paymentMode-${mode}`}>
                            {mode}
                        </label>
                    </div>
                ))}
            </div>
            <div className="card">
                <div className="card-body">
                    <div className="table-responsive">
                        <table className="table table-bordered table-striped fixTableHead">
                            <thead>
                                <tr>
                                    {headerFormat.dailyStatusReport?.map((ele, index) => (
                                        <th key={index} className="text-center">{ele}</th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody>
                                {filteredAccountStatements?.length > 0 ? (
                                    filteredAccountStatements.map((res, index) => (
                                        <tr key={index} style={{ fontSize: '12px' }}>
                                            <td className="text-center">{index + 1}</td>
                                            <td className="text-center">{res?.order?.orderNo}</td>
                                            <td className="text-center">{common.printDecimal(res.isFirstAdvance ? res.order.totalAmount : ((res.balance || 0) + (res.credit || 0)))}</td>
                                            <td className="text-center">{(res.deliveredQty || 0)}/{res?.order?.qty}</td>
                                            <td className="text-center">{common.printDecimal(res.credit)}</td>
                                            <td className="text-center">{common.printDecimal(res.balance)}</td>
                                            <td className="text-center">{res.paymentMode}</td>
                                            <td className="text-center">
                                                {res.isFirstAdvance ? "Booking Advance" : (res.reason?.toLowerCase() === "advancedpaid" ? "Advance" : "Delivery")}
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan={headerFormat.dailyStatusReport.length} className="text-center text-danger">No Record Found For Payment</td>
                                    </tr>
                                )}
                                {/* Aggregated Data Rows */}
                                <tr><td colSpan={headerFormat.dailyStatusReport.length - 1} className="text-end">Total Booking Orders Qty</td><td className="text-end">{totalBookingQty}</td></tr>
                                <tr><td colSpan={headerFormat.dailyStatusReport.length - 1} className="text-end">Total Booking Amount</td><td className="text-end">{totalBookingAmount}</td></tr>
                                <tr><td colSpan={headerFormat.dailyStatusReport.length - 1} className="text-end">Total Booking Advance Cash</td><td className="text-end">{totalAdvanceAmount('cash')}</td></tr>
                                <tr><td colSpan={headerFormat.dailyStatusReport.length - 1} className="text-end">Total Booking Advance VISA</td><td className="text-end">{totalAdvanceAmount('visa')}</td></tr>
                                <tr><td colSpan={headerFormat.dailyStatusReport.length - 1} className="text-end">Total Delivered Qty</td><td className="text-end">{totalDeliveredQty}</td></tr>
                                <tr><td colSpan={headerFormat.dailyStatusReport.length - 1} className="text-end">Total Delivery Cash</td><td className="text-end">{totalDeliveryAmount('cash')}</td></tr>
                                <tr><td colSpan={headerFormat.dailyStatusReport.length - 1} className="text-end">Total Delivery VISA</td><td className="text-end">{totalDeliveryAmount('visa')}</td></tr>
                                <tr><td colSpan={headerFormat.dailyStatusReport.length - 1} className="text-end">Total Net Sale Amount</td><td className="text-end">{common.printDecimal(totalSalesAmount)}</td></tr>
                                <tr><td colSpan={headerFormat.dailyStatusReport.length - 1} className="text-end">Total Vat Tax {VAT}%</td><td className="text-end">{totalVatTax}</td></tr>
                                <tr><td colSpan={headerFormat.dailyStatusReport.length - 1} className="text-end">Total Expenses</td><td className="text-end">{totalExpenseAmount}</td></tr>
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
            <div className="d-none">
                <PrintDailyStatusReport ref={printStatusReportRef} props={{ data: statusData, date: statusDate }} />
            </div>
        </>
    );
}
