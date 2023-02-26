import { common } from "./common";

// const replaceWorkTypeWithCode = (row, header) => {
//     let workTypeCodes = "";
//     let workType = common.defaultIfEmpty(row[header.prop], "").toLowerCase();
//     if (workType.indexOf('designing') > -1)
//         workTypeCodes += "1";
//     if (workType.indexOf('cutting') > -1)
//         workTypeCodes += "2";
//     if (workType.indexOf('machine') > -1)
//         workTypeCodes += "3";
//     if (workType.indexOf('crystal') > -1)
//         workTypeCodes += "4";
//     if (workType.indexOf('hand') > -1)
//         workTypeCodes += "5";
//     if (workType.indexOf('hot') > -1 || workType.indexOf('stitch') > -1)
//         workTypeCodes += "6";
//     if (workType.indexOf('apliq') > -1)
//         workTypeCodes += "7";
//     return workTypeCodes;
// }
const remainingDaysBadge = (row, header) => {
  var days = row[header.prop];
  if (days >= 9)
    return <span className="badge bg-info">{days} Days</span>
  if (days >= 6 && days < 9)
    return <span className="badge bg-success text-dark">{days} Days</span>
  if (days >= 2 && days < 6)
    return <span className="badge bg-warning text-dark">{days} Days</span>
  if (days >= 2 && days < 6)
    return <span className="badge bg-danger text-dark">{days} Days</span>
  if (days >= 0 && days < 1)
    return <span className="badge bg-dark">{days} Days</span>
  if (days < 0)
    return <span className="badge bg-secondary">{days} Days</span>
}
const VAT = parseFloat(process.env.REACT_APP_VAT);

