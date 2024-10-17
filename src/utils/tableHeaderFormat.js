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
const changeWorkTypeStatusColor = (row, header, rowIndex, colIndex, data, allheaders) => {
  var status = row[header.prop]?.toLowerCase();
  if (status === "completed")
    return <span className="badge bg-success" data-toggle="tooltip" title={`Work type ${header.name} is ${row[header.prop]} `}>{row[header.prop]}</span>
  else if (status === "not started") {
    if (allheaders[colIndex + 1] !== undefined && data[rowIndex][allheaders[colIndex + 1].prop]?.toLowerCase() === "completed")
      return <span className="badge bg-danger" data-toggle="tooltip" title={`Work type ${header.name} is ${row[header.prop]} `} >{row[header.prop]}</span>
    else
      return <span className="badge bg-warning text-dark" data-toggle="tooltip" title={`Work type ${header.name} is ${row[header.prop]} `} >{row[header.prop]}</span>
  }
  else
    return <span className="badge bg-danger" data-toggle="tooltip" title={`Work type ${header.name} is not assigned to Kandoora No. ${row?.orderNo} `} ></span>
}

const customFabricImage=(data)=>{
  return <div >
    <img className="gridImage" title="Click & hold to zoom image" style={{ width: '30px', height: '30px', borderRadius: '4%', textAlign: 'center' }} loading="lazy" src={ThumbImagePathMaker(data.fabricImagePath)}/>
  </div>
}
const customFabricColor=(data)=>{
  return <div style={{ width: '100%', display: 'flex', justifyContent: 'center', alignItems: 'stretch', flexWrap: 'nowrap', flexDirection: 'row' }}>
  <div style={{ backgroundColor: data.fabricColorCode, width: '15px', height: '15px', borderRadius: '50%', textAlign: 'center' }}></div>
  <div style={{paddingLeft:'3px'}}>{data.fabricColorName}</div>
</div>
}

const remainingDaysBadge = (row, header) => {
  var days = row[header.prop];
  if (row?.isPaid)
    return "";
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
      daysText = parseInt((days * -1)) + " Days Overdue"
    else if (days <= -30 && days >= -365) {
      daysText = ((days / 30) * -1).toFixed(2) + " Months Overdue";
    }
    else if (days < -365)
      daysText = ((days / 365) * -1).toFixed(2) + " Year(s) Overdue";
  }

  if (days < -15) {
    return <span className="badge bg-dark">{daysText}</span>
  }
  if (days < 0 && days >= -15) {
    return <span className="badge bg-danger">{daysText}</span>
  }
  if (days >= 0 && days <= 10)
    return <span className="badge bg-warning text-dark">{daysText}</span>
  if (days > 10)
    return <span className="badge bg-success">{daysText}</span>
}

const VAT = parseFloat(process.env.REACT_APP_VAT);

const calcWorkTypeSum = (data, header) => {
  return <>
    <div className="badge bg-warning text-dark" style={{ width: '100%', fontSize: '11px' }}>
      Pending:   {data.reduce((sum, ele) => {
        if (ele[header.prop]?.toLowerCase() === 'not started')
          return sum += 1;
        return sum;
      }, 0)}
    </div>
    <br />
    <div className="badge bg-success">
      Completed:  {data.reduce((sum, ele) => {
        if (ele[header.prop]?.toLowerCase() === 'completed')
          return sum += 1;
        return sum;
      }, 0)}</div>
  </>
}

