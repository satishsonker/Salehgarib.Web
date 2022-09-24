import { common } from "./common";

const replaceWorkTypeWithCode = (row, header) => {
    let workTypeCodes = "";
    let workType = common.defaultIfEmpty(row[header.prop], "").toLowerCase();
    if (workType.indexOf('designing') > -1)
        workTypeCodes += "1";
    if (workType.indexOf('cutting') > -1)
        workTypeCodes += "2";
    if (workType.indexOf('machine') > -1)
        workTypeCodes += "3";
    if (workType.indexOf('crystal') > -1)
        workTypeCodes += "4";
    if (workType.indexOf('hand') > -1)
        workTypeCodes += "5";
    if (workType.indexOf('hot') > -1 || workType.indexOf('stitch') > -1)
        workTypeCodes += "6";
    if (workType.indexOf('apliq') > -1)
        workTypeCodes += "7";
    return workTypeCodes;
}
const headerFormat = {
    order: [
        { name: "Order No", prop: "orderNo" },
        { name: "Customer Name", prop: "customerName" },
        { name: "Salesname", prop: "salesman" },
        { name: "Order Date", prop: "orderDate" },
        { name: "Order Delivery Date", prop: "orderDeliveryDate" },
        { name: "City", prop: "city" },
        { name: "VAT", prop: "vat", action: { decimal: true } },
        { name: "Sub Total", prop: "subTotalAmount", action: { decimal: true } },
        { name: "VAT Amount", prop: "vatAmount", action: { decimal: true } },
        { name: "Total Amount", prop: "totalAmount", action: { decimal: true } },
        { name: "Advance Amount", prop: "advanceAmount", action: { decimal: true } },
        { name: "Balance Amount", prop: "balanceAmount", action: { decimal: true } },
        { name: "Payment Mode", prop: "paymentMode" },
        { name: "Customer Ref Name", prop: "customerRefName" },
        { name: "Order Status", prop: "status" },
        { name: "Deleted/Cancelled/Updated By", prop: "updatedBy" },
        { name: "Deleted/Cancelled/Updated  On", prop: "updatedAt" },
        { name: "Deleted/Cancelled/Updated  Note", prop: "note" },
    ],
    orderDetails: [
        { name: "Order No", prop: "orderNo" },
        { name: "Order Delivery Date", prop: "orderDeliveryDate" },
        { name: "Category", prop: "designCategory" },
        { name: "Model", prop: "designModel" },
        { name: "Length", prop: "length" },
        { name: "Chest", prop: "chest" },
        { name: "Waist", prop: "waist" },
        { name: "Hipps", prop: "hipps" },
        { name: "Bottom", prop: "bottom" },
        { name: "Sleeve", prop: "sleeve" },
        { name: "Sleeve Loose", prop: "sleeveLoose" },
        { name: "Shoulder", prop: "shoulder" },
        { name: "Neck", prop: "neck" },
        { name: "BackDown", prop: "backDown" },
        { name: "Extra", prop: "extra" },
        { name: "Size", prop: "size" },
        { name: "Deep", prop: "deep" },
        { name: "Cuff", prop: "cuff" },
        { name: "Description", prop: "description" },
        { name: "Work Type", prop: "workType", customColumn: replaceWorkTypeWithCode },
        { name: "Order Status", prop: "orderStatus" },
        { name: "Measurement Status", prop: "measurementStatus" },
        { name: "Crystal", prop: "crystal" },
        { name: "Price", prop: "price" },
        { name: "Sub Total Amount", prop: "subTotalAmount" },
        { name: "VAT", prop: "vat" },
        { name: "VAT Amount", prop: "vatAmount" },
        { name: "Total Amount", prop: "totalAmount" },
        { name: "Status", prop: "status" },
        { name: "Cancelled/Updated by", prop: "updatedBy" },
        { name: "Cancelled/Updated On", prop: "updatedAt" },
        { name: "Cancel/Update Note", prop: "note" },
    ]
}
export { headerFormat };