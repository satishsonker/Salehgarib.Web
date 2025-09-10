import React, { useMemo } from "react";
import { common } from "../../../utils/common";
import ReceiptFooter from "../../print/ReceiptFooter";
import FabricInvoiceHead from "./FabricInvoiceHead";
import FabricInvoiceCommonHeader from "./FabricInvoiceCommonHeader";

export default function PrintFabricSaleInvoice({ printRef, mainData }) {
  const vat = parseFloat(process.env.REACT_APP_VAT ?? "0");

  /** Helper: check if object has keys */
  const hasKeys = (obj) => obj && Object.keys(obj).length > 0;

  /** Step 1: Group fabric details and calculate totals */
  const { groupedItems, totals } = useMemo(() => {
    if (!mainData?.fabricSaleDetails) {
      return { groupedItems: [], totals: { subTotal: 0, vat: 0, total: 0 } };
    }

    const grouped = {};
    let subTotal = 0;
    let vatAmount = 0;
    let total = 0;

    mainData.fabricSaleDetails.forEach((item) => {
      const fabricCode = item?.fabricCode ?? item?.fabric?.fabricCode;
      if (!fabricCode) return;

      if (!grouped[fabricCode]) {
        grouped[fabricCode] = {
          ...item,
          fabricSize: item?.fabric?.fabricSizeName,
        };
      } else {
        grouped[fabricCode].qty += item.qty;
        grouped[fabricCode].subTotalAmount += item.subTotalAmount;
        grouped[fabricCode].vatAmount += item.vatAmount;
        grouped[fabricCode].totalAmount += item.totalAmount;
      }

      subTotal += item.subTotalAmount;
      vatAmount += item.vatAmount;
      total += item.totalAmount;
    });

    return {
      groupedItems: Object.entries(grouped),
      totals: { subTotal, vatAmount, total },
    };
  }, [mainData]);

  /** Step 2: Apply discount and VAT */
  const { vatAmount, total } = useMemo(() => {
    const discount = mainData?.discountAmount ?? 0;
    const vatAmount = common.calculatePercent(
      totals.subTotal - discount,
      vat
    );
    const total = totals.subTotal - discount + vatAmount;
    return { vatAmount, total };
  }, [totals.subTotal, mainData?.discountAmount, vat]);

  /** Helper: for table row classes */
  const getClassName = (ele, index) => {
    const lastIndex = groupedItems.length - 1;
    if (index === lastIndex) return " onlyDownBorder";
    return !hasKeys(ele) ? " noUpDownBorder" : "";
  };

  return (
    <div ref={printRef} style={{ padding: "10px" }} className="row">
      <div className="col col-lg-12 mx-auto">
        <div className="card border shadow-none">
          {/* Header */}
          <div className="card-header py-3">
            <div className="row align-items-center g-3">
              <FabricInvoiceHead receiptType="Tax Invoice" />
            </div>
          </div>

          {/* Customer Info */}
          <FabricInvoiceCommonHeader
            invoiceNo={mainData?.invoiceNo}
            customerName={
              mainData?.firstName
                ? `${mainData.firstName} ${mainData.lastName ?? ""}`
                : mainData?.customerName
            }
            saleDate={mainData?.saleDate}
            contact={mainData?.primaryContact ?? mainData?.contact}
            deleiverDate={mainData?.deliveryDate}
            salesman={mainData?.salesman ?? mainData?.salesmanName}
            taxInvoiceNo={mainData?.taxInvoiceNo}
          />

          {/* Body */}
          <div className="card-body">
            <div className="table-responsive1">
              {/* Invoice Table */}
              <table className="table table-invoice" style={{ fontSize: "12px" }}>
                <thead>
                  <tr>
                    <th className="text-center all-border" width="5%">
                      S.No.
                    </th>
                    <th className="text-center all-border" width="40%">
                      DESCRIPTION
                    </th>
                    <th className="text-center all-border" width="10%">
                      Size
                    </th>
                    <th className="text-center all-border" width="5%">
                      Qty.
                    </th>
                    <th className="text-center all-border" width="10%">
                      Price/Peice
                    </th>
                    <th className="text-center all-border" width="5%">
                      Price
                    </th>
                    <th className="text-center all-border" width="5%">
                      Vat
                    </th>
                    <th className="text-center all-border" width="5%">
                      Total
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {groupedItems.map(([fabricCode, item], index) => (
                    <tr key={item.id || index} className="print-table-height">
                      <td
                        className={
                          "text-center border border-secondary" +
                          getClassName(item, index)
                        }
                      >
                        {index + 1}.
                      </td>
                      <td
                        className={
                          "text-center border border-secondary text-wrap" +
                          getClassName(item, index)
                        }
                      >
                        {`${fabricCode} - ${
                          item?.fabricBrand ?? item?.fabric?.brandName ?? ""
                        } - ${
                          item?.fabricType ?? item?.fabric?.fabricTypeName ?? ""
                        } - ${
                          item?.fabricPrintType ??
                          item?.fabric?.fabricPrintType ??
                          ""
                        } - ${
                          item?.fabricColor ??
                          item?.fabric?.fabricColorName ??
                          ""
                        } - ${item?.description ?? ""}`}
                      </td>
                      <td
                        className={
                          "text-center border border-secondary" +
                          getClassName(item, index)
                        }
                      >
                        {item.fabricSize}
                      </td>
                      <td
                        className={
                          "text-center border border-secondary" +
                          getClassName(item, index)
                        }
                      >
                        {item.qty}
                      </td>
                      <td
                        className={
                          "text-center border border-secondary" +
                          getClassName(item, index)
                        }
                      >
                        {common.printDecimal(item.subTotalAmount / item.qty, true)}
                      </td>
                      <td
                        className={
                          "text-center border border-secondary" +
                          getClassName(item, index)
                        }
                      >
                        {common.printDecimal(item.subTotalAmount, true)}
                      </td>
                      <td
                        className={
                          "text-center border border-secondary" +
                          getClassName(item, index)
                        }
                      >
                        {common.printDecimal(item.vatAmount, true)}
                      </td>
                      <td
                        className={
                          "text-center border border-secondary" +
                          getClassName(item, index)
                        }
                      >
                        {common.printDecimal(item.totalAmount, true)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>

              {/* Totals + Footer Table */}
              <table className="table table-bordered">
                <tbody>
                  <tr>
                    <td colSpan={3} className="text-start">
                      <i className="bi bi-call" /> {process.env.REACT_APP_COMPANY_MOBILE}{" "}
                      <i className="bi bi-whatsapp text-success"></i>
                    </td>
                    <td colSpan={1} className="text-center">
                      <strong>Quantity(s)</strong>
                    </td>
                    <td colSpan={2} className="text-center">
                      <strong>VAT</strong> {vat}%
                    </td>
                    <td colSpan={2} rowSpan={4} className="fs-6 fw-bold text-center">
                      <ul>
                        <li className="d-flex justify-content-between">
                          <span>Sub Total</span>
                          <span>{common.printDecimal(totals.subTotal)}</span>
                        </li>

                        {mainData?.discountAmount > 0 && (
                          <li className="d-flex justify-content-between">
                            <span>Discount</span>
                            <span>
                              (-) {common.printDecimal(mainData.discountAmount)}
                            </span>
                          </li>
                        )}

                        <li className="d-flex justify-content-between">
                          <span>VAT</span>
                          <span>{common.printDecimal(vatAmount)}</span>
                        </li>
                        <li className="d-flex justify-content-between">
                          <span>Payable</span>
                          <span>{common.printDecimal(total)}</span>
                        </li>

                        {mainData?.advanceAmount > 0 && (
                          <li className="d-flex justify-content-between">
                            <span>Advance</span>
                            <span>{common.printDecimal(mainData.advanceAmount)}</span>
                          </li>
                        )}

                        {mainData?.cancelledAmount > 0 && (
                          <li className="d-flex justify-content-between">
                            <span>Cancelled</span>
                            <span>
                              (-) {common.printDecimal(mainData.cancelledAmount)}
                            </span>
                          </li>
                        )}

                        {mainData?.paidAmount !== 0 && (
                          <li className="d-flex justify-content-between">
                            <span>Paid</span>
                            <span>{common.printDecimal(mainData.paidAmount)}</span>
                          </li>
                        )}

                        {mainData?.refundAmount !== 0 && (
                          <li className="d-flex justify-content-between">
                            <span>Refund</span>
                            <span>{common.printDecimal(mainData.refundAmount)}</span>
                          </li>
                        )}

                        {mainData?.balanceAmount !== 0 && (
                          <li className="d-flex justify-content-between">
                            <span>Balance</span>
                            <span>{common.printDecimal(mainData.balanceAmount)}</span>
                          </li>
                        )}
                      </ul>
                    </td>
                  </tr>

                  <tr>
                    <td colSpan={3} className="text-start">
                      <i className="bi bi-mail" /> {process.env.REACT_APP_COMPANY_EMAIL}{" "}
                      <i className="bi bi-envelope text-success"></i>
                    </td>
                    <td colSpan={1} className="text-center">
                      <div>
                        <strong>Total Qty</strong>
                      </div>
                      <div>
                        {
                          mainData?.fabricSaleDetails?.filter(
                            (x) => !x.isDeleted && !x.isCancelled
                          )?.length
                        }
                      </div>
                      {mainData?.fabricSaleDetails?.some((x) => x.isCancelled) && (
                        <>
                          <div>
                            <strong>Cancelled Qty</strong>
                          </div>
                          <div>
                            {
                              mainData?.fabricSaleDetails?.filter((x) => x.isCancelled)
                                ?.length
                            }
                          </div>
                        </>
                      )}
                    </td>
                    <td className="text-center">
                      <div>
                        <strong>Total VAT</strong>
                      </div>
                      <div>{common.printDecimal(vatAmount)}</div>
                    </td>
                    <td className="text-center">
                      <div>
                        <strong>Payment Mode</strong>
                      </div>
                      <div>{mainData?.paymentMode}</div>
                    </td>
                  </tr>

                  <tr>
                    <td colSpan={6} rowSpan={5} className="text-start">
                      Received by................................. 
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
}