const calcPendingWorkTypeSum = (data, header) => {
  return <>
    <div className="badge bg-warning text-dark" title="Pending Count" style={{ width: '100%', fontSize: '19px' }}>
      {data.reduce((sum, ele) => {
        if (ele[header.prop]?.toLowerCase() === 'not started')
          return sum += 1;
        return sum;
      }, 0)}
    </div>
  </>
}
const descriptionChangeHandler = (e, option, filterData) => {
  var selectedVal = e.target.value;
  if (selectedVal === "") {
    option.data = option?.originalData;

    option.setTableOption({ ...option });
  }
  else {
    var index = parseInt(selectedVal);
    option.data = option?.originalData?.filter(x => x.description === filterData[index - 1]);

    option.setTableOption({ ...option });
  }
}
const addDescriptionFilter = (data, header, option) => {
  const names = option?.originalData.map(obj => obj.description);
  const uniqueNamesSet = new Set(names);
  const uniqueDescription = [...uniqueNamesSet].sort();
  return <>
    <div className="" title="Description Filter" style={{ width: '100%', fontSize: '15px' }}>
      <select onChange={e => descriptionChangeHandler(e, option, uniqueDescription)}>
        <option value="">Default</option>
        {uniqueDescription?.map((ele, ind) => {
          return <option key={ind} value={ind + 1}>{ele}</option>
        })}
      </select>
    </div>
  </>
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

const customCrystalStockStatusColumn = (data, header) => {
  let limit = data?.alertQty ?? 0, available = data?.balanceStock ?? 0, waringLimit = limit + 10;
  if (available > waringLimit)
    return <div data-toggle="tooltip" title="Sufficient stock available" className="text-center text-success"><i className="bi bi-circle-fill" /> </div>
  else if (available <= waringLimit && available > limit)
    return <div data-toggle="tooltip" title="Warning stock alert" className="text-center text-warn"><i className="bi bi-circle-fill" /></div>
  else
    return <div data-toggle="tooltip" title="Below than stock alert limit" className="text-center text-danger"><i className="bi bi-circle-fill" /></div>

}

const customFabricStockStatusColumn = (data, header) => {
  let limit = data?.lowAlertQty ?? 0, available = data?.availableQty ?? 0, waringLimit = limit + 10;
  if (available > waringLimit)
    return <div data-toggle="tooltip" title="Sufficient stock available" className="text-center text-success"><i className="bi bi-circle-fill" /> </div>
  else if (available <= waringLimit && available > limit)
    return <div data-toggle="tooltip" title="Warning stock alert" className="text-center text-warn"><i className="bi bi-circle-fill" /></div>
  else
    return <div data-toggle="tooltip" title="Below than stock alert limit" className="text-center text-danger"><i className="bi bi-circle-fill" /></div>

}
const customOrderStatusColumn = (data, header) => {
  let orderStatus = data[header.prop];
  if (orderStatus?.toLowerCase() === 'active')
    return <div data-toggle="tooltip" title={orderStatus} className="text-center">{common.orderStatusIcon[orderStatus?.toLowerCase()]}</div>

  if (orderStatus?.toLowerCase() === 'delivered')
    return <div data-toggle="tooltip" title={orderStatus} className="text-center"><i className={common.orderStatusIcon[orderStatus?.toLowerCase()] + " text-warning fs-6"}></i></div>

  if (orderStatus?.toLowerCase() === 'cancelled' || orderStatus?.toLowerCase() === 'partially cancelled' || orderStatus?.toLowerCase() === 'partiallycancelled')
    return <div data-toggle="tooltip" title={orderStatus} className="text-center"><i style={{ color: '#ff9b38b5' }} className={common.orderStatusIcon[orderStatus?.toLowerCase()] + " fs-6"} ></i></div>

  if (orderStatus?.toLowerCase() === 'partiallydelivered')
    return <div data-toggle="tooltip" title="Partially Delivered" className="text-center"><i className={common.orderStatusIcon[orderStatus?.toLowerCase()] + " text-secondary fs-6"}></i></div>

  if (orderStatus?.toLowerCase() === 'completed')
    return <div data-toggle="tooltip" title={orderStatus} className="text-center"><i className={common.orderStatusIcon[orderStatus?.toLowerCase()] + " text-success fs-6"}></i></div>
  if (orderStatus?.toLowerCase() === 'deleted')
    return <div data-toggle="tooltip" title={orderStatus} className="text-center"><i className={common.orderStatusIcon[orderStatus?.toLowerCase()] + " text-danger fs-6"}></i></div>
  if (orderStatus?.toLowerCase() === 'processing')
    return <div data-toggle="tooltip" title={orderStatus} className="text-center"><i className={common.orderStatusIcon[orderStatus?.toLowerCase()] + " text-info fs-6"}></i></div>
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

const ThumbImagePathMaker=(imagePath)=>{
  if(imagePath===undefined || imagePath===null || imagePath==='')
    return "/assets/images/default-image.jpg";
  var separatorLastIndex=imagePath?.lastIndexOf('\\');
  var totalLength=imagePath?.length;
  var absPath=imagePath?.substr(0,separatorLastIndex);
  var imageFileName=imagePath?.substr(separatorLastIndex+1,totalLength);
  return process.env.REACT_APP_API_URL+absPath+'\\'+'thumb_'+imageFileName;
}
const headerFormat = {
  order: [
    { name: "Order Status", prop: "status", customColumn: customOrderStatusColumn, action: { footerText: "Total", showTooltip: false } },
    {
      name: "Order No", prop: "orderNo", action: {
        footerText: "", footerSum: (data) => {
          return data?.length;
        }, hAlign: "center"
      }
    },
    { name: "Qty", prop: "qty", action: { footerSum: true, footerSumInDecimal: false }, customColumn: (rowData, Header) => (rowData.qty === null || rowData.qty === undefined) ? rowData.orderDetails?.length : rowData.qty },
    { name: "Customer Name", prop: "customerName", action: { upperCase: true, footerText: "", dAlign: "start" } },
    { name: "Contact", prop: "contact1", action: { footerText: "", dAlign: "start" } },
    { name: "Salesname", prop: "salesman", action: { footerText: "" } },
    { name: "Order Date", prop: "orderDate", action: { footerText: "" } },
    { name: "Order Delivery Date", prop: "orderDeliveryDate", action: { footerText: "" } },
    { name: "Sub Total", prop: "subTotalAmount", action: { footerSum: true, decimal: true } },
    { name: "VAT 5%", prop: "vatAmount", action: { footerSum: true, decimal: true } },
    { name: "Total", prop: "totalAmount", action: { footerSum: true, decimal: true } },
    {
      name: "Advance+Paid", prop: "advanceAmount",
      customColumn: (data, header) => {
        return common.printDecimal(data?.advanceAmount)
      },
      action: { footerSum: true, decimal: true }
    },
    { name: "Balance", prop: "balanceAmount", action: { footerSum: true, decimal: true } },
    { name: "Received Payment %", prop: "paymentReceived", customColumn: (data, header) => { return [data[header.prop]] + "%" }, action: { footerSum: calculatePaymentPercent, hAlign: "center", suffixFooterText: "%" } },
    { name: "Payment Mode", prop: "paymentMode", action: { footerText: "" } }, { name: "Deleted/Cancelled/Updated By", prop: "updatedBy", action: { footerText: "" } },
    { name: "Deleted/Cancelled/Updated  On", prop: "updatedAt", action: { footerText: "" } },
    { name: "Deleted/Cancelled/Updated  Note", prop: "note", action: { footerText: "" } },
  ],
  orderDetails: [
    { name: "Order Status", prop: "status", customColumn: customOrderStatusColumn },
    { name: "Order No", prop: "orderNo" },
    { name: "Order Type", prop: "orderType" },
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
    {
      name: "Completed", prop: "orderQty", customColumn: (data) => {
        return data?.workTypesCompletedStatus[0].completed ? "Yes" : "No";
      }
    },
    { name: "Customer Name", prop: "customerName", action: { upperCase: true } },
    { name: "Salesman", prop: "salesman", action: { upperCase: true } },
    { name: "Delivery Date", prop: "orderDeliveryDate" },
    { name: "Work Type", prop: "workType" },
    { name: "Order Status", prop: "orderStatus" },
    { name: "Booking Type", prop: "orderType" },
    { name: "Measurement Status", prop: "measurementStatus" },
    { name: "Price", prop: "price", action: { decimal: true } },
    { name: "Cancel/Update Note", prop: "note" },
  ],
  employeeDetails: [
    { name: 'Emp Status', prop: 'empStatusName', action: { upperCase: true, hAlign: "center", dAlign: "start" } },
    { name: 'First Name', prop: 'firstName', action: { upperCase: true, hAlign: "center", dAlign: "start" } },
    { name: 'Last Name', prop: 'lastName', action: { upperCase: true, hAlign: "center", dAlign: "start" } },
    { name: 'Contact', prop: 'contact' },
    { name: 'Contact 2', prop: 'contact2' },
    { name: 'Email', prop: 'email', action: { upperCase: true, hAlign: "center", dAlign: "start" } },
    { name: 'Job Name', prop: 'jobTitle' },
    { name: 'Role', prop: 'role' },
    { name: 'Fixed Employee', prop: 'isFixedEmployee', action: { replace: { true: "Yes", false: "No" } } },
    { name: 'Emp Company', prop: 'companyName', action: { upperCase: true, hAlign: "center", dAlign: "start" } },
    { name: 'Cancel Date', prop: 'cancelDate', action: { upperCase: true, hAlign: "center", dAlign: "start" } },
    { name: 'Hire Date', prop: 'hireDate' },
    { name: 'Labour ID', prop: 'labourId' },
    { name: 'Labour ID Expire', prop: 'labourIdExpire' },
    { name: 'Passport Number', prop: 'passportNumber' },
    { name: 'Passport Expiry Date', prop: 'passportExpiryDate' },
    { name: 'Emirate ID', prop: 'emiratesId' },
    { name: 'Emirate Expiry Date', prop: 'emiratesIdExpire' },
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
    { name: "Over Time", prop: "overTime", action: { decimal: true } },
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
    { name: 'Expense No', prop: 'expenseNo', action: { footerText: "", hAligh: "center", dAlign: "start" } },
    { name: 'Expense Date', prop: 'expenseDate', action: { footerText: "", hAligh: "center", dAlign: "start" } },
    { name: 'Expense Type', prop: 'expenseType', action: { footerText: "", hAligh: "center", dAlign: "start" } },
    { name: 'Expense Name', prop: 'expenseName', action: { footerText: "", hAligh: "center", dAlign: "start" } },
    { name: 'Name', prop: 'name', action: { footerText: "", hAligh: "center", dAlign: "start" } },
    { name: 'Description', prop: 'description', action: { footerText: "", hAligh: "center", dAlign: "start" } },
    { name: 'Amount', prop: 'amount', action: { footerSum: true, decimal: true } },
    { name: 'Payment Mode', prop: 'paymentMode', action: { footerText: "", hAligh: "center", dAlign: "start" } },
    { name: 'Company/Shop', prop: 'expenseShopCompany', action: { footerText: "", hAligh: "center", dAlign: "start" } },
    { name: 'Emp Categoty', prop: 'jobTitle', action: { footerText: "", hAligh: "center", dAlign: "start" } },
    { name: 'Emp Name', prop: 'employeeName', action: { footerText: "", hAligh: "center", dAlign: "start" } },
  ],
  expenseName: [
    { name: 'Expanse Name', prop: 'value' },
    { name: 'Expanse Type', prop: 'expenseType' },
    { name: 'Code', prop: 'code' }
  ],
  expenseType: [
    { name: 'Value', prop: 'value', action: { hAlign: "center", dAlign: "start", footerText: "" } },
    { name: 'Code', prop: 'code', action: { hAlign: "center", dAlign: "start", footerText: "" } }
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
  fabricCustomerDetail: [
    { name: "First name", prop: "firstName", action: { upperCase: true, hAlign: "center" } },
    { name: "Last name", prop: "lastName", action: { upperCase: true, hAlign: "center" } },
    { name: "Total Purchase", prop: "totalOrders", action: { hAlign: "center" } },
    { name: "Contact1", prop: "primaryContact", action: { hAlign: "center" } },
    { name: "Contact2", prop: "secondaryContact", action: { hAlign: "center" } },
    { name: "TRN", prop: "trn", action: { hAlign: "start", upperCase: true, width: '300px' } }
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
    { name: "Order Type", prop: "orderType" },
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
    {
      name: "Order Type", prop: "orderType", customColumn: (data, id) => {
        if (data?.orderType === "" || data?.orderType === undefined || data?.orderType === null) {
          debugger;
          var amount = parseInt(data?.grade.split("/")[1]);
          amount = isNaN(amount) ? 0 : amount;
          if (amount <= 1000) {
            return "Light";
          }
          if (amount > 1000 && amount <= 2000) {
            return "Normal";
          }
          else {
            return "Heavy";
          }
        }
        return data?.orderType;
      }
    }, {
      name: "Kandoora No", prop: "kandooraNo", action: {
        footerSum: (data) => {
          return data?.length;
        }, hAlign: "center"
      }
    },
    { name: "Grade", prop: "grade", action: { footerText: "", hAlign: "center" } },
    {
      name: "Description", prop: "description",
      customColumn: (data, id) => {
        var out = data?.description ?? "";
        if (data?.description === "" || data?.description === undefined || data?.description === null) {
          if (data?.hasAdvancePayment === false)
            out += "No AVD";
          else if (data?.hasMeasurement === false)
            out += "/No MM";
          else
            return ""
        }
        return out;
      },
      action: { footerText: "", hAlign: "center" }, headerTop: { text: addDescriptionFilter }
    },
    { name: "Delivery Date", prop: "deliveryDate", action: { footerText: "", hAlign: "center" } },
    { name: "Designing", prop: "design", customColumn: changeWorkTypeStatusColor, action: { footerText: "", footerSum: calcWorkTypeSum, hAlign: "center" }, headerTop: { text: calcPendingWorkTypeSum } },
    { name: "Cutting", prop: "cutting", customColumn: changeWorkTypeStatusColor, action: { footerText: "", footerSum: calcWorkTypeSum, hAlign: "center" }, headerTop: { text: calcPendingWorkTypeSum } },
    { name: "M.EMB", prop: "mEmb", customColumn: changeWorkTypeStatusColor, action: { footerSum: calcWorkTypeSum, hAlign: "center" }, headerTop: { text: calcPendingWorkTypeSum } },
    { name: "H.Fix", prop: "hFix", customColumn: changeWorkTypeStatusColor, action: { footerSum: calcWorkTypeSum, hAlign: "center" }, headerTop: { text: calcPendingWorkTypeSum } },
    { name: "H.EMB", prop: "hEmb", customColumn: changeWorkTypeStatusColor, action: { footerSum: calcWorkTypeSum, hAlign: "center" }, headerTop: { text: calcPendingWorkTypeSum } },
    { name: "Apliq", prop: "apliq", customColumn: changeWorkTypeStatusColor, action: { footerSum: calcWorkTypeSum, hAlign: "center" }, headerTop: { text: calcPendingWorkTypeSum } },
    { name: "Stitching", prop: "stitch", customColumn: changeWorkTypeStatusColor, action: { footerSum: calcWorkTypeSum, hAlign: "center" }, headerTop: { text: calcPendingWorkTypeSum } },
  ],
  printOrderAlert: [{ name: "Due Days", prop: "remainingDays", title: "Remaining Days for order delivery", customColumn: remainingDaysBadge, action: { footerText: "", hAlign: "center" } },
  { name: "Qty", prop: "orderQty" },
  { name: "Order No", prop: "kandooraNo" },
  { name: "Order Type", prop: "orderType" },
  { name: "Grade", prop: "grade" },
  { name: "Salesman", prop: "salesman" },
  { name: "Del. Date", prop: "deliveryDate" },
  { name: "Design", prop: "design" },
  { name: "Cutting", prop: "cutting" },
  { name: "M.EMB", prop: "mEmb" },
  { name: "H.Fix", prop: "hFix" },
  { name: "H.EMB", prop: "hEmb" },
  { name: "Apliq", prop: "apliq" },
  { name: "Stitch", prop: "stitch" },
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
    { name: "Order Type", prop: "orderType" },
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
    { name: "Order Type", prop: "orderType" },
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
  crystalStockConsumedDetails: [
    { name: "Consume Date", prop: "releaseDate", action: { hAlign: "center", footerText: "Total" } },
    { name: "Crystal", prop: "crystalName", action: { hAlign: "center", dAlign: "start", footerText: "" } },
    { name: "Used Packets", prop: "releasePacketQty", action: { footerSum: true, hAlign: "center", footerSumInDecimal: true } },
    { name: "Used Pieces", prop: "releasePieceQty", action: { footerSum: true, hAlign: "center", footerSumInDecimal: false } },
    { name: "Alter Packets", prop: "alterPackets", action: { footerSum: true, hAlign: "center", footerSumInDecimal: false } },
    { name: "Total Orders", prop: "totalOrders", action: { footerSum: true, hAlign: "center", footerSumInDecimal: false } }
  ],
  crystalStockUpdate: [
    { name: "Crystal", prop: "crystalName", action: { hAlign: "center", dAlign: "start" } },
    { name: "Stock Status", prop: "crystalName", customColumn: customCrystalStockStatusColumn, action: { hAlign: "center", dAlign: "start", showTooltip: false } },
    { name: "Brand", prop: "crystalBrand", action: { hAlign: "center" } },
    { name: "Shape", prop: "crystalShape", action: { hAlign: "center" } },
    { name: "Size", prop: "crystalSize", action: { hAlign: "center" } },
    { name: "Available Packets", prop: "balanceStock", action: { hAlign: "center" } },
    { name: "Available Pieces", prop: "balanceStockPieces", action: { hAlign: "center" } }
  ],
  crystalStockDetails: [
    { name: "Crystal", prop: "crystalName", action: { footerText: "Total", hAlign: "center", dAlign: "start" } },
    { name: "Stock Status", prop: "crystalName", customColumn: customCrystalStockStatusColumn, action: { footerText: "", hAlign: "center", dAlign: "start", showTooltip: false } },
    { name: "Brand", prop: "crystalBrand", action: { footerText: "", hAlign: "center" } },
    { name: "Shape", prop: "crystalShape", action: { footerText: "", hAlign: "center" } },
    { name: "Size", prop: "crystalSize", action: { footerText: "", hAlign: "center" } },
    { name: "Old Stock", prop: "oldStock", action: { footerSum: true, hAlign: "center" } },
    { name: "New Stock", prop: "newStock", action: { footerSum: true, hAlign: "center" } },
    { name: "Total Stock", prop: "totalStock", action: { footerSum: true, hAlign: "center" } },
    { name: "Consume Stock", prop: "consumeStock", action: { footerSum: true, hAlign: "center" } },
    { name: "Available Packets", prop: "balanceStock", action: { footerSum: true, hAlign: "center" } },
    //{ name: "Available Pieces", prop: "balanceStockPieces", action: { hAlign: "center" } }
  ],
  crystalTrackingOutMain: [
    { name: "Order No", prop: "orderNo", action: { hAlign: "center", dAlign: "start" } },
    { name: "Kandoora No", prop: "kandooraNo", action: { hAlign: "center" } },
    {
      name: "Release Qty", prop: "releasePacketQty", customColumn: (data, head) => {
        return data?.crystalTrackingOutDetails?.reduce((sum, ele) => {
          return sum += ele[head.prop];
        }, 0)
      }, action: { hAlign: "center" }
    },
    {
      name: "Release Pieces", prop: "releasePieceQty", customColumn: (data, head) => {
        return data?.crystalTrackingOutDetails?.reduce((sum, ele) => {
          return sum += ele[head.prop];
        }, 0)
      },
      action: { hAlign: "center" }
    },
    { name: "Release Date", prop: "releaseDate", action: { hAlign: "center" } },
    {
      name: "Return Qty", prop: "returnPacketQty", customColumn: (data, head) => {
        return data?.crystalTrackingOutDetails?.reduce((sum, ele) => {
          return sum += ele[head.prop];
        }, 0)
      }, action: { hAlign: "center" }
    },
    {
      name: "Return Pieces", prop: "returnPieceQty", customColumn: (data, head) => {
        return data?.crystalTrackingOutDetails?.reduce((sum, ele) => {
          return sum += ele[head.prop];
        }, 0)
      }, action: { hAlign: "center" }
    },
    { name: "Return Date", prop: "returnDate", action: { hAlign: "center" } }
  ],
  crystalTrackingOutDetail: [
    { name: "Crystal Name", prop: "crystalName", action: { hAlign: "center", footerText: "Total" } },
    { name: "Release Date", prop: "releaseDate", action: { hAlign: "center", footerText: "" } },
    { name: "Release Qty", prop: "releasePacketQty", action: { hAlign: "center", footerSum: true, footerSumInDecimal: false, } },
    { name: "Release Pieces", prop: "releasePieceQty", action: { hAlign: "center", footerSum: true, footerSumInDecimal: false, } },
    { name: "Return Qty", prop: "returnPacketQty", action: { hAlign: "center", footerSum: true, footerSumInDecimal: false, } },
    { name: "Return Pieces", prop: "returnPieceQty", action: { hAlign: "center", footerSum: true, footerSumInDecimal: false, } },
    { name: "Return Date", prop: "returnDate", action: { hAlign: "center", footerText: "" } },
    {
      name: "Used Qty", prop: "returnPacketQty", customColumn: (data) => {
        return parseInt(data.releasePacketQty - data.returnPacketQty)
      }, action: {
        hAlign: "center", footerSum: (data) => {
          return data.reduce((sum, ele) => {
            return sum += ele.releasePacketQty - ele.returnPacketQty
          }, 0);
        }
      }
    },
    {
      name: "Used Pieces", prop: "returnPieceQty", customColumn: (data) => {
        return parseInt(data.releasePieceQty - data.returnPieceQty)
      }, action: {
        hAlign: "center", footerSum: (data) => {
          return data.reduce((sum, ele) => {
            return sum += ele.releasePieceQty - ele.returnPieceQty
          }, 0);
        }
      }
    }
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
    { name: "Status", prop: "status", customColumn: customOrderStatusColumn, action: { hAlign: "center" } },
    { name: "Customer Name", prop: "customerName", action: { hAlign: 'center', dAlign: 'center', upperCase: true, footerText: "" } },
    { name: "Salesman", prop: "salesman" },
    { name: "Modal No", prop: "modalNo" },
    { name: "Amount", prop: "amount", action: { hAlign: 'end', dAlign: 'end', decimal: true, footerSum: true } },
    { name: "Design", prop: "design", action: { hAlign: 'end', dAlign: 'end', decimal: true, footerSum: true } },
    { name: "Cutting", prop: "cutting", action: { hAlign: 'end', dAlign: 'end', decimal: true, footerSum: true } },
    { name: "M Emb.", prop: "mEmb", action: { hAlign: 'end', dAlign: 'end', decimal: true, footerSum: true } },
    { name: "Hot Fix", prop: "hFix", action: { hAlign: 'end', dAlign: 'end', decimal: true, footerSum: true } },
    {
      name: "Crystal Price", prop: "crystalPrice",
      action: { hAlign: 'end', dAlign: 'end', decimal: true, footerSum: true }
    },
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
          if (data?.length === 0)
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
  eachKandooraExpReortPrint: [
    { name: "Order Date", prop: "orderDate", action: { footerText: "" } },
    { name: "Order No.", prop: "orderNo", action: { footerCount: true, hAlign: "center" } },
    { name: "Status", prop: "status", customColumn: customOrderStatusColumn, action: { hAlign: "center" } },
    { name: "Customer", prop: "customerName", action: { hAlign: 'center', dAlign: 'center', upperCase: true, footerText: "" } },
    { name: "Salesman", prop: "salesman" },
    { name: "Modal", prop: "modalNo" },
    { name: "Amt", prop: "amount", action: { hAlign: 'end', dAlign: 'end', decimal: true, footerSum: true } },
    { name: "Design", prop: "design", action: { hAlign: 'end', dAlign: 'end', decimal: true, footerSum: true } },
    { name: "Cutting", prop: "cutting", action: { hAlign: 'end', dAlign: 'end', decimal: true, footerSum: true } },
    { name: "M Emb.", prop: "mEmb", action: { hAlign: 'end', dAlign: 'end', decimal: true, footerSum: true } },
    { name: "HotFix", prop: "hFix", action: { hAlign: 'end', dAlign: 'end', decimal: true, footerSum: true } },
    {
      name: "Cry. Price", prop: "crystalPrice",
      action: { hAlign: 'end', dAlign: 'end', decimal: true, footerSum: true }
    },
    { name: "H Emb.", prop: "hEmb", action: { hAlign: 'end', dAlign: 'end', decimal: true, footerSum: true } },
    { name: "Apliq", prop: "apliq", action: { hAlign: 'end', dAlign: 'end', decimal: true, footerSum: true } },
    { name: "Stitch", prop: "stitch", action: { hAlign: 'end', dAlign: 'end', decimal: true, footerSum: true } },
    { name: "Fix Amt", prop: "fixAmount", action: { hAlign: 'end', dAlign: 'end', decimal: true, footerSum: true } },
    { name: "Total Amt", prop: "totalAmount", action: { hAlign: 'end', dAlign: 'end', decimal: true, footerSum: true } },
    { name: "Profit", prop: "profit", action: { hAlign: 'end', dAlign: 'end', decimal: true, footerSum: true } },
    {
      name: "Profit %", prop: "profitPercentage", action: {
        hAlign: 'end',
        dAlign: 'end',
        decimal: true,
        footerSum: (data, header, footerSumInDecimal) => {
          if (data?.length === 0)
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
  ],
  employeeSalarySlip: [
    { name: 'Voucher No.', prop: 'voucherNo', customColumn: (data, header) => { return "000" + data[header.prop]?.slice(-7) }, action: { footerText: "" } },
    { name: 'Date', prop: 'date', action: { footerText: "Total" } },
    { name: 'Order No.', prop: 'kandooraNo', action: { footerCount: true, hAlign: "center", dAlign: "center" } },
    { name: 'Price+Grade', prop: 'orderPrice', action: { footerText: "" }, customColumn: (data, header) => { return data[header.prop] + ' - ' + common.getGrade(data['orderPrice']) } },
    { name: 'Qty', prop: 'qty', action: { footerSum: true } },
    { name: 'Note', prop: 'note', action: { footerText: "" } },
    { name: 'Amount', prop: 'amount', action: { footerSum: true, footerSumInDecimal: true, decimal: true, hAlign: 'center', dAlign: 'end' } },
    { name: 'Alter Amount', prop: 'extra', action: { footerSum: true, footerSumInDecimal: true, decimal: true, hAlign: 'end', dAlign: 'end' } }
  ],
  employeeSalaryLedger: [
    { name: 'Emp ID', prop: 'employeeId', action: { footerText: "" } },
    { name: 'Emp Name', prop: 'employeeName', action: { footerText: "", decimal: true, hAlign: "center", dAlign: "start" } },
    { name: 'Qty', prop: 'qty', action: { footerSum: true, footerSumInDecimal: false, hAlign: "center", dAlign: "center" } },
    {
      name: 'Average',
      prop: 'avg',
      customColumn: (data, header) => {
        return (data?.amount / data?.qty).toFixed(2)
      },
      action: {
        footerSum: (data) => {
          return (
            data?.reduce((sum, ele) => {
              return sum += ele?.amount
            }, 0) / data?.reduce((sum, ele) => {
              return sum += ele?.qty
            }, 0)
          ).toFixed(2);
        },
        footerSumInDecimal: false,
        hAlign: "center",
        dAlign: "center"
      }
    },
    { name: 'Amount', prop: 'amount', action: { footerSum: true, decimal: true, hAlign: "end", dAlign: "end" } },
    { name: 'EMI Amount', prop: 'emiAmount', action: { footerSum: true, decimal: true, hAlign: "end", dAlign: "end" } },
  ],
  dailyWorkStatement: [
    { name: 'Emp ID', prop: 'employeeId' },
    { name: 'Emp Name', prop: 'employeeName', action: { dAlign: "start" } },
    { name: 'OrderNo', prop: 'orderNo' },
    { name: 'Date', prop: 'date' },
    { name: 'ModalNo', prop: 'modalNo', action: { dAlign: "start" } },
    { name: 'Note', prop: 'note', action: { dAlign: "start" } },
    { name: 'Amount', prop: 'amount', action: { footerSum: true, footerSumInDecimal: true, decimal: true, hAlign: 'center', dAlign: 'end' } }
  ],
  missingKandooraImage: [
    { name: 'Kandoora No', prop: 'orderNo' },
    { name: 'Unstitch', prop: 'unstitch' },
    { name: 'Stitch', prop: 'Stitch' }],
  workerPerformance: [
    { name: 'Emp ID', prop: 'workerId' },
    { name: 'Emp Name', prop: 'workerName' },
    { name: 'Qty', prop: 'qty', action: { footerSum: true, footerSumInDecimal: false, hAlign: 'center', dAlign: 'center' } },
    { name: 'Amount', prop: 'amount', action: { footerSum: true, footerSumInDecimal: true, decimal: true, hAlign: 'center', dAlign: 'end' } },
    {
      name: 'Average Amount', prop: 'avg', customColumn: (data) => {
        return common.printDecimal(data?.amount / data?.qty)
      },
      action: {
        footerSum: (data) => {
          return common.printDecimal(data?.reduce((sum, ele) => {
            return sum += ele?.amount / ele?.qty
          }, 0))
        },
        hAlign: 'center', dAlign: 'end'
      }
    },
  ],
  crystalDailyWorkStatement: [
    { name: 'Emp ID', prop: 'employeeId' },
    { name: 'Emp Name', prop: 'employeeName', action: { dAlign: "start" } },
    { name: 'OrderNo', prop: 'orderNo' },
    { name: 'Date', prop: 'date' },
    //{ name: 'ModalNo', prop: 'modalNo' },
    {
      name: 'Crystal Used', prop: 'crystalUsed',
      action: {
        footerSum: true,
        footerSumInDecimal: false,
        decimal: true,
        hAlign: 'center',
        dAlign: 'end'
      }
    },
    {
      name: 'Required Packets', prop: 'requiredPackets',
      action: {
        footerSum: true,
        footerSumInDecimal: true, decimal: true, hAlign: 'center', dAlign: 'end'
      }
    },
    {
      name: 'Release Packets', prop: 'releasePackets',
      customColumn: (data) => {
        if (data?.releasePackets > data?.requiredPackets)
          return <div className="bg-danger" style={{
            position: 'absolute',
            top: '0',
            left: '0',
            width: "100%",
            height: "100%",
            paddingRight: "8px",
            textAlign: "right",
            paddingTop: "0.5rem"
          }}>
            {data?.releasePackets}
          </div>
        else
          return data?.releasePackets
      },
      action: {
        footerSum: true,
        footerSumInDecimal: true, decimal: true, hAlign: 'center', dAlign: 'end'
      }
    },
    {
      name: 'Amount', prop: 'amount',
      action: {
        footerSum: true,
        footerSumInDecimal: true, decimal: true, hAlign: 'center', dAlign: 'end'
      }
    }
  ],
  printDailyStatusReport: ["Sr.", "Order No.", "Amount", "Delivered/Order Qty", "Paymant", "Balance", "Payment Mode", "Paid For"],
  dailyStatusReport: ["Sr.", "Order No.", "Amount", "Delivered/Order Qty", "Paymant", "Balance", "Payment Mode", "Paid For"],
  billingTaxReport: [
    { name: "Print", prop: 'print', action: { showCol: true } },
    { name: "Sr", prop: '', action: { showCol: true } },
    { name: "Date", prop: '', action: { showCol: true } },
    { name: "Invoice No", prop: '', action: { showCol: true } },
    { name: "Order No.", prop: '', action: { showCol: true } },
    { name: "Qty", prop: '', action: { showCol: true } },
    { name: "Total Amount", prop: '', action: { showCol: true } },
    { name: "Total VAT", prop: '', action: { showCol: true } },
    { name: "Gross Amount", prop: '', action: { showCol: true } },
    { name: "Paid Amount", prop: '', action: { showCol: true } },
    { name: "Balance Amount", prop: 'balanceAmount', action: { showCol: true } },
    { name: "Paid VAT", prop: '', action: { showCol: true } },
    { name: "Balance VAT", prop: 'balanceVat', action: { showCol: true } }
  ],
  addCrystalTrackingOut: [
    { name: "Action", prop: "print" },
    { name: "Sr.", prop: "sr" },
    { name: "Name", prop: "crystalName" },
    {
      name: "Packets", prop: "releasePacketQty", customColumn: (data, header) => {
        return common.printDecimal(data?.releasePacketQty);
      }
    },
    { name: "Pieces", prop: "releasePieceQty" },
    { name: "Crystal Price", prop: "crystalPrice", action: { decimal: true, footerSum: true, footerSumInDecimal: true } },
    {
      name: "Loose Pieces", prop: "loosePieces", customColumn: (data, header) => {
        return common.defaultIfEmpty(data?.loosePieces, 0);
      }
    },
    {
      name: "Total Pieces", prop: "totalPieces", customColumn: (data, header) => {
        return data?.releasePieceQty + common.defaultIfEmpty(data?.loosePieces, 0);
      }
    },
    {
      name: "Labour Charge", prop: "", customColumn: (data, header) => {
        return common.printDecimal(data?.crystalLabourCharge > 0 ? data?.crystalLabourCharge : data?.articalLabourCharge)
      }
    },
    {
      name: "Work Nature", prop: "isAlterWork", customColumn: (data, header) => {
        return data?.isAlterWork ? "Alter" : "Normal";
      }
    },
    // { name: "Return Packets", prop: "returnPacketQty" },
    // { name: "Return Pieces", prop: "returnPieceQty" },
    {
      name: "Release Date", prop: "releaseDate", customColumn: (data, header) => {
        return common.getHtmlDate(data?.releaseDate, "ddmmyyyy");
      }, action: { footerText: "" }
    },
    { name: "Completed By", prop: "completedById", action: { footerText: "" } }
  ],
  returnCrystalTrackingOut: [
    { name: "Action", prop: "print" },
    { name: "Sr.", prop: "sr" },
    { name: "Name", prop: "crystalName" },
    { name: "Packets", prop: "releasePacketQty" },
    { name: "Pieces", prop: "releasePieceQty" },
    { name: "Used Packets", prop: "usedPacket" },
    { name: "Used Pieces", prop: "usedPieces" },
    { name: "Return Packets", prop: "returnPacketQty" },
    { name: "Return Pieces", prop: "returnPieceQty" },
    { name: "Release/Return Date", prop: "returnDate", action: { footerText: "" } }
  ],
  masterCrystal: [
    { name: 'Id', prop: 'crystalId' },
    { name: 'Name', prop: 'name' },
    { name: 'Brand', prop: 'brand' },
    { name: 'Size', prop: 'size' },
    { name: 'Shape', prop: 'shape' },
    { name: 'Alert Qty', prop: 'alertQty' },
    { name: 'Is Artical', prop: 'isArtical', customColumn: (data) => { return data.isArtical ? "Yes" : "No" } },
    { name: 'Piece Per Packet', prop: 'qtyPerPacket' },
    { name: 'Price Per Packet', prop: 'pricePerPacket', action: { decimal: true } }
  ],
  masterAccess: [
    { name: 'Employee Name', prop: 'employeeName', action: { hAlign: "center", dAlign: "start" } },
    { name: 'Employee ID', prop: 'employeeId', action: { hAlign: "center", dAlign: "center" } },
    { name: 'Username', prop: 'userName', action: { hAlign: "center", dAlign: "start" } },
    { name: 'Password', prop: 'password', customColumn: (data) => { return '**********' }, action: { hAlign: "center", dAlign: "start" } },
    { name: 'Role', prop: 'roleName', action: { hAlign: "center", dAlign: "start" } },
  ],
  fabricBrand: [
    { name: 'Fabric Brand Name', prop: 'name', action: { hAlign: "center", dAlign: "center" } },
  ],
  fabricSaleMode: [
    { name: 'Name', prop: 'name', action: { hAlign: "center", dAlign: "center" } },
    { name: 'Code', prop: 'code', action: { hAlign: "center", dAlign: "center" } },
    { name: 'Min Sale Amount', prop: 'minSaleAmount', action: { hAlign: "center", dAlign: "center" } },
    { name: 'Max Sale AMount', prop: 'maxSaleAmount', action: { hAlign: "center", dAlign: "center" } },
    { name: 'Title', prop: 'title', action: { hAlign: "center", dAlign: "center" } },
  ],
  
  fabricDiscount: [
    { name: 'Name', prop: 'name', action: { hAlign: "center", dAlign: "center" } },
    { name: 'Code', prop: 'code', action: { hAlign: "center", dAlign: "center" } }
  ],
  fabricColor: [
    { name: 'Fabric Color Name', prop: 'colorName', action: { hAlign: "center", dAlign: "center" } },
    {
      name: 'Fabric Color Code', prop: 'colorCode', customColumn: customFabricColor, action: { hAlign: "center", dAlign: "end" }
    },
  ],
  fabricPrintType: [
    { name: 'Fabric Print Type', prop: 'name', action: { hAlign: "center", dAlign: "center" } }
  ],
  fabricType: [
    { name: 'Fabric Type Name', prop: 'name', action: { hAlign: "center", dAlign: "center" } },
  ],
  fabricSize: [
    { name: 'Fabric Size Name', prop: 'name', action: { hAlign: "center", dAlign: "center" } },
  ],
  fabricDetails: [
    { name: 'Brand', prop: 'brandName', action: { hAlign: "center", dAlign: "center" } },
    { name: 'Fabric Type', prop: 'fabricTypeName', action: { hAlign: "center", dAlign: "center" } },
    { name: 'Fabric Size', prop: 'fabricSizeName', action: { hAlign: "center", dAlign: "center" } },
    { name: 'Fabric Print Type', prop: 'fabricPrintType', action: { hAlign: "center", dAlign: "center" } },
    { name: 'Fabric Color', prop: 'fabricColorName',customColumn:customFabricColor, action: { hAlign: "center", dAlign: "center" } },
    { name: 'Low Alert Qty', prop: 'lowAlertQty', action: { hAlign: "center", dAlign: "center" } },
    { name: 'Fabric Code', prop: 'fabricCode', action: { hAlign: "center", dAlign: "center" } },
    { name: 'Fabric Image', prop: 'FabricImage',customColumn:customFabricImage, action: { hAlign: "center", dAlign: "center" } },
  ],
  fabricStockDetails: [
    { name: 'Fabric IMage', prop: 'fabricColorName',customColumn:customFabricImage, action: { hAlign: "center", dAlign: "center", footerText: "" } },
    { name: 'Brand', prop: 'brandName', action: { hAlign: "center", dAlign: "center", footerText: "" } },
    { name: 'Size', prop: 'fabricSizeName', action: { hAlign: "center", dAlign: "center", footerText: "" } },
    { name: 'Fabric Type', prop: 'fabricTypeName', action: { hAlign: "center", dAlign: "center", footerText: "" } },
    { name: 'F. Print Type', prop: 'fabricPrintType', action: { hAlign: "center", dAlign: "center", footerText: "" } },
    { name: 'Fabric Color', prop: 'fabricColorName',customColumn:customFabricColor, action: { hAlign: "center", dAlign: "center", footerText: "" } },
    { name: 'Low Alert Qty', prop: 'lowAlertQty', action: { hAlign: "center", dAlign: "center", footerText: "" } },
    { name: 'Fabric Code', prop: 'fabricCode', action: { hAlign: "center", dAlign: "center", footerText: "" } },
    { name: 'Selling Price', prop: 'sellPrice', action: { decimal: true, hAlign: "center", dAlign: "center", footerText: "" } },
    { name: 'Stock Status', prop: '', customColumn: customFabricStockStatusColumn, action: { hAlign: "center", dAlign: "center", footerText: "" } },
    { name: 'In Stock', prop: 'inQty', action: { hAlign: "center", dAlign: "center", footerSum: true, footerSumInDecimal: false } },
    { name: 'Out Stock', prop: 'outQty', action: { hAlign: "center", dAlign: "center", footerSum: true, footerSumInDecimal: false } },
    { name: 'Available Stock', prop: 'availableQty', action: { hAlign: "center", dAlign: "center", footerSum: true, footerSumInDecimal: false } },
  ],
  fabricLowStockDetails: [
    { name: 'Fabric IMage', prop: 'fabricColorName',customColumn:customFabricImage, action: { hAlign: "center", dAlign: "center", footerText: "" } },
    { name: 'Brand', prop: 'brandName', action: { hAlign: "center", dAlign: "center", footerText: "" } },
    { name: 'Size', prop: 'fabricSizeName', action: { hAlign: "center", dAlign: "center", footerText: "" } },
    { name: 'Fabric Type', prop: 'fabricTypeName', action: { hAlign: "center", dAlign: "center", footerText: "" } },
    { name: 'F. Print Type', prop: 'fabricPrintType', action: { hAlign: "center", dAlign: "center", footerText: "" } },
    { name: 'Fabric Color', prop: 'fabricColorName',customColumn:customFabricColor, action: { hAlign: "center", dAlign: "center", footerText: "" } },
    { name: 'Low Alert Qty', prop: 'lowAlertQty', action: { hAlign: "center", dAlign: "center", footerText: "" } },
    { name: 'Fabric Code', prop: 'fabricCode', action: { hAlign: "center", dAlign: "center", footerText: "" } },
    { name: 'Stock Status', prop: '', customColumn: customFabricStockStatusColumn, action: { hAlign: "center", dAlign: "center", footerText: "" } },
    { name: 'Available Stock', prop: 'availableQty', action: { hAlign: "center", dAlign: "center", footerSum: true, footerSumInDecimal: false } },
  ],
  fabricPurchase: [
    { name: 'Purchase No.', prop: 'purchaseNo', action: { hAlign: "center", dAlign: "center", footerText: "" } },
    { name: 'Invoice No.', prop: 'invoiceNo', action: { hAlign: "center", dAlign: "center", footerText: "" } },
    { name: 'Supplier', prop: 'trn',customColumn:(data)=>{ return data?.supplier?.companyName}, action: { hAlign: "center", dAlign: "center", footerText: "" } },
    { name: 'Contant No.', prop: 'trn',customColumn:(data)=>{ return data?.supplier?.contact}, action: { hAlign: "center", dAlign: "center", footerText: "" } },
    { name: 'TRN', prop: 'trn',customColumn:(data)=>{ return data?.supplier?.trn}, action: { hAlign: "center", dAlign: "center", footerText: "" } },
    { name: 'Purchase Date', prop: 'purchaseDate', action: { hAlign: "center", dAlign: "center", footerText: "" } },
    { name: 'Qty', prop: 'qty', action: { hAlign: "center", dAlign: "center", footerSum: true, footerSumInDecimal: false } },
    { name: 'Sub Total Amount', prop: 'subTotalAmount', action: { decimal: true, hAlign: "center", dAlign: "center", footerSum: true, footerSumInDecimal: true } },
    {
      name: 'VAT Amount', prop: 'vatAmount',
      customColumn: (data) => { return common.printDecimal(data["totalAmount"] - data["subTotalAmount"]) },
      action: {
        hAlign: "center",
        dAlign: "center",
        footerSum: (data) => {
          return common.printDecimal(data?.reduce((sum, ele) => {
            return sum += (ele["totalAmount"] - ele["subTotalAmount"]);
          }, 0));
        },
        footerSumInDecimal: true
      }
    },
    { name: 'Total Amount', prop: 'totalAmount', action: { decimal: true, hAlign: "center", dAlign: "center", footerSum: true, footerSumInDecimal: true } },
  ],
  fabricPurchaseDetails: [
    { name: 'F. Image', prop: '',customColumn:customFabricImage, action: { hAlign: "center", dAlign: "center", footerText: "" } },
    { name: 'Brand', prop: 'brandName', action: { hAlign: "center", dAlign: "center", footerText: "" } },
    { name: 'Size', prop: 'fabricSizeName', action: { hAlign: "center", dAlign: "center", footerText: "" } },
    { name: 'Fabric Type', prop: 'fabricTypeName', action: { hAlign: "center", dAlign: "center", footerText: "" } },
    { name: 'F. Print Type', prop: 'fabricPrintType', action: { hAlign: "center", dAlign: "center", footerText: "" } },
    { name: 'Fabric Color', prop: 'fabricColorName',customColumn:customFabricColor, action: { hAlign: "center", dAlign: "center", footerText: "" } },
    { name: 'Fabric Code', prop: 'fabricCode', action: { hAlign: "center", dAlign: "center", footerText: "" } }, 
    { name: 'Description', prop: 'description', action: { hAlign: "center", dAlign: "center", footerText: "" } },
    { name: 'Qty', prop: 'qty', action: { hAlign: "center", dAlign: "center", footerSum: true, footerSumInDecimal: false } },
    { name: 'Purcahse Price', prop: 'purchasePrice', action: { decimal: true, hAlign: "center", dAlign: "center", footerSum: true, footerSumInDecimal: true } },
    { name: 'Sell Price', prop: 'sellPrice', action: { decimal: true, hAlign: "center", dAlign: "center", footerSum: true, footerSumInDecimal: true } },
    { name: 'Sub Total Amount', prop: 'subTotalAmount', action: { decimal: true, hAlign: "center", dAlign: "center", footerSum: true, footerSumInDecimal: true } },
    { name: 'VAT Amount', prop: 'vatAmount', action: { decimal: true, hAlign: "center", dAlign: "center", footerSum: true, footerSumInDecimal: true } },
    { name: 'Total Amount', prop: 'totalAmount', action: { decimal: true, hAlign: "center", dAlign: "center", footerSum: true, footerSumInDecimal: true } },
  ],
  fabricSaleAddTableFormat: [
    { name: 'F. Image', prop: '',customColumn:customFabricImage, action: { hAlign: "center", dAlign: "center", footerText: "" } },
    { name: 'Brand', prop: 'fabricBrand', action: { hAlign: "center", dAlign: "center", footerText: "" } },
    { name: 'Size', prop: 'fabricSize', action: { hAlign: "center", dAlign: "center", footerText: "" } },
    { name: 'Fabric Type', prop: 'fabricType', action: { hAlign: "center", dAlign: "center", footerText: "" } },
    { name: 'F. Print Type', prop: 'fabricPrintType', action: { hAlign: "center", dAlign: "center", footerText: "" } },
    { name: 'Fabric Color', prop: 'fabricColor',customColumn:customFabricColor, action: { hAlign: "center", dAlign: "center", footerText: "" } },
    { name: 'Fabric Code', prop: 'fabricCode', action: { hAlign: "center", dAlign: "center", footerText: "" } }, 
    { name: 'Description', prop: 'description', action: { hAlign: "center", dAlign: "center", footerText: "" } },
    { name: 'Qty', prop: 'qty', action: { hAlign: "center", dAlign: "center", footerSum: true, footerSumInDecimal: false } },
    { name: 'Sale Price', prop: 'salePrice', action: { decimal: true, hAlign: "center", dAlign: "center", footerSum: true, footerSumInDecimal: true } },
    { name: 'Sub Total Amount', prop: 'subTotalAmount', action: { decimal: true, hAlign: "center", dAlign: "center", footerSum: true, footerSumInDecimal: true } },
    { name: 'VAT Amount', prop: 'vatAmount', action: { decimal: true, hAlign: "center", dAlign: "center", footerSum: true, footerSumInDecimal: true } },
    { name: 'Total Amount', prop: 'totalAmount', action: { decimal: true, hAlign: "center", dAlign: "center", footerSum: true, footerSumInDecimal: true } },
  ], 
  fabricSaleDetails: [
    { name: 'Invoice No.', prop: 'invoiceNo', action: { hAlign: "center", dAlign: "center", footerText: "" } },
    { name: 'Sale Date', prop: 'saleDate', action: { hAlign: "center", dAlign: "center", footerText: "" } },
    { name: 'Delivery Date', prop: 'deliveryDate', action: { hAlign: "center", dAlign: "center", footerText: "" } },
    { name: 'Customer', prop: 'customerName', action: { hAlign: "center", dAlign: "center", footerText: "" } },
    { name: 'Contact', prop: 'contact', action: { hAlign: "center", dAlign: "center", footerText: "" } },
    { name: 'Salesman', prop: 'salesmanName', action: { hAlign: "center", dAlign: "center", footerText: "" } },
    { name: 'Qty', prop: 'qty', action: { hAlign: "center", dAlign: "center", footerSum: true } },
    { name: 'Sub Total Amount', prop: 'subTotalAmount', action: { hAlign: "center", dAlign: "center",footerSum:true,decimal:true,footerSumInDecimal:true} },
    { name: 'VAT', prop: 'vatAmount', action: { hAlign: "center", dAlign: "center",footerSum:true,decimal:true,footerSumInDecimal:true } }, 
    { name: 'Total Amount', prop: 'totalAmount', action: { hAlign: "center", dAlign: "center", footerSum:true,decimal:true,footerSumInDecimal:true } },
    { name: 'Advance Amount', prop: 'advanceAmount', action: { hAlign: "center", dAlign: "center", footerSum:true,decimal:true,footerSumInDecimal:true } },
    { name: 'Discount Type', prop: 'discountType', action: { hAlign: "center", dAlign: "center",footerText:'' } },
    { name: 'Discount', prop: 'discount', action: { decimal: true, hAlign: "center", dAlign: "center", footerText:'' } },
    { name: 'Total After Discount', prop: 'totalAfterDiscount', action: { decimal: true, hAlign: "center", dAlign: "center", footerSum: true, footerSumInDecimal: true } },
    { name: 'Paid Amount', prop: 'paidAmount', action: { decimal: true, hAlign: "center", dAlign: "center", footerSum: true, footerSumInDecimal: true } },
    { name: 'Balance Amount', prop: 'balanceAmount', action: { decimal: true, hAlign: "center", dAlign: "center", footerSum: true, footerSumInDecimal: true } },
    { name: 'Payment Date', prop: 'paymentDate', action: { decimal: true, hAlign: "center", dAlign: "center", footerText:'' } },
    { name: 'Payment Mode', prop: 'paymentMode', action: { decimal: true, hAlign: "center", dAlign: "center", footerText:'' } },
  ],
  empSalaryPayment: [
    { name: "Employee Name", prop: "employeeName", action: { upperCase: true, hAlign: "center" } },
    { name: "Month", prop: "month", action: { upperCase: true, hAlign: "center" } },
    { name: "Year", prop: "year", action: { hAlign: "center" } },
    { name: "Amount", prop: "amount", action: { hAlign: "center", decimal: true } },
    { name: "EMI Amount", prop: "emiAmount", action: { hAlign: "center", decimal: true } },
    {
      name: "Total Salary", prop: "", customColumn: (data) => {
        return common.printDecimal(data?.amount - data?.emiAmount)
      }, action: { hAlign: "center", decimal: true }
    },
    {
      name: "Salary Paid", prop: "isPaid", action: { hAlign: "center", upperCase: true }
    },
    { name: "Paid On", prop: "paymentDate", action: { hAlign: "center" } },
    { name: "Payment Mode", prop: "paymentMode", action: { hAlign: "center" } },
    { name: "Paid By", prop: "paidByEmployee", action: { hAlign: "center" } },
    { name: "Note", prop: "note", action: { hAlign: "center" } }
  ],
  kandooraExpHead: [
    { name: 'Expense Head Name', prop: 'headName', action: { hAlign: "center", dAlign: "start" } },
    { name: 'Display Order', prop: 'displayOrder', action: { hAlign: "center", dAlign: "start" } }
  ],
  editPayment: [
    { name: 'Pay Date', prop: 'paymentDate', action: { hAlign: "center", dAlign: "start" } },
    { name: 'Pay Mode', prop: 'paymentMode', action: { hAlign: "center", dAlign: "start" } },
    { name: 'Paid Amount', prop: 'credit', action: { hAlign: "center", dAlign: "start" } },
    { name: 'Reason', prop: 'reason', action: { hAlign: "center", dAlign: "start" } },
    { name: 'First Advance', prop: 'isFirstAdvance', action: { replace: { true: "Yes", false: "No" }, hAlign: "center", dAlign: "start" } },
  ]
}

export { headerFormat, customOrderStatusColumn, remainingDaysBadge };