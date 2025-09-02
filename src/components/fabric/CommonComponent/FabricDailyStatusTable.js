import { common } from "../../../utils/common";

export default function FabricDailyStatusTable({ data, totals, headers }) {
  return (
    <table className="table table-bordered table-striped fixTableHead">
      <thead>
        <tr>
          {headers?.map((ele, index) => (
            <th key={index} className="text-center">{ele}</th>
          ))}
        </tr>
      </thead>
      <tbody>
        {data?.length > 0 ? (
          data.map((res, index) => (
            <tr key={index} style={{ fontSize: "12px" }}>
              <td className="text-center">{index + 1}</td>
              <td className="text-center">{res?.fabricSale?.invoiceNo}</td>
              <td className="text-end">{common.printDecimal(res.fabricSale?.subTotalAmount || 0)}</td>
              <td className="text-end">{common.printDecimal(res.fabricSale?.discountAmount || 0)}</td>
              <td className="text-end">{common.printDecimal(res.fabricSale?.vatAmount || 0)}</td>
              <td className="text-end">{common.printDecimal((res.fabricSale?.vatAmount + (res.fabricSale?.subTotalAmount - res.fabricSale?.discountAmount)) || 0)}</td>
              <td className="text-end">{res?.fabricSale?.qty}</td>
              <td className="text-end">{common.printDecimal(res.credit)}</td>
              <td className="text-end">{common.printDecimal(res.balance)}</td>
              <td className="text-center">{res.paymentMode}</td>
              <td className="text-center">{res.reason}</td>
            </tr>
          ))
        ) : (
          <tr>
            <td colSpan={headers.length} className="text-center text-danger">
              No Record Found For Payment
            </td>
          </tr>
        )}

        {/* Totals Section */}
        <tr><td colSpan={headers.length - 1} className="text-end">Total Sales Qty</td><td className="text-end">{totals?.totalBookingQty}</td></tr>
        <tr><td colSpan={headers.length - 1} className="text-end">Total Sales Amount</td><td className="text-end">{totals?.totalSaleAmount}</td></tr>
        <tr><td colSpan={headers.length - 1} className="text-end">Total Discount</td><td className="text-end">{totals?.totalDiscountAmount}</td></tr>
        <tr><td colSpan={headers.length - 1} className="text-end">Net Sales Amount</td><td className="text-end">{totals?.totalAmount}</td></tr>
        <tr><td colSpan={headers.length - 1} className="text-end">Total Advance Cash</td><td className="text-end">{totals?.totalAdvanceAmount("cash")}</td></tr>
        <tr><td colSpan={headers.length - 1} className="text-end">Total Advance Cheque</td><td className="text-end">{totals?.totalAdvanceAmount("cheque")}</td></tr>
        <tr><td colSpan={headers.length - 1} className="text-end">Total Advance VISA</td><td className="text-end">{totals?.totalAdvanceAmount("visa")}</td></tr>
        <tr><td colSpan={headers.length - 1} className="text-end">Total Sales Cash</td><td className="text-end">{totals?.totalDeliveryAmount("cash")}</td></tr>
        <tr><td colSpan={headers.length - 1} className="text-end">Total Sales VISA</td><td className="text-end">{totals?.totalDeliveryAmount("visa")}</td></tr>
        <tr><td colSpan={headers.length - 1} className="text-end">Total Sales Cheque</td><td className="text-end">{totals?.totalDeliveryAmount("cheque")}</td></tr>
        <tr><td colSpan={headers.length - 1} className="text-end">Total Vat Tax {process.env.REACT_APP_VAT}%</td><td className="text-end">{totals?.totalVatTax}</td></tr>
      </tbody>
    </table>
  );
}
