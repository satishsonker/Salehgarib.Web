import React, { useState, useMemo, useCallback } from 'react';
import { common } from '../../utils/common';
import { headerFormat } from '../../utils/tableHeaderFormat';
import PrintTaxInvoiceReceipt from '../print/orders/PrintTaxInvoiceReceipt';

export default function BillingTaxTable({
  billingData = [],
  showPrintOption = true,
  showBalanceVat = true,
  forReport = false,
  showBalanceAmount = true,
}) {
  const VAT = parseFloat(process.env.REACT_APP_VAT);
  const [selectedOrderId, setSelectedOrderId] = useState(0);

  const modelId = 'printTaxInvoiceReceiptModel';
  const headers = headerFormat.billingTaxReport;

  /** Header length */
  const headerLen = useMemo(() => {
    return headers.filter((h) => {
      if (!showPrintOption && h?.prop === 'print') return false;
      if (!showBalanceVat && h?.prop === 'balanceVat') return false;
      if (!showBalanceAmount && h?.prop === 'balanceAmount') return false;
      return true;
    }).length;
  }, [headers, showPrintOption, showBalanceVat, showBalanceAmount]);

  /** Group billing data by paymentDate */
  const groupedByDate = useMemo(() => {
    return billingData.reduce((acc, item) => {
      const dateKey = common.getHtmlDate(item.paymentDate);
      if (!acc[dateKey]) acc[dateKey] = [];
      acc[dateKey].push(item);
      return acc;
    }, {});
  }, [billingData]);

  /** Calculate totals */
  const calculateSum = useCallback(
    (date, withDateFilter = true) => {
      let data = billingData;
      if (withDateFilter && date) {
        data = data.filter(
          (x) => common.getHtmlDate(x.paymentDate) === common.getHtmlDate(date)
        );
      }
      
      // Get unique orders based on orderNo to avoid double counting
      const uniqueOrders = [
        ...new Map(data.map((d) => [d.order.orderNo, d])).values(),
      ];

      return {
        paidAmount: data.reduce((sum, ele) => sum + ele.credit, 0),
        subTotalAmount: uniqueOrders.reduce(
          (sum, ele) => sum + (ele?.order.subTotalAmount || 0),
          0
        ),
        totalAmount: uniqueOrders.reduce(
          (sum, ele) => sum + (ele?.order.totalAmount || 0),
          0
        ),
        qty: uniqueOrders.reduce((sum, ele) => sum + (ele?.order.qty || 0), 0),
        paidVat: data.reduce(
          (sum, ele) => sum + common.calculatePercent(ele.credit, VAT),
          0
        ),
         balanceVat: uniqueOrders.reduce(
          (sum, ele) => sum + (common.calculatePercent(ele?.order.subTotalAmount,VAT)- common.calculatePercent(data.reduce((sum, item) => sum + item.credit, 0), VAT)
         ),0),
        balance: uniqueOrders.reduce((sum, ele) => sum + (ele?.order.balanceAmount || 0), 0)
      };
    },
    [billingData, VAT]
  );

  /** Build duplicate counts for rowspan calculations */
  const duplicateCounts = useMemo(() => {
    // const orderCountMap = {};
    // for (const ele of billingData) {
    //   const { order, paymentDate } = ele;
    //   const { orderNo, taxInvoiceNo, qty } = order;
    //   const dateKey = paymentDate ?? 'null';
    //   const orderKey = `${orderNo}_${dateKey}`;
    //   const invoiceKey = `${taxInvoiceNo}_${dateKey}`;

    //   if (!orderCountMap[orderKey]) {
    //     orderCountMap[orderKey] = {
    //       count: 0,
    //       qty: 0,
    //       balance: 0,
    //       balanceVat: 0,
    //       invoice: {},
    //     };
    //   }

    //   const orderEntry = orderCountMap[orderKey];
    //   const payDateWiseData = billingData.filter((x) => x.paymentDate === dateKey && x.order?.orderNo === orderNo);

    //   orderEntry.count += 1;
    //   orderEntry.balance = Math.min(...payDateWiseData.map((item) => item.balance));
    //   orderEntry.balanceVat = common.calculatePercent(payDateWiseData[0].order.subTotalAmount, VAT)- common.calculatePercent(payDateWiseData.reduce((sum, item) => sum + item.credit, 0), VAT);
    //   orderEntry.qty += qty;

    //   orderEntry.invoice[invoiceKey] = (orderEntry.invoice[invoiceKey] || 0) + 1;
    // }

    // return orderCountMap;
  }, [billingData, VAT]);

  /** Render header row */
  const renderHeader = () => (
    <tr>
      {headers.map((res, index) => {
        if (!showPrintOption && res?.prop === 'print') return null;
        if (!showBalanceVat && res?.prop === 'balanceVat') return null;
        if (!showBalanceAmount && res?.prop === 'balanceAmount') return null;
        return (
          <th key={index} className="text-center">
            {res?.name}
          </th>
        );
      })}
    </tr>
  );

  return (
    <>
      <div className={!forReport ? 'table-responsive' : ''}>
        <table
          className={
            (!forReport ? 'table-striped fixTableHead ' : '') + 'table table-bordered'
          }
          style={{ fontSize: '12px' }}
        >
          <thead>{renderHeader()}</thead>
          <tbody>
            {billingData.length === 0 ? (
              <tr>
                <td className="text-center text-danger" colSpan={headerLen}>
                  No Data Found
                </td>
              </tr>
            ) : (
              Object.entries(groupedByDate).map(([date, rows], dateIndex) => (
                <React.Fragment key={date}>
                  {/* Date Row */}
                  <tr>
                    <td className="text-center fw-bold fs-6" colSpan={headerLen}>
                      Date : {common.getHtmlDate(date, 'ddmmyyyy')}
                    </td>
                  </tr>

                  {/* Data Rows */}
                  {rows.map((res, index) => {
                    const orderKey = `${res.order?.orderNo}_${res.paymentDate ?? 'null'}`;
                    return (
                      <tr key={res.id || index} style={{ fontSize: '12px' }}>
                        {showPrintOption && (
                          <td className="text-center" style={{ padding: '5px' }}>
                            <div
                              style={{ cursor: 'pointer', fontSize: '16px' }}
                              onClick={() => setSelectedOrderId(res?.order?.id)}
                              className="text-success"
                              data-bs-toggle="modal"
                              data-bs-target={`#${modelId}`}
                              title={`Print Tax Invoice for Invoice No: ${common
                                .invoiceNoPadding(res.order.taxInvoiceNo)
                                .padStart(7, '0')}`}
                            >
                              <i className="bi bi-printer"></i>
                            </div>
                          </td>
                        )}
                        <td className="text-center" style={{ padding: '5px' }}>
                          {index + 1}
                        </td>
                        <td className="text-center" style={{ padding: '5px' }}>
                          {common.getHtmlDate(res.paymentDate, 'ddmmyyyy')}
                        </td>
                        <td
                            className="text-center"
                            style={{ padding: '5px' }}
                          >
                            {common
                              .invoiceNoPadding(res.order.taxInvoiceNo)
                              .padStart(7, '0')}
                          </td>
                        <td className="text-center">
                              {res.order.orderNo}
                            </td>
                            <td className="text-center">
                              {res.order.qty}
                            </td>
                            <td className="text-center">
                              {common.printDecimal(res.order.subTotalAmount)}
                            </td>
                            <td className="text-center">
                              {common.printDecimal(
                                common.calculateVAT(res.order.subTotalAmount, VAT)
                                  .vatAmount
                              )}
                            </td>
                            <td className="text-center">
                              {common.printDecimal(res.order.totalAmount)}
                            </td>

                        <td className="text-center" style={{ padding: '5px' }}>
                          {common.printDecimal(res.credit)}
                        </td>

                        <td
                            className={
                              duplicateCounts[orderKey]?.balance < 0
                                ? 'bg-danger text-center'
                                : 'text-center'
                            }
                            style={{ padding: '5px' }}
                            title={
                              duplicateCounts[orderKey]?.balance < 0
                                ? 'Customer has paid more than order amount'
                                : ''
                            }
                          >
                            {common.printDecimal(duplicateCounts[orderKey]?.balance)}
                          </td>

                        <td className="text-center" style={{ padding: '5px' }}>
                          {common.printDecimal(common.calculatePercent(res.credit, VAT))}
                        </td>

                       <td
                          className={
                              duplicateCounts[orderKey]?.balanceVat < 0
                                ? 'bg-danger text-center'
                                : 'text-center'
                            }
                            style={{ padding: '5px' }}
                            title={
                              duplicateCounts[orderKey]?.balanceVat < 0
                                ? 'Customer has paid more than order VAT'
                                : ''
                            }
                          >
                            {common.printDecimal(
                              duplicateCounts[orderKey]?.balanceVat
                            )}
                          </td>
                      </tr>
                    );
                  })}

                  {/* Totals Row */}
                  <tr>
                    <td colSpan={forReport ? headerLen - 6 : headerLen - 8}>
                      Total on : {common.getHtmlDate(date, 'ddmmyyyy')}
                    </td>
                    {(() => {
                      const totals = calculateSum(date);
                      return (
                        <>
                          <td className="text-center fw-bold">{totals.qty}</td>
                          <td className="text-center fw-bold">
                            {common.printDecimal(totals.subTotalAmount)}
                          </td>
                          <td className="text-center fw-bold">
                            {common.printDecimal(totals.totalAmount - totals.subTotalAmount)}
                          </td>
                          <td className="text-center fw-bold">
                            {common.printDecimal(totals.totalAmount)}
                          </td>
                          <td className="text-center fw-bold">
                            {common.printDecimal(totals.paidAmount)}
                          </td>
                          {showBalanceAmount && (
                            <td className="text-center fw-bold">
                              {common.printDecimal(totals.balance)}
                            </td>
                          )}
                          <td className="text-center fw-bold">
                            {common.printDecimal(totals.paidVat)}
                          </td>
                          {showBalanceVat && (
                            <td className="text-center fw-bold">
                              {common.printDecimal(totals.balanceVat)}
                            </td>
                          )}
                        </>
                      );
                    })()}
                  </tr>
                </React.Fragment>
              ))
            )}
          </tbody>
        </table>

        {forReport && (
          <div className="row">
            {(() => {
              const totals = calculateSum(null, false);
              return (
                <>
                  <div className="col-10 text-end">Total Order Qty</div>
                  <div className="col-2 text-end fw-bold">{totals.qty}</div>
                  <div className="col-10 text-end">Sub Total Order Amount</div>
                  <div className="col-2 text-end fw-bold">
                    {common.printDecimal(totals.subTotalAmount)}
                  </div>
                  <div className="col-10 text-end">Total Order Amount</div>
                  <div className="col-2 text-end fw-bold">
                    {common.printDecimal(totals.totalAmount)}
                  </div>
                  <div className="col-10 text-end">Total Paid Amount</div>
                  <div className="col-2 text-end fw-bold">
                    {common.printDecimal(totals.paidAmount)}
                  </div>
                  <div className="col-10 text-end">Total Paid Vat ({VAT}%)</div>
                  <div className="col-2 text-end fw-bold">
                    {common.printDecimal(totals.paidVat)}
                  </div>
                </>
              );
            })()}
          </div>
        )}
      </div>

      <PrintTaxInvoiceReceipt orderId={selectedOrderId} />
    </>
  );
}
