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
const changeWorkTypeStatusColor = (row, header) => {
  var status = row[header.prop]?.toLowerCase();
  if (status === "completed")
    return <span className="badge bg-success">{row[header.prop]}</span>
  else
    return <span className="badge bg-warning">{row[header.prop]}</span>
}
const remainingDaysBadge = (row, header) => {
  var days = row[header.prop];
  var daysText = "";
  if (days >= 0) {
    if (days <= 29)
      daysText = days?.toFixed(2) + " Days due"
    else if (days >= 30 && days <= 365) {
      daysText = (days / 30).toFixed(2) + " Months Due";
    }
    else if (days > 365)
      daysText = (days / 365).toFixed(2) + " Year(s) Due";
  }
  if (days < 0) {
    if (days >= -29)
      daysText = (days * -1).toFixed(2) + " Days Overdue"
    else if (days <= -30 && days >= -365) {
      daysText = ((days / 30) * -1).toFixed(2) + " Months Overdue";
    }
    else if (days < -365)
      daysText = ((days / 365) * -1).toFixed(2) + " Year(s) Overdue";
  }
  if (days >= 9)
    return <span className="badge bg-info">{daysText}</span>
  if (days >= 6 && days < 9)
    return <span className="badge bg-success text-dark">{daysText}</span>
  if (days >= 2 && days < 6)
    return <span className="badge bg-warning text-dark">{daysText}</span>
  if (days >= 2 && days < 6)
    return <span className="badge bg-danger text-dark">{daysText}</span>
  if (days >= 0 && days <= 1)
    return <span className="badge bg-dark">{daysText}</span>
  if (days < 0)
    return <span className="badge bg-secondary">{daysText}</span>
}
const VAT = parseFloat(process.env.REACT_APP_VAT);
const calcWorkTypeSum = (data, header) => {
  return data.reduce((sum, ele) => {
    if (ele[header.prop]?.toLowerCase() === 'not started')
      return sum += 1;
    return sum;
  }, 0);
}
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
  if (orderStatus?.toLowerCase() === 'active')
    return <div title={orderStatus} className="text-center">{common.orderStatusIcon[orderStatus?.toLowerCase()]}</div>

  if (orderStatus?.toLowerCase() === 'delivered')
    return <div title={orderStatus} className="text-center"><i className={common.orderStatusIcon[orderStatus?.toLowerCase()] + " text-success fs-6"}></i></div>

  if (orderStatus?.toLowerCase() === 'cancelled' || orderStatus?.toLowerCase() === 'partially cancelled' || orderStatus?.toLowerCase() === 'partiallycancelled')
    return <div title={orderStatus} className="text-center"><i style={{ color: '#ff9b38b5' }} className={common.orderStatusIcon[orderStatus?.toLowerCase()] + " fs-6"} ></i></div>

  if (orderStatus?.toLowerCase() === 'partiallydelivered')
    return <div title="Partially Delivered" className="text-center"><i className={common.orderStatusIcon[orderStatus?.toLowerCase()] + " text-secondary fs-6"}></i></div>

  if (orderStatus?.toLowerCase() === 'completed')
    return <div title={orderStatus} className="text-center"><i className={common.orderStatusIcon[orderStatus?.toLowerCase()] + " text-warning fs-6"}></i></div>
  if (orderStatus?.toLowerCase() === 'deleted')
    return <div title={orderStatus} className="text-center"><i className={common.orderStatusIcon[orderStatus?.toLowerCase()] + " text-danger fs-6"}></i></div>
  if (orderStatus?.toLowerCase() === 'processing')
    return <div title={orderStatus} className="text-center"><i className={common.orderStatusIcon[orderStatus?.toLowerCase()] + " text-info fs-6"}></i></div>
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
    { name: "Order No", prop: "orderNo" },
    { name: "Qty", prop: "orderQty" },
    { name: "Customer Name", prop: "customerName", action: { upperCase: true } },
    { name: "Salesman", prop: "salesman", action: { upperCase: true } },
    { name: "Delivery Date", prop: "orderDeliveryDate" },
    { name: "Work Type", prop: "workType" },
    { name: "Order Status", prop: "orderStatus" },
    { name: "Measurement Status", prop: "measurementStatus" },
    { name: "Price", prop: "price", action: { decimal: true } },
    { name: "Cancel/Update Note", prop: "note" },
  ],
  employeeDetails: [
    { name: 'First Name', prop: 'firstName', action: { upperCase: true, hAlign: "center", dAlign: "start" } },
    { name: 'Last Name', prop: 'lastName', action: { upperCase: true, hAlign: "center", dAlign: "start" } },
    { name: 'Contact', prop: 'contact' },
    { name: 'Contact 2', prop: 'contact2' },
    { name: 'Email', prop: 'email', action: { upperCase: true, hAlign: "center", dAlign: "start" } },
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
    { name: 'Transportation', prop: 'transportation', action: { decimal: true } },
    { name: 'Other Allowance', prop: 'otherAllowance', action: { decimal: true } },
    { name: 'Salary', prop: 'salary', action: { decimal: true } },
    { name: 'Medical Expire', prop: 'medicalExpiryDate' },
    { name: 'Address', prop: 'address' },
    { name: 'Country', prop: 'country' }
  ],
  monthlyAttendence: [
    { name: "Employee Name", prop: "employeeName" },
    { name: "Year", prop: "year" },
    { name: "Month", prop: "month" },
    { name: "Salary Paid", prop: "isPaid", action: { replace: { "false": "No", "true": "Yes" } } },
    { name: "Salary Paid On", prop: "paidOn" },
    // { name: "Basic Salary", prop: "basicSalary", customColumn: (dataRow, headerRow) => { return dataRow.employee[headerRow.prop] }, action: { decimal: true } },
    // { name: "Accomdation", prop: "accomodation", customColumn: (dataRow, headerRow) => { return dataRow.employee[headerRow.prop] }, action: { decimal: true } },
    { name: "Monthly Salary", prop: "month_Salary", customColumn: (dataRow, headerRow) => { return dataRow.employee.basicSalary + dataRow.employee.accomodation }, action: { decimal: true } },
    { name: "Advance", prop: "advance", action: { decimal: true } },
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
    { name: "TRN", prop: "trn", action: { hAlign: "start", upperCase: true, width: '300px' } },
    { name: "City", prop: "branch", action: { hAlign: "center" } },
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
    { name: "Remaining Days", prop: "remainingDays", title: "Remaining Days for order delivery", customColumn: remainingDaysBadge, action: { footerText: "", hAlign: "center" } },
    { name: "Order No", prop: "orderNo", action: { footerText: "Total", hAlign: "center" } },
    { name: "Qty", prop: "orderQty", action: { footerText: "Total", hAlign: "center" } },
    {
      name: "Kandoora No", prop: "kandooraNo", action: {
        footerSum: (data) => {
          return data?.length;
        }, hAlign: "center"
      }
    },
    { name: "Grade", prop: "grade", action: { footerText: "", hAlign: "center" } },
    { name: "Salesman", prop: "salesman", action: { footerText: "", hAlign: "center" } },
    { name: "Delivery Date", prop: "deliveryDate", action: { footerText: "", hAlign: "center" } },
    { name: "Designing", prop: "design", customColumn: changeWorkTypeStatusColor, action: { footerText: "", footerSum: calcWorkTypeSum, hAlign: "center" } },
    { name: "Cutting", prop: "cutting", customColumn: changeWorkTypeStatusColor, action: { footerText: "", footerSum: calcWorkTypeSum, hAlign: "center" } },
    { name: "M.EMB", prop: "mEmb", customColumn: changeWorkTypeStatusColor, action: { footerSum: calcWorkTypeSum, hAlign: "center" } },
    { name: "H.Fix", prop: "hFix", customColumn: changeWorkTypeStatusColor, action: { footerSum: calcWorkTypeSum, hAlign: "center" } },
    { name: "H.EMB", prop: "hEmb", customColumn: changeWorkTypeStatusColor, action: { footerSum: calcWorkTypeSum, hAlign: "center" } },
    { name: "Apliq", prop: "apliq", customColumn: changeWorkTypeStatusColor, action: { footerSum: calcWorkTypeSum, hAlign: "center" } },
    { name: "Stitching", prop: "stitch", customColumn: changeWorkTypeStatusColor, action: { footerSum: calcWorkTypeSum, hAlign: "center" } },
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
    { name: "Advance", prop: "advanceAmount", action: { footerSum: true, decimal: true } },
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
  AdvanceCashVisaReport: ["Action", "Sr.", "Status", "Order No", "Qty", "Customer Name", "Contact", "Order Date", "Order Amount", "Advance", "Balance", "Delivery on", "Payment Mode"],
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
    { name: "Brand", prop: "crystalBrand", action: { hAlign: "center" } },
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
  crystalStockAlert: [
    { name: "Crystal", prop: "crystalName", action: { hAlign: "center" } },
    { name: "Brand", prop: "crystalBrand", action: { hAlign: "center" } },
    { name: "Shape", prop: "crystalShape", action: { hAlign: "center" } },
    { name: "Size", prop: "crystalSize", action: { hAlign: "center" } },
    { name: "Alert Qty", prop: "alertQty", action: { hAlign: "center" } },
    { name: "Available Packets", prop: "balanceStock", action: { hAlign: "center" } },
    { name: "Available Pieces", prop: "balanceStockPieces", action: { hAlign: "center" } }
  ],
  crystalStockUpdate: [
    { name: "Crystal", prop: "crystalName", action: { hAlign: "center", dAlign: "start" } },
    { name: "Brand", prop: "crystalBrand", action: { hAlign: "center" } },
    { name: "Shape", prop: "crystalShape", action: { hAlign: "center" } },
    { name: "Size", prop: "crystalSize", action: { hAlign: "center" } },
    { name: "Available Packets", prop: "balanceStock", action: { hAlign: "center" } },
    { name: "Available Pieces", prop: "balanceStockPieces", action: { hAlign: "center" } }
  ],
  crystalTrackingOutDetails: [
    { name: "Order No", prop: "orderNo", action: { hAlign: "center", dAlign: "start" } },
    { name: "Kandoora No", prop: "kandooraNo", action: { hAlign: "center" } },
    { name: "Release Qty", prop: "releaseQty", action: { hAlign: "center" } },
    { name: "Release Date", prop: "releaseDate", action: { hAlign: "center" } },
    { name: "Return Qty", prop: "returnQty", action: { hAlign: "center" } },
    { name: "Return Date", prop: "returnDate", action: { hAlign: "center" } }
  ],
  purchaseEntry: [
    { name: "purchase No", prop: "purchaseNo", action: { hAlign: "center", footerText: "" } },
    { name: "Invoice Number", prop: "invoiceNo", action: { hAlign: "center", footerText: "" } },
    { name: "Invoice Date", prop: "invoiceDate", action: { hAlign: "center", footerText: "" } },
    { name: "Supplier", prop: "supplier", action: { hAlign: "center", footerText: "" } },
    { name: "Contact No", prop: "contactNo", action: { hAlign: "center", footerText: "" } },
    { name: "TRN No.", prop: "trn", action: { hAlign: "center", footerText: "Total" } },
    { name: "Total Item", prop: "totalItems", action: { decimal: true, footerSum: true, hAlign: "center" } },
    { name: "Total Quantity", prop: "totalQty", action: { decimal: true, footerSum: true, hAlign: "center" } },
    { name: "Total Amount", prop: "totalAmount", action: { decimal: true, footerSum: true, hAlign: "center" } },
    { name: "Created By", prop: "createdBy", action: { hAlign: "center", footerText: "" } }
  ],
  purchaseEntryDetail: [
    { name: "Product", prop: "productName" },
    { name: "Quantity", prop: "qty", action: { decimal: true } },
    { name: "Unit Price", prop: "unitPrice", action: { decimal: true } },
    { name: "Total Price", prop: "totalPrice", action: { decimal: true } },
    { name: "Purchase Date", prop: "purchaseDate" },
    { name: "Description", prop: "description" },
  ],
  advancePaymentHistory: [
    { name: "Amount", prop: "credit", action: { decimal: true, hAlign: "center", footerSum: true } },
    { name: "Date", prop: "paymentDate", action: { hAlign: "center", footerText: "" } },
    { name: "Payment By", prop: "paymentMode", action: { hAlign: "center", footerText: "" } },
    { name: "Payment For", prop: "reason", action: { hAlign: "center", replace: { AdvancedPaid: "Advanced", PaymentReceived: "Delivery" }, footerText: "" } },
    { name: "Delivered Qty", prop: "deliveredQty", action: { hAlign: "center", footerSum: true } },
  ],
  eachKandooraExpReort: [
    { name: "Order Date", prop: "orderDate", action: { footerText: "" } },
    { name: "Order No.", prop: "orderNo", action: { footerCount: true, hAlign: "center" } },
    { name: "Customer Name", prop: "customerName", action: { hAlign: 'center', dAlign: 'center', upperCase: true, footerText: "" } },
    { name: "Modal No", prop: "modalNo" },
    { name: "Amount", prop: "amount", action: { hAlign: 'end', dAlign: 'end', decimal: true, footerSum: true } },
    { name: "Design", prop: "design", action: { hAlign: 'end', dAlign: 'end', decimal: true, footerSum: true } },
    { name: "Cutting", prop: "cutting", action: { hAlign: 'end', dAlign: 'end', decimal: true, footerSum: true } },
    { name: "Crystal", prop: "crystalUsed", action: { hAlign: 'end', dAlign: 'end', decimal: true, footerSum: true } },
    { name: "M Emb.", prop: "mEmb", action: { hAlign: 'end', dAlign: 'end', decimal: true, footerSum: true } },
    { name: "Hot Fix", prop: "hFix", action: { hAlign: 'end', dAlign: 'end', decimal: true, footerSum: true } },
    { name: "H Emb.", prop: "hEmb", action: { hAlign: 'end', dAlign: 'end', decimal: true, footerSum: true } },
    { name: "Apliq", prop: "apliq", action: { hAlign: 'end', dAlign: 'end', decimal: true, footerSum: true } },
    { name: "Stitch", prop: "stitch", action: { hAlign: 'end', dAlign: 'end', decimal: true, footerSum: true } },
    { name: "Fix Amount", prop: "fixAmount", action: { hAlign: 'end', dAlign: 'end', decimal: true, footerSum: true } },
    { name: "Total Amount", prop: "totalAmount", action: { hAlign: 'end', dAlign: 'end', decimal: true, footerSum: true } },
    { name: "Profit", prop: "profit", action: { hAlign: 'end', dAlign: 'end', decimal: true, footerSum: true } },
    {
      name: "Profit Percentage", prop: "profitPercentage", action: {
        hAlign: 'end',
        dAlign: 'end',
        decimal: true,
        footerSum: (data, header, footerSumInDecimal) => {
          if(data?.length===0)
          return 0;
          var result = (data?.reduce((sum, ele) => {
            return sum += ele?.profit ?? 0
          }, 0) /
            data?.reduce((sum, ele) => {
              return sum += ele?.amount ?? 0
            }, 0)) * 100;
          if (footerSumInDecimal === true)
            return common.printDecimal(result);
          return result;
        },
        suffixFooterText: "%",
        footerSumInDecimal: true
      }
    }
  ],
  employeeAdvancePayment: [
    { name: 'First Name', prop: 'firstName', customColumn: (dataRow, headerRow) => { return dataRow.employee[headerRow.prop] } },
    { name: 'Last Name', prop: 'lastName', customColumn: (dataRow, headerRow) => { return dataRow.employee[headerRow.prop] } },
    { name: 'Job Title', prop: 'jobTitle', customColumn: (dataRow, headerRow) => { return dataRow.employee[headerRow.prop] } },
    { name: 'Amount', prop: 'amount' },
    { name: 'EMI', prop: 'emi', customColumn: (dataRow, headerRow) => { return dataRow[headerRow.prop] + ' Months' } },
    { name: 'Reason', prop: 'reason' },
    { name: 'Date', prop: 'advanceDate' }
  ]
}

export { headerFormat, customOrderStatusColumn, remainingDaysBadge };