const customDayColumn = (data, header) => {
  let totalDaysOfMonth = common.daysInMonth(data['month'], data['year']);
  let currentColumnDay = parseInt(header.prop.replace('day', ''));
  currentColumnDay = isNaN(currentColumnDay) ? 0 : currentColumnDay;
  if (currentColumnDay > totalDaysOfMonth)
    return <></>
  if (data[header.prop] === 0) {
    return <div><i className="bi bi-person-x-fill text-danger fs-4"></i></div>
  }
  if (data[header.prop] === 1) {
    return <div><i className="bi bi-person-x-fill text-success fs-4"></i></div>
  }
  if (data[header.prop] === 2 || data[header.prop] === 3) {
    return <div><i className="bi bi-person-x-fill text-warning fs-4"></i></div>
  }
}
const customOrderStatusColumn = (data, header) => {
  let orderStatus = data[header.prop];
  if (orderStatus.toLowerCase() === 'active')
    return <div title={orderStatus} className="text-center">{common.orderStatusIcon[orderStatus.toLowerCase()]}</div>

  if (orderStatus.toLowerCase() === 'delivered')
    return <div title={orderStatus} className="text-center"><i className={common.orderStatusIcon[orderStatus.toLowerCase()] + " text-success fs-6"}></i></div>

  if (orderStatus.toLowerCase() === 'cancelled' || orderStatus.toLowerCase() === 'partially cancelled' || orderStatus.toLowerCase() === 'partiallycancelled')
    return <div title={orderStatus} className="text-center"><i style={{ color: '#ff9b38b5' }} className={common.orderStatusIcon[orderStatus.toLowerCase()] + " fs-6"} ></i></div>

  if (orderStatus.toLowerCase() === 'partiallydelivered')
    return <div title="Partially Delivered" className="text-center"><i className={common.orderStatusIcon[orderStatus.toLowerCase()] + " text-secondary fs-6"}></i></div>

  if (orderStatus.toLowerCase() === 'completed')
    return <div title={orderStatus} className="text-center"><i className={common.orderStatusIcon[orderStatus.toLowerCase()] + " text-warning fs-6"}></i></div>
  if (orderStatus.toLowerCase() === 'deleted')
    return <div title={orderStatus} className="text-center"><i className={common.orderStatusIcon[orderStatus.toLowerCase()] + " text-danger fs-6"}></i></div>
  if (orderStatus.toLowerCase() === 'processing')
    return <div title={orderStatus} className="text-center"><i className={common.orderStatusIcon[orderStatus.toLowerCase()] + " text-info fs-6"}></i></div>
}
const calculatePaymentPercent = (data, header) => {
  var sumTotalAmount = data.reduce((sum, ele) => {
    return sum += ele.totalAmount;
  }, 0);

  var sumBalanceAmount = data.reduce((sum, ele) => {
    return sum += ele.balanceAmount;
  }, 0);
  return (((sumTotalAmount - sumBalanceAmount) / sumTotalAmount) * 100).toFixed(2);

}
const headerFormat = {
  order: [
    { name: "Order Status", prop: "status", customColumn: customOrderStatusColumn, action: { footerText: "Total" } },
    {
      name: "Order No", prop: "orderNo", action: {
        footerText: "", footerSum: (data) => {
          return data?.length;
        }, hAlign: "center"
      }
    },
    { name: "Qty", prop: "qty", action: { footerSum: true, footerSumInDecimal: false }, customColumn: (rowData, Header) => rowData.qty === null || rowData.qty === undefined ? rowData.orderDetails.lenght : rowData.qty },
    { name: "Customer Name", prop: "customerName", action: { upperCase: true, footerText: "", dAlign: "start" } },
    { name: "Contact", prop: "contact1", action: { footerText: "", dAlign: "start" } },
    { name: "Salesname", prop: "salesman", action: { footerText: "" } },
    { name: "Order Date", prop: "orderDate", action: { footerText: "" } },
    { name: "Order Delivery Date", prop: "orderDeliveryDate", action: { footerText: "" } },
    { name: "Sub Total", prop: "subTotalAmount", action: { footerSum: true, decimal: true } },
    { name: "VAT 5%", prop: "vatAmount", action: { footerSum: true, decimal: true } },
    { name: "Total", prop: "totalAmount", action: { footerSum: true, decimal: true } },
    { name: "Advance+Paid", prop: "advanceAmount", action: { footerSum: true, decimal: true } },
    { name: "Balance", prop: "balanceAmount", action: { footerSum: true, decimal: true } },
    { name: "Received Payment %", prop: "paymentReceived", customColumn: (data, header) => { return [data[header.prop]] + "%" }, action: { footerSum: calculatePaymentPercent, hAlign: "center", suffixFooterText: "%" } },
    { name: "Payment Mode", prop: "paymentMode", action: { footerText: "" } }, { name: "Deleted/Cancelled/Updated By", prop: "updatedBy", action: { footerText: "" } },
    { name: "Deleted/Cancelled/Updated  On", prop: "updatedAt", action: { footerText: "" } },
    { name: "Deleted/Cancelled/Updated  Note", prop: "note", action: { footerText: "" } },
  ],
  orderDetails: [
    { name: "Order Status", prop: "status", customColumn: customOrderStatusColumn },
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
    { name: "Price", prop: "price", action: { decimal: true } },
    { name: "Sub Total Amount", prop: "subTotalAmount", action: { decimal: true } },
    { name: "VAT Amount 5%", prop: "vatAmount", action: { decimal: true } },
    { name: "Total Amount", prop: "totalAmount", action: { decimal: true } },
    { name: "Cancelled/Updated by", prop: "updatedBy" },
    { name: "Cancelled/Updated On", prop: "updatedAt" },
    { name: "Cancel/Update Note", prop: "note" },
  ],
  orderDeliveryFormat: [
    { name: "Status", prop: "status", customColumn: customOrderStatusColumn },
    { name: "Order No", prop: "orderNo" },
    { name: "Delivery Date", prop: "orderDeliveryDate" },
    { name: "Delivered On", prop: "deliveredDate" },
    { name: "Price", prop: "price", action: { decimal: true } },
    { name: `VAT ${VAT}%`, prop: "vatAmount", action: { decimal: true } },
    { name: "Total Amount", prop: "totalAmount", action: { decimal: true } }
  ],
  orderWorkType: [
    { name: "Order Status", prop: "status", customColumn: customOrderStatusColumn },
    { name: "Status", prop: "status" },
    { name: "Order No", prop: "orderNo" },
    { name: "Order Delivery Date", prop: "orderDeliveryDate" },
    { name: "Customer Name", prop: "measurementCustomerName", action: { upperCase: true } },
    { name: "Description", prop: "description" },
    { name: "Work Type", prop: "workType" },
    { name: "Order Status", prop: "orderStatus" },
    { name: "Measurement Status", prop: "measurementStatus" },
    { name: "Price", prop: "price", action: { decimal: true } },
    { name: "Sub Total Amount", prop: "subTotalAmount", action: { decimal: true } },
    { name: "VAT Amount 5%", prop: "vatAmount", action: { decimal: true } },
    { name: "Total Amount", prop: "totalAmount", action: { decimal: true } },
    { name: "Cancel/Update Note", prop: "note" },
  ],
  employeeDetails: [
    { name: 'First Name', prop: 'firstName' },
    { name: 'Last Name', prop: 'lastName' },
    { name: 'Contact', prop: 'contact' },
    { name: 'Contact 2', prop: 'contact2' },
    { name: 'Email', prop: 'email' },
    { name: 'Job Name', prop: 'jobTitle' },
    { name: 'Role', prop: 'role' },
    { name: 'Fixed Employee', prop: 'isFixedEmployee', action: { replace: { true: "Yes", false: "No" } } },
    { name: 'Hire Date', prop: 'hireDate' },
    { name: 'Labour ID', prop: 'labourId' },
    { name: 'Labour ID Expire', prop: 'labourIdExpire' },
    { name: 'Passport Number', prop: 'passportNumber' },
    { name: 'Passport Expiry Date', prop: 'passportExpiryDate' },
    { name: 'WorkPermit ID', prop: 'workPermitID' },
    { name: 'Work Permit Expire', prop: 'workPEDate' },
    { name: 'Resident Permit Expire', prop: 'residentPDExpire' },
    { name: 'Basic Salary', prop: 'basicSalary', action: { decimal: true } },
    { name: 'Accomodation', prop: 'accomodation', action: { decimal: true } },
    { name: 'Salary', prop: 'salary', action: { decimal: true } },
    { name: 'Medical Expire', prop: 'medicalExpiryDate' },
    { name: 'Address', prop: 'address' },
    { name: 'Country', prop: 'country' }
  ],
  monthlyAttendence: [
    { name: "Employee Name", prop: "employeeName" },
    { name: "Basic Salary", prop: "basicSalary", customColumn: (dataRow, headerRow) => { return dataRow.employee[headerRow.prop] }, action: { decimal: true } },
    { name: "Accomdation", prop: "accomodation", customColumn: (dataRow, headerRow) => { return dataRow.employee[headerRow.prop] }, action: { decimal: true } },
    { name: "Monthly Salary", prop: "month_Salary", customColumn: (dataRow, headerRow) => { return dataRow.employee.basicSalary + dataRow.employee.accomodation }, action: { decimal: true } },
    { name: "Advance", prop: "advance", action: { decimal: true } },
    { name: "Month", prop: "month" },
    { name: "Year", prop: "year" },
    { name: "Total Working Day", prop: "workingDays" },
    { name: "Total Present", prop: "present" },
    { name: "Total Absent", prop: "absent" },
    { name: "Salary/Day", prop: "perDaySalary", action: { decimal: true }, title: "Per Day Salary" },
    { name: "Total Deduction", prop: "totalDeduction", action: { decimal: true } },
    { name: "Total Salary", prop: "netSalary", action: { decimal: true }, title: "Total Salary = Monthly Salary - Advance - (Per day Salary x No. of Absents)" },
    { name: "Day 1", prop: "day1", customColumn: customDayColumn },
    { name: "Day 2", prop: "day2", customColumn: customDayColumn },
    { name: "Day 3", prop: "day3", customColumn: customDayColumn },
    { name: "Day 4", prop: "day4", customColumn: customDayColumn },
    { name: "Day 5", prop: "day5", customColumn: customDayColumn },
    { name: "Day 6", prop: "day6", customColumn: customDayColumn },
    { name: "Day 7", prop: "day7", customColumn: customDayColumn },
    { name: "Day 8", prop: "day8", customColumn: customDayColumn },
    { name: "Day 9", prop: "day9", customColumn: customDayColumn },
    { name: "Day 10", prop: "day10", customColumn: customDayColumn },
    { name: "Day 11", prop: "day11", customColumn: customDayColumn },
    { name: "Day 12", prop: "day12", customColumn: customDayColumn },
    { name: "Day 13", prop: "day13", customColumn: customDayColumn },
    { name: "Day 14", prop: "day14", customColumn: customDayColumn },
    { name: "Day 15", prop: "day15", customColumn: customDayColumn },
    { name: "Day 16", prop: "day16", customColumn: customDayColumn },
    { name: "Day 17", prop: "day17", customColumn: customDayColumn },
    { name: "Day 18", prop: "day18", customColumn: customDayColumn },
    { name: "Day 19", prop: "day19", customColumn: customDayColumn },
    { name: "Day 20", prop: "day20", customColumn: customDayColumn },
    { name: "Day 21", prop: "day21", customColumn: customDayColumn },
    { name: "Day 22", prop: "day22", customColumn: customDayColumn },
    { name: "Day 23", prop: "day23", customColumn: customDayColumn },
    { name: "Day 24", prop: "day24", customColumn: customDayColumn },
    { name: "Day 25", prop: "day25", customColumn: customDayColumn },
    { name: "Day 26", prop: "day26", customColumn: customDayColumn },
    { name: "Day 27", prop: "day27", customColumn: customDayColumn },
    { name: "Day 28", prop: "day28", customColumn: customDayColumn },
    { name: "Day 29", prop: "day29", customColumn: customDayColumn },
    { name: "Day 30", prop: "day30", customColumn: customDayColumn },
    { name: "Day 31", prop: "day31", customColumn: customDayColumn },
  ],
  searchFilterOrder: [
    { name: "Order Status", prop: "status", customColumn: customOrderStatusColumn },
    { name: "Order No", prop: "orderNo" },
    { name: "Qty", prop: "qty", action: { footerSum: true }, customColumn: (rowData, Header) => rowData.qty === null || rowData.qty === undefined ? rowData.orderDetails.lenght : rowData.qty },
    { name: "Customer Name", prop: "customerName", action: { upperCase: true } },
    { name: "Contact", prop: "contact1" },
    { name: "Salesname", prop: "salesman" },
    { name: "Order Date", prop: "orderDate" },
    { name: "Order Delivery Date", prop: "orderDeliveryDate" },
    { name: "Sub Total", prop: "subTotalAmount", action: { decimal: true, footerSum: true } },
    { name: "VAT 5%", prop: "vatAmount", action: { decimal: true, footerSum: true } },
    { name: "Total", prop: "totalAmount", action: { decimal: true, footerSum: true } },
    { name: "Advance+Paid", prop: "advanceAmount", action: { decimal: true, footerSum: true } },
    { name: "Balance", prop: "balanceAmount", action: { decimal: true, footerSum: true } }
  ],
  expenseDetail: [
    { name: 'Expense No', prop: 'expenseNo' },
    { name: 'Expense Date', prop: 'expenseDate' },
    { name: 'Expense Name', prop: 'expenseName' },
    { name: 'Expense Type', prop: 'expenseType' },
    { name: 'Emp Categoty', prop: 'jobTitle' },
    { name: 'Emp Name', prop: 'employeeName' },
    { name: 'Name', prop: 'name' },
    { name: 'Company/Shop', prop: 'expenseShopCompany' },
    { name: 'Description', prop: 'description' },
    { name: 'Amount', prop: 'amount', action: { decimal: true } },
    { name: 'Payment Mode', prop: 'paymentMode', action: { decimal: true } },
  ],
  customerDetail: [
    { name: "First name", prop: "firstname", action: { upperCase: true, hAlign: "center" } },
    { name: "Last name", prop: "lastname", action: { upperCase: true, hAlign: "center" } },
    { name: "Total Orders", prop: "totalOrders", action: { hAlign: "center" } },
    { name: "Contact1", prop: "contact1", action: { hAlign: "center" } },
    { name: "Contact2", prop: "contact2", action: { hAlign: "center" } },
    { name: "TRN", prop: "trn", action: { hAlign: "start" } },
    { name: "Branch", prop: "branch", action: { hAlign: "center" } },
    { name: "PO Box", prop: "poBox", action: { hAlign: "center" } }
  ],
  customerStatement: [
    { name: "Order No", prop: "orderNo", action: { hAlign: 'center', dAlign: 'center', footerText: "Total" } },
    { name: "Order Amount", prop: "totalAmount", action: { decimal: true, footerSum: true, hAlign: 'center', dAlign: 'center' } },
    { name: "Advance", prop: "advanceAmount", action: { decimal: true, footerSum: true, hAlign: 'center', dAlign: 'center' } },
    { name: "Paid Amount", prop: "paidAmount", action: { decimal: true, footerSum: true, hAlign: 'center', dAlign: 'center' } },
    { name: "Balance Amount", prop: "balanceAmount", action: { decimal: true, footerSum: true, hAlign: 'center', dAlign: 'center' } }
  ],
  orderShort: [
    { name: "Order Status", prop: "status", customColumn: customOrderStatusColumn, action: { footerText: "Total" } },
    {
      name: "Order No", prop: "orderNo", action: {
        footerText: "", footerSum: (data) => {
          return data?.length;
        }, hAlign: "center"
      }
    },
    { name: "Qty", prop: "qty", action: { footerSum: true }, customColumn: (rowData, Header) => rowData.qty === null || rowData.qty === undefined ? rowData.orderDetails.lenght : rowData.qty },
    { name: "Customer Name", prop: "customerName", action: { upperCase: true, footerText: "", dAlign: "start" } },
    { name: "Contact", prop: "contact1", action: { footerText: "", dAlign: "start" } },
    { name: "Salesname", prop: "salesman", action: { footerText: "" } },
    { name: "Order Date", prop: "orderDate", action: { footerText: "" } },
    { name: "Order Delivery Date", prop: "orderDeliveryDate", action: { footerText: "" } },
    { name: "Sub Total", prop: "subTotalAmount", action: { footerSum: true, decimal: true } },
    { name: "VAT 5%", prop: "vatAmount", action: { footerSum: true, decimal: true } },
    { name: "Total", prop: "totalAmount", action: { footerSum: true, decimal: true } },
    { name: "Advance", prop: "advanceAmount", action: { footerSum: true, decimal: true } },
    { name: "Balance", prop: "balanceAmount", action: { footerSum: true, decimal: true } },
    { name: "Payment Mode", prop: "paymentMode", action: { footerText: "" } },
    { name: "Received Payment %", prop: "paymentReceived", customColumn: (data, header) => { return [data[header.prop]] + "%" }, action: { footerSum: calculatePaymentPercent, hAlign: "center", suffixFooterText: "%" } },
  ],
  orderDetailShort: [
    { name: "Order Status", prop: "status", customColumn: customOrderStatusColumn, action: { footerText: "Total" } },
    { name: "Order No", prop: "orderNo", action: { footerText: "" } },
    { name: "Order Delivery Date", prop: "orderDeliveryDate", action: { footerText: "" } },
    { name: "Category", prop: "designCategory", action: { footerText: "" } },
    { name: "Model", prop: "designModel", action: { footerText: "" } },
    { name: "Customer Name", prop: "measurementCustomerName", action: { footerText: "" } },
    { name: "Description", prop: "description", action: { footerText: "" } },
    { name: "Work Type", prop: "workType", action: { footerText: "" } },
    { name: "Sub Total Amount", prop: "subTotalAmount", action: { decimal: true, footerSum: true } },
    { name: "Total Amount", prop: "totalAmount", action: { decimal: true, footerSum: true } },
    { name: "Cancel/Update Note", prop: "note" },
  ],
  alertOrder: [
    { name: "Remaining Days", prop: "remainingDays", title: "Remaining Days for order delivery", customColumn: remainingDaysBadge, action: { footerText: "" } },
    { name: "Order Status", prop: "status", customColumn: customOrderStatusColumn, action: { footerText: "" } },
    { name: "Order No", prop: "mainOrderNo", action: { footerText: "" } },
    { name: "Kandoora No", prop: "orderNo", action: { footerText: "" } },
    { name: "CustomerName", prop: "customerName", action: { footerText: "" } },
    { name: "Contact", prop: "contact", action: { footerText: "" } },
    { name: "Order Delivery Date", prop: "orderDeliveryDate", action: { footerText: "" } },
    { name: "Description", prop: "description", action: { footerText: "" } },
    { name: "Price", prop: "price", action: { decimal: true, footerText: "" } },
    { name: "VAT Amount", prop: "vatAmount", action: { decimal: true, footerText: "Total" } },
    { name: "Total Amount", prop: "totalAmount", action: { decimal: true, footerSum: true } },
  ],
  orderCancelled: [
    { name: "Order Status", prop: "status", customColumn: customOrderStatusColumn, action: { footerText: "Total" } },
    {
      name: "Order No", prop: "orderNo", action: {
        footerText: "", footerSum: (data) => {
          return data?.length;
        }, hAlign: "center"
      }
    },
    { name: "Qty", prop: "qty", action: { footerSum: true }, customColumn: (rowData, Header) => rowData?.qty === null || rowData?.qty === undefined ? rowData?.orderDetails?.length : rowData?.qty },
    { name: "Customer Name", prop: "customerName", action: { upperCase: true, footerText: "", dAlign: "start" } },
    { name: "Contact", prop: "contact1", action: { footerText: "", dAlign: "start" } },
    { name: "Salesname", prop: "salesman", action: { footerText: "" } },
    { name: "Order Date", prop: "orderDate", action: { footerText: "" } },
    { name: "Order Delivery Date", prop: "orderDeliveryDate", action: { footerText: "" } },
    { name: "Sub Total", prop: "subTotalAmount", action: { footerSum: true, decimal: true } },
    { name: "VAT 5%", prop: "vatAmount", action: { footerSum: true, decimal: true } },
    { name: "Total", prop: "totalAmount", action: { footerSum: true, decimal: true } },
    { name: "Payment Mode", prop: "paymentMode", action: { footerText: "" } },
  ],
  orderDetailCancelled: [
    { name: "Cancelled On", prop: "cancelledDate", action: { footerText: "" } },
    { name: "Order No", prop: "orderNo", action: { footerText: "" } },
    { name: "Order Delivery Date", prop: "orderDeliveryDate", action: { footerText: "" } },
    { name: "Category", prop: "designCategory", action: { footerText: "" } },
    { name: "Model", prop: "designModel", action: { footerText: "" } },
    { name: "Customer Name", prop: "measurementCustomerName", action: { footerText: "" } },
    { name: "Description", prop: "description", action: { footerText: "" } },
    { name: "Work Type", prop: "workType", action: { footerText: "" } },
    { name: "Sub Total Amount", prop: "subTotalAmount", action: { decimal: true, footerSum: true } },
    { name: "Total Amount", prop: "totalAmount", action: { decimal: true, footerSum: true } },
    { name: "Cancel/Update Note", prop: "note" },
  ],
  orderDetailDeleted: [
    { name: "Deleted On", prop: "deletedDate", action: { footerText: "" } },
    { name: "Order No", prop: "orderNo", action: { footerText: "" } },
    { name: "Order Delivery Date", prop: "orderDeliveryDate", action: { footerText: "" } },
    { name: "Category", prop: "designCategory", action: { footerText: "" } },
    { name: "Model", prop: "designModel", action: { footerText: "" } },
    { name: "Customer Name", prop: "measurementCustomerName", action: { footerText: "" } },
    { name: "Description", prop: "description", action: { footerText: "" } },
    { name: "Work Type", prop: "workType", action: { footerText: "" } },
    { name: "Sub Total Amount", prop: "subTotalAmount", action: { decimal: true, footerSum: true } },
    { name: "Total Amount", prop: "totalAmount", action: { decimal: true, footerSum: true } },
    { name: "Cancel/Update Note", prop: "note" },
  ],
  supplier: [
    { name: 'Company Name', prop: 'companyName', action: { hAlign: "center" } },
    { name: 'Contact', prop: 'contact', action: { hAlign: "center" } },
    { name: 'TRN', prop: 'trn', action: { hAlign: "center" } },
    { name: 'Title', prop: 'title', action: { hAlign: "center" } },
    { name: 'Address', prop: 'address', action: { hAlign: "center" } },
    { name: 'City', prop: 'city', action: { hAlign: "center" } }
  ],
  DeliveryCashVisaReport: ["Action", "Sr.", "Order No", "Qty", "Customer Name", "Contact", "DEL. Date", "Due Amount", "Paid", "Pay On", "Balance", "Payment Mode"],
  DeliveryCashVisaReportPrint: ["Sr.", "Order No", "Qty", "DEL. Date", "Due Amount", "Paid", "Pay On", "Balance", "Payment Mode"],
  AdvanceCashVisaReport: ["Action", "Sr.", "Action", "Status", "Order No", "Qty", "Customer Name", "Contact", "Order Date", "Order Amount", "Advance", "Balance", "Delivery on", "Payment Mode"],
  pendingOrder: [
    { name: "Order Status", prop: "status", customColumn: customOrderStatusColumn, action: { footerText: "Total" } },
    {
      name: "Order No", prop: "orderNo", action: {
        footerText: "", footerSum: (data) => {
          return data?.length;
        }, hAlign: "center"
      }
    },
    { name: "Qty", prop: "qty", action: { footerSum: true, footerSumInDecimal: false }, customColumn: (rowData, Header) => rowData.qty === null || rowData.qty === undefined ? rowData.orderDetails.lenght : rowData.qty },
    { name: "Customer Name", prop: "customerName", action: { upperCase: true, footerText: "", dAlign: "start" } },
    { name: "Contact", prop: "contact1", action: { footerText: "", dAlign: "start" } },
    { name: "Salesname", prop: "salesman", action: { footerText: "" } },
    { name: "Order Date", prop: "orderDate", action: { footerText: "" } },
    { name: "Order Delivery Date", prop: "orderDeliveryDate", action: { footerText: "" } },
    { name: "Sub Total", prop: "subTotalAmount", action: { footerSum: true, decimal: true } },
    { name: "VAT 5%", prop: "vatAmount", action: { footerSum: true, decimal: true } },
    { name: "Total", prop: "totalAmount", action: { footerSum: true, decimal: true } },
    { name: "Advance+Paid", prop: "advanceAmount", action: { footerSum: true, decimal: true } },
    { name: "Balance", prop: "balanceAmount", action: { footerSum: true, decimal: true } },
    { name: "Received Payment %", prop: "paymentReceived", customColumn: (data, header) => { return [data[header.prop]] + "%" }, action: { footerSum: calculatePaymentPercent, hAlign: "center", suffixFooterText: "%" } },
    { name: "Payment Mode", prop: "paymentMode", action: { footerText: "" } }, { name: "Deleted/Cancelled/Updated By", prop: "updatedBy", action: { footerText: "" } },
    { name: "Deleted/Cancelled/Updated  On", prop: "updatedAt", action: { footerText: "" } },
    { name: "Deleted/Cancelled/Updated  Note", prop: "note", action: { footerText: "" } },
  ],
  crystalPurchase: [
    { name: "Purchase No", prop: "purchaseNo" },
    { name: "Invoice No", prop: "invoiceNo" },
    { name: "Invoice Date", prop: "invoiceDate" },
    { name: "Supplier", prop: "supplierName" },
    { name: "Supplier Contact", prop: "supplierContact" },
    { name: "Qty", prop: "qty" },
    { name: "Sub Total", prop: "subTotalAmount", action: { decimal: true } },
    { name: "Without VAT", prop: "isWithOutVat", action: { replace: { true: "Yes", false: "No" } } },
    { name: `VAT ${VAT}%`, prop: "vatAmount", action: { decimal: true } },
    { name: "Total Amount", prop: "totalAmount", action: { decimal: true } },
    { name: "Payment Mode", prop: "paymentMode" },
    { name: "Installments", prop: "installments" },
    { name: "Installment Start From", prop: "installmentStartDate" },
    { name: "Cheque No", prop: "chequeNo" },
    { name: "Cheque Date", prop: "chequeDate" },
  ],
  crystalPurchaseDetail: [
    { name: "Crystal", prop: "crystalName", action: { hAlign: "center" } },
    { name: "Brand", prop: "crystalName", action: { hAlign: "center" } },
    { name: "Shape", prop: "crystalShape", action: { hAlign: "center" } },
    { name: "Size", prop: "crystalSize", action: { hAlign: "center" } },
    { name: "Crystal/Packet", prop: "piecePerPacket", action: { hAlign: "center" } },
    { name: "Quantity (Packet)", prop: "qty", action: { hAlign: "center" } },
    { name: "Unit Price", prop: "unitPrice", action: { decimal: true, hAlign: "center" } },
    { name: "SubTotal Amount", prop: "subTotalAmount", action: { decimal: true, hAlign: "center" } },
    { name: "VAT " + VAT + "%", prop: "vatAmount", action: { decimal: true, hAlign: "center" } },
    { name: "Total Amount", prop: "totalAmount", action: { decimal: true, hAlign: "center" } },
    { name: "Total Piece", prop: "totalPiece", action: { hAlign: "center" } }
  ],
}

export { headerFormat, customOrderStatusColumn };