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
        { name: "Qty", prop: "qty",customColumn:(rowData,Header)=>rowData.qty===null ||rowData.qty===undefined ?rowData.orderDetails.lenght:rowData.qty },
        { name: "Customer Name", prop: "customerName",action:{upperCase:true} },
        { name: "Contact", prop: "contact1" },
        { name: "Salesname", prop: "salesman" },
        { name: "Order Date", prop: "orderDate" },
        { name: "Order Delivery Date", prop: "orderDeliveryDate" },
        { name: "Sub Total", prop: "subTotalAmount", action: { decimal: true } },
        { name: "VAT 5%", prop: "vatAmount", action: { decimal: true } },
        { name: "Total", prop: "totalAmount", action: { decimal: true } },
        { name: "Advance", prop: "advanceAmount", action: { decimal: true } },
        { name: "Balance", prop: "balanceAmount", action: { decimal: true } },
        { name: "Payment Mode", prop: "paymentMode" },
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
        { name: "Customer Name", prop: "measurementCustomerName" },
        { name: "Description", prop: "description" },
        { name: "Work Type", prop: "workType" },
        { name: "Order Status", prop: "orderStatus" },
        { name: "Measurement Status", prop: "measurementStatus" },
        { name: "Crystal", prop: "crystal" },
        { name: "Price", prop: "price" },
        { name: "Sub Total Amount", prop: "subTotalAmount" },
        { name: "VAT Amount 5%", prop: "vatAmount" },
        { name: "Total Amount", prop: "totalAmount",action:{decimal:true} },
        { name: "Status", prop: "status" },
        { name: "Cancelled/Updated by", prop: "updatedBy" },
        { name: "Cancelled/Updated On", prop: "updatedAt" },
        { name: "Cancel/Update Note", prop: "note" },
    ]
}
export { headerFormat };