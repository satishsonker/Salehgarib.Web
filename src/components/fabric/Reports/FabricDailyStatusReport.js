import { useState, useRef, useMemo, useCallback } from 'react';
import { useReactToPrint } from 'react-to-print';
import { apiUrls } from '../../../apis/ApiUrls';
import { Api } from '../../../apis/Api';
import { common } from '../../../utils/common';
import Breadcrumb from '../../common/Breadcrumb';
import Inputbox from '../../common/Inputbox';
import ButtonBox from '../../common/ButtonBox';
import { headerFormat } from '../../../utils/tableHeaderFormat';
import { PrintFabricDailyStatusReport } from '../Print/PrintFabricDailyStatusReport';
import FabricDailyStatusTable from '../CommonComponent/FabricDailyStatusTable';

export default function FabricfabricDailyStatusReport() {
    const [statusDate, setStatusDate] = useState(common.getHtmlDate(new Date()));
    const [statusData, setStatusData] = useState({});
    const [paymentModeFilter, setPaymentModeFilter] = useState('All');
    const VAT = parseFloat(process.env.REACT_APP_VAT);
    const printStatusReportRef = useRef();

    const getStatusData = useCallback(async () => {
        try {
            const res = await Api.Get(`${apiUrls.fabricReportController.fabricDailyStatusReport}${statusDate}`);
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
            ? statusData.statements?.filter(item => item.reason !== 'Discount')
            : statusData.statements?.filter(item => item.paymentMode === paymentModeFilter && item.reason !== 'Discount')
    ), [statusData.statements, paymentModeFilter]);

    const paymentModes = useMemo(() => (
        ['All', ...new Set(statusData.statements?.map(item => item.paymentMode))].filter(Boolean)
    ), [statusData.statements]);

    const breadcrumbOption = useMemo(() => ({
        title: 'Fabric Daily Status Report',
        items: [
            { title: "Report", icon: "bi bi-journal-bookmark-fill", isActive: false },
            { title: "Fabric Daily Status Report", icon: "bi bi-file-bar-graph", isActive: false }
        ]
    }), []);

    const btnList = useMemo(() => [
        { type: 'Go', onClickHandler: getStatusData, className: 'btn-sm' },
        { type: 'Print', onClickHandler: printStatusHandler, className: 'btn-sm' }
    ], [getStatusData, printStatusHandler]);

    const calculateTotal = (data, filterCondition, key) => {
        var res = data?.filter(filterCondition).reduce((sum, item) => sum + item[key], 0) || 0
        return res;
    };

    const getUniqueSales = () => {
        const uniqueSales = {};

        filteredAccountStatements?.forEach(statement => {
            if (statement.fabricSale && uniqueSales[statement.fabricSale.invoiceNo] === undefined) {
                uniqueSales[statement.fabricSale.invoiceNo] = statement.fabricSale;
            }
        });

        return Object.values(uniqueSales);
    };

    const getSum = useMemo(() => {
        const data = getUniqueSales();

        // Pre-calculate common totals
        const totalQty = calculateTotal(data, () => true, "qty");
        const subTotal = calculateTotal(data, () => true, "subTotalAmount");
        const vat = calculateTotal(data, () => true, "vatAmount");
        const discount = calculateTotal(data, () => true, "discountAmount");

        // Sales-related totals
        const totalSaleAmount = subTotal + vat;
        const netSales = (subTotal - discount) + vat;

        // Helper: advance/delivery by mode
        const getAmountByMode = (reason) => (mode) =>
            filteredAccountStatements?.reduce((sum, ele) => {
                const matchesMode =
                    ele.paymentMode?.toLowerCase() === mode &&
                    (paymentModeFilter?.toLowerCase() === mode || paymentModeFilter === "All");

                return matchesMode && ele.reason?.toLowerCase() === reason
                    ? sum + (ele.credit || 0)
                    : sum;
            }, 0) || 0;

        const totalAdvanceAmount = getAmountByMode("advancedpaid");
        const totalDeliveryAmount = getAmountByMode("paymentreceived");

        // VAT tax amount
        const totalVatTax = totalSaleAmount - common.calculatePercent(totalSaleAmount, 100 - VAT);

        return {
            totalBookingQty: totalQty,
            totalSaleAmount: common.printDecimal(totalSaleAmount),
            totalDiscountAmount: common.printDecimal(discount),
            totalAmount: common.printDecimal(netSales),
            totalAdvanceAmount,
            totalDeliveryAmount,
            totalVatTax: common.printDecimal(totalVatTax),
        };
    }, [filteredAccountStatements, paymentModeFilter, VAT]);


    return (
        <>
            <Breadcrumb option={breadcrumbOption} />
            <div className="d-flex justify-content-end">
                <div className="d-flex mx-2">
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
                        <FabricDailyStatusTable
                            data={filteredAccountStatements}
                            totals={getSum}
                            headers={headerFormat.fabricDailyStatusReport}
                        />
                    </div>
                </div>
            </div>
            <div className="d-none">
                <PrintFabricDailyStatusReport ref={printStatusReportRef} props={{ data: filteredAccountStatements, date: statusDate, sum: getSum }} />
            </div>
        </>
    );
}
