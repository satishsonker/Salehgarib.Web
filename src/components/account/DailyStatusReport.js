import React, { useState, useRef, useMemo } from 'react'
import { Api } from '../../apis/Api';
import { apiUrls } from '../../apis/ApiUrls';
import { common } from '../../utils/common'
import Breadcrumb from '../common/Breadcrumb'
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

    const getStatusData = async () => {
        const res = await Api.Get(`${apiUrls.reportController.getDailyStatusReport}${statusDate}`);
        setStatusData(res.data);
    };

    const printStatusHandler = useReactToPrint({
        content: () => printStatusReportRef.current,
    });

    // Filtered data based on payment mode
    const filteredAccountStatements = useMemo(() => (
        paymentModeFilter === 'All'
            ? statusData.customerAccountStatements
            : statusData.customerAccountStatements?.filter(item => item.paymentMode === paymentModeFilter)
    ), [statusData.customerAccountStatements, paymentModeFilter]);

    // Extract unique payment modes from data for radio buttons
    const paymentModes = useMemo(() => {
        const modes = ['All', ...new Set(statusData.customerAccountStatements?.map(item => item.paymentMode))];
        return modes.filter(mode => mode); // Remove any undefined values
    }, [statusData.customerAccountStatements]);

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

    const totalBookingQty = useMemo(() => {
        return statusData?.orders?.filter(x => paymentModeFilter==='All'||x.paymentMode === paymentModeFilter)?.reduce((sum, ele) => sum + ele?.qty, 0) || 0
    }, [statusData.orders, paymentModeFilter]);

    const totalBookingAmount = useMemo(() => (
        common.printDecimal(statusData.orders?.filter(x =>paymentModeFilter==='All'|| x.paymentMode === paymentModeFilter)?.reduce((sum, ele) => sum + ele.totalAmount, 0) || 0)
    ), [statusData.orders, paymentModeFilter]);

    const totalBookingAdvanceCash = useMemo(() => (
        common.printDecimal(filteredAccountStatements?.reduce((sum, ele) =>
            (paymentModeFilter === 'All' ||(ele.paymentMode?.toLowerCase() === 'cash' && paymentModeFilter?.toLowerCase() === 'cash')) && ele.reason === "AdvancedPaid" ? sum + ele.credit : sum
            , 0) || 0)
    ), [filteredAccountStatements, paymentModeFilter]);

    const totalBookingAdvanceVisa = useMemo(() => (
        common.printDecimal(filteredAccountStatements?.reduce((sum, ele) =>
            (paymentModeFilter === 'All' || (ele.paymentMode?.toLowerCase() === 'visa' && paymentModeFilter?.toLowerCase() === 'visa')) && ele.reason === "AdvancedPaid" ? sum + ele.credit : sum
            , 0) || 0)
    ), [filteredAccountStatements, paymentModeFilter]);

    const totalDeliveredQty = useMemo(() => (
        filteredAccountStatements?.reduce((sum, ele) => (paymentModeFilter === 'All' ||ele.paymentMode?.toLowerCase() === paymentModeFilter?.toLowerCase()) ? sum + ele.deliveredQty : sum, 0) || 0
    ), [filteredAccountStatements, paymentModeFilter]);

    const totalDeliveryCash = useMemo(() => (
        common.printDecimal(filteredAccountStatements?.reduce((sum, ele) =>
            (paymentModeFilter === 'All' ||(ele.paymentMode?.toLowerCase() === 'cash' && paymentModeFilter?.toLowerCase() === 'cash')) && ele.reason?.toLowerCase() === 'paymentreceived' ? sum + ele.credit : sum
            , 0) || 0)
    ), [filteredAccountStatements]);

    const totalDeliveryVisa = useMemo(() => (
        common.printDecimal(filteredAccountStatements?.reduce((sum, ele) =>
            (paymentModeFilter === 'All' ||(ele.paymentMode?.toLowerCase() === 'visa' && paymentModeFilter?.toLowerCase() === 'visa')) && ele.reason?.toLowerCase() === 'paymentreceived' ? sum + ele.credit : sum
            , 0) || 0)
    ), [filteredAccountStatements, paymentModeFilter]);

    const totalSalesAmount = useMemo(() => (
        filteredAccountStatements?.reduce((sum, ele) => (paymentModeFilter === 'All' || paymentModeFilter?.toLowerCase() === ele?.paymentMode?.toLowerCase()) ? sum + ele.credit : 0, 0) || 0
    ), [filteredAccountStatements, paymentModeFilter]);

    const totalVatTax = useMemo(() => (
        common.printDecimal(totalSalesAmount - common.calculatePercent(totalSalesAmount, 95))
    ), [totalSalesAmount, paymentModeFilter]);

    const totalExpenseAmount = useMemo(() => (
        common.printDecimal(statusData.expenseAmount || 0)
    ), [statusData.expenseAmount]);

    return (
        <>
            <Breadcrumb option={breadcrumbOption} />
            <div className="d-flex justify-content-between">
                <h6 className="mb-0 text-uppercase">Daily Status Report</h6>
                <div>
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
                                            <td className="text-center" style={{ padding: '5px' }}>{index + 1}</td>
                                            <td className="text-center" style={{ padding: '5px' }}>{res?.order?.orderNo}</td>
                                            <td className="text-center" style={{ padding: '5px' }}>
                                                {common.printDecimal(res.isFirstAdvance ? res.order.totalAmount : ((res.balance || 0) + (res.credit || 0)))}
                                            </td>
                                            <td className="text-center" style={{ padding: '5px' }}>{(res.deliveredQty || 0)}/{res?.order?.qty}</td>
                                            <td className="text-center" style={{ padding: '5px' }}>{common.printDecimal(res.credit)}</td>
                                            <td className="text-center" style={{ padding: '5px' }}>{common.printDecimal(res.balance)}</td>
                                            <td className="text-center" style={{ padding: '5px' }}>{res.paymentMode}</td>
                                            <td className="text-center" style={{ padding: '5px' }}>
                                                {res?.isFirstAdvance ? "Booking Advance" : (res?.reason?.toLowerCase() === "advancedpaid" ? "Advance" : "Delivery")}
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan={headerFormat.dailyStatusReport.length} className="text-center text-danger">No Record Found For Payment</td>
                                    </tr>
                                )}
                                <tr style={{ fontSize: '12px' }}>
                                    <td colSpan={headerFormat.dailyStatusReport.length - 1} className="text-end">Total Booking Orders Qty</td>
                                    <td className="text-end">{totalBookingQty}</td>
                                </tr>
                                <tr style={{ fontSize: '12px' }}>
                                    <td colSpan={headerFormat.dailyStatusReport.length - 1} className="text-end">Total Booking Amount</td>
                                    <td className="text-end">{totalBookingAmount}</td>
                                </tr>
                                <tr style={{ fontSize: '12px' }}>
                                    <td colSpan={headerFormat.dailyStatusReport.length - 1} className="text-end">Total Booking Advance Cash</td>
                                    <td className="text-end">{totalBookingAdvanceCash}</td>
                                </tr>
                                <tr style={{ fontSize: '12px' }}>
                                    <td colSpan={headerFormat.dailyStatusReport.length - 1} className="text-end">Total Booking Advance VISA</td>
                                    <td className="text-end">{totalBookingAdvanceVisa}</td>
                                </tr>
                                <tr style={{ fontSize: '12px' }}>
                                    <td colSpan={headerFormat.dailyStatusReport.length - 1} className="text-end">Total Delivered Qty</td>
                                    <td className="text-end">{totalDeliveredQty}</td>
                                </tr>
                                <tr style={{ fontSize: '12px' }}>
                                    <td colSpan={headerFormat.dailyStatusReport.length - 1} className="text-end">Total Delivery Cash</td>
                                    <td className="text-end">{totalDeliveryCash}</td>
                                </tr>
                                <tr style={{ fontSize: '12px' }}>
                                    <td colSpan={headerFormat.dailyStatusReport.length - 1} className="text-end">Total Delivery VISA</td>
                                    <td className="text-end">{totalDeliveryVisa}</td>
                                </tr>
                                <tr style={{ fontSize: '12px' }}>
                                    <td colSpan={headerFormat.dailyStatusReport.length - 1} className="text-end">Total Net Sale Amount</td>
                                    <td className="text-end">{common.printDecimal(totalSalesAmount)}</td>
                                </tr>
                                <tr style={{ fontSize: '12px' }}>
                                    <td colSpan={headerFormat.dailyStatusReport.length - 1} className="text-end">Total Vat Tax {VAT}%</td>
                                    <td className="text-end">{totalVatTax}</td>
                                </tr>
                                <tr style={{ fontSize: '12px' }}>
                                    <td colSpan={headerFormat.dailyStatusReport.length - 1} className="text-end">Total Expenses</td>
                                    <td className="text-end">{totalExpenseAmount}</td>
                                </tr>
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

