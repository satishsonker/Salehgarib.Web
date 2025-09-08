import React, { useMemo } from "react";
import FabricInvoiceHead from "./FabricInvoiceHead";
import { common } from "../../../utils/common";
import { headerFormat } from "../../../utils/tableHeaderFormat";

export default function PrintFabricSellDetailReport({ data = [], printRef, filter }) {
  const columns = headerFormat.printFabricSellDetailReport;

  /** Format date safely */
  const formatDate = (dateString) => {
    if (!dateString) return "";
    return common.getHtmlDate(new Date(dateString), "ddmmyyyy");
  };

  /** Memoized values */
  const printTimestamp = useMemo(() => {
    const now = new Date();
    return `${now.toLocaleDateString()} ${now.toLocaleTimeString()}`;
  }, []);

  const dateRange = useMemo(() => {
    const from = formatDate(filter?.fromDate);
    const to = formatDate(filter?.toDate);
    return from && to ? `${from} to ${to}` : "";
  }, [filter]);

  return (
    <div ref={printRef} style={{ padding: "10px" }} className="row">
      {/* Header */}
      <FabricInvoiceHead receiptType="Sales Report" />
      <hr />

      {/* Print Info */}
      <div className="d-flex justify-content-between">
        <div>Print On: {printTimestamp}</div>
        <div>Date Range: {dateRange}</div>
      </div>
      <hr />

      {/* Table */}
      <table
        style={{
          width: "100%",
          borderCollapse: "collapse",
          textAlign: "center",
        }}
      >
        <thead>
          <tr>
            {columns.map((col) => (
              <th
                key={col.prop}
                style={{ border: "1px solid black", padding: "8px" }}
              >
                {col.name}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.length > 0 ? (
            data.map((row, rowIndex) => (
              <tr key={rowIndex}>
                {columns.map((col) => {
                  const value = row[col.prop];
                  let displayValue = value;

                  if (col.isDate) {
                    displayValue = formatDate(value);
                  } else if (col.decimal && typeof value === "number") {
                    displayValue = value.toFixed(2);
                  }

                  return (
                    <td
                      key={col.prop}
                      style={{ border: "1px solid black", padding: "8px" }}
                    >
                      {displayValue ?? ""}
                    </td>
                  );
                })}
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={columns.length} style={{ padding: "10px" }}>
                No data available
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
